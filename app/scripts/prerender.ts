/**
 * After `vite build`: one static HTML page per language for home, every zone and every product
 * (title, description, canonical, hreflang, Open Graph, JSON-LD and readable content inside #root),
 * plus sitemap.xml, robots.txt, 404.html and a Google Merchant feed per language.
 * React replaces the static content on load; crawlers and AI agents read it as is.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { BOOK, CATS, money, pad, type Product } from '../src/data';
import { LANGS, applyLang, prefixFor, t, type Lang } from '../src/i18n';
import { hrefFor, type Route } from '../src/routes';
import { VARIANTS } from '../src/shopify';
import { GUIDES, GUIDES_HUB, type Guide } from '../src/guides';
import { PRODUCT_BY_ID } from '../src/data';

const SITE = 'https://survivalbase.net';
const DIST = join(import.meta.dirname, '..', 'dist');
const TEMPLATE = readFileSync(join(DIST, 'index.html'), 'utf8');
const LOGO = SITE + '/survivalbase-logo.png';
const SHARE = SITE + '/social/share-image-1200x630.png';
const TODAY = new Date().toISOString().slice(0, 10);
/** IndexNow key (Bing, Yandex, Seznam…): served at /<key>.txt and sent with every ping. Not a secret. */
export const INDEXNOW_KEY = 'b7c4e2a91f0d4c6e8a3b5d7f9e1c2a40';

/** English search titles for the zones: the words people type, not the in-game names. */
const ZONE_TITLE_EN: Record<string, string> = {
  energy: 'Power Cut Kit: Power Stations, Solar Panels & Power Banks',
  water: 'Emergency Water Storage & Water Filters',
  food: 'Foraging & Grow-Your-Own Survival Gear',
  comms: 'Wind-Up Radios, Walkie-Talkies & Off-Grid Comms',
  shelter: 'Emergency Shelter: Tents, Tarps & Bivvy Bags',
  fire: 'Fire Starters, Wood Stoves & Emergency Warmth',
  nav: 'Compass, Maps & Emergency Signalling',
  storage: 'Long-Term Food Storage: Mylar Bags & Airtight Boxes',
  medic: 'First Aid Kits for Home, Car & Grab Bag',
  tools: 'Headlamps, Multi-Tools & Survival Tools',
  security: 'Solar Security Lights, Alarms & Faraday Bags',
};

/** EU countries the shop ships to at the flat rate set in Shopify. */
const SHIP_TO = ['BE', 'NL', 'LU', 'FR', 'DE', 'AT', 'IT', 'ES', 'PT', 'IE'];
const SHIPPING_EUR = 4.9;

const GOOGLE_CATEGORY: Record<string, string> = {
  energy: 'Hardware > Power & Electrical Supplies',
  water: 'Sporting Goods > Outdoor Recreation > Camping & Hiking',
  food: 'Home & Garden > Lawn & Garden > Gardening',
  comms: 'Electronics > Communications',
  shelter: 'Sporting Goods > Outdoor Recreation > Camping & Hiking > Tents',
  fire: 'Sporting Goods > Outdoor Recreation > Camping & Hiking',
  nav: 'Sporting Goods > Outdoor Recreation > Camping & Hiking',
  storage: 'Home & Garden > Kitchen & Dining > Food Storage',
  medic: 'Health & Beauty > Health Care > First Aid',
  tools: 'Hardware > Tools',
  security: 'Home & Garden > Business & Home Security',
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clip = (s: string, n = 158) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…');
const abs = (r: Route, lang: Lang) => SITE + hrefFor(r, lang);
const sellable = (p: Product) => p.price !== null && !!p.image && VARIANTS[p.id] !== undefined;
const img = (src: string) => (src.includes('cdn.shopify.com') ? src + (src.includes('?') ? '&' : '?') + 'width=1200' : src);

interface Page { route: Route; title: string; description: string; image: string; body: string; jsonld: object[]; type: string; enOnly?: boolean }

function offer(p: Product, url: string) {
  return {
    '@type': 'Offer', url, price: p.price!.toFixed(2), priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/NewCondition',
    seller: { '@type': 'Organization', name: 'SurvivalBase' },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', value: SHIPPING_EUR.toFixed(2), currency: 'EUR' },
      shippingDestination: SHIP_TO.map(c => ({ '@type': 'DefinedRegion', addressCountry: c })),
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
        transitTime: { '@type': 'QuantitativeValue', minValue: 5, maxValue: 12, unitCode: 'DAY' },
      },
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy', applicableCountry: SHIP_TO,
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow', merchantReturnDays: 14,
      returnMethod: 'https://schema.org/ReturnByMail', returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
    },
  };
}

function breadcrumb(items: [string, string][]) {
  return { '@type': 'BreadcrumbList', itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) };
}

function productList(items: Product[], lang: Lang) {
  return '<ul>' + items.map(p => `<li><a href="${hrefFor({ view: 'product', id: p.id }, lang)}">${esc(p.name)}</a> · ${esc(money(p.price))} · ${esc(p.tagline)}</li>`).join('') + '</ul>';
}

function zoneNav(lang: Lang) {
  return '<nav><ul>' + CATS.map(c => `<li><a href="${hrefFor({ view: 'cat', id: c.id }, lang)}">${esc(c.name)}</a></li>`).join('') + '</ul></nav>';
}

function guideNav() {
  return '<nav aria-label="Guides"><h2>Emergency readiness guides</h2><ul>'
    + GUIDES.map(g => `<li><a href="${hrefFor({ view: 'guide', id: g.id })}">${esc(g.h1)}</a></li>`).join('') + '</ul></nav>';
}

function guidePage(g: Guide): Page {
  const url = abs({ view: 'guide', id: g.id }, 'en');
  const items = g.products.map(id => PRODUCT_BY_ID[id]).filter(Boolean);
  const body = `<p><a href="/guide/">Emergency readiness guides</a></p><article><h1>${esc(g.h1)}</h1><p><strong>${esc(g.answer)}</strong></p>`
    + g.sections.map(s => `<section><h2>${esc(s.h2)}</h2>${s.body.map(b => `<p>${esc(b)}</p>`).join('')}`
      + (s.list ? `<ul>${s.list.map(li => `<li>${esc(li)}</li>`).join('')}</ul>` : '') + '</section>').join('')
    + `<section><h2>Questions people ask</h2>${g.faq.map(f => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}</section>`
    + `<p>Sources: ${g.sources.map(([l, u]) => `<a href="${u}">${esc(l)}</a>`).join(' · ')}. Updated ${g.updated}.</p></article>`
    + `<h2>What we'd put in it</h2>` + productList(items, 'en') + guideNav();
  return {
    route: { view: 'guide', id: g.id }, type: 'article', enOnly: true,
    title: g.title, description: clip(g.description), image: items.find(p => p.image)?.image ?? SHARE, body,
    jsonld: [
      { '@type': 'Article', headline: g.h1, description: g.description, url, inLanguage: 'en', dateModified: g.updated, datePublished: g.updated,
        author: { '@id': SITE + '/#org' }, publisher: { '@id': SITE + '/#org' }, mainEntityOfPage: url,
        citation: g.sources.map(([, u]) => u) },
      { '@type': 'FAQPage', mainEntity: g.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      breadcrumb([['SurvivalBase', SITE + '/'], ['Guides', SITE + '/guide/'], [g.h1, url]]),
    ],
  };
}

function guidePages(): Page[] {
  const hub: Page = {
    route: { view: 'guides' }, type: 'website', enOnly: true,
    title: GUIDES_HUB.title, description: clip(GUIDES_HUB.description), image: SHARE,
    body: `<h1>${esc(GUIDES_HUB.h1)}</h1><p>${esc(GUIDES_HUB.intro)}</p><ul>`
      + GUIDES.map(g => `<li><a href="${hrefFor({ view: 'guide', id: g.id })}">${esc(g.h1)}</a>: ${esc(g.description)}</li>`).join('') + '</ul>',
    jsonld: [
      { '@type': 'CollectionPage', name: GUIDES_HUB.h1, url: SITE + '/guide/', inLanguage: 'en',
        mainEntity: { '@type': 'ItemList', itemListElement: GUIDES.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: abs({ view: 'guide', id: g.id }, 'en'), name: g.h1 })) } },
      breadcrumb([['SurvivalBase', SITE + '/'], ['Guides', SITE + '/guide/']]),
    ],
  };
  return [hub, ...GUIDES.map(guidePage)];
}

function pages(lang: Lang): Page[] {
  const home = abs({ view: 'home' }, lang);
  const en = lang === 'en';
  const out: Page[] = [{
    route: { view: 'home' }, type: 'website',
    title: en ? 'Emergency Kits, Wind-Up Radios & Power Cut Supplies · SurvivalBase' : 'SurvivalBase · ' + t('home.h1'),
    description: clip(en
      ? 'Be ready for 3 days without power, water or signal: 72-hour kits, wind-up radios, power banks, water storage and first aid. ' + t('home.h1')
      : t('home.h1') + ' ' + t('home.intro')),
    image: SHARE,
    body: `<h1>${esc(t('home.h1'))}</h1><p>${esc(t('home.intro'))}</p>` + zoneNav(lang)
      + `<p>${esc(BOOK.name)} · €${BOOK.price}</p>` + guideNav(),
    jsonld: [
      { '@type': 'Organization', '@id': SITE + '/#org', name: 'SurvivalBase', url: SITE + '/', logo: LOGO, email: 'contact@survivalbase.net',
        address: { '@type': 'PostalAddress', streetAddress: 'Square de Meeûs 35', postalCode: '1000', addressLocality: 'Bruxelles', addressCountry: 'BE' } },
      { '@type': 'WebSite', '@id': SITE + '/#site', name: 'SurvivalBase', url: home, inLanguage: lang, publisher: { '@id': SITE + '/#org' } },
    ],
  }];
  for (const c of CATS) {
    const url = abs({ view: 'cat', id: c.id }, lang);
    out.push({
      route: { view: 'cat', id: c.id }, type: 'website',
      title: (en && ZONE_TITLE_EN[c.id] ? ZONE_TITLE_EN[c.id] : c.name) + ' · SurvivalBase',
      description: clip(c.blurb + ' ' + c.items.slice(0, 4).map(p => p.name).join(', ') + '.'),
      image: c.items.find(p => p.image)?.image ?? SHARE,
      body: `<p>${esc(t('cat.kicker', { where: t(`where.${c.where}`).toUpperCase(), n: pad(c.ch) }))}</p><h1>${esc(c.name)}</h1><p>${esc(c.blurb)}</p>`
        + `<h2>${esc(t('cat.onShelf'))}</h2>` + productList(c.items, lang) + zoneNav(lang) + guideNav(),
      jsonld: [
        { '@type': 'CollectionPage', name: c.name, description: c.blurb, url, inLanguage: lang,
          mainEntity: { '@type': 'ItemList', itemListElement: c.items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs({ view: 'product', id: p.id }, lang), name: p.name })) } },
        breadcrumb([['SurvivalBase', home], [c.name, url]]),
      ],
    });
    for (const p of c.items) {
      const purl = abs({ view: 'product', id: p.id }, lang);
      const specs = p.spec.split(' · ');
      out.push({
        route: { view: 'product', id: p.id }, type: 'product',
        title: `${p.name} · ${c.name} · SurvivalBase`,
        description: clip(p.tagline + ' ' + specs.join(', ') + '.'),
        image: p.image ?? LOGO,
        body: `<p><a href="${hrefFor({ view: 'cat', id: c.id }, lang)}">${esc(c.name)}</a></p><h1>${esc(p.name)}</h1><p>${esc(p.tagline)}</p>`
          + `<p>${esc(money(p.price))}</p><ul>${specs.map(s => `<li>${esc(s)}</li>`).join('')}</ul>`
          + (p.image ? `<img src="${esc(img(p.image))}" alt="${esc(p.name)}" width="600" height="600">` : '')
          + `<h2>${esc(t('product.sameShelf'))}</h2>` + productList(c.items.filter(x => x.id !== p.id), lang),
        jsonld: [
          { '@type': 'Product', name: p.name, description: p.tagline + ' ' + specs.join(', '), sku: p.id, category: c.name, url: purl,
            image: (p.gallery ?? (p.image ? [p.image] : [])).map(img),
            additionalProperty: specs.map(s => ({ '@type': 'PropertyValue', name: 'Spec', value: s })),
            ...(sellable(p) ? { offers: offer(p, purl) } : {}) },
          breadcrumb([['SurvivalBase', home], [c.name, abs({ view: 'cat', id: c.id }, lang)], [p.name, purl]]),
        ],
      });
    }
  }
  return out;
}

function alternates(r: Route, enOnly = false) {
  if (enOnly) return `<link rel="alternate" hreflang="en" href="${abs(r, 'en')}"><link rel="alternate" hreflang="x-default" href="${abs(r, 'en')}">`;
  return LANGS.map(l => `<link rel="alternate" hreflang="${l.hreflang}" href="${abs(r, l.code)}">`).join('')
    + `<link rel="alternate" hreflang="x-default" href="${abs(r, 'en')}">`;
}

function html(pg: Page, lang: Lang, noindex = false) {
  const url = abs(pg.route, lang);
  const locale = LANGS.find(l => l.code === lang)!.locale;
  const head = [
    `<title>${esc(pg.title)}</title>`,
    `<meta name="description" content="${esc(pg.description)}">`,
    noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">` + alternates(pg.route, pg.enOnly),
    `<meta property="og:type" content="${pg.type}"><meta property="og:site_name" content="SurvivalBase"><meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(pg.title)}"><meta property="og:description" content="${esc(pg.description)}">`,
    `<meta property="og:image" content="${esc(img(pg.image))}"><meta property="og:locale" content="${locale}">`,
    pg.enOnly ? '' : LANGS.filter(l => l.code !== lang).map(l => `<meta property="og:locale:alternate" content="${l.locale}">`).join(''),
    '<meta name="twitter:card" content="summary_large_image">',
    `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': pg.jsonld }).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
  return TEMPLATE
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace('</head>', `  ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"><main>${pg.body}</main></div>`);
}

function write(path: string, content: string) {
  const file = join(DIST, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function feed(lang: Lang) {
  const items = CATS.flatMap(c => c.items.filter(sellable).map(p => {
    const extra = (p.gallery ?? []).filter(src => src !== p.image).slice(0, 10);
    return `<item>
<g:id>${p.id}</g:id>
<g:item_group_id>${p.id}</g:item_group_id>
<title>${esc(clip(p.name + ' · ' + p.tagline, 150))}</title>
<description>${esc(p.tagline + ' ' + p.spec.split(' · ').join(', ') + '.')}</description>
<link>${abs({ view: 'product', id: p.id }, lang)}</link>
<g:image_link>${esc(img(p.image!))}</g:image_link>
${extra.map(src => `<g:additional_image_link>${esc(img(src))}</g:additional_image_link>`).join('\n')}
<g:availability>in_stock</g:availability>
<g:price>${p.price!.toFixed(2)} EUR</g:price>
<g:condition>new</g:condition>
<g:identifier_exists>no</g:identifier_exists>
<g:google_product_category>${esc(GOOGLE_CATEGORY[c.id] ?? 'Sporting Goods > Outdoor Recreation')}</g:google_product_category>
<g:product_type>${esc('SurvivalBase > ' + c.name)}</g:product_type>
${SHIP_TO.map(cc => `<g:shipping><g:country>${cc}</g:country><g:price>${SHIPPING_EUR.toFixed(2)} EUR</g:price><g:min_handling_time>1</g:min_handling_time><g:max_handling_time>3</g:max_handling_time><g:min_transit_time>5</g:min_transit_time><g:max_transit_time>12</g:max_transit_time></g:shipping>`).join('\n')}
</item>`;
  }));
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>SurvivalBase (${lang})</title>
<link>${abs({ view: 'home' }, lang)}</link>
<description>${esc(t('home.h1'))}</description>
${items.join('\n')}
</channel>
</rss>
`;
}

const urls: string[] = [];
let count = 0;
for (const { code } of LANGS) {
  applyLang(code);
  for (const pg of pages(code)) {
    const path = hrefFor(pg.route, code);
    write(join(path, 'index.html'), html(pg, code));
    count++;
    if (code === 'en') {
      urls.push(`<url><loc>${abs(pg.route, 'en')}</loc><lastmod>${TODAY}</lastmod>`
        + LANGS.map(l => `<xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${abs(pg.route, l.code)}"/>`).join('')
        + `<xhtml:link rel="alternate" hreflang="x-default" href="${abs(pg.route, 'en')}"/></url>`);
    }
  }
  write(`feeds/google-${code}.xml`, feed(code));
}
// Guides: English only, one sitemap entry each with en + x-default.
applyLang('en');
const guideUrls: string[] = [];
for (const pg of guidePages()) {
  write(join(hrefFor(pg.route, 'en'), 'index.html'), html(pg, 'en'));
  count++;
  const u = abs(pg.route, 'en');
  guideUrls.push(`<url><loc>${u}</loc><lastmod>${TODAY}</lastmod><xhtml:link rel="alternate" hreflang="en" href="${u}"/><xhtml:link rel="alternate" hreflang="x-default" href="${u}"/></url>`);
}
// Every language version is listed (each <url> carries the full set of alternates, as Google asks).
const all = LANGS.flatMap(l => urls.map(u => u.replace(/<loc>[^<]*<\/loc>/, m => m.replace(SITE + '/', SITE + prefixFor(l.code) + '/'))));
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...guideUrls, ...all].join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);
write(`${INDEXNOW_KEY}.txt`, INDEXNOW_KEY);
// Plain-text map of the site for AI assistants (llmstxt.org).
write('llms.txt', `# SurvivalBase

> Emergency-readiness and off-grid gear shop based in Brussels: kits and products to manage 3 days without power, water or signal (the "Be Ready" checklist), plus Survival Base, the guide (book, €49). Prices in EUR.

## Guides
${GUIDES.map(g => `- [${g.h1}](${abs({ view: 'guide', id: g.id }, 'en')}): ${g.description}`).join('\n')}

## Zones (product categories)
${CATS.map(c => `- [${ZONE_TITLE_EN[c.id] ?? c.name}](${abs({ view: 'cat', id: c.id }, 'en')})`).join('\n')}

## Key products
${['comms-0', 'comms-1', 'energy-4', 'energy-6', 'energy-5', 'water-6', 'water-0', 'medic-4', 'energy-0'].map(id => PRODUCT_BY_ID[id]).map(p => `- [${p.name}](${abs({ view: 'product', id: p.id }, 'en')}): ${p.tagline} ${money(p.price)}`).join('\n')}
`);
// GitHub Pages serves this for unknown addresses; the app reads the path and shows the right page or home.
applyLang('en');
write('404.html', html(pages('en')[0], 'en', true));
console.log(`prerender: ${count} pages, ${all.length} sitemap entries, ${LANGS.length} feeds, ${CATS.flatMap(c => c.items).filter(sellable).length} feed items per language`);
