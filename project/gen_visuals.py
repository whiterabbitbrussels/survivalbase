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
             'People shown from the neck down or only hands, no faces, no weapons, no military styling, no text added. '
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
            (out / f'{shot}.prompt.txt').write_text(prompt)
            print('ok', dest)


if __name__ == '__main__':
    main(sys.argv[1:] or list(PRODUCTS))
