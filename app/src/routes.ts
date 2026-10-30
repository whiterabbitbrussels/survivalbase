import { CAT_BY_ID, PRODUCT_BY_ID } from './data';
import { currentLang, prefixFor, type Lang } from './i18n';

export type Route = { view: 'home' } | { view: 'cat'; id: string } | { view: 'product'; id: string };

/** "/fr/zone/water/" → zone page; old "#/zone/water" links still resolve. */
export function parseLocation(path: string, hash = ''): Route {
  const parts = path.split('/').filter(Boolean);
  if (parts[0] && parts[0] === currentLang()) parts.shift();
  const legacy = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [kind, id] = parts.length ? parts : legacy;
  if (kind === 'zone' && CAT_BY_ID[id]) return { view: 'cat', id };
  if (kind === 'product' && PRODUCT_BY_ID[id]) return { view: 'product', id };
  return { view: 'home' };
}

export function hrefFor(r: Route, lang: Lang = currentLang()): string {
  const base = prefixFor(lang) + '/';
  return r.view === 'home' ? base : `${base}${r.view === 'cat' ? 'zone' : 'product'}/${r.id}/`;
}
