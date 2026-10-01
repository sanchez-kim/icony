import type { BlogPost } from '../types';

// Code samples used only by this post. Icon markup is copied verbatim from the
// npm packages installed in this repo (@tabler/icons 3.36.1, lucide-react 0.460.0).
const TABLER_STAR_SVG = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-star"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245" />
</svg>`;

const STAR_COMPONENT = `import * as React from 'react';

type IconProps = React.ComponentPropsWithoutRef<'svg'> & {
  size?: number | string;
  title?: string;
};

export function StarIcon({ size = 24, title, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245" />
    </svg>
  );
}

// Usage
<StarIcon className="text-amber-500" />            // decorative, inherits color
<StarIcon size={32} title="Favorited" />            // meaningful, announced
<StarIcon strokeWidth={1.5} stroke="#2563eb" />     // props override defaults`;

const FORWARD_REF = `// React 18: forwardRef is required to expose the <svg> DOM node
export const StarIcon = React.forwardRef<SVGSVGElement, IconProps>(
  function StarIcon({ size = 24, ...props }, ref) {
    return (
      <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" {...props}>
        {/* paths */}
      </svg>
    );
  }
);

// React 19: ref is an ordinary prop, so the plain function works as-is
// function StarIcon({ size = 24, ref, ...props }: IconProps & { ref?: React.Ref<SVGSVGElement> })`;

const ICON_FACTORY = `type IconNode = [tag: string, attrs: Record<string, string>][];

export function createIcon(displayName: string, nodes: IconNode) {
  function Icon({ size = 24, ...props }: IconProps) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth={2} strokeLinecap="round"
           strokeLinejoin="round" aria-hidden="true" {...props}>
        {nodes.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs }))}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}

// One small module per icon keeps everything tree-shakeable
export const StarIcon = createIcon('StarIcon', [
  ['path', { d: 'M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245' }],
]);`;

const SVGR_VITE = `// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,                                   // width/height = "1em"
        replaceAttrValues: { '#000': 'currentColor' },
      },
    }),
  ],
});

// src/vite-env.d.ts
/// <reference types="vite-plugin-svgr/client" />

// Anywhere in the app
import StarIcon from './icons/star.svg?react';`;

const SVGR_NEXT = `// next.config.js — Next.js 16 builds with Turbopack by default
module.exports = {
  turbopack: {
    rules: {
      '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' },
    },
  },
};`;

const SVGR_CLI = `# Convert a folder once and commit the output
npx @svgr/cli --typescript --icon \\
  --replace-attr-values "#000=currentColor" \\
  --out-dir src/icons -- assets/icons`;

const USE_ID_GRADIENT = `function GradientBadge(props: React.ComponentPropsWithoutRef<'svg'>) {
  // React 18 ids look like ":R0:" — strip the colons so the id is also
  // safe to use in a CSS selector.
  const id = React.useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...props}>
      <defs>
        <linearGradient id={\`\${id}-g\`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill={\`url(#\${id}-g)\`} />
    </svg>
  );
}`;

const ICONY_JSX_OUTPUT = `import * as React from 'react';

export function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" className="lucide lucide-star" {...props}>
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679…z"></path>
    </svg>
  );
}`;

export const post: BlogPost = {
  slug: 'svg-to-react-component',
  category: 'how-to',
  readingMinutes: 9,
  published: '2026-03-12',
  updated: '2026-09-30',
  related: ['change-svg-icon-color', 'svg-vs-png-icons', 'lucide-vs-tabler-vs-heroicons'],
  title: {
    en: 'How to Turn an SVG Icon into a React Component',
    ko: 'SVG 아이콘을 React 컴포넌트로 만드는 방법',
  },
  description: {
    en: 'Convert raw SVG into a typed, reusable React component: the attribute changes JSX needs, a props API that holds up, refs, tree-shaking, SVGR setup for Vite and Next.js, and the ID and styling bugs that bite later.',
    ko: '원본 SVG를 타입이 있는 재사용 React 컴포넌트로: JSX에 필요한 속성 변환, 오래 버티는 props 설계, ref, 트리셰이킹, Vite·Next.js용 SVGR 설정, 나중에 터지는 ID·스타일 버그까지.',
  },
  metaTitle: {
    en: 'How to Use an SVG Icon as a React Component | Icony',
    ko: 'SVG 아이콘을 React 컴포넌트로 쓰는 법 | Icony',
  },
  metaDescription: {
    en: 'Turn an SVG into a React component: camelCase attributes, currentColor, a size/title props API, forwardRef, SVGR for Vite and Next.js 16, and fixes for duplicate IDs.',
    ko: 'SVG를 React 컴포넌트로: camelCase 속성, currentColor, size/title props, forwardRef, Vite·Next.js 16용 SVGR, 중복 ID 문제 해결까지.',
  },
  blocks: {
    en: [
      { type: 'p', text: 'Paste an SVG from a design tool into a `.tsx` file and you find out quickly that JSX is not HTML. React warns about `class` and `stroke-width`, the compiler rejects `xlink:href`, and a `style="…"` string throws at render time. None of this is hard to fix, but the fixes are only half the job. The other half is giving the icon a props API that still makes sense after it has been used in forty places.' },
      { type: 'p', text: 'This guide walks through the conversion by hand, then shows when to hand the job to SVGR. The markup in the examples is copied from real packages installed via npm (`@tabler/icons` 3.36.1 and `lucide-react` 0.460.0), not simplified stand-ins, so the quirks you see are the quirks you will actually meet.' },

      { type: 'h2', text: 'Start from real markup' },
      { type: 'p', text: 'This is Tabler’s star icon exactly as it ships in `node_modules/@tabler/icons/icons/outline/star.svg`:' },
      { type: 'code', lang: 'xml', code: TABLER_STAR_SVG },
      { type: 'p', text: 'Three things need attention before it can live in JSX: the hyphenated presentation attributes, the `class` attribute, and that first `<path>`. The first path is Tabler’s invisible 24×24 bounding box: it has `stroke="none"` and `fill="none"`, so it draws nothing. You can delete it. If you keep it, read the “Common mistakes” section below, because it can come back to haunt you.' },

      { type: 'h2', text: 'Step 1: convert the attributes' },
      { type: 'p', text: 'React expects camelCase names for SVG attributes that contain a hyphen. These are the ones that show up in icon files in practice:' },
      { type: 'ul', items: [
        '`stroke-width`, `stroke-linecap`, `stroke-linejoin` → `strokeWidth`, `strokeLinecap`, `strokeLinejoin`',
        '`stroke-dasharray`, `stroke-dashoffset`, `stroke-miterlimit` → `strokeDasharray`, `strokeDashoffset`, `strokeMiterlimit`',
        '`fill-rule`, `clip-rule`, `clip-path` → `fillRule`, `clipRule`, `clipPath`',
        '`stop-color`, `stop-opacity` (inside gradients) → `stopColor`, `stopOpacity`',
        '`class` → `className`',
        '`xlink:href` → plain `href`, and drop `xmlns:xlink`. SVG 2 made the `xlink` namespace unnecessary, and namespaced attribute names are a compile error in JSX.',
        '`style="opacity:.5;fill:red"` → `style={{ opacity: 0.5, fill: \'red\' }}`. A string throws: “The `style` prop expects a mapping from style properties to values, not a string.”',
      ] },
      { type: 'p', text: 'Some things stay exactly as they are. `viewBox` is already camelCase in SVG, geometry attributes like `d`, `cx`, `r` and `points` have no hyphen, and `data-*` and `aria-*` attributes stay hyphenated in JSX. `xmlns` is harmless inline, and it is worth keeping if the same markup might also be saved as a standalone `.svg` file, where it is required.' },
      { type: 'tip', text: 'If you miss one, React tells you in the dev console with a message like “Invalid DOM property `stroke-width`. Did you mean `strokeWidth`?” The icon usually still renders, so these warnings are easy to ignore until someone turns on a strict lint rule.' },

      { type: 'h2', text: 'Step 2: wrap it in a component with a real props API' },
      { type: 'p', text: 'A component that only renders fixed markup is barely better than pasting the SVG. The useful version lets callers change size and color, add a class, and decide whether the icon is decorative or meaningful:' },
      { type: 'code', lang: 'tsx', code: STAR_COMPONENT },
      { type: 'p', text: 'Each decision in that component is there for a reason:' },
      { type: 'ul', items: [
        '**`stroke="currentColor"`, not a hex value.** The icon takes the CSS `color` of its parent, so `className="text-amber-500"` or a `color` on the button just works, including in dark mode.',
        '**Defaults before `{...props}`.** Spreading last means a caller’s `strokeWidth` or `stroke` wins. If you spread first, your hard-coded defaults silently overwrite what the caller passed, which is the most common “my prop does nothing” bug.',
        '**`size` sets `width` and `height`, never the `viewBox`.** The viewBox describes the coordinate system of the path data. Change it and the drawing shifts or crops instead of scaling.',
        '**`aria-hidden` by default, `role="img"` with a `<title>` on request.** Most icons sit next to text that already says what they mean. The ones that stand alone need a name. See the accessibility guide for the full pattern.',
        '**`React.ComponentPropsWithoutRef<\'svg\'>` instead of `React.SVGProps<SVGSVGElement>`.** `SVGProps` carries a `ref` typed as a legacy ref (string refs included), which tends to cause type errors once you add `forwardRef`.',
      ] },

      { type: 'h2', text: 'Forwarding refs' },
      { type: 'p', text: 'Tooltip libraries, animation code and focus management sometimes need the actual `<svg>` DOM node. In React 18 a function component cannot receive a `ref` unless it is wrapped in `forwardRef`. In React 19, `ref` is a regular prop:' },
      { type: 'code', lang: 'tsx', code: FORWARD_REF },

      { type: 'h2', text: 'One component per icon, or one generic <Icon name>?' },
      { type: 'p', text: 'Once you have more than a handful of icons, you have to decide how to organize them. The choice mostly comes down to bundle size.' },
      { type: 'ul', items: [
        '**One module per icon** is what Lucide, Tabler and Heroicons ship. Bundlers can drop every icon you do not import. In `lucide-react` 0.460.0, the star icon module (`dist/esm/icons/star.js`) is 765 bytes on disk, 459 bytes gzipped. The shared runtime it depends on (`createLucideIcon.js`, `Icon.js`, `defaultAttributes.js`) adds about 2.3 KB raw, paid once no matter how many icons you import. (Measured with `wc -c` and `gzip -9c | wc -c`.)',
        '**A single `<Icon name="star" />` backed by a lookup object** is convenient, but the object references every icon, so every icon ends up in the bundle. That is fine for 15 icons and a real cost for 500.',
      ] },
      { type: 'p', text: 'If you are building your own set of 30 or more icons, copy Lucide’s approach. It stores each icon as data (an array of `[tag, attributes]` pairs) and renders all of them through one factory, so every icon file stays tiny and still tree-shakes:' },
      { type: 'code', lang: 'tsx', code: ICON_FACTORY },
      { type: 'p', text: 'The attribute objects passed to `createElement` must already use React’s camelCase names (`strokeWidth`, not `stroke-width`), because they skip the JSX compiler.' },

      { type: 'h2', text: 'Step 3: automate it with SVGR' },
      { type: 'p', text: 'Hand-converting stops making sense when designers keep sending new `.svg` files. SVGR turns SVG files into React components, either at build time or once from the command line. With Vite, `vite-plugin-svgr` (v4 and later) exposes components through a `?react` import suffix:' },
      { type: 'code', lang: 'ts', code: SVGR_VITE },
      { type: 'p', text: '`icon: true` replaces the fixed width and height with `1em`, so the icon scales with font size. `replaceAttrValues` swaps a hard-coded color for `currentColor` during conversion. Match the value your design tool actually exports (`#000`, `#000000`, `#1E1E1E`…), since the replacement is an exact string match.' },
      { type: 'p', text: 'Next.js 16 builds with Turbopack by default, so register SVGR as a Turbopack loader rule. This is the configuration from the Next.js docs:' },
      { type: 'code', lang: 'js', code: SVGR_NEXT },
      { type: 'p', text: 'A third option skips build configuration entirely. Run the SVGR CLI over a folder and commit the generated `.tsx` files. You get ordinary components that show up in code review and diff cleanly when an icon changes:' },
      { type: 'code', lang: 'bash', code: SVGR_CLI },
      { type: 'p', text: 'Which should you pick? Use the build plugin when icons change often and nobody edits the output by hand. Use the CLI when you want to tweak individual components afterwards (for example to add a second color or an animation), or when you do not control the bundler config.' },

      { type: 'h2', text: 'Common mistakes' },
      { type: 'ul', items: [
        '**Duplicate IDs.** Files exported from Figma or Illustrator often contain `<linearGradient id="a">` or `<clipPath id="b">`. Render two such icons on one page and both `url(#a)` references resolve to the first definition. If that first icon is inside a `display: none` container, the gradient can vanish from both. Give each instance a unique ID (see below), or let SVGO’s `prefixIds` plugin rewrite them at build time.',
        '**CSS resurrecting invisible paths.** Presentation attributes such as `stroke="none"` have the lowest priority in the cascade, so any CSS rule overrides them. A rule like `.icon path { stroke: currentColor }` will draw Tabler’s invisible bounding-box path as a visible square. Delete that path, or target the SVG root instead of every `path`.',
        '**Overriding attributes that live on child elements.** Lucide puts `stroke-linecap` and `stroke-linejoin` on the root `<svg>`. Heroicons 2.2 puts them on the `<path>` itself. A `strokeLinecap` prop passed to the root of a Heroicons-style component changes nothing, because an attribute set on a child beats one it would inherit.',
        '**Keeping `fill="none"` when switching to a filled style.** The paths inherit it. Set `fill="currentColor"` on the root, or on the path.',
        '**Resizing by editing `viewBox`.** Change `width` and `height` (or `font-size` when the size is `1em`), and leave the viewBox alone.',
      ] },
      { type: 'p', text: 'For per-instance gradient IDs, `useId()` (React 18 and later) is the simplest fix:' },
      { type: 'code', lang: 'tsx', code: USE_ID_GRADIENT },

      { type: 'h2', text: 'What Icony’s “Copy JSX” produces' },
      { type: 'p', text: 'Icony’s own converter is a useful reference for how little a single-icon conversion needs. It renders the icon you picked with `react-dom/server` (your color, size and stroke already applied), then `src/utils/svgCode.ts` renames `class` to `className`, camelCases every `word-word=` attribute except `data-` and `aria-`, and inserts `{...props}` after the baked-in attributes. For Lucide’s star in `#2563eb` the output looks like this (path data shortened):' },
      { type: 'code', lang: 'tsx', code: ICONY_JSX_OUTPUT },
      { type: 'p', text: 'The color is baked in as `stroke="#2563eb"`. Because props are spread last, you can still pass `stroke="currentColor"` at the call site to make it theme-aware, or edit that one attribute in the pasted code.' },

      { type: 'h2', text: 'Quick answers' },
      { type: 'ul', items: [
        '**Should I just use `<img src="/star.svg">` in React?** For single-color UI icons, usually not: an `<img>` cannot use `currentColor`, so hover states and dark mode need separate files. It is a fine choice for detailed, multi-color illustrations that never change color.',
        '**Does inlining every icon hurt performance?** Each inline icon is part of your JavaScript and your DOM. For a few dozen icons that cost is negligible. If the same icons repeat hundreds of times per page, compare with an SVG sprite.',
        '**Why does the stroke look thicker at 48px?** `strokeWidth` is measured in viewBox units, so a 2-unit stroke on a 24-unit viewBox renders 4px wide at 48px. Lower `strokeWidth` as the size goes up, or add `vectorEffect="non-scaling-stroke"` to the paths.',
      ] },

      { type: 'h2', text: 'Takeaway' },
      { type: 'p', text: 'Converting an SVG to JSX is mostly renaming attributes. Making it a good component comes down to a few habits: `currentColor` for color, defaults placed before `{...props}`, `size` mapped to width and height, decorative by default, and unique IDs for anything referenced with `url(#…)`. For one or two icons, do it by hand. For a growing set, use per-icon modules through SVGR or a small factory so unused icons never reach the bundle.' },
    ],
    ko: [
      { type: 'p', text: '디자인 툴에서 복사한 SVG를 `.tsx` 파일에 붙여 넣으면 JSX가 HTML이 아니라는 걸 금방 알게 됩니다. React는 `class`와 `stroke-width`에 경고를 띄우고, 컴파일러는 `xlink:href`를 거부하며, `style="…"` 문자열은 렌더링 중에 에러를 냅니다. 고치는 것 자체는 어렵지 않습니다. 하지만 그건 일의 절반이고, 나머지 절반은 아이콘이 마흔 군데에서 쓰인 뒤에도 무리 없는 props 구조를 잡는 일입니다.' },
      { type: 'p', text: '이 글에서는 먼저 손으로 변환하는 과정을 짚고, 그다음 SVGR에 맡겨야 할 시점을 다룹니다. 예제 마크업은 설명용으로 단순화한 것이 아니라 npm으로 설치한 실제 패키지(`@tabler/icons` 3.36.1, `lucide-react` 0.460.0)에서 그대로 가져왔습니다. 그래서 여기 나오는 특이점은 실무에서도 그대로 만나게 됩니다.' },

      { type: 'h2', text: '실제 마크업에서 시작하기' },
      { type: 'p', text: '아래는 `node_modules/@tabler/icons/icons/outline/star.svg`에 들어 있는 Tabler 별 아이콘 원본입니다.' },
      { type: 'code', lang: 'xml', code: TABLER_STAR_SVG },
      { type: 'p', text: 'JSX로 옮기기 전에 손볼 곳이 세 군데입니다. 하이픈이 들어간 표현 속성, `class` 속성, 그리고 첫 번째 `<path>`입니다. 첫 번째 path는 Tabler가 넣어 둔 24×24 투명 테두리 상자입니다. `stroke="none"`, `fill="none"`이라 아무것도 그리지 않으니 지워도 됩니다. 남겨 둘 거라면 아래 ‘흔한 실수’ 부분을 꼭 읽어 보세요. 나중에 문제를 일으킬 수 있습니다.' },

      { type: 'h2', text: '1단계: 속성 변환' },
      { type: 'p', text: 'React는 하이픈이 들어간 SVG 속성을 camelCase로 받습니다. 아이콘 파일에서 실제로 자주 보이는 것들은 다음과 같습니다.' },
      { type: 'ul', items: [
        '`stroke-width`, `stroke-linecap`, `stroke-linejoin` → `strokeWidth`, `strokeLinecap`, `strokeLinejoin`',
        '`stroke-dasharray`, `stroke-dashoffset`, `stroke-miterlimit` → `strokeDasharray`, `strokeDashoffset`, `strokeMiterlimit`',
        '`fill-rule`, `clip-rule`, `clip-path` → `fillRule`, `clipRule`, `clipPath`',
        '그라디언트 안의 `stop-color`, `stop-opacity` → `stopColor`, `stopOpacity`',
        '`class` → `className`',
        '`xlink:href` → 그냥 `href`로 바꾸고 `xmlns:xlink`는 삭제합니다. SVG 2부터 `xlink` 네임스페이스는 필요 없고, JSX에서 네임스페이스가 붙은 속성명은 컴파일 에러입니다.',
        '`style="opacity:.5;fill:red"` → `style={{ opacity: 0.5, fill: \'red\' }}`. 문자열을 넘기면 “The `style` prop expects a mapping from style properties to values, not a string.” 에러가 납니다.',
      ] },
      { type: 'p', text: '그대로 두는 것도 있습니다. `viewBox`는 SVG에서도 원래 camelCase이고, `d`, `cx`, `r`, `points` 같은 도형 속성에는 하이픈이 없습니다. `data-*`와 `aria-*`는 JSX에서도 하이픈 그대로 씁니다. `xmlns`는 인라인에서 있어도 문제가 없고, 같은 마크업을 별도 `.svg` 파일로 저장할 가능성이 있다면 남겨 두는 편이 낫습니다. 독립 파일에서는 꼭 필요한 속성이기 때문입니다.' },
      { type: 'tip', text: '하나를 빠뜨리면 개발 콘솔에 “Invalid DOM property `stroke-width`. Did you mean `strokeWidth`?” 같은 경고가 뜹니다. 아이콘은 대개 그대로 보이기 때문에 엄격한 린트 규칙을 켜기 전까지는 놓치기 쉽습니다.' },

      { type: 'h2', text: '2단계: 제대로 된 props를 갖춘 컴포넌트로 감싸기' },
      { type: 'p', text: '고정된 마크업만 렌더링하는 컴포넌트는 SVG를 붙여 넣는 것과 별 차이가 없습니다. 쓸모 있는 컴포넌트라면 호출하는 쪽에서 크기와 색을 바꾸고, 클래스를 붙이고, 장식용인지 의미가 있는 아이콘인지 정할 수 있어야 합니다.' },
      { type: 'code', lang: 'tsx', code: STAR_COMPONENT },
      { type: 'p', text: '각 선택에는 이유가 있습니다.' },
      { type: 'ul', items: [
        '**hex 값 대신 `stroke="currentColor"`.** 아이콘이 부모의 CSS `color`를 따라가므로 `className="text-amber-500"`이나 버튼에 준 `color`가 그대로 적용됩니다. 다크 모드도 마찬가지입니다.',
        '**기본값을 `{...props}`보다 앞에.** props를 마지막에 펼쳐야 호출하는 쪽에서 넘긴 `strokeWidth`나 `stroke`가 이깁니다. 먼저 펼치면 하드코딩한 기본값이 조용히 덮어써 버립니다. ‘prop을 넘겼는데 아무 변화가 없다’는 버그의 가장 흔한 원인입니다.',
        '**`size`는 `width`와 `height`만 바꾸고 `viewBox`는 건드리지 않기.** viewBox는 path 데이터의 좌표계입니다. 이걸 바꾸면 그림이 커지는 게 아니라 밀리거나 잘립니다.',
        '**기본은 `aria-hidden`, 필요할 때만 `<title>`과 `role="img"`.** 대부분의 아이콘은 뜻을 설명하는 텍스트 옆에 놓입니다. 혼자 쓰이는 아이콘만 이름이 필요합니다. 자세한 패턴은 접근성 가이드를 참고하세요.',
        '**`React.SVGProps<SVGSVGElement>` 대신 `React.ComponentPropsWithoutRef<\'svg\'>`.** `SVGProps`에는 문자열 ref까지 허용하는 레거시 타입의 `ref`가 들어 있어서, 나중에 `forwardRef`를 붙이면 타입 에러가 나기 쉽습니다.',
      ] },

      { type: 'h2', text: 'ref 전달하기' },
      { type: 'p', text: '툴팁 라이브러리나 애니메이션 코드, 포커스 관리 로직은 실제 `<svg>` DOM 노드가 필요할 때가 있습니다. React 18에서는 함수 컴포넌트를 `forwardRef`로 감싸야 `ref`를 받을 수 있고, React 19부터는 `ref`가 일반 prop입니다.' },
      { type: 'code', lang: 'tsx', code: FORWARD_REF },

      { type: 'h2', text: '아이콘마다 컴포넌트? 아니면 <Icon name> 하나?' },
      { type: 'p', text: '아이콘이 몇 개를 넘어가면 어떻게 정리할지 정해야 합니다. 결국 번들 크기 문제입니다.' },
      { type: 'ul', items: [
        '**아이콘 하나당 모듈 하나.** Lucide, Tabler, Heroicons가 모두 이렇게 배포합니다. import하지 않은 아이콘은 번들러가 전부 버릴 수 있습니다. `lucide-react` 0.460.0의 별 아이콘 모듈(`dist/esm/icons/star.js`)은 디스크 기준 765바이트, gzip 459바이트입니다. 여기에 공용 런타임(`createLucideIcon.js`, `Icon.js`, `defaultAttributes.js`)이 약 2.3KB 붙는데, 아이콘을 몇 개 쓰든 한 번만 들어갑니다. (`wc -c`와 `gzip -9c | wc -c`로 측정)',
        '**룩업 객체를 쓰는 `<Icon name="star" />` 하나.** 편하긴 하지만 객체가 모든 아이콘을 참조하므로 전부 번들에 들어갑니다. 아이콘이 15개라면 괜찮고, 500개라면 무시할 수 없는 비용입니다.',
      ] },
      { type: 'p', text: '아이콘을 30개 넘게 직접 관리한다면 Lucide 방식을 따라 하세요. 아이콘을 `[태그, 속성]` 배열이라는 데이터로 저장하고, 렌더링은 팩토리 하나가 맡습니다. 아이콘 파일은 작게 유지되고 트리셰이킹도 됩니다.' },
      { type: 'code', lang: 'tsx', code: ICON_FACTORY },
      { type: 'p', text: '`createElement`에 넘기는 속성 객체는 JSX 컴파일을 거치지 않으므로 처음부터 React식 camelCase 이름(`stroke-width`가 아니라 `strokeWidth`)으로 적어야 합니다.' },

      { type: 'h2', text: '3단계: SVGR로 자동화' },
      { type: 'p', text: '디자이너가 계속 새 `.svg` 파일을 보내오면 손으로 변환하는 건 의미가 없어집니다. SVGR은 SVG 파일을 React 컴포넌트로 바꿔 주는데, 빌드할 때 변환할 수도 있고 커맨드라인에서 한 번에 변환할 수도 있습니다. Vite에서는 `vite-plugin-svgr`(v4 이상)이 `?react` 접미사로 컴포넌트를 내보냅니다.' },
      { type: 'code', lang: 'ts', code: SVGR_VITE },
      { type: 'p', text: '`icon: true`는 고정된 width·height를 `1em`으로 바꿔 글자 크기에 맞춰 커지게 합니다. `replaceAttrValues`는 변환하면서 하드코딩된 색을 `currentColor`로 바꿔 줍니다. 문자열이 정확히 일치해야 바뀌므로, 디자인 툴이 실제로 내보내는 값(`#000`, `#000000`, `#1E1E1E` 등)에 맞춰 적어야 합니다.' },
      { type: 'p', text: 'Next.js 16은 기본적으로 Turbopack으로 빌드하므로 SVGR을 Turbopack 로더 규칙으로 등록합니다. Next.js 공식 문서에 나온 설정입니다.' },
      { type: 'code', lang: 'js', code: SVGR_NEXT },
      { type: 'p', text: '빌드 설정을 아예 건드리지 않는 방법도 있습니다. SVGR CLI로 폴더를 한 번 변환하고, 생성된 `.tsx` 파일을 커밋하는 겁니다. 평범한 컴포넌트라 코드 리뷰에서 보이고, 아이콘이 바뀌면 diff도 깔끔하게 나옵니다.' },
      { type: 'code', lang: 'bash', code: SVGR_CLI },
      { type: 'p', text: '어느 쪽을 고를지는 이렇게 정하면 됩니다. 아이콘이 자주 바뀌고 결과물을 손으로 고칠 일이 없다면 빌드 플러그인이 낫습니다. 변환 후 개별 컴포넌트를 손봐야 하거나(두 번째 색 추가, 애니메이션 등) 번들러 설정을 직접 바꿀 수 없다면 CLI가 낫습니다.' },

      { type: 'h2', text: '흔한 실수' },
      { type: 'ul', items: [
        '**중복 ID.** Figma나 Illustrator에서 내보낸 파일에는 `<linearGradient id="a">`, `<clipPath id="b">` 같은 정의가 흔합니다. 이런 아이콘 두 개를 한 페이지에 렌더링하면 두 `url(#a)` 참조가 모두 첫 번째 정의를 가리킵니다. 그 첫 번째 아이콘이 `display: none` 컨테이너 안에 있으면 양쪽에서 그라디언트가 사라질 수 있습니다. 인스턴스마다 고유 ID를 주거나(아래 예제 참고) 빌드 단계에서 SVGO의 `prefixIds` 플러그인으로 바꾸세요.',
        '**CSS가 투명 path를 되살리는 경우.** `stroke="none"` 같은 표현 속성은 캐스케이드에서 우선순위가 가장 낮아 어떤 CSS 규칙에도 밀립니다. `.icon path { stroke: currentColor }` 같은 규칙을 쓰면 Tabler의 투명 테두리 path가 눈에 보이는 사각형으로 그려집니다. 그 path를 지우거나, 모든 `path`가 아니라 SVG 루트에 스타일을 거세요.',
        '**자식 요소에 있는 속성을 루트에서 덮어쓰려는 경우.** Lucide는 `stroke-linecap`, `stroke-linejoin`을 루트 `<svg>`에 두지만 Heroicons 2.2는 `<path>`에 직접 둡니다. Heroicons 형태의 컴포넌트에서는 루트에 `strokeLinecap`을 넘겨도 아무 변화가 없습니다. 자식에 직접 지정된 속성이 상속받는 값보다 우선하기 때문입니다.',
        '**채움 스타일로 바꾸면서 `fill="none"`을 그대로 두는 경우.** path가 그 값을 상속합니다. 루트나 path에 `fill="currentColor"`를 지정하세요.',
        '**`viewBox`를 고쳐서 크기를 바꾸는 경우.** `width`와 `height`(크기가 `1em`이면 `font-size`)를 바꾸고 viewBox는 그대로 두세요.',
      ] },
      { type: 'p', text: '인스턴스별 그라디언트 ID는 `useId()`(React 18 이상)로 해결하는 게 가장 간단합니다.' },
      { type: 'code', lang: 'tsx', code: USE_ID_GRADIENT },

      { type: 'h2', text: 'Icony의 ‘JSX 복사’가 만드는 코드' },
      { type: 'p', text: 'Icony의 변환 코드를 보면 아이콘 하나를 변환하는 데 필요한 작업이 생각보다 적다는 걸 알 수 있습니다. 선택한 아이콘을 `react-dom/server`로 렌더링하고(색, 크기, 선 두께가 이미 적용된 상태), `src/utils/svgCode.ts`가 `class`를 `className`으로 바꾼 뒤, `data-`와 `aria-`를 제외한 모든 `단어-단어=` 형태의 속성을 camelCase로 변환하고, 고정된 속성들 뒤에 `{...props}`를 끼워 넣습니다. Lucide 별 아이콘을 `#2563eb`로 복사하면 다음과 같은 코드가 나옵니다(path 데이터는 줄임).' },
      { type: 'code', lang: 'tsx', code: ICONY_JSX_OUTPUT },
      { type: 'p', text: '색은 `stroke="#2563eb"`로 고정되어 있습니다. 하지만 props가 마지막에 펼쳐지므로, 호출할 때 `stroke="currentColor"`를 넘기거나 붙여 넣은 코드에서 그 속성 하나만 고치면 테마에 따라 색이 바뀌는 아이콘이 됩니다.' },

      { type: 'h2', text: '자주 묻는 질문' },
      { type: 'ul', items: [
        '**React에서도 그냥 `<img src="/star.svg">`를 쓰면 안 되나요?** 단색 UI 아이콘이라면 대체로 권하지 않습니다. `<img>`로는 `currentColor`를 쓸 수 없어서 호버 상태나 다크 모드마다 파일을 따로 만들어야 합니다. 색이 바뀔 일이 없는 복잡한 다색 일러스트라면 좋은 선택입니다.',
        '**모든 아이콘을 인라인으로 넣으면 성능이 나빠지나요?** 인라인 아이콘은 모두 JavaScript와 DOM의 일부가 됩니다. 수십 개 수준이면 무시해도 되는 비용입니다. 같은 아이콘이 한 페이지에 수백 번 반복된다면 SVG 스프라이트와 비교해 보세요.',
        '**48px에서 선이 더 두꺼워 보이는 이유는?** `strokeWidth`는 viewBox 단위라서, 24단위 viewBox에서 2단위 선은 48px로 그리면 4px 두께가 됩니다. 크기를 키울수록 `strokeWidth`를 낮추거나 path에 `vectorEffect="non-scaling-stroke"`를 추가하세요.',
      ] },

      { type: 'h2', text: '정리' },
      { type: 'p', text: 'SVG를 JSX로 옮기는 작업은 대부분 속성 이름 바꾸기입니다. 좋은 컴포넌트로 만드는 건 몇 가지 습관의 문제입니다. 색은 `currentColor`로, 기본값은 `{...props}`보다 앞에, `size`는 width·height로, 기본은 장식용으로, `url(#…)`로 참조하는 요소에는 고유 ID를 줍니다. 아이콘이 한두 개라면 손으로 변환하고, 계속 늘어나는 세트라면 SVGR이나 작은 팩토리로 아이콘마다 모듈을 두어 쓰지 않는 아이콘이 번들에 들어가지 않게 하세요.' },
    ],
  },
};
