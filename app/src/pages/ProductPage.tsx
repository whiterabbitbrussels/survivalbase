import { useState } from 'react';
import { CAT_BY_ID, pad, type Product } from '../data';
import { RelatedCard } from '../components/ProductCard';

interface Props {
  product: Product;
  onHome: () => void;
  onOpenCat: (id: string) => void;
  onOpenProduct: (pid: string) => void;
  onAdd: (p: Product, qty: number) => void;
  onAddBook: () => void;
}

export function ProductPage({ product: p, onHome, onOpenCat, onOpenProduct, onAdd, onAddBook }: Props) {
  const [qty, setQty] = useState(1);
  const cat = CAT_BY_ID[p.cat];
  const related = cat.items.filter(x => x.id !== p.id);

  return (
    <main style={{ flex: 1, maxWidth: 1240, width: '100%', boxSizing: 'border-box', margin: '0 auto', padding: '24px 24px 64px', display: 'flex', flexDirection: 'column', gap: 36 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontFamily: 'var(--mono)', fontSize: 13 }}>
        <button onClick={onHome} className="link-btn">BASE</button><span>/</span>
        <button onClick={() => onOpenCat(cat.id)} className="link-btn">{cat.name.toUpperCase()}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="ph ph-lg" style={{ aspectRatio: '1/1', border: '2px solid var(--ink)', fontSize: 12 }}>hero product shot</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {['in use', 'detail', 'packed'].map(label => (
              <div key={label} className="ph ph-sm" style={{ aspectRatio: '1/1', border: '2px solid var(--ink)', fontSize: 10 }}>{label}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '.06em' }}>{cat.where.toUpperCase()} · {cat.name.toUpperCase()}</div>
          <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontWeight: 900, fontSize: 'clamp(44px,5vw,64px)', lineHeight: 0.9, textWrap: 'balance' }}>{p.name}</h1>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.45, textWrap: 'pretty' }}>{p.tagline}</p>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 32, fontWeight: 600 }}>${p.price}</div>

          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '2px solid var(--ink)' }}>
            {p.spec.split(' · ').map(sp => (
              <div key={sp} style={{ padding: '9px 0', borderBottom: '1px solid var(--rule)', fontFamily: 'var(--mono)', fontSize: 14 }}>{sp}</div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', border: '2px solid var(--ink)' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity" style={{ width: 44, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>−</button>
              <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: 16 }}>{qty}</div>
              <button onClick={() => setQty(q => Math.min(99, q + 1))} aria-label="Increase quantity" style={{ width: 44, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>+</button>
            </div>
            <button onClick={() => onAdd(p, qty)} className="btn btn-orange btn-press-lg" style={{ flex: 1, minWidth: 200, padding: '14px 16px', fontSize: 15, boxShadow: '4px 4px 0 var(--ink)' }}>ADD TO STASH</button>
          </div>

          <div style={{ border: '2px dashed var(--ink)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.06em' }}>FIELD NOTE · CHAPTER {pad(cat.ch)}</div>
            <div style={{ fontSize: 15, lineHeight: 1.45 }}>Setup, maintenance and the mistakes people make with gear like this are covered in <em>Survival Base</em>, the guide.</div>
            <button onClick={onAddBook} className="link-btn" style={{ alignSelf: 'flex-start', fontWeight: 600, color: 'var(--rust)', textDecoration: 'underline' }}>Add the guide · $49</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 30, borderBottom: '2px solid var(--ink)', paddingBottom: 8 }}>Same shelf</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
          {related.map(r => <RelatedCard key={r.id} product={r} onOpen={() => onOpenProduct(r.id)} />)}
        </div>
      </div>
    </main>
  );
}
