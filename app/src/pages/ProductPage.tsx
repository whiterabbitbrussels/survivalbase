import { useState } from 'react';
import { CAT_BY_ID, bundlesFor, money, pad, type Product } from '../data';
import { ProductShot, RelatedCard } from '../components/ProductCard';
import { KitSection } from '../components/KitSection';
import { t } from '../i18n';
import { Link } from '../components/Link';

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

  return (
    <main style={{ flex: 1, maxWidth: 1240, width: '100%', boxSizing: 'border-box', margin: '0 auto', padding: '24px 24px 64px', display: 'flex', flexDirection: 'column', gap: 36 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontFamily: 'var(--mono)', fontSize: 13 }}>
        <Link to={{ view: 'home' }} onGo={onHome} className="link-btn">{t('nav.base')}</Link><span>/</span>
        <Link to={{ view: 'cat', id: cat.id }} onGo={() => onOpenCat(cat.id)} className="link-btn">{cat.name.toUpperCase()}</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ProductShot product={p} src={p.gallery?.[shot] ?? p.image} label="hero product shot" style={{ aspectRatio: '1/1', border: '2px solid var(--ink)', fontSize: 12 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[t('product.inUse'), t('product.howItWorks'), t('product.specs')].map((label, i) => p.gallery?.[i] ? (
              <button key={label} onClick={() => setShot(i)} aria-label={label} aria-pressed={shot === i} style={{ padding: 0, background: 'none', cursor: 'pointer', border: 'none', outline: shot === i ? '3px solid var(--orange)' : 'none', outlineOffset: -3 }}>
                <ProductShot product={p} src={p.gallery[i]} label={label} style={{ aspectRatio: '1/1', border: '2px solid var(--ink)' }} />
              </button>
            ) : (
              <div key={label} className="ph ph-sm" style={{ aspectRatio: '1/1', border: '2px solid var(--ink)', fontSize: 10 }}>{t('product.aiVisual')} · {label.toLowerCase()}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '.06em' }}>{t(`where.${cat.where}`).toUpperCase()} · {cat.name.toUpperCase()}</div>
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
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label={t('product.less')} style={{ width: 44, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>−</button>
              <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: 16 }}>{qty}</div>
              <button onClick={() => setQty(q => Math.min(99, q + 1))} aria-label={t('product.more')} style={{ width: 44, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>+</button>
            </div>
            <button onClick={() => onAdd(p, qty)} disabled={p.price === null} className="btn btn-orange btn-press-lg" style={{ flex: 1, minWidth: 200, padding: '14px 16px', fontSize: 15, boxShadow: '4px 4px 0 var(--ink)', opacity: p.price === null ? 0.5 : 1, cursor: p.price === null ? 'not-allowed' : 'pointer' }}>{p.price === null ? t('product.priceSoon') : t('product.add')}</button>
          </div>

          <div style={{ border: '2px dashed var(--ink)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.06em' }}>{t('product.fieldNote', { n: pad(cat.ch) })}</div>
            <div style={{ fontSize: 15, lineHeight: 1.45 }}>{t('product.fieldNoteText')}</div>
            <button onClick={onAddBook} className="link-btn" style={{ alignSelf: 'flex-start', fontWeight: 600, color: 'var(--rust)', textDecoration: 'underline' }}>{t('product.addGuide')}</button>
          </div>
        </div>
      </div>

      <KitSection title={t('product.useWith')} kits={bundlesFor(p.id)} currentId={p.id} onAdd={onAdd} onOpenProduct={onOpenProduct} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 30, borderBottom: '2px solid var(--ink)', paddingBottom: 8 }}>{t('product.sameShelf')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
          {related.map(r => <RelatedCard key={r.id} product={r} onOpen={() => onOpenProduct(r.id)} />)}
        </div>
      </div>
    </main>
  );
}
