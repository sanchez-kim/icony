import type { BlogPost } from '../types';

const BROWSER_FN = `// Rasterize SVG markup to a PNG Blob in the browser.
// size: output width/height in pixels. background: e.g. '#ffffff', or null for transparent.
async function svgToPng(svgText, size, background = null) {
  // An SVG loaded as an image must declare its namespace, or it fails to load.
  if (!svgText.includes('xmlns=')) {
    svgText = svgText.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode(); // rejects if the SVG is invalid

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (background) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, size, size);
    }
    // Draw at the target size so the vector is rendered, not stretched.
    ctx.drawImage(img, 0, 0, size, size);

    return await new Promise((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png')
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Usage: 3x a 24px icon for high-density screens
const png = await svgToPng(document.querySelector('#logo').outerHTML, 72);`;

const SHARP_BATCH = `// npm i sharp   (Node 18+; save as export-pngs.mjs)
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const sizes = [24, 48, 72, 512];
await mkdir('dist', { recursive: true });

for (const size of sizes) {
  await sharp('icon.svg')
    .resize(size, size, {
      fit: 'contain',                          // never crop a non-square viewBox
      background: { r: 0, g: 0, b: 0, alpha: 0 }, // transparent padding
    })
    .png()
    .toFile(\`dist/icon-\${size}.png\`);
}`;

const SHARP_FLATTEN = `// Same icon on a solid white background (e.g. for a JPEG-only uploader)
await sharp('icon.svg')
  .resize(512, 512, { fit: 'contain', background: '#ffffff' })
  .flatten({ background: '#ffffff' })
  .png()
  .toFile('icon-512-white.png');`;

const CLI = `# librsvg (brew install librsvg / apt install librsvg2-bin)
rsvg-convert -w 512 -h 512 -o icon.png icon.svg

# Inkscape 1.x
inkscape icon.svg --export-type=png --export-width=512 --export-filename=icon.png

# ImageMagick 7: -density goes BEFORE the input file, so the vector
# is rasterized at high resolution instead of being upscaled afterwards
magick -background none -density 1536 icon.svg -resize 512x512 icon.png`;

const PLAYWRIGHT = `// npm i -D playwright && npx playwright install chromium
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const svg = await readFile('badge.svg', 'utf8');
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 }); // 2x output
await page.setContent(\`<body style="margin:0">\${svg}</body>\`);
await page.locator('svg').screenshot({ path: 'badge@2x.png', omitBackground: true });
await browser.close();`;

const VERIFY = `# Pixel size, color type, and whether there is an alpha channel
file icon-512.png
# icon-512.png: PNG image data, 512 x 512, 8-bit/color RGBA, non-interlaced

# Or, from Node
node -e "require('sharp')('icon-512.png').metadata().then(m => console.log(m.width, m.height, m.hasAlpha))"`;

export const post: BlogPost = {
  slug: 'convert-svg-to-png',
  category: 'how-to',
  readingMinutes: 8,
  published: '2026-06-16',
  updated: '2026-09-30',
  related: ['svg-vs-png-icons', 'reduce-svg-file-size', 'make-a-favicon'],
  title: { en: 'How to Convert an SVG to PNG', ko: 'SVG를 PNG로 변환하는 법' },
  description: {
    en: 'Pick the right pixel size, keep transparency, and avoid cropping and blur. Tested code for the browser (canvas), Node (sharp), the command line, and headless Chrome.',
    ko: '알맞은 픽셀 크기를 정하고, 투명도를 지키고, 잘림과 흐림을 피하는 법. 브라우저(canvas), Node(sharp), 커맨드라인, 헤드리스 Chrome용 코드까지 정리했습니다.',
  },
  metaTitle: { en: 'How to Convert SVG to PNG (4 Ways) | Icony', ko: 'SVG를 PNG로 변환하는 4가지 방법 | Icony' },
  metaDescription: {
    en: 'Convert SVG to PNG without blur or cropping: choosing export sizes, transparent backgrounds, and working code for canvas, sharp, rsvg-convert, Inkscape, ImageMagick, and Playwright.',
    ko: '흐림이나 잘림 없이 SVG를 PNG로 변환하기. 내보내기 크기 선택, 투명 배경, 그리고 canvas·sharp·rsvg-convert·Inkscape·ImageMagick·Playwright 실전 코드.',
  },
  blocks: {
    en: [
      { type: 'p', text: "Converting an SVG to PNG takes one line in most tools. Getting a PNG you won't have to redo takes a few decisions first: how many pixels you need, what goes behind the icon, and how the converter treats things like `currentColor` or a non-square `viewBox`. This guide covers those decisions, then walks through four ways to convert, with code we ran against sharp 0.34.5 and real icon files." },

      { type: 'h2', text: 'Step 1: decide the pixel size' },
      { type: 'p', text: "The SVG doesn't have a resolution. The PNG will have exactly one, so choose it for the place the image is going. The formula is **display size × the highest pixel density you care about**. A 24px UI icon on a 3x phone needs 72×72 pixels. Standard destinations have their own sizes:" },
      { type: 'ul', items: [
        "**UI icon in a web page or email:** the CSS size × 2 at minimum (48px for a 24px icon), × 3 if you target phones.",
        "**Apple touch icon:** 180×180.",
        "**Web app manifest icons:** 192×192 and 512×512.",
        "**Favicon fallback:** 32×32 and 48×48, often bundled into an ICO (see our favicon guide).",
        "**Social preview (`og:image`):** a 1200×630 canvas. Place the icon inside a larger layout rather than stretching it to fill the frame.",
      ] },
      { type: 'p', text: "If you're not sure, export larger. Scaling a crisp 512px PNG down produces a clean result. Scaling a 64px PNG up never looks right. It's even better to keep the SVG and export again when a new size comes up." },

      { type: 'h2', text: 'Step 2: decide what is behind the icon' },
      { type: 'p', text: "Most icon SVGs have no background, and PNG keeps an alpha channel, so by default you get a transparent PNG. That's usually what you want. Two cases where it isn't: destinations that don't support transparency (they fill it with black or white, and a dark icon on black disappears), and platform icons like the Apple touch icon, where you should supply a solid background yourself. Pick a background color on purpose rather than leaving it to the tool." },

      { type: 'h2', text: 'Step 3: check the SVG before converting' },
      { type: 'ul', items: [
        "**`currentColor`.** Icon libraries color their strokes with `currentColor` so CSS can theme them. A converter has no CSS context, so `currentColor` resolves to the default color, black. We confirmed this with sharp: a `stroke=\"currentColor\"` line rendered as pure black (0, 0, 0). Replace `currentColor` with the actual hex value before converting, or set the `color` attribute on the root `<svg>`.",
        "**`viewBox` and aspect ratio.** A 48×24 `viewBox` resized to 512×512 has to be either padded or cropped. Some tools crop by default. See the sharp section below.",
        "**External references.** An SVG that uses a web font in `<text>` or links an external image will render differently, or not at all, in most converters and in the browser's `<img>`/canvas path. Convert text to outlines in your editor first, or use the headless browser method.",
        "**Namespace.** Markup copied from a page's DOM or rendered by a framework may be missing `xmlns=\"http://www.w3.org/2000/svg\"`. Inline SVG doesn't need it, but a standalone file loaded as an image does.",
      ] },

      { type: 'h2', text: 'Method 1: in the browser with canvas' },
      { type: 'p', text: "Every browser can already rasterize SVG, and the canvas API lets you capture the result. The key detail is to pass the **target size** to `drawImage`, so the browser renders the vector at that size instead of drawing it small and scaling the pixels up:" },
      { type: 'code', lang: 'javascript', code: BROWSER_FN },
      { type: 'p', text: "Things to know about this approach:" },
      { type: 'ul', items: [
        "**Tainted canvas.** If you draw an image loaded from another origin without CORS headers, the canvas becomes \"tainted\" and `toBlob()` throws a `SecurityError`. Building a `blob:` URL from markup you already have, as above, avoids that.",
        "**Sandboxed rendering.** An SVG drawn through `<img>` can't load external fonts, images, or stylesheets, and scripts inside it don't run. Everything the icon needs must be inside the markup.",
        "**Why not `devicePixelRatio`?** When you export a file, you choose the pixel count directly. `devicePixelRatio` only matters when you draw a canvas that stays on screen.",
      ] },
      { type: 'p', text: "Icony's PNG export works the same way. It renders the icon component to an SVG string, loads it as an image, and draws it onto a canvas that is exactly the size you picked, cleared to transparent. If you've raised the stroke above the icon set's native width, it first widens the SVG's viewBox by half the extra width on each side, because the image is clipped to its viewBox before it ever reaches the canvas. At the native width or below, the icon fills the canvas exactly. Icony’s SVG export uses the same widened viewBox, so the SVG and PNG match." },

      { type: 'h2', text: 'Method 2: Node.js with sharp' },
      { type: 'p', text: "For build scripts and servers, sharp (which uses libvips, and librsvg for SVG) is fast and has no browser dependency. This script exports one icon at several sizes:" },
      { type: 'code', lang: 'javascript', code: SHARP_BATCH },
      { type: 'p', text: "Two things we checked instead of taking them on faith:" },
      { type: 'ul', items: [
        "**`density` vs `resize()`.** Much of the advice online says to pass a high `density` or the output will be blurry. With sharp 0.34.5, resizing a 24×24 Lucide SVG to 512×512 produced **byte-identical raw pixels** with no density, with `density: 300`, and with `density: 1536`. sharp renders SVG input at the size you resize to. `density` still matters if you *don't* call `resize()`: without it, the 24×24 SVG came out as a 24×24 PNG, because the default is 72 DPI, one pixel per SVG unit.",
        "**`fit` defaults to `cover`.** With a non-square `viewBox`, `resize(512, 512)` fills the square and crops whatever overflows. `fit: 'contain'` with a transparent background keeps the whole icon and pads the rest. We confirmed it with a 48×24 test SVG: with `contain`, the corners were fully transparent and the center fully opaque.",
      ] },
      { type: 'p', text: "If the destination needs a solid background, flatten the image onto a color:" },
      { type: 'code', lang: 'javascript', code: SHARP_FLATTEN },

      { type: 'h2', text: 'Method 3: the command line' },
      { type: 'p', text: "For one-off conversions or shell pipelines, pick one of these. `rsvg-convert` and sharp share the same SVG renderer (librsvg), so their output should match closely. Inkscape uses its own renderer and handles unusual SVG features well. ImageMagick hands SVG to a delegate, and the result depends on how it was built. Always put `-density` **before** the input file, because that's when the vector is rasterized." },
      { type: 'code', lang: 'bash', code: CLI },
      { type: 'tip', text: "To batch a folder with rsvg-convert: `for f in icons/*.svg; do rsvg-convert -w 96 -h 96 -o \"png/$(basename \"$f\" .svg).png\" \"$f\"; done`" },

      { type: 'h2', text: 'Method 4: a headless browser, for SVGs that depend on CSS or fonts' },
      { type: 'p', text: "Some SVGs only look right inside a web page: text in a web font, styles in a `<style>` block that expects page CSS, or `foreignObject` content. Standalone renderers approximate these. A headless browser renders them the way users see them. Playwright can screenshot just the SVG element with a transparent background, at any device scale factor:" },
      { type: 'code', lang: 'javascript', code: PLAYWRIGHT },
      { type: 'p', text: "It's heavier than sharp (it downloads a browser), so save it for the SVGs that need it." },

      { type: 'h2', text: 'Verify the output' },
      { type: 'p', text: "Before you hand the file off, confirm the pixel dimensions and that the alpha channel survived. RGBA means transparency is preserved. RGB means the background was flattened." },
      { type: 'code', lang: 'bash', code: VERIFY },
      { type: 'p', text: "Then open the PNG on a dark background and a light one. That quickly catches a black icon on a transparent background (invisible in dark mode), halos from a background that was flattened and then removed, and strokes clipped at the edge." },

      { type: 'h2', text: 'Common mistakes' },
      { type: 'ul', items: [
        "**Upscaling a small PNG instead of re-rendering the SVG.** If you have a 64px PNG and need 256px, go back to the SVG.",
        "**A black icon where you expected a colored one.** That's `currentColor` resolving to black. Put a real color in the file first.",
        "**A cropped icon from a non-square viewBox.** Use `fit: 'contain'` (sharp) or give both width and height with a padded canvas.",
        "**Clipped strokes.** Icons drawn right up to the `viewBox` edge can lose half a stroke at their extremes. Expand the `viewBox` on each side by as much as the stroke reaches past it (at most half the stroke width, so a unit for a 2-unit stroke), which is what Icony's exporter does when you thicken the stroke. Drawing the image smaller on the canvas won't help, because the clipping happens inside the SVG.",
        "**Treating DPI metadata as resolution.** A 512×512 PNG tagged 300 DPI and one tagged 72 DPI look identical on screen. Only the pixel count matters for the web. DPI matters only for print layout.",
        "**Adding a white background out of habit.** A white square around a logo on a dark page is the most common sign of a careless export. Keep transparency unless the destination can't handle it.",
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'p', text: "**Which method gives the \"best\" quality?** For icon-style SVGs (paths and strokes, no text or filters), sharp, rsvg-convert, Inkscape, and browsers all produce clean anti-aliased output when you render at the target size. Quality differences mostly come from exporting at the wrong size, not from the tool. Use the headless browser when the SVG depends on CSS or fonts." },
      { type: 'p', text: "**How do I make the PNG smaller?** Lossless optimizers like oxipng shrink the file without changing a single pixel. For icons with few colors, pngquant's lossy palette reduction can cut the size a lot, with small changes on anti-aliased edges. And don't export larger than you need." },
      { type: 'p', text: "**Should I convert to WebP instead?** If the destination accepts WebP, lossless WebP is usually smaller than PNG. Many of the places that force you off SVG (email, older upload forms, app stores) want PNG specifically, though." },

      { type: 'h2', text: 'The takeaway' },
      { type: 'p', text: "Choose the pixel size for the destination, set the color and background explicitly, render the vector at that size rather than scaling pixels, and check the result. Keep the SVG as your source. Any PNG is just one export of it, and you can make another at a new size whenever you need it." },
    ],
    ko: [
      { type: 'p', text: "대부분의 도구에서 SVG를 PNG로 바꾸는 건 한 줄이면 됩니다. 하지만 다시 만들 필요 없는 PNG를 얻으려면 먼저 몇 가지를 정해야 합니다. 픽셀이 몇 개 필요한지, 아이콘 뒤에 무엇을 둘지, 변환 도구가 `currentColor`나 정사각형이 아닌 `viewBox`를 어떻게 처리하는지. 이 글은 그 결정들부터 짚고, 네 가지 변환 방법을 sharp 0.34.5와 실제 아이콘 파일로 돌려 본 코드와 함께 소개합니다." },

      { type: 'h2', text: '1단계: 픽셀 크기 정하기' },
      { type: 'p', text: "SVG에는 해상도가 없지만 PNG에는 딱 하나가 있습니다. 그러니 이미지가 쓰일 곳에 맞춰 정해야 합니다. 공식은 **표시 크기 × 대응할 최대 픽셀 밀도**입니다. 3x 휴대폰에 표시할 24px UI 아이콘이라면 72×72 픽셀이 필요합니다. 용도가 정해진 곳은 크기도 정해져 있습니다." },
      { type: 'ul', items: [
        "**웹 페이지나 이메일의 UI 아이콘:** 최소 CSS 크기 × 2(24px 아이콘이면 48px), 휴대폰까지 고려하면 × 3.",
        "**Apple 터치 아이콘:** 180×180.",
        "**웹 앱 매니페스트 아이콘:** 192×192와 512×512.",
        "**파비콘 대체 파일:** 32×32와 48×48. 흔히 ICO 하나로 묶습니다(파비콘 가이드 참고).",
        "**소셜 미리보기(`og:image`):** 1200×630 캔버스. 아이콘을 화면 가득 늘리지 말고 더 큰 레이아웃 안에 배치하세요.",
      ] },
      { type: 'p', text: "잘 모르겠으면 크게 내보내세요. 선명한 512px PNG를 줄이면 깔끔하게 나오지만, 64px PNG를 키워서 좋아 보이는 경우는 없습니다. 더 좋은 건 SVG를 보관해 두었다가 새 크기가 필요할 때 다시 내보내는 것입니다." },

      { type: 'h2', text: '2단계: 아이콘 뒤에 무엇을 둘지 정하기' },
      { type: 'p', text: "아이콘 SVG는 대부분 배경이 없고 PNG는 알파 채널을 지원하므로, 기본적으로 투명 PNG가 나옵니다. 대개는 그게 맞습니다. 예외는 두 가지입니다. 투명도를 지원하지 않는 곳(투명 부분을 검정이나 흰색으로 채우는데, 어두운 아이콘이 검정 위에서 사라집니다), 그리고 Apple 터치 아이콘처럼 배경을 직접 채워 넣어야 하는 플랫폼 아이콘입니다. 배경색은 도구에 맡기지 말고 의도적으로 정하세요." },

      { type: 'h2', text: '3단계: 변환 전에 SVG 점검하기' },
      { type: 'ul', items: [
        "**`currentColor`.** 아이콘 라이브러리는 CSS로 테마를 입힐 수 있도록 선 색을 `currentColor`로 지정합니다. 변환 도구에는 CSS 맥락이 없으니 `currentColor`는 기본값인 검정이 됩니다. sharp로 확인해 보니 `stroke=\"currentColor\"`인 선이 순수한 검정(0, 0, 0)으로 렌더링되었습니다. 변환 전에 `currentColor`를 실제 hex 값으로 바꾸거나, 루트 `<svg>`에 `color` 속성을 지정하세요.",
        "**`viewBox`와 가로세로 비율.** 48×24 `viewBox`를 512×512로 바꾸면 여백을 넣거나 잘라 내야 합니다. 기본값이 잘라 내기인 도구도 있습니다. 아래 sharp 부분을 참고하세요.",
        "**외부 참조.** `<text>`에 웹 폰트를 쓰거나 외부 이미지를 링크한 SVG는 대부분의 변환 도구와 브라우저의 `<img>`/canvas 경로에서 다르게 나오거나 아예 안 나옵니다. 편집기에서 텍스트를 윤곽선으로 먼저 바꾸거나, 헤드리스 브라우저 방법을 쓰세요.",
        "**네임스페이스.** 페이지 DOM에서 복사했거나 프레임워크가 렌더링한 마크업에는 `xmlns=\"http://www.w3.org/2000/svg\"`가 빠져 있을 수 있습니다. 인라인 SVG에는 필요 없지만, 이미지로 불러오는 독립 파일에는 반드시 있어야 합니다.",
      ] },

      { type: 'h2', text: '방법 1: 브라우저에서 canvas로' },
      { type: 'p', text: "모든 브라우저는 이미 SVG를 래스터화할 수 있고, canvas API로 그 결과를 받아 낼 수 있습니다. 핵심은 `drawImage`에 **목표 크기**를 넘기는 것입니다. 그래야 브라우저가 작게 그린 뒤 픽셀을 늘리는 대신, 벡터를 그 크기로 렌더링합니다." },
      { type: 'code', lang: 'javascript', code: BROWSER_FN },
      { type: 'p', text: "이 방법을 쓸 때 알아 둘 점:" },
      { type: 'ul', items: [
        "**오염된 canvas.** CORS 헤더 없이 다른 출처에서 불러온 이미지를 그리면 canvas가 '오염(tainted)'되어 `toBlob()`이 `SecurityError`를 던집니다. 위 코드처럼 이미 가진 마크업으로 `blob:` URL을 만들면 이 문제가 생기지 않습니다.",
        "**격리된 렌더링.** `<img>`로 그리는 SVG는 외부 폰트·이미지·스타일시트를 불러올 수 없고, 안의 스크립트도 실행되지 않습니다. 아이콘에 필요한 건 전부 마크업 안에 있어야 합니다.",
        "**`devicePixelRatio`는 왜 안 쓰나요?** 파일로 내보낼 때는 픽셀 수를 직접 정하면 됩니다. `devicePixelRatio`는 canvas를 화면에 계속 띄워 둘 때만 의미가 있습니다.",
      ] },
      { type: 'p', text: "Icony의 PNG 내보내기도 같은 방식입니다. 아이콘 컴포넌트를 SVG 문자열로 렌더링해 이미지로 불러온 뒤, 사용자가 고른 크기와 정확히 같은 canvas에 투명 배경으로 그립니다. 선 두께를 아이콘 세트의 기본값보다 올렸다면 먼저 SVG의 viewBox를 사방으로 늘어난 두께의 절반만큼 넓힙니다. 이미지는 canvas에 닿기 전에 이미 viewBox에서 잘리기 때문입니다. 기본 두께 이하라면 canvas를 꽉 채웁니다. Icony의 SVG 내보내기도 같은 viewBox를 쓰므로 SVG와 PNG가 일치합니다." },

      { type: 'h2', text: '방법 2: Node.js와 sharp' },
      { type: 'p', text: "빌드 스크립트나 서버에서는 sharp(libvips 기반이며 SVG는 librsvg로 처리)가 빠르고, 브라우저도 필요 없습니다. 다음 스크립트는 아이콘 하나를 여러 크기로 내보냅니다." },
      { type: 'code', lang: 'javascript', code: SHARP_BATCH },
      { type: 'p', text: "그냥 믿지 않고 직접 확인한 두 가지:" },
      { type: 'ul', items: [
        "**`density`와 `resize()`.** 높은 `density`를 주지 않으면 흐려진다는 조언이 많습니다. 그런데 sharp 0.34.5에서 24×24 Lucide SVG를 512×512로 리사이즈해 보니 density 없이, `density: 300`으로, `density: 1536`으로 했을 때 원시 픽셀이 **바이트 단위까지 똑같았습니다**. sharp는 SVG 입력을 리사이즈 목표 크기로 렌더링합니다. 다만 `resize()`를 *호출하지 않을* 때는 `density`가 중요합니다. 없으면 기본값 72 DPI, 즉 SVG 1단위가 1픽셀이 되어 24×24 SVG가 24×24 PNG로 나왔습니다.",
        "**`fit`의 기본값은 `cover`.** 정사각형이 아닌 `viewBox`를 `resize(512, 512)`하면 정사각형을 꽉 채우고 넘치는 부분을 잘라 냅니다. 투명 배경과 함께 `fit: 'contain'`을 주면 아이콘 전체를 남기고 나머지를 여백으로 채웁니다. 48×24 테스트 SVG로 확인했더니, `contain`일 때 모서리는 완전히 투명하고 가운데는 완전히 불투명했습니다.",
      ] },
      { type: 'p', text: "대상이 단색 배경을 요구하면 색 위에 합성(flatten)하세요." },
      { type: 'code', lang: 'javascript', code: SHARP_FLATTEN },

      { type: 'h2', text: '방법 3: 커맨드라인' },
      { type: 'p', text: "한 번만 변환하거나 셸 파이프라인에 넣을 때는 아래 중 하나를 고르세요. `rsvg-convert`는 sharp와 같은 SVG 렌더러(librsvg)를 쓰므로 결과가 거의 같아야 합니다. Inkscape는 자체 렌더러를 써서 특이한 SVG 기능도 잘 처리합니다. ImageMagick은 SVG를 델리게이트에 넘기므로 빌드 방식에 따라 결과가 달라집니다. `-density`는 반드시 입력 파일 **앞에** 두세요. 벡터가 래스터화되는 시점이 그때입니다." },
      { type: 'code', lang: 'bash', code: CLI },
      { type: 'tip', text: "rsvg-convert로 폴더 전체 변환: `for f in icons/*.svg; do rsvg-convert -w 96 -h 96 -o \"png/$(basename \"$f\" .svg).png\" \"$f\"; done`" },

      { type: 'h2', text: '방법 4: CSS나 폰트에 의존하는 SVG는 헤드리스 브라우저로' },
      { type: 'p', text: "웹 페이지 안에서만 제대로 보이는 SVG가 있습니다. 웹 폰트로 쓴 텍스트, 페이지 CSS를 전제로 한 `<style>` 블록, `foreignObject` 콘텐츠 같은 것들입니다. 독립 렌더러는 이런 것을 흉내만 냅니다. 헤드리스 브라우저는 사용자가 보는 그대로 렌더링합니다. Playwright로 SVG 요소만 투명 배경으로, 원하는 배율로 캡처할 수 있습니다." },
      { type: 'code', lang: 'javascript', code: PLAYWRIGHT },
      { type: 'p', text: "브라우저를 내려받아야 해서 sharp보다 무겁습니다. 꼭 필요한 SVG에만 쓰세요." },

      { type: 'h2', text: '결과물 확인하기' },
      { type: 'p', text: "파일을 넘기기 전에 픽셀 크기와 알파 채널이 살아 있는지 확인하세요. RGBA면 투명도가 유지된 것이고, RGB면 배경이 합성된 것입니다." },
      { type: 'code', lang: 'bash', code: VERIFY },
      { type: 'p', text: "그다음 PNG를 어두운 배경과 밝은 배경에 각각 올려 보세요. 투명 배경 위의 검정 아이콘(다크 모드에서 안 보임), 배경을 합성했다가 지우면서 생긴 테두리 얼룩, 가장자리에서 잘린 선을 금방 잡아낼 수 있습니다." },

      { type: 'h2', text: '자주 하는 실수' },
      { type: 'ul', items: [
        "**SVG를 다시 렌더링하지 않고 작은 PNG를 키우는 것.** 64px PNG가 있는데 256px이 필요하다면 SVG로 돌아가세요.",
        "**컬러를 기대했는데 검정 아이콘이 나오는 것.** `currentColor`가 검정으로 해석된 결과입니다. 파일에 실제 색을 먼저 넣으세요.",
        "**정사각형이 아닌 viewBox 때문에 잘린 아이콘.** sharp라면 `fit: 'contain'`을 쓰고, 다른 도구라면 가로·세로를 모두 지정하고 여백 있는 캔버스를 쓰세요.",
        "**잘린 선.** `viewBox` 끝까지 꽉 차게 그린 아이콘은 가장자리에서 선의 절반이 잘릴 수 있습니다. 선이 넘어가는 만큼(많아야 선 두께의 절반, 2단위 선이면 1단위) `viewBox`를 사방으로 넓히세요. Icony의 내보내기도 선을 굵게 하면 이렇게 합니다. 잘림은 SVG 안에서 일어나므로 canvas에 이미지를 작게 그려서는 되살릴 수 없습니다.",
        "**DPI 메타데이터를 해상도로 착각하는 것.** 300 DPI로 표시된 512×512 PNG와 72 DPI로 표시된 512×512 PNG는 화면에서 똑같습니다. 웹에서는 픽셀 수만 중요하고, DPI는 인쇄 레이아웃에서만 의미가 있습니다.",
        "**습관적으로 흰 배경을 넣는 것.** 어두운 페이지에서 로고 주위에 흰 사각형이 보이는 게 대충 내보낸 파일의 대표적인 증상입니다. 대상이 투명도를 못 쓰는 경우가 아니라면 투명하게 두세요.",
      ] },

      { type: 'h2', text: '자주 묻는 질문' },
      { type: 'p', text: "**어떤 방법이 화질이 '가장' 좋나요?** 아이콘 형태의 SVG(path와 선 위주, 텍스트나 필터 없음)라면 sharp, rsvg-convert, Inkscape, 브라우저 모두 목표 크기로 렌더링하기만 하면 깔끔하게 안티앨리어싱된 결과를 냅니다. 화질 차이는 대부분 도구가 아니라 잘못된 크기로 내보낸 데서 생깁니다. CSS나 폰트에 의존하는 SVG라면 헤드리스 브라우저를 쓰세요." },
      { type: 'p', text: "**PNG를 더 작게 만들려면?** oxipng 같은 무손실 최적화 도구는 픽셀을 하나도 바꾸지 않고 파일을 줄입니다. 색이 적은 아이콘이라면 pngquant의 손실 팔레트 축소로 크게 줄일 수 있지만, 안티앨리어싱된 가장자리가 약간 달라집니다. 그리고 필요 이상으로 크게 내보내지 마세요." },
      { type: 'p', text: "**WebP로 변환하는 게 낫지 않나요?** 대상이 WebP를 받는다면 무손실 WebP가 보통 PNG보다 작습니다. 다만 SVG를 못 쓰게 만드는 곳(이메일, 오래된 업로드 폼, 앱스토어)은 대개 PNG를 콕 집어 요구합니다." },

      { type: 'h2', text: '정리' },
      { type: 'p', text: "대상에 맞게 픽셀 크기를 정하고, 색과 배경을 명시하고, 픽셀을 늘리는 대신 벡터를 그 크기로 렌더링한 뒤 결과를 확인하세요. SVG를 원본으로 보관하세요. PNG는 그 원본에서 한 번 뽑아낸 결과일 뿐이고, 새 크기가 필요하면 언제든 다시 만들 수 있습니다." },
    ],
  },
};
