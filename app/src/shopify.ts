import type { CartLine } from './data';

/** Shopify store that handles checkout. Switch to the custom checkout domain once its DNS is live. */
export const SHOP_DOMAIN = 'kimowi-kimonos.myshopify.com';

/** Site product id → Shopify variant id. Filled in once the products exist in Shopify. */
export const VARIANTS: Record<string, number> = {};

export const isSellable = (id: string) => id in VARIANTS;

/**
 * Shopify cart permalink: opens a cart with these lines and goes straight to checkout.
 * Returns null when nothing in the stash is sellable yet.
 */
export function checkoutUrl(cart: CartLine[]): string | null {
  const qty = new Map<number, number>();
  for (const line of cart) {
    const variant = VARIANTS[line.id];
    if (variant) qty.set(variant, (qty.get(variant) ?? 0) + 1);
  }
  if (!qty.size) return null;
  const items = [...qty].map(([variant, q]) => `${variant}:${q}`).join(',');
  return `https://${SHOP_DOMAIN}/cart/${items}`;
}
