import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { hrefFor, type Route } from '../routes';

/** Real link (crawlable, opens in a new tab) that navigates in-app on a plain click. */
export function Link({ to, onGo, className, style, children }: { to: Route; onGo: () => void; className?: string; style?: CSSProperties; children: ReactNode }) {
  const click = (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onGo();
  };
  return <a href={hrefFor(to)} onClick={click} className={className} style={{ color: 'inherit', ...style }}>{children}</a>;
}
