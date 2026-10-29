"""Print Shopify Admin GraphQL that attaches the 3 AI shots of each product and detaches the supplier photo.

Usage: python3 project/shopify_batch.py id [id ...]   (site ids, e.g. energy-2 water-1)
Seedream URLs (visuals-ugc/<id>/*.url) are valid 24 h, so run the mutation the same day.
"""
import json, pathlib, sys

HERE = pathlib.Path(__file__).parent
IDS = json.loads((HERE / 'shopify_ids.json').read_text())
SHOTS = [('1-in-use', 'in use'), ('2-how-it-works', 'how it works'), ('3-specs', 'details')]


def mutation(ids, names):
    ops, detach = [], []
    for i, sid in enumerate(ids):
        product, supplier_media = IDS[sid]
        media = ', '.join(
            '{originalSource: %s, mediaContentType: IMAGE, alt: %s}'
            % (json.dumps((HERE / 'visuals-ugc' / sid / f'{shot}.url').read_text().strip()), json.dumps(f'{names[sid]}, {label}'))
            for shot, label in SHOTS)
        ops.append(f'u{i}: productUpdate(product: {{id: "gid://shopify/Product/{product}"}}, media: [{media}]) '
                   '{ product { handle } userErrors { message } }')
        if supplier_media:
            detach.append(f'{{id: "gid://shopify/MediaImage/{supplier_media}", referencesToRemove: ["gid://shopify/Product/{product}"]}}')
    if detach:
        ops.append(f'detach: fileUpdate(files: [{", ".join(detach)}]) {{ files {{ id }} userErrors {{ message }} }}')
    return 'mutation { ' + ' '.join(ops) + ' }'


if __name__ == '__main__':
    names = json.loads((HERE / 'names.json').read_text())
    print(mutation(sys.argv[1:], names))
