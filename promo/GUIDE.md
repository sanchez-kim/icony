# Remotion guide — editing the Icony promo

A practical guide to how this video is built, so future edits stay consistent.
Read `src/promo/Promo.tsx` alongside this — every pattern below is used there.

---

## 1. Mental model: video = a function of `frame`

Remotion renders React to video. There is no timeline you scrub; instead **every
frame is rendered independently** by running your components with the current
frame number. The whole composition must be a *pure function of the frame*:

```tsx
const frame = useCurrentFrame();          // 0, 1, 2, … current frame
const { fps, width, height, durationInFrames } = useVideoConfig();
```

Same frame in → same pixels out. This is why animation = "compute a style from
`frame`". Move something by making its position depend on `frame`.

> **Determinism rule:** never use `Date.now()`, `Math.random()`, or real time.
> They'd produce different output per render pass and break things. Drive
> everything off `frame`. (For "randomness", use `frame` + an index, like the
> per-icon offsets in the grid.)

This composition: **1920×1080, 30fps, 516 frames ≈ 17.2s** (`src/Root.tsx`).
At 30fps, `frame / 30 = seconds`.

---

## 2. The two workhorses: `interpolate` and `spring`

**`interpolate`** maps one range to another. This is 80% of all animation.

```tsx
// as frame goes 0→30, opacity goes 0→1
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp', // hold at ends, don't overshoot
});
```

Add easing for non-linear motion:

```tsx
interpolate(frame, [0, 30], [0, 1], { easing: Easing.inOut(Easing.cubic) });
```

**`spring`** gives physically natural, bouncy motion. Returns a value that goes
from 0 → ~1 (overshooting past 1 if underdamped). Use it for entrances.

```tsx
const s = spring({ frame, fps, config: { damping: 11, stiffness: 130, mass: 0.85 } });
// then drive styles off s:
const scale = interpolate(s, [0, 1], [0.5, 1]); // pops in with a slight overshoot
```

In this project the spring config is a shared constant `OVERSHOOT` so every
entrance feels the same. **Reuse it; don't invent new spring configs per scene.**

**Delaying a spring** = subtract a frame offset. This staggers entrances:

```tsx
spring({ frame: frame - delay, fps, config: OVERSHOOT }); // starts `delay` frames later
```

---

## 3. Project conventions (keep these consistent)

These live at the top of `Promo.tsx`:

- **`C`** — the color palette. Always reference `C.indigo`, `C.ink`, etc. Never
  hardcode hex inside a scene.
- **`OVERSHOOT`** — the one spring config. Use it for all entrances.
- **`fontFamily`** — from `loadFont('normal', { weights: [...], subsets: ['latin'] })`.
  Apply it to every text element. Only load the weights you use (avoids a render
  warning about loading 100+ font files).
- **`<Stage tint>`** — the standard scene shell: centers content and paints the
  animated `<Bg>`. Wrap every scene in it. Pass `tint` to color the background
  blobs to match the scene's accent.
- **`<Caption parts delay sub size>`** — the standard kinetic headline (springy
  overshoot entrance + gentle float). `parts` is an array of `{ t, c? }` so you
  can color individual words: `[{ t: 'Any icon. ' }, { t: 'Your style.', c: C.indigo }]`.

A scene is just a component that returns `<Stage>…</Stage>`. Inside it you read
`frame`/`fps` and compute transforms.

---

## 4. The animation recipes used here

All of these are "style = f(frame)". Copy them when adding motion:

| Effect | Technique | Example in code |
|--------|-----------|-----------------|
| **Pop-in entrance** | `spring` → drive scale + opacity | every scene |
| **Staggered entrance** | `spring({ frame: frame - i * k })` per item | grid icons, format cards |
| **Gentle float** | `Math.sin(frame / period) * amp` added to translateY | `Caption`, cards |
| **Breathing/pulse** | `1 + Math.sin(frame / p) * amt` on scale | hook Lottie `breathe` |
| **Heartbeat thump** | short sine pulse on a modulo window | `SceneColor` `beat` |
| **Wave across a grid** | `Math.sin(frame / p - i * phase)` per index | `SceneLibrary` |
| **Color cycling** | `SWATCHES[Math.floor(frame / n) % len]` | `SceneColor` |
| **Value sweep (slider)** | `(Math.sin(frame / p) + 1) / 2` → 0..1, feed `interpolate` | `SceneStroke` |
| **Continuous rotation** | `frame * speed` degrees | settings gear |
| **Shine sweep** | `interpolate(frame % period, …)` moving a gradient bar | `SceneExport` |
| **Arrow nudge** | `Math.max(0, Math.sin(frame / p)) * amp` on translateX | `SceneCTA` |

Rule of thumb: **entrances use `spring`; ambient/looping motion uses `Math.sin(frame/…)`.**
Combining a one-shot spring with an ongoing sine is what keeps scenes from
feeling static after they land.

---

## 5. Scenes & transitions (`TransitionSeries`)

The video is six scenes stitched with `TransitionSeries`:

```tsx
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={82}><SceneHook /></TransitionSeries.Sequence>
  <TransitionSeries.Transition timing={ease} presentation={slide({ direction: 'from-right' })} />
  <TransitionSeries.Sequence durationInFrames={108}><SceneLibrary /></TransitionSeries.Sequence>
  …
</TransitionSeries>
```

- Each `Sequence` runs for `durationInFrames`. **Inside a Sequence, `useCurrentFrame()`
  resets to 0** — so each scene animates from its own frame 0.
- A `Transition` *overlaps* its neighbours by `T` frames (here 14), so the total
  is shorter than the sum of sequences.
- `presentation`: `slide({ direction })` or `fade()`. `timing`: `linearTiming`
  with an `Easing` for the transition curve.

### ⚠️ Keep `PROMO_DURATION` in sync

`Root.tsx` uses `PROMO_DURATION` for the composition length. It is computed as:

```
sum(all Sequence durations) − (numberOfTransitions × T)
```

**If you change any scene's `durationInFrames`, add/remove a scene, or change `T`,
update the `PROMO_DURATION` formula at the bottom of `Promo.tsx`.** If it's too
short the end gets cut; too long and you get frozen dead frames.

---

## 6. Async assets: `delayRender` / `continueRender`

The hook scene loads `hero-morph.json` (the Lottie) at runtime. During rendering,
Remotion would snapshot the frame before `fetch` resolves. You prevent that by
holding the render until the data is ready:

```tsx
const [handle] = useState(() => delayRender('lottie'));
useEffect(() => {
  fetch(staticFile('hero-morph.json')).then(r => r.json())
    .then(j => { setData(j); continueRender(handle); })
    .catch(() => continueRender(handle)); // always continue, even on error
}, [handle]);
```

- `staticFile('x')` resolves a file in `public/`.
- Always call `continueRender` in **both** success and failure paths, or the
  render hangs.

---

## 7. Edit → preview → render → publish

```bash
cd promo
npm install                 # first time only (node_modules is gitignored)
npm run dev                 # Remotion Studio — live preview while editing Promo.tsx
```

In Studio: scrub the timeline, change code, see it hot-reload. Iterate here.

```bash
npx remotion render IconyPromo out/icony-promo.mp4   # final render
```

Publish to the live landing page (the site only plays the MP4 — see
`../src/components/PromoVideo.tsx`):

```bash
cp out/icony-promo.mp4 ../public/icony-promo.mp4
npx remotion still IconyPromo ../public/icony-promo-poster.png --frame=0  # if frame 0 changed
```

Then commit `public/icony-promo.mp4` (+ poster) and push → Vercel redeploys.

> This `promo/` folder is excluded from the Next.js build (`tsconfig.json`
> exclude + `.vercelignore`), so editing it never affects the site until you
> copy a new MP4 over.

---

## 8. Gotchas checklist

1. **Determinism** — no `Date.now()` / `Math.random()` / real time. Drive off `frame`.
2. **`PROMO_DURATION`** — recompute when scene durations / count / `T` change.
3. **Per-scene frame resets to 0** inside each `TransitionSeries.Sequence`.
4. **`continueRender` on every path** for any `delayRender` (incl. `.catch`).
5. **Fonts** — only load weights you use; apply `fontFamily` to all text.
6. **Palette & spring** — use `C` and `OVERSHOOT`, don't hardcode/duplicate.
7. **`clamp`** extrapolation on `interpolate` unless you *want* overshoot past the range.
8. Captions are silent (no audio track by design).

---

### Learn more
- Fundamentals: https://www.remotion.dev/docs/the-fundamentals
- `interpolate`: https://www.remotion.dev/docs/interpolate
- `spring`: https://www.remotion.dev/docs/spring
- Transitions: https://www.remotion.dev/docs/transitions
