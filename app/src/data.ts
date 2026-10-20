export type Level = 0 | 1 | 2;

export interface Product {
  id: string;
  cat: string;
  name: string;
  price: number;
  tagline: string;
  spec: string;
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

type RawProduct = [name: string, price: number, tagline: string, spec: string];
type RawCategory = [id: string, name: string, where: Category['where'], x: number, lvl: Level, blurb: string, items: RawProduct[]];

const RAW: RawCategory[] = [
  ['energy', 'Power', 'Surface', 1220, 0, 'The grid had a good run. Solar, wind and batteries for when it stops returning your calls.', [
    ['SunCrate 200W Foldable Solar Panel', 289, 'Unfolds in 30 seconds. Charges in daylight. Sulks in clouds.', '200 W peak · 7.4 kg · IP67 · USB-C + Anderson out'],
    ['Breeze-400 Micro Wind Turbine', 349, 'For when the sun clocks out early.', '400 W · 12/24 V · 3-blade · Start-up wind 2.5 m/s'],
    ['Bunker Cell 1kWh Power Station', 899, 'LiFePO4, 3,000 cycles. Outlives most governments.', '1,024 Wh · 2,000 W AC · 12.5 kg · Solar input 800 W'],
    ['Crank & Charge Dynamo', 39, 'Cardio and USB-C in one handle.', '5 V 2 A · 380 g · LED torch']]],
  ['water', 'Water', 'Surface', 990, 0, 'Rivers are free. So is dysentery. Filters, purifiers and storage that keep the two apart.', [
    ['Gravity Pro 10L Filter System', 129, 'Hang it, fill it, walk away. Puddle in, drinkable out.', '0.1 micron hollow fibre · 10 L · 1.7 L/min'],
    ['StrawGuard Personal Filter', 24, 'Drink directly from questionable sources.', '4,000 L lifetime · 45 g · No chemicals'],
    ['Rain Harvest 200L Collapsible Barrel', 89, 'Clouds, but make it plumbing.', '200 L · PVC tarpaulin · Brass tap · Folds to 8 cm'],
    ['UV Purifier Pen', 69, 'Zaps what you can\'t see in 90 seconds.', 'UV-C · 0.5 L per cycle · USB rechargeable']]],
  ['food', 'Grow & Forage', 'Surface', 665, 0, 'Seeds, beds and traps for the post-supermarket diet.', [
    ['Heirloom Seed Vault, 32 varieties', 59, 'Open-pollinated. Plant once, save seeds, repeat forever.', '32 varieties · Sealed mylar · 5-year viability'],
    ['Raised Bed Kit 120×60', 79, 'Your first farm. Fits on a balcony.', 'Galvanised steel · 120×60×30 cm · No tools'],
    ['Forager\'s Field Guide & Pouch', 34, 'Know which mushroom is dinner and which is a sequel.', '220 species · Waterproof pages · Waxed pouch'],
    ['Snare & Fishing Survival Kit', 45, 'Protein, eventually.', 'Line, hooks, wire snares · 260 g · Tin case']]],
  ['comms', 'Comms', 'Surface', 1510, 0, 'Radios that work while the cell towers take a long nap.', [
    ['BaseBand 5W Dual-Band Radio', 79, 'Talk across the valley. Licence recommended.', 'VHF/UHF · 5 W · 2,200 mAh · IP54'],
    ['Crank/Solar Weather Radio', 59, 'News, when there is news.', 'AM/FM/NOAA · Hand crank · Solar · SOS beacon'],
    ['Mesh Messenger, pair', 149, 'Text without towers, up to 10 km line of sight.', 'LoRa · Bluetooth to phone · 3-day battery'],
    ['Telescopic 7m Antenna Mast', 119, 'Altitude is range.', 'Aluminium · 7 m · Guy kit included']]],
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
    ['Baseplate Compass with Mirror', 39, 'Points north. Doesn\'t need charging.', 'Liquid-damped · Sighting mirror · Declination adjust'],
    ['Waterproof Regional Map Set', 29, 'Paper never loses signal.', '1:50,000 · Tear-proof · 6 sheets'],
    ['Solar GPS Locator', 189, 'For as long as the satellites stay up.', 'GPS/Galileo · Solar · Breadcrumb track'],
    ['Signal Mirror & Whistle Kit', 14, 'Be found on purpose.', 'Glass mirror · 120 dB whistle · Lanyard']]],
  ['storage', 'Food Storage', 'Bunker', 472, 1, 'Freeze-dried, vacuum-sealed, built to last. Best before: the next civilisation.', [
    ['72-Hour Freeze-Dried Ration Pack', 89, '25-year shelf life. Tastes like "fine".', '9 meals · 6,000 kcal · Just add water'],
    ['Vacuum Sealer + 100 Bags', 119, 'Removes air. Adds years.', 'Double seal · Pulse mode · 100 bags'],
    ['Mylar Bags & Oxygen Absorbers, 50', 29, 'Long-term storage for rice, beans and optimism.', '5-mil mylar · 300 cc absorbers'],
    ['Stackable 20L Grain Bucket', 24, 'Gamma lid. Rodents not invited.', 'Food-grade HDPE · Screw lid · Stackable']]],
  ['medic', 'First Aid', 'Bunker', 685, 1, 'The nearest emergency room is now you.', [
    ['Field Trauma Kit, 180 pcs', 129, 'Organised for shaking hands.', '180 pieces · Colour-coded pouches · MOLLE'],
    ['Windlass Tourniquet', 32, 'One-hand application. Practise before you need it.', 'Windlass · 3.8 cm strap · Time tag'],
    ['Water-Free Hygiene Set', 27, 'Clean-ish, without the plumbing.', 'Rinse-free wash · Wipes · Toothpowder'],
    ['Pocket Medical Handbook', 19, 'No wifi required.', '280 pages · Waterproof · Illustrated']]],
  ['tools', 'Tools', 'Bunker', 972, 1, 'Multi-tools, axes and repair kits. Duct tape is a lifestyle.', [
    ['Forged Camp Axe', 74, 'Splits wood and arguments.', 'Carbon steel · Hickory handle · 1.1 kg'],
    ['16-in-1 Multi-tool', 59, 'Sixteen tools, one pocket.', 'Stainless · Pliers, saw, drivers · 240 g'],
    ['Folding Saw, 25cm', 29, 'Faster than the axe. Quieter too.', 'SK5 blade · Lock-back · 25 cm'],
    ['Repair Kit: Tape, Wire, Epoxy', 34, 'Fix anything at least once.', 'Duct tape · Steel wire · 2-part epoxy']]],
  ['security', 'Security', 'Bunker', 1185, 1, 'Locks, alarms and night vision. Strictly defensive, mostly against raccoons.', [
    ['Perimeter Motion Alarm, 4 sensors', 99, 'Hear them before they hear you.', 'PIR · 400 m range · Battery 1 yr'],
    ['Night Vision Monocular', 249, 'See the raccoon. Judge the raccoon.', 'Digital IR · 200 m · Records video'],
    ['Steel Hatch Lock Kit', 139, 'Because the hatch is the front door.', 'Hardened steel · Internal bolt · 2 keys'],
    ['Faraday Bag Set, 3', 45, 'Keeps electronics safe from EMPs and curiosity.', 'Triple-layer · 3 sizes · Roll-top']]],
];

export const BOOK: CartLine = { id: 'book', name: 'Survival Base · The Guide', price: 49 };

/** Y coordinate of the survivor's feet on each floor: surface, upper bunker, lower bunker. */
export const FEET = [425, 722, 937] as const;
/** X of the shaft; changing floors always goes through here. */
export const SHAFT_X = 820;

export const pad = (n: number) => String(n).padStart(2, '0');

export const CATS: Category[] = RAW.map((r, i) => ({
  id: r[0], name: r[1], where: r[2], x: r[3], lvl: r[4], blurb: r[5], ch: i + 1,
  items: r[6].map((p, j) => ({ id: r[0] + '-' + j, cat: r[0], name: p[0], price: p[1], tagline: p[2], spec: p[3] })),
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
