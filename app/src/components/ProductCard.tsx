import type { Product } from '../data';

export function ProductCard({ product, onOpen, onAdd }: { product: Product; onOpen: () => void; onAdd: () => void }) {
  return (
    <div className="card">
      <div onClick={onOpen} className="ph" style={{ aspectRatio: '4/3', cursor: 'pointer', borderBottom: '2px solid var(--ink)', fontSize: 11 }}>product shot</div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <div onClick={onOpen} style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.25, cursor: 'pointer' }}>{product.name}</div>
        <div style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--muted)', flex: 1 }}>{product.tagline}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 600 }}>${product.price}</div>
          <button onClick={onAdd} className="card-add">+ STASH</button>
        </div>
      </div>
    </div>
  );
}

/** Compact card for the "Same shelf" row: whole card opens the product. */
export function RelatedCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  return (
    <div onClick={onOpen} className="card card-flat" style={{ cursor: 'pointer' }}>
      <div className="ph" style={{ aspectRatio: '4/3', borderBottom: '2px solid var(--ink)', fontSize: 11 }}>product shot</div>
      <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.25 }}>{product.name}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 14, whiteSpace: 'nowrap' }}>${product.price}</div>
      </div>
    </div>
  );
}
