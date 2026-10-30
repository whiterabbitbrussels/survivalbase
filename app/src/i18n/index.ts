import { BOOK, BUNDLES, CATS, LABELS } from '../data';
import de from './content.de.json';
import es from './content.es.json';
import fr from './content.fr.json';
import it from './content.it.json';
import nl from './content.nl.json';
import { UI, type UiKey } from './ui';

export type Lang = 'en' | 'fr' | 'nl' | 'it' | 'es' | 'de';

/** English lives at the site root; every other language under its own prefix. */
export const LANGS: { code: Lang; label: string; hreflang: string; locale: string }[] = [
  { code: 'en', label: 'EN', hreflang: 'en', locale: 'en_GB' },
  { code: 'fr', label: 'FR', hreflang: 'fr', locale: 'fr_BE' },
  { code: 'nl', label: 'NL', hreflang: 'nl', locale: 'nl_BE' },
  { code: 'it', label: 'IT', hreflang: 'it', locale: 'it_IT' },
  { code: 'es', label: 'ES', hreflang: 'es', locale: 'es_ES' },
  { code: 'de', label: 'DE', hreflang: 'de', locale: 'de_DE' },
];

type Content = { zones: Record<string, string>; products: Record<string, string>; kits: Record<string, string>; book: Record<string, string> };
const CONTENT: Partial<Record<Lang, Content>> = { fr, nl, it, es, de };

export const prefixFor = (lang: Lang) => (lang === 'en' ? '' : '/' + lang);

export function langFromPath(path: string): Lang {
  const first = path.split('/')[1];
  return LANGS.some(l => l.code === first && first !== 'en') ? (first as Lang) : 'en';
}

let current: Lang = 'en';
export const currentLang = () => current;

/** UI string in the current language, with {name} placeholders filled in. */
export function t(key: UiKey, vars: Record<string, string | number> = {}): string {
  const s = UI[current][key] ?? UI.en[key];
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

// English originals, captured once so the catalogue can be switched back and forth (the prerender does all languages in one run).
const ORIGINAL = {
  cats: CATS.map(c => ({ name: c.name, blurb: c.blurb, items: c.items.map(p => ({ name: p.name, tagline: p.tagline, spec: p.spec })) })),
  kits: BUNDLES.map(b => ({ name: b.name, blurb: b.blurb })),
  book: BOOK.name,
};

/** Switch UI strings and the shared catalogue objects to one language. */
export function applyLang(lang: Lang) {
  current = lang;
  LABELS.priceSoon = t('price.soon');
  const c = CONTENT[lang];
  const pick = (group: Record<string, string> | undefined, key: string, fallback: string) => group?.[key] ?? fallback;
  CATS.forEach((cat, i) => {
    const o = ORIGINAL.cats[i];
    cat.name = pick(c?.zones, cat.id + '.name', o.name);
    cat.blurb = pick(c?.zones, cat.id + '.blurb', o.blurb);
    cat.items.forEach((p, j) => {
      const op = o.items[j];
      p.name = pick(c?.products, p.id + '.name', op.name);
      p.tagline = pick(c?.products, p.id + '.tagline', op.tagline);
      p.spec = pick(c?.products, p.id + '.spec', op.spec);
    });
  });
  BUNDLES.forEach((b, i) => {
    b.name = pick(c?.kits, b.id + '.name', ORIGINAL.kits[i].name);
    b.blurb = pick(c?.kits, b.id + '.blurb', ORIGINAL.kits[i].blurb);
  });
  BOOK.name = pick(c?.book, 'name', ORIGINAL.book);
}
