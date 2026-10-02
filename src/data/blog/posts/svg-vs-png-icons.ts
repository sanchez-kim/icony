import type { BlogPost } from '../types';

const LUCIDE_HOUSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
     viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
</svg>`;

const PNG_SRCSET = `<!-- PNG: one file per pixel density -->
<img src="/icons/home-24.png"
     srcset="/icons/home-24.png 1x, /icons/home-48.png 2x, /icons/home-72.png 3x"
     width="24" height="24" alt="Home" />

<!-- SVG: one file for every density -->
<img src="/icons/home.svg" width="24" height="24" alt="Home" />`;

const THREE_WAYS = `<!-- 1. Inline SVG: CSS can reach every path, currentColor works -->
<button class="nav-link">
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
       stroke="currentColor" stroke-width="2" aria-hidden="true">…</svg>
  Home
</button>

<!-- 2. <img>: cached like any image, but CSS cannot recolor it -->
<img src="/icons/home.svg" width="24" height="24" alt="Home" />

<!-- 3. CSS mask: external file, color still follows the text -->
<span class="icon icon-home" aria-hidden="true"></span>`;

const MASK_CSS = `.icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-color: currentColor;          /* the visible color */
  -webkit-mask: var(--icon) center / contain no-repeat;
          mask: var(--icon) center / contain no-repeat;
}
.icon-home { --icon: url("/icons/home.svg"); }`;

const FAKE_SVG_CHECK = `# An "SVG" that is really a PNG wrapped in XML
grep -l "data:image/png;base64" icons/*.svg

# Inspect any file's real format
file icons/logo.svg`;

export const post: BlogPost = {
  slug: 'svg-vs-png-icons',
  category: 'comparison',
  readingMinutes: 7,
  published: '2026-02-12',
  updated: '2026-10-02',
  related: ['convert-svg-to-png', 'change-svg-icon-color', 'add-icons-to-website'],
  title: {
    en: 'SVG vs PNG Icons: Which Should You Use?',
    ko: 'SVG vs PNG 아이콘: 언제 무엇을 써야 할까?',
  },
  description: {
    en: 'A measured comparison of SVG and PNG icons: real file sizes at 1x, 2x, and 3x, how each handles color and pixel density, and the places where PNG is still the only option.',
    ko: 'SVG와 PNG 아이콘을 실측으로 비교했습니다. 1x·2x·3x에서의 실제 파일 크기, 색상과 픽셀 밀도 처리 방식, 그리고 여전히 PNG만 통하는 곳까지 정리합니다.',
  },
  metaTitle: {
    en: 'SVG vs PNG Icons: Which Format Should You Use? | Icony',
    ko: 'SVG vs PNG 아이콘: 어떤 포맷을 써야 할까? | Icony',
  },
  metaDescription: {
    en: 'SVG vs PNG for icons, with measured file sizes at every density, color and theming trade-offs, email and social-preview limits, and a decision checklist.',
    ko: '아이콘용 SVG와 PNG 비교. 밀도별 실측 파일 크기, 색상·테마 처리의 차이, 이메일·소셜 미리보기의 제약, 그리고 포맷 선택 체크리스트.',
  },
  blocks: {
    en: [
      { type: 'p', text: "You'll hear that SVG is always smaller and always sharper than PNG. That's mostly true, but not entirely." },
      { type: 'p', text: "For a simple icon shown at exactly one size on a standard display, a PNG can be the same size as the SVG or even smaller. The math changes once pixel density, theming, and the file's destination come into it." },
      { type: 'p', text: "Below we go through those trade-offs with numbers measured from real icon files, not rules of thumb." },

      { type: 'h2', text: 'What each format actually stores' },
      { type: 'p', text: "A **PNG** is a grid of pixels. A 24×24 PNG stores 576 pixels, each with red, green, blue, and alpha values, compressed losslessly. Whatever resolution you exported is the most detail the file will ever have." },
      { type: 'p', text: "An **SVG** is a text description of shapes. Here is the complete house icon from Lucide (lucide-react 0.460.0), exactly as it renders to markup with a black stroke:" },
      { type: 'code', lang: 'html', code: LUCIDE_HOUSE_SVG },
      { type: 'p', text: "Nothing in that file refers to pixels. The `viewBox` sets up a 24-unit coordinate system, the two `path` elements describe the outline, and `stroke-width=\"2\"` says the lines are 2 units thick." },
      { type: 'p', text: "The browser turns that description into pixels at display time, at whatever size and density the screen needs. Almost every difference between the two formats comes from this." },

      { type: 'h2', text: 'File size, measured' },
      { type: 'p', text: "To get real numbers, we rendered two Lucide icons to SVG with `react-dom/server`, then rasterized each one to PNG with sharp 0.34.5 using its default PNG settings (no extra optimization). The SVG sizes are raw bytes, with the gzip -9 size in parentheses, which is roughly what a server sends when compression is on." },
      { type: 'ul', items: [
        "**house** (2 simple paths): SVG 394 B (250 B gzipped). PNG 16px: 294 B · 24px: 337 B · 48px: 603 B · 72px: 824 B · 180px: 2,255 B · 512px: 8,211 B.",
        "**settings** (a gear with many curves): SVG 832 B (370 B gzipped). PNG 24px: 493 B · 48px: 1,095 B · 72px: 1,631 B · 512px: 16,313 B.",
      ] },
      { type: 'p', text: "The numbers show some things the usual advice skips:" },
      { type: 'ul', items: [
        "At 1x and 24px, the PNG house (337 B) is **smaller** than the uncompressed SVG (394 B). For a single low-resolution use, PNG isn't wasteful.",
        "PNG size grows with pixel **area**. SVG size grows with path **complexity**. The gear's SVG is about twice the size of the house's, and so is its 512px PNG. Complexity costs you in both formats.",
        "A retina-ready PNG setup needs 1x, 2x, and 3x files (337 + 603 + 824 = 1,764 B for the house). One 250 B gzipped SVG covers all three and every size after that.",
        "PNG is already compressed, so gzip on the server does very little for it. SVG is text, so it usually compresses by a third or more.",
      ] },
      { type: 'tip', text: "Our numbers come from unoptimized files. Running SVGO on the SVG or oxipng on the PNG will shrink both a bit, but it won't change which way the comparison goes." },

      { type: 'h2', text: 'Sharpness and pixel density' },
      { type: 'p', text: "A 24px icon in CSS isn't 24 physical pixels on most modern screens. On a 2x display it covers 48×48 device pixels, on a 3x phone 72×72, and on a Windows laptop at 150% scaling 36×36." },
      { type: 'p', text: "The browser redraws an SVG from its geometry for each case. A PNG gets resampled from whatever pixels it has, so a 24px PNG on a 2x screen is stretched to twice its size and looks soft." },
      { type: 'p', text: "With PNG you fix this by shipping one file per density and letting the browser choose, which means more files to export, name, and keep in sync:" },
      { type: 'code', lang: 'html', code: PNG_SRCSET },
      { type: 'p', text: "That covers the common 1x/2x/3x cases, but 1.25x, 1.5x, and browser zoom will still resample one of those files. The SVG never needs resampling." },

      { type: 'h2', text: 'Color, theming, and states' },
      { type: 'p', text: "A PNG has its color baked in. A blue icon, a white icon for dark mode, and a red one for errors are three separate files. An SVG that uses `currentColor` picks up the CSS `color` of its parent, so the same file covers light mode, dark mode, hover, and disabled." },
      { type: 'p', text: "This only works when CSS can reach the SVG. How you embed the icon decides what you can style:" },
      { type: 'code', lang: 'html', code: THREE_WAYS },
      { type: 'p', text: "An SVG loaded with `<img>` renders as an isolated document, so the page's CSS can't change its stroke or fill. If you want external files that are cached and reused but still follow the text color, the CSS mask technique paints the element with `currentColor` and uses the SVG only as a stencil:" },
      { type: 'code', lang: 'css', code: MASK_CSS },

      { type: 'h2', text: 'Where PNG is still the right answer' },
      { type: 'ul', items: [
        "**Email.** Support is better than its reputation. caniemail.com's table for SVG images lists most major clients as supporting it. But it's inconsistent. Gmail, for example, is marked partial because it converts the SVG to PNG. When a newsletter has to look the same everywhere, a PNG at 2x the display size is still the safe bet.",
        "**Social preview images** (`og:image`, Twitter/X cards). Use a PNG or JPEG. Link-preview crawlers aren't built to render arbitrary SVG.",
        "**Google Search favicons.** Google's favicon documentation lists BMP, GIF, ICO, PNG, JPEG, PPM, and TIFF as supported formats and recommends a size larger than 48×48. Provide a raster favicon even if browsers are happy with your SVG.",
        "**Upload forms that reject SVG.** WordPress, for example, doesn't allow SVG uploads without a plugin, because SVG is XML that can contain scripts. Plenty of CMSes and marketplaces do the same.",
        "**App store and OS assets.** App icons, splash screens, and store listings ask for fixed-size raster files.",
        "**Very detailed artwork.** An illustration with thousands of paths, gradients, and filters can be larger as SVG than as a PNG or WebP, and slower to render. Icons are almost never in this group.",
      ] },

      { type: 'h2', text: 'A note on security' },
      { type: 'p', text: "Because SVG is a document format, it can contain `<script>`, event handlers, and links to external resources. An SVG loaded through `<img>` or CSS doesn't run scripts, but an SVG you inline into the page or open directly in the browser can." },
      { type: 'p', text: "For icons from a trusted library this doesn't matter. For SVGs that **users upload**, sanitize them, or rasterize them to PNG on the server, before you display them." },

      { type: 'h2', text: 'Common mistakes' },
      { type: 'ul', items: [
        "**Exporting a PNG at 1x for a retina UI.** It looks fine on the designer's external monitor and blurry on every laptop. Export at the display size times 2, or use SVG.",
        "**A fake SVG.** Some tools \"export SVG\" by wrapping a bitmap in an `<image href=\"data:image/png;base64,…\">` tag. You get a larger file with all the limits of a PNG. Check before you ship:",
      ] },
      { type: 'code', lang: 'bash', code: FAKE_SVG_CHECK },
      { type: 'ul', items: [
        "**Hard-coded colors in the SVG.** `fill=\"#000000\"` on every path stops `currentColor` theming. Replace fixed colors with `currentColor` where the icon is a single color.",
        "**Leaving out `width` and `height` on `<img>`.** Without them the browser can't reserve space before the file loads, and the layout shifts. Set them on SVG and PNG images alike.",
        "**Inlining the same large SVG hundreds of times.** Each inline copy adds to your HTML. For icons repeated across a long list, use an `<img>` that gets cached, a mask, or an SVG sprite with `<use>`.",
      ] },

      { type: 'h2', text: 'Quick decision checklist' },
      { type: 'ol', items: [
        "Will a browser or a modern app framework render it? Use **SVG**.",
        "Does it need to change color with theme or state? Use **inline SVG** or the **CSS mask** technique.",
        "Is it going into email, a social card, an app store, a search-engine favicon, or an upload form that rejects SVG? Use **PNG**, exported at the largest size it will be shown (2x for email).",
        "Is it a photo or a heavily detailed illustration? Use a raster format (PNG, WebP, or AVIF) rather than an icon workflow.",
        "Either way, keep the **SVG as the source of truth** and generate PNGs from it when a destination asks for them.",
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'p', text: "**Is WebP better than PNG for icons?** WebP's lossless mode usually makes smaller files than PNG, and modern browsers support it. It's still a raster format, though, so you face the same density problem. It's a better PNG, not a replacement for SVG." },
      { type: 'p', text: "**Can I turn a PNG back into an SVG?** Only by tracing it, which guesses at the outlines and rarely matches the original geometry, especially at icon sizes. Find the original vector instead. Most open-source icon sets publish SVG sources." },
      { type: 'p', text: "**Do SVG icons slow down rendering?** For typical UI icons with a handful of paths, not in any way you'll notice. Rendering cost becomes a real concern with complex illustrations, heavy filters, or thousands of inline icons on one page." },

      { type: 'h2', text: 'The takeaway' },
      { type: 'p', text: "Use SVG by default for anything a browser renders. It stays sharp at every density and a single file covers every theme." },
      { type: 'p', text: "Use PNG when the destination requires a fixed raster image, and export it from the SVG at the size that destination will actually display. Icony's export works this way: every icon starts as SVG markup, and the PNG is rendered from that markup at the size you choose." },
    ],
    ko: [
      { type: 'p', text: "SVG가 PNG보다 늘 작고 늘 선명하다는 말을 흔히 듣습니다. 대체로는 맞지만 항상 그렇지는 않습니다." },
      { type: 'p', text: "단순한 아이콘을 일반 화면에서 딱 한 크기로만 쓴다면 PNG가 SVG와 비슷하거나 오히려 더 작을 수도 있습니다. 픽셀 밀도, 테마, 파일이 쓰일 곳이 끼어들면 계산이 달라집니다." },
      { type: 'p', text: "이 글에서는 어림짐작 대신 실제 아이콘 파일로 잰 수치로 이 차이를 따져 봅니다." },

      { type: 'h2', text: '두 포맷은 무엇을 저장하는가' },
      { type: 'p', text: "**PNG**는 픽셀 격자입니다. 24×24 PNG에는 576개 픽셀이 들어 있고 각 픽셀에는 빨강·초록·파랑·알파 값이 무손실로 압축되어 저장됩니다. 내보낼 때 정한 해상도가 그 파일이 가질 수 있는 최대 디테일입니다." },
      { type: 'p', text: "**SVG**는 도형을 글로 적은 파일입니다. 아래는 Lucide(lucide-react 0.460.0)의 집 아이콘을 검은 선으로 렌더링한 마크업 전체입니다." },
      { type: 'code', lang: 'html', code: LUCIDE_HOUSE_SVG },
      { type: 'p', text: "이 파일 어디에도 픽셀 이야기는 없습니다. `viewBox`가 24단위짜리 좌표계를 정하고 `path` 두 개가 윤곽을 그리며 `stroke-width=\"2\"`가 선 두께를 2단위로 지정합니다." },
      { type: 'p', text: "브라우저는 표시 시점에 이 설명을 화면에 필요한 크기와 밀도에 맞춰 픽셀로 바꿉니다. 두 포맷의 차이는 거의 다 여기서 나옵니다." },

      { type: 'h2', text: '파일 크기 실측' },
      { type: 'p', text: "실제 수치를 얻으려고 Lucide 아이콘 두 개를 `react-dom/server`로 SVG로 렌더링한 뒤, sharp 0.34.5의 기본 PNG 설정(추가 최적화 없음)으로 래스터화했습니다. SVG는 원본 바이트 수이고 괄호 안은 gzip -9로 압축한 크기입니다. 서버에서 압축을 켜 두면 대략 이만큼이 전송됩니다." },
      { type: 'ul', items: [
        "**house**(단순한 path 2개): SVG 394 B(gzip 250 B). PNG 16px: 294 B · 24px: 337 B · 48px: 603 B · 72px: 824 B · 180px: 2,255 B · 512px: 8,211 B.",
        "**settings**(곡선이 많은 톱니바퀴): SVG 832 B(gzip 370 B). PNG 24px: 493 B · 48px: 1,095 B · 72px: 1,631 B · 512px: 16,313 B.",
      ] },
      { type: 'p', text: "흔한 조언에서 빠져 있는 사실이 몇 가지 드러납니다." },
      { type: 'ul', items: [
        "1x·24px에서는 PNG house(337 B)가 압축 전 SVG(394 B)보다 **작습니다**. 저해상도로 한 번만 쓴다면 PNG가 낭비는 아닙니다.",
        "PNG 크기는 픽셀 **면적**에, SVG 크기는 path의 **복잡도**에 비례해 늘어납니다. 톱니바퀴는 SVG도 house의 약 두 배, 512px PNG도 약 두 배입니다. 복잡도의 비용은 두 포맷 모두 치릅니다.",
        "레티나까지 대응하려면 PNG는 1x·2x·3x 세 벌이 필요합니다(house 기준 337 + 603 + 824 = 1,764 B). gzip 250 B짜리 SVG 하나면 이 세 경우는 물론 그보다 큰 크기까지 모두 해결됩니다.",
        "PNG는 이미 압축된 포맷이라 서버의 gzip이 거의 효과가 없습니다. SVG는 텍스트라서 보통 3분의 1 이상 줄어듭니다.",
      ] },
      { type: 'tip', text: "위 수치는 최적화하지 않은 파일 기준입니다. SVG에 SVGO를, PNG에 oxipng를 돌리면 둘 다 조금씩 줄어들지만 비교 결과가 뒤집히지는 않습니다." },

      { type: 'h2', text: '선명도와 픽셀 밀도' },
      { type: 'p', text: "CSS에서 24px인 아이콘이 요즘 화면에서 실제로 24개 물리 픽셀인 경우는 드뭅니다. 2x 디스플레이에서는 48×48, 3x 휴대폰에서는 72×72, 배율 150%로 설정한 Windows 노트북에서는 36×36 기기 픽셀을 차지합니다." },
      { type: 'p', text: "SVG는 브라우저가 경우마다 도형을 다시 그립니다. PNG는 가진 픽셀을 늘리거나 줄일 수밖에 없어서 24px PNG는 2x 화면에서 두 배로 늘어나 흐릿해집니다." },
      { type: 'p', text: "PNG로 이 문제를 풀려면 밀도별 파일을 따로 두고 브라우저가 고르게 해야 합니다. 내보내고, 이름 붙이고, 동기화할 파일이 그만큼 늘어납니다." },
      { type: 'code', lang: 'html', code: PNG_SRCSET },
      { type: 'p', text: "이렇게 하면 1x·2x·3x는 해결되지만 1.25x나 1.5x 배율, 브라우저 확대 상태에서는 여전히 셋 중 하나를 리샘플링하게 됩니다. SVG는 리샘플링할 일이 아예 없습니다." },

      { type: 'h2', text: '색상, 테마, 상태 표현' },
      { type: 'p', text: "PNG에는 색이 박혀 있습니다. 파란 아이콘, 다크 모드용 흰 아이콘, 오류용 빨간 아이콘은 서로 다른 파일 세 개입니다. `currentColor`를 쓰는 SVG는 부모 요소의 CSS `color`를 그대로 따라가므로, 파일 하나로 라이트·다크 모드와 hover·disabled 상태를 모두 처리할 수 있습니다." },
      { type: 'p', text: "단, CSS가 SVG에 닿을 수 있어야 합니다. 아이콘을 어떻게 넣느냐에 따라 스타일을 바꿀 수 있는 범위가 달라집니다." },
      { type: 'code', lang: 'html', code: THREE_WAYS },
      { type: 'p', text: "`<img>`로 불러온 SVG는 독립된 문서로 렌더링되기 때문에 페이지의 CSS로 선이나 채우기 색을 바꿀 수 없습니다. 외부 파일로 캐시하고 재사용하면서도 글자색을 따르게 하고 싶다면 CSS 마스크 기법을 쓰면 됩니다. 요소는 `currentColor`로 칠하고 SVG는 모양을 오려 내는 스텐실로만 씁니다." },
      { type: 'code', lang: 'css', code: MASK_CSS },

      { type: 'h2', text: '여전히 PNG가 맞는 곳' },
      { type: 'ul', items: [
        "**이메일.** 알려진 것보다는 지원이 넓습니다. caniemail.com의 SVG 이미지 항목을 보면 주요 클라이언트 대부분이 지원합니다. 다만 일관성은 떨어집니다. 예를 들어 Gmail은 SVG를 PNG로 변환해 보여 줘서 '부분 지원'으로 분류됩니다. 뉴스레터가 어디서나 똑같이 보여야 한다면 표시 크기의 2배 PNG가 여전히 안전합니다.",
        "**소셜 미리보기 이미지**(`og:image`, 트위터/X 카드). PNG나 JPEG를 쓰세요. 링크 미리보기 크롤러는 임의의 SVG를 렌더링하도록 만들어져 있지 않습니다.",
        "**Google 검색 파비콘.** Google의 파비콘 문서가 지원 형식으로 꼽는 것은 BMP, GIF, ICO, PNG, JPEG, PPM, TIFF이고, 48×48보다 큰 크기를 권장합니다. 브라우저가 SVG를 잘 표시하더라도 래스터 파비콘은 따로 준비하세요.",
        "**SVG 업로드를 막는 폼.** 예를 들어 WordPress는 플러그인 없이는 SVG 업로드를 허용하지 않습니다. SVG는 스크립트를 담을 수 있는 XML이기 때문입니다. 많은 CMS와 마켓플레이스가 같은 정책을 씁니다.",
        "**앱스토어·OS 에셋.** 앱 아이콘, 스플래시 화면, 스토어 등록 이미지는 고정 크기 래스터 파일을 요구합니다.",
        "**아주 세밀한 그림.** path가 수천 개이고 그라디언트와 필터까지 들어간 일러스트는 SVG가 PNG나 WebP보다 크고 렌더링도 느릴 수 있습니다. 아이콘이 여기에 해당하는 경우는 거의 없습니다.",
      ] },

      { type: 'h2', text: '보안 이야기 한 가지' },
      { type: 'p', text: "SVG는 문서 포맷이라 `<script>`, 이벤트 핸들러, 외부 리소스 참조를 담을 수 있습니다. `<img>`나 CSS로 불러온 SVG에서는 스크립트가 실행되지 않지만 페이지에 인라인으로 넣거나 브라우저에서 직접 열면 실행될 수 있습니다." },
      { type: 'p', text: "신뢰할 수 있는 라이브러리의 아이콘이라면 신경 쓸 필요가 없습니다. **사용자가 올린** SVG라면 표시하기 전에 새니타이즈하거나 서버에서 PNG로 래스터화하세요." },

      { type: 'h2', text: '자주 하는 실수' },
      { type: 'ul', items: [
        "**레티나 UI에 1x PNG를 쓰는 것.** 디자이너의 외장 모니터에서는 멀쩡하고 노트북에서는 다 흐릿합니다. 표시 크기의 2배로 내보내거나 SVG를 쓰세요.",
        "**가짜 SVG.** 어떤 도구는 비트맵을 `<image href=\"data:image/png;base64,…\">`로 감싸서 'SVG로 내보내기'를 처리합니다. 파일은 더 커지고 한계는 PNG와 똑같습니다. 배포 전에 확인하세요.",
      ] },
      { type: 'code', lang: 'bash', code: FAKE_SVG_CHECK },
      { type: 'ul', items: [
        "**SVG 안에 고정된 색상.** path마다 `fill=\"#000000\"`이 박혀 있으면 `currentColor` 테마가 먹히지 않습니다. 단색 아이콘이라면 고정 색을 `currentColor`로 바꾸세요.",
        "**`<img>`에 `width`·`height`를 빼먹는 것.** 파일이 로드되기 전에 브라우저가 자리를 잡아 두지 못해 레이아웃이 밀립니다. SVG든 PNG든 넣어 주세요.",
        "**큰 SVG를 수백 번 인라인하는 것.** 인라인 사본 하나하나가 HTML 크기에 더해집니다. 긴 목록에서 반복되는 아이콘이라면 캐시되는 `<img>`, 마스크, 또는 `<use>`를 쓰는 SVG 스프라이트가 낫습니다.",
      ] },

      { type: 'h2', text: '빠른 선택 체크리스트' },
      { type: 'ol', items: [
        "브라우저나 최신 앱 프레임워크가 렌더링하나요? **SVG**를 쓰세요.",
        "테마나 상태에 따라 색이 바뀌어야 하나요? **인라인 SVG**나 **CSS 마스크**를 쓰세요.",
        "이메일, 소셜 카드, 앱스토어, 검색엔진 파비콘, SVG를 막는 업로드 폼으로 가나요? 실제로 표시될 가장 큰 크기로(이메일은 2배로) 내보낸 **PNG**를 쓰세요.",
        "사진이나 아주 세밀한 일러스트인가요? 아이콘 워크플로 대신 래스터 포맷(PNG, WebP, AVIF)을 쓰세요.",
        "어느 쪽이든 **SVG를 원본으로 보관**하고 PNG가 필요할 때마다 거기서 만들어 내세요.",
      ] },

      { type: 'h2', text: '자주 묻는 질문' },
      { type: 'p', text: "**아이콘에는 PNG보다 WebP가 낫지 않나요?** WebP 무손실 모드는 보통 PNG보다 파일이 작고 최신 브라우저는 모두 지원합니다. 하지만 래스터 포맷이라 밀도 문제는 똑같이 남습니다. 더 나은 PNG일 뿐, SVG를 대신하지는 못합니다." },
      { type: 'p', text: "**PNG를 다시 SVG로 바꿀 수 있나요?** 트레이싱으로만 가능한데, 윤곽을 추정하는 방식이라 원래 형태와 맞지 않는 경우가 많고 아이콘 크기에서는 특히 그렇습니다. 원본 벡터를 찾으세요. 오픈소스 아이콘 세트는 대부분 SVG 원본을 공개합니다." },
      { type: 'p', text: "**SVG 아이콘이 렌더링을 느리게 하나요?** path 몇 개짜리 일반 UI 아이콘이라면 체감할 수준이 아닙니다. 복잡한 일러스트, 무거운 필터, 한 페이지에 인라인 아이콘이 수천 개 들어가는 경우라면 렌더링 비용을 따져 봐야 합니다." },

      { type: 'h2', text: '정리' },
      { type: 'p', text: "브라우저가 렌더링하는 것에는 기본적으로 SVG를 쓰세요. 어떤 밀도에서도 선명하고 파일 하나로 모든 테마를 감당합니다." },
      { type: 'p', text: "PNG는 대상이 고정 래스터 이미지를 요구할 때 쓰고, 그 대상에서 실제로 표시될 크기에 맞춰 SVG에서 만들어 내세요." },
      { type: 'p', text: "Icony의 내보내기도 같은 방식입니다. 모든 아이콘은 SVG 마크업에서 출발하고 PNG는 그 마크업을 사용자가 고른 크기로 렌더링해 만듭니다." },
    ],
  },
};
