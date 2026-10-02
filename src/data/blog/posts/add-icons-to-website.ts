import type { BlogPost } from '../types';

// Code samples used only by this post. Icon markup is the real output of
// lucide-react 0.460.0 / @tabler/icons 3.36.1 as installed in this repo.
const INLINE_BUTTON = `<button class="btn">
  Next
  <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
       viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
</button>`;

const ICON_CSS = `.btn {
  display: inline-flex;
  align-items: center;   /* centers the icon on the text, no baseline gap */
  gap: 0.5em;
  color: #1d4ed8;        /* the icon follows this via currentColor */
}
.btn:hover { color: #1e3a8a; }

.icon {
  width: 1.25em;         /* scales with the button's font-size */
  height: 1.25em;
  flex-shrink: 0;        /* don't let long labels squash the icon */
}`;

const IMG_TAGS = `<!-- Decorative: the text next to it already says "Download" -->
<a href="/report.pdf">
  <img src="/icons/download.svg" alt="" width="20" height="20" />
  Download report
</a>

<!-- Meaningful on its own: describe what it means, not what it looks like -->
<img src="/icons/verified.svg" alt="Verified seller" width="16" height="16" />`;

const MASK_CSS = `/* One monochrome SVG file, recolored with background-color */
.icon-mask {
  display: inline-block;
  width: 1.25em;
  height: 1.25em;
  background-color: currentColor;
  -webkit-mask: url(/icons/arrow-right.svg) center / contain no-repeat;
          mask: url(/icons/arrow-right.svg) center / contain no-repeat;
}`;

const LIBRARY_USAGE = `// npm i lucide-react
import { ArrowRight, Download } from 'lucide-react';

export function NextButton() {
  return (
    <button className="btn">
      Next <ArrowRight size={20} aria-hidden="true" />
    </button>
  );
}

// Icon-only control: the button needs the name, the icon stays hidden
<button aria-label="Download report">
  <Download size={20} aria-hidden="true" />
</button>`;

export const post: BlogPost = {
  slug: 'add-icons-to-website',
  category: 'how-to',
  readingMinutes: 8,
  published: '2026-04-23',
  updated: '2026-10-02',
  related: ['svg-to-react-component', 'lucide-vs-tabler-vs-heroicons', 'svg-vs-png-icons'],
  title: {
    en: '3 Ways to Add Icons to Your Website',
    ko: '웹사이트에 아이콘 넣는 3가지 방법',
  },
  description: {
    en: 'Inline SVG, an <img> tag, or a component library: how each one works, what it costs in bytes and requests, how to size, color and label icons correctly, and which to choose for your stack.',
    ko: '인라인 SVG, <img> 태그, 컴포넌트 라이브러리: 각각의 동작 방식, 바이트·요청 비용, 아이콘 크기·색·레이블을 제대로 다루는 법, 그리고 스택에 맞는 선택 기준.',
  },
  metaTitle: {
    en: 'How to Add Icons to Your Website (3 Practical Ways) | Icony',
    ko: '웹사이트에 아이콘 넣는 3가지 방법 | Icony',
  },
  metaDescription: {
    en: 'Add icons to a website with inline SVG, <img>, or a React/Vue icon library. Real byte sizes, sizing and alignment CSS, accessibility, CSS masks, icon fonts, and how to choose.',
    ko: '인라인 SVG, <img>, React/Vue 아이콘 라이브러리로 웹사이트에 아이콘 넣기. 실측 바이트 크기, 크기·정렬 CSS, 접근성, CSS 마스크, 아이콘 폰트, 선택 기준까지.',
  },
  blocks: {
    en: [
      { type: 'p', text: 'There are three practical ways to put an icon on a web page: paste the SVG markup into the HTML, reference an `.svg` file with `<img>`, or import it as a component from an icon library.' },
      { type: 'p', text: 'They all draw the same shapes. The differences are in whether CSS can recolor the icon, how many requests each one costs, how it behaves in a bundle, and how much markup you end up maintaining.' },
      { type: 'p', text: 'Each method below comes with working code. After that come the sizing, alignment and accessibility details that apply to all three, and a short guide to choosing. The byte counts come from icons in the `lucide-react` 0.460.0 and `@tabler/icons` 3.36.1 npm packages, measured with `wc -c` and `gzip -9c | wc -c`.' },

      { type: 'h2', text: '1. Inline SVG: the most control' },
      { type: 'p', text: 'Inline SVG means the `<svg>` element sits directly in your HTML. Because it is part of the document, CSS can reach every part of it: color, stroke width, hover transitions, animation. This is the same markup Lucide’s `ArrowRight` renders to:' },
      { type: 'code', lang: 'html', code: INLINE_BUTTON },
      { type: 'p', text: 'What makes this work is `stroke="currentColor"` (or `fill="currentColor"` for filled icons). The icon takes whatever CSS `color` its parent has, so a hover state, a disabled state and dark mode all work without touching the SVG:' },
      { type: 'code', lang: 'css', code: ICON_CSS },
      { type: 'p', text: 'What it costs: every copy of the icon is repeated in the HTML. Lucide’s arrow-right is 278 bytes of markup (198 gzipped). A more detailed icon like `settings` is 840 bytes (376 gzipped).' },
      { type: 'p', text: 'Gzip handles repetition well, so ten copies of the same icon cost far less on the wire than ten times the size. They still count as DOM nodes, though, and they are re-sent with every page, since HTML is usually not cached the way static files are.' },
      { type: 'ul', items: [
        '**Best for:** a few dozen UI icons that need hover and theme colors, especially in server-rendered or static HTML.',
        '**Watch out for:** gradient or clip-path IDs that repeat when the same SVG appears twice, and hand-pasted markup that drifts out of sync with the source icon set.',
      ] },

      { type: 'h2', text: '2. The <img> tag: simplest, and cached' },
      { type: 'p', text: 'Referencing an SVG file works like any other image. The browser downloads it once, caches it, and reuses it across pages:' },
      { type: 'code', lang: 'html', code: IMG_TAGS },
      { type: 'p', text: 'The trade-off is isolation. An SVG loaded through `<img>` is a separate document, so your page’s CSS cannot reach inside it. `currentColor` resolves to the SVG file’s own default color, not the color of your button, and hover styles on the paths are impossible.' },
      { type: 'p', text: 'If you need a blue and a white version, you need two files. For security reasons, scripts inside the SVG do not run, and the file cannot load its own external resources, such as a web font or a linked image.' },
      { type: 'p', text: 'Always set `width` and `height` on the `<img>`. They let the browser reserve space before the file arrives, so the text around the icon does not jump when it loads.' },
      { type: 'p', text: 'For tiny icons, the request itself is a bigger cost than the bytes: Tabler’s `arrow-right.svg` file is 411 bytes, often smaller than the HTTP headers that travel with the request. That matters little over HTTP/2 with a warm cache, and more on a first visit that pulls in 40 separate icon files.' },
      { type: 'ul', items: [
        '**Best for:** logos, multi-color illustrations, icons that never change color, content managed by non-developers (a CMS image field), and email templates.',
        '**Watch out for:** a server sending the wrong `Content-Type`. SVG must be served as `image/svg+xml`, or `<img>` shows nothing.',
      ] },

      { type: 'h2', text: '3. An icon component library: best developer experience' },
      { type: 'p', text: 'In React, Vue, Svelte or Angular, the usual approach is a package that exposes each icon as a component. Under the hood, it renders inline SVG, so you keep full CSS control, and you never paste path data by hand:' },
      { type: 'code', lang: 'tsx', code: LIBRARY_USAGE },
      { type: 'p', text: 'Because each icon is its own module, bundlers drop the ones you do not import. In `lucide-react`, the star icon’s module is 765 bytes (459 gzipped), plus about 2.3 KB of shared runtime paid once.' },
      { type: 'p', text: 'Next.js goes further: its config (checked in `next` 16.2.2, `dist/server/config.js`) applies `optimizePackageImports` by default to `lucide-react`, `@tabler/icons-react`, and the three `@heroicons/react` entry points, so named imports from those packages are rewritten to direct per-icon imports and development builds stay fast.' },
      { type: 'p', text: 'The size of the catalog you are choosing from varies a lot. The counts Icony indexes per library are 1,539 icons for Lucide, 5,986 for Tabler (4,985 outline and 1,001 filled SVG files in the package), 1,512 for each of the two Phosphor styles it includes (regular and fill), and 175 for each Heroicons style.' },
      { type: 'ul', items: [
        '**Best for:** any component-based app. It is the default choice unless you have a reason to avoid it.',
        '**Watch out for:** mixing libraries. They are drawn on different grids. Lucide, Tabler and Heroicons use a 24-unit viewBox, Bootstrap Icons 16, Radix 15 and Phosphor 256, and default stroke widths differ too (Lucide 2, Heroicons outline 1.5). Two sets side by side at the same pixel size rarely look like one family.',
      ] },

      { type: 'h2', text: 'Two other techniques you will run into' },
      { type: 'p', text: '**CSS masks** give you cached files and recoloring at the same time. The SVG becomes a mask over an element whose `background-color` is the icon color:' },
      { type: 'code', lang: 'css', code: MASK_CSS },
      { type: 'p', text: 'This works well for single-color icons in CSS-only projects. It cannot show more than one color, and the icon is invisible to assistive technology, so label the parent control instead. The unprefixed `mask` shorthand is recent enough in some browsers that the `-webkit-` version is still worth including.' },
      { type: 'p', text: '**Icon fonts** (a font file whose glyphs are icons) were the standard approach before SVG support was universal. They are easy to drop in, but every icon is text: it is limited to one color, rendered with font hinting and anti-aliasing, and can show as an empty box or a random letter if the font fails to load.' },
      { type: 'p', text: 'The whole font downloads unless you subset it. Many icon sets that started as fonts now also ship SVG. For new projects, SVG is the better default.' },

      { type: 'h2', text: 'Sizing, alignment and color: the same rules for all three' },
      { type: 'ul', items: [
        '**Always give inline SVG a size.** An `<svg>` with a `viewBox` but no `width` or `height` stretches to fill its container’s width, which is how a 24px icon turns into a 900px one. Set `width`/`height` attributes as a fallback, and let CSS override them.',
        '**Size in `em` to follow the text.** `width: 1.25em` keeps the icon proportional to its label at every font size. Use fixed pixels only when the icon has to sit on a strict grid.',
        '**Align with flexbox, not baseline tweaks.** An inline SVG sits on the text baseline by default, which leaves a gap underneath. `display: inline-flex; align-items: center; gap: .5em` on the parent is more reliable than fiddling with `vertical-align`.',
        '**Add `flex-shrink: 0`.** In a flex row with a long label, the icon is often what gets compressed.',
        '**Keep stroke widths consistent.** Stroke width is set in viewBox units, so a 2-unit stroke renders 2px wide at 24px but 1.33px at 16px. Pick a stroke per size tier instead of scaling one value everywhere.',
      ] },

      { type: 'h2', text: 'Accessibility basics' },
      { type: 'p', text: 'Decide whether each icon is decorative or carries meaning. A decorative icon next to a visible label gets `aria-hidden="true"` (inline SVG, components) or `alt=""` (`<img>`), so screen readers do not announce it twice.' },
      { type: 'p', text: 'An icon that is the only content of a button or link needs an accessible name. Put `aria-label` on the button, not the icon.' },
      { type: 'p', text: 'A standalone meaningful icon, such as a “verified” badge, needs `alt` text on an `<img>`, or `role="img"` plus a `<title>` on inline SVG. Describe the meaning (“Verified seller”), not the picture (“blue check”).' },

      { type: 'h2', text: 'Common mistakes' },
      { type: 'ul', items: [
        '**Expecting CSS to recolor an `<img>`.** `fill` and `color` on the `<img>` element do nothing to the SVG inside it. Switch to inline SVG, a component, or a CSS mask.',
        '**Hard-coded colors in inline SVG.** Files exported from design tools often contain `fill="#1E1E1E"` on every path. Replace them with `currentColor`, or your theme colors will not reach the icon.',
        '**Importing a whole icon set as one object.** `import * as Icons` plus `Icons[name]` defeats tree-shaking in most setups, and every icon ships.',
        '**Icon-only buttons with no name.** A lone trash icon is announced as just “button”. Every icon-only control needs `aria-label`.',
        '**Mixing two libraries for “just one missing icon”.** Grid and stroke differences show up right away. Look for a close substitute in your main set first. With 1,500+ icons in most modern sets, there usually is one.',
      ] },

      { type: 'h2', text: 'How to choose' },
      { type: 'ol', items: [
        '**Using React, Vue, Svelte or Angular?** Use a component library. Pick one set and stick with it.',
        '**Static site or server-rendered templates, with icons that need hover or theme colors?** Inline SVG. If the same icons repeat heavily across many pages, consider an SVG sprite.',
        '**Content icons, logos, or anything multi-color that never changes?** Use `<img>` with explicit `width`, `height` and `alt`.',
        '**Plain CSS project where you want cached files and one-color theming?** CSS masks.',
        '**Maintaining a legacy icon font?** It still works. Plan a move to SVG when you next redesign.',
      ] },
      { type: 'p', text: 'If you need a handful of icons in a specific color and size without installing a package, a browser tool like Icony can export them as SVG or PNG files for the `<img>` route, or copy inline SVG or JSX for the other two. Multi-select exports a ZIP when you need a whole set.' },

      { type: 'h2', text: 'Takeaway' },
      { type: 'p', text: 'Use a component library if your site is built with components. Otherwise, use inline SVG with `currentColor` when the icon needs to react to CSS, and `<img>` when it does not.' },
      { type: 'p', text: 'Whichever you choose, give every icon an explicit size, align it with flexbox, and decide up front whether it is decorative or needs a label. Those details matter more than which method you pick.' },
    ],
    ko: [
      { type: 'p', text: '웹 페이지에 아이콘을 넣는 실용적인 방법은 세 가지입니다. SVG 마크업을 HTML에 직접 붙여 넣거나, `<img>`로 `.svg` 파일을 참조하거나, 아이콘 라이브러리에서 컴포넌트로 import하는 것입니다.' },
      { type: 'p', text: '그려지는 모양은 모두 같습니다. 차이는 CSS로 색을 바꿀 수 있는지, 요청이 몇 번 발생하는지, 번들에서 어떻게 처리되는지, 관리해야 할 마크업이 얼마나 되는지에서 납니다.' },
      { type: 'p', text: '아래에서 각 방법을 동작하는 코드와 함께 살펴보고 세 방법 모두에 해당하는 크기·정렬·접근성 문제와 선택 기준을 정리합니다. 바이트 수치는 npm 패키지 `lucide-react` 0.460.0과 `@tabler/icons` 3.36.1의 아이콘을 `wc -c`와 `gzip -9c | wc -c`로 측정한 값입니다.' },

      { type: 'h2', text: '1. 인라인 SVG: 가장 세밀한 제어' },
      { type: 'p', text: '인라인 SVG는 `<svg>` 요소를 HTML에 직접 넣는 방식입니다. 문서의 일부이므로 CSS가 색, 선 두께, 호버 전환, 애니메이션까지 전부 제어할 수 있습니다. 아래는 Lucide의 `ArrowRight`가 실제로 렌더링하는 마크업입니다.' },
      { type: 'code', lang: 'html', code: INLINE_BUTTON },
      { type: 'p', text: '`stroke="currentColor"`(채움 아이콘이라면 `fill="currentColor"`)가 이 방식의 핵심입니다. 아이콘이 부모의 CSS `color`를 따라가므로, 호버·비활성 상태나 다크 모드를 SVG 수정 없이 처리할 수 있습니다.' },
      { type: 'code', lang: 'css', code: ICON_CSS },
      { type: 'p', text: '비용도 있습니다. 아이콘을 쓸 때마다 마크업이 HTML에 반복됩니다. Lucide의 arrow-right는 278바이트(gzip 198바이트), 더 복잡한 `settings`는 840바이트(gzip 376바이트)입니다.' },
      { type: 'p', text: 'gzip이 반복을 잘 압축하기 때문에 같은 아이콘 열 개가 전송량으로 열 배가 되지는 않습니다. 하지만 DOM 노드 수에는 그대로 더해지고 HTML은 보통 정적 파일처럼 캐시되지 않으니 페이지마다 다시 전송됩니다.' },
      { type: 'ul', items: [
        '**적합한 경우:** 호버나 테마 색이 필요한 수십 개 이하의 UI 아이콘. 특히 서버 렌더링이나 정적 HTML.',
        '**주의할 점:** 같은 SVG가 두 번 들어가면 그라디언트나 clip-path의 ID가 중복됩니다. 손으로 붙여 넣은 마크업이 원본 아이콘 세트와 조금씩 어긋나는 것도 흔한 문제입니다.',
      ] },

      { type: 'h2', text: '2. <img> 태그: 가장 단순하고 캐시됨' },
      { type: 'p', text: 'SVG 파일을 참조하는 방식은 다른 이미지와 똑같이 동작합니다. 브라우저가 한 번 내려받아 캐시하고 여러 페이지에서 재사용합니다.' },
      { type: 'code', lang: 'html', code: IMG_TAGS },
      { type: 'p', text: '대가는 격리입니다. `<img>`로 불러온 SVG는 별개의 문서라서 페이지의 CSS가 안까지 닿지 않습니다. `currentColor`도 버튼 색이 아니라 SVG 파일 자체의 기본값으로 계산되고 path에 호버 스타일을 줄 수도 없습니다.' },
      { type: 'p', text: '파란색과 흰색 버전이 필요하면 파일이 두 개 있어야 합니다. 보안상 SVG 안의 스크립트는 실행되지 않고 웹 폰트나 링크된 이미지 같은 외부 리소스도 불러오지 못합니다.' },
      { type: 'p', text: '`<img>`에는 항상 `width`와 `height`를 지정하세요. 파일이 오기 전에 브라우저가 자리를 잡아 두기 때문에 아이콘이 로드될 때 주변 텍스트가 밀리지 않습니다.' },
      { type: 'p', text: '작은 아이콘에서는 바이트보다 요청 자체가 더 큰 비용입니다. Tabler의 `arrow-right.svg`는 411바이트로, 요청에 딸려 가는 HTTP 헤더보다 작은 경우가 많습니다. 캐시가 있는 HTTP/2 환경에서는 별 차이가 없지만 첫 방문에서 아이콘 파일 40개를 따로 받아야 한다면 이야기가 달라집니다.' },
      { type: 'ul', items: [
        '**적합한 경우:** 로고, 다색 일러스트, 색이 바뀌지 않는 아이콘, 개발자가 아닌 사람이 관리하는 콘텐츠(CMS 이미지 필드), 이메일 템플릿.',
        '**주의할 점:** 서버의 `Content-Type`이 잘못된 경우. SVG는 `image/svg+xml`로 제공되어야 하며 그렇지 않으면 `<img>`에 아무것도 표시되지 않습니다.',
      ] },

      { type: 'h2', text: '3. 아이콘 컴포넌트 라이브러리: 개발 경험이 가장 좋음' },
      { type: 'p', text: 'React, Vue, Svelte, Angular에서는 아이콘을 컴포넌트로 제공하는 패키지를 쓰는 것이 보통입니다. 내부적으로는 인라인 SVG를 렌더링하므로 CSS 제어는 그대로 유지되고 path 데이터를 손으로 붙여 넣을 일은 없습니다.' },
      { type: 'code', lang: 'tsx', code: LIBRARY_USAGE },
      { type: 'p', text: '아이콘마다 별도 모듈이라서 import하지 않은 아이콘은 번들러가 제거합니다. `lucide-react`의 별 아이콘 모듈은 765바이트(gzip 459바이트)이고 공용 런타임 약 2.3KB가 한 번만 추가됩니다.' },
      { type: 'p', text: 'Next.js는 한 단계 더 나아갑니다. 설정 코드(`next` 16.2.2의 `dist/server/config.js`에서 확인)를 보면 `lucide-react`, `@tabler/icons-react`, `@heroicons/react`의 세 진입점에 `optimizePackageImports`가 기본 적용됩니다. 이 패키지들에서 가져온 named import는 아이콘별 직접 import로 바뀌어 개발 빌드도 빠르게 유지됩니다.' },
      { type: 'p', text: '고를 수 있는 아이콘 수도 라이브러리마다 크게 다릅니다. Icony가 인덱싱한 기준으로 Lucide 1,539개, Tabler 5,986개(패키지 안의 outline SVG 4,985개와 filled 1,001개), Phosphor는 포함된 두 스타일(regular, fill) 각각 1,512개, Heroicons는 스타일별 175개입니다.' },
      { type: 'ul', items: [
        '**적합한 경우:** 컴포넌트 기반 앱이라면 어디든. 피해야 할 이유가 없다면 기본 선택입니다.',
        '**주의할 점:** 라이브러리 섞어 쓰기. 그리드가 다릅니다. Lucide·Tabler·Heroicons는 24단위 viewBox, Bootstrap Icons는 16, Radix는 15, Phosphor는 256을 쓰고 기본 선 두께도 다릅니다(Lucide 2, Heroicons outline 1.5). 같은 픽셀 크기로 나란히 놓아도 한 세트처럼 보이는 경우는 드뭅니다.',
      ] },

      { type: 'h2', text: '그 밖에 만나게 될 두 가지 방식' },
      { type: 'p', text: '**CSS 마스크**를 쓰면 파일 캐시와 색 변경을 둘 다 얻을 수 있습니다. SVG를 마스크로 쓰고 요소의 `background-color`가 아이콘 색이 됩니다.' },
      { type: 'code', lang: 'css', code: MASK_CSS },
      { type: 'p', text: 'CSS만 쓰는 프로젝트의 단색 아이콘에 잘 맞습니다. 다만 두 가지 이상의 색은 표현할 수 없고 보조 기술에는 아이콘이 보이지 않으므로 부모 컨트롤에 레이블을 붙여야 합니다. 접두사 없는 `mask` 단축 속성은 일부 브라우저에서 지원된 지 오래되지 않아 `-webkit-` 버전을 함께 적어 두는 편이 안전합니다.' },
      { type: 'p', text: '**아이콘 폰트**(글리프가 아이콘인 폰트 파일)는 SVG 지원이 보편화되기 전의 표준이었습니다. 넣기는 쉽지만 모든 아이콘이 글자로 취급됩니다. 색은 하나로 제한되고 폰트 힌팅과 안티앨리어싱을 거쳐 렌더링되며 폰트 로드에 실패하면 빈 네모나 엉뚱한 글자로 보일 수 있습니다.' },
      { type: 'p', text: '서브셋을 만들지 않으면 폰트 전체를 내려받아야 합니다. 폰트로 시작한 아이콘 세트도 지금은 대부분 SVG를 함께 제공하니, 새 프로젝트라면 SVG를 기본으로 쓰는 편이 낫습니다.' },

      { type: 'h2', text: '크기·정렬·색: 세 방법 모두에 해당하는 규칙' },
      { type: 'ul', items: [
        '**인라인 SVG에는 반드시 크기를 지정하세요.** `viewBox`만 있고 `width`·`height`가 없는 `<svg>`는 컨테이너 너비만큼 늘어납니다. 24px 아이콘이 900px가 되는 전형적인 원인입니다. `width`·`height` 속성을 기본값으로 두고 CSS로 덮어쓰세요.',
        '**`em` 단위로 텍스트에 맞추기.** `width: 1.25em`이면 글자 크기가 바뀌어도 레이블과 비율이 유지됩니다. 픽셀 고정은 엄격한 그리드에 맞춰야 할 때만 쓰세요.',
        '**베이스라인을 만지지 말고 flexbox로 정렬하기.** 인라인 SVG는 기본적으로 텍스트 베이스라인에 놓여 아래에 틈이 생깁니다. `vertical-align`을 조정하기보다 부모에 `display: inline-flex; align-items: center; gap: .5em`을 주는 편이 확실합니다.',
        '**`flex-shrink: 0` 추가하기.** 레이블이 긴 flex 행에서는 아이콘이 먼저 찌그러지기 쉽습니다.',
        '**선 두께 일관성 유지하기.** 선 두께는 viewBox 단위라서 2단위 선이 24px에서는 2px, 16px에서는 1.33px로 그려집니다. 값 하나를 모든 크기에 쓰지 말고 크기 구간마다 선 두께를 정하세요.',
      ] },

      { type: 'h2', text: '접근성 기본' },
      { type: 'p', text: '아이콘마다 장식용인지 의미가 있는지 정하세요. 보이는 레이블 옆의 장식용 아이콘에는 `aria-hidden="true"`(인라인 SVG, 컴포넌트)나 `alt=""`(`<img>`)를 붙여 스크린 리더가 두 번 읽지 않게 합니다.' },
      { type: 'p', text: '버튼이나 링크의 유일한 내용이 아이콘이라면 접근 가능한 이름이 필요합니다. `aria-label`은 아이콘이 아니라 버튼에 붙이세요.' },
      { type: 'p', text: '‘인증됨’ 배지처럼 혼자서 의미를 전달하는 아이콘은 `<img>`라면 `alt` 텍스트, 인라인 SVG라면 `role="img"`와 `<title>`이 필요합니다. 그림(‘파란 체크’)이 아니라 의미(‘인증된 판매자’)를 적으세요.' },

      { type: 'h2', text: '흔한 실수' },
      { type: 'ul', items: [
        '**CSS로 `<img>`의 색을 바꾸려는 경우.** `<img>`에 `fill`이나 `color`를 줘도 안의 SVG에는 영향이 없습니다. 인라인 SVG나 컴포넌트, CSS 마스크로 바꾸세요.',
        '**인라인 SVG에 하드코딩된 색.** 디자인 툴에서 내보낸 파일은 모든 path에 `fill="#1E1E1E"` 같은 값이 붙어 있는 경우가 많습니다. `currentColor`로 바꾸지 않으면 테마 색이 아이콘에 닿지 않습니다.',
        '**아이콘 세트 전체를 객체 하나로 import.** `import * as Icons`로 가져와 `Icons[name]`으로 쓰면 대부분의 환경에서 트리셰이킹이 되지 않아 모든 아이콘이 번들에 들어갑니다.',
        '**이름 없는 아이콘 전용 버튼.** 휴지통 아이콘만 있는 버튼은 그냥 ‘버튼’으로 읽힙니다. 아이콘만 있는 컨트롤에는 모두 `aria-label`이 필요합니다.',
        '**‘없는 아이콘 하나 때문에’ 라이브러리 두 개 섞기.** 그리드와 선 두께 차이가 바로 드러납니다. 먼저 쓰던 세트에서 비슷한 아이콘을 찾아보세요. 요즘 세트는 대부분 1,500개가 넘으니 웬만하면 있습니다.',
      ] },

      { type: 'h2', text: '선택 기준' },
      { type: 'ol', items: [
        '**React, Vue, Svelte, Angular를 쓴다면?** 컴포넌트 라이브러리. 세트를 하나 정해서 그것만 쓰세요.',
        '**정적 사이트나 서버 렌더링 템플릿이고 호버나 테마 색이 필요하다면?** 인라인 SVG. 여러 페이지에 같은 아이콘이 많이 반복된다면 SVG 스프라이트도 고려하세요.',
        '**콘텐츠용 아이콘, 로고, 색이 바뀌지 않는 다색 이미지라면?** `width`, `height`, `alt`를 지정한 `<img>`.',
        '**순수 CSS 프로젝트에서 파일 캐시와 단색 테마가 모두 필요하다면?** CSS 마스크.',
        '**기존 아이콘 폰트를 유지 중이라면?** 그대로 동작합니다. 다음 리디자인 때 SVG로 옮길 계획을 세우세요.',
      ] },
      { type: 'p', text: '패키지를 설치하지 않고 특정 색과 크기의 아이콘 몇 개만 필요하다면, Icony 같은 브라우저 도구에서 `<img>`용 SVG·PNG 파일로 내보내거나 나머지 두 방식에 쓸 인라인 SVG·JSX를 복사할 수 있습니다. 세트 전체가 필요하면 여러 개를 선택해 ZIP으로 받을 수 있습니다.' },

      { type: 'h2', text: '정리' },
      { type: 'p', text: '컴포넌트로 만든 사이트라면 컴포넌트 라이브러리를 쓰세요. 그렇지 않다면 CSS에 반응해야 하는 아이콘은 `currentColor`를 쓴 인라인 SVG로, 그럴 필요가 없는 아이콘은 `<img>`로 넣으면 됩니다.' },
      { type: 'p', text: '어떤 방법이든 모든 아이콘에 크기를 명시하고 flexbox로 정렬하고 장식용인지 레이블이 필요한지 미리 정해 두세요. 이 세부 사항이 방법 선택보다 더 중요합니다.' },
    ],
  },
};
