// Renders the SurvivalBase social media kit (profile pictures, covers, share image) to PNG.
const { chromium } = require('playwright');
const C = { ink: '#1f1b16', paper: '#f2ede2', orange: '#d9692b', rust: '#b4531d', rule: '#c9bfa8' };
const FONTS = '<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">';

/** The site's logo mark (34-unit grid) scaled to `size` px. */
function mark(size, bg = C.paper) {
  const u = size / 34;
  return `<div style="position:relative;width:${size}px;height:${size}px;border:${3 * u}px solid ${C.ink};box-sizing:border-box;background:${bg};overflow:hidden">
    <div style="position:absolute;left:0;right:0;top:${11 * u}px;bottom:0;background:${C.ink}"></div>
    <div style="position:absolute;left:${12 * u}px;top:${11 * u}px;width:${4 * u}px;height:${9 * u}px;background:${C.orange}"></div>
    <div style="position:absolute;left:${5 * u}px;top:${19 * u}px;width:${18 * u}px;height:${7 * u}px;background:${C.orange}"></div></div>`;
}
const word = (px, color = C.ink) => `<div style="font:900 ${px}px/0.9 'Big Shoulders Display';letter-spacing:.02em;color:${color};white-space:nowrap">SURVIVAL<span style="color:${C.orange}">BASE</span></div>`;

/** Cross-section strip: sky, ground line, earth, shaft and lit bunker rooms, full width at the bottom. */
function section(w, h, groundY) {
  const rooms = [];
  const shaft = Math.round(w * 0.5);
  const rw = Math.round(h * 0.16), rh = Math.round((h - groundY) * 0.22);
  for (let i = -4; i <= 4; i++) {
    if (i === 0) continue;
    const x = shaft + i * (rw + 18) - rw / 2;
    rooms.push(`<div style="position:absolute;left:${x}px;top:${groundY + (h - groundY) * (Math.abs(i) % 2 ? 0.38 : 0.62)}px;width:${rw}px;height:${rh}px;background:${Math.abs(i) % 3 ? C.orange : C.rust}"></div>`);
  }
  // Corridors from the shaft to each row of rooms.
  const span = 4 * (rw + 18) + rw / 2;
  const corridors = [0.38, 0.62].map(f => `<div style="position:absolute;left:${shaft - span}px;width:${2 * span}px;top:${groundY + (h - groundY) * f + rh / 2 - 3}px;height:6px;background:${C.orange};opacity:.55"></div>`).join('');
  return `<div style="position:absolute;left:0;right:0;top:${groundY}px;bottom:0;background:${C.ink}"></div>${corridors}
    <div style="position:absolute;left:0;right:0;top:${groundY - 4}px;height:4px;background:${C.ink}"></div>
    <div style="position:absolute;left:${shaft - 9}px;top:${groundY}px;width:18px;bottom:${(h - groundY) * 0.08}px;background:${C.orange}"></div>
    ${rooms.join('')}`;
}

const page = (w, h, body, bg = C.paper) => `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>body{margin:0}</style></head>
  <body><div style="position:relative;width:${w}px;height:${h}px;background:${bg};overflow:hidden;font-family:'IBM Plex Mono'">${body}</div></body></html>`;

/** Cover: wordmark + line centred in the platform's safe area, cross-section along the bottom. */
function cover(w, h, safeW, safeH, { tag = true } = {}) {
  const ground = Math.round(h / 2 + safeH * 0.18);
  const wp = Math.round(Math.min(safeW / 6.2, safeH * 0.32));
  const top = Math.round((h - safeH) / 2 + safeH * 0.06);
  return page(w, h, `${section(w, h, ground)}
    <div style="position:absolute;left:0;right:0;top:${top}px;display:flex;flex-direction:column;align-items:center;gap:${Math.round(wp * 0.22)}px">
      <div style="display:flex;align-items:center;gap:${Math.round(wp * 0.25)}px">${mark(Math.round(wp * 0.95))}${word(wp)}</div>
      ${tag ? `<div style="font:500 ${Math.round(wp * 0.2)}px/1.2 'IBM Plex Mono';letter-spacing:.06em;color:${C.ink};text-align:center">GEAR FOR THE END OF THE WORLD · OR A LONG WEEKEND WITHOUT WIFI</div>` : ''}
    </div>`);
}

const KIT = {
  'profile-1080.png': [1080, 1080, page(1080, 1080, `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${mark(600)}</div>`)],
  'profile-dark-1080.png': [1080, 1080, page(1080, 1080, `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${mark(600)}</div>`, C.orange)],
  'facebook-cover-1640x624.png': [1640, 624, cover(1640, 624, 1100, 400)],
  'x-header-1500x500.png': [1500, 500, cover(1500, 500, 1100, 360)],
  'linkedin-cover-1128x191.png': [1128, 191, cover(1128, 191, 900, 170, { tag: false })],
  'youtube-banner-2560x1440.png': [2560, 1440, cover(2560, 1440, 1546, 423)],
  'reddit-banner-1920x384.png': [1920, 384, cover(1920, 384, 1400, 300)],
  'share-image-1200x630.png': [1200, 630, cover(1200, 630, 1100, 470)],
};

(async () => {
  const browser = await chromium.launch();
  for (const [name, [w, h, html]] of Object.entries(KIT)) {
    const p = await browser.newPage({ viewport: { width: w, height: h } });
    await p.setContent(html, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: name, clip: { x: 0, y: 0, width: w, height: h } });
    await p.close();
  }
  await browser.close();
})();
