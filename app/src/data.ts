export type Level = 0 | 1 | 2;

export interface Product {
  id: string;
  cat: string;
  name: string;
  /** Retail price in EUR; null until the supplier price is confirmed. */
  price: number | null;
  tagline: string;
  spec: string;
  /** Supplier reference photo, until the AI lifestyle visuals replace it. */
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  where: 'Surface' | 'Bunker';
  /** Horizontal position (scene px) the survivor walks to. */
  x: number;
  lvl: Level;
  blurb: string;
  /** Chapter number in the guide. */
  ch: number;
  items: Product[];
}

export interface CartLine {
  id: string;
  name: string;
  price: number;
}

type RawProduct = [name: string, price: number | null, tagline: string, spec: string, image?: string];
type RawCategory = [id: string, name: string, where: Category['where'], x: number, lvl: Level, blurb: string, items: RawProduct[]];

const AE = 'https://ae-pic-a1.aliexpress-media.com/kf/';
const BB = 'https://www.bigbuy.eu/';

const RAW: RawCategory[] = [
  ['energy', 'Power', 'Surface', 1220, 0, 'The grid had a good run. Solar, wind and batteries for when it stops returning your calls.', [
    ['EcoFlow River 2 Pro Power Station', 413.9, 'LiFePO4 cells. Runs the lamp and the fridge while the street goes dark.', '716 Wh · LiFePO4 · EcoFlow', AE + 'Sb99a506f9d104b23b1f53b75eae465f9w.png_640x640.jpg'],
    ['EcoFlow River 3 Plus Power Station', null, 'Compact backup for the router, the lights and your patience.', '600 W · Portable · EcoFlow', BB + '7607795/Portable%20Power%20Station%20Ecoflow%20River%203%20Plus%20600%20W.jpg'],
    ['ALLPOWERS Foldable Solar Panel', 174.9, 'Unfold, point at the sky, charge everything.', '60–200 W · Foldable · ALLPOWERS', AE + 'S5a2c0abea18b4af388c788d67deb90c2C.png_640x640.jpg'],
    ['MHPOWOS Foldable ETFE Solar Panel', 105.9, 'Pocket-size sun harvesting for phones and power banks.', 'ETFE · Foldable · USB-C + USB-A', AE + 'S01d5b1f8d8384a1a996bc1fbfdd6b841O.jpg_640x640.jpg'],
    ['Hand Crank Solar Power Bank 5-in-1', 64.9, 'Sun when there is sun. Cardio when there is not.', 'Hand crank · Solar · Torch', AE + 'Sb85bf22f92f04bb8b0de91bb080f3e34L.jpg_640x640.jpg']]],
  ['water', 'Water', 'Surface', 990, 0, 'Rivers are free. So is dysentery. Filters, purifiers and storage that keep the two apart.', [
    ['Miniwell L630 Water Filter Straw', 72.9, 'Screws onto a bottle. Turns a lake into a drink.', 'Personal filter · Bottle-mount · Miniwell', AE + 'H4c833e23ad674e2caa926425a4d7cb21S.jpg_640x640.jpg'],
    ['Gravity Water Bag Filter System', 50.9, 'Hang it from a branch, let gravity do the work.', 'Gravity bag · Inline filter · Straw', AE + 'S6bb987ca8def4307abe33dc86a37184c3.jpg_640x640.jpg'],
    ['Lifetime 20 L Foldable Water Carrier', null, 'Twenty litres when full. A pancake when empty.', '20 L · Foldable · Tap', BB + '5559845/water-carrier-lifetime-20-l-foldable_1095003.jpg'],
    ['Naturehike Folding Water Bucket', 27.9, 'From river to camp without spilling half of it.', '10 L · Foldable · Naturehike', AE + 'Sb21592114a3d40dbab7d3451c7bfc4121.jpg_640x640.jpg'],
    ['Mini Water Filter Straw', 15.9, 'Drink straight from questionable sources.', 'Personal filter · Straw · Lightweight', AE + 'S3d8aa9d9ca804445976f736c622e817bF.jpg_640x640.jpg']]],
  ['food', 'Grow & Forage', 'Surface', 665, 0, 'Seeds, beds and traps for the post-supermarket diet.', [
    ['Heirloom Seed Vault, 32 varieties', 59, 'Open-pollinated. Plant once, save seeds, repeat forever.', '32 varieties · Sealed mylar · 5-year viability'],
    ['Raised Bed Kit 120×60', 79, 'Your first farm. Fits on a balcony.', 'Galvanised steel · 120×60×30 cm · No tools'],
    ['Forager\'s Field Guide & Pouch', 34, 'Know which mushroom is dinner and which is a sequel.', '220 species · Waterproof pages · Waxed pouch'],
    ['Snare & Fishing Survival Kit', 45, 'Protein, eventually.', 'Line, hooks, wire snares · 260 g · Tin case']]],
  ['comms', 'Comms', 'Surface', 1510, 0, 'Radios that work while the cell towers take a long nap.', [
    ['Hand Crank Solar Emergency Radio 4000 mAh', 60.9, 'News, a torch and a phone charge. Batteries optional.', 'Hand crank · Solar · 4000 mAh', AE + 'S2c99a42402984016a461f73824bac75bi.jpg_640x640.jpg'],
    ['Compact Hand Crank Solar Radio', 34.9, 'Small enough for the 72-hour bag.', 'Hand crank · Solar · Receive only', AE + 'S49401ecb797845ed977a8ae930f87260x.jpg_640x640.jpg'],
    ['Motorola Talkabout T42 Walkie Talkie, 3 pcs', null, 'One for each of you. No licence needed.', 'PMR446 · Licence-free · 3 units', BB + '7220574/Walkie-Talkie%20Motorola%20T42%20Multicolour.jpg'],
    ['Baofeng F22 PMR446 Walkie Talkie, pair', 45.9, 'Talk across the valley without a phone mast.', 'PMR446 · Licence-free · USB-C', AE + 'Sd712bfea29fa408cb9624402a75bf34e3.jpg_640x640.jpg'],
    ['Wio Tracker L1 Pro Meshtastic Node', 75.9, 'Text messages with no towers, no SIM and no bill.', 'LoRa 868 MHz · Meshtastic · GPS', AE + 'Sda4723a14cf34f89b0622ab902667791U.jpeg_640x640.jpg']]],
  ['shelter', 'Shelter', 'Surface', 290, 0, 'Tents, tarps and bivvies. Property prices have never been lower.', [
    ['Nomad 4-Season Tent, 2P', 329, 'Wind, snow, the neighbours. Keeps it all out.', '2 person · 2.9 kg · 5,000 mm hydrostatic'],
    ['Ripstop Tarp 3×3m', 49, 'A roof in four knots.', 'Ripstop nylon · 3×3 m · 16 tie-outs'],
    ['Reflective Emergency Bivvy', 19, 'Keeps 90% of your body heat. And dignity.', 'Mylar-laminate · 110 g · Reusable'],
    ['Paracord 30m, 550 lb', 15, 'The string that holds the apocalypse together.', '7-strand core · 30 m · 250 kg break']]],
  ['fire', 'Fire & Heat', 'Surface', 480, 0, 'Fire: humanity\'s first app. Still no subscription.', [
    ['Ferro Rod XL', 22, '12,000 strikes. Zero matches.', 'Ferrocerium · 12 cm · Steel striker'],
    ['Wood Gasifier Camp Stove', 99, 'Twigs in, dinner out, barely any smoke.', 'Stainless · 900 g · Burns biomass'],
    ['Stormproof Matches, 2×25', 12, 'Burns underwater. Mostly for the drama.', '15 s burn · Waterproof case'],
    ['Army-Grade Wool Blanket', 69, 'Warm when wet. Ugly by design.', '80% wool · 210×150 cm · 1.8 kg']]],
  ['nav', 'Navigation', 'Surface', 100, 0, 'GPS is someone else\'s satellite. A map and a compass are yours.', [
    ['Waterproof Sighting Compass with Pouch', 16.9, 'Points north. Doesn\'t need charging.', 'Sighting lens · Waterproof · Pouch', AE + 'S60905a04d4604caab487a08b4eb65fa6G.jpg_640x640.jpg'],
    ['SenseCAP T1000-E Card GPS Tracker', 85.9, 'Share your position with the group, even off-grid.', 'GPS · LoRa 868 MHz · Meshtastic', AE + 'S1e0e766d966b4ce4b44f88e0816f9bedy.png_640x640.jpg'],
    ['Weatherproof Map Case Notebook', 26.9, 'Paper never loses signal. Now it doesn\'t get wet either.', 'Map case · Notebook · Weatherproof', AE + 'Sb5fff692eadd4f50b158bf4829185559W.jpg_640x640.jpg'],
    ['Survival Signal Mirror', 10.9, 'Be found on purpose.', 'Daylight signalling · Pocket size', AE + 'S053302c38c8f4fc2ae76c20627b7d25dx.jpg_640x640.jpg'],
    ['Clear Waterproof Map Pouch', 3.9, 'Map and passport stay dry at the river crossing.', 'Transparent · Waterproof · Neck strap', AE + 'S63dc80451ac64906bba031da84b13046u.jpg_640x640.jpg']]],
  ['storage', 'Food Storage', 'Bunker', 472, 1, 'Freeze-dried, vacuum-sealed, built to last. Best before: the next civilisation.', [
    ['72-Hour Freeze-Dried Ration Pack', 89, '25-year shelf life. Tastes like "fine".', '9 meals · 6,000 kcal · Just add water'],
    ['Vacuum Sealer + 100 Bags', 119, 'Removes air. Adds years.', 'Double seal · Pulse mode · 100 bags'],
    ['Mylar Bags & Oxygen Absorbers, 50', 29, 'Long-term storage for rice, beans and optimism.', '5-mil mylar · 300 cc absorbers'],
    ['Stackable 20L Grain Bucket', 24, 'Gamma lid. Rodents not invited.', 'Food-grade HDPE · Screw lid · Stackable']]],
  ['medic', 'First Aid', 'Bunker', 685, 1, 'The nearest emergency room is now you.', [
    ['Kerbl First Aid Kit', null, 'Wall-mounted, CE marked, where you can reach it.', 'CE marked · Stocked · Kerbl', BB + '6166705/Fist%20Aid%20kit%20Kerbl.jpg'],
    ['Rhino Rescue Large IFAK Pouch', 56.9, 'Organised for shaking hands. Fill it your way.', 'IFAK · Empty · MOLLE', AE + 'S80f6a7f1e1254e38b5bc95c737e02b9dx.jpg_640x640.jpg'],
    ['Tactical MOLLE First Aid Pouch', 12.9, 'Clips onto any pack. Holds the essentials.', 'MOLLE · Empty · EDC', AE + 'S0f3987604e95438cb9a65fa33dab78f52.jpg_640x640.jpg'],
    ['Compact EVA First Aid Case', 12.9, 'A hard shell for the glovebox or the kitchen drawer.', 'EVA hard case · Empty · Compact', AE + 'Sd68439d021e84dac8cf4a9bdb082c69e4.jpg_640x640.jpg'],
    ['Small Waterproof First Aid Kit', 9.9, 'Plasters and gauze for the bike bag.', 'Stocked · Waterproof · Pocket size', AE + 'S0fc778a04650440f97d58e7527330ae6a.jpg_640x640.jpg']]],
  ['tools', 'Tools', 'Bunker', 972, 1, 'Saws, axes, pliers and light. Duct tape is a lifestyle.', [
    ['Petzl Tikkina Headlamp 300 lm', null, 'Hands free, light where you look.', '300 lm · Petzl · CE', BB + '4561759/LED%20Head%20Torch%20Petzl%20E060AA03%20Red%20300%20Lm%20%281%20Unit%29.jpg'],
    ['Stainless Camping Hatchet', 25.9, 'Splits firewood and arguments.', 'Stainless steel · Paracord handle', AE + 'S493d61ecf3ac4fbc9b93a8d210408d7d2.jpg_640x640.jpg'],
    ['Motion Sensor Rechargeable Headlamp', 17.9, 'Wave to switch it on. Useful when your hands are full.', 'COB LED · Motion sensor · Rechargeable', AE + 'S54fa1f7660ab41e9aa38dcc1bdff9dceR.jpg_640x640.jpg'],
    ['AIRAJ Folding Pruning Saw', 12.9, 'Faster than the axe. Quieter too.', 'Folding · Pruning blade · AIRAJ', AE + 'S99ec0c85c13948538148795235a157b1T.jpg_640x640.jpg'],
    ['Stainless Folding Multi-tool', 11.9, 'Pliers, drivers and more in one pocket.', 'Stainless · Folding · Pliers', AE + 'S226b0b421d2947a4b2e374be8093621fY.jpg_640x640.jpg']]],
  ['security', 'Security', 'Bunker', 1185, 1, 'Alarms, lights and signal blocking. Strictly defensive, mostly against raccoons.', [
    ['Galix Solar Motion Spotlight 300 lm', null, 'Lights up the gate when someone gets close.', '300 lm · Solar · Motion sensor', BB + '5567733/Solar%20lamp%20Galix%20G4565%20300%20Lm.jpg'],
    ['Solar Motion Sensor Wall Light', 11.9, 'No wiring. Switches on when it matters.', 'Solar · Motion sensor · IP65', AE + 'Sda19156631c640a9aa57ce5b346a5d37x.jpg_640x640.jpg'],
    ['Wireless PIR Motion Alarm', 8.9, 'Hear them before they hear you.', 'PIR sensor · Wireless chime', AE + 'HTB1KR2iX5DxK1Rjy1zcq6yGeXXaK.jpg_640x640.jpg'],
    ['Faraday Bag Set, 4 sizes', 3.9, 'Keeps phones and keys off the radar.', 'Signal blocking · 4 sizes', AE + 'S31c606a61abc47d2b9d3a8fb21b2b18cX.png_640x640.jpg']]],
];

export const BOOK: CartLine = { id: 'book', name: 'Survival Base · The Guide', price: 49 };

/** Y coordinate of the survivor's feet on each floor: surface, upper bunker, lower bunker. */
export const FEET = [425, 722, 937] as const;
/** X of the shaft; changing floors always goes through here. */
export const SHAFT_X = 820;

export const pad = (n: number) => String(n).padStart(2, '0');

/** "€49" for whole euros, "€64.90" otherwise; "Price soon" while unknown. */
export const money = (n: number | null) =>
  n === null ? 'Price soon' : '€' + (Number.isInteger(n) ? String(n) : n.toFixed(2));

export const CATS: Category[] = RAW.map((r, i) => ({
  id: r[0], name: r[1], where: r[2], x: r[3], lvl: r[4], blurb: r[5], ch: i + 1,
  items: r[6].map((p, j) => ({ id: r[0] + '-' + j, cat: r[0], name: p[0], price: p[1], tagline: p[2], spec: p[3], image: p[4] })),
}));

export const CAT_BY_ID: Record<string, Category> = Object.fromEntries(CATS.map(c => [c.id, c]));
export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(CATS.flatMap(c => c.items.map(p => [p.id, p])));

export type PlaceId = 'library' | 'stash';
export const PLACES: Record<PlaceId, { x: number; lvl: Level }> = {
  library: { x: 565, lvl: 2 },
  stash: { x: 1075, lvl: 2 },
};

/** Where the hover tooltip centres for each zone. */
export const TIP_X: Record<string, number> = {
  nav: 100, shelter: 290, fire: 480, food: 665, water: 990, energy: 1220, comms: 1470,
  storage: 472, medic: 685, tools: 972, security: 1185, library: 565, stash: 1075,
};

export const isPlace = (id: string): id is PlaceId => id === 'library' || id === 'stash';
