/**
 * blog-content.ts
 * Original guide/blog content for the /blog section.
 * Server-component safe (no 'use client'). Rendered statically for SEO.
 *
 * Blocks use a tiny structured model rather than MDX to stay dependency-free
 * and consistent with library-content.ts. Inline **bold** is supported in
 * paragraph and list text.
 */

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'code'; lang?: string; code: string }
  | { type: 'tip'; text: string };

export type BlogCategory = 'how-to' | 'comparison' | 'troubleshooting';

export interface BlogPost {
  slug: string;
  title: string;
  /** Short excerpt for the index card + meta description. */
  description: string;
  category: BlogCategory;
  readingMinutes: number;
  /** ISO date (absolute). */
  updated: string;
  blocks: BlogBlock[];
  related: string[];
  metaTitle: string;
  metaDescription: string;
}

export const CATEGORY_LABEL: Record<BlogCategory, string> = {
  'how-to': 'How-to',
  comparison: 'Comparison',
  troubleshooting: 'Troubleshooting',
};

export const BLOG_POSTS: BlogPost[] = [
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'svg-vs-png-icons',
    title: 'SVG vs PNG Icons: Which Should You Use?',
    description:
      'SVG and PNG both work for icons, but they behave very differently. Here is how to pick the right format for the web, apps, email, and print.',
    category: 'comparison',
    readingMinutes: 5,
    updated: '2026-06-09',
    metaTitle: 'SVG vs PNG Icons: Which Format Should You Use? | Icony',
    metaDescription:
      'A practical comparison of SVG and PNG icons — scalability, file size, color control, and the right format for web, apps, and email.',
    blocks: [
      { type: 'p', text: 'When you export an icon you usually get two choices: **SVG** or **PNG**. They look identical on screen, so the difference is easy to ignore — until your icon turns blurry on a retina display or a 2 KB graphic balloons into 50 KB. This guide explains what actually separates the two and when to reach for each.' },
      { type: 'h2', text: 'The core difference' },
      { type: 'p', text: 'PNG is a **raster** format: it stores a fixed grid of pixels. SVG is a **vector** format: it stores math (paths, shapes, strokes) that the browser redraws at any size. That single distinction drives almost every trade-off below.' },
      { type: 'h2', text: 'When SVG wins' },
      { type: 'ul', items: [
        'You build for the web or any modern app UI. SVG stays razor-sharp at every size and pixel density.',
        'You want to recolor the icon with CSS, or animate it.',
        'File size matters — a simple icon is often smaller as SVG than as a high-resolution PNG.',
        'You need one asset that works on a phone, a 4K monitor, and a print stylesheet.',
      ] },
      { type: 'h2', text: 'When PNG wins' },
      { type: 'ul', items: [
        'The destination does not understand SVG — many email clients, some legacy CMSes, and a few chat/marketplace tools still only accept raster images.',
        'You need a fixed pixel size for a favicon, an app store asset, or an OG/social preview image.',
        'The icon is highly detailed or photographic, where vector paths offer no advantage.',
      ] },
      { type: 'tip', text: 'Rule of thumb: default to SVG for anything that renders in a browser, and export PNG only when a specific destination requires a fixed raster image.' },
      { type: 'h2', text: 'A note on color and stroke' },
      { type: 'p', text: 'Because SVG is just markup, you can change its color or stroke width after the fact — even with a single CSS line using `currentColor`. A PNG bakes the color in permanently; to change it you must re-export. If you expect to theme an icon (light/dark mode, hover states), SVG saves you a lot of duplicate assets.' },
      { type: 'p', text: 'Icony lets you set the exact color, size, and stroke weight and then export the **same icon** as either SVG or PNG — so you can grab whichever format the job needs without leaving the page.' },
    ],
    related: ['change-svg-icon-color', 'fix-blurry-svg-icons', 'add-icons-to-website'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'change-svg-icon-color',
    title: 'How to Change the Color of an SVG Icon',
    description:
      'Four reliable ways to recolor an SVG icon — from a one-line CSS trick with currentColor to editing the markup directly.',
    category: 'how-to',
    readingMinutes: 6,
    updated: '2026-06-09',
    metaTitle: 'How to Change the Color of an SVG Icon (4 Ways) | Icony',
    metaDescription:
      'Recolor any SVG icon with CSS currentColor, the fill/stroke attributes, inline styles, or a tool. With copy-paste code examples.',
    blocks: [
      { type: 'p', text: 'Changing an SVG icon’s color trips up a lot of people because it depends on **how the SVG is drawn** — some icons are filled, others are stroked — and on **how you embedded it**. Here are the four approaches that actually work, from easiest to most manual.' },
      { type: 'h2', text: '1. The currentColor trick (best for inline SVG)' },
      { type: 'p', text: 'Most modern icon sets (Lucide, Heroicons, Bootstrap Icons) set `fill="currentColor"` or `stroke="currentColor"`. That keyword means “use the element’s CSS text color,” so you recolor the icon just by setting `color`:' },
      { type: 'code', lang: 'css', code: '.icon { color: #ff5500; }   /* the SVG follows the text color */' },
      { type: 'p', text: 'This is why icons inside a button automatically match the button’s text color. If your icon does **not** change, open the markup and check whether it uses a hard-coded color instead of `currentColor` (see step 3).' },
      { type: 'h2', text: '2. Set fill or stroke directly' },
      { type: 'p', text: 'Filled icons use `fill`; outline icons use `stroke`. Target the right one:' },
      { type: 'code', lang: 'css', code: '.icon-filled  { fill: #2563eb; }\n.icon-outline { stroke: #2563eb; }' },
      { type: 'tip', text: 'A common mistake: setting `fill` on an outline icon (or vice versa) and seeing nothing happen. If `fill` does nothing, the icon is probably stroke-based — try `stroke`.' },
      { type: 'h2', text: '3. Edit the SVG markup' },
      { type: 'p', text: 'If the icon ships with a hard-coded color, change it at the source. Open the `.svg` and replace the color value, or swap it for `currentColor` so CSS can take over:' },
      { type: 'code', lang: 'html', code: '<!-- before -->\n<path fill="#000000" d="..." />\n<!-- after -->\n<path fill="currentColor" d="..." />' },
      { type: 'h2', text: '4. Use a tool (no code)' },
      { type: 'p', text: 'If you just need a colored asset to hand off, a visual editor is fastest. In Icony you pick any icon, choose a color (or the eyedropper / hex input), and export the recolored icon as SVG or PNG — no markup editing required. You can also copy the result as ready-to-paste SVG or a React component.' },
    ],
    related: ['svg-vs-png-icons', 'svg-to-react-component', 'fix-blurry-svg-icons'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'svg-to-react-component',
    title: 'How to Turn an SVG Icon into a React Component',
    description:
      'Three ways to use an SVG in React — inline JSX, a reusable component with props, and tooling like SVGR — plus the gotchas that cause errors.',
    category: 'how-to',
    readingMinutes: 6,
    updated: '2026-06-09',
    metaTitle: 'How to Use an SVG Icon as a React Component | Icony',
    metaDescription:
      'Convert an SVG into a React/JSX component the right way: camelCase attributes, currentColor, prop spreading, and SVGR — with examples.',
    blocks: [
      { type: 'p', text: 'Pasting raw SVG into JSX usually throws an error, because JSX is not HTML. With a few adjustments an SVG becomes a clean, reusable React component. Here is how to do it by hand and with tooling.' },
      { type: 'h2', text: 'Step 1: fix the attributes' },
      { type: 'p', text: 'JSX expects **camelCase** attribute names. Convert the SVG’s hyphenated attributes and rename `class`:' },
      { type: 'ul', items: [
        '`stroke-width` → `strokeWidth`',
        '`stroke-linecap` → `strokeLinecap`',
        '`fill-rule` → `fillRule`, `clip-rule` → `clipRule`',
        '`class` → `className`',
      ] },
      { type: 'h2', text: 'Step 2: wrap it in a component' },
      { type: 'p', text: 'Spread `props` onto the root `<svg>` so callers can override size, color, and className:' },
      { type: 'code', lang: 'tsx', code: "export function StarIcon(props: React.SVGProps<SVGSVGElement>) {\n  return (\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\n         strokeWidth={2} {...props}>\n      <path d=\"M12 2l3 7 7 .5-5 4.5 1.5 7L12 17l-6 4 1.5-7-5-4.5L9 9z\" />\n    </svg>\n  );\n}" },
      { type: 'p', text: 'Using `stroke="currentColor"` means the icon inherits the surrounding text color, so `<StarIcon className="text-yellow-500" />` just works.' },
      { type: 'h2', text: 'Step 3 (optional): automate with SVGR' },
      { type: 'p', text: 'For many icons, a tool beats hand-conversion. **SVGR** turns `.svg` files into components, and most bundlers have a plugin:' },
      { type: 'code', lang: 'tsx', code: "// with the SVGR webpack/vite plugin\nimport StarIcon from './star.svg?react';\n\n<StarIcon width={24} className=\"text-yellow-500\" />" },
      { type: 'tip', text: 'Watch out for duplicate `id` attributes when you inline multiple SVGs — gradients and clip-paths with the same id collide. Give each a unique id or let SVGR namespace them.' },
      { type: 'h2', text: 'The shortcut' },
      { type: 'p', text: 'In Icony you can pick an icon, set its color and stroke, and hit **Copy JSX** to get a ready-to-paste React component — attributes already camelCased and `props` spread for you. Handy when you just need one or two icons without setting up a build plugin.' },
    ],
    related: ['change-svg-icon-color', 'svg-vs-png-icons', 'lucide-vs-tabler-vs-heroicons'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'lucide-vs-tabler-vs-heroicons',
    title: 'Lucide vs Tabler vs Heroicons: Which Icon Library?',
    description:
      'A side-by-side look at three popular open-source icon sets — size, style, stroke control, and which projects each one fits best.',
    category: 'comparison',
    readingMinutes: 7,
    updated: '2026-06-09',
    metaTitle: 'Lucide vs Tabler vs Heroicons: Icon Library Comparison | Icony',
    metaDescription:
      'Compare Lucide, Tabler, and Heroicons by icon count, style, stroke control, and license to choose the right open-source icon set.',
    blocks: [
      { type: 'p', text: 'Lucide, Tabler, and Heroicons are three of the most-used open-source icon libraries — all free, all MIT/ISC licensed, all SVG-based. They overlap a lot, so the right choice comes down to **style, breadth, and how much control you need over stroke width**.' },
      { type: 'h2', text: 'Lucide' },
      { type: 'p', text: 'A community-maintained fork of Feather Icons with **1,500+** icons on a consistent 24×24 grid and a clean 2px stroke. Stroke width is adjustable via a prop, so you can match it to your typography. It is the default in many React/Tailwind starter kits.' },
      { type: 'ul', items: [
        'Best for: SaaS dashboards, admin panels, developer tools.',
        'Style: minimal outline, very consistent.',
        'Stroke: fully adjustable.',
      ] },
      { type: 'h2', text: 'Tabler' },
      { type: 'p', text: 'The widest set of the three by far — **5,000+** icons — also on a 24×24 grid with adjustable stroke. If you need something niche (specific brands, file types, obscure objects), Tabler is most likely to have it.' },
      { type: 'ul', items: [
        'Best for: large apps that need broad coverage and many brand/logo glyphs.',
        'Style: outline, with many filled variants.',
        'Stroke: adjustable.',
      ] },
      { type: 'h2', text: 'Heroicons' },
      { type: 'p', text: 'Made by the Tailwind CSS team. Smaller and more curated (**~300** icons across outline and solid variants). The solid set is filled (no stroke control), while the outline set uses a fixed 1.5px stroke. Pairs naturally with Tailwind UI.' },
      { type: 'ul', items: [
        'Best for: Tailwind projects, marketing sites, focused UIs.',
        'Style: two deliberate variants — outline and solid.',
        'Stroke: fixed (outline) / not applicable (solid).',
      ] },
      { type: 'h2', text: 'Quick guide' },
      { type: 'ul', items: [
        'Want broad coverage and obscure icons? **Tabler**.',
        'Want a clean, adjustable, all-purpose set? **Lucide**.',
        'Already on Tailwind and want a curated match? **Heroicons**.',
      ] },
      { type: 'tip', text: 'You do not have to commit blindly. Icony has all three (plus Phosphor, Bootstrap Icons, and Radix) in one place — search across them, compare the same icon side by side, then customize and export.' },
    ],
    related: ['svg-to-react-component', 'add-icons-to-website', 'svg-vs-png-icons'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'fix-blurry-svg-icons',
    title: 'Why Are My SVG Icons Blurry? (And How to Fix It)',
    description:
      'Blurry icons almost always come from a handful of fixable causes — wrong viewBox, half-pixel positioning, or a rasterized export. Here is the checklist.',
    category: 'troubleshooting',
    readingMinutes: 5,
    updated: '2026-06-09',
    metaTitle: 'Why Are My SVG Icons Blurry? How to Fix Fuzzy Icons | Icony',
    metaDescription:
      'Fix blurry or fuzzy icons: missing viewBox, sub-pixel positioning, missing width/height, and accidental PNG exports. A practical checklist.',
    blocks: [
      { type: 'p', text: 'SVG is supposed to be infinitely sharp, so a blurry SVG icon almost always points to one of a few specific causes. Work through this checklist top to bottom.' },
      { type: 'h2', text: '1. You actually exported a PNG' },
      { type: 'p', text: 'The most common culprit. A PNG sized for a 1× display looks soft on a 2×/3× retina screen because the browser scales it up. If sharpness matters and the target supports it, use **SVG instead**. If you must use PNG, export at 2–3× the display size.' },
      { type: 'h2', text: '2. Missing or wrong viewBox' },
      { type: 'p', text: 'Without a `viewBox`, the browser cannot scale the SVG cleanly. Make sure the root element has one that matches the artwork’s coordinate system:' },
      { type: 'code', lang: 'html', code: '<svg viewBox="0 0 24 24" width="24" height="24">…</svg>' },
      { type: 'h2', text: '3. Sub-pixel positioning' },
      { type: 'p', text: 'If an icon sits at a fractional pixel (for example, `left: 10.5px` or inside a fl/grid container that lands on a half pixel), edges get anti-aliased into a blur. Snap the container to whole pixels and avoid odd parent dimensions.' },
      { type: 'tip', text: 'A `transform: translate(...)` with non-integer values, or `scale()` on a parent, can also nudge an icon onto half pixels. Check the computed layout in DevTools.' },
      { type: 'h2', text: '4. CSS scaling a fixed-size raster' },
      { type: 'p', text: 'Setting `width`/`height` in CSS larger than a raster image’s natural size upscales pixels. For SVG this is fine; for PNG it blurs. Match the asset size to its display size, or switch to SVG.' },
      { type: 'h2', text: '5. Background image rendering' },
      { type: 'p', text: 'Icons used as CSS `background-image` can render softly if `background-size` does not match the intrinsic size. Prefer inline SVG or an `<img>` with explicit dimensions for crisp results.' },
      { type: 'p', text: 'When you export from Icony you can choose the exact size and grab a clean SVG (sharp at any scale) or a correctly-sized PNG — which sidesteps most of the causes above.' },
    ],
    related: ['svg-vs-png-icons', 'change-svg-icon-color', 'add-icons-to-website'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'add-icons-to-website',
    title: '3 Ways to Add Icons to Your Website',
    description:
      'Inline SVG, an <img> tag, or an icon font/component library — the three practical ways to put icons on a page, with the trade-offs of each.',
    category: 'how-to',
    readingMinutes: 6,
    updated: '2026-06-09',
    metaTitle: 'How to Add Icons to Your Website (3 Practical Ways) | Icony',
    metaDescription:
      'Add icons to any website with inline SVG, an img tag, or a component/icon library. Pros, cons, and copy-paste examples for each.',
    blocks: [
      { type: 'p', text: 'There is no single “right” way to add an icon to a web page — it depends on whether you need to recolor it, how many icons you have, and your stack. Here are the three approaches that cover almost every case.' },
      { type: 'h2', text: '1. Inline SVG (most control)' },
      { type: 'p', text: 'Paste the SVG markup straight into your HTML. The icon becomes part of the DOM, so you can style it with CSS, recolor it with `currentColor`, and animate it.' },
      { type: 'code', lang: 'html', code: '<button class="btn">\n  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" width="20">\n    <path d="M5 12h14M12 5l7 7-7 7" />\n  </svg>\n  Next\n</button>' },
      { type: 'ul', items: [
        'Pros: full CSS control, recolorable, animatable, no extra request.',
        'Cons: markup gets verbose if you repeat the same icon a lot.',
      ] },
      { type: 'h2', text: '2. An <img> tag (simplest)' },
      { type: 'p', text: 'Reference an `.svg` (or `.png`) file like any image. Clean markup, but the icon is isolated — you cannot recolor an `<img>` SVG with CSS.' },
      { type: 'code', lang: 'html', code: '<img src="/icons/arrow-right.svg" alt="Next" width="20" height="20" />' },
      { type: 'ul', items: [
        'Pros: dead simple, cacheable, keeps HTML tidy.',
        'Cons: no CSS recoloring, one network request per unique icon.',
      ] },
      { type: 'h2', text: '3. A component or icon-font library (best at scale)' },
      { type: 'p', text: 'If you use a framework, an icon library (Lucide, Heroicons, Tabler, …) gives you tree-shakeable components with consistent props:' },
      { type: 'code', lang: 'tsx', code: "import { ArrowRight } from 'lucide-react';\n\n<button>Next <ArrowRight size={20} /></button>" },
      { type: 'ul', items: [
        'Pros: consistent API, easy theming, only ships the icons you import.',
        'Cons: adds a dependency; overkill for a single icon.',
      ] },
      { type: 'tip', text: 'Need just a few icons without installing anything? Use Icony to pick, color, and copy an icon as inline SVG or a React component — then paste it straight into your project.' },
      { type: 'h2', text: 'Which should you choose?' },
      { type: 'ol', items: [
        'A few icons, want full control → inline SVG.',
        'Static images, simplest possible markup → <img>.',
        'A whole app full of icons → a component library.',
      ] },
    ],
    related: ['svg-to-react-component', 'lucide-vs-tabler-vs-heroicons', 'svg-vs-png-icons'],
  },
];

export const ALL_BLOG_SLUGS: string[] = BLOG_POSTS.map((p) => p.slug);

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
