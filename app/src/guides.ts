/**
 * Emergency-readiness guides (English only): answer-first pages built around what people
 * actually search for, each linked to the products and kits that solve it.
 * Rendered by GuidePage in the app and as static HTML by scripts/prerender.ts.
 */

export interface GuideSection {
  h2: string;
  body: string[];
  list?: string[];
}

export interface Guide {
  /** URL slug: /guide/<id>/ */
  id: string;
  /** <title>, written for search results. */
  title: string;
  h1: string;
  description: string;
  /** 40–60 word direct answer: the first thing people and AI assistants read. */
  answer: string;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  /** Product ids shown as "What we'd put in it". */
  products: string[];
  sources: [label: string, url: string][];
  updated: string;
}

const BE_READY: [string, string] = ['GOV.UK · Be Ready', 'https://www.gov.uk/prepare'];
const PREPARE: [string, string] = ['GOV.UK · Prepare for emergencies', 'https://prepare.campaign.gov.uk/'];

export const GUIDES: Guide[] = [
  {
    id: 'be-ready-checklist',
    title: 'Be Ready checklist explained: 3 days of emergency supplies · SurvivalBase',
    h1: 'The Be Ready checklist, explained',
    description: 'What the government\'s Be Ready checklist asks you to keep at home for 3 days without power, water or signal, what you probably own already, and what is worth buying.',
    answer: 'The Be Ready campaign asks every household to manage for 3 days without power, running water, phone or internet. That means water (about 3 litres per person per day), food that needs no cooking, a torch, a wind-up or battery radio, a charged power bank, a first aid kit, your medicines, some cash and copies of key documents.',
    sections: [
      {
        h2: 'Why 3 days?',
        body: [
          'Most everyday emergencies, a storm that brings down power lines, a burst water main, local flooding or a cyber attack on a payment system, are usually sorted within about 72 hours. Being able to look after yourself for that long lets emergency services reach the people who need them first.',
          'Three days is also realistic: it fits in a cupboard and does not require a bunker, a generator or six months of tinned beans.',
        ],
      },
      {
        h2: 'The checklist, item by item',
        body: ['Start with what is already in your cupboards, then fill the gaps over a few shopping trips. No panic buying needed.'],
        list: [
          'Water: about 3 litres per person per day for drinking, so 9 litres each for 3 days, plus some for washing and pets.',
          'Food that needs no cooking: tins with ring-pull lids, crackers, peanut butter, dried fruit, cereal bars. Remember a manual tin opener.',
          'A torch with spare batteries, or one you can wind up, so you are not hunting for batteries in the dark.',
          'A radio that works without mains power or signal: wind-up, solar or battery. It is how you hear official updates when phones and internet are down.',
          'A charged power bank and the cables for your phone.',
          'A first aid kit and a supply of any prescription medicines.',
          'Cash in small notes and coins, in case card payments and cash machines stop working.',
          'Copies of important documents (passport, insurance) and a paper list of phone numbers.',
          'Warm layers or blankets, and anything specific to your household: baby supplies, pet food, spare glasses.',
        ],
      },
      {
        h2: 'What you probably already own',
        body: [
          'Most homes already have tins, a first aid box, blankets and a torch somewhere. Check that the torch works, that the batteries are not flat and that the first aid kit has not been raided for plasters. The two things people usually do not have are a radio that runs without mains power and enough stored water.',
        ],
      },
      {
        h2: 'A few things to do this week',
        body: [],
        list: [
          'Write down the number to report a power cut (105) and your family\'s numbers on paper.',
          'Check whether you or someone you care for should join your energy and water supplier\'s Priority Services Register.',
          'Sign up for weather and flood warnings for your area.',
          'Agree with your household where you would meet if you could not get home.',
        ],
      },
    ],
    faq: [
      { q: 'Is the government telling people to stockpile?', a: 'No. The advice is to have enough for about 3 days and to build it up gradually on normal shopping trips. Panic buying is not needed and makes things harder for everyone.' },
      { q: 'How much water do I need for 3 days?', a: 'About 3 litres per person per day for drinking, so 9 litres per person for 3 days. Add extra for washing, cooking and pets.' },
      { q: 'Why a wind-up radio rather than my phone?', a: 'In a power cut or network failure your phone may have no signal and a flat battery. A wind-up or solar radio keeps receiving official broadcasts, and many models also work as a torch and phone charger.' },
    ],
    products: ['comms-0', 'energy-4', 'energy-6', 'water-6', 'medic-4', 'energy-5', 'fire-3', 'storage-3'],
    sources: [BE_READY, PREPARE],
    updated: '2026-11-13',
  },
  {
    id: '72-hour-emergency-kit',
    title: '72-hour emergency kit: complete checklist for home and grab bag · SurvivalBase',
    h1: '72-hour emergency kit: what to put in it',
    description: 'A complete 72-hour emergency kit list for your home and a grab bag by the door: water, food, light, radio, power, first aid, warmth and documents.',
    answer: 'A 72-hour emergency kit holds what you need to manage for 3 days without help: 9 litres of water per person, no-cook food, a torch, a wind-up radio, a power bank, a first aid kit, medicines, cash, copies of documents and warm layers. Keep a full kit at home and a lighter grab bag by the door.',
    sections: [
      {
        h2: 'Home kit vs grab bag',
        body: [
          'Most emergencies mean staying at home without power or water, so your main kit lives in a cupboard. A grab bag is smaller: it is what you take if you have to leave quickly, for example because of flooding or a gas leak. Keep it near the front door, with a pair of shoes and a coat.',
        ],
      },
      {
        h2: 'The home kit (stays in the cupboard)',
        body: [],
        list: [
          'Water: 9 litres per person, in bottles or a collapsible container with a tap.',
          'Food for 3 days that needs no cooking, and a manual tin opener.',
          'Torch or headlamp, plus a lantern for the room.',
          'Wind-up or solar radio.',
          'Power bank, charged, with the right cables.',
          'First aid kit and at least a week of prescription medicines.',
          'Thermal blankets and warm layers.',
          'Bin bags, wet wipes, toilet roll and hand sanitiser.',
          'Cash, spare keys and copies of documents in a waterproof pouch.',
        ],
      },
      {
        h2: 'The grab bag (by the door)',
        body: [],
        list: [
          'A day of water per person and a filter straw.',
          'Compact wind-up radio and torch.',
          'Small power bank or solar charger.',
          'Pocket first aid kit and medicines.',
          'Emergency bivvy or thermal blanket.',
          'Phone numbers on paper, a little cash, a copy of your ID.',
          'A whistle or signal mirror to attract attention.',
        ],
      },
      {
        h2: 'Keep it working',
        body: [
          'Put a reminder in your calendar every six months: rotate the water and food, test the torch and radio, recharge the power bank and replace anything used. A kit with flat batteries is just a box.',
        ],
      },
    ],
    faq: [
      { q: 'Should I buy a ready-made kit or build my own?', a: 'Either works. Building your own from what you already have is cheaper; a ready-made grab bag saves time and makes sure nothing is missing. Most people do both: a bought core plus their own food, medicines and documents.' },
      { q: 'Where should I keep my emergency kit?', a: 'Somewhere everyone in the house knows, easy to reach in the dark: a hallway cupboard or under the stairs. The grab bag goes by the front door.' },
      { q: 'How often should I check it?', a: 'Every six months. Rotate food and water before they expire and recharge anything with a battery.' },
    ],
    products: ['comms-1', 'energy-4', 'water-4', 'medic-4', 'nav-0', 'nav-3', 'shelter-3', 'fire-2', 'water-6', 'energy-6'],
    sources: [BE_READY, PREPARE],
    updated: '2026-11-13',
  },
  {
    id: 'power-cut-what-to-do',
    title: 'Power cut: what to do in the first minute, hour and day · SurvivalBase',
    h1: 'Power cut: what to do',
    description: 'What to do in a power cut, step by step: how to report it, light and heat safely, keep food cold, charge your phone and look after vulnerable neighbours.',
    answer: 'In a power cut, switch on a torch rather than lighting candles, check whether neighbours are affected too, then report it by calling 105. Turn off appliances that could start up when power returns, keep the fridge and freezer closed, and use a power bank or wind-up radio to stay informed.',
    sections: [
      {
        h2: 'The first minute',
        body: [],
        list: [
          'Use a torch or headlamp. Candles cause house fires during power cuts.',
          'Look outside: if the street lights and neighbours are out too, it is a network fault. If only your home is dark, check your fuse box or trip switch.',
          'Call 105 to report it or get an update. It is free and works from any phone.',
        ],
      },
      {
        h2: 'The first hour',
        body: [],
        list: [
          'Switch off cookers, heaters, irons and other appliances that could be dangerous when the power comes back. Leave one light switched on so you know when it returns.',
          'Keep the fridge and freezer doors closed. A closed fridge stays cold for about 4 hours; a full freezer for up to 2 days.',
          'Put your phone in low-power mode and charge it from a power bank. Switch on a radio for local news.',
          'Check on neighbours who are elderly, unwell or rely on powered medical equipment.',
        ],
      },
      {
        h2: 'If it lasts a day or more',
        body: [],
        list: [
          'Stay warm: wear layers, close doors to keep heat in one room, use thermal blankets.',
          'Eat what needs no cooking. Never use a barbecue, camping stove or generator indoors: carbon monoxide kills.',
          'Recharge devices from a solar panel or a portable power station.',
          'Follow updates on the radio and from your network operator.',
        ],
      },
      {
        h2: 'Before the next one',
        body: [
          'Keep a torch in a known drawer, a radio that needs no mains power, a charged power bank and a lantern for each room. If someone in your household depends on electricity for medical equipment, ask your supplier about the Priority Services Register.',
        ],
      },
    ],
    faq: [
      { q: 'What number do I call in a power cut?', a: 'Call 105. It is a free number that connects you to your local electricity network operator, who can tell you what is happening and how long it will last.' },
      { q: 'Are candles safe in a power cut?', a: 'Fire services advise using torches instead. Candles left burning in the dark are a common cause of house fires.' },
      { q: 'How long will food in the fridge stay safe?', a: 'About 4 hours if you keep the door closed. A full freezer stays frozen for up to 48 hours, a half-full one for about 24.' },
    ],
    products: ['energy-6', 'tools-2', 'energy-5', 'comms-0', 'energy-4', 'energy-0', 'fire-3', 'security-4'],
    sources: [PREPARE, BE_READY],
    updated: '2026-11-13',
  },
  {
    id: 'emergency-water-storage',
    title: 'Emergency water storage: how much water to store and how · SurvivalBase',
    h1: 'Emergency water: how much to store, and how',
    description: 'How much water to store for an emergency (3 litres per person per day), how to store it safely, how long it keeps, and how to make other water drinkable.',
    answer: 'Store about 3 litres of drinking water per person per day, so at least 9 litres each for 3 days, plus extra for washing and pets. Sealed bottled water keeps until its date; tap water in clean, food-grade containers should be replaced every 6 months. A filter lets you make other water safer if supplies run out.',
    sections: [
      {
        h2: 'How much water do you need?',
        body: [
          'Plan on 3 litres per person per day just for drinking. For a household of four, that is 36 litres for 3 days. Add water for cooking, brushing teeth and washing, and remember pets, babies and anyone who is ill will need more.',
        ],
      },
      {
        h2: 'How to store it',
        body: [],
        list: [
          'Bottled water: the simplest option. Keep it sealed, in a cool, dark place, and use it before its date.',
          'Tap water: fill clean, food-grade containers to the top, seal them, label them with the date and replace every 6 months.',
          'Collapsible containers with a tap save space when empty and are easy to pour from.',
          'If a storm or water outage is forecast, fill the bath and some saucepans for washing and flushing the toilet.',
        ],
      },
      {
        h2: 'If the stored water runs out',
        body: [
          'Follow advice from your water supplier: they may tell you to boil tap water before drinking. Away from home, a filter straw or gravity filter removes bacteria and sediment from streams and rainwater. Filters do not remove chemicals, so avoid water that may be contaminated by floods or fuel.',
        ],
      },
    ],
    faq: [
      { q: 'How much water should I store per person?', a: 'About 3 litres per person per day for drinking, so 9 litres per person for a 3-day emergency, plus extra for hygiene and pets.' },
      { q: 'How long can I store tap water?', a: 'Replace tap water stored in clean, sealed, food-grade containers every 6 months. Sealed bottled water lasts until the date on the label.' },
      { q: 'Does a water filter make any water safe?', a: 'Filters remove bacteria, protozoa and sediment, which covers most streams and rainwater. They do not remove chemicals or fuel, so do not drink floodwater even when filtered.' },
    ],
    products: ['water-6', 'water-0', 'water-4', 'water-1', 'water-3', 'shelter-5'],
    sources: [BE_READY, PREPARE],
    updated: '2026-11-13',
  },
  {
    id: 'wind-up-radio',
    title: 'Wind-up radio: why it is on every emergency checklist and how to choose one · SurvivalBase',
    h1: 'Wind-up radio: why you need one and how to choose',
    description: 'Why a wind-up radio is on every emergency list, what to look for (crank, solar, torch, USB phone charging, FM/AM), and which one fits your home or grab bag.',
    answer: 'A wind-up radio keeps you informed when the power, internet and phone networks are down: you charge it by turning a handle or leaving it in the sun, so it never depends on flat batteries. Look for FM and AM reception, a built-in torch, a USB output to charge your phone and a battery you can top up by solar.',
    sections: [
      {
        h2: 'Why it is on the checklist',
        body: [
          'In a large power cut or cyber attack, mobile networks and broadband can fail with the electricity. Broadcast radio keeps working, and it is how official updates reach everyone. A radio that charges itself means you are never stuck looking for batteries.',
        ],
      },
      {
        h2: 'What to look for',
        body: [],
        list: [
          'Hand crank and solar panel: two ways to charge without mains power.',
          'FM and AM (and ideally DAB if you rely on it at home).',
          'A built-in torch, so one device covers two items on the list.',
          'A USB output and a decent internal battery to give your phone an emergency charge.',
          'Size: a larger radio for the home, a compact one for the grab bag.',
        ],
      },
      {
        h2: 'Home radio or grab-bag radio?',
        body: [
          'For the home kit, choose a model with a larger battery, a torch and phone charging: it replaces three items on the Be Ready list. For a grab bag, a compact receive-only radio is lighter and easier to carry.',
        ],
      },
    ],
    faq: [
      { q: 'Does a wind-up radio need batteries?', a: 'No. It has a built-in rechargeable battery that you top up by turning the crank, by solar panel or by USB when there is power.' },
      { q: 'Can a wind-up radio charge my phone?', a: 'Models with a USB output and a larger internal battery can give a phone an emergency top-up. Cranking alone is slow, so keep the radio charged in advance.' },
      { q: 'Why not just use my phone?', a: 'In a power cut or network outage your phone may lose signal and battery. A radio receives broadcasts without a mobile network and without mains power.' },
    ],
    products: ['comms-0', 'comms-1', 'energy-4', 'energy-6'],
    sources: [BE_READY, PREPARE],
    updated: '2026-11-13',
  },
];

export const GUIDE_BY_ID: Record<string, Guide> = Object.fromEntries(GUIDES.map(g => [g.id, g]));

/** Hub page: /guide/ */
export const GUIDES_HUB = {
  title: 'Emergency readiness guides: Be Ready checklist, 72-hour kit, power cuts · SurvivalBase',
  h1: 'Emergency readiness guides',
  description: 'Plain-language guides to being ready for 3 days without power, water or signal: the Be Ready checklist, a 72-hour kit, power cuts, emergency water and wind-up radios.',
  intro: 'Calm, practical answers to the questions people ask before (and during) an emergency. Ready, not scared.',
};
