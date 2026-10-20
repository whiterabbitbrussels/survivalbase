import { pad, type Category, type Product } from '../data';
import { ProductCard } from '../components/ProductCard';

interface Props {
  cat: Category;
  onHome: () => void;
  onAddBook: () => void;
  onOpenProduct: (pid: string) => void;
  onAdd: (p: Product) => void;
}

export function CategoryPage({ cat, onHome, onAddBook, onOpenProduct, onAdd }: Props) {
  return (
    <main style={{ flex: 1, maxWidth: 1240, width: '100%', boxSizing: 'border-box', margin: '0 auto', padding: '24px 24px 64px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <button onClick={onHome} className="link-btn" style={{ alignSelf: 'flex-start' }}>← BACK TO BASE</button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,360px),1fr))', gap: 28, alignItems: 'end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '.06em' }}>{cat.where.toUpperCase()} ZONE · CHAPTER {pad(cat.ch)}</div>
          <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontWeight: 900, fontSize: 'clamp(64px,9vw,120px)', lineHeight: 0.85 }}>{cat.name}</h1>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.45, maxWidth: 480, textWrap: 'pretty' }}>{cat.blurb}</p>
        </div>
        <div className="ph" style={{ aspectRatio: '16/10', border: '2px solid var(--ink)', fontSize: 12, padding: 12 }}>section illustration · {cat.name} (Seedream)</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', background: 'var(--ink)', color: 'var(--paper)', padding: '16px 20px' }}>
        <div style={{ fontSize: 15, lineHeight: 1.4 }}>This zone is <strong>Chapter {pad(cat.ch)}</strong> of <em>Survival Base</em>, the guide. How to choose it, set it up and fix it with what's left.</div>
        <button onClick={onAddBook} className="btn btn-orange" style={{ border: '2px solid var(--paper)', padding: '10px 14px', whiteSpace: 'nowrap' }}>ADD THE GUIDE · €49</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--ink)', paddingBottom: 8 }}>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 30 }}>On the shelf</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{cat.items.length} ITEMS</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
        {cat.items.map(p => <ProductCard key={p.id} product={p} onOpen={() => onOpenProduct(p.id)} onAdd={() => onAdd(p)} />)}
      </div>
    </main>
  );
}
