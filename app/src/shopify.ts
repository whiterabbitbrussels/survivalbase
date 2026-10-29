import type { CartLine } from './data';

/** Shopify store that handles checkout (primary domain of the SurvivalBase store). */
export const SHOP_DOMAIN = 'shop.survivalbase.net';

/** Site product id → Shopify variant id. BigBuy items join once their supplier price is confirmed. */
export const VARIANTS: Record<string, number> = {
  book: 58336211468670,
  'energy-0': 58336272646526,
  'energy-2': 58336272777598,
  'energy-3': 58336273039742,
  'energy-4': 58336273170814,
  'water-0': 58336273269118,
  'water-1': 58336273400190,
  'water-3': 58336273498494,
  'water-4': 58336273695102,
  'food-0': 58345379332478,
  'food-1': 58345379463550,
  'food-2': 58345379496318,
  'shelter-0': 58345379561854,
  'shelter-2': 58345379594622,
  'shelter-3': 58345379660158,
  'shelter-4': 58345379692926,
  'fire-0': 58345379758462,
  'fire-1': 58345379823998,
  'fire-2': 58345379889534,
  'fire-3': 58345379922302,
  'storage-2': 58345379987838,
  'storage-3': 58345381790078,
  'comms-0': 58336273793406,
  'comms-1': 58336273891710,
  'comms-3': 58336275661182,
  'comms-4': 58336275825022,
  'nav-0': 58336277823870,
  'nav-1': 58336278675838,
  'nav-2': 58336281133438,
  'nav-3': 58336283099518,
  'nav-4': 58336283623806,
  'medic-1': 58336285458814,
  'medic-2': 58336285819262,
  'medic-3': 58336286015870,
  'medic-4': 58336286278014,
  'tools-1': 58336286802302,
  'tools-2': 58336287064446,
  'tools-3': 58336287195518,
  'tools-4': 58336287293822,
  'security-1': 58336287424894,
  'security-2': 58336287555966,
  'security-3': 58336287687038,
};

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
