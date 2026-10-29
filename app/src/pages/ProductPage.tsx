import { useState } from 'react';
import { CAT_BY_ID, PRODUCT_BY_ID, bundlesFor, money, pad, type Product } from '../data';
import { ProductShot, RelatedCard } from '../components/ProductCard';

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
  const [shot, setShot] = useState(0);
  const cat = CAT_BY_ID[p.cat];
  const related = cat.items.filter(x => x.id !== p.id);
  const kits = bundlesFor(p.id).map(b => {
    const items = b.items.map(id => PRODUCT_BY_ID[id]);
    return { ...b, items, total: items.reduce((sum, x) => sum + (x.price ?? 0), 0) };
  });

  return (
    <main style={{ flex: 1, maxWidth: 1240, width: '100%', boxSizing: 'border-box', margin: '0 auto', padding: '24px 24px 64px', display: 'flex', flexDirection: 'column', gap: 36 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontFamily: 'var(--mono)', fontSize: 13 }}>
        <button onClick={onHome} className="link-btn">BASE</button><span>/</span>
        <button onClick={() => onOpenCat(cat.id)} className="link-btn">{cat.name.toUpperCase()}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ProductShot product={p} src={p.gallery?.[shot] ?? p.image} label="hero product shot" style={{ aspectRatio: '1/1', border: '2px solid var(--ink)', fontSize: 12 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {['In use', 'How it works', 'Specs'].map((label, i) => p.gallery?.[i] ? (
              <button key={label} onClick={() => setShot(i)} aria-label={label} aria-pressed={shot === i} style={{ padding: 0, background: 'none', cursor: 'pointer', border: 'none', outline: shot === i ? '3px solid var(--orange)' : 'none', outlineOffset: -3 }}>
                <ProductShot product={p} src={p.gallery[i]} label={label} style={{ aspectRatio: '1/1', border: '2px solid var(--ink)' }} />
              </button>
            ) : (
              <div key={label} className="ph ph-sm" style={{ aspectRatio: '1/1', border: '2px solid var(--ink)', fontSize: 10 }}>AI visual · {label.toLowerCase()}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '.06em' }}>{cat.where.toUpperCase()} · {cat.name.toUpperCase()}</div>
          <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontWeight: 900, fontSize: 'clamp(44px,5vw,64px)', lineHeight: 0.9, textWrap: 'balance' }}>{p.name}</h1>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.45, textWrap: 'pretty' }}>{p.tagline}</p>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 32, fontWeight: 600 }}>{money(p.price)}</div>

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
            <button onClick={() => onAdd(p, qty)} disabled={p.price === null} className="btn btn-orange btn-press-lg" style={{ flex: 1, minWidth: 200, padding: '14px 16px', fontSize: 15, boxShadow: '4px 4px 0 var(--ink)', opacity: p.price === null ? 0.5 : 1, cursor: p.price === null ? 'not-allowed' : 'pointer' }}>{p.price === null ? 'PRICE SOON' : 'ADD TO STASH'}</button>
          </div>

          <div style={{ border: '2px dashed var(--ink)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.06em' }}>FIELD NOTE · CHAPTER {pad(cat.ch)}</div>
            <div style={{ fontSize: 15, lineHeight: 1.45 }}>Setup, maintenance and the mistakes people make with gear like this are covered in <em>Survival Base</em>, the guide.</div>
            <button onClick={onAddBook} className="link-btn" style={{ alignSelf: 'flex-start', fontWeight: 600, color: 'var(--rust)', textDecoration: 'underline' }}>Add the guide · €49</button>
          </div>
        </div>
      </div>

      {kits.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 30, borderBottom: '2px solid var(--ink)', paddingBottom: 8 }}>Use it with</div>
          {kits.map(k => (
            <div key={k.id} style={{ border: '2px solid var(--ink)', background: 'var(--card)', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.06em' }}>KIT · {k.items.length} ITEMS</div>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 28, lineHeight: 1 }}>{k.name}</div>
                  <div style={{ fontSize: 15, lineHeight: 1.4 }}>{k.blurb}</div>
                </div>
                <button onClick={() => k.items.forEach(x => onAdd(x, 1))} className="btn btn-orange btn-shadow btn-press" style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>ADD THE KIT · {money(Math.round(k.total * 100) / 100)}</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
                {k.items.map(x => (
                  <div key={x.id} onClick={() => x.id !== p.id && onOpenProduct(x.id)} style={{ display: 'flex', flexDirection: 'column', border: '2px solid var(--ink)', background: '#fff', cursor: x.id === p.id ? 'default' : 'pointer', outline: x.id === p.id ? '3px solid var(--orange)' : 'none', outlineOffset: -5 }}>
                    <ProductShot product={x} label="product shot" style={{ aspectRatio: '1/1', borderBottom: '2px solid var(--ink)', fontSize: 10 }} />
                    <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 2, background: 'var(--card)', flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.25 }}>{x.name}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{money(x.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 30, borderBottom: '2px solid var(--ink)', paddingBottom: 8 }}>Same shelf</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
          {related.map(r => <RelatedCard key={r.id} product={r} onOpen={() => onOpenProduct(r.id)} />)}
        </div>
      </div>
    </main>
  );
}
