import type { BlogPost } from '../types';

const LINE_TEST = `<!-- A 1-unit stroke centred on y=12 covers y=11.5 to 12.5:
     half of row 11 and half of row 12, so both rows get 50% ink -->
<path d="M4 12H20" stroke="#000" stroke-width="1" />

<!-- Centred on y=12.5 it covers y=12 to 13: exactly one full row -->
<path d="M4 12.5H20" stroke="#000" stroke-width="1" />`;

const FIND_RASTER = `# Is the file really vector? Look for embedded bitmaps
grep -c "<image" icon.svg
grep -o "data:image/[a-z]*;base64" icon.svg | head -1

# Check the actual file type, whatever the extension says
file icon.svg`;

const FIND_SUBPIXEL = `// Paste into the DevTools console: lists SVGs that don't land on whole device pixels
const dpr = window.devicePixelRatio;
for (const svg of document.querySelectorAll('svg')) {
  const r = svg.getBoundingClientRect();
  const frac = [r.left, r.top, r.width, r.height]
    .map((v) => Math.abs(v * dpr - Math.round(v * dpr)));
  if (frac.some((f) => f > 0.01)) console.log(svg, r.left, r.top, r.width, r.height);
}`;

const SIZE_FIX = `/* Before: 1.2em of a 15px font = 18px, i.e. 0.75 of the 24-unit grid */
.icon { width: 1.2em; height: 1.2em; }

/* After: a whole-pixel size that is a multiple of the grid */
.icon { width: 24px; height: 24px; }

/* Centering: avoid translate(-50%, -50%) on odd-sized boxes */
.icon-wrap { display: grid; place-items: center; width: 40px; height: 40px; }`;

const STROKE_FIX = `// lucide-react: keep the stroke at 2 screen pixels at any size
// (internally strokeWidth becomes 2 * 24 / size, so 2.4 units at 20px)
<Settings size={20} absoluteStrokeWidth />

<!-- Plain SVG: stroke width measured in screen pixels, not user units -->
<path d="…" stroke-width="2" vector-effect="non-scaling-stroke" />`;

export const post: BlogPost = {
  slug: 'fix-blurry-svg-icons',
  category: 'troubleshooting',
  readingMinutes: 8,
  published: '2026-04-09',
  updated: '2026-10-02',
  related: ['svg-vs-png-icons', 'change-svg-icon-color', 'add-icons-to-website'],
  title: {
    en: 'Why Are My SVG Icons Blurry? (And How to Fix It)',
    ko: 'SVG 아이콘이 흐릿한 이유 (그리고 해결법)',
  },
  description: {
    en: 'SVG never pixelates, but it can still look soft. Measured examples of why: odd sizes, half-pixel strokes, fractional positioning, and hidden bitmaps, with a fix for each.',
    ko: 'SVG는 깨지지 않지만 흐릿해 보일 수는 있습니다. 어중간한 크기, 반픽셀 선, 소수점 위치, 숨은 비트맵 등 원인을 실측 예시로 짚고 각각의 해결법을 정리했습니다.',
  },
  metaTitle: {
    en: 'Why Are My SVG Icons Blurry? How to Fix Fuzzy Icons | Icony',
    ko: 'SVG 아이콘이 흐릿한 이유와 해결법 | Icony',
  },
  metaDescription: {
    en: 'Fix blurry SVG icons: rendering at sizes off the icon grid, half-pixel strokes, fractional positioning, fractional display scaling, hidden bitmaps, and 1x PNG exports.',
    ko: '흐릿한 SVG 아이콘 해결: 격자에 맞지 않는 크기, 반픽셀 선, 소수점 위치, 화면 배율, 숨은 비트맵, 1x PNG 내보내기까지.',
  },
  blocks: {
    en: [
      { type: 'p', text: "\"SVG is infinitely sharp\" is only half true. The file is resolution-independent, but your screen isn't." },
      { type: 'p', text: "Every SVG is turned into pixels at the end, and when a shape edge falls partway through a pixel, the renderer shades that pixel with partial opacity. That's anti-aliasing." },
      { type: 'p', text: "A little of it makes curves look smooth. A lot of it along straight lines makes an icon look out of focus." },
      { type: 'p', text: "Below, we measure where the soft pixels come from and show how to get rid of them." },

      { type: 'h2', text: 'The mechanism: an experiment with one line' },
      { type: 'p', text: "Take a 24×24 SVG with a single horizontal stroke and rasterize it at 24px, which is one SVG unit per pixel. We did this with sharp 0.34.5 and read back the alpha value of each pixel row:" },
      { type: 'code', lang: 'html', code: LINE_TEST },
      { type: 'ul', items: [
        "**1-unit stroke at y=12:** rows 11 and 12 both come out at alpha 128 of 255. You wanted one crisp black line and got two grey ones.",
        "**1-unit stroke at y=12.5:** row 12 at alpha 255, nothing else. Crisp.",
        "**2-unit stroke at y=12:** rows 11 and 12 at alpha 255. Crisp.",
        "**2-unit stroke at y=12.5:** rows 11 and 13 at 128, row 12 at 255. Soft on both sides.",
      ] },
      { type: 'p', text: "The rule: a straight edge is sharp only when it lands exactly on a pixel boundary. Odd stroke widths need half-pixel coordinates, and even stroke widths need whole-pixel coordinates." },
      { type: 'p', text: "Icon designers build icons on a grid with these rules in mind. Anything that scales or shifts the icon after that can undo their work." },

      { type: 'h2', text: 'Measured: how display size changes sharpness' },
      { type: 'p', text: "To see how much this matters in practice, we rasterized three real \"home\" icons at several sizes and counted the pixels with partial alpha (between 0 and 255) as a share of all visible pixels. A lower share means more solid pixels and a crisper look." },
      { type: 'p', text: "Curves always produce some partial pixels, so compare sizes within a row, not across icons:" },
      { type: 'ul', items: [
        "**Lucide house** (24-unit grid, 2-unit stroke): 16px 98% · 20px 74% · **24px 38%** · 30px 50% · 36px 32% · 48px 22%.",
        "**Tabler home** (24-unit grid, 2-unit stroke): 16px 81% · 20px 77% · **24px 46%** · 30px 48% · 36px 38% · 48px 29%.",
        "**Heroicons home, outline** (24-unit grid, 1.5-unit stroke): 16px 94% · 20px 90% · **24px 84%** · 30px 72% · 36px 65% · 48px 51%.",
      ] },
      { type: 'p', text: "Lucide's house nearly **halves** its soft pixels between 20px and 24px, even though 24px is only slightly bigger. At 24px every grid line lands on a pixel, while at 20px everything is scaled by 0.833 and a 2-unit stroke becomes 1.67 pixels." },
      { type: 'p', text: "At 16px, almost every pixel of a 2px-stroke outline icon is partial. The strokes are 1.33 pixels wide and can't be crisp." },
      { type: 'p', text: "Heroicons' 1.5-unit stroke is soft even at its native 24px, because a 1.5px line can never fill whole pixels. That's a design choice for a lighter look, not a bug, but it's why these icons look softer next to 2px sets." },
      { type: 'tip', text: "These numbers come from librsvg via sharp. Browser rasterizers anti-alias somewhat differently, so the exact percentages will vary, but the geometry that causes them is the same everywhere." },

      { type: 'h2', text: 'Step 0: confirm it is really an SVG' },
      { type: 'p', text: "Before tuning anything, make sure you're looking at a vector. Zoom the browser to 400%: a true SVG stays clean at the new size, and a bitmap gets blockier." },
      { type: 'p', text: "Then check the file itself. Some tools export \"SVG\" files that are only a PNG wrapped in an `<image>` tag:" },
      { type: 'code', lang: 'bash', code: FIND_RASTER },
      { type: 'p', text: "In DevTools, the Network panel's Content-Type column tells you the same thing for files served over HTTP. If it's a raster in disguise, go back to the source vector. No CSS will fix it." },

      { type: 'h2', text: 'Cause 1: a display size that is off the icon grid' },
      { type: 'p', text: "This is the most common cause in real projects, and the measurements above show why. Sizes like `1.2em`, `1.25rem`, or `18px` scale a 24-unit icon by a non-integer factor, so every carefully aligned edge moves onto a fractional pixel." },
      { type: 'code', lang: 'css', code: SIZE_FIX },
      { type: 'p', text: "If you need smaller icons, pick a set drawn for that size. Heroicons, for example, ships separate 20px and 16px solid sets alongside its 24px icons. Don't shrink a 24px outline icon and hope it holds up." },

      { type: 'h2', text: 'Cause 2: the stroke width scaled into fractions' },
      { type: 'p', text: "Sometimes the design really does call for 20px. Then keep the stroke a whole number of **screen** pixels, even if its value in SVG units becomes fractional:" },
      { type: 'code', lang: 'jsx', code: STROKE_FIX },
      { type: 'p', text: "We confirmed in lucide-react's source (v0.460.0) that `absoluteStrokeWidth` converts the stroke with `strokeWidth * 24 / size`. At 20px, a 2 becomes 2.4 units, which renders as exactly 2 pixels." },
      { type: 'p', text: "Tools that let you change stroke weight directly, like the stroke slider in Icony, let you do the same thing by hand. At small sizes, a slightly heavier stroke often looks sharper than the default." },

      { type: 'h2', text: 'Cause 3: fractional positioning' },
      { type: 'p', text: "A perfectly sized icon still blurs if its top-left corner lands at x = 10.5. Common ways this happens:" },
      { type: 'ul', items: [
        "`transform: translate(-50%, -50%)` on an icon or wrapper whose width or height is odd, so half of it is a fraction.",
        "Centering a 24px icon inside a 33px or 41px box, which leaves 4.5px on each side.",
        "Text-relative layout: icons aligned to a baseline, `vertical-align: middle`, or line heights like `1.5` on a 15px font (22.5px lines).",
        "Percentage widths in fluid layouts, where a column of `33.333%` puts everything after it on a fraction.",
      ] },
      { type: 'p', text: "Rather than guess, paste this into the DevTools console. It lists every SVG whose position or size doesn't fall on whole **device** pixels:" },
      { type: 'code', lang: 'javascript', code: FIND_SUBPIXEL },
      { type: 'p', text: "Fix what it finds with even-sized containers, grid or flex centering instead of percentage transforms, and explicit pixel sizes on the icon wrapper." },

      { type: 'h2', text: 'Cause 4: fractional display scaling' },
      { type: 'p', text: "On a Windows laptop at 125% or 150% scaling, or in a browser zoomed to 110%, one CSS pixel isn't a whole number of device pixels. A 24px icon becomes 30 or 36 device pixels, and a 2px stroke becomes 2.5 or 3." },
      { type: 'p', text: "You can't control the user's scaling. At 150% the 2px strokes happen to become exactly 3 pixels, but at 125% there's no way to avoid 2.5-pixel strokes." },
      { type: 'p', text: "So the same icons can look crisp on a Mac (2x) and slightly soft on a Windows machine at 125%. Accept some softness here rather than bending your design around one scaling factor." },

      { type: 'h2', text: 'Cause 5: transforms and animations' },
      { type: 'p', text: "`transform: scale(1.1)` on hover, a zoom-in entrance animation, or a parent with a non-integer `scale()` all change the icon's pixel size after layout. While a transform animates, browsers may draw the element once and scale that bitmap, so it can look soft mid-animation and snap back when the transition ends. If an icon stays blurry at rest, check its computed `transform` and those of its ancestors in DevTools for a leftover scale or translate." },

      { type: 'h2', text: 'Cause 6: a missing or mismatched viewBox' },
      { type: 'p', text: "Without a `viewBox`, an SVG has no internal coordinate system to scale. Change its `width` and `height` and the drawing stays the same size while its canvas changes, so it gets cropped or padded instead of resized." },
      { type: 'p', text: "If the `viewBox` is present but has a different aspect ratio from the box you display it in, `preserveAspectRatio` centers the drawing, which can offset it by half a pixel. Keep `viewBox=\"0 0 24 24\"` (or whatever grid the icon was drawn on) and display it in a box with the same ratio." },

      { type: 'h2', text: 'Cause 7: a PNG exported at 1x' },
      { type: 'p', text: "If you had to use a PNG (for email, an app, a CMS that rejects SVG), the image is fixed at the pixel count you exported. A 24px PNG on a 2x screen is stretched to 48 device pixels and looks soft. Export at the display size × 2 (× 3 for phones) and set the display size with `width` and `height`." },

      { type: 'h2', text: 'A "fix" that makes things worse' },
      { type: 'p', text: "`shape-rendering=\"crispEdges\"` turns off anti-aliasing. Straight horizontal and vertical lines get hard edges, but every curve and diagonal turns jagged, and strokes on fractional coordinates can jump by a pixel or vanish." },
      { type: 'p', text: "It's useful for pixel-art-style graphics and grid lines, not for general icons. Fix the geometry instead." },

      { type: 'h2', text: 'The checklist' },
      { type: 'ol', items: [
        "Zoom to 400% and inspect the file. Is it a real vector?",
        "Is the rendered size a whole multiple of the icon's grid (24, 48 for 24-unit icons)?",
        "If not, is there a set drawn for that size, or can you keep the stroke at whole screen pixels (`absoluteStrokeWidth`, `vector-effect`)?",
        "Does the console snippet flag fractional positions? Fix odd containers and percentage transforms.",
        "Is a leftover `transform: scale()` on the icon or an ancestor?",
        "Does the root `<svg>` have a `viewBox` that matches the display ratio?",
        "If it's a PNG, was it exported at 2x or 3x the display size?",
      ] },

      { type: 'h2', text: 'FAQ' },
      { type: 'p', text: "**Why do my icons look fine on my Mac and fuzzy on a colleague's PC?** On a 2x screen each CSS pixel is 4 device pixels, which hides most anti-aliasing. On a 1x or 1.25x screen the same partial pixels are big enough to see. Always check icons at 1x, for example on an external monitor or with DevTools device emulation." },
      { type: 'p', text: "**Can SVG optimization cause blur?** Not blur as such. But aggressive precision settings in tools like SVGO round coordinates, and rounding a point from 12.5 to 13, for example, can move an edge off the pixel grid. If an icon looked crisp before optimization and soft after, raise the precision setting." },
      { type: 'p', text: "**Should I round everything to whole pixels?** Round sizes and positions, yes. Coordinates inside the icon should follow the stroke rule: whole numbers for even strokes, .5 for odd strokes." },

      { type: 'h2', text: 'The takeaway' },
      { type: 'p', text: "A blurry SVG is almost never the format's fault. It's geometry that ended up between pixels." },
      { type: 'p', text: "Render icons at multiples of their design grid, keep strokes a whole number of screen pixels, keep positions on whole device pixels, and export any PNG at the density it will be shown at. Do that and \"infinitely sharp\" becomes true in practice." },
    ],
    ko: [
      { type: 'p', text: "\"SVG는 무한히 선명하다\"는 말은 절반만 맞습니다. 파일은 해상도와 무관하지만 화면은 그렇지 않습니다." },
      { type: 'p', text: "모든 SVG는 결국 픽셀로 바뀌고 도형의 가장자리가 픽셀 중간에 걸리면 렌더러는 그 픽셀을 반투명하게 칠합니다. 이것이 안티앨리어싱입니다." },
      { type: 'p', text: "조금이면 곡선이 매끄러워 보이지만 직선을 따라 많이 생기면 아이콘이 초점이 나간 것처럼 보입니다. 이 글은 흐린 픽셀이 정확히 어디서 생기는지 실측으로 보여 주고 없애는 방법을 설명합니다." },

      { type: 'h2', text: '원리: 선 하나로 해 보는 실험' },
      { type: 'p', text: "가로선 하나만 있는 24×24 SVG를 24px, 즉 SVG 1단위가 1픽셀인 크기로 래스터화해 봅시다. sharp 0.34.5로 렌더링한 뒤 픽셀 행마다 알파 값을 읽었습니다." },
      { type: 'code', lang: 'html', code: LINE_TEST },
      { type: 'ul', items: [
        "**y=12에 1단위 선:** 11행과 12행이 모두 알파 128(255 중)로 나옵니다. 또렷한 검은 선 하나를 원했는데 회색 선 두 줄이 생긴 셈입니다.",
        "**y=12.5에 1단위 선:** 12행만 알파 255. 선명합니다.",
        "**y=12에 2단위 선:** 11·12행 모두 알파 255. 선명합니다.",
        "**y=12.5에 2단위 선:** 11·13행은 128, 12행은 255. 위아래가 모두 흐립니다.",
      ] },
      { type: 'p', text: "규칙은 이렇습니다. 직선 가장자리는 픽셀 경계에 정확히 걸릴 때만 선명합니다. 홀수 두께의 선은 좌표가 .5여야 하고 짝수 두께의 선은 좌표가 정수여야 합니다." },
      { type: 'p', text: "아이콘 디자이너는 이 규칙을 염두에 두고 격자 위에 아이콘을 그립니다. 그 뒤에 아이콘을 늘리거나 옮기면 그 노력이 무너질 수 있습니다." },

      { type: 'h2', text: '실측: 표시 크기에 따라 달라지는 선명도' },
      { type: 'p', text: "얼마나 차이가 나는지 보려고 실제 '집' 아이콘 세 개를 여러 크기로 래스터화한 뒤 보이는 픽셀 중 부분 알파(0과 255 사이)를 가진 픽셀의 비율을 셌습니다. 비율이 낮을수록 꽉 찬 픽셀이 많아 또렷해 보입니다." },
      { type: 'p', text: "곡선에서는 늘 부분 픽셀이 생기므로 아이콘끼리 비교하지 말고 한 줄 안에서 크기별로 비교하세요." },
      { type: 'ul', items: [
        "**Lucide house**(24단위 격자, 2단위 선): 16px 98% · 20px 74% · **24px 38%** · 30px 50% · 36px 32% · 48px 22%.",
        "**Tabler home**(24단위 격자, 2단위 선): 16px 81% · 20px 77% · **24px 46%** · 30px 48% · 36px 38% · 48px 29%.",
        "**Heroicons home, outline**(24단위 격자, 1.5단위 선): 16px 94% · 20px 90% · **24px 84%** · 30px 72% · 36px 65% · 48px 51%.",
      ] },
      { type: 'p', text: "Lucide house는 20px에서 24px로 조금 커졌을 뿐인데 흐린 픽셀이 거의 **절반**으로 줄어듭니다. 24px에서는 격자선이 모두 픽셀에 맞지만 20px에서는 전체가 0.833배로 줄어 2단위 선이 1.67픽셀이 되기 때문입니다." },
      { type: 'p', text: "16px에서는 2px 선 아웃라인 아이콘의 거의 모든 픽셀이 부분 픽셀입니다. 선 두께가 1.33픽셀이라 선명할 수가 없습니다." },
      { type: 'p', text: "Heroicons의 1.5단위 선은 원래 크기인 24px에서도 흐립니다. 1.5픽셀짜리 선은 온전한 픽셀을 채울 수 없기 때문입니다. 가벼운 인상을 위한 디자인 선택이지 버그는 아니지만 그래서 2px 세트 옆에 두면 더 흐려 보입니다." },
      { type: 'tip', text: "이 수치는 sharp를 거친 librsvg 기준입니다. 브라우저 렌더러는 안티앨리어싱 방식이 조금씩 달라 정확한 퍼센트는 달라지지만 원인이 되는 기하 구조는 어디서나 같습니다." },

      { type: 'h2', text: '0단계: 정말 SVG인지 확인하기' },
      { type: 'p', text: "무언가를 조정하기 전에 보고 있는 것이 벡터인지부터 확인하세요. 브라우저를 400%로 확대해 보면 진짜 SVG는 새 크기에서도 깨끗하고 비트맵은 더 뭉개집니다." },
      { type: 'p', text: "그다음 파일 자체를 확인하세요. 어떤 도구는 PNG를 `<image>` 태그로 감싸기만 한 파일을 'SVG'로 내보냅니다." },
      { type: 'code', lang: 'bash', code: FIND_RASTER },
      { type: 'p', text: "HTTP로 받은 파일이라면 DevTools 네트워크 패널의 Content-Type 열에서도 같은 걸 알 수 있습니다. 래스터가 SVG 행세를 하고 있다면 원본 벡터로 돌아가세요. CSS로는 고칠 수 없습니다." },

      { type: 'h2', text: '원인 1: 아이콘 격자에서 벗어난 표시 크기' },
      { type: 'p', text: "실제 프로젝트에서 가장 흔한 원인이고 위 측정값이 그 이유를 보여 줍니다. `1.2em`, `1.25rem`, `18px` 같은 크기는 24단위 아이콘을 정수가 아닌 배율로 줄이므로, 공들여 맞춘 가장자리가 전부 픽셀 중간으로 밀려납니다." },
      { type: 'code', lang: 'css', code: SIZE_FIX },
      { type: 'p', text: "더 작은 아이콘이 필요하면 그 크기용으로 그린 세트를 고르세요. 예를 들어 Heroicons는 24px 아이콘과 별도로 20px·16px solid 세트를 제공합니다. 24px 아웃라인 아이콘을 줄여 놓고 버텨 주기를 바라지 마세요." },

      { type: 'h2', text: '원인 2: 소수점으로 줄어든 선 두께' },
      { type: 'p', text: "디자인상 정말 20px이어야 할 때도 있습니다. 그럴 때는 SVG 단위로는 소수가 되더라도 선 두께를 **화면** 픽셀 기준 정수로 유지하세요." },
      { type: 'code', lang: 'jsx', code: STROKE_FIX },
      { type: 'p', text: "lucide-react 소스(v0.460.0)에서 `absoluteStrokeWidth`가 `strokeWidth * 24 / size`로 선 두께를 환산하는 것을 확인했습니다. 20px에서 2는 2.4단위가 되고 화면에서는 정확히 2픽셀로 그려집니다." },
      { type: 'p', text: "선 두께를 직접 조절할 수 있는 도구, 예를 들어 Icony의 선 두께 슬라이더로도 같은 일을 손으로 할 수 있습니다. 작은 크기에서는 기본값보다 조금 두꺼운 선이 더 선명해 보일 때가 많습니다." },

      { type: 'h2', text: '원인 3: 소수점 위치' },
      { type: 'p', text: "크기가 완벽해도 왼쪽 위 모서리가 x = 10.5에 놓이면 흐려집니다. 흔히 이렇게 생깁니다." },
      { type: 'ul', items: [
        "가로나 세로가 홀수인 아이콘이나 래퍼에 `transform: translate(-50%, -50%)`를 걸면, 그 절반이 소수가 됩니다.",
        "24px 아이콘을 33px이나 41px 상자 가운데에 놓으면 양옆이 4.5px씩 남습니다.",
        "텍스트 기준 배치: 베이스라인 정렬, `vertical-align: middle`, 15px 글꼴에 `1.5` 같은 줄 높이(22.5px).",
        "유동 레이아웃의 퍼센트 너비: `33.333%` 칼럼 하나가 그 뒤의 모든 요소를 소수 위치로 밀어냅니다.",
      ] },
      { type: 'p', text: "추측하지 말고 아래 코드를 DevTools 콘솔에 붙여 넣어 보세요. 위치나 크기가 **기기** 픽셀 정수에 맞지 않는 SVG를 모두 찾아 줍니다." },
      { type: 'code', lang: 'javascript', code: FIND_SUBPIXEL },
      { type: 'p', text: "찾아낸 것은 짝수 크기 컨테이너, 퍼센트 transform 대신 grid나 flex 가운데 정렬, 아이콘 래퍼의 명시적인 픽셀 크기로 고치세요." },

      { type: 'h2', text: '원인 4: 소수 배율의 화면' },
      { type: 'p', text: "배율을 125%나 150%로 설정한 Windows 노트북, 또는 110%로 확대한 브라우저에서는 CSS 1픽셀이 기기 픽셀 정수가 아닙니다. 24px 아이콘은 30이나 36 기기 픽셀이 되고 2px 선은 2.5나 3이 됩니다." },
      { type: 'p', text: "사용자의 배율은 통제할 수 없습니다. 150%에서는 2px 선이 마침 정확히 3픽셀이 되지만 125%에서는 2.5픽셀 선을 피할 방법이 없습니다." },
      { type: 'p', text: "그래서 같은 아이콘이 Mac(2x)에서는 또렷하고 125% Windows에서는 약간 흐립니다. 여기서는 어느 정도의 흐림을 받아들이세요. 배율 하나에 맞추려고 디자인을 비틀지는 마세요." },

      { type: 'h2', text: '원인 5: transform과 애니메이션' },
      { type: 'p', text: "hover 때의 `transform: scale(1.1)`, 확대되며 나타나는 등장 애니메이션, 정수가 아닌 `scale()`이 걸린 부모는 모두 레이아웃이 끝난 뒤 아이콘의 픽셀 크기를 바꿉니다. transform이 애니메이션되는 동안 브라우저는 요소를 한 번 그려 둔 비트맵을 확대·축소할 수 있어서 애니메이션 중에는 흐렸다가 전환이 끝나면 또렷해질 수 있습니다. 멈춰 있는데도 흐리다면 DevTools에서 아이콘과 조상 요소의 계산된 `transform`을 확인해 남아 있는 scale이나 translate를 찾아보세요." },

      { type: 'h2', text: '원인 6: viewBox가 없거나 맞지 않을 때' },
      { type: 'p', text: "`viewBox`가 없으면 SVG에는 확대·축소할 내부 좌표계가 없습니다. `width`와 `height`를 바꾸면 그림은 그대로이고 캔버스만 바뀌어, 크기가 조절되는 대신 잘리거나 여백이 생깁니다." },
      { type: 'p', text: "`viewBox`가 있어도 표시하는 상자와 비율이 다르면 `preserveAspectRatio`가 그림을 가운데로 옮기는데, 이때 반 픽셀 어긋날 수 있습니다. `viewBox=\"0 0 24 24\"`(또는 아이콘이 그려진 격자)를 유지하고 같은 비율의 상자에 표시하세요." },

      { type: 'h2', text: '원인 7: 1x로 내보낸 PNG' },
      { type: 'p', text: "이메일, 앱, SVG를 막는 CMS 때문에 PNG를 써야 했다면, 이미지는 내보낼 때의 픽셀 수로 고정됩니다. 24px PNG는 2x 화면에서 48 기기 픽셀로 늘어나 흐려 보입니다. 표시 크기 × 2(휴대폰은 × 3)로 내보내고, 표시 크기는 `width`와 `height`로 지정하세요." },

      { type: 'h2', text: '오히려 악화시키는 \"해결책\"' },
      { type: 'p', text: "`shape-rendering=\"crispEdges\"`는 안티앨리어싱을 끕니다. 수평·수직 직선은 딱 떨어지지만 곡선과 사선은 전부 계단처럼 깨지고, 소수 좌표의 선은 한 픽셀씩 튀거나 사라질 수 있습니다." },
      { type: 'p', text: "픽셀 아트 풍 그래픽이나 격자선에는 쓸모 있지만 일반 아이콘에는 맞지 않습니다. 기하 구조를 고치세요." },

      { type: 'h2', text: '체크리스트' },
      { type: 'ol', items: [
        "400%로 확대하고 파일을 확인했나요? 진짜 벡터인가요?",
        "렌더링 크기가 아이콘 격자의 정수배인가요(24단위 아이콘이면 24, 48)?",
        "아니라면 그 크기용으로 그린 세트가 있나요? 또는 선을 화면 픽셀 정수로 유지할 수 있나요(`absoluteStrokeWidth`, `vector-effect`)?",
        "콘솔 코드가 소수 위치를 잡아냈나요? 홀수 크기 컨테이너와 퍼센트 transform을 고치세요.",
        "아이콘이나 조상 요소에 `transform: scale()`이 남아 있나요?",
        "루트 `<svg>`에 표시 비율과 맞는 `viewBox`가 있나요?",
        "PNG라면 표시 크기의 2배나 3배로 내보냈나요?",
      ] },

      { type: 'h2', text: '자주 묻는 질문' },
      { type: 'p', text: "**제 Mac에서는 멀쩡한데 동료 PC에서는 흐릿한 이유는?** 2x 화면에서는 CSS 1픽셀이 기기 픽셀 4개라 안티앨리어싱이 대부분 가려집니다. 1x나 1.25x 화면에서는 같은 부분 픽셀이 눈에 보일 만큼 큽니다. 외장 모니터나 DevTools 기기 에뮬레이션으로 1x에서도 꼭 확인하세요." },
      { type: 'p', text: "**SVG 최적화 때문에 흐려질 수 있나요?** 흐림 자체는 아닙니다. 하지만 SVGO 같은 도구의 정밀도 설정이 공격적이면 좌표가 반올림되고, 예를 들어 12.5를 13으로 반올림하면 가장자리가 픽셀 격자에서 벗어날 수 있습니다. 최적화 전에는 또렷했는데 후에 흐려졌다면 정밀도 설정을 올리세요." },
      { type: 'p', text: "**전부 정수 픽셀로 반올림해야 하나요?** 크기와 위치는 그렇습니다. 아이콘 내부 좌표는 선 두께 규칙을 따르세요. 짝수 두께는 정수, 홀수 두께는 .5입니다." },

      { type: 'h2', text: '정리' },
      { type: 'p', text: "흐릿한 SVG는 포맷 탓인 경우가 거의 없습니다. 기하 구조가 픽셀 사이에 걸린 것입니다." },
      { type: 'p', text: "아이콘을 디자인 격자의 정수배 크기로 렌더링하고, 선 두께를 화면 픽셀 정수로 유지하고, 위치를 기기 픽셀 정수에 맞추고, PNG는 표시될 밀도에 맞춰 내보내세요. 그러면 '무한히 선명하다'는 말이 실제로도 맞게 됩니다." },
    ],
  },
};
