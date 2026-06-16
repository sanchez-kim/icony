/**
 * blog-content.ts
 * Original, fact-checked guide content for the /blog section, in English + Korean.
 * Server-component safe (no 'use client'). Rendered statically for SEO; the
 * visible language follows the app's LanguageContext (like the terms/privacy pages).
 *
 * Blocks use a tiny structured model rather than MDX to stay dependency-free.
 * Inline **bold** and `code` are supported in paragraph and list text.
 * Code blocks are language-agnostic and identical across locales.
 */

export type BlogLang = 'en' | 'ko';

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'code'; lang?: string; code: string }
  | { type: 'tip'; text: string };

export type BlogCategory = 'how-to' | 'comparison' | 'troubleshooting';

type L<T> = Record<BlogLang, T>;

export interface BlogPost {
  slug: string;
  category: BlogCategory;
  readingMinutes: number;
  /** ISO date the post was first published (absolute). */
  published: string;
  /** ISO date the post was last reviewed/updated (absolute). */
  updated: string;
  related: string[];
  title: L<string>;
  /** Short excerpt for the index card. */
  description: L<string>;
  blocks: L<BlogBlock[]>;
  metaTitle: L<string>;
  metaDescription: L<string>;
}

export const CATEGORY_LABEL: Record<BlogCategory, L<string>> = {
  'how-to': { en: 'How-to', ko: '하우투' },
  comparison: { en: 'Comparison', ko: '비교' },
  troubleshooting: { en: 'Troubleshooting', ko: '트러블슈팅' },
};

// ── Shared, language-agnostic code samples ─────────────────────────────────
const CODE = {
  currentColorCss: '.icon { color: #ff5500; }   /* the SVG follows the text color */',
  fillStrokeCss: '.icon-filled  { fill: #2563eb; }\n.icon-outline { stroke: #2563eb; }',
  hardcodedToCurrent:
    '<!-- before -->\n<path fill="#000000" d="..." />\n<!-- after -->\n<path fill="currentColor" d="..." />',
  reactComponent:
    "export function StarIcon(props: React.SVGProps<SVGSVGElement>) {\n  return (\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\n         strokeWidth={2} {...props}>\n      <path d=\"M12 2l3 7 7 .5-5 4.5 1.5 7L12 17l-6 4 1.5-7-5-4.5L9 9z\" />\n    </svg>\n  );\n}",
  svgrImport:
    "// vite-plugin-svgr (v4+): the ?react suffix returns a component\nimport StarIcon from './star.svg?react';\n\n<StarIcon width={24} className=\"text-yellow-500\" />\n\n// webpack / Create React App use a named export instead:\n// import { ReactComponent as StarIcon } from './star.svg';",
  viewBox: '<svg viewBox="0 0 24 24" width="24" height="24">…</svg>',
  inlineSvgBtn:
    '<button class="btn">\n  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" width="20">\n    <path d="M5 12h14M12 5l7 7-7 7" />\n  </svg>\n  Next\n</button>',
  imgTag: '<img src="/icons/arrow-right.svg" alt="Next" width="20" height="20" />',
  lucideImport: "import { ArrowRight } from 'lucide-react';\n\n<button>Next <ArrowRight size={20} /></button>",
  faviconHtml:
    '<!-- SVG primary (all modern browsers, incl. Safari 17+) -->\n<link rel="icon" href="/favicon.svg" type="image/svg+xml" />\n<!-- Fallback for older browsers (Safari < 17, IE) -->\n<link rel="icon" href="/favicon.ico" sizes="32x32" />\n<!-- iOS home screen -->\n<link rel="apple-touch-icon" href="/apple-touch-icon.png" /> <!-- 180×180 -->',
  iconSizeCss:
    '/* Match the icon box to your design grid */\n.icon { width: 20px; height: 20px; }\n\n/* Size by text so icons scale with their label */\n.icon { width: 1em; height: 1em; }',
  a11yDecorative: '<!-- Decorative: text already conveys the meaning -->\n<button>Delete <svg aria-hidden="true">…</svg></button>',
  a11yInformative: '<!-- Standalone, meaningful icon -->\n<svg role="img" aria-label="Verified account">\n  <title>Verified account</title>\n  …\n</svg>',
  a11yButton: '<!-- Icon-only control: label the button, hide the icon -->\n<button aria-label="Close dialog">\n  <svg aria-hidden="true">…</svg>\n</button>',
  svgoCmd: '# optimize a single file (overwrites it)\nnpx svgo icon.svg\n\n# optimize a whole folder\nnpx svgo -f ./icons',
  svgNoColor:
    '<!-- Invisible: no fill color and no stroke set -->\n<svg fill="none"><path d="…" /></svg>\n\n<!-- Fixed: give it a color (or currentColor) -->\n<svg fill="currentColor"><path d="…" /></svg>',
  canvasSvgToPng:
    "// Browser: rasterize an SVG to a PNG at any scale\nconst svg = document.querySelector('svg');\nconst blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });\nconst url = URL.createObjectURL(blob);\nconst img = new Image();\nimg.onload = () => {\n  const scale = 3; // export at 3x for a crisp result\n  const canvas = document.createElement('canvas');\n  canvas.width = img.width * scale;\n  canvas.height = img.height * scale;\n  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);\n  canvas.toBlob((png) => {/* download png */}, 'image/png');\n  URL.revokeObjectURL(url);\n};\nimg.src = url;",
  sharpSvgToPng:
    "// Node.js: convert with sharp (npm i sharp)\nimport sharp from 'sharp';\n\nawait sharp('icon.svg', { density: 300 })\n  .resize(512, 512)\n  .png()\n  .toFile('icon.png');",
  cliSvgToPng:
    '# ImageMagick (use a high density so the vector rasterizes sharply)\nmagick -background none -density 300 icon.svg -resize 512x512 icon.png\n\n# Inkscape\ninkscape icon.svg --export-type=png --export-width=512',
  cssSpin:
    "/* Inline SVG only — CSS can't reach inside <img src=\"icon.svg\"> */\n.spinner { animation: spin 1s linear infinite; }\n@keyframes spin { to { transform: rotate(360deg); } }",
  cssHover:
    '.icon-btn svg { transition: transform .2s ease, color .2s ease; }\n.icon-btn:hover svg { transform: scale(1.15); color: #6366f1; }',
  cssDraw:
    '/* "Draw" a stroked icon by animating its dash offset */\n.draw path {\n  stroke-dasharray: 100;\n  stroke-dashoffset: 100;\n  animation: draw 1s ease forwards;\n}\n@keyframes draw { to { stroke-dashoffset: 0; } }',
  reducedMotion:
    '@media (prefers-reduced-motion: reduce) {\n  .spinner, .draw path { animation: none; }\n}',
  spriteDefine:
    '<!-- Define once (e.g. near the top of <body>, or in an external sprite.svg) -->\n<svg style="display:none">\n  <symbol id="icon-star" viewBox="0 0 24 24">\n    <path d="M12 2l3 7 7 .5-5 4.5 1.5 7L12 17l-6 4 1.5-7-5-4.5L9 9z" />\n  </symbol>\n</svg>',
  spriteUse:
    '<!-- Reuse anywhere — no markup duplication -->\n<svg class="icon"><use href="#icon-star" /></svg>\n\n<!-- …or from an external file (all modern browsers): -->\n<svg class="icon"><use href="/sprite.svg#icon-star" /></svg>',
  spriteCss: '.icon { width: 24px; height: 24px; fill: currentColor; }',
  installLibs:
    'npm i lucide-react           # Lucide (ISC)\nnpm i @tabler/icons-react    # Tabler (MIT)\nnpm i @phosphor-icons/react  # Phosphor (MIT)\nnpm i @heroicons/react       # Heroicons (MIT)',
};

export const BLOG_POSTS: BlogPost[] = [
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'svg-vs-png-icons',
    category: 'comparison',
    readingMinutes: 5,
    published: '2026-02-12',
    updated: '2026-06-09',
    related: ['convert-svg-to-png', 'change-svg-icon-color', 'add-icons-to-website'],
    title: {
      en: 'SVG vs PNG Icons: Which Should You Use?',
      ko: 'SVG vs PNG 아이콘: 언제 무엇을 써야 할까?',
    },
    description: {
      en: 'SVG and PNG both work for icons, but they behave very differently. Here is how to pick the right format for the web, apps, email, and print.',
      ko: 'SVG와 PNG 모두 아이콘으로 쓰이지만 동작 방식이 전혀 다릅니다. 웹·앱·이메일·인쇄에 맞는 포맷을 고르는 기준을 정리했습니다.',
    },
    metaTitle: {
      en: 'SVG vs PNG Icons: Which Format Should You Use? | Icony',
      ko: 'SVG vs PNG 아이콘: 어떤 포맷을 써야 할까? | Icony',
    },
    metaDescription: {
      en: 'A practical comparison of SVG and PNG icons — scalability, file size, color control, and the right format for web, apps, and email.',
      ko: 'SVG와 PNG 아이콘 실전 비교 — 확장성, 파일 크기, 색상 제어, 그리고 웹·앱·이메일에 맞는 포맷 선택 가이드.',
    },
    blocks: {
      en: [
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
      ko: [
        { type: 'p', text: '아이콘을 내보낼 때 보통 **SVG**와 **PNG** 두 가지 선택지가 있습니다. 화면에선 똑같아 보여서 차이를 무시하기 쉽지만 — 레티나 화면에서 아이콘이 흐릿해지거나, 2 KB짜리 그래픽이 50 KB로 불어나는 순간 차이가 드러납니다. 이 글은 둘의 실제 차이와 각각 언제 써야 하는지 정리합니다.' },
        { type: 'h2', text: '핵심 차이' },
        { type: 'p', text: 'PNG는 **래스터(raster)** 포맷으로, 고정된 픽셀 격자를 저장합니다. SVG는 **벡터(vector)** 포맷으로, 브라우저가 어떤 크기로든 다시 그리는 수식(path·도형·선)을 저장합니다. 아래의 거의 모든 차이가 이 하나의 구분에서 나옵니다.' },
        { type: 'h2', text: 'SVG가 유리할 때' },
        { type: 'ul', items: [
          '웹이나 최신 앱 UI를 만들 때. SVG는 모든 크기와 픽셀 밀도에서 선명함을 유지합니다.',
          'CSS로 색상을 바꾸거나 애니메이션을 주고 싶을 때.',
          '파일 크기가 중요할 때 — 단순한 아이콘은 고해상도 PNG보다 SVG가 더 작은 경우가 많습니다.',
          '폰·4K 모니터·인쇄 스타일시트에서 모두 통하는 하나의 에셋이 필요할 때.',
        ] },
        { type: 'h2', text: 'PNG가 유리할 때' },
        { type: 'ul', items: [
          '대상이 SVG를 지원하지 않을 때 — 다수의 이메일 클라이언트, 일부 레거시 CMS, 일부 채팅/마켓플레이스 도구는 여전히 래스터 이미지만 받습니다.',
          '파비콘, 앱스토어 에셋, OG/소셜 미리보기처럼 고정 픽셀 크기가 필요할 때.',
          '아이콘이 매우 세밀하거나 사진에 가까워 벡터 path의 이점이 없을 때.',
        ] },
        { type: 'tip', text: '원칙: 브라우저에서 렌더되는 것은 기본적으로 SVG, 특정 대상이 고정 래스터 이미지를 요구할 때만 PNG로 내보내세요.' },
        { type: 'h2', text: '색상과 선 두께에 대하여' },
        { type: 'p', text: 'SVG는 그저 마크업이라 나중에도 색상이나 선 두께를 바꿀 수 있습니다 — `currentColor`를 쓰면 CSS 한 줄로도 가능합니다. PNG는 색상이 영구히 박혀 있어 바꾸려면 다시 내보내야 합니다. 라이트/다크 모드나 hover 상태처럼 아이콘에 테마를 입힐 계획이라면 SVG가 중복 에셋을 크게 줄여 줍니다.' },
        { type: 'p', text: 'Icony에서는 색상·크기·선 두께를 정확히 지정한 뒤 **같은 아이콘**을 SVG 또는 PNG로 내보낼 수 있어, 페이지를 떠나지 않고 필요한 포맷을 바로 받을 수 있습니다.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'change-svg-icon-color',
    category: 'how-to',
    readingMinutes: 6,
    published: '2026-02-26',
    updated: '2026-06-09',
    related: ['animate-svg-icons', 'svg-to-react-component', 'fix-blurry-svg-icons'],
    title: {
      en: 'How to Change the Color of an SVG Icon',
      ko: 'SVG 아이콘 색상 바꾸는 방법',
    },
    description: {
      en: 'Four reliable ways to recolor an SVG icon — from a one-line CSS trick with currentColor to editing the markup directly.',
      ko: 'SVG 아이콘 색상을 바꾸는 확실한 4가지 방법 — currentColor를 쓰는 CSS 한 줄부터 마크업 직접 수정까지.',
    },
    metaTitle: {
      en: 'How to Change the Color of an SVG Icon (4 Ways) | Icony',
      ko: 'SVG 아이콘 색상 바꾸는 4가지 방법 | Icony',
    },
    metaDescription: {
      en: 'Recolor any SVG icon with CSS currentColor, the fill/stroke attributes, inline styles, or a tool. With copy-paste code examples.',
      ko: 'CSS currentColor, fill/stroke 속성, 마크업 수정, 도구까지 — 복붙 가능한 예제로 SVG 아이콘 색상을 바꾸는 법을 설명합니다.',
    },
    blocks: {
      en: [
        { type: 'p', text: 'Changing an SVG icon’s color trips up a lot of people because it depends on **how the SVG is drawn** — some icons are filled, others are stroked — and on **how you embedded it**. Here are the four approaches that actually work, from easiest to most manual.' },
        { type: 'h2', text: '1. The currentColor trick (best for inline SVG)' },
        { type: 'p', text: 'Most modern icon sets (Lucide, Heroicons, Bootstrap Icons) set `fill="currentColor"` or `stroke="currentColor"`. That keyword means “use the element’s CSS text color,” so you recolor the icon just by setting `color`:' },
        { type: 'code', lang: 'css', code: CODE.currentColorCss },
        { type: 'p', text: 'This is why icons inside a button automatically match the button’s text color. If your icon does **not** change, open the markup and check whether it uses a hard-coded color instead of `currentColor` (see step 3).' },
        { type: 'h2', text: '2. Set fill or stroke directly' },
        { type: 'p', text: 'Filled icons use `fill`; outline icons use `stroke`. Target the right one:' },
        { type: 'code', lang: 'css', code: CODE.fillStrokeCss },
        { type: 'tip', text: 'A common mistake: setting `fill` on an outline icon (or vice versa) and seeing nothing happen. If `fill` does nothing, the icon is probably stroke-based — try `stroke`.' },
        { type: 'h2', text: '3. Edit the SVG markup' },
        { type: 'p', text: 'If the icon ships with a hard-coded color, change it at the source. Open the `.svg` and replace the color value, or swap it for `currentColor` so CSS can take over:' },
        { type: 'code', lang: 'html', code: CODE.hardcodedToCurrent },
        { type: 'h2', text: '4. Use a tool (no code)' },
        { type: 'p', text: 'If you just need a colored asset to hand off, a visual editor is fastest. In Icony you pick any icon, choose a color (or the eyedropper / hex input), and export the recolored icon as SVG or PNG — no markup editing required. You can also copy the result as ready-to-paste SVG or a React component.' },
      ],
      ko: [
        { type: 'p', text: 'SVG 아이콘 색상 바꾸기가 헷갈리는 이유는 **아이콘이 어떻게 그려졌는지**(채움형 vs 외곽선형)와 **어떻게 삽입했는지**에 따라 방법이 달라지기 때문입니다. 쉬운 것부터 수동적인 것까지, 실제로 통하는 4가지를 정리했습니다.' },
        { type: 'h2', text: '1. currentColor 트릭 (인라인 SVG에 최적)' },
        { type: 'p', text: '대부분의 최신 아이콘 세트(Lucide, Heroicons, Bootstrap Icons)는 `fill="currentColor"` 또는 `stroke="currentColor"`를 씁니다. 이 키워드는 "요소의 CSS 텍스트 색상을 따른다"는 뜻이라, `color`만 지정하면 아이콘 색이 바뀝니다:' },
        { type: 'code', lang: 'css', code: CODE.currentColorCss },
        { type: 'p', text: '버튼 안의 아이콘이 버튼 글자색과 자동으로 맞춰지는 것도 이 때문입니다. 만약 색이 **안 바뀐다면**, 마크업을 열어 `currentColor` 대신 색이 하드코딩돼 있는지 확인하세요(3번 참고).' },
        { type: 'h2', text: '2. fill 또는 stroke 직접 지정' },
        { type: 'p', text: '채움형 아이콘은 `fill`, 외곽선형 아이콘은 `stroke`를 씁니다. 맞는 쪽을 지정하세요:' },
        { type: 'code', lang: 'css', code: CODE.fillStrokeCss },
        { type: 'tip', text: '흔한 실수: 외곽선형 아이콘에 `fill`을 (또는 그 반대로) 줘서 아무 변화가 없는 경우. `fill`이 안 먹으면 stroke 기반 아이콘일 가능성이 크니 `stroke`를 시도하세요.' },
        { type: 'h2', text: '3. SVG 마크업 직접 수정' },
        { type: 'p', text: '아이콘에 색이 하드코딩돼 있다면 원본에서 바꾸세요. `.svg`를 열어 색상 값을 교체하거나, `currentColor`로 바꿔 CSS가 제어하도록 하면 됩니다:' },
        { type: 'code', lang: 'html', code: CODE.hardcodedToCurrent },
        { type: 'h2', text: '4. 도구 사용 (코드 없이)' },
        { type: 'p', text: '색을 입힌 에셋만 넘기면 된다면 비주얼 에디터가 가장 빠릅니다. Icony에서는 아이콘을 고르고 색상(또는 스포이드/HEX 입력)을 선택해 SVG·PNG로 바로 내보낼 수 있습니다 — 마크업 수정이 필요 없습니다. 결과를 복붙 가능한 SVG나 React 컴포넌트로 복사할 수도 있습니다.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'svg-to-react-component',
    category: 'how-to',
    readingMinutes: 6,
    published: '2026-03-12',
    updated: '2026-06-09',
    related: ['change-svg-icon-color', 'svg-vs-png-icons', 'lucide-vs-tabler-vs-heroicons'],
    title: {
      en: 'How to Turn an SVG Icon into a React Component',
      ko: 'SVG 아이콘을 React 컴포넌트로 만드는 방법',
    },
    description: {
      en: 'Three ways to use an SVG in React — inline JSX, a reusable component with props, and tooling like SVGR — plus the gotchas that cause errors.',
      ko: 'React에서 SVG를 쓰는 3가지 방법 — 인라인 JSX, props를 받는 재사용 컴포넌트, SVGR 같은 도구 — 그리고 오류를 부르는 함정까지.',
    },
    metaTitle: {
      en: 'How to Use an SVG Icon as a React Component | Icony',
      ko: 'SVG 아이콘을 React 컴포넌트로 쓰는 법 | Icony',
    },
    metaDescription: {
      en: 'Convert an SVG into a React/JSX component the right way: camelCase attributes, currentColor, prop spreading, and SVGR — with examples.',
      ko: 'SVG를 React/JSX 컴포넌트로 올바르게 변환하기: camelCase 속성, currentColor, props 스프레드, SVGR까지 예제로 설명합니다.',
    },
    blocks: {
      en: [
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
        { type: 'code', lang: 'tsx', code: CODE.reactComponent },
        { type: 'p', text: 'Using `stroke="currentColor"` means the icon inherits the surrounding text color, so `<StarIcon className="text-yellow-500" />` just works.' },
        { type: 'h2', text: 'Step 3 (optional): automate with SVGR' },
        { type: 'p', text: 'For many icons, a tool beats hand-conversion. **SVGR** turns `.svg` files into components. With Vite, `vite-plugin-svgr` exposes them via a `?react` import; webpack and Create React App use a `ReactComponent` named export instead:' },
        { type: 'code', lang: 'tsx', code: CODE.svgrImport },
        { type: 'tip', text: 'Watch out for duplicate `id` attributes when you inline multiple SVGs — gradients and clip-paths with the same id collide. Give each a unique id or let SVGR namespace them.' },
        { type: 'h2', text: 'The shortcut' },
        { type: 'p', text: 'In Icony you can pick an icon, set its color and stroke, and hit **Copy JSX** to get a ready-to-paste React component — attributes already camelCased and `props` spread for you. Handy when you just need one or two icons without setting up a build plugin.' },
      ],
      ko: [
        { type: 'p', text: '원본 SVG를 JSX에 그대로 붙여넣으면 보통 오류가 납니다. JSX는 HTML이 아니기 때문입니다. 몇 군데만 손보면 SVG는 깔끔하게 재사용 가능한 React 컴포넌트가 됩니다. 수작업과 도구 두 방법을 모두 설명합니다.' },
        { type: 'h2', text: '1단계: 속성 고치기' },
        { type: 'p', text: 'JSX는 **camelCase** 속성명을 요구합니다. SVG의 하이픈 속성을 변환하고 `class`를 바꾸세요:' },
        { type: 'ul', items: [
          '`stroke-width` → `strokeWidth`',
          '`stroke-linecap` → `strokeLinecap`',
          '`fill-rule` → `fillRule`, `clip-rule` → `clipRule`',
          '`class` → `className`',
        ] },
        { type: 'h2', text: '2단계: 컴포넌트로 감싸기' },
        { type: 'p', text: '루트 `<svg>`에 `props`를 스프레드하면 호출하는 쪽에서 크기·색상·className을 덮어쓸 수 있습니다:' },
        { type: 'code', lang: 'tsx', code: CODE.reactComponent },
        { type: 'p', text: '`stroke="currentColor"`를 쓰면 아이콘이 주변 텍스트 색상을 상속하므로 `<StarIcon className="text-yellow-500" />`만으로 색이 적용됩니다.' },
        { type: 'h2', text: '3단계(선택): SVGR로 자동화' },
        { type: 'p', text: '아이콘이 많다면 도구가 수작업보다 낫습니다. **SVGR**은 `.svg` 파일을 컴포넌트로 변환합니다. Vite에서는 `vite-plugin-svgr`이 `?react` import로 노출하고, webpack과 Create React App은 `ReactComponent` 네임드 export 방식을 씁니다:' },
        { type: 'code', lang: 'tsx', code: CODE.svgrImport },
        { type: 'tip', text: '여러 SVG를 인라인할 때 중복 `id` 속성에 주의하세요 — 같은 id를 가진 gradient·clip-path가 충돌합니다. 각자 고유 id를 주거나 SVGR이 네임스페이스를 붙이게 하세요.' },
        { type: 'h2', text: '지름길' },
        { type: 'p', text: 'Icony에서는 아이콘을 고르고 색·선 두께를 설정한 뒤 **JSX 복사**를 누르면 바로 붙여넣을 수 있는 React 컴포넌트가 나옵니다 — 속성은 이미 camelCase로 변환되고 `props`도 스프레드돼 있습니다. 빌드 플러그인 설정 없이 아이콘 한두 개만 필요할 때 유용합니다.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'lucide-vs-tabler-vs-heroicons',
    category: 'comparison',
    readingMinutes: 7,
    published: '2026-03-26',
    updated: '2026-06-09',
    related: ['best-free-icon-libraries-2026', 'svg-to-react-component', 'add-icons-to-website'],
    title: {
      en: 'Lucide vs Tabler vs Heroicons: Which Icon Library?',
      ko: 'Lucide vs Tabler vs Heroicons: 어떤 아이콘 라이브러리?',
    },
    description: {
      en: 'A side-by-side look at three popular open-source icon sets — size, style, stroke control, and which projects each one fits best.',
      ko: '인기 오픈소스 아이콘 세트 3종 비교 — 규모·스타일·선 두께 제어, 그리고 각각 어떤 프로젝트에 맞는지.',
    },
    metaTitle: {
      en: 'Lucide vs Tabler vs Heroicons: Icon Library Comparison | Icony',
      ko: 'Lucide vs Tabler vs Heroicons 아이콘 라이브러리 비교 | Icony',
    },
    metaDescription: {
      en: 'Compare Lucide, Tabler, and Heroicons by icon count, style, stroke control, and license to choose the right open-source icon set.',
      ko: '아이콘 수·스타일·선 두께 제어·라이선스 기준으로 Lucide·Tabler·Heroicons를 비교해 알맞은 오픈소스 아이콘 세트를 고르세요.',
    },
    blocks: {
      en: [
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
        { type: 'p', text: 'Made by the Tailwind CSS team. Smaller and more curated (**~300** icons, each in outline and solid variants). The solid set is filled (no stroke control), while the 24px outline set uses a fixed 1.5px stroke. Pairs naturally with Tailwind UI.' },
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
      ko: [
        { type: 'p', text: 'Lucide·Tabler·Heroicons는 가장 많이 쓰이는 오픈소스 아이콘 라이브러리 3종입니다 — 모두 무료, MIT/ISC 라이선스, SVG 기반입니다. 겹치는 부분이 많아서, 선택은 결국 **스타일·아이콘 폭·선 두께를 얼마나 제어해야 하는가**로 갈립니다.' },
        { type: 'h2', text: 'Lucide' },
        { type: 'p', text: 'Feather Icons에서 갈라져 나온 커뮤니티 관리 라이브러리로, 일관된 24×24 그리드와 깔끔한 2px 선 위에 **1,500개 이상**의 아이콘을 제공합니다. 선 두께를 prop으로 조절할 수 있어 타이포그래피에 맞추기 좋습니다. 많은 React/Tailwind 스타터 킷의 기본값입니다.' },
        { type: 'ul', items: [
          '적합: SaaS 대시보드, 관리자 패널, 개발자 도구.',
          '스타일: 미니멀 외곽선, 매우 일관적.',
          '선 두께: 완전 조절 가능.',
        ] },
        { type: 'h2', text: 'Tabler' },
        { type: 'p', text: '세 라이브러리 중 가장 폭넓은 세트 — **5,000개 이상** — 역시 24×24 그리드에 선 두께 조절이 가능합니다. 특정 브랜드, 파일 형식, 흔치 않은 사물 같은 니치한 아이콘이 필요하다면 Tabler에 있을 확률이 가장 높습니다.' },
        { type: 'ul', items: [
          '적합: 폭넓은 커버리지와 브랜드/로고 글리프가 많이 필요한 대형 앱.',
          '스타일: 외곽선 + 다수의 채움형 변형.',
          '선 두께: 조절 가능.',
        ] },
        { type: 'h2', text: 'Heroicons' },
        { type: 'p', text: 'Tailwind CSS 팀이 만들었습니다. 더 작고 정제된 세트로(**약 300개**, 각각 외곽선·솔리드 변형). 솔리드는 채움형(선 두께 제어 없음)이고, 24px 외곽선 세트는 고정 1.5px 선을 씁니다. Tailwind UI와 자연스럽게 어울립니다.' },
        { type: 'ul', items: [
          '적합: Tailwind 프로젝트, 마케팅 사이트, 집중도 높은 UI.',
          '스타일: 외곽선·솔리드 두 가지 의도된 변형.',
          '선 두께: 고정(외곽선) / 해당 없음(솔리드).',
        ] },
        { type: 'h2', text: '빠른 선택 가이드' },
        { type: 'ul', items: [
          '폭넓은 커버리지와 희귀 아이콘이 필요하다 → **Tabler**.',
          '깔끔하고 조절 가능한 범용 세트를 원한다 → **Lucide**.',
          '이미 Tailwind를 쓰고 정제된 매칭을 원한다 → **Heroicons**.',
        ] },
        { type: 'tip', text: '무턱대고 하나에 올인할 필요는 없습니다. Icony에는 이 3종(+ Phosphor, Bootstrap Icons, Radix)이 한곳에 있어 — 가로질러 검색하고, 같은 아이콘을 나란히 비교한 뒤, 커스터마이즈해 내보낼 수 있습니다.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'fix-blurry-svg-icons',
    category: 'troubleshooting',
    readingMinutes: 5,
    published: '2026-04-09',
    updated: '2026-06-09',
    related: ['svg-vs-png-icons', 'change-svg-icon-color', 'add-icons-to-website'],
    title: {
      en: 'Why Are My SVG Icons Blurry? (And How to Fix It)',
      ko: 'SVG 아이콘이 흐릿한 이유 (그리고 해결법)',
    },
    description: {
      en: 'Blurry icons almost always come from a handful of fixable causes — wrong viewBox, half-pixel positioning, or a rasterized export. Here is the checklist.',
      ko: '흐릿한 아이콘은 거의 항상 몇 가지 고칠 수 있는 원인에서 비롯됩니다 — 잘못된 viewBox, 반픽셀 위치, 래스터로 내보낸 파일. 체크리스트로 정리했습니다.',
    },
    metaTitle: {
      en: 'Why Are My SVG Icons Blurry? How to Fix Fuzzy Icons | Icony',
      ko: 'SVG 아이콘이 흐릿한 이유와 해결법 | Icony',
    },
    metaDescription: {
      en: 'Fix blurry or fuzzy icons: missing viewBox, sub-pixel positioning, missing width/height, and accidental PNG exports. A practical checklist.',
      ko: '흐릿한 아이콘 해결: viewBox 누락, 반픽셀 위치, 크기 불일치, 실수로 내보낸 PNG까지 — 실전 체크리스트.',
    },
    blocks: {
      en: [
        { type: 'p', text: 'SVG is supposed to be infinitely sharp, so a blurry SVG icon almost always points to one of a few specific causes. Work through this checklist top to bottom.' },
        { type: 'h2', text: '1. You actually exported a PNG' },
        { type: 'p', text: 'The most common culprit. A PNG sized for a 1× display looks soft on a 2×/3× retina screen because the browser scales it up. If sharpness matters and the target supports it, use **SVG instead**. If you must use PNG, export at 2–3× the display size.' },
        { type: 'h2', text: '2. Missing or wrong viewBox' },
        { type: 'p', text: 'Without a `viewBox`, the browser cannot scale the SVG cleanly. Make sure the root element has one that matches the artwork’s coordinate system:' },
        { type: 'code', lang: 'html', code: CODE.viewBox },
        { type: 'h2', text: '3. Sub-pixel positioning' },
        { type: 'p', text: 'If an icon sits at a fractional pixel (for example, `left: 10.5px` or inside a flex/grid container that lands on a half pixel), edges get anti-aliased into a blur. Snap the container to whole pixels and avoid odd parent dimensions.' },
        { type: 'tip', text: 'A `transform: translate(...)` with non-integer values, or `scale()` on a parent, can also nudge an icon onto half pixels. Check the computed layout in DevTools.' },
        { type: 'h2', text: '4. CSS scaling a fixed-size raster' },
        { type: 'p', text: 'Setting `width`/`height` in CSS larger than a raster image’s natural size upscales pixels. For SVG this is fine; for PNG it blurs. Match the asset size to its display size, or switch to SVG.' },
        { type: 'h2', text: '5. Background image rendering' },
        { type: 'p', text: 'Icons used as CSS `background-image` can render softly if `background-size` does not match the intrinsic size. Prefer inline SVG or an `<img>` with explicit dimensions for crisp results.' },
        { type: 'p', text: 'When you export from Icony you can choose the exact size and grab a clean SVG (sharp at any scale) or a correctly-sized PNG — which sidesteps most of the causes above.' },
      ],
      ko: [
        { type: 'p', text: 'SVG는 원래 무한히 선명해야 하므로, 흐릿한 SVG 아이콘은 거의 항상 몇 가지 특정 원인을 가리킵니다. 이 체크리스트를 위에서부터 차례로 점검하세요.' },
        { type: 'h2', text: '1. 사실은 PNG를 내보낸 경우' },
        { type: 'p', text: '가장 흔한 원인입니다. 1× 화면 기준으로 만든 PNG는 2×/3× 레티나 화면에서 브라우저가 확대하므로 흐릿해 보입니다. 선명함이 중요하고 대상이 지원한다면 **SVG를 쓰세요**. PNG를 꼭 써야 한다면 표시 크기의 2~3배로 내보내세요.' },
        { type: 'h2', text: '2. viewBox 누락 또는 오류' },
        { type: 'p', text: '`viewBox`가 없으면 브라우저가 SVG를 깔끔하게 확대하지 못합니다. 루트 요소에 아트워크 좌표계와 맞는 viewBox가 있는지 확인하세요:' },
        { type: 'code', lang: 'html', code: CODE.viewBox },
        { type: 'h2', text: '3. 반픽셀(sub-pixel) 위치' },
        { type: 'p', text: '아이콘이 소수점 픽셀에 놓이면(예: `left: 10.5px`, 또는 flex/grid 컨테이너가 반픽셀에 떨어질 때) 가장자리가 안티에일리어싱되어 흐려집니다. 컨테이너를 정수 픽셀에 맞추고 홀수 크기의 부모를 피하세요.' },
        { type: 'tip', text: '정수가 아닌 값의 `transform: translate(...)`나 부모의 `scale()`도 아이콘을 반픽셀로 밀어낼 수 있습니다. DevTools에서 계산된 레이아웃을 확인하세요.' },
        { type: 'h2', text: '4. CSS로 고정 크기 래스터를 확대' },
        { type: 'p', text: 'CSS에서 `width`/`height`를 래스터 이미지의 원본 크기보다 크게 주면 픽셀이 확대됩니다. SVG는 괜찮지만 PNG는 흐려집니다. 에셋 크기를 표시 크기에 맞추거나 SVG로 바꾸세요.' },
        { type: 'h2', text: '5. 배경 이미지 렌더링' },
        { type: 'p', text: 'CSS `background-image`로 쓴 아이콘은 `background-size`가 원본 크기와 안 맞으면 흐리게 렌더될 수 있습니다. 선명한 결과를 원하면 인라인 SVG나 크기를 명시한 `<img>`를 쓰세요.' },
        { type: 'p', text: 'Icony에서 내보낼 때는 정확한 크기를 선택해 깨끗한 SVG(모든 배율에서 선명)나 크기가 정확한 PNG를 받을 수 있어, 위 원인 대부분을 피할 수 있습니다.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'add-icons-to-website',
    category: 'how-to',
    readingMinutes: 6,
    published: '2026-04-23',
    updated: '2026-06-09',
    related: ['svg-to-react-component', 'lucide-vs-tabler-vs-heroicons', 'svg-vs-png-icons'],
    title: {
      en: '3 Ways to Add Icons to Your Website',
      ko: '웹사이트에 아이콘 넣는 3가지 방법',
    },
    description: {
      en: 'Inline SVG, an <img> tag, or an icon font/component library — the three practical ways to put icons on a page, with the trade-offs of each.',
      ko: '인라인 SVG, <img> 태그, 아이콘 폰트/컴포넌트 라이브러리 — 페이지에 아이콘을 넣는 실전 3가지 방법과 각각의 장단점.',
    },
    metaTitle: {
      en: 'How to Add Icons to Your Website (3 Practical Ways) | Icony',
      ko: '웹사이트에 아이콘 넣는 3가지 방법 | Icony',
    },
    metaDescription: {
      en: 'Add icons to any website with inline SVG, an img tag, or a component/icon library. Pros, cons, and copy-paste examples for each.',
      ko: '인라인 SVG, img 태그, 컴포넌트/아이콘 라이브러리로 웹사이트에 아이콘을 넣는 법. 각 방법의 장단점과 복붙 예제.',
    },
    blocks: {
      en: [
        { type: 'p', text: 'There is no single “right” way to add an icon to a web page — it depends on whether you need to recolor it, how many icons you have, and your stack. Here are the three approaches that cover almost every case.' },
        { type: 'h2', text: '1. Inline SVG (most control)' },
        { type: 'p', text: 'Paste the SVG markup straight into your HTML. The icon becomes part of the DOM, so you can style it with CSS, recolor it with `currentColor`, and animate it.' },
        { type: 'code', lang: 'html', code: CODE.inlineSvgBtn },
        { type: 'ul', items: [
          'Pros: full CSS control, recolorable, animatable, no extra request.',
          'Cons: markup gets verbose if you repeat the same icon a lot.',
        ] },
        { type: 'h2', text: '2. An <img> tag (simplest)' },
        { type: 'p', text: 'Reference an `.svg` (or `.png`) file like any image. Clean markup, but the icon is isolated — you cannot recolor an `<img>` SVG with CSS.' },
        { type: 'code', lang: 'html', code: CODE.imgTag },
        { type: 'ul', items: [
          'Pros: dead simple, cacheable, keeps HTML tidy.',
          'Cons: no CSS recoloring, one network request per unique icon.',
        ] },
        { type: 'h2', text: '3. A component or icon-font library (best at scale)' },
        { type: 'p', text: 'If you use a framework, an icon library (Lucide, Heroicons, Tabler, …) gives you tree-shakeable components with consistent props:' },
        { type: 'code', lang: 'tsx', code: CODE.lucideImport },
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
      ko: [
        { type: 'p', text: '웹 페이지에 아이콘을 넣는 단 하나의 "정답"은 없습니다 — 색을 바꿔야 하는지, 아이콘이 몇 개인지, 어떤 스택인지에 따라 달라집니다. 거의 모든 경우를 커버하는 3가지를 소개합니다.' },
        { type: 'h2', text: '1. 인라인 SVG (제어력 최고)' },
        { type: 'p', text: 'SVG 마크업을 HTML에 그대로 붙여넣습니다. 아이콘이 DOM의 일부가 되므로 CSS로 스타일하고, `currentColor`로 색을 바꾸고, 애니메이션을 줄 수 있습니다.' },
        { type: 'code', lang: 'html', code: CODE.inlineSvgBtn },
        { type: 'ul', items: [
          '장점: 완전한 CSS 제어, 색 변경·애니메이션 가능, 추가 요청 없음.',
          '단점: 같은 아이콘을 많이 반복하면 마크업이 장황해짐.',
        ] },
        { type: 'h2', text: '2. <img> 태그 (가장 단순)' },
        { type: 'p', text: '`.svg`(또는 `.png`) 파일을 일반 이미지처럼 참조합니다. 마크업은 깔끔하지만 아이콘이 고립돼 — `<img>`로 넣은 SVG는 CSS로 색을 바꿀 수 없습니다.' },
        { type: 'code', lang: 'html', code: CODE.imgTag },
        { type: 'ul', items: [
          '장점: 매우 간단, 캐시 가능, HTML이 깔끔.',
          '단점: CSS 색 변경 불가, 아이콘마다 네트워크 요청 1번.',
        ] },
        { type: 'h2', text: '3. 컴포넌트/아이콘 폰트 라이브러리 (규모에 최적)' },
        { type: 'p', text: '프레임워크를 쓴다면 아이콘 라이브러리(Lucide, Heroicons, Tabler …)가 일관된 props를 가진 트리셰이킹 컴포넌트를 제공합니다:' },
        { type: 'code', lang: 'tsx', code: CODE.lucideImport },
        { type: 'ul', items: [
          '장점: 일관된 API, 쉬운 테마, 임포트한 아이콘만 번들에 포함.',
          '단점: 의존성 추가; 아이콘 하나엔 과함.',
        ] },
        { type: 'tip', text: '설치 없이 아이콘 몇 개만 필요한가요? Icony로 아이콘을 고르고 색을 입혀 인라인 SVG나 React 컴포넌트로 복사한 뒤 프로젝트에 바로 붙여넣으세요.' },
        { type: 'h2', text: '무엇을 골라야 할까?' },
        { type: 'ol', items: [
          '아이콘 몇 개 + 완전한 제어가 필요 → 인라인 SVG.',
          '정적 이미지 + 가장 단순한 마크업 → <img>.',
          '아이콘이 가득한 앱 전체 → 컴포넌트 라이브러리.',
        ] },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'icon-sizes-guide',
    category: 'how-to',
    readingMinutes: 5,
    published: '2026-05-07',
    updated: '2026-06-09',
    related: ['svg-stroke-width', 'fix-blurry-svg-icons', 'svg-vs-png-icons'],
    title: {
      en: 'What Size Should Your Icons Be?',
      ko: '아이콘 크기, 몇 px이 맞을까?',
    },
    description: {
      en: 'Common UI icon sizes, why a 24px grid is the default, and how to size icons so they stay crisp and aligned with text.',
      ko: '자주 쓰는 UI 아이콘 크기, 24px 그리드가 기본인 이유, 그리고 텍스트와 정렬되고 선명하게 크기를 잡는 법.',
    },
    metaTitle: {
      en: 'What Size Should Icons Be? UI Icon Size Guide | Icony',
      ko: '아이콘 크기 가이드: UI 아이콘은 몇 px? | Icony',
    },
    metaDescription: {
      en: 'A practical guide to icon sizes — 16/20/24px UI conventions, the 24px grid, em-based sizing, and keeping icons sharp.',
      ko: '아이콘 크기 실전 가이드 — 16/20/24px 관례, 24px 그리드, em 기반 크기, 선명함 유지까지.',
    },
    blocks: {
      en: [
        { type: 'p', text: 'There is no single correct icon size, but there are strong conventions. Picking from them keeps your UI consistent and your icons crisp.' },
        { type: 'h2', text: 'Common UI sizes' },
        { type: 'ul', items: [
          '**16px** — dense UI: inline with small text, table cells, menus.',
          '**20px** — buttons, form fields, compact toolbars.',
          '**24px** — the default for most app icons and navigation.',
          '**32px and up** — feature highlights, empty states, marketing.',
        ] },
        { type: 'h2', text: 'Why 24px is the default' },
        { type: 'p', text: 'Most modern icon sets (Lucide, Tabler, Heroicons) are drawn on a **24×24 grid**. Displaying them at 24px — or a clean multiple like 48px — means each path lands on whole pixels, so the icon stays sharp. Odd sizes like 23px or 25px can blur thin strokes.' },
        { type: 'tip', text: 'Prefer sizes that divide evenly from the 24px grid (16, 24, 32, 48). They scale cleanly and avoid sub-pixel fuzz.' },
        { type: 'h2', text: 'Size icons relative to text' },
        { type: 'p', text: 'For icons that sit next to text, sizing in `em` lets them scale with the font automatically:' },
        { type: 'code', lang: 'css', code: CODE.iconSizeCss },
        { type: 'h2', text: 'Match optical weight, not just box size' },
        { type: 'p', text: 'Two icons at the same pixel size can look unbalanced if one is dense and the other is sparse. Adjust slightly by eye so icons feel the same visual weight in a row — the box size is a starting point, not the final answer.' },
        { type: 'p', text: 'In Icony you can preview an icon at the exact pixel size you need and export it at that size, so what you see is what ships.' },
      ],
      ko: [
        { type: 'p', text: '아이콘 크기에 정답은 없지만, 강한 관례는 있습니다. 그 관례에서 고르면 UI가 일관되고 아이콘이 선명하게 유지됩니다.' },
        { type: 'h2', text: '자주 쓰는 UI 크기' },
        { type: 'ul', items: [
          '**16px** — 밀도 높은 UI: 작은 텍스트 옆, 표 셀, 메뉴.',
          '**20px** — 버튼, 폼 필드, 컴팩트 툴바.',
          '**24px** — 대부분의 앱 아이콘과 내비게이션의 기본.',
          '**32px 이상** — 기능 강조, 빈 상태, 마케팅.',
        ] },
        { type: 'h2', text: '24px가 기본인 이유' },
        { type: 'p', text: '대부분의 최신 아이콘 세트(Lucide·Tabler·Heroicons)는 **24×24 그리드**로 그려집니다. 24px(또는 48px 같은 깔끔한 배수)로 표시하면 각 path가 정수 픽셀에 떨어져 선명함이 유지됩니다. 23px·25px 같은 어중간한 크기는 얇은 선을 흐리게 만들 수 있습니다.' },
        { type: 'tip', text: '24px 그리드에서 정수로 나뉘는 크기(16, 24, 32, 48)를 선호하세요. 깔끔하게 확대되고 반픽셀 흐림을 피합니다.' },
        { type: 'h2', text: '텍스트에 상대적인 크기' },
        { type: 'p', text: '텍스트 옆에 놓이는 아이콘은 `em` 단위로 크기를 주면 폰트에 맞춰 자동으로 커집니다:' },
        { type: 'code', lang: 'css', code: CODE.iconSizeCss },
        { type: 'h2', text: '상자 크기가 아니라 시각적 무게를 맞추기' },
        { type: 'p', text: '같은 픽셀 크기라도 하나는 빽빽하고 하나는 성기면 나란히 놓았을 때 불균형해 보입니다. 한 줄에서 같은 시각적 무게로 느껴지도록 눈으로 살짝 조정하세요 — 상자 크기는 출발점일 뿐 정답이 아닙니다.' },
        { type: 'p', text: 'Icony에서는 필요한 정확한 픽셀 크기로 아이콘을 미리 보고 그 크기로 내보낼 수 있어, 보이는 그대로 적용됩니다.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'svg-stroke-width',
    category: 'how-to',
    readingMinutes: 5,
    published: '2026-05-14',
    updated: '2026-06-09',
    related: ['icon-sizes-guide', 'change-svg-icon-color', 'lucide-vs-tabler-vs-heroicons'],
    title: {
      en: 'SVG Stroke Width: What It Is and How to Choose',
      ko: 'SVG 선 두께(stroke width): 개념과 고르는 법',
    },
    description: {
      en: 'How stroke-width works in outline icons, why it scales with size, and how to pick a weight that matches your typography.',
      ko: '외곽선 아이콘에서 stroke-width가 동작하는 방식, 크기에 따라 함께 커지는 이유, 타이포그래피에 맞는 두께 고르는 법.',
    },
    metaTitle: {
      en: 'SVG Stroke Width Explained: How to Choose Icon Weight | Icony',
      ko: 'SVG 선 두께 완벽 이해: 아이콘 굵기 고르는 법 | Icony',
    },
    metaDescription: {
      en: 'Understand SVG stroke-width — how it scales, why outline icons need it, and how to match icon weight to your UI.',
      ko: 'SVG stroke-width 이해 — 확대 방식, 외곽선 아이콘에 필요한 이유, UI에 맞춰 아이콘 굵기를 맞추는 법.',
    },
    blocks: {
      en: [
        { type: 'p', text: 'Outline icons (Lucide, Tabler, Heroicons outline) are drawn as **strokes**, not fills. The `stroke-width` attribute controls how thick those lines are — and it has a big effect on how an icon feels.' },
        { type: 'h2', text: 'How stroke-width works' },
        { type: 'p', text: 'In SVG, `stroke-width` is measured in the icon’s own coordinate units. On a 24×24 grid, a `stroke-width` of 2 means a line 2 units thick. Because SVG is vector, that thickness **scales with the icon**: render the same icon larger and the stroke grows proportionally.' },
        { type: 'tip', text: 'This is why a 1.5px-looking stroke at 24px becomes visually heavier at 64px — the stroke is relative to the icon, not to screen pixels.' },
        { type: 'h2', text: 'Choosing a weight' },
        { type: 'ul', items: [
          '**1–1.5** — light, elegant; pairs with thin/regular type and larger sizes.',
          '**2** — the most common default; balanced and legible at small sizes.',
          '**2.5–3** — bold; good for emphasis, small targets, or matching heavy headings.',
        ] },
        { type: 'p', text: 'The guiding principle: **match the icon’s weight to your text’s weight.** A 2px icon next to bold 14px text can look thin; a 1px icon next to a light heading can look just right.' },
        { type: 'h2', text: 'A caveat' },
        { type: 'p', text: 'Stroke width only applies to **outline** icons. Filled/solid sets (Heroicons solid, Phosphor fill) have no stroke to adjust — their weight is baked into the shape. If a stroke control does nothing, the icon is probably a filled variant.' },
        { type: 'p', text: 'Icony lets you drag the stroke weight on supported libraries (Lucide, Tabler, Phosphor) and preview it live before exporting.' },
      ],
      ko: [
        { type: 'p', text: '외곽선 아이콘(Lucide·Tabler·Heroicons outline)은 채움이 아니라 **선(stroke)**으로 그려집니다. `stroke-width` 속성이 그 선의 굵기를 정하는데, 아이콘의 인상에 큰 영향을 줍니다.' },
        { type: 'h2', text: 'stroke-width가 동작하는 방식' },
        { type: 'p', text: 'SVG에서 `stroke-width`는 아이콘 자체의 좌표 단위로 측정됩니다. 24×24 그리드에서 `stroke-width` 2는 2단위 굵기의 선을 뜻합니다. SVG는 벡터이기 때문에 이 굵기는 **아이콘과 함께 확대**됩니다 — 같은 아이콘을 더 크게 그리면 선도 비례해서 두꺼워집니다.' },
        { type: 'tip', text: '24px에서 1.5px처럼 보이던 선이 64px에서 더 두껍게 보이는 이유가 이것입니다 — 선은 화면 픽셀이 아니라 아이콘에 상대적입니다.' },
        { type: 'h2', text: '두께 고르기' },
        { type: 'ul', items: [
          '**1–1.5** — 가볍고 우아함; 얇은/보통 굵기 글꼴과 큰 크기에 어울림.',
          '**2** — 가장 흔한 기본값; 작은 크기에서도 균형 있고 가독성 좋음.',
          '**2.5–3** — 굵음; 강조, 작은 타깃, 두꺼운 제목과 맞출 때 좋음.',
        ] },
        { type: 'p', text: '핵심 원칙: **아이콘 굵기를 텍스트 굵기에 맞춰라.** 굵은 14px 텍스트 옆의 2px 아이콘은 얇아 보일 수 있고, 가는 제목 옆의 1px 아이콘은 딱 맞을 수 있습니다.' },
        { type: 'h2', text: '주의점' },
        { type: 'p', text: '선 두께는 **외곽선** 아이콘에만 적용됩니다. 채움/솔리드 세트(Heroicons solid, Phosphor fill)는 조절할 선이 없습니다 — 굵기가 형태에 박혀 있습니다. 선 두께 조절이 아무 변화가 없다면 채움형 변형일 가능성이 큽니다.' },
        { type: 'p', text: 'Icony에서는 지원 라이브러리(Lucide·Tabler·Phosphor)에서 선 두께를 드래그로 조절하고 내보내기 전에 실시간으로 미리 볼 수 있습니다.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'make-a-favicon',
    category: 'how-to',
    readingMinutes: 6,
    published: '2026-05-21',
    updated: '2026-06-09',
    related: ['svg-vs-png-icons', 'reduce-svg-file-size', 'add-icons-to-website'],
    title: {
      en: 'How to Make a Favicon from an Icon',
      ko: '아이콘으로 파비콘 만드는 방법',
    },
    description: {
      en: 'The modern, minimal favicon setup in 2026 — one SVG, a PNG/ICO fallback, and a 180px Apple touch icon — plus the markup to wire it up.',
      ko: '2026년 기준 현대적·최소 파비콘 세팅 — SVG 하나, PNG/ICO 폴백, 180px Apple 터치 아이콘 — 그리고 연결 마크업까지.',
    },
    metaTitle: {
      en: 'How to Make a Favicon from an Icon (2026 Guide) | Icony',
      ko: '아이콘으로 파비콘 만들기 (2026 가이드) | Icony',
    },
    metaDescription: {
      en: 'Create a favicon the modern way: an SVG icon, a PNG/ICO fallback, an Apple touch icon, and the <link> markup — with sizes that matter.',
      ko: 'SVG 아이콘, PNG/ICO 폴백, Apple 터치 아이콘과 <link> 마크업으로 현대적인 파비콘을 만드는 법 — 꼭 필요한 사이즈까지.',
    },
    blocks: {
      en: [
        { type: 'p', text: 'Favicons used to need a dozen files. In 2026 you can cover almost every browser with **three**: an SVG, a raster fallback, and an Apple touch icon.' },
        { type: 'h2', text: 'The files you actually need' },
        { type: 'ul', items: [
          '**favicon.svg** — primary icon. Every modern browser renders SVG favicons crisply at any size, including Safari since version 17 (2023).',
          '**favicon.ico (or a 32px PNG)** — fallback for older browsers that predate SVG favicon support (Safari 16 and earlier, Internet Explorer).',
          '**apple-touch-icon.png (180×180)** — the icon iOS uses when a site is added to the home screen.',
        ] },
        { type: 'h2', text: 'The markup' },
        { type: 'p', text: 'Add these to the `<head>`:' },
        { type: 'code', lang: 'html', code: CODE.faviconHtml },
        { type: 'tip', text: 'An ICO file can bundle 16×16, 32×32, and 48×48 in one file — handy for the fallback. But a single 32×32 PNG is fine for most sites.' },
        { type: 'h2', text: 'Design tips for tiny sizes' },
        { type: 'ul', items: [
          'Simplify. A favicon is often rendered at 16px — fine detail disappears, so reduce the icon to its essential shape.',
          'Use a solid, high-contrast silhouette rather than thin outlines, which blur at small sizes.',
          'Test on both light and dark browser themes; consider a version that works on each.',
        ] },
        { type: 'h2', text: 'Making one from an icon' },
        { type: 'p', text: 'Pick a simple, recognizable icon, give it a bold color, and export it. In Icony you can export the same icon as a clean SVG (for `favicon.svg`) and as a 180px PNG (for the Apple touch icon) — then drop both into your site root and add the markup above.' },
      ],
      ko: [
        { type: 'p', text: '예전엔 파비콘에 파일이 십수 개 필요했습니다. 2026년에는 **세 개**로 거의 모든 브라우저를 커버할 수 있습니다 — SVG, 래스터 폴백, Apple 터치 아이콘.' },
        { type: 'h2', text: '실제로 필요한 파일' },
        { type: 'ul', items: [
          '**favicon.svg** — 기본 아이콘. 모든 최신 브라우저가 SVG 파비콘을 어떤 크기에서도 선명하게 렌더합니다. Safari도 17 버전(2023)부터 지원합니다.',
          '**favicon.ico (또는 32px PNG)** — SVG 파비콘 지원 이전의 구형 브라우저(Safari 16 이하, 인터넷 익스플로러)용 폴백.',
          '**apple-touch-icon.png (180×180)** — iOS에서 홈 화면에 추가할 때 쓰는 아이콘.',
        ] },
        { type: 'h2', text: '마크업' },
        { type: 'p', text: '`<head>`에 다음을 추가하세요:' },
        { type: 'code', lang: 'html', code: CODE.faviconHtml },
        { type: 'tip', text: 'ICO 파일은 16×16·32×32·48×48을 하나에 묶을 수 있어 폴백에 유용합니다. 하지만 대부분의 사이트는 32×32 PNG 하나로 충분합니다.' },
        { type: 'h2', text: '작은 크기를 위한 디자인 팁' },
        { type: 'ul', items: [
          '단순화하세요. 파비콘은 종종 16px로 렌더돼 미세한 디테일이 사라지니, 본질적인 형태만 남기세요.',
          '작은 크기에서 흐려지는 얇은 외곽선보다, 대비 높은 단단한 실루엣을 쓰세요.',
          '밝은/어두운 브라우저 테마 양쪽에서 테스트하고, 각각에 맞는 버전을 고려하세요.',
        ] },
        { type: 'h2', text: '아이콘으로 만들기' },
        { type: 'p', text: '단순하고 알아보기 쉬운 아이콘을 골라 선명한 색을 주고 내보내세요. Icony에서는 같은 아이콘을 깔끔한 SVG(`favicon.svg`용)와 180px PNG(Apple 터치 아이콘용)로 내보낼 수 있습니다 — 둘 다 사이트 루트에 넣고 위 마크업을 추가하면 됩니다.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'reduce-svg-file-size',
    category: 'how-to',
    readingMinutes: 5,
    published: '2026-05-28',
    updated: '2026-06-09',
    related: ['svg-vs-png-icons', 'make-a-favicon', 'svg-not-showing'],
    title: {
      en: 'How to Reduce SVG File Size',
      ko: 'SVG 파일 크기 줄이는 방법',
    },
    description: {
      en: 'Editor exports are bloated with metadata and excess precision. Here is how to shrink an SVG with SVGO and a few manual cleanups.',
      ko: '에디터에서 내보낸 SVG는 메타데이터와 과한 정밀도로 무겁습니다. SVGO와 몇 가지 수동 정리로 줄이는 법을 정리했습니다.',
    },
    metaTitle: {
      en: 'How to Reduce SVG File Size with SVGO | Icony',
      ko: 'SVGO로 SVG 파일 크기 줄이는 법 | Icony',
    },
    metaDescription: {
      en: 'Shrink bloated SVGs: run SVGO, trim path precision, drop editor metadata and hidden layers — without losing quality.',
      ko: 'SVGO 실행, path 정밀도 축소, 에디터 메타데이터·숨은 레이어 제거로 품질 손실 없이 SVG를 줄이는 법.',
    },
    blocks: {
      en: [
        { type: 'p', text: 'An SVG exported from a design tool is often 5–10× bigger than it needs to be. The extra weight is editor metadata, hidden layers, and absurd coordinate precision — none of which the browser needs.' },
        { type: 'h2', text: 'The fast win: SVGO' },
        { type: 'p', text: '**SVGO** is the standard SVG optimizer. You can run it without installing anything via `npx`:' },
        { type: 'code', lang: 'bash', code: CODE.svgoCmd },
        { type: 'p', text: 'On a typical editor export, SVGO alone often cuts 40–70% of the file size with no visible change.' },
        { type: 'h2', text: 'What is actually bloating the file' },
        { type: 'ul', items: [
          '**Editor metadata** — `<!-- Generator -->` comments, `sodipodi`/`inkscape` namespaces, XML declarations.',
          '**Coordinate precision** — paths like `d="M12.000001 …"`; 2–3 decimals is plenty.',
          '**Hidden or empty elements** — invisible layers, empty groups, unused `<defs>`.',
          '**Inline styles that repeat** — can often collapse to a presentation attribute.',
        ] },
        { type: 'tip', text: 'Be careful auto-removing `viewBox`, `id`s used by CSS/JS, or `<title>` needed for accessibility. SVGO is configurable — disable plugins that strip things you rely on.' },
        { type: 'h2', text: 'Manual cleanups' },
        { type: 'ol', items: [
          'Flatten the artwork in your editor before exporting (merge layers, expand strokes if needed).',
          'Crop the canvas tight to the icon so the viewBox is not oversized.',
          'Remove unused gradients, filters, and masks.',
        ] },
        { type: 'p', text: 'Icons from Icony are already clean, minimal SVGs from their source libraries — so when you copy or export one, there is little left to optimize.' },
      ],
      ko: [
        { type: 'p', text: '디자인 툴에서 내보낸 SVG는 필요한 것보다 5~10배 큰 경우가 많습니다. 그 무게는 에디터 메타데이터, 숨은 레이어, 말도 안 되는 좌표 정밀도 — 브라우저가 전혀 필요로 하지 않는 것들입니다.' },
        { type: 'h2', text: '빠른 해결: SVGO' },
        { type: 'p', text: '**SVGO**는 표준 SVG 최적화 도구입니다. `npx`로 설치 없이 바로 실행할 수 있습니다:' },
        { type: 'code', lang: 'bash', code: CODE.svgoCmd },
        { type: 'p', text: '일반적인 에디터 출력물에서는 SVGO만으로도 눈에 띄는 변화 없이 파일 크기를 40~70% 줄이는 경우가 많습니다.' },
        { type: 'h2', text: '무엇이 파일을 무겁게 하나' },
        { type: 'ul', items: [
          '**에디터 메타데이터** — `<!-- Generator -->` 주석, `sodipodi`/`inkscape` 네임스페이스, XML 선언.',
          '**좌표 정밀도** — `d="M12.000001 …"` 같은 path; 소수점 2~3자리면 충분합니다.',
          '**숨거나 빈 요소** — 보이지 않는 레이어, 빈 그룹, 사용하지 않는 `<defs>`.',
          '**반복되는 인라인 스타일** — 종종 표현 속성 하나로 줄일 수 있습니다.',
        ] },
        { type: 'tip', text: 'CSS/JS가 쓰는 `id`, 접근성에 필요한 `<title>`, `viewBox`를 자동 제거하지 않도록 주의하세요. SVGO는 설정 가능하니 의존하는 것을 제거하는 플러그인은 끄세요.' },
        { type: 'h2', text: '수동 정리' },
        { type: 'ol', items: [
          '내보내기 전에 에디터에서 아트워크를 평탄화하세요(레이어 병합, 필요하면 선 확장).',
          '캔버스를 아이콘에 딱 맞게 잘라 viewBox가 과하게 크지 않게 하세요.',
          '사용하지 않는 그라디언트·필터·마스크를 제거하세요.',
        ] },
        { type: 'p', text: 'Icony의 아이콘은 원본 라이브러리에서 온 이미 깔끔하고 최소화된 SVG라, 복사하거나 내보낼 때 추가로 최적화할 것이 거의 없습니다.' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'accessible-svg-icons',
    category: 'how-to',
    readingMinutes: 6,
    published: '2026-06-04',
    updated: '2026-06-09',
    related: ['svg-to-react-component', 'add-icons-to-website', 'svg-not-showing'],
    title: {
      en: 'How to Make SVG Icons Accessible',
      ko: '접근성 있는 SVG 아이콘 만드는 법',
    },
    description: {
      en: 'Decorative vs informative icons, when to hide them from screen readers, and how to label icon-only buttons the right way.',
      ko: '장식용 vs 정보용 아이콘, 스크린 리더에서 숨겨야 할 때, 그리고 아이콘만 있는 버튼을 올바르게 레이블하는 법.',
    },
    metaTitle: {
      en: 'Accessible SVG Icons: aria-hidden, role, and Labels | Icony',
      ko: '접근성 있는 SVG 아이콘: aria-hidden·role·레이블 | Icony',
    },
    metaDescription: {
      en: 'Make SVG icons accessible: hide decorative icons, label informative ones with role/aria-label, and name icon-only buttons.',
      ko: '접근성 있는 SVG 아이콘: 장식용은 숨기고, 정보용은 role/aria-label로 레이블하고, 아이콘 전용 버튼에 이름을 주는 법.',
    },
    blocks: {
      en: [
        { type: 'p', text: 'Whether an icon needs accessibility markup depends on one question: **does it carry meaning that the surrounding text does not?** Answer that, and the rest follows.' },
        { type: 'h2', text: 'Decorative icons: hide them' },
        { type: 'p', text: 'If the icon just decorates text that already says everything (a trash icon next to the word “Delete”), screen readers should skip it. Add `aria-hidden="true"`:' },
        { type: 'code', lang: 'html', code: CODE.a11yDecorative },
        { type: 'h2', text: 'Informative icons: label them' },
        { type: 'p', text: 'If the icon conveys meaning on its own (a checkmark that means “verified”, with no nearby text), give it `role="img"` and a label:' },
        { type: 'code', lang: 'html', code: CODE.a11yInformative },
        { type: 'h2', text: 'Icon-only buttons: name the button' },
        { type: 'p', text: 'This is the most common mistake. An icon-only button (a bare × to close) is unusable by screen readers unless the **control** is labeled. Put the label on the button and hide the icon:' },
        { type: 'code', lang: 'html', code: CODE.a11yButton },
        { type: 'tip', text: 'You no longer need `focusable="false"`. It was a workaround for Internet Explorer and old Edge; current browsers do not put SVGs in the tab order. Modern icon libraries also set `aria-hidden` for you on decorative icons.' },
        { type: 'h2', text: 'Quick checklist' },
        { type: 'ol', items: [
          'Icon repeats nearby text → `aria-hidden="true"`.',
          'Icon stands alone and means something → `role="img"` + `aria-label` (or a `<title>`).',
          'Icon-only button/link → `aria-label` on the button, `aria-hidden` on the icon.',
          'Never label the same thing twice — that makes screen readers announce it doubly.',
        ] },
      ],
      ko: [
        { type: 'p', text: '아이콘에 접근성 마크업이 필요한지는 한 가지 질문에 달려 있습니다: **주변 텍스트에 없는 의미를 이 아이콘이 담고 있는가?** 이것만 답하면 나머지는 따라옵니다.' },
        { type: 'h2', text: '장식용 아이콘: 숨긴다' },
        { type: 'p', text: '이미 모든 것을 말해 주는 텍스트를 꾸미기만 하는 아이콘이라면(“삭제”라는 글자 옆의 휴지통 아이콘), 스크린 리더는 건너뛰어야 합니다. `aria-hidden="true"`를 추가하세요:' },
        { type: 'code', lang: 'html', code: CODE.a11yDecorative },
        { type: 'h2', text: '정보용 아이콘: 레이블을 단다' },
        { type: 'p', text: '아이콘이 그 자체로 의미를 전달한다면(주변 텍스트 없이 “인증됨”을 뜻하는 체크표시), `role="img"`과 레이블을 주세요:' },
        { type: 'code', lang: 'html', code: CODE.a11yInformative },
        { type: 'h2', text: '아이콘 전용 버튼: 버튼에 이름을 준다' },
        { type: 'p', text: '가장 흔한 실수입니다. 아이콘만 있는 버튼(닫기용 × 하나)은 **컨트롤**에 레이블이 없으면 스크린 리더로 쓸 수 없습니다. 버튼에 레이블을 주고 아이콘은 숨기세요:' },
        { type: 'code', lang: 'html', code: CODE.a11yButton },
        { type: 'tip', text: '`focusable="false"`는 더 이상 필요 없습니다. Internet Explorer와 구형 Edge를 위한 우회책이었고, 최신 브라우저는 SVG를 탭 순서에 넣지 않습니다. 최신 아이콘 라이브러리도 장식용 아이콘에 `aria-hidden`을 대신 설정해 줍니다.' },
        { type: 'h2', text: '빠른 체크리스트' },
        { type: 'ol', items: [
          '아이콘이 주변 텍스트를 반복한다 → `aria-hidden="true"`.',
          '아이콘이 단독으로 의미를 가진다 → `role="img"` + `aria-label`(또는 `<title>`).',
          '아이콘 전용 버튼/링크 → 버튼에 `aria-label`, 아이콘에 `aria-hidden`.',
          '같은 것을 두 번 레이블하지 마세요 — 스크린 리더가 중복해서 읽습니다.',
        ] },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'svg-not-showing',
    category: 'troubleshooting',
    readingMinutes: 5,
    published: '2026-06-09',
    updated: '2026-06-09',
    related: ['fix-blurry-svg-icons', 'change-svg-icon-color', 'add-icons-to-website'],
    title: {
      en: 'SVG Not Showing? Common Causes and Fixes',
      ko: 'SVG가 안 보일 때: 흔한 원인과 해결법',
    },
    description: {
      en: 'An SVG that renders as nothing usually has one of a few causes — no dimensions, a missing color, a broken viewBox, or a server MIME-type issue.',
      ko: '아무것도 안 보이는 SVG는 보통 몇 가지 원인 중 하나입니다 — 크기 없음, 색 없음, 깨진 viewBox, 서버 MIME 타입 문제.',
    },
    metaTitle: {
      en: 'SVG Not Showing? How to Fix Invisible SVGs | Icony',
      ko: 'SVG가 안 보일 때 해결법 | Icony',
    },
    metaDescription: {
      en: 'Fix an SVG that will not display: missing width/height, no fill/stroke color, broken viewBox, wrong MIME type, or markup errors.',
      ko: 'SVG가 표시되지 않을 때 해결: 크기 누락, fill/stroke 색 없음, 깨진 viewBox, MIME 타입 오류, 마크업 오류.',
    },
    blocks: {
      en: [
        { type: 'p', text: 'An SVG that takes up no space or shows nothing at all is almost always one of these. Check them in order.' },
        { type: 'h2', text: '1. No dimensions' },
        { type: 'p', text: 'An inline `<svg>` with no `width`/`height` and no `viewBox` can collapse to zero size. Give it a `viewBox` (so it has an aspect ratio) and a size in CSS or attributes.' },
        { type: 'h2', text: '2. No visible color' },
        { type: 'p', text: 'If the icon uses `fill="none"` or `fill="currentColor"` but nothing sets a color, it renders invisibly. Give it a fill (or a `color` for `currentColor`):' },
        { type: 'code', lang: 'html', code: CODE.svgNoColor },
        { type: 'h2', text: '3. Broken or mismatched viewBox' },
        { type: 'p', text: 'If the `viewBox` does not match where the paths actually are, the artwork can sit outside the visible area — present in the DOM but off-screen. Make sure the viewBox encloses the path coordinates.' },
        { type: 'h2', text: '4. Wrong server MIME type' },
        { type: 'p', text: 'When loaded via `<img>` or as a background, an `.svg` must be served as `image/svg+xml`. If your server sends `text/plain` or `application/octet-stream`, browsers refuse to render it. Fix the server config or content type.' },
        { type: 'tip', text: 'Loading an external SVG via `<object>`/`<img>` from another origin can also fail on CORS. Same-origin or a permissive header fixes it.' },
        { type: 'h2', text: '5. Invalid markup' },
        { type: 'p', text: 'SVG is XML, so it is strict: an unclosed tag or a stray character can break the whole file silently. Open the `.svg` directly in a browser — if it shows an XML parse error, that is your culprit.' },
        { type: 'p', text: 'Icons exported from Icony come as valid, self-contained SVG with a correct `viewBox` and color applied — which avoids causes 1–3 and 5 entirely.' },
      ],
      ko: [
        { type: 'p', text: '공간을 전혀 차지하지 않거나 아무것도 안 보이는 SVG는 거의 항상 아래 중 하나입니다. 순서대로 확인하세요.' },
        { type: 'h2', text: '1. 크기 없음' },
        { type: 'p', text: '`width`/`height`도 `viewBox`도 없는 인라인 `<svg>`는 크기가 0으로 무너질 수 있습니다. `viewBox`(종횡비 확보)와 CSS·속성으로 크기를 주세요.' },
        { type: 'h2', text: '2. 보이는 색이 없음' },
        { type: 'p', text: '아이콘이 `fill="none"` 또는 `fill="currentColor"`를 쓰는데 아무 색도 지정되지 않으면 투명하게 렌더됩니다. fill을 주거나(`currentColor`라면 `color`를) 지정하세요:' },
        { type: 'code', lang: 'html', code: CODE.svgNoColor },
        { type: 'h2', text: '3. 깨졌거나 안 맞는 viewBox' },
        { type: 'p', text: '`viewBox`가 실제 path 위치와 안 맞으면 아트워크가 보이는 영역 밖에 놓일 수 있습니다 — DOM엔 있지만 화면 밖에 있는 것이죠. viewBox가 path 좌표를 감싸는지 확인하세요.' },
        { type: 'h2', text: '4. 잘못된 서버 MIME 타입' },
        { type: 'p', text: '`<img>`나 배경으로 불러올 때 `.svg`는 `image/svg+xml`로 제공돼야 합니다. 서버가 `text/plain`이나 `application/octet-stream`으로 보내면 브라우저가 렌더를 거부합니다. 서버 설정이나 콘텐츠 타입을 고치세요.' },
        { type: 'tip', text: '다른 출처에서 `<object>`/`<img>`로 외부 SVG를 불러올 때 CORS로 실패할 수도 있습니다. 동일 출처로 두거나 허용 헤더를 추가하면 해결됩니다.' },
        { type: 'h2', text: '5. 유효하지 않은 마크업' },
        { type: 'p', text: 'SVG는 XML이라 엄격합니다 — 닫히지 않은 태그나 엉뚱한 문자 하나가 파일 전체를 조용히 깨뜨릴 수 있습니다. `.svg`를 브라우저에서 직접 열어 보세요. XML 파싱 오류가 보이면 그게 원인입니다.' },
        { type: 'p', text: 'Icony에서 내보낸 아이콘은 올바른 `viewBox`와 색이 적용된 유효한 독립 SVG라, 1~3번과 5번 원인을 아예 피합니다.' },
      ],
    },
  },
  {
    slug: 'convert-svg-to-png',
    category: 'how-to',
    readingMinutes: 6,
    published: '2026-06-16',
    updated: '2026-06-16',
    related: ['svg-vs-png-icons', 'reduce-svg-file-size', 'make-a-favicon'],
    title: { en: 'How to Convert an SVG to PNG', ko: 'SVG를 PNG로 변환하는 법' },
    description: {
      en: 'Turn a vector SVG into a crisp PNG — online, in the browser with canvas, or on the command line with sharp, ImageMagick, or Inkscape.',
      ko: '벡터 SVG를 선명한 PNG로 — 온라인, 브라우저 canvas, 또는 sharp·ImageMagick·Inkscape 커맨드라인으로 변환하는 법.',
    },
    metaTitle: { en: 'How to Convert SVG to PNG (4 Ways)', ko: 'SVG를 PNG로 변환하는 4가지 방법' },
    metaDescription: {
      en: 'Convert SVG to PNG the right way: pick the export resolution, keep transparency, and avoid blur. Online, browser canvas, sharp, ImageMagick, and Inkscape methods.',
      ko: 'SVG를 PNG로 제대로 변환하기: 해상도 선택, 투명 유지, 흐릿함 방지. 온라인·브라우저 canvas·sharp·ImageMagick·Inkscape 방법을 정리했습니다.',
    },
    blocks: {
      en: [
        { type: 'p', text: 'SVG is the better format for the web, but sometimes you need a **PNG**: an email signature, an app store asset, a social preview, a tool that won\'t accept vectors. The key is to rasterize at the right size — a PNG has fixed pixels, so you choose the resolution up front.' },
        { type: 'h2', text: 'Decide the export size first' },
        { type: 'p', text: 'Unlike SVG, a PNG does not scale cleanly after the fact. Export at the largest size you will actually display — or 2×/3× that for high-DPI ("retina") screens. A 24px icon shown on a retina screen should be exported at 48–72px so it stays sharp.' },
        { type: 'h2', text: '1. Online (no install)' },
        { type: 'p', text: 'The fastest route: open the SVG in a web tool, set the size, and download a PNG. In Icony you pick any icon, choose a size from 16px up to 512px, set a color or keep it transparent, and export a PNG in one click — no upload, no signup.' },
        { type: 'h2', text: '2. In the browser with canvas' },
        { type: 'p', text: 'If you are building your own tool, draw the SVG onto a `<canvas>` and read it back as PNG. Multiply by a scale factor for crisp high-DPI output:' },
        { type: 'code', lang: 'javascript', code: CODE.canvasSvgToPng },
        { type: 'tip', text: 'Loading the SVG from another origin can "taint" the canvas and make `toBlob()` throw a security error. Keep the SVG same-origin, or inline its markup as shown above.' },
        { type: 'h2', text: '3. Node.js with sharp' },
        { type: 'p', text: 'For build scripts or a server, `sharp` is fast and high quality. Pass a high `density` so the vector rasterizes sharply, then resize to the target:' },
        { type: 'code', lang: 'javascript', code: CODE.sharpSvgToPng },
        { type: 'h2', text: '4. Command line (ImageMagick / Inkscape)' },
        { type: 'p', text: 'For one-off or batch conversions, a CLI is handy. Use a high density with ImageMagick (it rasterizes at 72 DPI by default, which looks blurry); Inkscape renders SVG natively and tends to be the most accurate:' },
        { type: 'code', lang: 'bash', code: CODE.cliSvgToPng },
        { type: 'h2', text: 'Keep the background transparent' },
        { type: 'p', text: 'PNG supports transparency; SVG icons usually have none. Make sure your tool does not paint a white background. With ImageMagick that is `-background none`; in Icony the "transparent" background option keeps the alpha channel intact.' },
        { type: 'p', text: 'Whichever method you use, remember the trade-off: the PNG is locked to the size you exported. Keep the original SVG around so you can re-export larger later — see our SVG vs PNG guide for when each format wins.' },
      ],
      ko: [
        { type: 'p', text: 'SVG가 웹에서는 더 나은 포맷이지만, 때로는 **PNG**가 필요합니다 — 이메일 서명, 앱스토어 에셋, 소셜 미리보기, 벡터를 못 받는 도구 등. 핵심은 적절한 크기로 래스터화하는 것입니다. PNG는 픽셀이 고정이라 해상도를 미리 정해야 합니다.' },
        { type: 'h2', text: '내보낼 크기를 먼저 정하세요' },
        { type: 'p', text: 'SVG와 달리 PNG는 나중에 깨끗하게 확대되지 않습니다. 실제로 표시할 가장 큰 크기로, 또는 고해상도(레티나) 화면을 위해 그 2~3배로 내보내세요. 레티나에서 보일 24px 아이콘이라면 48~72px로 내보내야 선명함이 유지됩니다.' },
        { type: 'h2', text: '1. 온라인 (설치 불필요)' },
        { type: 'p', text: '가장 빠른 길: 웹 도구에서 SVG를 열고 크기를 정해 PNG로 받기. Icony에서는 아이콘을 고르고 16px~512px 크기를 선택, 색을 지정하거나 투명하게 둔 뒤 클릭 한 번으로 PNG를 내보냅니다 — 업로드도 가입도 없습니다.' },
        { type: 'h2', text: '2. 브라우저 canvas로' },
        { type: 'p', text: '직접 도구를 만든다면 SVG를 `<canvas>`에 그린 뒤 PNG로 다시 읽으면 됩니다. 스케일 배수를 곱하면 고해상도에서도 선명합니다:' },
        { type: 'code', lang: 'javascript', code: CODE.canvasSvgToPng },
        { type: 'tip', text: '다른 출처의 SVG를 불러오면 canvas가 "오염(taint)"되어 `toBlob()`이 보안 오류를 던질 수 있습니다. SVG를 동일 출처로 두거나 위처럼 마크업을 인라인하세요.' },
        { type: 'h2', text: '3. Node.js의 sharp' },
        { type: 'p', text: '빌드 스크립트나 서버에는 `sharp`가 빠르고 품질이 좋습니다. `density`를 높게 줘서 벡터를 선명하게 래스터화한 뒤 목표 크기로 리사이즈하세요:' },
        { type: 'code', lang: 'javascript', code: CODE.sharpSvgToPng },
        { type: 'h2', text: '4. 커맨드라인 (ImageMagick / Inkscape)' },
        { type: 'p', text: '일회성·일괄 변환엔 CLI가 편합니다. ImageMagick은 기본 72 DPI로 래스터화해 흐릿하므로 density를 높이세요. Inkscape는 SVG를 네이티브로 렌더해 보통 가장 정확합니다:' },
        { type: 'code', lang: 'bash', code: CODE.cliSvgToPng },
        { type: 'h2', text: '배경은 투명하게 유지' },
        { type: 'p', text: 'PNG는 투명을 지원하고, SVG 아이콘은 대개 배경이 없습니다. 도구가 흰 배경을 칠하지 않게 하세요. ImageMagick은 `-background none`, Icony는 "투명" 배경 옵션으로 알파 채널을 그대로 보존합니다.' },
        { type: 'p', text: '어떤 방법이든 트레이드오프를 기억하세요 — PNG는 내보낸 크기에 고정됩니다. 나중에 더 크게 다시 내보낼 수 있도록 원본 SVG를 보관하세요. 어떤 포맷이 유리한지는 SVG vs PNG 가이드를 참고하세요.' },
      ],
    },
  },
  {
    slug: 'animate-svg-icons',
    category: 'how-to',
    readingMinutes: 6,
    published: '2026-06-16',
    updated: '2026-06-16',
    related: ['change-svg-icon-color', 'svg-to-react-component', 'add-icons-to-website'],
    title: { en: 'How to Animate SVG Icons with CSS', ko: 'CSS로 SVG 아이콘 애니메이션 넣기' },
    description: {
      en: 'Add motion to SVG icons with pure CSS — hover effects, spinners, and a line-drawing animation — plus the one rule that makes it all work.',
      ko: '순수 CSS로 SVG 아이콘에 모션을 — 호버 효과, 스피너, 라인 드로잉 애니메이션 — 그리고 이 모든 걸 가능하게 하는 한 가지 규칙.',
    },
    metaTitle: { en: 'How to Animate SVG Icons with CSS', ko: 'CSS로 SVG 아이콘 애니메이션 만들기' },
    metaDescription: {
      en: 'Animate SVG icons with CSS: hover transitions, a spinning loader, and the stroke-dashoffset "draw" effect. Plus why the SVG must be inline and how to respect reduced motion.',
      ko: 'CSS로 SVG 아이콘에 애니메이션 적용하기: 호버 트랜지션, 회전 로더, stroke-dashoffset 드로잉 효과. 인라인 SVG가 필요한 이유와 reduced motion 대응까지.',
    },
    blocks: {
      en: [
        { type: 'p', text: 'A little motion makes an icon feel alive — a spinner that turns, a heart that pops on hover, an outline that draws itself. You can do all of it with plain CSS, no library required.' },
        { type: 'h2', text: 'The one rule: the SVG must be inline' },
        { type: 'p', text: 'CSS can only style what is in the DOM. An icon loaded as `<img src="icon.svg">` is a black box — CSS cannot reach its paths. To animate an icon, embed its markup directly in the page (inline `<svg>…</svg>`, or a React component that renders one). Then every `<path>`, `<circle>`, and the `<svg>` itself is a styleable element.' },
        { type: 'h2', text: 'Hover transitions' },
        { type: 'p', text: 'The simplest, most useful effect: a smooth transform or color change on hover. Put the transition on the icon and the trigger on its container:' },
        { type: 'code', lang: 'css', code: CODE.cssHover },
        { type: 'h2', text: 'A spinning loader' },
        { type: 'p', text: 'Rotate any icon continuously with a keyframe animation — perfect for a loading state. Make sure the `<svg>` has a centered `viewBox` so it spins around its middle:' },
        { type: 'code', lang: 'css', code: CODE.cssSpin },
        { type: 'h2', text: 'The line-drawing effect' },
        { type: 'p', text: 'For stroked (outline) icons, you can make the line draw itself. Set `stroke-dasharray` to the path length, offset it fully so it starts hidden, then animate the offset back to zero. Roughly 100 works for many 24px icons; for pixel-perfect timing, read the exact length with `path.getTotalLength()` in JS.' },
        { type: 'code', lang: 'css', code: CODE.cssDraw },
        { type: 'tip', text: 'This trick only works on **stroked** icons (Lucide, Tabler, Feather-style). Filled icons have no stroke to animate — recolor or scale those instead.' },
        { type: 'h2', text: 'Respect reduced motion' },
        { type: 'p', text: 'Some users get motion sick or simply prefer stillness. Honor their system setting by disabling non-essential animation under a media query — it is a one-line accessibility win:' },
        { type: 'code', lang: 'css', code: CODE.reducedMotion },
        { type: 'p', text: 'Grab a clean, stroked SVG from Icony, paste it inline, and these snippets work as-is. For heavier choreography (morphing, sequenced timelines) reach for a library like Motion or GSAP — but for hovers, spinners, and draw-ins, CSS is all you need.' },
      ],
      ko: [
        { type: 'p', text: '작은 모션 하나가 아이콘을 살아있게 만듭니다 — 돌아가는 스피너, 호버에 톡 튀는 하트, 스스로 그려지는 외곽선. 이 모든 걸 라이브러리 없이 순수 CSS로 할 수 있습니다.' },
        { type: 'h2', text: '한 가지 규칙: SVG는 인라인이어야 합니다' },
        { type: 'p', text: 'CSS는 DOM에 있는 것만 스타일링할 수 있습니다. `<img src="icon.svg">`로 불러온 아이콘은 블랙박스라 CSS가 내부 path에 닿지 못합니다. 애니메이션을 주려면 마크업을 페이지에 직접 넣으세요(인라인 `<svg>…</svg>`, 또는 SVG를 렌더하는 React 컴포넌트). 그러면 모든 `<path>`, `<circle>`과 `<svg>` 자체가 스타일 대상이 됩니다.' },
        { type: 'h2', text: '호버 트랜지션' },
        { type: 'p', text: '가장 단순하고 유용한 효과 — 호버 시 부드러운 변형이나 색 변화. 트랜지션은 아이콘에, 트리거는 컨테이너에 두세요:' },
        { type: 'code', lang: 'css', code: CODE.cssHover },
        { type: 'h2', text: '회전 로더' },
        { type: 'p', text: '키프레임 애니메이션으로 어떤 아이콘이든 계속 회전시킬 수 있습니다 — 로딩 상태에 딱입니다. `<svg>`의 `viewBox`가 중앙 정렬돼 있어야 가운데를 축으로 돕니다:' },
        { type: 'code', lang: 'css', code: CODE.cssSpin },
        { type: 'h2', text: '라인 드로잉 효과' },
        { type: 'p', text: '외곽선(stroke) 아이콘은 선이 스스로 그려지게 할 수 있습니다. `stroke-dasharray`를 path 길이로 두고, offset을 가득 줘서 숨긴 상태로 시작한 뒤 offset을 0으로 애니메이션하면 됩니다. 24px 아이콘엔 대략 100이면 충분하고, 정확한 타이밍이 필요하면 JS의 `path.getTotalLength()`로 실제 길이를 읽으세요.' },
        { type: 'code', lang: 'css', code: CODE.cssDraw },
        { type: 'tip', text: '이 기법은 **외곽선** 아이콘(Lucide·Tabler·Feather 계열)에서만 동작합니다. 채워진 아이콘은 애니메이션할 stroke가 없으니 색 변경이나 스케일을 쓰세요.' },
        { type: 'h2', text: 'Reduced motion 존중' },
        { type: 'p', text: '어떤 사용자는 모션에 멀미를 느끼거나 정적인 화면을 선호합니다. 미디어 쿼리로 비필수 애니메이션을 끄면 한 줄로 접근성을 챙길 수 있습니다:' },
        { type: 'code', lang: 'css', code: CODE.reducedMotion },
        { type: 'p', text: 'Icony에서 깔끔한 외곽선 SVG를 받아 인라인으로 붙여넣으면 위 스니펫이 그대로 동작합니다. 모핑이나 시퀀스 타임라인 같은 무거운 연출은 Motion·GSAP 같은 라이브러리를 쓰고, 호버·스피너·드로잉 정도는 CSS만으로 충분합니다.' },
      ],
    },
  },
  {
    slug: 'svg-sprites',
    category: 'how-to',
    readingMinutes: 5,
    published: '2026-06-16',
    updated: '2026-06-16',
    related: ['add-icons-to-website', 'reduce-svg-file-size', 'svg-to-react-component'],
    title: { en: 'SVG Sprites: Reuse Icons with <symbol> and <use>', ko: 'SVG 스프라이트: <symbol>과 <use>로 아이콘 재사용' },
    description: {
      en: 'Define an icon once and reuse it anywhere with an SVG sprite — less markup, easy theming with currentColor, and one cached file.',
      ko: '아이콘을 한 번 정의하고 SVG 스프라이트로 어디서나 재사용 — 마크업 절감, currentColor 테마, 캐시되는 단일 파일.',
    },
    metaTitle: { en: 'SVG Sprites with <symbol> and <use>', ko: 'SVG 스프라이트(<symbol>·<use>) 사용법' },
    metaDescription: {
      en: 'Build an SVG sprite with <symbol> and <use>: define each icon once, reference it anywhere, theme it with currentColor, and ship one cacheable file. With browser-support notes.',
      ko: '<symbol>과 <use>로 SVG 스프라이트 만들기: 아이콘을 한 번 정의해 어디서나 참조하고 currentColor로 테마, 캐시되는 단일 파일로 제공. 브라우저 지원 메모 포함.',
    },
    blocks: {
      en: [
        { type: 'p', text: 'If the same icon appears 30 times on a page, you do not need 30 copies of its `<path>` data. An **SVG sprite** lets you define each icon once and reference it everywhere — cleaner markup, smaller HTML, and a single file the browser can cache.' },
        { type: 'h2', text: 'Define each icon once' },
        { type: 'p', text: 'Wrap each icon in a `<symbol>` with a unique `id` and a `viewBox`. Put the collection in a hidden `<svg>` near the top of the page, or in a standalone `sprite.svg` file:' },
        { type: 'code', lang: 'html', code: CODE.spriteDefine },
        { type: 'h2', text: 'Reference it with <use>' },
        { type: 'p', text: 'Now drop the icon anywhere with a tiny `<use>` reference — no path duplication. You can point at a symbol in the same document, or at one inside an external sprite file:' },
        { type: 'code', lang: 'html', code: CODE.spriteUse },
        { type: 'h2', text: 'Theme it with currentColor' },
        { type: 'p', text: 'If the symbol uses `fill="currentColor"` (or no fill, with stroke), each `<use>` inherits the surrounding text color — so the same icon can be black in the nav and white in the footer with zero extra files:' },
        { type: 'code', lang: 'css', code: CODE.spriteCss },
        { type: 'h2', text: 'Inline vs external sprite' },
        { type: 'ul', items: [
          '**Inline sprite** (in the HTML): works everywhere, no extra request, but the symbol markup ships with every page.',
          '**External sprite** (`sprite.svg#id`): one cacheable file shared across pages. Supported in all current browsers; it never worked in IE 11 and needed a polyfill there.',
        ] },
        { type: 'tip', text: 'An external `<use href="sprite.svg#id">` must be same-origin (or CORS-permitted). Styling deep into an external symbol from the host page is limited — use `currentColor` for theming rather than targeting inner paths.' },
        { type: 'h2', text: 'When to reach for a sprite' },
        { type: 'p', text: 'Sprites shine for a fixed set of UI icons reused across a site. If you are in a component framework, importing icons as components (React, Vue) is often simpler and tree-shakes unused ones. Export clean `<symbol>`-ready SVGs from Icony, give each a clear `id`, and assemble your sprite.' },
      ],
      ko: [
        { type: 'p', text: '같은 아이콘이 한 페이지에 30번 나온다고 `<path>` 데이터를 30번 복사할 필요는 없습니다. **SVG 스프라이트**를 쓰면 각 아이콘을 한 번만 정의하고 어디서나 참조할 수 있습니다 — 깔끔한 마크업, 작은 HTML, 캐시 가능한 단일 파일.' },
        { type: 'h2', text: '각 아이콘을 한 번 정의' },
        { type: 'p', text: '각 아이콘을 고유 `id`와 `viewBox`를 가진 `<symbol>`로 감싸세요. 모음을 페이지 상단의 숨긴 `<svg>`에 두거나 별도 `sprite.svg` 파일로 만듭니다:' },
        { type: 'code', lang: 'html', code: CODE.spriteDefine },
        { type: 'h2', text: '<use>로 참조' },
        { type: 'p', text: '이제 작은 `<use>` 참조만으로 어디서나 아이콘을 넣습니다 — path 중복이 없습니다. 같은 문서의 symbol을 가리키거나 외부 스프라이트 파일 안의 것을 가리킬 수 있습니다:' },
        { type: 'code', lang: 'html', code: CODE.spriteUse },
        { type: 'h2', text: 'currentColor로 테마' },
        { type: 'p', text: 'symbol이 `fill="currentColor"`(또는 fill 없이 stroke)를 쓰면 각 `<use>`는 주변 텍스트 색을 상속합니다 — 같은 아이콘을 추가 파일 없이 내비에선 검정, 푸터에선 흰색으로 쓸 수 있습니다:' },
        { type: 'code', lang: 'css', code: CODE.spriteCss },
        { type: 'h2', text: '인라인 vs 외부 스프라이트' },
        { type: 'ul', items: [
          '**인라인 스프라이트**(HTML 내): 어디서나 동작, 추가 요청 없음. 다만 symbol 마크업이 모든 페이지에 함께 실립니다.',
          '**외부 스프라이트**(`sprite.svg#id`): 페이지 간 공유되는 캐시 파일 하나. 현행 브라우저 모두 지원하며, IE 11에서만 동작하지 않아 폴리필이 필요했습니다.',
        ] },
        { type: 'tip', text: '외부 `<use href="sprite.svg#id">`는 동일 출처(또는 CORS 허용)여야 합니다. 호스트 페이지에서 외부 symbol 내부까지 스타일링하는 데는 제약이 있으니, 내부 path를 노리기보다 `currentColor`로 테마하세요.' },
        { type: 'h2', text: '언제 스프라이트를 쓸까' },
        { type: 'p', text: '사이트 전반에서 재사용되는 고정 UI 아이콘 세트에 스프라이트가 빛납니다. 컴포넌트 프레임워크라면 아이콘을 컴포넌트(React·Vue)로 임포트하는 편이 더 단순하고 미사용분을 트리셰이킹합니다. Icony에서 `<symbol>`에 바로 쓸 깔끔한 SVG를 내보내고 각자 명확한 `id`를 붙여 스프라이트를 조립하세요.' },
      ],
    },
  },
  {
    slug: 'best-free-icon-libraries-2026',
    category: 'comparison',
    readingMinutes: 7,
    published: '2026-06-16',
    updated: '2026-06-16',
    related: ['lucide-vs-tabler-vs-heroicons', 'svg-to-react-component', 'add-icons-to-website'],
    title: { en: 'The Best Free Icon Libraries in 2026', ko: '2026년 최고의 무료 아이콘 라이브러리' },
    description: {
      en: 'A practical roundup of the best free, open-source icon libraries in 2026 — what each is good at, the license, and how to choose.',
      ko: '2026년 최고의 무료 오픈소스 아이콘 라이브러리 정리 — 각각의 강점, 라이선스, 선택 기준까지.',
    },
    metaTitle: { en: 'Best Free Icon Libraries (2026)', ko: '2026 무료 아이콘 라이브러리 추천' },
    metaDescription: {
      en: 'The best free open-source icon libraries in 2026: Lucide, Tabler, Phosphor, Heroicons, Bootstrap Icons, Radix, Material Symbols, and Remix Icon — strengths, licenses, and how to pick.',
      ko: '2026년 최고의 무료 오픈소스 아이콘 라이브러리: Lucide·Tabler·Phosphor·Heroicons·Bootstrap·Radix·Material Symbols·Remix Icon의 강점과 라이선스, 선택법.',
    },
    blocks: {
      en: [
        { type: 'p', text: 'There has never been a better time for free icons. These open-source sets are well-maintained, permissively licensed, and ship as clean SVG you can drop into any project. Here are the ones worth knowing in 2026 — and when to pick each.' },
        { type: 'h2', text: 'Lucide — the safe default' },
        { type: 'p', text: 'A community-driven fork of Feather with a much larger set (~1,600 icons) and active releases. Consistent 24px grid, 2px stroke, rounded joins. First-class packages for React, Vue, Svelte, and more. License: **ISC**. If you are unsure, start here.' },
        { type: 'h2', text: 'Tabler — the biggest stroke set' },
        { type: 'p', text: 'Over 5,800 outline icons on a 24px grid — easily the largest cohesive stroke library, so it usually has the niche glyph you need. License: **MIT**.' },
        { type: 'h2', text: 'Phosphor — weights and flexibility' },
        { type: 'p', text: 'Around 1,500 icons, each in six weights (thin, light, regular, bold, fill, duotone). Great when you want a single family that spans delicate to chunky. License: **MIT**.' },
        { type: 'h2', text: 'Heroicons — made for Tailwind' },
        { type: 'p', text: 'A focused, beautifully drawn set from the Tailwind CSS team, in 24px outline, 24px solid, 20px solid, and 16px micro variants. Smaller catalog, but it pairs perfectly with Tailwind projects. License: **MIT**.' },
        { type: 'h2', text: 'Bootstrap Icons — standalone, not just for Bootstrap' },
        { type: 'p', text: 'A large set (~2,000) that works with or without the Bootstrap framework. A more "filled" visual style than the outline sets above. License: **MIT**.' },
        { type: 'h2', text: 'Radix Icons — crisp 15px UI marks' },
        { type: 'p', text: 'A small, meticulous set designed on a 15px grid for dense interfaces, from the Radix UI team. Perfect for toolbars and compact controls. License: **MIT**.' },
        { type: 'h2', text: 'Also worth knowing' },
        { type: 'ul', items: [
          '**Material Symbols** — Google\'s huge variable-font icon system, adjustable for weight, fill, and optical size. License: **Apache-2.0**.',
          '**Remix Icon** — a neutral, well-rounded set in outline and fill, ~2,800 icons. License: **Apache-2.0**.',
          '**Feather** — the classic minimalist set; still lovely, but largely superseded by Lucide for active development. License: **MIT**.',
        ] },
        { type: 'h2', text: 'How to choose' },
        { type: 'ul', items: [
          'Want a safe, modern default → **Lucide**.',
          'Need the widest selection → **Tabler** or **Material Symbols**.',
          'Want multiple weights from one family → **Phosphor**.',
          'Building with Tailwind → **Heroicons**.',
          'Designing a dense, compact UI → **Radix**.',
        ] },
        { type: 'tip', text: 'Always check the license for your use case. The libraries above are all permissive (ISC / MIT / Apache-2.0) and fine for commercial work; attribution is appreciated but generally not legally required.' },
        { type: 'p', text: 'You do not have to commit to one. Icony brings Lucide, Tabler, Phosphor, Heroicons, Bootstrap Icons, and Radix into a single searchable tool — recolor, resize, and export any of them as SVG or PNG, free.' },
      ],
      ko: [
        { type: 'p', text: '무료 아이콘에 이만큼 좋은 시기는 없었습니다. 아래 오픈소스 세트들은 관리가 잘 되고, 라이선스가 관대하며, 어떤 프로젝트에도 바로 넣을 수 있는 깔끔한 SVG로 제공됩니다. 2026년에 알아둘 만한 것들과 각각의 선택 시점을 정리했습니다.' },
        { type: 'h2', text: 'Lucide —무난한 기본값' },
        { type: 'p', text: 'Feather를 커뮤니티가 포크해 훨씬 큰 세트(약 1,600개)로 키운 라이브러리로, 릴리스도 활발합니다. 일관된 24px 그리드, 2px stroke, 둥근 조인. React·Vue·Svelte 등 공식 패키지가 충실합니다. 라이선스: **ISC**. 고민된다면 여기서 시작하세요.' },
        { type: 'h2', text: 'Tabler — 가장 큰 외곽선 세트' },
        { type: 'p', text: '24px 그리드의 외곽선 아이콘 5,800개 이상 — 단연 가장 큰 일관된 stroke 라이브러리라, 틈새 아이콘도 대개 있습니다. 라이선스: **MIT**.' },
        { type: 'h2', text: 'Phosphor — 굵기와 유연함' },
        { type: 'p', text: '약 1,500개 아이콘이 각각 6가지 굵기(thin·light·regular·bold·fill·duotone)로 제공됩니다. 섬세함부터 두툼함까지 한 패밀리로 아우르고 싶을 때 좋습니다. 라이선스: **MIT**.' },
        { type: 'h2', text: 'Heroicons — Tailwind를 위한 세트' },
        { type: 'p', text: 'Tailwind CSS 팀의 정제된 아이콘 세트로, 24px 외곽선·24px 솔리드·20px 솔리드·16px 마이크로 변형이 있습니다. 카탈로그는 작지만 Tailwind 프로젝트와 완벽히 어울립니다. 라이선스: **MIT**.' },
        { type: 'h2', text: 'Bootstrap Icons — Bootstrap 없이도' },
        { type: 'p', text: 'Bootstrap 프레임워크 유무와 무관하게 쓰는 큰 세트(약 2,000개). 위의 외곽선 세트들보다 "채움"에 가까운 비주얼입니다. 라이선스: **MIT**.' },
        { type: 'h2', text: 'Radix Icons — 선명한 15px UI 마크' },
        { type: 'p', text: 'Radix UI 팀이 조밀한 인터페이스를 위해 15px 그리드로 설계한 작고 정교한 세트. 툴바와 컴팩트한 컨트롤에 안성맞춤입니다. 라이선스: **MIT**.' },
        { type: 'h2', text: '함께 알아둘 것들' },
        { type: 'ul', items: [
          '**Material Symbols** — 굵기·채움·옵티컬 사이즈를 조절하는 구글의 거대한 가변 폰트 아이콘 시스템. 라이선스: **Apache-2.0**.',
          '**Remix Icon** — 외곽선·채움의 균형 잡힌 중립적 세트, 약 2,800개. 라이선스: **Apache-2.0**.',
          '**Feather** — 클래식한 미니멀 세트. 여전히 훌륭하지만 활발한 개발은 Lucide로 대체된 상태. 라이선스: **MIT**.',
        ] },
        { type: 'h2', text: '선택 기준' },
        { type: 'ul', items: [
          '안전한 최신 기본값 → **Lucide**.',
          '가장 넓은 선택지 → **Tabler** 또는 **Material Symbols**.',
          '한 패밀리에서 여러 굵기 → **Phosphor**.',
          'Tailwind로 개발 → **Heroicons**.',
          '조밀하고 컴팩트한 UI → **Radix**.',
        ] },
        { type: 'tip', text: '용도에 맞는 라이선스는 항상 확인하세요. 위 라이브러리들은 모두 관대한 라이선스(ISC/MIT/Apache-2.0)라 상업적 사용에 문제없고, 출처 표기는 권장되지만 대개 법적으로 필수는 아닙니다.' },
        { type: 'p', text: '하나만 고집할 필요는 없습니다. Icony는 Lucide·Tabler·Phosphor·Heroicons·Bootstrap·Radix를 하나의 검색 도구로 모아 — 색·크기를 바꾸고 SVG·PNG로 무료로 내보냅니다.' },
      ],
    },
  },
];

export const ALL_BLOG_SLUGS: string[] = BLOG_POSTS.map((p) => p.slug);

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
