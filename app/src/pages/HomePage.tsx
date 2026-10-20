import { CATS } from '../data';
import { Scene, type SceneProps } from '../components/Scene';

export function HomePage(props: SceneProps) {
  const zones = CATS.map(c => ({ id: c.id, label: c.name })).concat([{ id: 'library', label: 'The Guide' }, { id: 'stash', label: 'Stash' }]);
  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', padding: '22px 24px 16px', maxWidth: 1600, width: '100%', boxSizing: 'border-box', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.08em' }}>
            {props.night ? 'GRID STATUS: OFFLINE · DAY 1,284 · RUNNING ON SOLAR AND SPITE' : 'GRID STATUS: ONLINE · FOR NOW'}
          </div>
          <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontWeight: 900, fontSize: 'clamp(38px,5vw,64px)', lineHeight: 0.92, letterSpacing: '.01em', textWrap: 'balance' }}>
            Gear for the end of the world. Or a long weekend without wifi.
          </h1>
        </div>
        <p style={{ margin: 0, maxWidth: 340, fontSize: 15, lineHeight: 1.45, textWrap: 'pretty' }}>
          Tap any zone on the surface or in the bunker. Your survivor walks there and opens the shelf. Shopping, with cardio.
        </p>
      </div>

      <Scene {...props} />

      <div style={{ maxWidth: 1600, width: '100%', boxSizing: 'border-box', margin: '0 auto', padding: '18px 24px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.08em' }}>QUICK MAP</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {zones.map(z => <button key={z.id} onClick={() => props.onZone(z.id)} className="chip">{z.label}</button>)}
        </div>
      </div>
    </main>
  );
}
