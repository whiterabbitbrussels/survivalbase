import { PRODUCT_BY_ID, money, type Bundle, type Product } from '../data';
import { ProductShot } from './ProductCard';

/** "Use it with" / "Kits for this zone": each kit with its items and one add-all button. */
export function KitSection({ title, kits, currentId, onAdd, onOpenProduct }: {
  title: string;
  kits: Bundle[];
  /** Product being viewed: highlighted and not clickable. */
  currentId?: string;
  onAdd: (p: Product, qty: number) => void;
  onOpenProduct: (pid: string) => void;
}) {
  if (!kits.length) return null;
  const list = kits.map(b => {
    const items = b.items.map(id => PRODUCT_BY_ID[id]);
    return { ...b, items, total: items.reduce((sum, x) => sum + (x.price ?? 0), 0) };
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 30, borderBottom: '2px solid var(--ink)', paddingBottom: 8 }}>{title}</div>
      {list.map(k => (
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
                  <div key={x.id} onClick={() => x.id !== currentId && onOpenProduct(x.id)} style={{ display: 'flex', flexDirection: 'column', border: '2px solid var(--ink)', background: '#fff', cursor: x.id === currentId ? 'default' : 'pointer', outline: x.id === currentId ? '3px solid var(--orange)' : 'none', outlineOffset: -5 }}>
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
  );
}
