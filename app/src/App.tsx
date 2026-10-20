import { useCallback, useEffect, useRef, useState } from 'react';
import { BOOK, CAT_BY_ID, PRODUCT_BY_ID, isPlace, type CartLine, type Product } from './data';
import { useWalker } from './useWalker';
import { LogoMark, Wordmark } from './components/Logo';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';

const WALK_SPEED = 450; // scene px per second

type Route = { view: 'home' } | { view: 'cat'; id: string } | { view: 'product'; id: string };

function parseHash(hash: string): Route {
  const [, kind, id] = hash.replace(/^#/, '').split('/');
  if (kind === 'zone' && CAT_BY_ID[id]) return { view: 'cat', id };
  if (kind === 'product' && PRODUCT_BY_ID[id]) return { view: 'product', id };
  return { view: 'home' };
}

const hrefFor = (r: Route) => (r.view === 'home' ? '#/' : `#/${r.view === 'cat' ? 'zone' : 'product'}/${r.id}`);

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const [cart, setCart] = useState<CartLine[]>([]);
  const [night, setNight] = useState(() => new URLSearchParams(window.location.search).get('mode') === 'blackout');
  const [panel, setPanel] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number>();
  const navTimer = useRef<number>();

  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => () => { window.clearTimeout(toastTimer.current); window.clearTimeout(navTimer.current); }, []);

  const navigate = useCallback((r: Route) => {
    setPanel(null);
    const href = hrefFor(r);
    if (window.location.hash !== href) window.location.hash = href;
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
    const line = { id: p.id, name: p.name, price: p.price };
    setCart(c => c.concat(Array.from({ length: n }, () => line)));
    flash('Added to stash: ' + p.name + (n > 1 ? ' ×' + n : ''));
  }, [flash]);

  const addBook = () => add(BOOK);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', padding: '14px 24px', borderBottom: '2px solid var(--ink)', background: 'var(--paper)', position: 'sticky', top: 0, zIndex: 40 }}>
        <a href="#/" onClick={e => { e.preventDefault(); goHome(); }} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: 'inherit', textDecoration: 'none' }} aria-label="SurvivalBase home">
          <LogoMark />
          <Wordmark />
        </a>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 500 }}>
          <button onClick={goHome} className="link-btn nav-btn">BASE</button>
          <button onClick={() => goHomeThen('library')} className="link-btn nav-btn">THE GUIDE · $49</button>
          <button onClick={() => setNight(n => !n)} className="btn btn-ink">{night ? '◑ BLACKOUT' : '◐ DAYLIGHT'}</button>
          <button onClick={() => goHomeThen('stash')} className="btn btn-orange btn-shadow" style={{ padding: '7px 12px' }}>STASH · {cart.length}</button>
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

      <footer style={{ borderTop: '2px solid var(--ink)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', fontFamily: 'var(--mono)', fontSize: 12 }}>
        <span>SURVIVALBASE.NET</span><span>Ships while roads still exist.</span>
      </footer>

      {toast && (
        <div style={{ position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 60 }} role="status">
          <div style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '12px 18px', fontFamily: 'var(--mono)', fontSize: 13, border: '2px solid var(--orange)', animation: 'sbtoast .2s ease-out' }}>{toast}</div>
        </div>
      )}
    </div>
  );
}
