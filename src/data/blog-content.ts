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
  /** ISO date (absolute). */
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
};

export const BLOG_POSTS: BlogPost[] = [
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'svg-vs-png-icons',
    category: 'comparison',
    readingMinutes: 5,
    updated: '2026-06-09',
    related: ['change-svg-icon-color', 'fix-blurry-svg-icons', 'add-icons-to-website'],
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
    updated: '2026-06-09',
    related: ['svg-vs-png-icons', 'svg-to-react-component', 'fix-blurry-svg-icons'],
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
    updated: '2026-06-09',
    related: ['svg-to-react-component', 'add-icons-to-website', 'svg-vs-png-icons'],
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
];

export const ALL_BLOG_SLUGS: string[] = BLOG_POSTS.map((p) => p.slug);

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
