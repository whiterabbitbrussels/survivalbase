// Writes src/i18n/content.en.json: every translatable catalogue string, keyed by stable ids.
import { writeFileSync } from 'node:fs';
import { CATS, BUNDLES, BOOK } from '../src/data';

const out: Record<string, Record<string, string>> = { zones: {}, products: {}, kits: {}, book: {} };
for (const c of CATS) {
  out.zones[c.id + '.name'] = c.name;
  out.zones[c.id + '.blurb'] = c.blurb;
  for (const p of c.items) {
    out.products[p.id + '.name'] = p.name;
    out.products[p.id + '.tagline'] = p.tagline;
    out.products[p.id + '.spec'] = p.spec;
  }
}
for (const b of BUNDLES) {
  out.kits[b.id + '.name'] = b.name;
  out.kits[b.id + '.blurb'] = b.blurb;
}
out.book['name'] = BOOK.name;
writeFileSync(new URL('../src/i18n/content.en.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.log(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, Object.keys(v).length])));
