import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { BOOK, CATS, CAT_BY_ID, FEET, TIP_X, money, pad, type CartLine } from '../data';
import type { WalkerState } from '../useWalker';
import { checkoutUrl, isSellable } from '../shopify';

const SCENE_W = 1600;
const SCENE_H = 1000;

interface PanelItem { n: string; name: string; price: string; open: () => void }
interface PanelData { kicker: string; title: string; blurb: string; items: PanelItem[]; cta: string; onCta: () => void }

export interface SceneProps {
  night: boolean;
  cart: CartLine[];
  walker: WalkerState;
  panel: string | null;
  onClosePanel: () => void;
  onZone: (id: string) => void;
  onAdd: (line: CartLine) => void;
  onOpenProduct: (pid: string) => void;
  onFlash: (msg: string) => void;
}

const abs = (s: CSSProperties): CSSProperties => ({ position: 'absolute', ...s });
const Box = (s: CSSProperties) => <div style={abs(s)} />;

export function Scene({ night, cart, walker, panel, onClosePanel, onZone, onAdd, onOpenProduct, onFlash }: SceneProps) {
  const [scale, setScale] = useState(0.6);
  const [tip, setTip] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(e => { const w = e[0].contentRect.width; if (w) setScale(w / SCENE_W); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const go = (id: string) => () => { setTip(null); onZone(id); };
  const hover = (id: string) => ({
    onClick: go(id),
    onMouseEnter: () => { if (!walker.walking) setTip(id); },
    onMouseLeave: () => setTip(null),
  });

  const room = (id: string, s: CSSProperties, children: ReactNode) => (
    <div {...hover(id)} className="zone zone-room" style={abs(s)}>{children}</div>
  );
  const roomLabel = (text: ReactNode) => <div className="zone-label" style={abs({ left: 12, top: 10 })}>{text}</div>;

  const surface = (id: string, left: number, width: number, label: string, children: ReactNode) => (
    <div {...hover(id)} className="zone zone-surface" style={abs({ left, top: 180, width, height: 300 })}>
      {children}
      <div style={abs({ left: 0, right: 0, top: 282, display: 'flex', justifyContent: 'center', zIndex: 6 })}>
        <div className="zone-label zone-label-lg">{label}</div>
      </div>
    </div>
  );

  const panelData = panel ? buildPanel(panel, cart, { onAdd, onOpenProduct, onFlash, onZone }) : null;

  return (
    <div ref={stageRef} style={{ position: 'relative', width: '100%', height: Math.round(SCENE_H * scale), overflow: 'hidden', borderTop: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: SCENE_W, height: SCENE_H, transformOrigin: '0 0', transform: `scale(${scale})` }}>
        {/* Sky, sun, skyline, dune */}
        {Box({ left: 0, top: 0, width: 1600, height: 460, background: '#e7dfcb' })}
        {Box({ left: 1310, top: 60, width: 96, height: 96, background: '#efc27a' })}
        <div style={abs({ left: 0, top: 300, width: 1600, height: 100, display: 'flex', alignItems: 'flex-end', gap: 10, paddingLeft: 40, opacity: 0.55 })}>
          {[[60, 70], [40, 40], [80, 95], [30, 55], [70, 30], [50, 80]].map(([w, h], i) => (
            <div key={i} style={{ width: w, height: h, background: '#c4b99e' }} />
          ))}
        </div>
        {Box({ left: 920, top: 330, width: 420, height: 200, background: '#d4cab0' })}

        {/* Ground and earth strata */}
        {Box({ left: 0, top: 392, width: 1600, height: 60, background: '#8f9b5a', clipPath: 'polygon(1.5% 0,98.5% 0,100% 100%,0 100%)' })}
        {Box({ left: 0, top: 450, width: 1600, height: 10, background: '#5f6a37' })}
        {Box({ left: 0, top: 460, width: 1600, height: 100, background: '#8b6b47' })}
        {Box({ left: 0, top: 560, width: 1600, height: 150, background: '#7a5c3d' })}
        {Box({ left: 0, top: 710, width: 1600, height: 150, background: '#684d34' })}
        {Box({ left: 0, top: 860, width: 1600, height: 140, background: '#553e2a' })}
        {Box({ left: 120, top: 600, width: 26, height: 18, background: '#94785a' })}
        {Box({ left: 210, top: 780, width: 40, height: 24, background: '#7f6449' })}
        {Box({ left: 1390, top: 640, width: 34, height: 20, background: '#94785a' })}
        {Box({ left: 1480, top: 900, width: 50, height: 28, background: '#6d543c' })}
        {Box({ left: 60, top: 900, width: 30, height: 20, background: '#6d543c' })}

        {/* Shaft + hatch */}
        {Box({ left: 785, top: 420, width: 70, height: 525, background: '#2f2923', backgroundImage: 'repeating-linear-gradient(180deg,transparent 0 26px,#8a8174 26px 30px)', zIndex: 6 })}
        {Box({ left: 780, top: 410, width: 80, height: 14, background: '#4a4744', border: '2px solid var(--ink)', zIndex: 7 })}

        {/* Bunker shell */}
        {Box({ left: 340, top: 515, width: 960, height: 450, background: '#8f897e', zIndex: 6 })}

        {room('storage', { left: 360, top: 535, width: 225, height: 195 }, <>
          {roomLabel('FOOD STORAGE')}
          <div style={abs({ left: 18, top: 52, display: 'flex', gap: 6 })}>
            {['#c0503a', '#d6a24a', '#c0503a', '#6b7f4f', '#d6a24a', '#3f6b88', '#c0503a'].map((c, i) => <div key={i} style={{ width: 20, height: 26, background: c }} />)}
          </div>
          {Box({ left: 12, top: 78, width: 200, height: 6, background: '#7a5e40' })}
          <div style={abs({ left: 18, top: 98, display: 'flex', gap: 6 })}>
            {['#b8a27a', '#b8a27a', '#9a8560', '#b8a27a'].map((c, i) => <div key={i} style={{ width: 44, height: 30, background: c }} />)}
          </div>
          {Box({ left: 12, top: 128, width: 200, height: 6, background: '#7a5e40' })}
          <div style={abs({ left: 18, top: 146, display: 'flex', gap: 8 })}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 36, height: 42, background: '#e9e4d8', border: '2px solid #7a5e40' }} />)}
          </div>
        </>)}

        {room('medic', { left: 600, top: 535, width: 170, height: 195 }, <>
          {roomLabel('FIRST AID')}
          {Box({ left: 18, top: 52, width: 70, height: 110, background: '#f6f3ec', border: '2px solid #b9b2a4' })}
          {Box({ left: 46, top: 80, width: 14, height: 44, background: '#c0392b' })}
          {Box({ left: 31, top: 95, width: 44, height: 14, background: '#c0392b' })}
          {Box({ left: 96, top: 150, width: 64, height: 12, background: '#6b7f4f' })}
          {Box({ left: 100, top: 162, width: 4, height: 22, background: '#4a4744' })}
          {Box({ left: 152, top: 162, width: 4, height: 22, background: '#4a4744' })}
        </>)}

        {room('tools', { left: 870, top: 535, width: 205, height: 195 }, <>
          {roomLabel('TOOLS')}
          {Box({ left: 14, top: 48, width: 177, height: 96, background: '#b8955f', backgroundImage: 'radial-gradient(#8a6c40 2px,transparent 2.5px)', backgroundSize: '14px 14px' })}
          {Box({ left: 34, top: 58, width: 6, height: 70, background: '#6b4a2c' })}
          {Box({ left: 24, top: 58, width: 26, height: 16, background: '#5c5c58' })}
          {Box({ left: 70, top: 62, width: 12, height: 64, background: '#5c5c58' })}
          {Box({ left: 104, top: 62, width: 56, height: 14, background: '#c0503a' })}
          {Box({ left: 104, top: 92, width: 70, height: 10, background: '#5c5c58' })}
          {Box({ left: 10, top: 156, width: 185, height: 12, background: '#6b4a2c' })}
        </>)}

        {room('security', { left: 1090, top: 535, width: 190, height: 195 }, <>
          {roomLabel('SECURITY')}
          {Box({ left: 20, top: 50, width: 110, height: 110, background: '#8a867d', border: '7px solid #5e5b55', boxSizing: 'border-box' })}
          {Box({ left: 60, top: 90, width: 30, height: 30, background: '#4a4744' })}
          {Box({ left: 73, top: 66, width: 4, height: 78, background: '#4a4744' })}
          {Box({ left: 36, top: 103, width: 78, height: 4, background: '#4a4744' })}
          {Box({ left: 140, top: 60, width: 40, height: 30, background: '#0e1a10', border: '3px solid #4a4744' })}
        </>)}

        {room('library', { left: 360, top: 750, width: 410, height: 195 }, <>
          {roomLabel('LIBRARY · THE GUIDE')}
          {Box({ left: 16, top: 46, width: 160, height: 128, background: '#6b4a2c' })}
          {Box({ left: 24, top: 54, width: 144, height: 34, backgroundImage: 'repeating-linear-gradient(90deg,#c0503a 0 9px,#d6a24a 9px 17px,#3f6b88 17px 26px,#e9e4d8 26px 32px)' })}
          {Box({ left: 24, top: 96, width: 144, height: 34, backgroundImage: 'repeating-linear-gradient(90deg,#6b7f4f 0 11px,#e9e4d8 11px 18px,#c0503a 18px 26px)' })}
          {Box({ left: 24, top: 138, width: 144, height: 30, backgroundImage: 'repeating-linear-gradient(90deg,#d6a24a 0 8px,#3f6b88 8px 18px,#e9e4d8 18px 24px)' })}
          {Box({ left: 220, top: 40, width: 170, height: 120, background: '#f4d39a', opacity: 0.7 })}
          {Box({ left: 276, top: 122, width: 56, height: 62, background: '#5a4030' })}
          <div style={abs({ left: 236, top: 64, width: 136, height: 60, background: 'var(--orange)', border: '2px solid var(--ink)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-4deg)' })}>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 22, lineHeight: 0.9, color: 'var(--ink)' }}>SURVIVAL BASE</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink)' }}>THE GUIDE · €49</div>
          </div>
        </>)}

        {room('stash', { left: 870, top: 750, width: 410, height: 195 }, <>
          {roomLabel(`YOUR STASH · ${cart.length} ITEMS`)}
          {Box({ left: 220, top: 110, width: 78, height: 68, background: '#a5844f', border: '3px solid #6b4a2c', boxSizing: 'border-box' })}
          {Box({ left: 304, top: 110, width: 78, height: 68, background: '#a5844f', border: '3px solid #6b4a2c', boxSizing: 'border-box' })}
          {Box({ left: 262, top: 46, width: 78, height: 64, background: '#b8955f', border: '3px solid #6b4a2c', boxSizing: 'border-box' })}
          {Box({ left: 30, top: 132, width: 120, height: 46, background: '#6b7f4f', border: '3px solid #4a5a37', boxSizing: 'border-box' })}
        </>)}

        {/* Surface zones */}
        {surface('nav', 20, 160, 'NAVIGATION', <>
          {Box({ left: 76, top: 150, width: 8, height: 95, background: '#5a4632' })}
          {Box({ left: 84, top: 156, width: 62, height: 20, background: 'var(--orange)', border: '2px solid var(--ink)', boxSizing: 'border-box' })}
          {Box({ left: 16, top: 186, width: 60, height: 20, background: '#e9e4d8', border: '2px solid var(--ink)', boxSizing: 'border-box' })}
        </>)}

        {surface('shelter', 200, 180, 'SHELTER', <>
          {Box({ left: 15, top: 138, width: 150, height: 107, background: '#6b7f4f', clipPath: 'polygon(50% 0,100% 100%,0 100%)' })}
          {Box({ left: 68, top: 190, width: 44, height: 55, background: '#3b4630', clipPath: 'polygon(50% 0,100% 100%,0 100%)' })}
        </>)}

        {surface('fire', 400, 160, 'FIRE & HEAT', <>
          {Box({ left: 44, top: 228, width: 72, height: 11, background: '#6b4a2c', transform: 'rotate(12deg)' })}
          {Box({ left: 44, top: 228, width: 72, height: 11, background: '#7a5636', transform: 'rotate(-12deg)' })}
          <div style={abs({ left: 60, top: 190, width: 40, height: 46, transformOrigin: '50% 100%', animation: 'sbflick .5s ease-in-out infinite', zIndex: night ? 6 : 1 })}>
            {Box({ inset: 0, background: '#e2812f' })}
            {Box({ left: 11, top: 16, width: 18, height: 26, background: '#f5c45a' })}
          </div>
          {Box({ left: 30, top: 236, width: 16, height: 12, background: '#8a867d' })}
          {Box({ left: 114, top: 236, width: 16, height: 12, background: '#8a867d' })}
        </>)}

        {surface('food', 570, 190, 'GROW & FORAGE', <>
          <div style={abs({ left: 20, top: 206, display: 'flex', gap: 6 })}>
            {['#5f8f3e', '#6f9a45', '#5f8f3e', '#c0503a', '#6f9a45', '#5f8f3e'].map((c, i) => <div key={i} style={{ width: 20, height: 20, background: c }} />)}
          </div>
          {Box({ left: 12, top: 224, width: 160, height: 20, background: '#6e4e31', borderTop: '3px solid #4f3722' })}
          {Box({ left: 150, top: 150, width: 5, height: 76, background: '#7a8a44' })}
          {Box({ left: 162, top: 164, width: 5, height: 62, background: '#7a8a44' })}
        </>)}

        {surface('water', 890, 200, 'WATER', <>
          {Box({ left: 24, top: 175, width: 54, height: 70, background: '#3f6b88' })}
          {Box({ left: 24, top: 192, width: 54, height: 5, background: '#2e5068' })}
          {Box({ left: 24, top: 222, width: 54, height: 5, background: '#2e5068' })}
          {Box({ left: 108, top: 185, width: 6, height: 60, background: '#5a4632' })}
          {Box({ left: 168, top: 185, width: 6, height: 60, background: '#5a4632' })}
          {Box({ left: 100, top: 118, width: 82, height: 67, background: '#5d8aa6', border: '2px solid #2e5068', boxSizing: 'border-box' })}
          {Box({ left: 138, top: 185, width: 6, height: 34, background: '#2e5068' })}
        </>)}

        {surface('energy', 1105, 235, 'POWER', <>
          {Box({ left: 44, top: 214, width: 6, height: 31, background: '#4a4744' })}
          {Box({ left: 118, top: 206, width: 6, height: 39, background: '#4a4744' })}
          {Box({ left: 14, top: 156, width: 140, height: 60, background: '#2b3b58', backgroundImage: 'linear-gradient(90deg,#4f6a94 2px,transparent 2px),linear-gradient(180deg,#4f6a94 2px,transparent 2px)', backgroundSize: '28px 20px', border: '3px solid var(--ink)', boxSizing: 'border-box', transform: 'skewX(-18deg)' })}
          {Box({ left: 190, top: 40, width: 8, height: 205, background: '#d8d1c1', border: '1px solid #9a9384' })}
          {Box({ left: 182, top: 30, width: 26, height: 16, background: '#bdb5a3' })}
          <div style={abs({ left: 195, top: 38, width: 0, height: 0, zIndex: 2, animation: 'sbspin 2.8s linear infinite' })}>
            {[0, 120, 240].map(r => (
              <div key={r} style={abs({ left: -3, top: -64, width: 7, height: 64, background: '#ece7db', border: '1px solid #9a9384', transformOrigin: '50% 100%', transform: `rotate(${r}deg)` })} />
            ))}
          </div>
        </>)}

        {surface('comms', 1370, 210, 'COMMS', <>
          {Box({ left: 20, top: 190, width: 76, height: 55, background: '#8f8a7d', border: '2px solid #5e5b55', boxSizing: 'border-box' })}
          {Box({ left: 14, top: 180, width: 88, height: 12, background: '#5e5b55' })}
          {Box({ left: 44, top: 208, width: 26, height: 18, background: '#0e1a10' })}
          {Box({ left: 136, top: -10, width: 8, height: 255, background: '#6b6b66' })}
          {Box({ left: 120, top: 30, width: 40, height: 4, background: '#6b6b66' })}
          {Box({ left: 124, top: 80, width: 32, height: 4, background: '#6b6b66' })}
          {Box({ left: 146, top: 96, width: 44, height: 44, background: '#d8d1c1', border: '4px solid #6b6b66', boxSizing: 'border-box' })}
          {Box({ left: 132, top: -22, width: 16, height: 16, background: '#e0442f', zIndex: 6, animation: 'sbblink 1.4s steps(1) infinite' })}
        </>)}

        {night && <>
          {Box({ left: 0, top: 0, width: 1600, height: 460, background: 'rgba(14,18,36,.74)', zIndex: 5, pointerEvents: 'none' })}
          {Box({ left: 0, top: 460, width: 1600, height: 540, background: 'rgba(10,10,20,.45)', zIndex: 5, pointerEvents: 'none' })}
          {Box({ left: 1330, top: 70, width: 70, height: 70, background: '#e9e4d8', zIndex: 5, pointerEvents: 'none' })}
          {[[200, 60, 4], [520, 120, 3], [760, 50, 4], [1040, 140, 3], [380, 200, 3]].map(([l, t, s], i) => (
            <div key={i} style={abs({ left: l, top: t, width: s, height: s, background: '#e9e4d8', zIndex: 5 })} />
          ))}
          {Box({ left: 400, top: 300, width: 160, height: 160, background: 'radial-gradient(rgba(240,160,70,.45),transparent 70%)', zIndex: 5, pointerEvents: 'none' })}
        </>}

        {tip && <Tooltip id={tip} cartCount={cart.length} />}

        <Survivor walker={walker} />
      </div>

      {panelData && !night && <DayPanel data={panelData} onClose={onClosePanel} />}
      {panelData && night && <TerminalPanel data={panelData} onClose={onClosePanel} />}
    </div>
  );
}

function buildPanel(
  id: string,
  cart: CartLine[],
  a: Pick<SceneProps, 'onAdd' | 'onOpenProduct' | 'onFlash' | 'onZone'>,
): PanelData {
  if (id === 'library') {
    return {
      kicker: 'BUNKER · LIBRARY', title: 'Survival Base',
      blurb: 'The guide behind the shop. Eleven chapters, one for every zone of this base. Printed on paper, which still works in a blackout.',
      items: [{ n: '01', name: 'Print + PDF edition', price: '€49', open: () => a.onAdd(BOOK) }],
      cta: 'Add the guide · €49', onCta: () => a.onAdd(BOOK),
    };
  }
  if (id === 'stash') {
    const grouped = new Map<string, CartLine & { q: number }>();
    cart.forEach(c => { const g = grouped.get(c.id) ?? { ...c, q: 0 }; g.q++; grouped.set(c.id, g); });
    const lines = [...grouped.values()];
    const total = cart.reduce((sum, c) => sum + c.price, 0);
    return {
      kicker: 'BUNKER · YOUR STASH',
      title: lines.length ? money(total) : 'Empty',
      blurb: lines.length ? cart.length + ' items packed and waiting.' : 'Like the shelves after the first rumour. Go shopping.',
      items: lines.map((l, i) => ({
        n: pad(i + 1), name: l.name + (l.q > 1 ? ' ×' + l.q : ''), price: money(l.price * l.q),
        open: () => (l.id === 'book' ? a.onZone('library') : a.onOpenProduct(l.id)),
      })),
      cta: lines.length ? 'Checkout' : 'Back to the surface',
      onCta: () => {
        if (!lines.length) return a.onZone('energy');
        const url = checkoutUrl(cart);
        if (!url) return a.onFlash('Checkout opens with the shop launch.');
        if (cart.some(c => !isSellable(c.id))) a.onFlash('Some items are not in stock yet and stay in your stash.');
        window.location.href = url;
      },
    };
  }
  const c = CAT_BY_ID[id];
  return {
    kicker: c.where.toUpperCase() + ' · CHAPTER ' + pad(c.ch), title: c.name, blurb: c.blurb,
    items: c.items.slice(0, 3).map((p, i) => ({ n: pad(i + 1), name: p.name, price: money(p.price), open: () => a.onOpenProduct(p.id) })),
    cta: 'Enter ' + c.name + ' · ' + c.items.length + ' items', onCta: () => a.onZone(c.id),
  };
}

function Tooltip({ id, cartCount }: { id: string; cartCount: number }) {
  const c = CATS.find(x => x.id === id);
  const floor = c ? c.lvl : 2;
  const tip = c
    ? { kicker: (c.lvl ? 'BUNKER ROOM' : 'SURFACE ZONE') + ' · CHAPTER ' + pad(c.ch), title: c.name, blurb: c.blurb, hint: c.items.length + ' items · click to enter →' }
    : id === 'library'
      ? { kicker: 'BUNKER · LIBRARY', title: 'The Guide', blurb: 'Survival Base, the book behind the shop. One chapter for every zone of this base.', hint: '€49 · click to open →' }
      : { kicker: 'BUNKER · STASH', title: 'Your Stash', blurb: 'Everything you have packed so far.', hint: cartCount + ' items · click to open →' };
  const w = 400;
  const left = Math.max(16, Math.min(SCENE_W - w - 16, TIP_X[id] - w / 2));
  const top = floor === 0 ? 24 : floor === 1 ? 250 : 470;
  return (
    <div style={{ position: 'absolute', left, top, width: w, boxSizing: 'border-box', background: 'var(--ink)', color: 'var(--paper)', border: '3px solid var(--orange)', boxShadow: '8px 8px 0 var(--orange)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10, zIndex: 30, pointerEvents: 'none' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 16, letterSpacing: '.08em', color: 'var(--orange)' }}>{tip.kicker}</div>
      <div style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 44, lineHeight: 0.95 }}>{tip.title}</div>
      <div style={{ fontSize: 21, lineHeight: 1.4 }}>{tip.blurb}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 16, borderTop: '2px solid var(--paper)', paddingTop: 10 }}>{tip.hint}</div>
    </div>
  );
}

/** Square-built survivor: no rounded parts, in line with the brand. */
function Survivor({ walker }: { walker: WalkerState }) {
  const { cx, lvl, dur, face } = walker;
  return (
    <div style={{ position: 'absolute', left: cx - 21, top: FEET[lvl] - 80, width: 42, height: 80, zIndex: 10, pointerEvents: 'none', transition: `left ${dur}s linear, top ${dur}s linear` }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scaleX(${face})` }}>
        {Box({ left: 9, top: 0, width: 24, height: 24, background: '#e2b48c', border: '2px solid var(--ink)', boxSizing: 'border-box' })}
        {Box({ left: 21, top: 8, width: 12, height: 8, background: 'var(--ink)' })}
        {Box({ left: 2, top: 26, width: 14, height: 30, background: '#4a5a37', border: '2px solid var(--ink)', boxSizing: 'border-box' })}
        {Box({ left: 8, top: 24, width: 26, height: 34, background: 'var(--orange)', border: '2px solid var(--ink)', boxSizing: 'border-box' })}
        {Box({ left: 11, top: 56, width: 8, height: 24, background: '#3a332b' })}
        {Box({ left: 23, top: 56, width: 8, height: 24, background: '#3a332b' })}
      </div>
    </div>
  );
}

function DayPanel({ data, onClose }: { data: PanelData; onClose: () => void }) {
  return (
    <div style={{ position: 'absolute', top: 16, right: 16, width: 360, maxWidth: 'calc(100% - 32px)', maxHeight: 'calc(100% - 32px)', overflow: 'auto', boxSizing: 'border-box', background: 'var(--paper)', border: '2px solid var(--ink)', boxShadow: '6px 6px 0 var(--ink)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, zIndex: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.06em' }}>{data.kicker}</div>
        <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: '2px solid var(--ink)', width: 28, height: 28, cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
      </div>
      <div style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 44, lineHeight: 0.9 }}>{data.title}</div>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.45, textWrap: 'pretty' }}>{data.blurb}</p>
      <div style={{ display: 'flex', flexDirection: 'column', borderTop: '2px solid var(--ink)' }}>
        {data.items.map(it => (
          <div key={it.n} onClick={it.open} className="panel-row" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--rule)', cursor: 'pointer', fontSize: 14 }}>
            <span style={{ fontWeight: 600 }}>{it.name}</span>
            <span style={{ fontFamily: 'var(--mono)', whiteSpace: 'nowrap' }}>{it.price}</span>
          </div>
        ))}
      </div>
      <button onClick={data.onCta} className="btn btn-orange btn-shadow btn-press" style={{ padding: '12px 14px', fontSize: 14, textAlign: 'left' }}>{data.cta} →</button>
    </div>
  );
}

function TerminalPanel({ data, onClose }: { data: PanelData; onClose: () => void }) {
  return (
    <div style={{ position: 'absolute', left: 16, bottom: 16, width: 420, maxWidth: 'calc(100% - 32px)', maxHeight: 'calc(100% - 32px)', overflow: 'auto', boxSizing: 'border-box', background: '#0b100c', border: '1px solid #7fe39a', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, zIndex: 20, fontFamily: 'var(--mono)', color: '#9ff0b2', fontSize: 13 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <span>// {data.kicker}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ff0b2', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 13, padding: 0 }}>[esc]</button>
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, color: '#c8ffd5' }}>&gt; {data.title}_</div>
      <div style={{ lineHeight: 1.5, color: '#7fcf93' }}>{data.blurb}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.items.map(it => (
          <div key={it.n} onClick={it.open} className="term-row" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '5px 0', cursor: 'pointer' }}>
            <span>[{it.n}] {it.name}</span><span style={{ whiteSpace: 'nowrap' }}>{it.price}</span>
          </div>
        ))}
      </div>
      <button onClick={data.onCta} style={{ background: '#7fe39a', color: '#0b100c', border: 'none', padding: '10px 12px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600, textAlign: 'left' }}>&gt; {data.cta}</button>
    </div>
  );
}
