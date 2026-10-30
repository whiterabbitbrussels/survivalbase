"""Generate SurvivalBase product visuals with Seedream 5.0 pro (see project/ai-visual-shotlist.md).

Usage: ARK_API_KEY=... [STYLE=ugc] [EU=1] python3 project/gen_visuals.py [slug[:shot] ...]  e.g. miniwell-l630:2
Outputs PNG masters to project/visuals/<slug>/{1-in-use,2-how-it-works,3-specs}.png
"""
import json, os, sys, urllib.request, pathlib

API = 'https://ark.ap-southeast.bytepluses.com/api/v3/images/generations'
MODEL = 'dola-seedream-5-0-pro-260628'
AE = 'https://ae-pic-a1.aliexpress-media.com/kf/'

STYLE = ('Cinematic photograph, natural light, muted earth palette (dark ink brown, warm paper beige, '
         'a small accent of signal orange), slight film grain, shallow depth of field, northern Europe. '
         'Hands and partial figures only, no faces in close-up, no weapons, no military styling, no text, no logos added. '
         'The product must match the reference image exactly: same shape, colours, logos, proportions; no invented features.')

# UGC look: as if shot on a phone by a real customer, not a catalogue.
STYLE_UGC = ('Casual smartphone photo taken by a real customer, user-generated content look: handheld, slightly imperfect framing, '
             'natural available light, everyday real home or outdoor setting with a little clutter, phone camera depth of field and HDR, '
             'not a studio or catalogue shot, no retouched gloss. Muted earthy tones, northern Europe. '
             'People shown from the neck down or only hands: crop every person at the shoulders, no head or face is ever in frame, in every panel. No weapons, no military styling, no text added. '
             'The product must match the reference image exactly: same shape, colours, logos, sockets and proportions; '
             'identical size and model in every panel; no invented features.')
EU = ' The power sockets are European type F (Schuko) sockets.'

SHOTS = {  # shot -> (size, prompt prefix)
    '1-in-use': ('2048x2048', 'Product in use in a real situation, hero image. '),
    '2-how-it-works': ('2048x1152', 'Triptych in one image, three equal vertical panels left to right, each a clear step, no numbers or text: '),
    '3-specs': ('1792x2240', 'Close-up phone photo of the product on a garage workbench or a canvas tarp, no people, no hands, product seen from a 3/4 angle, these details clearly visible: '),
}

PRODUCTS = {
    'ecoflow-river-2-pro': (AE + 'Sb99a506f9d104b23b1f53b75eae465f9w.png_640x640.jpg', 'the EcoFlow River 2 Pro portable power station', {
        '1-in-use': 'On a kitchen table in a Brussels flat during a blackout, rain on the window at dusk, the power station powers a table lamp and a small fridge.',
        '2-how-it-works': '1) hands plug a folding solar panel cable into the power station, 2) close-up of its display showing input watts, 3) a lamp plugged into it glowing in a dark room.',
        '3-specs': 'AC sockets, USB-C ports, front display, carry handle.',
    }),
    'miniwell-l630': (AE + 'H4c833e23ad674e2caa926425a4d7cb21S.jpg_640x640.jpg', 'the Miniwell L630 water filter straw', {
        '1-in-use': 'The filter screwed onto a plastic bottle, a hand filling the bottle from a clear alpine lake, overcast sky.',
        '2-how-it-works': '1) a hand fills a bottle in a stream, 2) hands screw the filter onto the bottle, 3) close-up of two hands holding the bottle with the filter attached, filtered clear water inside, resting on a backpack on a forest trail; nobody is drinking and no head or face appears in this panel.',
        '3-specs': 'filter cartridge, screw thread, mouthpiece.',
    }),
    'energy-2': (AE + 'S5a2c0abea18b4af388c788d67deb90c2C.png_640x640.jpg', 'the ALLPOWERS foldable solar panel', {
        '1-in-use': 'Unfolded on the roof of a camper van parked in the Belgian Ardennes woods, overcast, a cable running to a portable power station.',
        '2-how-it-works': '1) hands unfold the panel on the grass, 2) hands angle it toward the sun with its kickstands, 3) hands plug its cable into a power station.',
        '3-specs': 'kickstands, junction box, folding seams.',
    }),
    'energy-3': (AE + 'S01d5b1f8d8384a1a996bc1fbfdd6b841O.jpg_640x640.jpg', 'the MHPOWOS foldable ETFE solar panel', {
        '1-in-use': 'Hung on the back of a hiking backpack on a forest trail, a phone charging from it through a cable.',
        '2-how-it-works': '1) hands unfold the panel, 2) hands clip it onto a backpack, 3) hands plug a phone into its USB port.',
        '3-specs': 'USB-C and USB-A ports, ETFE surface, grommets.',
    }),
    'energy-4': (AE + 'Sb85bf22f92f04bb8b0de91bb080f3e34L.jpg_640x640.jpg', 'the hand crank solar power bank', {
        '1-in-use': 'Hands turning its crank in a dark wood at dusk, its built-in torch switched on.',
        '2-how-it-works': '1) hands turn the crank, 2) its torch lights up a path, 3) a phone charging from it.',
        '3-specs': 'crank handle, solar cell, ports, torch.',
    }),
    'water-1': (AE + 'S6bb987ca8def4307abe33dc86a37184c3.jpg_640x640.jpg', 'the gravity water bag filter system', {
        '1-in-use': 'The bag hung from a branch at a campsite, filtered water running from its hose into a cooking pot.',
        '2-how-it-works': '1) hands fill the bag at a stream, 2) hands hang it from a branch, 3) hands open the clamp and water flows into a pot.',
        '3-specs': 'bag, hose, inline filter, clamp.',
    }),
    'water-3': (AE + 'Sb21592114a3d40dbab7d3451c7bfc4121.jpg_640x640.jpg', 'the Naturehike folding water bucket', {
        '1-in-use': 'Carried full of water by hand from a river toward a campfire.',
        '2-how-it-works': '1) hands unfold the bucket, 2) hands fill it at the river, 3) carried by its handle toward camp.',
        '3-specs': 'the bucket folded flat next to the bucket open, its handles.',
    }),
    'water-4': (AE + 'S3d8aa9d9ca804445976f736c622e817bF.jpg_640x640.jpg', 'the mini water filter straw', {
        '1-in-use': 'Hands holding the straw over a mountain stream, its end dipped in the water, ready to sip.',
        '2-how-it-works': '1) hands remove the cap, 2) the end dipped in a stream, 3) the straw held up with clear water drops, ready to drink.',
        '3-specs': 'both ends, the cap, its size next to a hand.',
    }),
    'comms-0': (AE + 'S2c99a42402984016a461f73824bac75bi.jpg_640x640.jpg', 'the hand crank solar emergency radio 4000 mAh', {
        '1-in-use': 'Dark kitchen during a blackout, hands turning the crank, its torch beam lighting the table.',
        '2-how-it-works': '1) hands turn the crank, 2) a finger turns the tuning dial, 3) a phone charging from its USB port.',
        '3-specs': 'crank, solar panel, torch, dial, USB port.',
    }),
    'comms-1': (AE + 'S49401ecb797845ed977a8ae930f87260x.jpg_640x640.jpg', 'the compact hand crank solar radio', {
        '1-in-use': 'On a sunny windowsill in a family kitchen, people in the background listening, seen from the neck down.',
        '2-how-it-works': '1) the radio on a windowsill in the sun, 2) hands turn the crank, 3) the radio playing on a table next to a cup of coffee.',
        '3-specs': 'its size in a hand, the solar panel, the dial.',
    }),
    'comms-3': (AE + 'Sd712bfea29fa408cb9624402a75bf34e3.jpg_640x640.jpg', 'the Baofeng F22 PMR446 walkie talkie pair', {
        '1-in-use': 'Two hikers in fog on a hill, seen from behind, one pressing the push-to-talk button.',
        '2-how-it-works': '1) a thumb switches a walkie talkie on, 2) both radios side by side set to the same channel, 3) a hand presses push-to-talk, the other hiker far away in the fog.',
        '3-specs': 'antenna, push-to-talk button, USB-C port, channel knob, both units.',
    }),
    'comms-4': (AE + 'Sda4723a14cf34f89b0622ab902667791U.jpeg_640x640.jpg', 'the Wio Tracker L1 Pro Meshtastic node', {
        '1-in-use': 'Clipped to a backpack strap on a mountain trail, a hand holding a phone with no signal bars showing a received text message.',
        '2-how-it-works': '1) the device next to a phone pairing, 2) a thumb typing a message on the phone, 3) a second identical device on a table showing the message on its screen.',
        '3-specs': 'screen, antenna, its size, the clip.',
    }),
    'nav-0': (AE + 'S60905a04d4604caab487a08b4eb65fa6G.jpg_640x640.jpg', 'the waterproof sighting compass with pouch', {
        '1-in-use': 'Hands taking a bearing on a windy ridge, a topographic map on the knee.',
        '2-how-it-works': '1) hands open the compass lid, 2) the compass raised to sight a distant landmark, 3) close-up reading the bearing on the dial.',
        '3-specs': 'sighting lens, bezel, the pouch.',
    }),
    'nav-1': (AE + 'S1e0e766d966b4ce4b44f88e0816f9bedy.png_640x640.jpg', 'the SenseCAP T1000-E card GPS tracker', {
        '1-in-use': 'Attached to a backpack in an alpine valley, a hand holding a phone showing a map with several shared positions.',
        '2-how-it-works': '1) the tracker next to a phone pairing, 2) a finger presses its button, 3) a phone map showing friends positions.',
        '3-specs': 'its card size next to a bank card, the button.',
    }),
    'nav-2': (AE + 'Sb5fff692eadd4f50b158bf4829185559W.jpg_640x640.jpg', 'the weatherproof map case notebook', {
        '1-in-use': 'Open in light rain on a trail, a map inside, a hand writing on it with a pencil.',
        '2-how-it-works': '1) hands slide a map inside, 2) hands close it, 3) a pencil writes on the clear window in the rain.',
        '3-specs': 'clear window, closure, notebook.',
    }),
    'nav-3': (AE + 'S053302c38c8f4fc2ae76c20627b7d25dx.jpg_640x640.jpg', 'the survival signal mirror', {
        '1-in-use': 'A hand on a summit flashing sunlight with the mirror toward a distant helicopter in the sky.',
        '2-how-it-works': '1) an eye-level view through its sight hole, 2) the mirror catches the sun, 3) a bright flash toward the far horizon.',
        '3-specs': 'sight hole, reflective face, lanyard.',
    }),
    'nav-4': (AE + 'S63dc80451ac64906bba031da84b13046u.jpg_640x640.jpg', 'the clear waterproof map pouch', {
        '1-in-use': 'Hanging around the neck of a hiker crossing a shallow stream, seen from the neck down, a map and passport visible inside.',
        '2-how-it-works': '1) hands slide a map and passport in, 2) hands seal it, 3) hung around the neck over a jacket.',
        '3-specs': 'seal, neck strap, transparency.',
    }),
    'medic-1': (AE + 'S80f6a7f1e1254e38b5bc95c737e02b9dx.jpg_640x640.jpg', 'the Rhino Rescue large IFAK pouch', {
        '1-in-use': 'Open in the boot of an SUV at sunset, its compartments visible with bandages and gauze, no medicines.',
        '2-how-it-works': '1) hands unzip the pouch, 2) a hand picks a gauze roll from a compartment, 3) hands wrapping gauze around a forearm.',
        '3-specs': 'compartments, MOLLE webbing, zips.',
    }),
    'medic-2': (AE + 'S0f3987604e95438cb9a65fa33dab78f52.jpg_640x640.jpg', 'the tactical MOLLE first aid pouch', {
        '1-in-use': 'Attached to a hiking pack, opened to show bandages inside, on a forest trail.',
        '2-how-it-works': '1) hands thread its MOLLE straps onto a pack, 2) a hand pulls the rip-away tab, 3) a hand grabs a bandage from it.',
        '3-specs': 'MOLLE straps, pull tab.',
    }),
    'medic-3': (AE + 'Sd68439d021e84dac8cf4a9bdb082c69e4.jpg_640x640.jpg', 'the compact EVA first aid case', {
        '1-in-use': 'Neatly packed in a car glovebox, plasters and gauze inside, no medicines.',
        '2-how-it-works': '1) hands open the case, 2) a hand picks a plaster, 3) hands close it.',
        '3-specs': 'hard shell, interior net.',
    }),
    'medic-4': (AE + 'S0fc778a04650440f97d58e7527330ae6a.jpg_640x640.jpg', 'the small waterproof first aid kit', {
        '1-in-use': 'In the side pocket of a bike bag, a cyclist blurred in the background.',
        '2-how-it-works': '1) hands unzip the kit, 2) a hand applies a plaster to a knee, 3) the kit slid back into a bike bag pocket.',
        '3-specs': 'contents laid out: CE plasters and gauze, no medicines.',
    }),
    'tools-1': (AE + 'S493d61ecf3ac4fbc9b93a8d210408d7d2.jpg_640x640.jpg', 'the stainless camping hatchet', {
        '1-in-use': 'Splitting kindling on a stump at a campsite, blade pointing down at the wood, never toward people.',
        '2-how-it-works': '1) hands set a log on a stump, 2) the hatchet splits it, 3) hands stack the kindling.',
        '3-specs': 'head, paracord grip, sheath.',
    }),
    'tools-2': (AE + 'S54fa1f7660ab41e9aa38dcc1bdff9dceR.jpg_640x640.jpg', 'the motion sensor rechargeable headlamp', {
        '1-in-use': 'Point-of-view shot from the eyes of someone wearing the headlamp in a dark cellar: its beam lights gloved hands fixing a small generator; nobody is visible except the hands.',
        '2-how-it-works': '1) the headlamp lying on a workbench, hands adjusting its strap, 2) a hand waving in front of its sensor as it lights up on the bench, 3) point-of-view: its beam on hands turning a wrench; no head or face in any panel.',
        '3-specs': 'sensor window, strap, USB charge port.',
    }),
    'tools-3': (AE + 'S99ec0c85c13948538148795235a157b1T.jpg_640x640.jpg', 'the AIRAJ folding pruning saw', {
        '1-in-use': 'Gloved hands cutting a dry branch in an autumn wood.',
        '2-how-it-works': '1) gloved hands unfold the saw, 2) a thumb locks the blade, 3) the saw cutting a branch.',
        '3-specs': 'blade teeth, lock, folded size.',
    }),
    'tools-4': (AE + 'S226b0b421d2947a4b2e374be8093621fY.jpg_640x640.jpg', 'the stainless folding multi-tool', {
        '1-in-use': 'Hands tightening a screw on a camp stove with it.',
        '2-how-it-works': '1) hands open the pliers, 2) hands swap to a screwdriver, 3) the tool folded in a palm.',
        '3-specs': 'pliers, drivers, lock.',
    }),
    'security-1': (AE + 'Sda19156631c640a9aa57ce5b346a5d37x.jpg_640x640.jpg', 'the solar motion sensor wall light', {
        '1-in-use': 'Switching on over a barn door at night, lighting a gravel yard.',
        '2-how-it-works': '1) hands screw it onto a wall, 2) the light in daylight charging in the sun, 3) at night it lights up as someone walks by.',
        '3-specs': 'solar panel, PIR motion sensor, weatherproof housing.',
    }),
    'security-2': (AE + 'HTB1KR2iX5DxK1Rjy1zcq6yGeXXaK.jpg_640x640.jpg', 'the wireless PIR motion alarm', {
        '1-in-use': 'The sensor at a cellar entrance, its chime unit on a kitchen table inside.',
        '2-how-it-works': '1) hands place the sensor by a door, 2) hands plug the chime into a wall socket, 3) the chime lit up as someone opens the cellar door.',
        '3-specs': 'sensor, chime, both units.',
    }),
    'security-3': (AE + 'S31c606a61abc47d2b9d3a8fb21b2b18cX.png_640x640.jpg', 'the Faraday bag set in 4 sizes', {
        '1-in-use': 'A phone, a car key and documents going into the bags on a kitchen table.',
        '2-how-it-works': '1) a hand slides a phone into a bag, 2) hands roll the top closed, 3) the phone inside shows no signal through the opened bag later.',
        '3-specs': 'all 4 sizes, roll-top closure.',
    }),
    'food-0': (AE + 'S735be6599fa744ec9743cf68231f927dc.jpg_640x640.jpg', 'the mesh mushroom foraging bag with shoulder strap', {
        '1-in-use': 'Worn across the body in an autumn beech wood, a hand dropping a wild mushroom into it.',
        '2-how-it-works': '1) a hand cuts a mushroom at its base, 2) drops it into the mesh bag, 3) the bag full of mushrooms on a kitchen table at home.',
        '3-specs': 'mesh body, shoulder strap, opening.',
    }),
    'food-1': (AE + 'S33c704ed503447959645f76b0a80abe9f.jpg_640x640.jpg', 'the 25-piece survival fishing kit with pocket reel', {
        '1-in-use': 'Hands casting the line from the pocket reel at a misty lake shore at dawn.',
        '2-how-it-works': '1) hands open the kit case, 2) hands tie a lure onto the line, 3) a small fish on the line by the water.',
        '3-specs': 'pocket reel, hooks, lures and spinners laid out next to the case.',
    }),
    'food-2': (AE + 'S4dedb6ecdb084e629189abf60ae0ce329.jpg_640x640.jpg', 'the canvas and leather bushcraft foraging pouch', {
        '1-in-use': 'Hanging on a belt, a hand putting blackberries into it on a forest path.',
        '2-how-it-works': '1) hands thread it onto a belt, 2) a hand picks berries into it, 3) the pouch opened on a camp table full of finds.',
        '3-specs': 'canvas body, leather trim, belt loop.',
    }),
    'shelter-0': (AE + 'Sc12773a9ca2d45f8879486984c1609e6K.jpg_640x640.jpg', 'the Naturehike Cloud Peak 4-season 2-person tent', {
        '1-in-use': 'Pitched in light snow on a clearing in the Ardennes at dusk, warm light from a headlamp inside.',
        '2-how-it-works': '1) hands lay out the tent and poles, 2) hands clip the inner tent to the poles, 3) the pitched tent with its door open.',
        '3-specs': 'poles, vestibule, guy lines, vents.',
    }),
    'shelter-2': (AE + 'S8df4ec22467248e2bb32bb680ff67c0bG.jpg_640x640.jpg', 'the waterproof camping tarp with 19 hang points', {
        '1-in-use': 'Strung between two trees over a hammock and a camp chair in rain, drops running off the edge.',
        '2-how-it-works': '1) hands tie a line to a tree, 2) hands tension the tarp corner with a stake, 3) people sheltering underneath in the rain, seen from the neck down.',
        '3-specs': 'hang points, reinforced corners, fabric surface.',
    }),
    'shelter-3': (AE + 'Sa9fa9135fce6406c948509cafd9fb03dE.png_640x640.jpg', 'the emergency mylar bivy sleeping bag', {
        '1-in-use': 'A person lying in it on a mossy forest floor at dawn, seen from the shoulders down.',
        '2-how-it-works': '1) hands take it out of its small pouch, 2) hands unfold it, 3) a person zipped inside, from the shoulders down.',
        '3-specs': 'reflective surface, opening, the stuff pouch next to it.',
    }),
    'shelter-4': (AE + 'S14360a9c5a494b54a5749e84d8dd4f7c7.jpg_640x640.jpg', 'the paracord 550 9-core 4 mm', {
        '1-in-use': 'Used as a ridgeline between two trees at a campsite, hands tying a knot.',
        '2-how-it-works': '1) hands unroll the paracord, 2) hands tie a taut-line hitch, 3) a tarp hanging from the cord.',
        '3-specs': 'coiled cord, cut end showing the inner cores.',
    }),
    'fire-0': (AE + 'S0b05873784ed40e3952c2ecf03e09212O.png_640x640.jpg', 'the folding stainless steel wood-burning camp stove', {
        '1-in-use': 'Burning twigs with a pot of water boiling on top at a forest camp at dusk.',
        '2-how-it-works': '1) hands unfold the stove, 2) hands feed twigs into it, 3) a pot boiling on top.',
        '3-specs': 'folding panels, fuel door, pot supports.',
    }),
    'fire-1': (AE + 'S77510e50b9fb47b8ac0cd21d2c4725b3e.jpg_640x640.jpg', 'the CHANGE MOORE secondary-combustion folding wood stove', {
        '1-in-use': 'Burning with clean flames in a garden at dusk, a kettle on top, very little smoke.',
        '2-how-it-works': '1) hands assemble the stove, 2) hands load split wood, 3) clean flames with a kettle on top.',
        '3-specs': 'combustion holes, folding body, ash drawer.',
    }),
    'fire-2': (AE + 'Sff683453d25a47fb9ca2d591c1aa40d33.jpg_640x640.jpg', 'the waterproof magnesium ferro rod fire starter', {
        '1-in-use': 'Hands striking it over a tinder bundle, sparks flying, in a damp forest.',
        '2-how-it-works': '1) hands scrape magnesium shavings onto tinder, 2) hands strike sparks, 3) a small flame catching.',
        '3-specs': 'rod, striker, lanyard.',
    }),
    'fire-3': (AE + 'Sed8a01ef87e3421aa61e4ef27fd9f85cY.png_640x640.jpg', 'the emergency mylar thermal blanket 130x210 cm', {
        '1-in-use': 'Wrapped around the shoulders of a hiker sitting by a fire in the cold, seen from behind.',
        '2-how-it-works': '1) hands open the small packet, 2) hands unfold the blanket, 3) wrapped around the shoulders, seen from behind.',
        '3-specs': 'folded packet, unfolded reflective blanket.',
    }),
    'storage-2': (AE + 'Sc4f2bee893914031aa73a657d8930f10M.jpg_640x640.jpg', 'the 5-gallon mylar bags with oxygen absorbers', {
        '1-in-use': 'In a cellar pantry, hands pouring rice into a mylar bag that stands inside a bucket.',
        '2-how-it-works': '1) hands pour rice into the bag, 2) hands drop in an oxygen absorber, 3) hands seal the top with a household iron.',
        '3-specs': 'bag, oxygen absorber packets, sealed top.',
    }),
    'storage-3': (AE + 'S910fd924e70749548c6136a7ff855df5x.jpg_640x640.jpg', 'the food-grade airtight grain storage box', {
        '1-in-use': 'On a pantry shelf full of rice and beans, a hand opening its lid.',
        '2-how-it-works': '1) hands pour rice into the box, 2) hands press the airtight lid shut, 3) several boxes stacked on a shelf.',
        '3-specs': 'lid seal, pouring spout, measuring cup if present in the reference.',
    }),
    'energy-5': (AE + 'S7f58fc4b2095403198fe7a09a861181di.jpg_640x640.jpg', 'the salt water emergency lamp (green pouch with a white LED module and a rope handle)', {
        '1-in-use': 'Hanging by its rope from a hook in a dark kitchen during a blackout, its LED lighting a table with candles unlit and a glass of salty water.',
        '2-how-it-works': '1) hands pour salt into a glass of water and stir, 2) hands fill the pouch with the salt water, 3) the lamp glowing, hung inside a tent at night.',
        '3-specs': 'LED module, pouch, rope handle, fill opening.',
    }),
    'energy-6': (AE + 'Scd6ec1131e62482e85d58da8fb2c6502d.jpg_640x640.jpg', 'the hand-squeeze dynamo flashlight', {
        '1-in-use': 'A hand squeezing its lever in a dark hallway during a power cut, its beam on the floor.',
        '2-how-it-works': '1) a hand picks it from a drawer, 2) fingers squeeze the lever repeatedly, 3) its beam lighting a fuse box in the dark.',
        '3-specs': 'squeeze lever, lens, body.',
    }),
    'water-5': (AE + 'S0d3416dfed5d42a3ae56f9681fbb4b462.png_640x640.jpg', 'the 20 L solar shower bag', {
        '1-in-use': 'Hanging from a tree branch at a campsite, a hand turning on its shower head, water running.',
        '2-how-it-works': '1) hands fill the bag at a tap, 2) the bag lying in the sun on a wooden deck, 3) hung from a branch with water running from the shower head onto hands.',
        '3-specs': 'black bag, shower head, hanging handle, fill cap.',
    }),
    'water-6': (AE + 'S028a86f373164a059936e05846ce22a2A.jpg_640x640.jpg', 'the collapsible water tank with tap', {
        '1-in-use': 'Full of water on a kitchen counter during a water cut, a hand filling a glass from its tap.',
        '2-how-it-works': '1) the tank folded flat in a cupboard, 2) hands filling it at a sink, 3) a glass being filled from its tap.',
        '3-specs': 'tap, handle, folded vs full.',
    }),
    'food-4': (AE + 'S2c0b728c9d0a486783bd7a5f92830af0q.jpg_640x640.jpg', 'the sprouting jar kit', {
        '1-in-use': 'On a kitchen windowsill, jars full of fresh green sprouts, a hand taking a pinch.',
        '2-how-it-works': '1) hands pour seeds into a jar, 2) the jars tilted on their stand to drain, 3) jars full of green sprouts.',
        '3-specs': 'mesh lids, jars, drainage stand.',
    }),
    'shelter-5': (AE + 'Sdae6e767d43e4141b87741e4271aed85t.jpg_640x640.jpg', 'the folding emergency toilet', {
        '1-in-use': 'Set up in a small bathroom with the lights off and a lantern on, during a water cut.',
        '2-how-it-works': '1) hands unfold the toilet, 2) hands fit a bag under the seat, 3) the toilet ready with its lid closed.',
        '3-specs': 'folding legs, lid, bag holder.',
    }),
    'shelter-6': (AE + 'S6dfefc9e1a7c4e15832521993618bdffa.jpg_640x640.jpg', 'the emergency toilet bags', {
        '1-in-use': 'A pack of the bags on a bathroom shelf next to a folding toilet, a hand taking one.',
        '2-how-it-works': '1) a hand takes a bag from the pack, 2) hands fit it over a toilet seat, 3) hands tie it closed.',
        '3-specs': 'pack, single bag unfolded, tie closure.',
    }),
    'fire-5': (AE + 'S1db3b4c49c5541be94d0bd80378f007ck.jpg_640x640.jpg', 'the thermoelectric stove-top fan', {
        '1-in-use': 'Spinning on top of a cast-iron wood stove in a cosy cabin at night, fire visible through the stove door.',
        '2-how-it-works': '1) hands place the fan on the cold stove top, 2) the fire lit inside the stove, 3) the fan blades spinning, motion blur.',
        '3-specs': 'blades, heat sink base, thermoelectric module.',
    }),
    'fire-6': (AE + 'S0d0c34acfa514a7192b0ac0dfba8be1br.jpg_640x640.jpg', 'the brass fire piston', {
        '1-in-use': 'Hands striking it down hard on a log at a forest camp, a small ember glowing in a tinder bundle.',
        '2-how-it-works': '1) hands place char cloth in the piston tip, 2) a palm slams the piston down, 3) the glowing ember placed in a tinder nest.',
        '3-specs': 'brass cylinder, piston, o-ring, tinder chamber.',
    }),
    'storage-4': (AE + 'S2fbf40aabfd643c1ab6f09966848e37aQ.jpg_640x640.jpg', 'the cast-iron hand grain mill', {
        '1-in-use': 'Clamped to a wooden kitchen table, a hand turning its crank, flour falling into a bowl.',
        '2-how-it-works': '1) hands clamp it to a table, 2) hands pour wheat into the hopper, 3) flour falling into a bowl.',
        '3-specs': 'hopper, crank, clamp, grinding plates.',
    }),
    'storage-5': (AE + 'A55810aa5c86e4ceabf07f5d5b42045d7L.jpg_640x640.jpg', 'the 12 V compressor fridge', {
        '1-in-use': 'In the back of a van or a garage off-grid setup, lid open showing cold food, powered by a cable to a portable power station.',
        '2-how-it-works': '1) hands plug its 12 V cable into a power station, 2) its display showing a low temperature, 3) hands taking a cold drink out.',
        '3-specs': 'lid, display panel, handles, 12 V socket.',
    }),
    'security-4': (AE + 'S7288f1f1fce847c1957c706187b8b239w.jpg_640x640.jpg', 'the glow-in-the-dark tape', {
        '1-in-use': 'Dark staircase during a blackout, the stair edges glowing green from the tape.',
        '2-how-it-works': '1) hands stick the tape along a stair edge in daylight, 2) the room going dark, 3) the stairs outlined in glowing green.',
        '3-specs': 'roll of tape, glowing strip, backing.',
    }),
    'security-5': (AE + 'S69783d8bc2b54905a124b0f49b5581e5f.jpg_640x640.jpg', 'the FNIRSI GC-01 Geiger counter', {
        '1-in-use': 'A hand holding it over vegetables on a kitchen table, its screen showing a reading.',
        '2-how-it-works': '1) a hand switches it on, 2) held over a glass of water, 3) its screen showing a normal dose reading.',
        '3-specs': 'screen, buttons, sensor window, USB-C port.',
    }),
    'security-6': (AE + 'S6ec38a8aad4e489f9507c93ac1c0469e8.jpg_640x640.jpg', 'the pen dosimeter with dose alarm', {
        '1-in-use': 'Clipped to a jacket pocket on a hiker walking a trail, seen from the neck down.',
        '2-how-it-works': '1) a hand clips it to a pocket, 2) a thumb presses its button, 3) its screen showing the accumulated dose.',
        '3-specs': 'pocket clip, screen, button.',
    }),
}


def gen(prompt, size, ref):
    body = json.dumps({'model': MODEL, 'prompt': prompt, 'size': size, 'image': ref, 'output_format': 'png',
                       'response_format': 'url', 'watermark': False}).encode()
    req = urllib.request.Request(API, body, {'Content-Type': 'application/json',
                                             'Authorization': 'Bearer ' + os.environ['ARK_API_KEY']})
    with urllib.request.urlopen(req, timeout=900) as r:
        return json.load(r)['data'][0]['url']


def main(args):
    ugc, eu = os.environ.get('STYLE') == 'ugc', os.environ.get('EU') == '1'
    style = STYLE_UGC if ugc else STYLE
    folder = 'visuals-ugc' + ('-eu' if eu else '') if ugc else 'visuals'
    for arg in args:
        slug, _, only = arg.partition(':')
        ref, name, shots = PRODUCTS[slug]
        out = pathlib.Path(__file__).parent / folder / slug
        out.mkdir(parents=True, exist_ok=True)
        for shot, (size, prefix) in SHOTS.items():
            if only and not shot.startswith(only):
                continue
            dest = out / f'{shot}.png'
            if dest.exists():
                continue
            prompt = f'{prefix}{shots[shot]} The product is {name}. {style}' + (EU if eu else '')
            for attempt in (1, 2):
                try:
                    url = gen(prompt, size, ref)
                    break
                except (TimeoutError, OSError) as e:
                    print('retry', shot, e)
            else:
                continue
            urllib.request.urlretrieve(url, dest)  # URL expires: download now
            (out / f'{shot}.url').write_text(url)
            (out / f'{shot}.prompt.txt').write_text(prompt)
            print('ok', dest)


if __name__ == '__main__':
    main(sys.argv[1:] or list(PRODUCTS))
