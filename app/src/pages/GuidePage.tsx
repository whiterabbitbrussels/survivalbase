import { PRODUCT_BY_ID, type Product } from '../data';
import { GUIDES, GUIDES_HUB, type Guide } from '../guides';
import { ProductCard } from '../components/ProductCard';
import { Link } from '../components/Link';
import type { Route } from '../routes';

interface Props {
  guide: Guide;
  onGo: (r: Route) => void;
  onOpenProduct: (pid: string) => void;
  onAdd: (p: Product) => void;
}

const wrap: React.CSSProperties = { flex: 1, maxWidth: 1240, width: '100%', boxSizing: 'border-box', margin: '0 auto', padding: '24px 24px 64px', display: 'flex', flexDirection: 'column', gap: 32 };
const prose: React.CSSProperties = { maxWidth: 720, fontSize: 18, lineHeight: 1.55 };
const h2: React.CSSProperties = { fontFamily: 'var(--display)', fontWeight: 800, fontSize: 34, margin: '8px 0 0' };

function OtherGuides({ current, onGo }: { current?: string; onGo: (r: Route) => void }) {
  return (
    <nav aria-label="Guides" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 30, borderBottom: '2px solid var(--ink)', paddingBottom: 8 }}>{current ? 'More guides' : 'All guides'}</div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {GUIDES.filter(g => g.id !== current).map(g => (
          <li key={g.id} className="card" style={{ padding: 16, gap: 8 }}>
            <Link to={{ view: 'guide', id: g.id }} onGo={() => onGo({ view: 'guide', id: g.id })} style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.25, textDecoration: 'none' }}>{g.h1}</Link>
            <span style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--muted)' }}>{g.description}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function GuidePage({ guide, onGo, onOpenProduct, onAdd }: Props) {
  const products = guide.products.map(id => PRODUCT_BY_ID[id]).filter(Boolean);
  return (
    <main style={wrap}>
      <Link to={{ view: 'guides' }} onGo={() => onGo({ view: 'guides' })} className="link-btn" style={{ alignSelf: 'flex-start' }}>← ALL GUIDES</Link>
      <article style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '.06em' }}>GUIDE · UPDATED {guide.updated}</div>
        <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontWeight: 900, fontSize: 'clamp(44px,7vw,88px)', lineHeight: 0.9, maxWidth: 960 }}>{guide.h1}</h1>
        <p style={{ ...prose, margin: 0, fontWeight: 600, borderLeft: '4px solid var(--orange)', paddingLeft: 16 }}>{guide.answer}</p>
        {guide.sections.map(s => (
          <section key={s.h2} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h2 style={h2}>{s.h2}</h2>
            {s.body.map((p, i) => <p key={i} style={{ ...prose, margin: 0 }}>{p}</p>)}
            {s.list && <ul style={{ ...prose, margin: 0, paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 6 }}>{s.list.map((li, i) => <li key={i}>{li}</li>)}</ul>}
          </section>
        ))}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h2 style={h2}>Questions people ask</h2>
          {guide.faq.map(f => (
            <div key={f.q} style={{ ...prose }}>
              <h3 style={{ margin: '6px 0 4px', fontSize: 19 }}>{f.q}</h3>
              <p style={{ margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </section>
        <p style={{ ...prose, margin: 0, fontSize: 15, color: 'var(--muted)' }}>
          Sources: {guide.sources.map(([label, url], i) => <span key={url}>{i > 0 && ' · '}<a href={url} rel="noopener">{label}</a></span>)}. In an emergency where someone is in danger, call 999.
        </p>
      </article>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--ink)', paddingBottom: 8 }}>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 30 }}>What we'd put in it</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{products.length} ITEMS</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
        {products.map(p => <ProductCard key={p.id} product={p} onOpen={() => onOpenProduct(p.id)} onAdd={() => onAdd(p)} />)}
      </div>

      <OtherGuides current={guide.id} onGo={onGo} />
    </main>
  );
}

export function GuidesPage({ onGo }: { onGo: (r: Route) => void }) {
  return (
    <main style={wrap}>
      <Link to={{ view: 'home' }} onGo={() => onGo({ view: 'home' })} className="link-btn" style={{ alignSelf: 'flex-start' }}>← BACK TO BASE</Link>
      <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontWeight: 900, fontSize: 'clamp(52px,8vw,104px)', lineHeight: 0.9 }}>{GUIDES_HUB.h1}</h1>
      <p style={{ ...prose, margin: 0 }}>{GUIDES_HUB.intro}</p>
      <OtherGuides onGo={onGo} />
    </main>
  );
}
