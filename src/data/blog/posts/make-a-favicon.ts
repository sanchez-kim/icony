import type { BlogPost } from '../types';

const MARKUP = `<!-- Raster fallback: older browsers and Google Search -->
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<!-- Vector icon for browsers that support SVG favicons -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<!-- iOS / iPadOS home screen -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<!-- Installable web app icons (Android, desktop PWAs) -->
<link rel="manifest" href="/manifest.webmanifest" />`;

const DARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    .mark { fill: #111827; }
    @media (prefers-color-scheme: dark) {
      .mark { fill: #f9fafb; }
    }
  </style>
  <path class="mark" d="M16 3 29 16 16 29 3 16Z" />
</svg>`;

const TILE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <!-- Solid tile: readable on light and dark tab bars alike -->
  <rect width="48" height="48" rx="12" fill="#4f46e5" />
  <!-- The icon, filled, occupying roughly the middle 70% -->
  <path d="M24 8 40 24 24 40 8 24Z" fill="#ffffff" />
</svg>`;

const GENERATE = `// npm i sharp   then: node make-favicons.mjs   (reads favicon.svg)
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const svg = await readFile('favicon.svg');
const png = (size) => sharp(svg).resize(size, size).png().toBuffer();

// Apple touch icon: give it a solid background, no transparency
await writeFile('apple-touch-icon.png',
  await sharp(svg).resize(180, 180).flatten({ background: '#ffffff' }).png().toBuffer());

// Web app manifest icons
await writeFile('icon-192.png', await png(192));
await writeFile('icon-512.png', await png(512));

// favicon.ico = 6-byte header + 16-byte directory entry per image + PNG data
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);             // reserved
header.writeUInt16LE(1, 2);             // type: 1 = icon
header.writeUInt16LE(images.length, 4); // number of images
let offset = 6 + 16 * images.length;
const entries = images.map((img, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i] % 256, 0);      // width  (0 means 256)
  e.writeUInt8(sizes[i] % 256, 1);      // height (0 means 256)
  e.writeUInt16LE(1, 4);                // color planes
  e.writeUInt16LE(32, 6);               // bits per pixel
  e.writeUInt32LE(img.length, 8);       // size of this image's data
  e.writeUInt32LE(offset, 12);          // where the data starts
  offset += img.length;
  return e;
});
await writeFile('favicon.ico', Buffer.concat([header, ...entries, ...images]));`;

const MANIFEST = `{
  "name": "Example App",
  "short_name": "Example",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512",
      "type": "image/png", "purpose": "maskable" }
  ]
}`;

const NEXT_TREE = `app/
├── favicon.ico      → <link rel="icon" href="/favicon.ico" …>
├── icon.svg         → <link rel="icon" href="/icon.svg?…" type="image/svg+xml">
├── apple-icon.png   → <link rel="apple-touch-icon" href="/apple-icon.png?…">
└── layout.tsx`;

const VERIFY = `file favicon.ico
# favicon.ico: MS Windows icon resource - 3 icons, 16x16 with PNG image data, …

curl -sI https://example.com/favicon.ico | grep -i content-type
curl -s https://example.com/robots.txt   # make sure the icon path isn't disallowed`;

export const post: BlogPost = {
  slug: 'make-a-favicon',
  category: 'how-to',
  readingMinutes: 7,
  published: '2026-05-21',
  updated: '2026-10-01',
  related: ['svg-vs-png-icons', 'reduce-svg-file-size', 'add-icons-to-website'],
  title: {
    en: 'How to Make a Favicon from an Icon',
    ko: '아이콘으로 파비콘 만드는 방법',
  },
  description: {
    en: 'A minimal, current favicon setup: an SVG, a multi-size ICO, an Apple touch icon, and manifest icons. Includes a tested Node script that generates all of them from one SVG.',
    ko: '최소한이면서 최신인 파비콘 세팅: SVG, 여러 크기를 담은 ICO, Apple 터치 아이콘, 매니페스트 아이콘. SVG 하나로 전부 만들어 내는 검증된 Node 스크립트도 담았습니다.',
  },
  metaTitle: {
    en: 'How to Make a Favicon from an Icon (2026 Guide) | Icony',
    ko: '아이콘으로 파비콘 만들기 (2026 가이드) | Icony',
  },
  metaDescription: {
    en: 'Make a favicon from any icon: which files you need, current SVG favicon support, Google Search requirements, designing for 16px, and a script that builds the ICO and PNGs.',
    ko: '아이콘으로 파비콘 만들기: 필요한 파일, 현재 SVG 파비콘 지원 현황, Google 검색 요건, 16px 디자인 요령, ICO와 PNG를 만드는 스크립트까지.',
  },
  blocks: {
    en: [
      { type: 'p', text: "Favicon generators often hand you 20 files and a block of markup to paste. You need about five. This guide covers which ones, why each exists, how to design an icon that holds up at 16 pixels, and a short Node script (tested while writing this) that builds all of them from a single SVG, including a real multi-size `.ico` file, without an online generator." },

      { type: 'h2', text: 'Who asks for your favicon, and in what format' },
      { type: 'ul', items: [
        "**Browser tabs, bookmarks, and history** read `<link rel=\"icon\">`. With no link at all, browsers fall back to requesting `/favicon.ico` from the site root.",
        "**SVG favicons** work in Chrome and Edge 80+ and Firefox 41+, but, according to caniuse.com, **Safari only added support in version 26** on both macOS and iOS. Older Safari versions still in use need a raster fallback.",
        "**Google Search** shows a favicon next to results. Its documentation lists BMP, GIF, ICO, PNG, JPEG, PPM, and TIFF as supported formats and doesn't mention SVG. It requires a square icon at least 8×8, recommends larger than 48×48, and needs both the home page and the icon file to be crawlable. The favicon has to be declared on the **home page**.",
        "**iOS \"Add to Home Screen\"** uses `rel=\"apple-touch-icon\"`, a 180×180 PNG.",
        "**Installed web apps** (Android, desktop PWAs) read icons from the web app manifest: 192×192 and 512×512.",
      ] },
      { type: 'p', text: "So the minimal set that covers all of these is: `favicon.svg`, `favicon.ico` (16, 32, and 48px inside one file), `apple-touch-icon.png`, and, if you want the site to be installable, two manifest PNGs." },

      { type: 'h2', text: 'Step 1: design for 16 pixels first' },
      { type: 'p', text: "A favicon spends most of its life at 16×16 or 32×32 device pixels. That changes which icons work. We rasterized Lucide's outline \"house\" icon (24-unit grid, 2-unit stroke) at 16px and counted pixels: **98% of its visible pixels were partially transparent**, meaning almost nothing lands as solid color. At 48px that figure drops to 22%. Thin outline icons that look sharp in a toolbar turn into grey smudges in a tab." },
      { type: 'ul', items: [
        "**Use a filled (solid) icon, not an outline.** Filled shapes have large solid areas that survive at small sizes.",
        "**Put it on a tile.** A solid rounded square behind the icon guarantees contrast on both light and dark tab bars. This is how most recognizable favicons are built.",
        "**One shape, no text.** Letters are unreadable at 16px unless the whole favicon is a single letter.",
        "**Leave some margin, but not much.** Around 10–15% on each side keeps it from looking cramped while using most of the tiny area.",
      ] },
      { type: 'p', text: "A tile-style SVG favicon can be this small:" },
      { type: 'code', lang: 'html', code: TILE_SVG },
      { type: 'p', text: "For a real-world reference, Icony's own `favicon.svg` follows this pattern: a 48×48 rounded tile with a gradient fill and a single white star shape. The file is 637 bytes, 390 bytes gzipped (measured with `wc -c` and `gzip -c | wc -c`)." },
      { type: 'tip', text: "Starting from an icon library? Pick the filled variant (for example Phosphor's fill weight or Heroicons solid), set its color, and export it as SVG. In Icony you can do that in one step and then wrap the result in a tile as shown above." },

      { type: 'h2', text: 'Step 2 (optional): adapt to dark mode' },
      { type: 'p', text: "An SVG favicon can contain a `prefers-color-scheme` media query, so a dark mark can turn light when the browser is in dark mode:" },
      { type: 'code', lang: 'html', code: DARK_SVG },
      { type: 'p', text: "Browser support for media queries inside favicons isn't uniform, and the ICO and PNG fallbacks can't adapt at all. The tile approach from Step 1 looks right in both themes without any of this, which is why we'd recommend it first." },

      { type: 'h2', text: 'Step 3: generate the raster files from the SVG' },
      { type: 'p', text: "You don't need an online generator for this. The script below uses sharp to rasterize the SVG at each size, and writes the `.ico` container itself. An ICO file is a 6-byte header, one 16-byte directory entry per image, then the image data, and each image can simply be a PNG." },
      { type: 'code', lang: 'javascript', code: GENERATE },
      { type: 'p', text: "We ran this script on Icony's own 637-byte `favicon.svg`. `file` identified the output as \"MS Windows icon resource - 3 icons, 16x16 with PNG image data…\", and macOS `sips` reads it without complaint. The output sizes were: `favicon.ico` 3,036 B (all three sizes), `apple-touch-icon.png` 4,953 B, `icon-192.png` 6,250 B, `icon-512.png` 21,246 B. With sharp 0.34.5, `resize()` re-renders the vector at each target size, so the 16px image is drawn fresh, not downscaled from a large bitmap." },
      { type: 'tip', text: "If your icon has detail that disappears at 16px, you can make a simplified SVG just for the 16 and 32px ICO entries and use the full version for larger sizes. Just pass a different input to the `png()` helper for those sizes." },
      { type: 'link', href: '/favicon-generator', text: "Skip the script: build all of these files from any icon in your browser with the Favicon Generator." },

      { type: 'h2', text: 'Step 4: add the markup' },
      { type: 'p', text: "Put the files in your site root and add this to the `<head>` of every page, or at least the home page:" },
      { type: 'code', lang: 'html', code: MARKUP },
      { type: 'p', text: "Browsers that support SVG favicons use `favicon.svg`. The others, and Google Search, use the ICO. Keep `favicon.ico` at the root even with the `<link>` in place, because some tools still request that path directly." },

      { type: 'h2', text: 'Step 5 (if installable): the manifest' },
      { type: 'code', lang: 'json', code: MANIFEST },
      { type: 'p', text: "A **maskable** icon is one the operating system may crop into a circle, squircle, or rounded square. The spec defines a safe zone: a centered circle with a radius of 40% of the icon's width. Keep everything important inside it and extend the background color to the edges. Your normal 512px icon, with the mark reaching the corners, usually gets clipped if you mark it maskable, so generate a separate version with more padding." },

      { type: 'h2', text: 'If you use Next.js (App Router)' },
      { type: 'p', text: "Next.js generates the `<link>` tags for you when you place specially named files in the `app/` directory:" },
      { type: 'code', lang: 'text', code: NEXT_TREE },
      { type: 'p', text: "`favicon.ico` only works at the top level of `app/`. Next appends a generated query string to the `icon` and `apple-icon` URLs, which helps with cache busting when you change them." },

      { type: 'h2', text: 'Verify it' },
      { type: 'code', lang: 'bash', code: VERIFY },
      { type: 'ul', items: [
        "Open the site in a private window. Browsers cache favicons aggressively and separately from the page, so a normal reload often keeps showing the old icon. Adding a version to the URL (`/favicon.svg?v=2`) forces a fresh fetch.",
        "Check a light and a dark tab bar, and look at the pinned-tab or bookmarks-bar size.",
        "Add the site to an iPhone home screen once to check the touch icon.",
        "For Google Search, use the URL Inspection tool in Search Console to request a recrawl of the home page. The icon updates on Google's own schedule, not right away.",
      ] },

      { type: 'h2', text: 'Common mistakes' },
      { type: 'ul', items: [
        "**Only shipping an SVG.** It looks fine in Chrome and Firefox, but older Safari shows a generic icon, and Google Search has no supported format to use.",
        "**A PNG renamed to `.ico`.** Many browsers will cope, but it's not an ICO, and strict consumers may reject it. Run `file favicon.ico` to confirm.",
        "**A transparent Apple touch icon.** iOS doesn't keep transparency on home-screen icons, and transparent areas commonly end up black. Flatten the icon onto a background color, as the script does.",
        "**Blocking the icon from crawlers.** If `robots.txt` disallows the path, or the icon sits behind authentication, Google can't use it.",
        "**Declaring the favicon only on inner pages.** Google reads it from the home page.",
        "**Outline icons with 1–2px strokes.** They fade at 16px, as the 98% figure above shows. Use filled shapes.",
        "**Scaling a single 512px PNG down in the browser.** Tiny downscaled bitmaps lose detail unpredictably. Rasterizing the vector at each size gives the renderer a fair chance.",
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'p', text: "**Do I still need `browserconfig.xml` and `mstile` images?** They were for pinned sites in legacy versions of Windows and Internet Explorer. Most sites today can skip them." },
      { type: 'p', text: "**Do I need separate 16×16 and 32×32 PNG links?** Not if you ship an ICO that contains both. That's the point of the multi-size container." },
      { type: 'p', text: "**Can the favicon be animated?** Some browsers animate GIF favicons, and scripts can swap the icon at runtime (for example to show an unread count), but support is inconsistent, and a static icon is what Google and home screens will use." },

      { type: 'h2', text: 'The takeaway' },
      { type: 'p', text: "Start from one well-designed SVG: a filled shape on a solid tile. Generate a multi-size ICO, a flattened 180px Apple touch icon, and, if needed, 192 and 512px manifest icons from it, then add four `<link>` tags. That covers modern browsers, older Safari, iOS home screens, installed apps, and Google Search, with every file traceable to a single source you can re-export whenever the design changes." },
    ],
    ko: [
      { type: 'p', text: "파비콘 생성기는 흔히 파일 20개와 붙여 넣을 마크업 한 덩어리를 내줍니다. 실제로 필요한 건 다섯 개 정도입니다. 이 글은 어떤 파일이 필요한지, 각각 왜 있는지, 16픽셀에서도 버티는 아이콘을 어떻게 디자인하는지 설명합니다. 그리고 온라인 생성기 없이 SVG 하나로 전부 만들어 내는, 여러 크기를 담은 진짜 `.ico` 파일까지 포함해 이 글을 쓰면서 직접 돌려 본 짧은 Node 스크립트를 소개합니다." },

      { type: 'h2', text: '누가 어떤 포맷으로 파비콘을 요청하나' },
      { type: 'ul', items: [
        "**브라우저 탭, 북마크, 방문 기록**은 `<link rel=\"icon\">`을 읽습니다. 링크가 아예 없으면 사이트 루트의 `/favicon.ico`를 요청합니다.",
        "**SVG 파비콘**은 Chrome·Edge 80 이상, Firefox 41 이상에서 동작합니다. 하지만 caniuse.com에 따르면 **Safari는 macOS와 iOS 모두 26 버전에서야 지원을 추가했습니다**. 아직 쓰이는 이전 Safari를 위해서는 래스터 대체 파일이 필요합니다.",
        "**Google 검색**은 검색 결과 옆에 파비콘을 보여 줍니다. 문서가 지원 형식으로 꼽는 것은 BMP, GIF, ICO, PNG, JPEG, PPM, TIFF이고 SVG는 언급하지 않습니다. 최소 8×8 정사각형이어야 하고, 48×48보다 큰 크기를 권장하며, 홈페이지와 아이콘 파일 모두 크롤링할 수 있어야 합니다. 파비콘은 **홈페이지**에 선언되어 있어야 합니다.",
        "**iOS '홈 화면에 추가'**는 `rel=\"apple-touch-icon\"`, 즉 180×180 PNG를 씁니다.",
        "**설치형 웹 앱**(Android, 데스크톱 PWA)은 웹 앱 매니페스트의 아이콘(192×192, 512×512)을 읽습니다.",
      ] },
      { type: 'p', text: "그래서 이 모두를 감당하는 최소 구성은 `favicon.svg`, `favicon.ico`(16·32·48px을 한 파일에), `apple-touch-icon.png`, 그리고 설치형 사이트라면 매니페스트용 PNG 두 개입니다." },

      { type: 'h2', text: '1단계: 16픽셀을 먼저 생각하고 디자인하기' },
      { type: 'p', text: "파비콘은 대부분의 시간을 16×16이나 32×32 기기 픽셀로 보냅니다. 그래서 어울리는 아이콘이 달라집니다. Lucide의 아웃라인 'house' 아이콘(24단위 격자, 2단위 선)을 16px로 래스터화해 픽셀을 세어 보니, **보이는 픽셀의 98%가 반투명**이었습니다. 온전한 색으로 찍힌 픽셀이 거의 없다는 뜻입니다. 48px에서는 이 수치가 22%로 떨어집니다. 툴바에서는 또렷한 가는 아웃라인 아이콘이 탭에서는 회색 얼룩이 됩니다." },
      { type: 'ul', items: [
        "**아웃라인 말고 채워진(solid) 아이콘을 쓰세요.** 채워진 도형은 꽉 찬 영역이 넓어 작은 크기에서도 살아남습니다.",
        "**타일 위에 올리세요.** 아이콘 뒤에 단색 둥근 사각형을 깔면 밝은 탭 바에서도 어두운 탭 바에서도 대비가 확보됩니다. 알아보기 쉬운 파비콘은 대부분 이렇게 만들어집니다.",
        "**도형 하나, 글자 없이.** 파비콘 전체가 글자 한 자가 아니라면 16px에서 글자는 읽히지 않습니다.",
        "**여백은 두되 많이는 말고.** 사방 10–15% 정도면 답답해 보이지 않으면서 좁은 면적을 최대한 씁니다.",
      ] },
      { type: 'p', text: "타일 방식의 SVG 파비콘은 이 정도로 작게 만들 수 있습니다." },
      { type: 'code', lang: 'html', code: TILE_SVG },
      { type: 'p', text: "실제 예로, Icony의 `favicon.svg`도 이 패턴을 따릅니다. 48×48 둥근 타일에 그라디언트를 채우고 흰색 별 모양 하나를 올렸습니다. 파일 크기는 637바이트, gzip으로 390바이트입니다(`wc -c`와 `gzip -c | wc -c`로 측정)." },
      { type: 'tip', text: "아이콘 라이브러리에서 시작한다면 채워진 변형(예: Phosphor의 fill 굵기나 Heroicons solid)을 골라 색을 지정하고 SVG로 내보내세요. Icony에서는 이 과정을 한 번에 끝내고, 결과물을 위처럼 타일로 감싸면 됩니다." },

      { type: 'h2', text: '2단계(선택): 다크 모드에 맞추기' },
      { type: 'p', text: "SVG 파비콘 안에 `prefers-color-scheme` 미디어 쿼리를 넣으면, 브라우저가 다크 모드일 때 어두운 마크를 밝게 바꿀 수 있습니다." },
      { type: 'code', lang: 'html', code: DARK_SVG },
      { type: 'p', text: "파비콘 안의 미디어 쿼리는 브라우저마다 지원이 고르지 않고, ICO와 PNG 대체 파일은 아예 바뀔 수 없습니다. 1단계의 타일 방식은 이런 처리 없이도 두 테마에서 모두 제대로 보여서 먼저 권하는 방법입니다." },

      { type: 'h2', text: '3단계: SVG에서 래스터 파일 만들기' },
      { type: 'p', text: "온라인 생성기가 없어도 됩니다. 아래 스크립트는 sharp로 SVG를 크기별로 래스터화하고, `.ico` 컨테이너는 직접 씁니다. ICO 파일은 6바이트 헤더, 이미지마다 16바이트짜리 디렉터리 항목, 그리고 이미지 데이터로 이루어지며, 각 이미지는 그냥 PNG여도 됩니다." },
      { type: 'code', lang: 'javascript', code: GENERATE },
      { type: 'p', text: "이 스크립트를 Icony의 637바이트짜리 `favicon.svg`로 돌려 봤습니다. `file` 명령은 결과를 \"MS Windows icon resource - 3 icons, 16x16 with PNG image data…\"로 인식했고, macOS `sips`도 문제없이 읽었습니다. 결과 파일 크기는 `favicon.ico` 3,036 B(세 크기 전부), `apple-touch-icon.png` 4,953 B, `icon-192.png` 6,250 B, `icon-512.png` 21,246 B였습니다. sharp 0.34.5에서는 `resize()`가 목표 크기마다 벡터를 새로 렌더링하므로, 16px 이미지도 큰 비트맵을 줄인 게 아니라 새로 그린 것입니다." },
      { type: 'tip', text: "16px에서 사라지는 디테일이 있다면, ICO의 16·32px 항목에만 쓸 단순화한 SVG를 따로 만들고 큰 크기에는 원래 버전을 쓰세요. 해당 크기에서만 `png()` 헬퍼에 다른 입력을 넘기면 됩니다." },
      { type: 'link', href: '/favicon-generator', text: "스크립트 없이도 됩니다. 파비콘 생성기에서 아이콘 하나로 이 파일들을 브라우저에서 바로 만들어 보세요." },

      { type: 'h2', text: '4단계: 마크업 추가하기' },
      { type: 'p', text: "파일을 사이트 루트에 두고 모든 페이지의 `<head>`에, 최소한 홈페이지에는 아래를 넣으세요." },
      { type: 'code', lang: 'html', code: MARKUP },
      { type: 'p', text: "SVG 파비콘을 지원하는 브라우저는 `favicon.svg`를 쓰고, 나머지 브라우저와 Google 검색은 ICO를 씁니다. `<link>`가 있더라도 `favicon.ico`는 루트에 두세요. 아직도 이 경로를 직접 요청하는 도구가 있습니다." },

      { type: 'h2', text: '5단계(설치형이라면): 매니페스트' },
      { type: 'code', lang: 'json', code: MANIFEST },
      { type: 'p', text: "**maskable** 아이콘은 운영체제가 원, 스퀴클, 둥근 사각형 등으로 잘라 쓸 수 있는 아이콘입니다. 스펙은 안전 영역을 아이콘 너비의 40%를 반지름으로 하는 가운데 원으로 정의합니다. 중요한 요소는 모두 그 안에 두고 배경색은 가장자리까지 채우세요. 마크가 모서리까지 닿는 평소의 512px 아이콘을 maskable로 지정하면 보통 잘리므로, 여백을 더 준 버전을 따로 만드세요." },

      { type: 'h2', text: 'Next.js(App Router)를 쓴다면' },
      { type: 'p', text: "`app/` 디렉터리에 정해진 이름의 파일을 두면 Next.js가 `<link>` 태그를 알아서 만들어 줍니다." },
      { type: 'code', lang: 'text', code: NEXT_TREE },
      { type: 'p', text: "`favicon.ico`는 `app/` 최상위에서만 동작합니다. `icon`과 `apple-icon` URL에는 Next가 쿼리 문자열을 자동으로 붙여 주므로, 파일을 바꿨을 때의 캐시 문제를 줄여 줍니다." },

      { type: 'h2', text: '확인하기' },
      { type: 'code', lang: 'bash', code: VERIFY },
      { type: 'ul', items: [
        "시크릿 창으로 사이트를 여세요. 브라우저는 파비콘을 페이지와 따로, 그것도 끈질기게 캐시하기 때문에 일반 새로고침으로는 옛 아이콘이 계속 보이는 일이 흔합니다. URL에 버전을 붙이면(`/favicon.svg?v=2`) 새로 받아 옵니다.",
        "밝은 탭 바와 어두운 탭 바, 고정 탭이나 북마크 바 크기에서도 확인하세요.",
        "iPhone 홈 화면에 한 번 추가해서 터치 아이콘을 확인하세요.",
        "Google 검색은 Search Console의 URL 검사 도구로 홈페이지 재크롤링을 요청하세요. 아이콘은 곧바로가 아니라 Google의 일정에 따라 갱신됩니다.",
      ] },

      { type: 'h2', text: '자주 하는 실수' },
      { type: 'ul', items: [
        "**SVG만 두는 것.** Chrome과 Firefox에서는 멀쩡하지만, 이전 Safari에서는 기본 아이콘이 보이고 Google 검색은 쓸 수 있는 형식이 없습니다.",
        "**PNG의 확장자만 `.ico`로 바꾸는 것.** 많은 브라우저가 알아서 처리하지만 ICO는 아니고, 엄격한 곳에서는 거부될 수 있습니다. `file favicon.ico`로 확인하세요.",
        "**투명한 Apple 터치 아이콘.** iOS는 홈 화면 아이콘의 투명도를 유지하지 않으며, 투명 영역이 검게 나오는 경우가 흔합니다. 스크립트처럼 배경색 위에 합성하세요.",
        "**크롤러가 아이콘에 접근하지 못하게 막는 것.** `robots.txt`가 경로를 막거나 아이콘이 인증 뒤에 있으면 Google이 쓸 수 없습니다.",
        "**하위 페이지에만 파비콘을 선언하는 것.** Google은 홈페이지에서 읽습니다.",
        "**1–2px 선의 아웃라인 아이콘.** 위의 98% 수치처럼 16px에서 흐려집니다. 채워진 도형을 쓰세요.",
        "**512px PNG 하나를 브라우저가 줄이게 두는 것.** 아주 작게 축소한 비트맵은 디테일이 예측할 수 없게 사라집니다. 크기마다 벡터를 래스터화해야 렌더러가 제대로 그릴 수 있습니다.",
      ] },

      { type: 'h2', text: '자주 묻는 질문' },
      { type: 'p', text: "**`browserconfig.xml`과 `mstile` 이미지는 아직 필요한가요?** 예전 Windows와 Internet Explorer의 고정 사이트용이었습니다. 오늘날 대부분의 사이트는 생략해도 됩니다." },
      { type: 'p', text: "**16×16과 32×32 PNG 링크를 따로 걸어야 하나요?** 둘 다 담은 ICO를 두면 필요 없습니다. 여러 크기를 한 파일에 담는 컨테이너를 쓰는 이유가 그것입니다." },
      { type: 'p', text: "**파비콘을 움직이게 할 수 있나요?** 일부 브라우저는 GIF 파비콘을 재생하고, 스크립트로 런타임에 아이콘을 바꿀 수도 있습니다(읽지 않은 개수 표시 등). 하지만 지원이 들쭉날쭉하고, Google과 홈 화면은 정적인 아이콘을 씁니다." },

      { type: 'h2', text: '정리' },
      { type: 'p', text: "잘 디자인한 SVG 하나, 즉 단색 타일 위에 채워진 도형으로 시작하세요. 거기서 여러 크기를 담은 ICO, 배경을 합성한 180px Apple 터치 아이콘, 필요하다면 192·512px 매니페스트 아이콘을 만들고 `<link>` 태그 네 개를 추가하세요. 그러면 최신 브라우저, 이전 Safari, iOS 홈 화면, 설치형 앱, Google 검색까지 모두 감당할 수 있고, 모든 파일이 디자인이 바뀔 때마다 다시 내보낼 수 있는 원본 하나에서 나옵니다." },
    ],
  },
};
