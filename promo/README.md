# Icony promo video (Remotion source)

Editable source for the landing-page demo video. This folder is the **video
project** — it is intentionally isolated from the Next.js app: excluded from
`tsconfig.json`, `.vercelignore`, and the Vercel build. It is committed only so
the editable source survives; nothing here ships to production except the
already-rendered MP4.

## What ships to the site

The landing page plays `../public/icony-promo.mp4` (poster:
`../public/icony-promo-poster.png`) via `src/components/PromoVideo.tsx`. Editing
files in this folder changes **nothing** on the live site until you re-render and
copy the new MP4 over those two files.

## Composition

- `src/promo/Promo.tsx` — the video (6 scenes via `TransitionSeries`).
- `src/Root.tsx` — registers composition `IconyPromo`: 1920×1080, 30fps,
  `PROMO_DURATION = 516` frames (~17.2s).
- `src/HelloWorld/*` — leftover Remotion starter template, unused. Safe to delete.

## Setup

```bash
cd promo
npm install        # not committed — node_modules is gitignored
```

## Edit & preview

```bash
npm run dev        # opens Remotion Studio — live preview while you edit Promo.tsx
```

## Render the final MP4

```bash
npx remotion render IconyPromo out/icony-promo.mp4
```

Then publish it to the site by overwriting the two files the landing page uses:

```bash
cp out/icony-promo.mp4 ../public/icony-promo.mp4
# regenerate the poster only if the first frame changed:
npx remotion still IconyPromo ../public/icony-promo-poster.png --frame=0
```

Commit the updated `public/icony-promo.mp4` (+ poster) and push — Vercel
redeploys the landing page with the new video.
