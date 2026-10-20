# SurvivalBase — web shop

Implementation of the Claude Design prototype `project/SurvivalBase v2.dc.html` (Vite + React + TypeScript).

```
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

## Structure

- `src/data.ts` — the 11 zones (categories), products, the guide, scene coordinates.
- `src/useWalker.ts` — moves the survivor; changing floors always goes through the shaft.
- `src/components/Scene.tsx` — the 1600×1000 cross-section, scaled to the page width. Hover tooltips, library/stash panels (daylight = paper drawer, blackout = green terminal).
- `src/pages/` — home, zone (category) and product pages.
- `src/index.css` — brand tokens (ink `#1F1B16`, paper `#F2EDE2`, orange `#D9692B`), fonts and hover states. No rounded corners anywhere.

## Routes

- `#/` home scene · `#/zone/<id>` category · `#/product/<id>` product
- `?mode=blackout` opens the site in night mode.

## Not done yet

- Images are still striped placeholders (Seedream prompts are in `project/seedream-prompts.md`).
- The cart lives in memory only; "Checkout" shows a toast. A real checkout (e.g. Shopify or Stripe) still needs connecting.
