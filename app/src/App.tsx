import { useCallback, useEffect, useRef, useState } from 'react';
import { BOOK, CAT_BY_ID, PRODUCT_BY_ID, isPlace, type CartLine, type Product } from './data';
import { LANGS, currentLang, t } from './i18n';
import { hrefFor, parseLocation, type Route } from './routes';
import { useWalker } from './useWalker';
import { LogoMark, Wordmark } from './components/Logo';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';

const WALK_SPEED = 450; // scene px per second

const CART_KEY = 'sb-stash';
const POLICIES = 'https://shop.survivalbase.net/policies/';
const LEGAL = [
  ['footer.shipping', 'shipping-policy'], ['footer.returns', 'refund-policy'], ['footer.privacy', 'privacy-policy'],
  ['footer.terms', 'terms-of-service'], ['footer.legal', 'legal-notice'], ['footer.contact', 'contact-information'],
] as const;

const here = () => parseLocation(window.location.pathname, window.location.hash);

function loadCart(): CartLine[] {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') as { id: string; q: number }[];
    // Re-read names and prices from the catalogue, so a stale stash never checks out at an old price.
    return saved.flatMap(({ id, q }) => {
      const p = id === BOOK.id ? BOOK : PRODUCT_BY_ID[id];
      return p && p.price !== null ? Array.from({ length: q }, () => ({ id, name: p.name, price: p.price as number })) : [];
    });
  } catch { return []; }
}

export default function App() {
  const [route, setRoute] = useState<Route>(here);
  const [cart, setCart] = useState<CartLine[]>(loadCart);
  const [night, setNight] = useState(() => new URLSearchParams(window.location.search).get('mode') === 'blackout');
  const [panel, setPanel] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number>();
  const navTimer = useRef<number>();

  useEffect(() => {
    // Old "#/zone/x" links: move them to the real address.
    if (window.location.hash.startsWith('#/')) window.history.replaceState(null, '', hrefFor(here()));
    const onPop = () => { setPanel(null); setRoute(here()); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const counts = new Map<string, number>();
    cart.forEach(c => counts.set(c.id, (counts.get(c.id) ?? 0) + 1));
    try { localStorage.setItem(CART_KEY, JSON.stringify([...counts].map(([id, q]) => ({ id, q })))); } catch { /* private mode */ }
  }, [cart]);

  useEffect(() => {
    const name = route.view === 'cat' ? CAT_BY_ID[route.id].name : route.view === 'product' ? PRODUCT_BY_ID[route.id].name : null;
    document.title = name ? name + ' · SurvivalBase' : 'SurvivalBase · ' + t('home.h1');
  }, [route]);

  useEffect(() => () => { window.clearTimeout(toastTimer.current); window.clearTimeout(navTimer.current); }, []);

  const navigate = useCallback((r: Route) => {
    setPanel(null);
    const href = hrefFor(r);
    if (window.location.pathname !== href) window.history.pushState(null, '', href);
    setRoute(r);
    window.scrollTo(0, 0);
  }, []);

  const openCat = useCallback((id: string) => navigate({ view: 'cat', id }), [navigate]);
  const openProduct = useCallback((id: string) => navigate({ view: 'product', id }), [navigate]);
  const goHome = useCallback(() => navigate({ view: 'home' }), [navigate]);

  // Arriving at a category zone opens its shelf page; library and stash open a panel in the scene.
  const walker = useWalker(WALK_SPEED, id => {
    if (isPlace(id)) setPanel(id);
    else navTimer.current = window.setTimeout(() => openCat(id), 200);
  });

  const walkerWalkTo = walker.walkTo;
  const walkTo = useCallback((id: string) => { setPanel(null); walkerWalkTo(id); }, [walkerWalkTo]);

  const goHomeThen = (id: string) => {
    goHome();
    window.setTimeout(() => walkTo(id), 60);
  };

  const flash = useCallback((msg: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const add = useCallback((p: CartLine | Product, n = 1) => {
    if (p.price === null) return; // not sellable until the supplier price is confirmed
    const line = { id: p.id, name: p.name, price: p.price };
    setCart(c => c.concat(Array.from({ length: n }, () => line)));
    flash(t('toast.added', { name: p.name + (n > 1 ? ' ×' + n : '') }));
  }, [flash]);

  const addBook = () => add(BOOK);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', padding: '14px 24px', borderBottom: '2px solid var(--ink)', background: 'var(--paper)', position: 'sticky', top: 0, zIndex: 40 }}>
        <a href={hrefFor({ view: 'home' })} onClick={e => { e.preventDefault(); goHome(); }} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: 'inherit', textDecoration: 'none' }} aria-label={t('nav.home')}>
          <LogoMark />
          <Wordmark />
        </a>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500 }}>
          <button onClick={goHome} className="link-btn nav-btn">{t('nav.base')}</button>
          <button onClick={() => goHomeThen('library')} className="link-btn nav-btn">{t('nav.guide')}</button>
          <button onClick={() => setNight(n => !n)} className="btn btn-ink">{night ? t('nav.blackout') : t('nav.daylight')}</button>
          <button onClick={() => goHomeThen('stash')} className="btn btn-orange btn-shadow" style={{ padding: '7px 12px' }}>{t('nav.stash', { n: cart.length })}</button>
        </nav>
      </header>

      {route.view === 'home' && (
        <HomePage
          night={night}
          cart={cart}
          walker={walker}
          panel={panel}
          onClosePanel={() => setPanel(null)}
          onZone={walkTo}
          onAdd={add}
          onOpenProduct={openProduct}
          onFlash={flash}
        />
      )}
      {route.view === 'cat' && (
        <CategoryPage cat={CAT_BY_ID[route.id]} onHome={goHome} onAddBook={addBook} onOpenProduct={openProduct} onAdd={p => add(p)} />
      )}
      {route.view === 'product' && (
        <ProductPage key={route.id} product={PRODUCT_BY_ID[route.id]} onHome={goHome} onOpenCat={openCat} onOpenProduct={openProduct} onAdd={add} onAddBook={addBook} />
      )}

      <footer style={{ borderTop: '2px solid var(--ink)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'var(--mono)', fontSize: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span>SURVIVALBASE.NET</span><span>{t('footer.tagline')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <nav style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {LEGAL.map(([key, slug]) => <a key={slug} href={POLICIES + slug} style={{ color: 'inherit' }}>{t(key)}</a>)}
          </nav>
          <nav aria-label={t('footer.language')} style={{ display: 'flex', gap: 10 }}>
            {LANGS.map(l => (
              <a key={l.code} href={hrefFor(route, l.code)} hrefLang={l.hreflang} lang={l.hreflang} aria-current={l.code === currentLang() ? 'true' : undefined}
                style={{ color: 'inherit', fontWeight: l.code === currentLang() ? 700 : 400, textDecoration: l.code === currentLang() ? 'underline' : 'none' }}>{l.label}</a>
            ))}
          </nav>
        </div>
      </footer>

      {toast && (
        <div style={{ position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 60 }} role="status">
          <div style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '12px 18px', fontFamily: 'var(--mono)', fontSize: 13, border: '2px solid var(--orange)', animation: 'sbtoast .2s ease-out' }}>{toast}</div>
        </div>
      )}
    </div>
  );
}
