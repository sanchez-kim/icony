import type { BlogPost } from '../types';

// Code samples used only by this post. The xmllint messages below are real
// output (libxml 2.9.13) from deliberately broken files.
const CURL_CHECK = `curl -sI https://example.com/icons/logo.svg | grep -i -E '^(HTTP|content-type|content-encoding)'

# Good
HTTP/2 200
content-type: image/svg+xml

# Broken: <img> will show nothing
content-type: application/octet-stream`;

const SERVER_FIX = `# nginx — mime.types normally already has this line; check custom configs
types { image/svg+xml svg svgz; }

# Apache (.htaccess)
AddType image/svg+xml .svg .svgz
AddEncoding gzip .svgz          # .svgz is gzipped and needs Content-Encoding: gzip

# S3 / object storage: set the metadata explicitly when uploading
aws s3 cp logo.svg s3://my-bucket/icons/ --content-type image/svg+xml`;

const MISSING_XMLNS = `<!-- Works inline in HTML, but shows nothing as <img src="logo.svg"> -->
<svg viewBox="0 0 24 24"><path d="M5 12h14" stroke="black" /></svg>

<!-- Standalone .svg files must declare the SVG namespace -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12h14" stroke="black" /></svg>`;

const XMLLINT_OUTPUT = `$ xmllint --noout logo.svg

# A blank line before the XML declaration
logo.svg:2: parser error : XML declaration allowed only at the start of the document

# A raw ampersand: <title>Terms & Conditions</title>
logo.svg:1: parser error : xmlParseEntityRef: no name

# An unclosed <path> tag
logo.svg:1: parser error : Opening and ending tag mismatch: path line 1 and svg`;

const SVG_NO_COLOR =
  '<!-- Invisible: no fill color and no stroke set -->\n<svg fill="none"><path d="…" /></svg>\n\n<!-- Fixed: give it a color (or currentColor) -->\n<svg fill="currentColor"><path d="…" /></svg>';

const FRAMEWORK_IMPORTS = `// Next.js (no SVGR configured): a static import is an object, not a URL
import logo from './logo.svg';

<img src={logo} alt="Acme" />            // ✗ renders src="[object Object]"
<img src={logo.src} alt="Acme" />        // ✓
<Image src={logo} alt="Acme" />          // ✓ next/image accepts the object

// Vite + vite-plugin-svgr: the suffix decides what you get
import logoUrl from './logo.svg';        // a URL string, for <img src>
import Logo from './logo.svg?react';     // a React component, for <Logo />`;

const DATA_URI = `/* ✗ The # starts a URL fragment, so the SVG is cut off at fill=" */
.check { background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" fill="none" stroke="#16a34a" stroke-width="2"/></svg>'); }

/* ✓ Encode # as %23 (and keep the inner quotes different from the outer ones) */
.check { background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" fill="none" stroke="%2316a34a" stroke-width="2"/></svg>'); }`;

const URL_FALLBACK = `<!-- If #brand-gradient can't be resolved, the shape is painted with nothing -->
<path d="…" fill="url(#brand-gradient)" />

<!-- A fallback color after the url() keeps it visible -->
<path d="…" fill="url(#brand-gradient) #4f46e5" />`;

const DEVTOOLS_SNIPPET = `// Paste into the console with the <svg> selected in the Elements panel ($0)
const s = $0, cs = getComputedStyle(s), box = s.getBoundingClientRect();
console.table({
  size: \`\${box.width} × \${box.height}\`,
  viewBox: s.getAttribute('viewBox'),
  color: cs.color,
  fill: cs.fill,
  stroke: cs.stroke,
  display: cs.display,
  visibility: cs.visibility,
  opacity: cs.opacity,
  drawingBounds: (() => { try { const b = s.getBBox(); return \`\${b.x},\${b.y} \${b.width}×\${b.height}\`; } catch { return 'n/a'; } })(),
});`;

export const post: BlogPost = {
  slug: 'svg-not-showing',
  category: 'troubleshooting',
  readingMinutes: 9,
  published: '2026-06-09',
  updated: '2026-10-02',
  related: ['fix-blurry-svg-icons', 'change-svg-icon-color', 'add-icons-to-website'],
  title: {
    en: 'SVG Not Showing? Common Causes and Fixes',
    ko: 'SVG가 안 보일 때: 흔한 원인과 해결법',
  },
  description: {
    en: 'A step-by-step way to find out why an SVG shows nothing: whether it failed to load, has no size, or has nothing visible to draw, with the exact fixes for MIME types, missing xmlns, XML errors, framework imports, data URIs, colors and viewBox problems.',
    ko: 'SVG가 아무것도 안 보일 때 원인을 찾는 단계별 방법: 로드 실패인지, 크기가 없는지, 그릴 게 안 보이는지 가려내고 MIME 타입, xmlns 누락, XML 오류, 프레임워크 import, data URI, 색, viewBox 문제를 정확히 고칩니다.',
  },
  metaTitle: {
    en: 'SVG Not Showing? How to Fix Invisible SVGs | Icony',
    ko: 'SVG가 안 보일 때 해결법 | Icony',
  },
  metaDescription: {
    en: 'Fix an SVG that will not display: a DevTools checklist, wrong Content-Type, missing xmlns, XML parse errors, Next.js and Vite import mix-ups, unencoded # in data URIs, missing colors, and viewBox mismatches.',
    ko: 'SVG가 표시되지 않을 때: DevTools 점검 순서, 잘못된 Content-Type, xmlns 누락, XML 파싱 오류, Next.js·Vite import 혼동, data URI의 # 미인코딩, 색 누락, viewBox 불일치까지.',
  },
  blocks: {
    en: [
      { type: 'p', text: '“The SVG isn’t showing” can mean three very different things: the file never loaded, it loaded but has no size, or it has a size but nothing visible is drawn inside it.' },
      { type: 'p', text: 'Each has its own causes, so start by working out which of the three you have. That takes a minute in DevTools and saves you from trying fixes at random.' },

      { type: 'h2', text: 'First, a one-minute diagnosis' },
      { type: 'ol', items: [
        '**Find the element in the Elements panel.** If the `<svg>` or `<img>` is not in the DOM at all, the problem is in your template or component, not the SVG.',
        '**Hover over it.** DevTools highlights its box and shows the dimensions. A `0 × 0` box, or no highlight at all, means a **size problem**.',
        '**For `<img>`, CSS backgrounds and external sprites, check the Network tab.** Look at the status code and the response’s `Content-Type`. A 404 or a non-SVG content type means a **loading problem**.',
        '**If it has a size and loaded fine, it is a drawing problem:** no color, a color that matches the background, or artwork outside the `viewBox`.',
      ] },
      { type: 'p', text: 'For inline SVG, this console snippet collects everything relevant in one table. Select the `<svg>` in the Elements panel first, so it is available as `$0`:' },
      { type: 'code', lang: 'js', code: DEVTOOLS_SNIPPET },
      { type: 'p', text: 'Compare `drawingBounds` (where the shapes actually are, from `getBBox()`) with the `viewBox`. If the shapes sit at 0–256 while the viewBox is `0 0 24 24`, you have found the problem.' },

      { type: 'h2', text: 'Loading problems' },
      { type: 'p', text: '**Wrong path.** Start with the simple ones. A relative URL inside a CSS file is resolved against the CSS file’s location, not the page’s. In Next.js and Vite, files in `public/` are served from the site root, so the URL is `/icons/logo.svg`, not `/public/icons/logo.svg`.' },
      { type: 'p', text: 'If it works on your Mac but returns 404 in production, check the capitalization: macOS file systems are case-insensitive by default, Linux servers are not, so `Logo.svg` and `logo.svg` are different files once deployed.' },
      { type: 'p', text: '**Wrong Content-Type.** When an SVG is loaded as an image (`<img>`, `background-image`, `<object>`), the server must send `Content-Type: image/svg+xml`. With anything else, typically `text/plain` or `application/octet-stream`, the browser does not render it. Check what the server actually sends:' },
      { type: 'code', lang: 'bash', code: CURL_CHECK },
      { type: 'p', text: 'The fix belongs in the server or storage configuration. Default nginx and Apache setups map `.svg` correctly, so the usual suspects are custom configs, object storage uploads that didn’t set the metadata, and application servers that stream files themselves:' },
      { type: 'code', lang: 'bash', code: SERVER_FIX },
      { type: 'p', text: '**Missing `xmlns`.** Inline SVG inside HTML does not need a namespace declaration, because the HTML parser knows what `<svg>` is. A standalone `.svg` file is parsed as XML, and without `xmlns="http://www.w3.org/2000/svg"` it is just an unknown XML element, which renders nothing. This is the classic “works when pasted inline, blank as `<img>`” bug, and it usually comes from copying markup out of a page’s DOM into a file:' },
      { type: 'code', lang: 'html', code: MISSING_XMLNS },
      { type: 'p', text: '**Invalid XML.** The HTML parser forgives almost anything in inline SVG. The XML parser used for standalone files forgives nothing, so one bad character blanks the whole image.' },
      { type: 'p', text: 'Open the SVG URL directly in the browser, where an XML error page names the line and column, or run `xmllint` (preinstalled on macOS and most Linux distributions). These are its real messages for the three most common mistakes:' },
      { type: 'code', lang: 'text', code: XMLLINT_OUTPUT },
      { type: 'p', text: 'The first usually comes from a template or a PHP file that outputs a newline before `<?xml`. The second comes from text such as `<title>` or `<desc>` containing a raw `&`, which must be written as `&amp;`. The third comes from hand editing.' },
      { type: 'p', text: '**A framework import that returns the wrong thing.** Bundlers turn `import x from \'./x.svg\'` into different values depending on configuration, and using the wrong kind of value fails quietly:' },
      { type: 'code', lang: 'tsx', code: FRAMEWORK_IMPORTS },
      { type: 'p', text: 'In Next.js, the object comes from the built-in static image import, which handles `.svg` alongside PNG and JPEG. The `*.svg` module is typed as `any` so that it does not conflict with SVGR, which means TypeScript will not warn you about `src={logo}`.' },
      { type: 'p', text: 'Note also that `next/image` skips optimization for sources ending in `.svg`. That is intended, not a failure.' },
      { type: 'p', text: '**An unencoded `#` in a data URI.** Inside a `url(\'data:image/svg+xml,…\')` the `#` character starts the URL fragment. Everything from `stroke="#16a34a"` onward is cut off, the SVG is truncated, and nothing renders:' },
      { type: 'code', lang: 'css', code: DATA_URI },
      { type: 'p', text: '**Blocked by policy.** If the site sends a Content-Security-Policy whose `img-src` does not include `data:`, data-URI SVGs are blocked, and the console shows a CSP violation. External `<use href="/sprite.svg#id">` references also must be same-origin. A sprite on a separate CDN domain will not load, and CORS headers do not change that.' },

      { type: 'h2', text: 'Size problems' },
      { type: 'ul', items: [
        '**An `<img>` pointing to an SVG that has only a `viewBox`.** The file has an aspect ratio but no intrinsic size. In a shrink-to-fit context (a float, an absolutely positioned box, some flex layouts) it can end up with no width. Always put `width` and `height` attributes on the `<img>`, and consider adding them to the SVG file too.',
        '**Percentage sizes inside a parent with no size.** `width="100%"` on an icon inside an inline-flex button or an absolutely positioned element resolves against a width that depends on its own content, and it can collapse. Icons should get explicit lengths: `24`, `1.25em`, `1.5rem`.',
        '**Utility classes that never made it into the CSS.** With Tailwind and similar tools, a class built dynamically (`w-${size}`) is not generated. The SVG then falls back to its attributes, or stretches to the container width if it has none.',
        '**Hidden ancestors.** A `display: none` parent (a closed tab, a collapsed menu) or `visibility: hidden` further up the tree. Check the whole ancestor chain in the computed styles, not just the SVG itself.',
      ] },

      { type: 'h2', text: 'Drawing problems: the box is there, the icon is not' },
      { type: 'p', text: '**No color.** A shape with `fill="none"` and no stroke draws nothing. Outline icons are drawn only by their stroke, so if a stroke icon lost its `stroke` attribute (for example to an over-eager optimizer, or a copy of only the `<path>`), it becomes invisible:' },
      { type: 'code', lang: 'html', code: SVG_NO_COLOR },
      { type: 'p', text: '**`currentColor` that matches the background.** `currentColor` means “whatever the CSS `color` is here”. An icon inside a card whose text color is white, on a white surface, is technically drawn but invisible. Check the computed `color` on the SVG.' },
      { type: 'p', text: 'Some libraries set it for you. Heroicons 2.2, for example, renders `stroke="currentColor"` plus a `color` attribute on the root when you pass `color`, so a `color` set on a parent no longer reaches the icon, though a CSS class on the `<svg>` itself still overrides the attribute.' },
      { type: 'p', text: '**Artwork outside the viewBox.** The `viewBox` is the window onto the drawing’s coordinate system, and anything outside it is cropped. This happens a lot when mixing icon sets: Lucide, Tabler and Heroicons draw on a 24-unit grid, Bootstrap Icons on 16, Radix on 15, and Phosphor on 256.' },
      { type: 'p', text: 'Paste Phosphor path data into a template with `viewBox="0 0 24 24"` and you see only the top-left 24 × 24 corner of a 256-unit drawing: under 1% of its area, often just empty space. Always copy the `viewBox` together with the paths.' },
      { type: 'p', text: '**A broken `url(#…)` reference.** A `fill`, `clip-path` or `mask` that points to an ID the browser cannot use leaves the shape unpainted or fully clipped. Common reasons: the `<defs>` were not copied along with the paths, two inline SVGs define the same ID so one points to the other’s definition, or the definitions sit inside a `display: none` container (a common way to hide sprite sheets).' },
      { type: 'p', text: 'Give IDs unique prefixes, hide sprite containers with zero size instead of `display: none`, and add a fallback color:' },
      { type: 'code', lang: 'html', code: URL_FALLBACK },
      { type: 'p', text: '**CSS overriding the SVG’s attributes.** Presentation attributes like `fill="#000"` lose to any CSS rule. A global reset such as `svg * { fill: none }`, or a component library’s styles, can blank icons that are correct on their own. In the Styles panel, check whether `fill` or `stroke` on the `<path>` comes from a stylesheet rather than the attribute.' },

      { type: 'h2', text: 'Quick answers' },
      { type: 'ul', items: [
        '**It shows inline but not as `<img>`.** Check for a missing `xmlns`, an XML error, or the wrong `Content-Type`, in that order.',
        '**It shows as `<img>` but I can’t change its color.** That is expected: page CSS can’t reach inside an `<img>`. Use inline SVG, a component, or a CSS mask.',
        '**It works locally but not in production.** Check filename case, the `public/` path prefix, and the production server’s `Content-Type`.',
        '**Only part of the icon shows.** Check the viewBox, or a stroke that is clipped at the edge because the path runs right up to the viewBox boundary.',
      ] },

      { type: 'h2', text: 'Checklist' },
      { type: 'ol', items: [
        'The element is in the DOM, and no ancestor is hidden.',
        'The box has a real size: explicit `width`/`height` or CSS lengths.',
        'For files: the URL returns 200 with `Content-Type: image/svg+xml`.',
        'For files: the root has `xmlns="http://www.w3.org/2000/svg"`, and `xmllint --noout` is clean.',
        'For data URIs: `#` is encoded as `%23`.',
        'Every shape has a visible `fill` or `stroke`, and `currentColor` does not match the background.',
        'The `viewBox` matches the coordinate range of the paths.',
        'Every `url(#id)` points to a unique ID that is not inside a `display: none` container.',
      ] },
      { type: 'p', text: 'When the source file is the suspect, re-exporting from a known-good source is often quicker than debugging it. SVGs downloaded from Icony, for instance, are generated from the icon libraries’ own components, so they include the `xmlns`, the original `viewBox`, and the color you picked written into the file. That rules out the file-level causes and leaves only the page-level ones.' },

      { type: 'h2', text: 'Takeaway' },
      { type: 'p', text: 'Don’t start by editing the SVG. First find out which kind of failure you have: not loaded, no size, or nothing visible to draw. Knowing which of the three you have narrows the fix to a handful of candidates.' },
      { type: 'p', text: 'Loading failures come from the server or bundler (content type, path, import shape). Size failures come from CSS. Drawing failures come from the SVG’s colors, viewBox or ID references.' },
    ],
    ko: [
      { type: 'p', text: '‘SVG가 안 보인다’는 말은 전혀 다른 세 가지 상황을 뜻할 수 있습니다. 파일이 아예 로드되지 않았거나, 로드는 됐지만 크기가 없거나, 크기는 있는데 안에 보이는 게 그려지지 않은 경우입니다.' },
      { type: 'p', text: '원인이 각각 다르기 때문에 셋 중 어느 쪽인지부터 가려내는 게 가장 빠른 해결법입니다. DevTools로 1분이면 확인할 수 있고 그러면 아무 해결책이나 시도해 볼 필요가 없습니다.' },

      { type: 'h2', text: '먼저 1분 진단' },
      { type: 'ol', items: [
        '**Elements 패널에서 요소 찾기.** `<svg>`나 `<img>`가 DOM에 아예 없다면 문제는 SVG가 아니라 템플릿이나 컴포넌트에 있습니다.',
        '**요소에 마우스 올리기.** DevTools가 박스를 강조하고 크기를 보여 줍니다. `0 × 0`이거나 강조 표시가 아예 없다면 **크기 문제**입니다.',
        '**`<img>`, CSS 배경, 외부 스프라이트라면 Network 탭 확인.** 상태 코드와 응답의 `Content-Type`을 보세요. 404이거나 SVG가 아닌 콘텐츠 타입이면 **로드 문제**입니다.',
        '**크기도 있고 로드도 정상이라면 그리기 문제입니다.** 색이 없거나, 색이 배경과 같거나, 그림이 `viewBox` 밖에 있습니다.',
      ] },
      { type: 'p', text: '인라인 SVG라면 아래 콘솔 코드로 필요한 정보를 표 하나에 모을 수 있습니다. 먼저 Elements 패널에서 `<svg>`를 선택해 `$0`으로 잡히게 하세요.' },
      { type: 'code', lang: 'js', code: DEVTOOLS_SNIPPET },
      { type: 'p', text: '`drawingBounds`(`getBBox()`로 구한, 도형이 실제로 있는 위치)와 `viewBox`를 비교하세요. 도형은 0–256 범위에 있는데 viewBox가 `0 0 24 24`라면 원인을 찾은 겁니다.' },

      { type: 'h2', text: '로드 문제' },
      { type: 'p', text: '**잘못된 경로.** 단순한 것부터 확인하세요. CSS 파일 안의 상대 URL은 페이지가 아니라 CSS 파일 위치를 기준으로 해석됩니다. Next.js와 Vite에서 `public/` 폴더의 파일은 사이트 루트에서 제공되므로 URL은 `/public/icons/logo.svg`가 아니라 `/icons/logo.svg`입니다.' },
      { type: 'p', text: 'Mac에서는 되는데 배포하면 404가 난다면 대소문자를 확인하세요. macOS 파일 시스템은 기본적으로 대소문자를 구분하지 않지만 Linux 서버는 구분하므로, 배포 후에는 `Logo.svg`와 `logo.svg`가 다른 파일입니다.' },
      { type: 'p', text: '**잘못된 Content-Type.** SVG를 이미지(`<img>`, `background-image`, `<object>`)로 불러올 때는 서버가 `Content-Type: image/svg+xml`을 보내야 합니다. `text/plain`이나 `application/octet-stream` 등 다른 값이 오면 브라우저는 렌더링하지 않습니다. 서버가 실제로 무엇을 보내는지 확인하세요.' },
      { type: 'code', lang: 'bash', code: CURL_CHECK },
      { type: 'p', text: '서버나 스토리지 설정에서 고쳐야 합니다. nginx와 Apache의 기본 설정은 `.svg`를 올바르게 매핑하므로, 주로 의심할 곳은 커스텀 설정, 메타데이터 없이 업로드된 오브젝트 스토리지 파일, 파일을 직접 스트리밍하는 애플리케이션 서버입니다.' },
      { type: 'code', lang: 'bash', code: SERVER_FIX },
      { type: 'p', text: '**`xmlns` 누락.** HTML 안의 인라인 SVG는 HTML 파서가 `<svg>`를 알고 있으므로 네임스페이스 선언이 필요 없습니다. 하지만 독립된 `.svg` 파일은 XML로 파싱되기 때문에 `xmlns="http://www.w3.org/2000/svg"`가 없으면 그냥 정체불명의 XML 요소일 뿐이고 아무것도 그려지지 않습니다. ‘인라인으로 붙이면 되는데 `<img>`로는 빈칸’인 전형적인 버그로, 페이지 DOM에서 마크업을 복사해 파일로 저장할 때 자주 생깁니다.' },
      { type: 'code', lang: 'html', code: MISSING_XMLNS },
      { type: 'p', text: '**잘못된 XML.** HTML 파서는 인라인 SVG의 오류를 대부분 너그럽게 넘기지만 독립 파일에 쓰이는 XML 파서는 하나도 봐주지 않습니다. 잘못된 글자 하나로 이미지 전체가 비어 버립니다.' },
      { type: 'p', text: 'SVG URL을 브라우저에서 직접 열면 XML 오류 페이지에 줄과 열이 나오고 `xmllint`(macOS와 대부분의 Linux 배포판에 기본 설치)로도 확인할 수 있습니다. 아래는 가장 흔한 세 가지 실수에 대한 실제 메시지입니다.' },
      { type: 'code', lang: 'text', code: XMLLINT_OUTPUT },
      { type: 'p', text: '첫 번째는 템플릿이나 PHP 파일이 `<?xml` 앞에 줄바꿈을 출력할 때 주로 생깁니다. 두 번째는 `<title>`이나 `<desc>` 같은 텍스트에 날것의 `&`가 들어간 경우로, `&amp;`로 써야 합니다. 세 번째는 손으로 고치다가 생깁니다.' },
      { type: 'p', text: '**엉뚱한 값을 돌려주는 프레임워크 import.** 번들러는 설정에 따라 `import x from \'./x.svg\'`를 서로 다른 값으로 바꾸고 잘못된 종류의 값을 쓰면 조용히 실패합니다.' },
      { type: 'code', lang: 'tsx', code: FRAMEWORK_IMPORTS },
      { type: 'p', text: 'Next.js에서 객체가 나오는 건 PNG·JPEG와 함께 `.svg`도 처리하는 기본 정적 이미지 import 때문입니다. SVGR과 충돌하지 않도록 `*.svg` 모듈 타입이 `any`로 선언되어 있어서 TypeScript도 `src={logo}`를 경고하지 않습니다. 참고로 `next/image`가 `.svg`로 끝나는 소스의 최적화를 건너뛰는 건 의도된 동작이지 오류가 아닙니다.' },
      { type: 'p', text: '**data URI 안의 인코딩되지 않은 `#`.** `url(\'data:image/svg+xml,…\')` 안에서 `#`은 URL 프래그먼트의 시작입니다. `stroke="#16a34a"`부터 뒤가 모두 잘려 SVG가 불완전해지고 아무것도 그려지지 않습니다.' },
      { type: 'code', lang: 'css', code: DATA_URI },
      { type: 'p', text: '**정책에 의한 차단.** 사이트가 보내는 Content-Security-Policy의 `img-src`에 `data:`가 없으면 data URI SVG가 차단되고 콘솔에 CSP 위반이 표시됩니다. 외부 `<use href="/sprite.svg#id">` 참조도 동일 출처여야 합니다. 별도 CDN 도메인에 둔 스프라이트는 불러오지 못하며 CORS 헤더로도 달라지지 않습니다.' },

      { type: 'h2', text: '크기 문제' },
      { type: 'ul', items: [
        '**`viewBox`만 있는 SVG를 가리키는 `<img>`.** 파일에 비율은 있지만 고유 크기가 없습니다. float, 절대 위치 박스, 일부 flex 레이아웃처럼 내용에 맞춰 줄어드는 환경에서는 너비가 0이 될 수 있습니다. `<img>`에는 항상 `width`와 `height` 속성을 주고 SVG 파일에도 넣어 두는 것을 고려하세요.',
        '**크기가 없는 부모 안의 퍼센트 크기.** inline-flex 버튼이나 절대 위치 요소 안에서 아이콘에 `width="100%"`를 주면, 자기 내용에 따라 정해지는 너비를 기준으로 계산되어 0으로 무너질 수 있습니다. 아이콘에는 `24`, `1.25em`, `1.5rem`처럼 명시적인 길이를 주세요.',
        '**CSS에 생성되지 않은 유틸리티 클래스.** Tailwind 같은 도구에서 동적으로 조합한 클래스(`w-${size}`)는 생성되지 않습니다. 그러면 SVG는 자체 속성 크기로 돌아가고 속성도 없으면 컨테이너 너비만큼 늘어납니다.',
        '**숨겨진 조상 요소.** `display: none`인 부모(닫힌 탭, 접힌 메뉴)나 더 위쪽의 `visibility: hidden`. SVG 자체만 보지 말고 계산된 스타일에서 조상 전체를 확인하세요.',
      ] },

      { type: 'h2', text: '그리기 문제: 박스는 있는데 아이콘이 없다' },
      { type: 'p', text: '**색이 없음.** `fill="none"`이고 stroke도 없는 도형은 아무것도 그리지 않습니다. 외곽선 아이콘은 stroke로만 그려지므로, 지나친 최적화 도구 때문이든 `<path>`만 복사했기 때문이든 `stroke` 속성을 잃으면 보이지 않게 됩니다.' },
      { type: 'code', lang: 'html', code: SVG_NO_COLOR },
      { type: 'p', text: '**배경과 같은 `currentColor`.** `currentColor`는 ‘이 위치의 CSS `color` 값’이라는 뜻입니다. 글자색이 흰색인 카드 안의 아이콘이 흰 배경 위에 있으면, 그려지긴 했어도 보이지 않습니다. SVG의 계산된 `color`를 확인하세요.' },
      { type: 'p', text: '라이브러리가 대신 지정하는 경우도 있습니다. 예를 들어 Heroicons 2.2는 `color`를 넘기면 루트에 `stroke="currentColor"`와 `color` 속성을 함께 렌더링하는데, 이 경우 부모에 지정한 `color`는 아이콘에 닿지 않습니다. 다만 `<svg>` 자체에 준 CSS 클래스는 이 속성보다 우선합니다.' },
      { type: 'p', text: '**viewBox 밖에 있는 그림.** `viewBox`는 그림의 좌표계를 들여다보는 창이고 그 밖은 잘립니다. 아이콘 세트를 섞어 쓸 때 자주 생기는 문제입니다. Lucide·Tabler·Heroicons는 24단위, Bootstrap Icons는 16, Radix는 15, Phosphor는 256단위 그리드에 그립니다.' },
      { type: 'p', text: 'Phosphor의 path 데이터를 `viewBox="0 0 24 24"` 템플릿에 붙이면 256단위 그림에서 왼쪽 위 24 × 24 구석만 보입니다. 면적의 1%도 안 되고 대개 빈 공간입니다. path를 복사할 때는 항상 `viewBox`도 함께 복사하세요.' },
      { type: 'p', text: '**깨진 `url(#…)` 참조.** `fill`, `clip-path`, `mask`가 브라우저가 쓸 수 없는 ID를 가리키면 도형이 칠해지지 않거나 전부 잘립니다. 흔한 원인은 path만 복사하고 `<defs>`는 빠뜨린 경우, 인라인 SVG 두 개가 같은 ID를 정의해 한쪽이 다른 쪽의 정의를 가리키는 경우, 정의가 `display: none` 컨테이너 안에 있는 경우(스프라이트 시트를 숨길 때 흔한 방식)입니다. ID에 고유 접두사를 붙이고 스프라이트 컨테이너는 `display: none` 대신 크기 0으로 숨기고 대체 색을 지정하세요.' },
      { type: 'code', lang: 'html', code: URL_FALLBACK },
      { type: 'p', text: '**SVG 속성을 덮어쓰는 CSS.** `fill="#000"` 같은 표현 속성은 어떤 CSS 규칙에도 밀립니다. `svg * { fill: none }` 같은 전역 리셋이나 컴포넌트 라이브러리의 스타일 때문에, 파일 자체는 멀쩡한 아이콘이 비어 보일 수 있습니다. Styles 패널에서 `<path>`의 `fill`이나 `stroke`가 속성이 아니라 스타일시트에서 오는지 확인하세요.' },

      { type: 'h2', text: '자주 묻는 질문' },
      { type: 'ul', items: [
        '**인라인으로는 보이는데 `<img>`로는 안 보여요.** `xmlns` 누락, XML 오류, 잘못된 `Content-Type` 순서로 확인하세요.',
        '**`<img>`로는 보이는데 색을 바꿀 수 없어요.** 정상입니다. 페이지 CSS는 `<img>` 안까지 닿지 않습니다. 인라인 SVG, 컴포넌트, CSS 마스크를 쓰세요.',
        '**로컬에서는 되는데 배포하면 안 돼요.** 파일 이름 대소문자, `public/` 경로 접두사, 운영 서버의 `Content-Type`을 확인하세요.',
        '**아이콘 일부만 보여요.** viewBox를 확인하세요. path가 viewBox 경계까지 닿아 있어서 가장자리에서 선이 잘리는 경우도 있습니다.',
      ] },

      { type: 'h2', text: '체크리스트' },
      { type: 'ol', items: [
        '요소가 DOM에 있고 숨겨진 조상이 없다.',
        '박스에 실제 크기가 있다: `width`·`height`를 명시했거나 CSS 길이를 줬다.',
        '파일이라면: URL이 200과 `Content-Type: image/svg+xml`을 돌려준다.',
        '파일이라면: 루트에 `xmlns="http://www.w3.org/2000/svg"`가 있고 `xmllint --noout`이 깨끗하다.',
        'data URI라면: `#`을 `%23`으로 인코딩했다.',
        '모든 도형에 보이는 `fill`이나 `stroke`가 있고 `currentColor`가 배경색과 같지 않다.',
        '`viewBox`가 path의 좌표 범위와 맞는다.',
        '모든 `url(#id)`가 고유한 ID를 가리키고 그 정의가 `display: none` 컨테이너 안에 있지 않다.',
      ] },
      { type: 'p', text: '원본 파일이 의심된다면 디버깅하는 것보다 확실한 곳에서 다시 내보내는 게 빠를 때가 많습니다. 예를 들어 Icony에서 내려받은 SVG는 아이콘 라이브러리 자체의 컴포넌트로 생성되므로, `xmlns`와 원래 `viewBox`, 그리고 고른 색이 파일에 들어 있습니다. 그러면 파일 쪽 원인은 배제되고 페이지 쪽 원인만 남습니다.' },

      { type: 'h2', text: '정리' },
      { type: 'p', text: 'SVG부터 고치지 마세요. 먼저 어떤 종류의 실패인지 확인하세요. 로드가 안 된 건지, 크기가 없는 건지, 그릴 게 안 보이는 건지.' },
      { type: 'p', text: '로드 실패는 서버나 번들러(콘텐츠 타입, 경로, import 형태)에서, 크기 실패는 CSS에서, 그리기 실패는 SVG의 색·viewBox·ID 참조에서 옵니다. 셋 중 어느 쪽인지 알면 해결책 후보가 몇 개로 좁혀집니다.' },
    ],
  },
};
