export type Level = 0 | 1 | 2;

export interface Product {
  id: string;
  cat: string;
  name: string;
  /** Retail price in EUR; null until the supplier price is confirmed. */
  price: number | null;
  tagline: string;
  spec: string;
  /** Main photo: AI shot 1 when available, else the supplier reference photo. */
  image?: string;
  /** AI visuals on Shopify CDN: in use · how it works · specs (project/ai-visual-shotlist.md). */
  gallery?: string[];
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
    ['EcoFlow River 2 Pro Power Station', 462.9, 'LiFePO4 cells. Runs the lamp and the fridge while the street goes dark.', '716 Wh · LiFePO4 · EcoFlow', AE + 'Sb99a506f9d104b23b1f53b75eae465f9w.png_640x640.jpg'],
    ['EcoFlow River 3 Plus Power Station', null, 'Compact backup for the router, the lights and your patience.', '600 W · Portable · EcoFlow', BB + '7607795/Portable%20Power%20Station%20Ecoflow%20River%203%20Plus%20600%20W.jpg'],
    ['ALLPOWERS Foldable Solar Panel', 174.9, 'Unfold, point at the sky, charge everything.', '60–200 W · Foldable · ALLPOWERS', AE + 'S5a2c0abea18b4af388c788d67deb90c2C.png_640x640.jpg'],
    ['MHPOWOS Foldable ETFE Solar Panel', 105.9, 'Pocket-size sun harvesting for phones and power banks.', 'ETFE · Foldable · USB-C + USB-A', AE + 'S01d5b1f8d8384a1a996bc1fbfdd6b841O.jpg_640x640.jpg'],
    ['Hand Crank Solar Power Bank 5-in-1', 64.9, 'Sun when there is sun. Cardio when there is not.', 'Hand crank · Solar · Torch', AE + 'Sb85bf22f92f04bb8b0de91bb080f3e34L.jpg_640x640.jpg'],
    ['Salt Water Emergency Lamp', 24.9, 'Add salt water, get light. No battery to go flat in the drawer.', 'Salt water powered · No battery · Up to 288 h', AE + 'S7f58fc4b2095403198fe7a09a861181di.jpg_640x640.jpg'],
    ['Hand Crank Solar Flashlight', 11.9, 'Crank it or leave it in the sun. Light without hunting for batteries.', 'Hand crank · Solar panel · Built-in battery', AE + 'Scd6ec1131e62482e85d58da8fb2c6502d.jpg_640x640.jpg']]],
  ['water', 'Water', 'Surface', 990, 0, 'Rivers are free. So is dysentery. Filters, purifiers and storage that keep the two apart.', [
    ['Miniwell L630 Water Filter Straw', 72.9, 'Screws onto a bottle. Turns a lake into a drink.', 'Personal filter · Bottle-mount · Miniwell', AE + 'H4c833e23ad674e2caa926425a4d7cb21S.jpg_640x640.jpg'],
    ['Gravity Water Bag Filter System', 50.9, 'Hang it from a branch, let gravity do the work.', 'Gravity bag · Inline filter · Straw', AE + 'S6bb987ca8def4307abe33dc86a37184c3.jpg_640x640.jpg'],
    ['Lifetime 20 L Foldable Water Carrier', null, 'Twenty litres when full. A pancake when empty.', '20 L · Foldable · Tap', BB + '5559845/water-carrier-lifetime-20-l-foldable_1095003.jpg'],
    ['Naturehike Folding Water Bucket', 27.9, 'From river to camp without spilling half of it.', '10 L · Foldable · Naturehike', AE + 'Sb21592114a3d40dbab7d3451c7bfc4121.jpg_640x640.jpg'],
    ['Mini Water Filter Straw', 15.9, 'Drink straight from questionable sources.', 'Personal filter · Straw · Lightweight', AE + 'S3d8aa9d9ca804445976f736c622e817bF.jpg_640x640.jpg'],
    ['Solar Shower Bag 20 L', 20.9, 'Leave it in the sun, get a hot shower. The boiler is optional.', '20 L · Solar heated · Shower head', AE + 'S0d3416dfed5d42a3ae56f9681fbb4b462.png_640x640.jpg'],
    ['Collapsible Water Tank with Tap', 12.9, 'Fill it before the taps go quiet. Folds flat after.', '5–20 L · Foldable · Tap', AE + 'S028a86f373164a059936e05846ce22a2A.jpg_640x640.jpg']]],
  ['food', 'Grow & Forage', 'Surface', 665, 0, 'Bags, lines and planters for the post-supermarket diet.', [
    ['Mesh Mushroom Foraging Bag', 12.9, 'Carries dinner home and sows the next crop on the way.', 'Mesh · Shoulder strap · Spore-friendly', AE + 'S735be6599fa744ec9743cf68231f927dc.jpg_640x640.jpg'],
    ['25-Piece Survival Fishing Kit with Pocket Reel', 50.9, 'Protein, eventually. Now with a reel.', '25 pieces · Pocket reel · Hooks & lures', AE + 'S33c704ed503447959645f76b0a80abe9f.jpg_640x640.jpg'],
    ['Canvas & Leather Bushcraft Foraging Pouch', 6.9, 'A belt pocket for berries, tinder and whatever looks edible.', 'Canvas · Leather trim · Belt loop', AE + 'S4dedb6ecdb084e629189abf60ae0ce329.jpg_640x640.jpg'],
    ['Garden ID Self-Watering Planter 28 L', null, 'A vegetable patch for the balcony that waters itself.', '28 L · 40 cm · Water reserve', BB + '6879699/Self-watering%20flowerpot%20Garden%20ID%20Anthracite.jpg'],
    ['Sprouting Jar Kit', 20.9, 'Fresh greens in three days. No soil, no garden, no excuses.', 'Mesh lids · Jars · Stand', AE + 'S2c0b728c9d0a486783bd7a5f92830af0q.jpg_640x640.jpg']]],
  ['comms', 'Comms', 'Surface', 1510, 0, 'Radios that work while the cell towers take a long nap.', [
    ['Hand Crank Solar Emergency Radio 4000 mAh', 60.9, 'News, a torch and a phone charge. Batteries optional.', 'Hand crank · Solar · 4000 mAh', AE + 'S2c99a42402984016a461f73824bac75bi.jpg_640x640.jpg'],
    ['Compact Hand Crank Solar Radio', 34.9, 'Small enough for the 72-hour bag.', 'Hand crank · Solar · Receive only', AE + 'S49401ecb797845ed977a8ae930f87260x.jpg_640x640.jpg'],
    ['Motorola Talkabout T42 Walkie Talkie, 3 pcs', null, 'One for each of you. No licence needed.', 'PMR446 · Licence-free · 3 units', BB + '7220574/Walkie-Talkie%20Motorola%20T42%20Multicolour.jpg'],
    ['Baofeng F22 PMR446 Walkie Talkie, pair', 45.9, 'Talk across the valley without a phone mast.', 'PMR446 · Licence-free · USB-C', AE + 'Sd712bfea29fa408cb9624402a75bf34e3.jpg_640x640.jpg'],
    ['Wio Tracker L1 Pro Meshtastic Node', 75.9, 'Text messages with no towers, no SIM and no bill.', 'LoRa 868 MHz · Meshtastic · GPS', AE + 'Sda4723a14cf34f89b0622ab902667791U.jpeg_640x640.jpg']]],
  ['shelter', 'Shelter', 'Surface', 290, 0, 'Tents, tarps and bivvies. Property prices have never been lower.', [
    ['Naturehike Cloud Peak 4-Season Tent, 2P', 291.9, 'Wind, snow, the neighbours. Keeps it all out.', '2 person · 4-season · Naturehike', AE + 'Sc12773a9ca2d45f8879486984c1609e6K.jpg_640x640.jpg'],
    ['Naturehike 2-Person Tent, Grey', null, 'Ships from the EU. Pitches before the rain does.', '2 person · Grey · Naturehike', BB + '6281945/tent-naturehike-2381600017851-grey-monochrome-2-persons_1195771.jpg'],
    ['Waterproof Camping Tarp, 19 Hang Points', 55.9, 'A roof in four knots.', '3×3 to 4×4 m · 19 hang points · Waterproof', AE + 'S8df4ec22467248e2bb32bb680ff67c0bG.jpg_640x640.jpg'],
    ['Emergency Mylar Bivy Sleeping Bag', 11.9, 'Keeps your body heat. And your dignity.', 'Mylar · Reusable · Pocket size', AE + 'Sa9fa9135fce6406c948509cafd9fb03dE.png_640x640.jpg'],
    ['Paracord 550, 9-Core 4 mm', 8.9, 'The string that holds the apocalypse together.', '550 lb · 9-core · 4 mm', AE + 'S14360a9c5a494b54a5749e84d8dd4f7c7.jpg_640x640.jpg'],
    ['Folding Emergency Toilet', 50.9, "When the water stops, the bathroom doesn't have to.", 'Folding · Lid · Bag holder', AE + 'Sdae6e767d43e4141b87741e4271aed85t.jpg_640x640.jpg'],
    ['Emergency Toilet Bags', 9.9, 'The refill nobody talks about. Everybody needs.', 'Leak-proof · Tie closure · Pack', AE + 'S6dfefc9e1a7c4e15832521993618bdffa.jpg_640x640.jpg']]],
  ['fire', 'Fire & Heat', 'Surface', 480, 0, 'Fire: humanity\'s first app. Still no subscription.', [
    ['Folding Stainless Wood-Burning Camp Stove', 43.9, 'Twigs in, dinner out. No gas cartridges.', 'Stainless steel · Folding · Burns wood', AE + 'S0b05873784ed40e3952c2ecf03e09212O.png_640x640.jpg'],
    ['CHANGE MOORE Secondary-Combustion Wood Stove', 190.9, 'Burns everything twice. Smokes half as much.', 'Secondary combustion · Folding · Stainless', AE + 'S77510e50b9fb47b8ac0cd21d2c4725b3e.jpg_640x640.jpg'],
    ['Waterproof Magnesium Ferro Rod', 5.9, 'Thousands of strikes. Zero matches.', 'Magnesium · Ferrocerium · Waterproof', AE + 'Sff683453d25a47fb9ca2d591c1aa40d33.jpg_640x640.jpg'],
    ['Emergency Mylar Thermal Blankets 130×210 cm', 13.9, 'Sends 90% of your heat straight back at you.', '130×210 cm · Mylar · Multipack', AE + 'Sed8a01ef87e3421aa61e4ef27fd9f85cY.png_640x640.jpg'],
    ['Rechargeable Flexible Electric Lighter', null, 'No gas, no flint. Charges over USB.', 'USB rechargeable · Flexible neck · InnovaGoods'],
    ['Thermoelectric Stove-Top Fan', 70.9, "Runs on the stove's own heat. No plug, no battery, no idea how. (Physics.)", 'Heat-powered · 6 blades · Stove-top', AE + 'S1db3b4c49c5541be94d0bd80378f007ck.jpg_640x640.jpg'],
    ['Brass Fire Piston', 46.9, 'Fire from a push of air. Like a diesel engine, in your pocket.', 'Brass · Air compression · Tinder chamber', AE + 'S0d0c34acfa514a7192b0ac0dfba8be1br.jpg_640x640.jpg']]],
  ['nav', 'Navigation', 'Surface', 100, 0, 'GPS is someone else\'s satellite. A map and a compass are yours.', [
    ['Waterproof Sighting Compass with Pouch', 16.9, 'Points north. Doesn\'t need charging.', 'Sighting lens · Waterproof · Pouch', AE + 'S60905a04d4604caab487a08b4eb65fa6G.jpg_640x640.jpg'],
    ['SenseCAP T1000-E Card GPS Tracker', 85.9, 'Share your position with the group, even off-grid.', 'GPS · LoRa 868 MHz · Meshtastic', AE + 'S1e0e766d966b4ce4b44f88e0816f9bedy.png_640x640.jpg'],
    ['Weatherproof Map Case Notebook', 26.9, 'Paper never loses signal. Now it doesn\'t get wet either.', 'Map case · Notebook · Weatherproof', AE + 'Sb5fff692eadd4f50b158bf4829185559W.jpg_640x640.jpg'],
    ['Survival Signal Mirror', 10.9, 'Be found on purpose.', 'Daylight signalling · Pocket size', AE + 'S053302c38c8f4fc2ae76c20627b7d25dx.jpg_640x640.jpg'],
    ['Clear Waterproof Map Pouch', 5.9, 'Map and passport stay dry at the river crossing.', 'Transparent · Waterproof · Neck strap', AE + 'S63dc80451ac64906bba031da84b13046u.jpg_640x640.jpg']]],
  ['storage', 'Food Storage', 'Bunker', 472, 1, 'Mylar, vacuum and airtight boxes, built to last. Best before: the next civilisation.', [
    // Price held until the seller confirms EU plug, CE marking and FR/NL manual.
    ['Electric Vacuum Sealer with Built-in Cutter', null, 'Removes air. Adds years.', 'Vacuum + seal · Built-in cutter', AE + 'Sa5c3bd3795f24d408cc44da4535e247bb.jpg_640x640.jpg'],
    ['Alfa AL4451 Vacuum Sealer', null, 'EU plug, CE marked, ships from Spain.', 'Vacuum sealer · EU plug · Alfa', BB + '5111491/Vacuum-sealed%20packaging%20Alfa%20AL4451.jpg'],
    ['5-Gallon Mylar Bags with Oxygen Absorbers, 10', 44.9, 'Long-term storage for rice, beans and optimism.', '5 gallon · 10 bags · O₂ absorbers', AE + 'Sc4f2bee893914031aa73a657d8930f10M.jpg_640x640.jpg'],
    ['Food-Grade Airtight Grain Storage Box', 11.9, 'Rodents not invited.', 'Airtight · Food-grade · Stackable', AE + 'S910fd924e70749548c6136a7ff855df5x.jpg_640x640.jpg'],
    ['Cast-Iron Hand Grain Mill', 107.9, 'Wheat in, flour out. The bakery runs on elbow grease.', 'Cast iron · Clamp-on · Hand crank', AE + 'S2fbf40aabfd643c1ab6f09966848e37aQ.jpg_640x640.jpg'],
    ['12 V Compressor Fridge 21–55 L', 234.9, 'Keeps food cold on a battery or a solar panel.', '12 V · Compressor · App control', AE + 'A55810aa5c86e4ceabf07f5d5b42045d7L.jpg_640x640.jpg']]],
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
    ['Faraday Bag Set, 4 sizes', 5.9, 'Keeps phones and keys off the radar.', 'Signal blocking · 4 sizes', AE + 'S31c606a61abc47d2b9d3a8fb21b2b18cX.png_640x640.jpg'],
    ['Glow-in-the-Dark Tape 5 m', 6.9, 'Charges in daylight, finds the stairs in the blackout.', '5 m · Photoluminescent · Self-adhesive', AE + 'S7288f1f1fce847c1957c706187b8b239w.jpg_640x640.jpg'],
    ['FNIRSI GC-01 Geiger Counter', 87.9, "Hear the radiation you can't see. Check food, water and the wind.", 'X / γ / β · Rechargeable · Trend graph', AE + 'S69783d8bc2b54905a124b0f49b5581e5f.jpg_640x640.jpg'],
    ['Pen Dosimeter with Dose Alarm', 73.9, 'Clips on, counts up, beeps before it matters.', 'Dose alarm · Pocket pen · Rechargeable', AE + 'S6ec38a8aad4e489f9507c93ac1c0469e8.jpg_640x640.jpg']]],
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

/** Site product id → AI visuals uploaded to Shopify, in shot-list order. */
const SC = 'https://cdn.shopify.com/s/files/1/0594/6939/8152/files/';
const GALLERY: Record<string, string[]> = {
  'energy-0': [SC + 'ecoflow-river-2-pro_1-in-use.jpg?v=1793269316', SC + 'ecoflow-river-2-pro_2-how-it-works.jpg?v=1793269316', SC + 'ecoflow-river-2-pro_3-specs.jpg?v=1793269315'],
  'water-0': [SC + 'miniwell-l630_1-in-use.jpg?v=1793269335', SC + 'miniwell-l630_2-how-it-works.jpg?v=1793269418', SC + 'miniwell-l630_3-specs.jpg?v=1793269335'],
  'energy-3': [SC + '1-in-use.jpg?v=1793272044', SC + '2-how-it-works_864b38b5-69bd-4ebd-8144-fa0636199f97.jpg?v=1793272044', SC + '3-specs.jpg?v=1793272044'],
  'energy-4': [SC + '1-in-use_98d49b7f-e8a3-4908-98d6-360c4fcb2748.jpg?v=1793272044', SC + '2-how-it-works.jpg?v=1793272044', SC + '3-specs_46324329-4b51-4a81-80bc-eb1654301102.jpg?v=1793272044'],
  'energy-5': [SC + '1-in-use_5eced0c6-5e46-465f-8104-513bc47a2a2a.jpg?v=1793272044', SC + '2-how-it-works_7b76af2f-f07a-44f7-ba55-f69b0a2534e2.jpg?v=1793272044', SC + '3-specs_18896afb-aab0-4d8e-acaa-da2d376c26d2.jpg?v=1793272045'],
  'food-0': [SC + '1-in-use_3596f47a-1344-4ce5-a559-93802ad92119.jpg?v=1793272045', SC + '2-how-it-works_765b97b0-3768-4b8d-b3bc-9aa8dfa7f879.jpg?v=1793272045', SC + '3-specs_50737334-a509-4802-925d-7fac0657a70a.jpg?v=1793272045'],
  'food-1': [SC + '1-in-use_ad4759e5-62eb-46a0-88e4-2cb6821912e5.jpg?v=1793272045', SC + '2-how-it-works_d6129e69-55f7-4aaf-95b7-72565b00f700.jpg?v=1793272045', SC + '3-specs_e6649994-9848-4550-9e83-80b019fbcd8b.jpg?v=1793272045'],
  'food-2': [SC + '1-in-use_0b60a8aa-e12e-4930-94fe-e51ad736c6ad.jpg?v=1793272045', SC + '2-how-it-works_41621371-79c9-4e44-9575-6a5a5ebfc386.jpg?v=1793272045', SC + '3-specs_02666707-c2bb-49a5-89a0-34bb24f45a82.jpg?v=1793272045'],
  'shelter-0': [SC + '1-in-use_e8521c75-2740-49b8-9c91-23c14280178e.jpg?v=1793272045', SC + '2-how-it-works_700a1050-fbe6-45e9-9e3a-807f46d68c5d.jpg?v=1793272045', SC + '3-specs_b0dcaafc-0576-4237-9c97-002e5bdfc6df.jpg?v=1793272045'],
  'shelter-4': [SC + '1-in-use_1528a528-489d-4912-8fac-ccbbd27811e7.jpg?v=1793272046', SC + '2-how-it-works_21ad1272-6647-497e-9efc-745fec9be024.jpg?v=1793272045', SC + '3-specs_cb0c31c3-b7e9-4361-aede-4cde77c1eea6.jpg?v=1793272046'],
  'fire-0': [SC + '1-in-use_dece2fa3-2fbb-4e0e-b31d-8622aa48395e.jpg?v=1793272046', SC + '2-how-it-works_dec45258-760d-465e-a6c9-5a028cacad26.jpg?v=1793272046', SC + '3-specs_38e58852-dc1b-46fe-95a5-250c8bf3982d.jpg?v=1793272046'],
  'fire-1': [SC + '1-in-use_57100e72-539a-468e-9461-702240ccf1a5.jpg?v=1793272046', SC + '2-how-it-works_993b7944-e7f8-4827-bbf4-b7855056ae3f.jpg?v=1793272046', SC + '3-specs_ce1a475d-7f9d-4d46-b0af-3a981632bc70.jpg?v=1793272046'],
  'fire-2': [SC + '1-in-use_6b1a4f49-809c-45ba-b0d3-28d379a529c2.jpg?v=1793272046', SC + '2-how-it-works_812b1c62-3cb4-4ea5-84fe-885c4f4540f2.jpg?v=1793272046', SC + '3-specs_03a19c5b-7912-4a70-b925-6c24a14e3bab.jpg?v=1793272046'],
  'fire-3': [SC + '1-in-use_9d906d55-0c52-43b5-b623-992bdbb70d41.jpg?v=1793272046', SC + '2-how-it-works_373f1a55-f304-4180-a545-732d07cb849f.jpg?v=1793272046', SC + '3-specs_ae46a6a2-5773-47eb-9ffb-d52483a723fb.jpg?v=1793272046'],
  'storage-2': [SC + '1-in-use_a52deb34-ef46-4f61-9968-ca2b27b982a3.jpg?v=1793272045', SC + '2-how-it-works_f3f924f1-94c9-4667-8ea4-bf6ee3c1e780.jpg?v=1793272045', SC + '3-specs_fb41e575-54c5-44fb-bc3f-b8655ac7d896.jpg?v=1793272045'],
  'storage-3': [SC + '1-in-use_ceab1801-831e-4611-8518-955ed4b53af0.jpg?v=1793272045', SC + '2-how-it-works_4f686417-dc83-48f9-b38c-4109268cc266.jpg?v=1793272045', SC + '3-specs_ff38121d-da73-4020-9af2-a3297d44d2f9.jpg?v=1793272045'],
  'energy-2': [SC + '1-in-use_0670de7a-73ec-4300-b0bd-ecfbc9ad667c.jpg?v=1793272577', SC + '2-how-it-works_0ec93bb4-4b3a-47df-9dc8-c1003b1fa8cc.jpg?v=1793272576', SC + '3-specs_2a39a89b-e75a-4ca4-8b4f-3bad4ede7a16.jpg?v=1793272577'],
  'water-1': [SC + '1-in-use_318817f9-2310-4af3-b86e-47f362f355da.jpg?v=1793272578', SC + '2-how-it-works_36fac6c5-9b08-42a0-a45c-0fadbd491a58.jpg?v=1793272577', SC + '3-specs_b732b676-5cfc-47b7-8572-b62c49a8efa7.jpg?v=1793272577'],
  'water-3': [SC + '1-in-use_e419baf6-0987-413b-889a-cc953a547e86.jpg?v=1793272578', SC + '2-how-it-works_6044dffb-7f59-4442-84ce-f3d7b6f2f371.jpg?v=1793272578', SC + '3-specs_ae5ba2d7-2592-49d7-9256-69e8bca96f09.jpg?v=1793272577'],
  'water-4': [SC + '1-in-use_60a1ef73-2992-4ba3-8203-69cd13bb565e.jpg?v=1793272578', SC + '2-how-it-works_ba027f02-4f6b-46e5-a798-1f7f49e0b7c6.jpg?v=1793272578', SC + '3-specs_700b2119-94fa-4b61-9aad-53f6774bec3d.jpg?v=1793272578'],
  'comms-0': [SC + '1-in-use_98cb0f87-b2b0-452f-a824-154c4f1844c3.jpg?v=1793272578', SC + '2-how-it-works_93cddd76-37b9-4626-bd06-8cfe8d5fae3a.jpg?v=1793272578', SC + '3-specs_a7556947-0eba-4b58-8905-2532491d3f7d.jpg?v=1793272578'],
  'comms-1': [SC + '1-in-use_051d1944-19dc-4f06-80e4-06a24648d83a.jpg?v=1793272578', SC + '2-how-it-works_0e25fb7f-0d9e-4714-92a8-60d192373ead.jpg?v=1793272578', SC + '3-specs_46fdcf1e-520d-4fa2-a506-360a11c6632c.jpg?v=1793272578'],
  'comms-3': [SC + '1-in-use_9fa26c17-3a1a-435b-a47f-f5a9744ce13f.jpg?v=1793272578', SC + '2-how-it-works_0b5a176d-071c-4127-b982-2ed652441c42.jpg?v=1793272579', SC + '3-specs_36d8d45a-a3fa-45f1-b247-d1d0135e47b8.jpg?v=1793272578'],
  'comms-4': [SC + '1-in-use_2aac9260-e13a-49fc-9da3-a8c6b0d456f1.jpg?v=1793272579', SC + '2-how-it-works_ded08a4d-2260-4383-920c-9dc52d4d948e.jpg?v=1793272578', SC + '3-specs_5ec416f7-a8b7-4883-98e8-230700cad840.jpg?v=1793272579'],
  'nav-0': [SC + '1-in-use_1408d7d8-1eb9-4c5b-9f98-2ee824c64eca.jpg?v=1793272579', SC + '2-how-it-works_31922a3e-fb9f-4b01-8d10-e567d4fa6e55.jpg?v=1793272579', SC + '3-specs_099bbaed-6619-4c52-b061-ac0d5104ae2d.jpg?v=1793272578'],
  'nav-1': [SC + '1-in-use_3cd072bd-0c83-4bfd-961a-73f5364beea0.jpg?v=1793272579', SC + '2-how-it-works_5446a1cb-c69f-4681-bfd7-c46ab5171cce.jpg?v=1793272579', SC + '3-specs_d93492c9-c453-4f2b-823e-2c8a9b80d638.jpg?v=1793272579'],
  'nav-2': [SC + '1-in-use_92b503ba-b17f-4bf3-91e4-cbf8d16d7d69.jpg?v=1793272624', SC + '2-how-it-works_7787fe59-4ae3-4ab1-a69a-54ee8d445968.jpg?v=1793272623', SC + '3-specs_037b9456-c93b-4c53-917e-22fe7eef41f0.jpg?v=1793272623'],
  'nav-3': [SC + '1-in-use_729a3dd3-a704-4551-b607-9199640cd24f.jpg?v=1793272624', SC + '2-how-it-works_46a576da-d117-42ac-8e42-74b72a9c906f.jpg?v=1793272624', SC + '3-specs_6c6612a8-c63e-4ea9-b9dd-2f93a1b598ee.jpg?v=1793272624'],
  'nav-4': [SC + '1-in-use_2f3e14b5-2e66-4cf8-96a9-46ced62a1090.jpg?v=1793272624', SC + '2-how-it-works_248aa029-e7c2-4503-95c4-c1f5d57d8896.jpg?v=1793272624', SC + '3-specs_f548de3c-73b1-4eaf-af4f-51aa82526ab7.jpg?v=1793272624'],
  'medic-1': [SC + '1-in-use_3d4b4037-fd83-4b2f-93e9-808e5cae7dce.jpg?v=1793272624', SC + '2-how-it-works_74f9525e-ec8e-49d1-bf36-caceb7eb4be5.jpg?v=1793272624', SC + '3-specs_399904ff-5a8a-4cac-9c6d-d1d93c3e784c.jpg?v=1793272624'],
  'medic-2': [SC + '1-in-use_666f17ab-f9af-48d3-abd5-3ed66ba9bc75.jpg?v=1793272624', SC + '2-how-it-works_bafa7821-5312-430f-82ef-a1c274625d26.jpg?v=1793272624', SC + '3-specs_edb25997-2f05-43a2-9003-2044dca91b23.jpg?v=1793272624'],
  'medic-3': [SC + '1-in-use_f4564541-4fe7-4b6f-af1f-00b9cc02b111.jpg?v=1793272624', SC + '2-how-it-works_fd796c35-c13b-4a5c-b7a8-9a0a5023486a.jpg?v=1793272624', SC + '3-specs_192db229-702f-4f76-bc87-b05e03275a01.jpg?v=1793272624'],
  'medic-4': [SC + '1-in-use_1f8e3990-868c-4c9e-a24e-80f63a38a6ba.jpg?v=1793272625', SC + '2-how-it-works_f0e5f482-a264-4a52-aeb5-07d248abf571.jpg?v=1793272624', SC + '3-specs_433a6394-fbb2-4bfa-9a67-85ee8669a9e6.jpg?v=1793272625'],
  'tools-1': [SC + '1-in-use_7d73d6f9-b53f-4956-87cb-fe04f2b04901.jpg?v=1793272625', SC + '2-how-it-works_de0dea2a-e8d6-43c1-8390-3f81a98dbc2f.jpg?v=1793272625', SC + '3-specs_70cba4ae-f525-4b10-a865-46fd2c5f1b69.jpg?v=1793272625'],
  'tools-3': [SC + '1-in-use_de13a9d4-30ca-4ea1-a7d2-0d185f6f330d.jpg?v=1793272625', SC + '2-how-it-works_4434c8ae-c6d3-4557-89d7-e5346a41fe73.jpg?v=1793272625', SC + '3-specs_86f5173e-47ec-4f78-892b-988e506adb9c.jpg?v=1793272625'],
  'security-1': [SC + '1-in-use_c024d0e5-5697-4fc1-836e-829700d4355e.jpg?v=1793272625', SC + '2-how-it-works_a69fa8b4-e692-4d58-8b4b-13edf85daa19.jpg?v=1793272625', SC + '3-specs_de3f8dee-086d-407d-b499-54136d1b80dd.jpg?v=1793272625'],
  'security-2': [SC + '1-in-use_97481e22-9214-465f-8faa-2680c9e66d41.jpg?v=1793272625', SC + '2-how-it-works_a222d09f-0ee1-44a6-afaa-d08581d95297.jpg?v=1793272625', SC + '3-specs_55716bba-bff9-4196-a3ca-4a085cdd19b1.jpg?v=1793272625'],
  'security-3': [SC + '1-in-use_8dbafad4-ed72-4d2b-bcde-ce2befdf6b29.jpg?v=1793272625', SC + '2-how-it-works_5976890b-8b3f-4b81-941c-c2bfb9f07649.jpg?v=1793272625', SC + '3-specs_7740df50-f5a5-4192-8b2d-288632f4666d.jpg?v=1793272625'],
  'shelter-2': [SC + '1-in-use_5178c593-325f-4574-b79a-c9ad4a62f8ad.jpg?v=1793272577', SC + '2-how-it-works_a23ac5be-8854-43f9-a10a-2e49ccff10a6.jpg?v=1793272577', SC + '3-specs_0be3f881-0cf0-4ce0-b19b-c2b27ddb6371.jpg?v=1793272577'],
  'shelter-3': [SC + '1-in-use_9848bc33-3eda-4e5e-a235-1b2fab1b504d.jpg?v=1793272577', SC + '2-how-it-works_fea8055e-437e-47d9-bc2e-e7158d1ac01a.jpg?v=1793272577', SC + '3-specs_ba24f17a-484c-487f-8a64-db2b551f24ec.jpg?v=1793272577'],
  'tools-2': [SC + '1-in-use_4e7ec264-ac88-40f7-a633-eb7fc76ce576.jpg?v=1793272704', SC + '2-how-it-works_cab78f8c-0da1-428d-86e8-770065a13a95.jpg?v=1793272703', SC + '3-specs_cc577497-2377-4f56-b7dc-45697563652f.jpg?v=1793272703'],
  'tools-4': [SC + '1-in-use_96b15690-bcc7-4233-a43b-ae1164c87914.jpg?v=1793272704', SC + '2-how-it-works_16a35c6b-1dff-47f1-b650-41434ab21dc4.jpg?v=1793272703', SC + '3-specs_8e94423d-0712-4431-a251-b2c41000ab7a.jpg?v=1793272704'],
};

export const CATS: Category[] = RAW.map((r, i) => ({
  id: r[0], name: r[1], where: r[2], x: r[3], lvl: r[4], blurb: r[5], ch: i + 1,
    items: r[6].map((p, j) => ({ id: r[0] + '-' + j, cat: r[0], name: p[0], price: p[4] ? p[1] : null, tagline: p[2], spec: p[3], image: GALLERY[r[0] + '-' + j]?.[0] ?? p[4], gallery: GALLERY[r[0] + '-' + j] })),
}));

export const CAT_BY_ID: Record<string, Category> = Object.fromEntries(CATS.map(c => [c.id, c]));
export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(CATS.flatMap(c => c.items.map(p => [p.id, p])));

export interface Bundle {
  id: string;
  name: string;
  blurb: string;
  /** Site product ids, all sellable. */
  items: string[];
}

/** Kits that combine zones. Product pages show the kits a product belongs to, zone pages the kits that use the zone. */
export const BUNDLES: Bundle[] = [
  { id: 'blackout', name: 'Blackout Kit', blurb: 'Power, light and news for when the street goes dark.', items: ['energy-0', 'energy-2', 'tools-2', 'comms-0', 'energy-5', 'energy-6', 'security-4'] },
  { id: 'grab-and-go', name: '72-Hour Grab Bag', blurb: 'Everything for the first three days, in one pack.', items: ['comms-1', 'energy-4', 'water-4', 'medic-4', 'nav-0', 'nav-3', 'shelter-3', 'fire-2'] },
  { id: 'clean-water', name: 'Clean Water Kit', blurb: 'Carry it, filter it, drink it.', items: ['water-1', 'water-3', 'water-4'] },
  { id: 'off-grid-comms', name: 'Off-Grid Comms Kit', blurb: 'Messages and positions with no towers, powered by the sun.', items: ['comms-4', 'nav-1', 'energy-3'] },
  { id: 'trail', name: 'Trail Kit', blurb: 'Find the way, stay dry, be found.', items: ['nav-0', 'nav-2', 'nav-3', 'nav-4', 'water-0', 'medic-2'] },
  { id: 'perimeter', name: 'Perimeter Kit', blurb: 'Light, alarm and signal blocking for the base.', items: ['security-1', 'security-2', 'security-3', 'tools-2'] },
  { id: 'group-comms', name: 'Group Comms Kit', blurb: 'Talk across the valley and see where everyone is.', items: ['comms-3', 'comms-4', 'nav-1'] },
  { id: 'home-first-aid', name: 'Home First Aid Kit', blurb: 'One for the house, one for the car, one for the bike.', items: ['medic-1', 'medic-3', 'medic-4'] },
  { id: 'bivouac', name: 'Bivouac Kit', blurb: 'A dry night anywhere: tent, tarp, cord and a backup bivvy.', items: ['shelter-0', 'shelter-2', 'shelter-4', 'shelter-3'] },
  { id: 'warmth', name: 'Warmth Kit', blurb: 'Spark, shine and keep the heat you made.', items: ['fire-2', 'fire-3', 'shelter-3', 'fire-6'] },
  { id: 'camp-kitchen', name: 'Camp Kitchen Kit', blurb: 'Fetch water, filter it, boil it on twigs.', items: ['fire-0', 'fire-2', 'water-3', 'water-1'] },
  { id: 'bushcraft-fire', name: 'Bushcraft Fire Kit', blurb: 'Cut, split and burn it clean.', items: ['fire-1', 'fire-2', 'tools-1', 'tools-3'] },
  { id: 'forager', name: 'Forager Kit', blurb: 'Pick it, catch it, carry it home.', items: ['food-0', 'food-1', 'food-2', 'tools-3'] },
  { id: 'pantry', name: 'Long-Term Pantry Kit', blurb: 'Seal it, box it, forget it for a decade.', items: ['storage-2', 'storage-3', 'storage-4', 'food-4'] },
  { id: 'emergency-toilet', name: 'Emergency Toilet Kit', blurb: 'When the taps stop: a toilet, the bags and water in reserve.', items: ['shelter-5', 'shelter-6', 'water-6'] },
  { id: 'radiation-watch', name: 'Radiation Watch Kit', blurb: 'Measure what you cannot see. Hear what is happening.', items: ['security-5', 'security-6', 'comms-0'] },
  { id: 'off-grid-home', name: 'Off-Grid Home Kit', blurb: 'Cold food, fresh flour, a warm room and a hot shower with no grid.', items: ['storage-5', 'storage-4', 'fire-5', 'water-5'] },
  { id: 'camp-tools', name: 'Camp Tools Kit', blurb: 'Cut, split, fix and see what you are doing.', items: ['tools-1', 'tools-3', 'tools-4', 'tools-2'] },
];

export const bundlesFor = (id: string) => BUNDLES.filter(b => b.items.includes(id));
export const bundlesForCat = (cat: string) => BUNDLES.filter(b => b.items.some(id => id.startsWith(cat + '-')));

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
