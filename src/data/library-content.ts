/**
 * library-content.ts
 * Rich content data for each icon library — used by /icon-libraries pages.
 * Server-component safe (no 'use client').
 *
 * Measured facts in this file (icon counts, rendered SVG sizes, attributes)
 * were taken from the packages installed in this repo's node_modules:
 *   lucide-react 0.460.0, @tabler/icons-react 3.36.1, @phosphor-icons/react
 *   2.1.10, @heroicons/react 2.2.0, react-bootstrap-icons 1.11.6,
 *   @radix-ui/react-icons 1.3.2.
 * "Rendered SVG" sizes = react-dom/server renderToStaticMarkup() output with
 * default props, measured in bytes; "gzipped" = `gzip -9` of that string.
 * `iconCount` stays the number of icons available inside Icony (it drives the
 * badges and CTA); the full package counts live in `specs`.
 */

export type LibrarySlug =
  | 'lucide'
  | 'tabler'
  | 'phosphor'
  | 'phosphor-fill'
  | 'heroicons'
  | 'heroicons-solid'
  | 'bootstrap'
  | 'radix';

/** A single "label: value" fact shown in the At-a-glance table. */
export interface LibrarySpec {
  label: string;
  value: string;
}

/**
 * A long-form section. Text supports inline `code` spans (backticks).
 * Rendered in order: paragraphs, then bullets, then code.
 */
export interface LibrarySection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  code?: string;
}

export interface LibraryFaq {
  q: string;
  a: string;
}

export interface LibraryContent {
  slug: LibrarySlug;
  name: string;
  tagline: string;
  description: string;
  npm: string;
  iconCount: number;
  license: string;
  url: string;
  color: string;
  features: string[];
  useCases: string[];
  installCmd: string;
  usageCode: string;
  relatedSlugs: LibrarySlug[];
  metaTitle: string;
  metaDescription: string;
  specs: LibrarySpec[];
  sections: LibrarySection[];
  faq: LibraryFaq[];
}

export const LIBRARY_CONTENT: Record<LibrarySlug, LibraryContent> = {
  // -------------------------------------------------------------------------
  lucide: {
    slug: 'lucide',
    name: 'Lucide Icons',
    tagline: 'Stroke-based 24×24 icons with a line weight you can actually change',
    description:
      'Lucide is a stroke-based icon set that began as a community fork of Feather Icons and has grown to about 1,500 icons. Every icon is drawn as open lines on a 24×24 canvas with a default 2px stroke and rounded caps and joins, so a toolbar built from Lucide looks like one person drew it. The lines are real SVG strokes, which means one prop makes the whole set thinner or bolder. Fill-based libraries can’t do that.',
    npm: 'lucide-react',
    iconCount: 1539,
    license: 'ISC',
    url: 'https://lucide.dev',
    color: 'from-orange-500 to-red-500',
    features: [
      'Real SVG strokes: `strokeWidth` changes line weight on every icon',
      '`absoluteStrokeWidth` keeps lines the same pixel width at any size',
      'One ES module per icon and `sideEffects: false` for tree-shaking',
      'Three export names per icon (`House`, `HouseIcon`, `LucideHouse`)',
      'Packages for React, Vue, Svelte and plain JavaScript',
      'ISC license: permissive, no attribution needed in your UI',
    ],
    useCases: [
      'SaaS dashboards and admin tools',
      'Developer tools and documentation sites',
      'Design systems that tune stroke weight globally',
      'Interfaces rendered mostly at 20–24px',
    ],
    installCmd: 'npm install lucide-react',
    usageCode: `import { House, Search, Settings } from 'lucide-react';

export function Toolbar() {
  return (
    <nav className="flex gap-3 text-slate-700">
      {/* Decorative: hide from screen readers */}
      <House size={20} aria-hidden="true" />

      {/* Thinner line for a dense UI */}
      <Search size={20} strokeWidth={1.5} aria-hidden="true" />

      {/* Icon-only button: the label goes on the button */}
      <button aria-label="Settings">
        {/* 2px on screen even though the icon is 40px */}
        <Settings size={40} absoluteStrokeWidth />
      </button>
    </nav>
  );
}`,
    relatedSlugs: ['tabler', 'heroicons'],
    metaTitle: 'Lucide Icons — 1,500+ Stroke Icons for React | Icony',
    metaDescription:
      'Lucide Icons explained: 24×24 grid, 2px round strokes, adjustable strokeWidth, tree-shaking, renamed-icon aliases and ISC license. Measured, with install gotchas.',
    specs: [
      { label: 'Version examined', value: 'lucide-react 0.460.0' },
      { label: 'Icons in the package', value: '1,539 unique (plus 203 alias modules for renamed icons)' },
      { label: 'Icons available in Icony', value: '1,539' },
      { label: 'Canvas', value: '24×24 viewBox' },
      { label: 'Drawing model', value: 'Strokes: `fill="none"`, `stroke="currentColor"`' },
      { label: 'Default stroke', value: '2, round caps and round joins' },
      { label: 'Rendered `House` SVG', value: '402 bytes (255 gzipped)' },
      { label: 'License', value: 'ISC' },
    ],
    sections: [
      {
        heading: 'Design language: what a Lucide icon is made of',
        paragraphs: [
          'Render `<House />` to static markup and you get one `<svg>` with `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`, and both `stroke-linecap` and `stroke-linejoin` set to `round`. Inside are just two `<path>` elements: the door and the outer walls. Outer corners are drawn with 2-unit arcs (`a2 2 0 0 1`) and the door with 1-unit arcs, which is why Lucide reads as soft without looking bubbly.',
          'Because every shape is a stroke rather than a filled outline, line thickness is a live attribute. Pass `strokeWidth={1.5}` and every line in the icon thins uniformly. Fill-based sets such as Phosphor, Bootstrap Icons and Radix Icons bake the line thickness into the path geometry, so the same prop does nothing there.',
          'The catch is that Lucide has exactly one style, with no official filled or duotone version. Setting `fill="currentColor"` fills whatever closed shapes happen to exist. That works for a circle or a heart and looks strange on anything built from open lines, like a house or a gear.',
        ],
      },
      {
        heading: 'What Lucide does well, and where it falls short',
        bullets: [
          'You can adjust the stroke. `absoluteStrokeWidth` divides the stroke by the scale factor (`strokeWidth × 24 / size`), so at `size={48}` the default stroke of 2 is emitted as `stroke-width="1"` and still looks 2px on screen.',
          'Each icon is a small module. The ES module for `House` is 594 bytes before minification (385 gzipped), and the package declares `sideEffects: false`, so bundlers drop icons you never import.',
          'Coverage for product UI is good: arrows, files, text formatting, charts, devices and general-purpose symbols.',
          'Brand marks are on their way out. `Github`, `Figma` and a few other logos still ship, but they are marked `@deprecated` and slated for removal in v1.0. Don’t build on them; use a dedicated brand-icon set.',
          'There is only one style. If your design uses filled icons for active states, you need a second library or hand-made SVGs.',
          'Icons get renamed. Lucide renames icons over time and keeps the old name as an alias. In 0.460.0, 203 of the 1,742 icon files are aliases; `home.js`, for example, just re-exports `house.js`. Old tutorials still compile, but the docs only list the new name.',
          '2px is heavy at 16px. At that size the default stroke is one eighth of the icon, which can look bold next to 14px body text. Many teams drop to 1.5 for dense layouts.',
        ],
      },
      {
        heading: 'When another library is the better pick',
        bullets: [
          'You need matching outline and solid pairs for navigation states. Phosphor has a fill weight for every icon, and Heroicons ships outline and solid sets with identical names.',
          'You need wide domain coverage (medical, finance, hardware, lots of brand logos). Tabler has almost four times as many icons with the same visual grammar.',
          'Most of your icons render at 12–16px in dense tables. A set drawn on a small grid, such as Bootstrap Icons (16×16) or Radix Icons (15×15), will look crisper there.',
        ],
      },
      {
        heading: 'Lucide vs. Tabler vs. Heroicons Outline',
        paragraphs: [
          'Lucide and Tabler render nearly identical root attributes (24×24, 2px strokes, round caps and joins), so they can share an interface without clashing. The practical differences are catalogue size (about 1,500 vs. 5,986), the prop that sets line weight (`strokeWidth` in Lucide, `stroke` in Tabler), and naming (`House` vs. `IconHome`). Tabler also offers about 1,000 filled variants; Lucide offers none.',
          'Heroicons Outline uses a 1.5 stroke and has 324 icons. Next to Lucide at default settings it looks noticeably lighter, so set Lucide to `strokeWidth={1.5}` if you have to combine them.',
        ],
      },
      {
        heading: 'Setup pitfalls',
        paragraphs: [
          'Besides `lucide-react`, the same icons are published for other stacks, including `lucide-vue-next`, `lucide-svelte`, and the framework-free `lucide` package. The notes below are for React.',
        ],
        bullets: [
          'Use named imports. Next.js 16 includes `lucide-react` in its default `optimizePackageImports` list, so barrel imports are rewritten to per-icon modules automatically. Elsewhere, tree-shaking works as long as you avoid `import * as Icons`.',
          'Icon names coming from a CMS or database defeat static imports. Use `lucide-react/dynamicIconImports`, a map from kebab-case names to lazy `import()` calls, instead of importing the whole namespace.',
          'Lucide 0.460.0 does not add `aria-hidden` to the SVG. Add `aria-hidden="true"` to decorative icons and put an `aria-label` on icon-only buttons.',
          'Name clashes are common (`Link`, `Image`, `Map`). Import the `LucideLink` or `LinkIcon` alias rather than renaming by hand.',
        ],
        code: `// Lazy-load an icon whose name is only known at runtime
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { lazy, Suspense } from 'react';

type Name = keyof typeof dynamicIconImports;

export function CmsIcon({ name }: { name: Name }) {
  const Icon = lazy(dynamicIconImports[name]);
  return (
    <Suspense fallback={<span style={{ width: 24, height: 24 }} />}>
      <Icon aria-hidden="true" />
    </Suspense>
  );
}`,
      },
      {
        heading: 'License: ISC and the Feather lineage',
        paragraphs: [
          'Lucide uses the ISC license, which works like MIT: you can use, modify and ship the icons in commercial products without paying or asking. The one obligation is to keep the copyright and license notice with copies of the software. In practice that means the LICENSE file in your repository or a third-party notices page.',
          'Lucide grew out of Feather Icons, so the notice also carries Feather’s MIT copyright for the inherited parts. Keep both lines. You don’t have to credit Lucide in your interface.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can I make Lucide icons filled?',
        a: 'Only partially. Adding `fill="currentColor"` fills closed shapes, which works for simple icons like `Circle` or `Heart`, but icons built from open lines will look broken. If you need designed solid variants, use a library that ships them.',
      },
      {
        q: 'Why do my icons look bolder when I make them bigger?',
        a: 'The stroke is defined in viewBox units, so a stroke of 2 on a 48px icon is 4px on screen. Pass `absoluteStrokeWidth` to keep the on-screen width constant.',
      },
      {
        q: 'Is Lucide the same as Feather?',
        a: 'It started as a Feather fork and keeps its visual style, but it has many more icons, different names for some of them, and its own release cycle.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  tabler: {
    slug: 'tabler',
    name: 'Tabler Icons',
    tagline: '5,986 icons, the widest coverage of any library in Icony',
    description:
      'Tabler Icons is the largest set in Icony: 4,985 outline icons and 1,001 filled icons in the React package, all on a 24×24 grid. The outline style uses the same 2px round-capped strokes as Lucide, so the two look like siblings, but Tabler goes much further into specialist territory: medical, finance, hardware, weather, maps and hundreds of brand logos. Reach for it when you’re tired of drawing the one icon your set is missing.',
    npm: '@tabler/icons-react',
    iconCount: 5986,
    license: 'MIT',
    url: 'https://tabler.io/icons',
    color: 'from-blue-500 to-cyan-500',
    features: [
      '4,985 outline + 1,001 filled icons in one package',
      '24×24 grid, 2px round strokes by default',
      '`stroke` prop changes line weight on outline icons',
      'Filled variants as separate `…Filled` components',
      '`title` prop renders an accessible `<title>` element',
      'MIT license',
    ],
    useCases: [
      'Enterprise apps with many specialised screens',
      'Dashboards, analytics and data tools',
      'Design systems that need one consistent source',
      'Products that need brand and domain icons',
    ],
    installCmd: 'npm install @tabler/icons-react',
    usageCode: `import { IconHome, IconHomeFilled, IconSettings } from '@tabler/icons-react';

export function Nav({ active }: { active: boolean }) {
  return (
    <div className="flex gap-3">
      {/* Outline: stroke controls line weight */}
      <IconSettings size={20} stroke={1.5} aria-hidden="true" />

      {/* Filled variant is a separate component; stroke has no effect on it */}
      {active
        ? <IconHomeFilled size={20} aria-hidden="true" />
        : <IconHome size={20} stroke={1.5} aria-hidden="true" />}
    </div>
  );
}`,
    relatedSlugs: ['lucide', 'bootstrap'],
    metaTitle: 'Tabler Icons — 5,900+ Free React Icons | Icony',
    metaDescription:
      'Tabler Icons in depth: 4,985 outline + 1,001 filled icons, 24×24 grid, the stroke prop, Filled components, bundle behaviour and MIT license, measured from the package.',
    specs: [
      { label: 'Version examined', value: '@tabler/icons-react 3.36.1' },
      { label: 'Icons in the package', value: '5,986 (4,985 outline, 1,001 filled)' },
      { label: 'Icons available in Icony', value: '5,986' },
      { label: 'Canvas', value: '24×24 viewBox' },
      { label: 'Drawing model', value: 'Outline: strokes. Filled: `fill="currentColor"`, `stroke="none"`' },
      { label: 'Default stroke', value: '2, round caps and round joins' },
      { label: 'Rendered `IconHome` SVG', value: '386 bytes (234 gzipped)' },
      { label: 'License', value: 'MIT' },
    ],
    sections: [
      {
        heading: 'Design language',
        paragraphs: [
          'A rendered `<IconHome />` has the same root attributes as a Lucide icon: `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`, round caps and joins. The drawing is more geometric, though.',
          'The house is three paths (roof, walls, door), written mostly as straight line commands (`l9 -9l9 9`), with rounded corners only where walls meet the floor. Tabler shapes tend to be built from simple primitives, which keeps 5,000+ icons looking related.',
          'The raw SVG files in the companion `@tabler/icons` package contain one extra element: `<path stroke="none" d="M0 0h24v24H0z" fill="none"/>`, an invisible 24×24 box that keeps the bounding box stable in design tools. The React components leave it out, so a file copied from the website can differ slightly from what React renders.',
          'Filled icons are a different drawing model. `IconHomeFilled` renders `fill="currentColor"` and `stroke="none"`, with the door cut out of a single solid path. Only 1,001 icons (roughly one in six) have a filled version, so you can’t build a fully filled UI from Tabler alone.',
        ],
      },
      {
        heading: 'Coverage, cost and trade-offs',
        bullets: [
          'Coverage. With 5,986 icons, a niche concept (a specific medical device, a payment brand, a chart type) is far more likely to exist here than in any other set on this site.',
          'Strokes are adjustable, as in Lucide. The `stroke` prop maps directly to `stroke-width`.',
          'Per-icon modules are small: `IconHome.mjs` is 651 bytes (385 gzipped), and the package is marked `sideEffects: false`.',
          'The install is big. `@tabler/icons-react` takes about 74 MB in `node_modules`. Your users never download it, but it slows fresh installs and CI caches.',
          'Filled coverage is uneven. Switching between outline and filled states only works for icons that have both.',
          'In a catalogue this large, some specialised icons carry more detail than the core set and get busy at 16px.',
        ],
      },
      {
        heading: 'Cases where Tabler is overkill',
        bullets: [
          'You need every icon in both outline and solid: Phosphor or Heroicons cover that fully.',
          'Your UI only needs 50–100 common icons and you want the most polished small set. Heroicons or Lucide will do, and they are easier to browse.',
          'You mostly render below 16px, where a 24-unit grid with 2-unit strokes gets muddy. A 16×16 set like Bootstrap Icons holds up better.',
        ],
      },
      {
        heading: 'Tabler vs. Lucide vs. Bootstrap Icons',
        paragraphs: [
          'Tabler and Lucide are visually compatible, so the choice is mostly about catalogue size and API. Lucide calls the prop `strokeWidth`; Tabler calls it `stroke`. Lucide exports `House`; Tabler exports `IconHome`.',
          'That `Icon` prefix means Tabler names almost never collide with your own components.',
          'Bootstrap Icons is the other large set (2,078 components), but it draws on a 16×16 grid with filled outlines instead of strokes, so line weight is fixed. Pick Tabler to tune stroke weight. Pick Bootstrap for crisp small sizes and a more traditional look.',
        ],
      },
      {
        heading: 'Installation gotchas',
        bullets: [
          'The React package is `@tabler/icons-react`. The companion `@tabler/icons` package holds the raw SVG files and JSON icon data. That’s useful outside React or in build scripts, but it isn’t what you import in components.',
          'Next.js 16 includes `@tabler/icons-react` in its default `optimizePackageImports`, so named imports stay cheap in development. In other setups, import named components and avoid namespace imports.',
          'Use `stroke`, not `strokeWidth`. Passing `strokeWidth` also works because extra props are spread onto the `<svg>` last, but it bypasses the component’s own prop and is easy to miss in reviews.',
          'Filled components ignore `stroke`. Size them with `size` and colour them with `color` like any other icon.',
          'Tabler does not set `aria-hidden`. Mark decorative icons yourself; pass `title` only when the icon is the sole label for something.',
        ],
      },
      {
        heading: 'License: MIT, no credit required',
        paragraphs: [
          'Tabler Icons is MIT-licensed. For a set of nearly 6,000 icons that is unusually generous: you can use them in commercial and closed-source products, modify them and redistribute them. Keep the copyright and license notice with the code you ship. A notices file is enough, and no credit is required in the interface.',
          'The license covers the whole catalogue, including the drawings of the brand-logo icons. The trademarks themselves still belong to their owners.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does Icony include the filled Tabler icons?',
        a: 'Yes. The 5,986 count in Icony is the full React package: 4,985 outline and 1,001 filled icons.',
      },
      {
        q: 'Why is my Tabler filled icon not reacting to the stroke setting?',
        a: 'Filled icons are drawn with `fill` and `stroke="none"`, so there is no stroke to change. This is expected.',
      },
      {
        q: 'Can I mix Tabler and Lucide?',
        a: 'Usually yes. Both use 24×24 canvases and 2px round strokes. Keep the same stroke width in both and the difference is hard to spot.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  phosphor: {
    slug: 'phosphor',
    name: 'Phosphor Icons',
    tagline: '1,512 icons, each in six hand-drawn weights',
    description:
      'Phosphor Icons gives each of its 1,512 icons six weights (thin, light, regular, bold, fill and duotone), selected with a single weight prop. Unlike Lucide or Tabler, Phosphor does not use SVG strokes: every weight is a separately drawn filled outline on a 256×256 canvas. The weights end up better balanced than a stroke slider would make them, but line thickness is limited to those four line weights.',
    npm: '@phosphor-icons/react',
    iconCount: 1512,
    license: 'MIT',
    url: 'https://phosphoricons.com',
    color: 'from-purple-500 to-pink-500',
    features: [
      'Six weights per icon: thin, light, regular, bold, fill, duotone',
      'Each weight drawn separately on a 256×256 canvas',
      '`IconContext` sets default size, colour and weight for a subtree',
      'Separate `/ssr` entry for React Server Components',
      '`mirrored` prop for right-to-left layouts',
      'MIT license',
    ],
    useCases: [
      'Design systems with a clear weight hierarchy',
      'Consumer and mobile-style web apps',
      'Illustrative UI where duotone adds depth',
      'Products that need outline and filled states for every icon',
    ],
    installCmd: 'npm install @phosphor-icons/react',
    usageCode: `'use client';
import { IconContext, House, MagnifyingGlass, Gear } from '@phosphor-icons/react';

export function Toolbar() {
  return (
    // Defaults for every Phosphor icon below
    <IconContext.Provider value={{ size: 20, weight: 'light', color: 'currentColor' }}>
      <House aria-hidden="true" />
      <MagnifyingGlass weight="bold" aria-hidden="true" />
      <Gear weight="duotone" aria-hidden="true" />
    </IconContext.Provider>
  );
}`,
    relatedSlugs: ['phosphor-fill', 'lucide'],
    metaTitle: 'Phosphor Icons — 1,500+ React Icons in 6 Weights | Icony',
    metaDescription:
      'How Phosphor Icons work: 1,512 icons in six weights, 256×256 filled outlines instead of strokes, per-icon bundle cost, the /ssr entry for Next.js, and MIT license.',
    specs: [
      { label: 'Version examined', value: '@phosphor-icons/react 2.1.10' },
      { label: 'Icons in the package', value: '1,512 × 6 weights' },
      { label: 'Icons available in Icony', value: '1,512 (plus the Filled page)' },
      { label: 'Canvas', value: '256×256 viewBox' },
      { label: 'Drawing model', value: 'Filled outlines only (`fill="currentColor"`), no strokes' },
      { label: 'Default size', value: '`1em` (follows the surrounding font size)' },
      { label: 'Rendered `House` SVG (regular)', value: '387 bytes (248 gzipped)' },
      { label: 'License', value: 'MIT' },
    ],
    sections: [
      {
        heading: 'Design language: weights, not strokes',
        paragraphs: [
          'A rendered Phosphor icon has `viewBox="0 0 256 256"`, `fill="currentColor"` and no stroke attributes at all. What looks like a line is the space between two filled contours. For `House`, each weight is a different path: thin, light, regular and bold move the contours apart by different amounts, fill is a solid shape, and duotone stacks a background shape at `opacity="0.2"` under the regular outline.',
          'You can read the line weights straight from the `House` paths by comparing the outer and inner wall contours: thin is 8 units thick, light 12, regular 16 and bold 24. On a 256-unit canvas rendered at 24px that is roughly 0.75px, 1.1px, 1.5px and 2.25px. Regular therefore matches the 1.5px line of Heroicons Outline, not the 2px default of Lucide and Tabler.',
          'Measured on `House`, the rendered SVG is 427 bytes for thin, 436 for light, 387 for regular, 414 for bold, 324 for fill and 521 for duotone. The large canvas lets Phosphor use whole-number coordinates (`M219.31,108.68l-80-80…`) and gentle 8- to 16-unit corner radii, which gives the set its friendly, slightly rounded feel.',
          'So there is no continuous stroke slider. Icony’s stroke control, for example, maps its 0.5–4 range onto Phosphor weights: 1 or below becomes thin, up to 1.75 becomes light, up to 2.5 becomes regular, and anything higher becomes bold. Duotone is left out of that mapping because it is a different style, not a heavier line.',
        ],
      },
      {
        heading: 'Strengths and weaknesses',
        bullets: [
          'Every icon has every weight. You can use light icons in body content, bold icons in a toolbar and fill for selected states without mixing libraries.',
          'Duotone gives a two-tone look using only `currentColor` and opacity, so it still follows your text colour and dark mode.',
          '`IconContext` sets defaults once, so you don’t repeat props on every icon.',
          'Each icon costs more. Its definition file carries all six weights: `defs/House.es.js` is 2,662 bytes (772 gzipped), even if you only render regular. That is roughly double what a single Lucide icon costs.',
          'There is no fine stroke control. If your design system specifies a 1.25px line, Phosphor cannot match it exactly.',
          'The default size is `1em`. Icons silently change size when the parent font size changes, so set `size` or an `IconContext` default.',
        ],
      },
      {
        heading: 'Situations where Phosphor is a poor fit',
        bullets: [
          'You ship hundreds of icons on a single route on a tight bundle budget. A stroke set with one style per module is lighter.',
          'Your design tokens define stroke width as an exact value that must match other line art.',
          'You need very specialised or brand icons in bulk; Tabler’s catalogue is much larger.',
        ],
      },
      {
        heading: 'Phosphor vs. Lucide',
        paragraphs: [
          'At 24px, Phosphor regular is lighter than Lucide’s default: its lines are 1.5px against Lucide’s 2px. Set Lucide to `strokeWidth={1.5}` and they match closely, but the construction still differs.',
          'Lucide lets you pick any stroke value and keeps one small module per icon. Phosphor offers fewer choices, but each weight is drawn by hand, so small counters and joins stay open at bold weights where a thickened stroke would clog. If you need solid states, Phosphor wins outright, because Lucide has no fill style.',
          'Naming differs too. Phosphor uses descriptive nouns (`House`, `MagnifyingGlass`, `Gear`), not actions (`Home`, `Search`, `Settings`). Search by object, not by function.',
        ],
      },
      {
        heading: 'Installation gotchas',
        bullets: [
          'Use the scoped `@phosphor-icons/react` package. The older `phosphor-react` package is the previous generation of the library; do not install both.',
          'The default entry uses React context, so in the Next.js App Router it only works inside client components. For server components, import from `@phosphor-icons/react/ssr`, which renders without context (and therefore ignores `IconContext`).',
          'Every icon is exported twice, as `House` and `HouseIcon`. Use the `…Icon` form if the short name clashes with one of your components.',
          'The `alt` prop renders a `<title>` inside the SVG. Phosphor does not add `aria-hidden`, so set it on decorative icons.',
          'For right-to-left layouts, `mirrored` flips the icon with `transform="scale(-1, 1)"`. Use it for arrows and chat bubbles, not for icons with text or clocks.',
        ],
        code: `// app/page.tsx — a server component in the Next.js App Router
import { House } from '@phosphor-icons/react/ssr';

export default function Page() {
  return <House size={24} weight="bold" aria-hidden="true" />;
}`,
      },
      {
        heading: 'License: MIT, across all six weights',
        paragraphs: [
          'Phosphor is MIT-licensed, and all six weights (thin, light, regular, bold, fill, duotone) ship under that one license, so switching weights never changes your obligations. Keep the license notice with the code you distribute; no visible credit is required in your product.',
        ],
      },
    ],
    faq: [
      {
        q: 'Why doesn’t `strokeWidth` do anything on Phosphor icons?',
        a: 'There is no stroke. Phosphor draws lines as filled shapes, so thickness is chosen with `weight` instead.',
      },
      {
        q: 'Does importing one weight tree-shake the others?',
        a: 'No. Each icon’s weights live together in one definition map, so all six ship with the icon. The cost is paid per icon you import, not for the whole library.',
      },
      {
        q: 'What is the difference between this page and Phosphor Filled?',
        a: 'Same package, same icons. This page covers the weight system as a whole. The Filled page is about the `fill` weight: how it is drawn and how to use solid icons well.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  'phosphor-fill': {
    slug: 'phosphor-fill',
    name: 'Phosphor Icons (Filled)',
    tagline: 'A solid version of all 1,512 Phosphor icons, redrawn rather than filled in',
    description:
      'Phosphor Fill is the weight="fill" style of Phosphor Icons. The unusual part is coverage: all 1,512 Phosphor icons have a fill version, which is rare among free libraries. The fill shapes are drawn separately rather than painted inside the outline. Details such as a house’s door or a gear’s hub are cut out of the solid shape so the icon stays readable. Icony lists it as its own library so you can browse and export solid icons directly.',
    npm: '@phosphor-icons/react',
    iconCount: 1512,
    license: 'MIT',
    url: 'https://phosphoricons.com',
    color: 'from-violet-500 to-purple-600',
    features: [
      'Fill version exists for all 1,512 icons (checked in the package)',
      'Solid shapes redrawn with cut-out details',
      'Same component as the outline; switch with `weight`',
      'Identical bounding box across weights, so no layout shift',
      'Often a smaller SVG than the outline version',
      'MIT license, same package as Phosphor',
    ],
    useCases: [
      'Selected tab and navigation states',
      'Icons on coloured buttons and badges',
      'Small icons that need extra contrast',
      'Status indicators and favourites',
    ],
    installCmd: 'npm install @phosphor-icons/react',
    usageCode: `'use client';
import { House, Bell, User } from '@phosphor-icons/react';
import Link from 'next/link';

const items = [
  { href: '/', label: 'Home', Icon: House },
  { href: '/alerts', label: 'Alerts', Icon: Bell },
  { href: '/me', label: 'Profile', Icon: User },
];

export function TabBar({ pathname }: { pathname: string }) {
  return (
    <nav className="flex justify-around">
      {items.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} aria-current={active ? 'page' : undefined}>
            {/* Same component, same box — only the weight changes */}
            <Icon size={24} weight={active ? 'fill' : 'regular'} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}`,
    relatedSlugs: ['phosphor', 'heroicons-solid'],
    metaTitle: 'Phosphor Icons Filled — 1,500+ Solid React Icons | Icony',
    metaDescription:
      'Phosphor Fill: a solid version of all 1,512 Phosphor icons. How the fill shapes are drawn, when solid icons help, active-state patterns, and how it compares with Heroicons Solid.',
    specs: [
      { label: 'Version examined', value: '@phosphor-icons/react 2.1.10' },
      { label: 'Icons with a fill weight', value: '1,512 of 1,512' },
      { label: 'Icons available in Icony', value: '1,512' },
      { label: 'Canvas', value: '256×256 viewBox' },
      { label: 'How to select it', value: '`weight="fill"`' },
      { label: 'Rendered `House` SVG (fill)', value: '324 bytes (224 gzipped) vs. 387 for regular' },
      { label: 'Rendered `Gear` SVG (fill)', value: '1,024 bytes vs. 2,008 for regular' },
      { label: 'License', value: 'MIT' },
    ],
    sections: [
      {
        heading: 'How the fill shapes are drawn',
        paragraphs: [
          'Compare the regular and fill markup for `House`. Regular is one path made of an outer contour and an inner contour, and the gap between them is the “line”. Fill is a single contour describing the silhouette, with the door notched out (`V164a4,4,0,0,0-4-4H108a4,4…`).',
          '`Gear` follows the same pattern. The fill version is the silhouette with a circular hole for the hub, and its path is about half as long as the regular one (1,024 vs. 2,008 rendered bytes).',
          'Because details are cut out rather than drawn as lines, fill icons stay legible at sizes where thin lines start to disappear, and they hold up on saturated button backgrounds. The cost is simpler interior detail. Icons whose meaning depends on inner strokes (a document with text lines, a detailed chart) say less in fill form.',
        ],
      },
      {
        heading: 'When solid icons are the right call',
        bullets: [
          'Selected state in tab bars and sidebars. Switching `regular` → `fill` is a strong, familiar signal, and because every Phosphor weight shares the same 256×256 box, the icon does not shift when it changes.',
          'Icons on filled buttons, chips and badges, where a thin outline would look weak against the background colour.',
          'Small sizes (16px and below) in low-contrast themes.',
          'Toggle icons such as favourite, bookmark or pin, where filled means “on”.',
        ],
      },
      {
        heading: 'When not to use the fill style',
        bullets: [
          'As the only style for a whole interface. Large areas of solid icons feel heavy, and without an outline counterpart you lose the easy way to show state.',
          'For icons that rely on internal detail, such as maps, charts and documents. Outline weights show more there.',
          'When icon style is the only sign of state. Filled versus outline is a visual cue, so also set `aria-current`, `aria-pressed` or text for assistive technology.',
        ],
      },
      {
        heading: 'Phosphor Fill vs. other solid sets',
        paragraphs: [
          'Heroicons Solid is the closest alternative: 324 icons on a 24×24 grid with names matching its outline set, plus separately drawn 20px and 16px solid sets. It is smaller but very polished.',
          'Tabler has 1,001 filled icons alongside 4,985 outline ones, so only some outline icons have a solid partner. Bootstrap Icons has 670 `…Fill` variants out of 2,078 components. Phosphor is the only one of these where every icon has a solid form, so it is the safest choice if your design depends on outline/solid pairs.',
          'Phosphor Fill also looks a little lighter than Heroicons Solid because of its larger corner radii. If you combine them, compare them side by side at your target size.',
        ],
      },
      {
        heading: 'Usage notes',
        bullets: [
          'Nothing extra to install. Fill is a weight of the same `@phosphor-icons/react` components.',
          'Set `weight="fill"` per icon, or once with `IconContext.Provider` in client components. In server components, import from `@phosphor-icons/react/ssr` and pass `weight` directly.',
          'Stroke settings don’t apply. In Icony, the stroke slider has no effect on this library, because the renderer forces `weight="fill"` whatever the slider says.',
          'Colour the icon with `color` or CSS `color`; the fill uses `currentColor`.',
        ],
      },
      {
        heading: 'License: same package, same terms',
        paragraphs: [
          'The fill style has no separate license. `weight="fill"` comes from the same MIT-licensed Phosphor package, so the same terms as the regular weight apply. Commercial use, modification and redistribution are allowed as long as the license notice stays with your source.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is Phosphor Fill a separate package?',
        a: 'No. It is `weight="fill"` on the same components. Icony lists it separately only so you can browse solid icons on their own.',
      },
      {
        q: 'Can I colour the cut-out parts differently?',
        a: 'Not with the fill weight. The cut-outs are holes, so the background shows through. For a two-tone look, use the `duotone` weight.',
      },
      {
        q: 'Will switching between regular and fill cause layout shift?',
        a: 'No. All weights share the same 256×256 viewBox and the same `size`, so only the drawing changes.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  heroicons: {
    slug: 'heroicons',
    name: 'Heroicons',
    tagline: 'A compact, polished 1.5px outline set from the makers of Tailwind CSS',
    description:
      'Heroicons is a set of 324 icons from Tailwind Labs, published in four styles: 24px outline, 24px solid, 20px solid (“mini”) and 16px solid (“micro”). This page covers the outline style, which draws every icon with a 1.5 stroke on a 24×24 canvas. That is lighter than the 2px default of Lucide and Tabler. The set is deliberately small and evenly finished, and you size its components with CSS classes rather than props.',
    npm: '@heroicons/react',
    iconCount: 175,
    license: 'MIT',
    url: 'https://heroicons.com',
    color: 'from-sky-500 to-blue-600',
    features: [
      '324 outline icons with a 1.5 stroke on a 24×24 grid',
      'Identical names across outline and solid styles',
      'Sized with CSS classes (there is no `size` prop)',
      '`aria-hidden="true"` and `data-slot="icon"` on every SVG',
      'Optional `title` / `titleId` props',
      'MIT license from Tailwind Labs',
    ],
    useCases: [
      'Tailwind CSS projects',
      'Marketing sites and polished SaaS UI',
      'Apps that need a small, curated set',
      'Designs that pair outline with solid for state',
    ],
    installCmd: 'npm install @heroicons/react',
    usageCode: `import { HomeIcon, MagnifyingGlassIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export function Toolbar() {
  return (
    <div className="flex gap-3 text-gray-600">
      {/* No width/height on the SVG — size it with classes */}
      <HomeIcon className="size-6" />
      <MagnifyingGlassIcon className="size-6 text-indigo-600" />

      {/* Heavier line when you need it */}
      <Cog6ToothIcon className="size-6" strokeWidth={2} />
    </div>
  );
}`,
    relatedSlugs: ['heroicons-solid', 'lucide'],
    metaTitle: 'Heroicons (Outline) — 1.5px Icons by the Tailwind Team | Icony',
    metaDescription:
      'Heroicons outline explained: 324 icons, 1.5 stroke on 24×24, class-based sizing, aria-hidden by default, import paths and the v1→v2 gotcha. MIT license.',
    specs: [
      { label: 'Version examined', value: '@heroicons/react 2.2.0' },
      { label: 'Icons in the package', value: '324 in `24/outline`' },
      { label: 'Icons available in Icony', value: '175 (curated)' },
      { label: 'Canvas', value: '24×24 viewBox' },
      { label: 'Drawing model', value: 'Strokes: `fill="none"`, `stroke="currentColor"`' },
      { label: 'Default stroke', value: '1.5, round caps and joins' },
      { label: 'Rendered `HomeIcon` SVG', value: '454 bytes (290 gzipped)' },
      { label: 'License', value: 'MIT' },
    ],
    sections: [
      {
        heading: 'Design language',
        paragraphs: [
          'The rendered `<HomeIcon />` from `24/outline` has `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"` and `stroke-width="1.5"`. The icon is one path, and its coordinates are full of quarter and eighth values (`M2.25 12`, `v10.125`, `c.621 0 1.125.504…`). That is deliberate: with a 1.5 stroke, placing lines on .75 and .125 offsets keeps edges aligned to the pixel grid at 24px, which is a large part of why Heroicons look sharp.',
          'The 1.5 line makes the set feel lighter and more refined than Lucide or Tabler at their 2px defaults. Corners are softly rounded and shapes are a bit more literal. The home icon, for example, has a separate roofline and a floor line.',
          'Every SVG carries two attributes: `aria-hidden="true"` and `data-slot="icon"`. The first treats every icon as decorative by default. The second gives parent components a stable hook, so a button can style any icon inside it with a `[data-slot=icon]` selector.',
        ],
      },
      {
        heading: 'Strengths and weaknesses',
        bullets: [
          'Consistency. 324 icons from a single team, and none of them look out of place.',
          'Outline and solid are true pairs. The file lists of `24/outline` and `24/solid` are identical, so state switching never hits a missing icon.',
          'Decorative icons are hidden from screen readers by default, so you don’t have to remember to do it.',
          'The catalogue is small. 324 icons cover general app UI, but domain-specific concepts are often missing.',
          'There is no `size` prop. The SVG has no `width` or `height`, so without a class it expands to fill its container.',
          'The 1.5 line can look faint at 16px or in light grey. For small sizes, use the mini and micro solid sets.',
        ],
      },
      {
        heading: 'Reasons to look elsewhere',
        bullets: [
          'You need hundreds of domain icons. Tabler or Lucide cover far more ground.',
          'You do not use utility CSS and prefer a `size` prop API; Lucide and Tabler fit better.',
          'Your icons are mostly 16px. Use Heroicons’ own `16/solid` set or a small-grid library.',
        ],
      },
      {
        heading: 'Heroicons vs. Lucide',
        paragraphs: [
          'Both are stroke-based on 24×24, and both accept `strokeWidth`, so you can set Heroicons to 2 or Lucide to 1.5 to make them match.',
          'They differ in catalogue size (324 vs. about 1,500) and API (class-based sizing vs. a `size` prop). Accessibility defaults differ too: Heroicons hides icons by default, Lucide 0.460.0 does not. And Heroicons has designed solid versions, which Lucide lacks.',
        ],
      },
      {
        heading: 'Setup notes',
        bullets: [
          'You must import from a style path: `@heroicons/react/24/outline`, `24/solid`, `20/solid` or `16/solid`. Importing from the package root throws a runtime error that tells you exactly this.',
          'Old tutorials import from `@heroicons/react/outline`. That is the v1 path, and with v2 installed it throws an error suggesting you install v1. Update the path instead, and check the names, because v2 renamed many icons. There is no `MenuIcon` or `SearchIcon` in v2; they are now `Bars3Icon` and `MagnifyingGlassIcon`.',
          'All names end in `Icon`. Import both styles with aliases: `import { HomeIcon as HomeOutline } from …/24/outline`.',
          'The `title` prop adds a `<title>` and `aria-labelledby`, but the SVG keeps `aria-hidden="true"`. For a meaningful standalone icon, also pass `aria-hidden={false}`. Better still, label the button that contains it.',
          'Next.js 16 lists `@heroicons/react/24/outline`, `24/solid` and `20/solid` in its default `optimizePackageImports`; `16/solid` is not on that list.',
        ],
      },
      {
        heading: 'License: MIT from Tailwind Labs',
        paragraphs: [
          'Heroicons is MIT-licensed and published by Tailwind Labs, the makers of Tailwind CSS. You don’t need Tailwind to use it, and the license works the same in any stack: commercial use, modification and redistribution are allowed, and the notice stays with your source. No credit is needed in your UI.',
        ],
      },
    ],
    faq: [
      {
        q: 'Why is my Heroicon huge?',
        a: 'The SVG has no `width` or `height` attributes, so it fills its container. Add a size class such as `size-6` (or `h-6 w-6`), or set width and height via CSS.',
      },
      {
        q: 'Why does Icony show 175 Heroicons when the package has 324?',
        a: 'Icony ships a curated, searchable subset of Heroicons with English and Korean tags. The full set is available from the package itself.',
      },
      {
        q: 'Can I change the stroke width?',
        a: 'Yes, for the outline style. `strokeWidth` is passed through to the SVG and overrides the default 1.5. Solid styles have no stroke.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  'heroicons-solid': {
    slug: 'heroicons-solid',
    name: 'Heroicons (Solid)',
    tagline: 'Filled Heroicons in three separately drawn sizes: 24, 20 and 16px',
    description:
      'Heroicons Solid is the filled side of the Tailwind Labs icon set. It is really three sets: 24px solid (324 icons), 20px “mini” (324) and 16px “micro” (316). Each size is drawn on its own grid rather than scaled down, so the 16px home icon is a different, simpler shape from the 24px one. Names match the outline set exactly, so switching from outline to solid for a state change is a one-line swap.',
    npm: '@heroicons/react',
    iconCount: 175,
    license: 'MIT',
    url: 'https://heroicons.com',
    color: 'from-blue-600 to-indigo-600',
    features: [
      'Three solid sets: `24/solid`, `20/solid`, `16/solid`',
      'Each size redrawn for its own pixel grid',
      'Same names as `24/outline` for easy state swaps',
      '`fill="currentColor"` with even-odd cut-outs',
      'Accessible defaults: `aria-hidden="true"`',
      'MIT license from Tailwind Labs',
    ],
    useCases: [
      'Active navigation and selected tabs',
      'Icons inside buttons and form inputs (20px)',
      'Dense tables and badges (16px)',
      'Tailwind CSS projects',
    ],
    installCmd: 'npm install @heroicons/react',
    usageCode: `import { HomeIcon as HomeOutline } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid } from '@heroicons/react/24/solid';
import { CheckIcon } from '@heroicons/react/20/solid';

export function NavItem({ active }: { active: boolean }) {
  const Icon = active ? HomeSolid : HomeOutline;
  return (
    <a href="/" aria-current={active ? 'page' : undefined} className="flex items-center gap-2">
      <Icon className="size-6 text-indigo-600" />
      Home
    </a>
  );
}

// 20px "mini" icons are drawn for buttons and inputs
export function SaveButton() {
  return (
    <button className="inline-flex items-center gap-1.5">
      <CheckIcon className="size-5" />
      Save
    </button>
  );
}`,
    relatedSlugs: ['heroicons', 'phosphor-fill'],
    metaTitle: 'Heroicons Solid — 24, 20 & 16px Filled React Icons | Icony',
    metaDescription:
      'Heroicons Solid in detail: 324 filled icons at 24px plus redrawn 20px mini and 16px micro sets, even-odd cut-outs, outline/solid swapping and MIT license.',
    specs: [
      { label: 'Version examined', value: '@heroicons/react 2.2.0' },
      { label: 'Icons in the package', value: '324 (24px), 324 (20px mini), 316 (16px micro)' },
      { label: 'Icons available in Icony', value: '175 (curated, 24px solid)' },
      { label: 'Canvas', value: '24×24, 20×20 or 16×16 viewBox depending on import path' },
      { label: 'Drawing model', value: 'Fills: `fill="currentColor"`, `fill-rule="evenodd"` on complex shapes' },
      { label: 'Rendered `HomeIcon` SVG', value: '561 bytes (24px), 362 (20px), 328 (16px)' },
      { label: 'License', value: 'MIT' },
    ],
    sections: [
      {
        heading: 'Three sizes, three drawings',
        paragraphs: [
          'Most libraries give you one drawing and let you scale it. Heroicons Solid does not.',
          'The 24px `HomeIcon` is two paths, a separate roof chevron and a body with a doorway, built on .75 and .125 offsets. The 20px mini version is a single path on whole-pixel coordinates (`M9.293 2.293a1 1 0 0 1 1.414 0l7 7…`) with a squarer, simpler shape. The 16px micro version is simpler still: one compact shape with a small rounded door opening.',
          'Each is tuned so its edges land on whole pixels at its native size.',
          'That is the main reason to pick Heroicons Solid over scaling a filled icon down. At 16 and 20px, a drawing made for that grid is visibly crisper than a 24px drawing scaled by 0.67 or 0.83.',
          'Complex icons use `fill-rule="evenodd"` and `clip-rule="evenodd"` to punch holes, as in `Cog6ToothIcon`, where the centre of the gear is a hole rather than a second shape. The background shows through, so keep that in mind when you place icons on images or gradients.',
        ],
      },
      {
        heading: 'Which size to use',
        bullets: [
          '`24/solid` for primary navigation, tab bars, and anywhere the solid icon swaps with a 24px outline icon.',
          '`20/solid` inside buttons, form fields, dropdown items and menus, next to 14–16px text.',
          '`16/solid` for dense tables, tags, badges and inline status. It has 316 icons, not 324: eight older icons such as `ArrowSmallUpIcon` and `PlusSmallIcon` are not drawn at this size.',
        ],
      },
      {
        heading: 'Trade-offs of the solid sets',
        bullets: [
          'Each size has its own drawing. Almost no other free library does this.',
          'Names match the outline set exactly at 24px, so `active ? Solid : Outline` never fails.',
          'Every SVG carries `aria-hidden="true"` by default.',
          'It shares the outline set’s 324-icon catalogue, so niche concepts are missing.',
          'Solid icons have no stroke, so `strokeWidth` does nothing. In Icony, the stroke slider is inert for this library.',
          'There is no `size` prop and no default width/height. You have to size icons with classes or CSS.',
        ],
      },
      {
        heading: 'When Solid falls short',
        bullets: [
          'You need a solid style for more than a few hundred concepts. Phosphor Fill covers all 1,512 Phosphor icons.',
          'You want solid icons at large display sizes with a rounder, friendlier look. Phosphor Fill’s larger corner radii suit that better.',
          'You need solid icons with a two-tone effect; use Phosphor’s duotone weight.',
        ],
      },
      {
        heading: 'Heroicons Solid vs. Phosphor Fill',
        paragraphs: [
          'Heroicons Solid wins on small-size crispness (thanks to the 20 and 16px sets) and on consistency. Phosphor Fill wins on breadth, a single component API (`weight="fill"` rather than a different import path), and zero layout risk when switching weights. For a Tailwind-based product that needs fewer than a few hundred icons, Heroicons is the tidier choice. Otherwise Phosphor is safer.',
        ],
      },
      {
        heading: 'Gotchas',
        bullets: [
          'The size is in the import path. `HomeIcon` from `20/solid` is a different component from `HomeIcon` from `24/solid`, and auto-imports can easily grab the wrong one.',
          'Alias the imports when you use both outline and solid, or the names collide.',
          'Mini and micro icons are designed for their native size. Rendering a `16/solid` icon at 24px throws away the reason to use it.',
          'Outline versus solid alone doesn’t tell assistive technology about state. Add `aria-current` or `aria-pressed` as well.',
        ],
      },
      {
        heading: 'License: one package, three sets',
        paragraphs: [
          'Outline, 24px solid, 20px solid and 16px solid all ship in the same MIT-licensed `@heroicons/react` package, so there is one license to track whichever sets you mix. Commercial use, modification and redistribution are allowed; keep the notice with your source.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is there a 20px or 16px outline set?',
        a: 'No. In Heroicons v2, the 20px and 16px sets are solid only. Outline is available at 24px.',
      },
      {
        q: 'Which Heroicons Solid set does Icony use?',
        a: 'The 24px set (`@heroicons/react/24/solid`), with a curated subset of 175 icons.',
      },
      {
        q: 'Why can I see the background through my gear icon?',
        a: 'Complex solid icons use even-odd fill rules to cut holes. The hole is transparent by design.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  bootstrap: {
    slug: 'bootstrap',
    name: 'Bootstrap Icons',
    tagline: 'A 2,000+ icon set drawn on a 16px grid, with outline and fill pairs',
    description:
      'Bootstrap Icons is the icon library of the Bootstrap project: about 2,000 icons drawn on a 16×16 grid, with around a third of them available in a -fill variant. You don’t need Bootstrap CSS to use them. In React, most people use react-bootstrap-icons, a community wrapper that turns each SVG into a component; the version in this repo exposes 2,078 components. The small grid makes the icons unusually crisp at 16px and a little plain when blown up.',
    npm: 'react-bootstrap-icons',
    iconCount: 325,
    license: 'MIT',
    url: 'https://icons.getbootstrap.com',
    color: 'from-purple-600 to-indigo-700',
    features: [
      '2,078 React components, 670 of them `…Fill` variants',
      '16×16 grid, sharp at small sizes',
      'Default size `1em`, so icons follow text size',
      'Brand logos included (GitHub, Google, Apple, Slack…)',
      'Works without Bootstrap CSS',
      'MIT license (icons and wrapper)',
    ],
    useCases: [
      'Bootstrap-based sites and admin themes',
      'Inline icons in text, tables and forms',
      'Back-office tools that need broad coverage',
      'Projects that need brand logos alongside UI icons',
    ],
    installCmd: 'npm install react-bootstrap-icons',
    usageCode: `import { House, HouseFill, Gear, Icon0Circle } from 'react-bootstrap-icons';

export function Example({ active }: { active: boolean }) {
  return (
    <p className="text-base">
      {/* 1em by default: scales with the paragraph's font size */}
      {active ? <HouseFill aria-hidden="true" /> : <House aria-hidden="true" />} Home

      {/* Explicit size and colour */}
      <Gear size={20} color="#6f42c1" title="Settings" />

      {/* Names starting with a digit get an "Icon" prefix */}
      <Icon0Circle size={16} aria-hidden="true" />
    </p>
  );
}`,
    relatedSlugs: ['tabler', 'lucide'],
    metaTitle: 'Bootstrap Icons — 2,000+ Free React Icons | Icony',
    metaDescription:
      'Bootstrap Icons for React: 2,078 components on a 16×16 grid, 670 fill variants, 1em sizing, naming quirks, react-bootstrap-icons vs. bootstrap-icons, and MIT license.',
    specs: [
      { label: 'Version examined', value: 'react-bootstrap-icons 1.11.6 (depends on bootstrap-icons ^1.13.1)' },
      { label: 'Components in the package', value: '2,078 (670 are `…Fill` variants)' },
      { label: 'Icons available in Icony', value: '325 (curated)' },
      { label: 'Canvas', value: '16×16 viewBox' },
      { label: 'Drawing model', value: 'Filled outlines only (`fill="currentColor"`), no strokes' },
      { label: 'Default size', value: '`1em`' },
      { label: 'Rendered `House` SVG', value: '419 bytes (272 gzipped)' },
      { label: 'License', value: 'MIT' },
    ],
    sections: [
      {
        heading: 'Design language',
        paragraphs: [
          'A rendered `<House />` has `viewBox="0 0 16 16"`, `width="1em"`, `height="1em"`, `fill="currentColor"` and a `class="bi bi-house"`. There is no stroke: the walls are the gap between an outer and inner contour. On the house, that gap is exactly 1 unit (the outer floor sits at y=15, the inner at y=14). That is 1/16 of the icon: 1px at 16px, 1.5px at 24px.',
          'Drawing at 16 units means most edges fall on whole or half pixels at 16px, so the set looks crisp in tables, inputs and inline text. At 32px and above the same drawings start to look simple, because there are only 16 units of detail to scale up.',
          'Outline and solid are separate icons. `HouseFill` is its own drawing (a roof line plus a solid body), not the outline painted in.',
          'Only 705 of the 2,078 components have `Fill` in their name, so not every outline icon has a solid partner.',
        ],
      },
      {
        heading: 'Pros and cons',
        bullets: [
          'Breadth and small-size quality together. Among the libraries in Icony only Tabler is larger, and none is drawn for 16px the way this one is.',
          'Brand icons are included. Logos such as GitHub, Google, Apple, Windows, Discord and Slack ship with it, which many UI sets avoid.',
          '`1em` sizing lines inline icons up with text without extra CSS.',
          'No stroke control. Line weight is fixed and `strokeWidth` does nothing.',
          'The style is neutral and a bit dated next to rounder, trendier sets. It reads as “admin panel”.',
          'Modules are heavier. Each icon file in `react-bootstrap-icons` inlines Babel helpers and a `prop-types` definition; `house.js` is 2,291 bytes (1,026 gzipped) before minification, several times Lucide’s 594.',
        ],
      },
      {
        heading: 'When to pick something else',
        bullets: [
          'Your UI mainly uses large icons (32px+) in marketing sections. A 24-grid set with more detail will look better.',
          'Your design needs adjustable line weight or a soft, rounded look. Lucide or Phosphor fit better.',
          'You need solid versions of everything. Use Phosphor Fill or Heroicons Solid.',
        ],
      },
      {
        heading: 'Bootstrap Icons vs. Tabler',
        paragraphs: [
          'Both are large, general-purpose, MIT-licensed sets. Tabler is 24-grid, stroke-based and adjustable; Bootstrap is 16-grid, fill-based and fixed.',
          'Tabler has the bigger catalogue (5,986) and an `Icon` prefix on every name; Bootstrap uses bare names like `House` and `Gear`. If most icons appear at 16px in data-heavy screens, Bootstrap tends to look sharper; at 24px and up, Tabler usually looks more modern.',
        ],
      },
      {
        heading: 'Installation gotchas',
        bullets: [
          '`react-bootstrap-icons` is a community wrapper maintained outside the Bootstrap team. The official package is `bootstrap-icons`, which ships SVG files, a sprite and an icon font. Use the official package for plain HTML or `<i class="bi bi-house">` markup, and the wrapper for React components.',
          'Names are bare PascalCase: `House`, `Link`, `Image`, `Map`, `Table`, `Window`. These collide with Next.js `Link` and `Image` and with your own components. Alias them: `import { Link as LinkIcon } from \'react-bootstrap-icons\'`.',
          'Icons whose names start with a digit get an `Icon` prefix: the file `0-circle` is exported as `Icon0Circle`.',
          'The wrapper isn’t in Next.js 16’s default `optimizePackageImports`. If development builds feel slow, add it to that option in `next.config` yourself.',
          '`title` renders a `<title>`, but `aria-hidden` isn’t added by default. Set it on decorative icons.',
        ],
      },
      {
        heading: 'License and logo trademarks',
        paragraphs: [
          'Both the Bootstrap Icons artwork and the `react-bootstrap-icons` wrapper are MIT-licensed. You can use them commercially and modify them; keep the notices with your source. Brand logos are a different matter. The MIT license covers the drawing, not the trademark, so follow each company’s brand guidelines when you display its logo.',
        ],
      },
    ],
    faq: [
      {
        q: 'Do I need Bootstrap CSS?',
        a: 'No. The React components are self-contained SVGs.',
      },
      {
        q: 'Why does Icony show 325 Bootstrap icons?',
        a: 'Icony includes a curated subset of commonly used icons with English and Korean search tags. The package has 2,078 components.',
      },
      {
        q: 'Why does my icon change size inside a heading?',
        a: 'The default size is `1em`, so it follows the font size of its parent. Pass `size` for a fixed size.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  radix: {
    slug: 'radix',
    name: 'Radix Icons',
    tagline: 'A precise 15×15 set built for compact controls and design tools',
    description:
      'Radix Icons is a set of 318 icons drawn on a 15×15 grid by the team behind Radix UI. The odd grid is deliberate: the icons are meant to render at exactly 15px inside compact controls such as dropdown triggers, checkboxes and toolbar buttons. The set leans toward interface and editor concepts (alignment, borders, spacing, typography, components) and includes a few tool logos such as Figma, GitHub and Vercel.',
    npm: '@radix-ui/react-icons',
    iconCount: 218,
    license: 'MIT',
    url: 'https://www.radix-ui.com/icons',
    color: 'from-gray-700 to-gray-900',
    features: [
      '318 icons on a 15×15 grid',
      'Renders at a fixed 15×15px by default',
      'Strong coverage of layout, typography and editor actions',
      'Filled-outline drawing with even-odd cut-outs',
      'Single ES module with `/*#__PURE__*/` annotations for tree-shaking',
      'MIT license',
    ],
    useCases: [
      'Radix UI and other headless component libraries',
      'Design and editing tools',
      'Compact controls: selects, menus, checkboxes',
      'Minimal interfaces with small icon needs',
    ],
    installCmd: 'npm install @radix-ui/react-icons',
    usageCode: `import { ChevronDownIcon, CheckIcon, GearIcon } from '@radix-ui/react-icons';

export function SelectTrigger({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-1 text-sm">
      {label}
      {/* Native 15×15 — the size the icons are drawn for */}
      <ChevronDownIcon aria-hidden="true" />
    </button>
  );
}

// There is no size prop: use width/height
export function BigGear() {
  return <GearIcon width={30} height={30} color="#111827" aria-hidden="true" />;
}`,
    relatedSlugs: ['heroicons', 'lucide'],
    metaTitle: 'Radix Icons — 15×15 React Icons for Compact UI | Icony',
    metaDescription:
      'Radix Icons explained: 318 icons on a 15×15 grid, fixed 15px default, no size prop, filled-outline drawing, bundle behaviour, and MIT license, measured from the package.',
    specs: [
      { label: 'Version examined', value: '@radix-ui/react-icons 1.3.2' },
      { label: 'Icons in the package', value: '318' },
      { label: 'Icons available in Icony', value: '218 (curated)' },
      { label: 'Canvas', value: '15×15 viewBox' },
      { label: 'Default size', value: '`width="15"` `height="15"`' },
      { label: 'Drawing model', value: 'Filled outlines (`fill="currentColor"` on paths), no strokes' },
      { label: 'Rendered `HomeIcon` SVG', value: '808 bytes (436 gzipped)' },
      { label: 'License', value: 'MIT' },
    ],
    sections: [
      {
        heading: 'Design language',
        paragraphs: [
          'A rendered `<HomeIcon />` is `width="15" height="15" viewBox="0 0 15 15"` with `fill="none"` on the root and `fill="currentColor"`, `fill-rule="evenodd"` and `clip-rule="evenodd"` on the path. Lines are about 1 unit wide and drawn as filled outlines, so at the native 15px they are 1px lines placed to land cleanly on the pixel grid. The style is thin, square-ish and neutral, closer to a design tool’s icons than to a friendly consumer app.',
          'Coordinates are written with five decimal places (`M7.07926 0.222253C7.31275…`). That is why a simple house is 808 bytes rendered, about double Lucide’s house, and the gear is 2,834 bytes. A Radix-style UI typically uses a handful of icons, so this rarely matters, but you’ll notice it if you inline many of them.',
          'The catalogue reflects its origin: alignment, border styles, spacing, letter case, component and frame icons sit next to general UI arrows and chevrons. There are 14 logo icons, including GitHub, Figma, Framer, Notion, Discord and Vercel.',
        ],
      },
      {
        heading: 'What works and what does not',
        bullets: [
          'Crisp at 15px. For chevrons in selects, checks in checkboxes and dots in menus, few sets look as clean at that size.',
          'A good vocabulary for editors and design tools (borders, padding, margins, opacity, transforms).',
          'A small API. Apart from `color`, props go straight to the `<svg>`.',
          'The catalogue is small. 318 icons won’t cover e-commerce, media, weather or most domain concepts.',
          'The grid is odd. 15×15 doesn’t scale evenly to 16, 20 or 24px, so scaled icons lose their pixel alignment and can look slightly blurry.',
          'No stroke control and no solid set (a few icons have `Filled` twins, such as `StarFilledIcon` and `HeartFilledIcon`).',
        ],
      },
      {
        heading: 'When Radix Icons is the wrong fit',
        bullets: [
          'Your icons mostly render at 20–24px or larger. Choose a 24-grid set such as Lucide or Heroicons.',
          'You need more than a couple of hundred concepts, or domain icons.',
          'You need outline/solid pairs for navigation states.',
        ],
      },
      {
        heading: 'Radix Icons vs. Heroicons vs. Lucide',
        paragraphs: [
          'Radix and Heroicons both favour a small, carefully finished catalogue. Heroicons is drawn for 24px (and has redrawn 20 and 16px solid sets), while Radix is drawn for 15px.',
          'Lucide is the usual pairing when a Radix-based UI outgrows the set. Its much larger catalogue covers the gaps, but at 24px with 2px strokes it looks heavier. If the two appear side by side, render Lucide at `size={15}` with `strokeWidth={1.5}` (about 0.94px on screen, close to Radix’s 1px lines) and check the result by eye.',
        ],
      },
      {
        heading: 'Installation gotchas',
        bullets: [
          'There is no `size` prop. Pass `width` and `height`, or style the SVG with CSS. The default is a fixed 15px, not `1em`, so the icon will not grow with text.',
          'Every name ends in `Icon` (`HomeIcon`, `GearIcon`), and numbered variants are common (`Cross1Icon`, `Cross2Icon`, `Pencil1Icon`, `Pencil2Icon`). Check the preview: the numbers are variants, not versions.',
          'The package ships all 318 icons in one ES module: `react-icons.esm.js` is 492,915 bytes (102,587 gzipped). Each icon is wrapped in `/*#__PURE__*/`, so production bundlers drop unused ones, but only with named imports. `import * as Icons` keeps everything.',
          'There is no `aria-hidden` by default. Add it to decorative icons and label icon-only buttons.',
        ],
      },
      {
        heading: 'License: MIT, with a WorkOS notice',
        paragraphs: [
          'Radix Icons is MIT-licensed (copyright WorkOS). Commercial use, modification and redistribution are allowed; keep the notice with your source. The logo icons depict third-party trademarks, which the MIT license does not cover, so use them according to each brand’s guidelines.',
        ],
      },
    ],
    faq: [
      {
        q: 'Why are Radix icons 15px instead of 16?',
        a: 'They are drawn on a 15-unit grid so that a 1-unit line sits exactly on a pixel at 15px. The odd size also gives a true centre pixel, which helps symmetric shapes such as chevrons and crosses.',
      },
      {
        q: 'Why does Icony have 218 Radix icons?',
        a: 'Icony includes a curated subset with English and Korean search tags; the package has 318.',
      },
      {
        q: 'Can I change the line thickness?',
        a: 'No. Lines are filled shapes, so `strokeWidth` has no effect. Scaling the icon scales the lines with it.',
      },
    ],
  },
};

export const ALL_LIBRARY_SLUGS = Object.keys(LIBRARY_CONTENT) as LibrarySlug[];

/**
 * Curated library-slug → related blog-post slugs for cross-silo internal
 * linking (the reverse of blog-content's RELATED_LIBRARIES). Points each
 * library page at the guides most relevant to it so crawlers — and readers —
 * can cross from the reference pages into the how-to content. Post slugs are
 * plain strings to avoid coupling this module to blog-content.
 */
export const RELATED_POSTS: Record<LibrarySlug, string[]> = {
  lucide: ['lucide-vs-tabler-vs-heroicons', 'svg-stroke-width', 'best-free-icon-libraries-2026'],
  tabler: ['lucide-vs-tabler-vs-heroicons', 'svg-stroke-width', 'best-free-icon-libraries-2026'],
  phosphor: ['svg-stroke-width', 'change-svg-icon-color', 'best-free-icon-libraries-2026'],
  'phosphor-fill': ['svg-vs-png-icons', 'change-svg-icon-color', 'best-free-icon-libraries-2026'],
  heroicons: ['lucide-vs-tabler-vs-heroicons', 'svg-to-react-component', 'best-free-icon-libraries-2026'],
  'heroicons-solid': ['svg-to-react-component', 'change-svg-icon-color', 'best-free-icon-libraries-2026'],
  bootstrap: ['add-icons-to-website', 'svg-vs-png-icons', 'best-free-icon-libraries-2026'],
  radix: ['svg-to-react-component', 'add-icons-to-website', 'best-free-icon-libraries-2026'],
};
