import { bundlesForCat, pad, type Category, type Product } from '../data';
import { ProductCard } from '../components/ProductCard';
import { KitSection } from '../components/KitSection';
import { t } from '../i18n';
import { Link } from '../components/Link';

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
      <Link to={{ view: 'home' }} onGo={onHome} className="link-btn" style={{ alignSelf: 'flex-start' }}>{t('cat.back')}</Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,360px),1fr))', gap: 28, alignItems: 'end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '.06em' }}>{t('cat.kicker', { where: t(`where.${cat.where}`).toUpperCase(), n: pad(cat.ch) })}</div>
          <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontWeight: 900, fontSize: 'clamp(64px,9vw,120px)', lineHeight: 0.85 }}>{cat.name}</h1>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.45, maxWidth: 480, textWrap: 'pretty' }}>{cat.blurb}</p>
        </div>
        <div className="ph" style={{ aspectRatio: '16/10', border: '2px solid var(--ink)', fontSize: 12, padding: 12 }}>section illustration · {cat.name} (Seedream)</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', background: 'var(--ink)', color: 'var(--paper)', padding: '16px 20px' }}>
        <div style={{ fontSize: 15, lineHeight: 1.4 }}>{t('cat.chapter', { n: pad(cat.ch) })}</div>
        <button onClick={onAddBook} className="btn btn-orange" style={{ border: '2px solid var(--paper)', padding: '10px 14px', whiteSpace: 'nowrap' }}>{t('cat.addGuide')}</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid var(--ink)', paddingBottom: 8 }}>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 30 }}>{t('cat.onShelf')}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{t('cat.items', { n: cat.items.length })}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
        {cat.items.map(p => <ProductCard key={p.id} product={p} onOpen={() => onOpenProduct(p.id)} onAdd={() => onAdd(p)} />)}
      </div>

      <KitSection title={t('cat.kits')} kits={bundlesForCat(cat.id)} onAdd={p => onAdd(p)} onOpenProduct={onOpenProduct} />
    </main>
  );
}
