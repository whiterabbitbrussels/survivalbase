/** The base in cross-section: surface on top, earth below, shaft down to the bunker. Rectangles only. */
export function LogoMark() {
  return (
    <div style={{ position: 'relative', width: 34, height: 34, border: '3px solid var(--ink)', boxSizing: 'border-box', background: 'var(--paper)', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 11, bottom: 0, background: 'var(--ink)' }} />
      <div style={{ position: 'absolute', left: 12, top: 11, width: 4, height: 9, background: 'var(--orange)' }} />
      <div style={{ position: 'absolute', left: 5, top: 19, width: 18, height: 7, background: 'var(--orange)' }} />
    </div>
  );
}

export function Wordmark() {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'var(--display)', fontWeight: 900, fontSize: 28, letterSpacing: '.02em', lineHeight: 1 }}>
      <span>SURVIVAL</span><span style={{ color: 'var(--orange)' }}>BASE</span>
    </div>
  );
}
