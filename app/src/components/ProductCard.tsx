import { money, type Product } from '../data';

/** Supplier photo on a white ground, or the striped placeholder when there is none. */
export function ProductShot({ product, label, style }: { product: Product; label: string; style: React.CSSProperties }) {
  if (!product.image) return <div className="ph" style={style}>{label}</div>;
  return (
    <div style={{ ...style, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <img src={product.image} alt={product.name} loading="lazy" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  );
}

export function ProductCard({ product, onOpen, onAdd }: { product: Product; onOpen: () => void; onAdd: () => void }) {
  return (
    <div className="card">
      <div onClick={onOpen} style={{ cursor: 'pointer' }}>
        <ProductShot product={product} label="product shot" style={{ aspectRatio: '4/3', borderBottom: '2px solid var(--ink)', fontSize: 11 }} />
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <div onClick={onOpen} style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.25, cursor: 'pointer' }}>{product.name}</div>
        <div style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--muted)', flex: 1 }}>{product.tagline}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 600 }}>{money(product.price)}</div>
          {product.price !== null && <button onClick={onAdd} className="card-add">+ STASH</button>}
        </div>
      </div>
    </div>
  );
}

/** Compact card for the "Same shelf" row: whole card opens the product. */
export function RelatedCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  return (
    <div onClick={onOpen} className="card card-flat" style={{ cursor: 'pointer' }}>
      <ProductShot product={product} label="product shot" style={{ aspectRatio: '4/3', borderBottom: '2px solid var(--ink)', fontSize: 11 }} />
      <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.25 }}>{product.name}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 14, whiteSpace: 'nowrap' }}>{money(product.price)}</div>
      </div>
    </div>
  );
}
