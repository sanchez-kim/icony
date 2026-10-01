import type { BlogPost } from '../types';

const SCALE_MATH = `rendered stroke (CSS px) = stroke-width × (rendered size ÷ viewBox width)

Lucide / Tabler, stroke-width="2", viewBox 24:
  16px icon → 2 × 16/24 = 1.33px
  20px icon → 2 × 20/24 = 1.67px
  24px icon → 2 × 24/24 = 2.00px
  32px icon → 2 × 32/24 = 2.67px
  48px icon → 2 × 48/24 = 4.00px

Heroicons outline, stroke-width="1.5", viewBox 24:
  16px → 1.00px   20px → 1.25px   24px → 1.50px`;

const PHOSPHOR_WEIGHTS = `<!-- Phosphor 2.1.10, "check" icon, viewBox 0 0 256 256 -->
<!-- regular: rounded ends use radius 8, so the bar is 16 units wide -->
<path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0 …"/>
<!-- bold: radius 12, so the bar is 24 units wide -->
<path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0 …"/>`;

const PER_SIZE_CSS = `/* Keep lines visually ~1.5px at every size (24-unit viewBox) */
.icon     { stroke-width: 2; }      /* default: 24px → 2px */
.icon-16  { stroke-width: 2.25; }   /* 16px → 1.5px  (1.5 × 24 / 16) */
.icon-20  { stroke-width: 1.8; }    /* 20px → 1.5px  (1.5 × 24 / 20) */
.icon-32  { stroke-width: 1.125; }  /* 32px → 1.5px  (1.5 × 24 / 32) */
.icon-48  { stroke-width: 0.75; }   /* 48px → 1.5px  (1.5 × 24 / 48) */`;

const LUCIDE_ABS = `import { Check } from 'lucide-react';

// strokeWidth is multiplied by 24 / size before it is written out
<Check size={48} strokeWidth={1} absoluteStrokeWidth />
// renders: width="48" viewBox="0 0 24 24" stroke-width="0.5"
// 0.5 units × (48 / 24) = 1px on screen, the same as a 24px icon at 1`;

const NON_SCALING = `/* Stroke measured in screen pixels instead of viewBox units */
.icon :is(path, circle, rect, line, polyline, polygon, ellipse) {
  vector-effect: non-scaling-stroke;
  stroke-width: 1.5px;
}`;

const CLIP_EXAMPLE = `<!-- Lucide "heart": the outline reaches x = 2 and x = 22 -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3
           c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2
           A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
</svg>
<!-- stroke-width 2 → outer edge at x = 1   (1 unit of margin)
     stroke-width 4 → outer edge at x = 0   (touching the edge)
     stroke-width 5 → outer edge at x = -0.5 (clipped) -->`;

const OVERFLOW_CSS = `/* Option 1: let the stroke paint outside the box */
svg.icon-heavy { overflow: visible; }`;

const OVERFLOW_VIEWBOX = `<!-- Option 2: widen the viewBox so the artwork has room
     (artwork 2 units from the edge + 1 extra unit = room for stroke-width 6) -->
<svg viewBox="-1 -1 26 26" …>`;

export const post: BlogPost = {
  slug: 'svg-stroke-width',
  category: 'how-to',
  readingMinutes: 8,
  published: '2026-05-14',
  updated: '2026-09-30',
  related: ['icon-sizes-guide', 'change-svg-icon-color', 'lucide-vs-tabler-vs-heroicons'],
  title: {
    en: 'SVG Stroke Width: What It Is and How to Choose',
    ko: 'SVG 선 두께(stroke width): 개념과 고르는 법',
  },
  description: {
    en: 'What the stroke-width number really measures, how it grows with icon size, the defaults each library ships, and how to keep line weight consistent across sizes.',
    ko: 'stroke-width 숫자가 실제로 재는 것, 아이콘 크기에 따라 굵어지는 원리, 라이브러리별 기본값, 크기가 달라도 선 굵기를 일정하게 유지하는 법.',
  },
  metaTitle: {
    en: 'SVG Stroke Width Explained: How to Choose Icon Weight | Icony',
    ko: 'SVG 선 두께 완벽 이해: 아이콘 굵기 고르는 법 | Icony',
  },
  metaDescription: {
    en: 'How SVG stroke-width scales with icon size, measured defaults for Lucide, Tabler, Heroicons and Phosphor, clipping at thick weights, and three ways to keep lines consistent.',
    ko: '아이콘 크기에 따라 stroke-width가 커지는 원리, Lucide·Tabler·Heroicons·Phosphor 기본값 측정, 굵은 선의 잘림 문제, 선 굵기를 일정하게 유지하는 세 가지 방법.',
  },
  blocks: {
    en: [
      { type: 'p', text: 'Outline icon sets such as Lucide, Tabler and Heroicons outline are drawn as open lines with a `stroke` color and `fill="none"`. The `stroke-width` attribute sets how thick those lines are. It is one number, but it controls more of an icon’s personality than its color does: the same glyph at 1 looks refined and airy, and at 3 it looks bold and friendly. It also causes two practical problems people rarely expect: lines that get heavier as icons get bigger, and thick strokes that get cut off at the edges. This guide covers both, with numbers measured from the libraries themselves.' },

      { type: 'h2', text: 'What the number measures' },
      { type: 'p', text: '`stroke-width` is measured in **user units**, the coordinate system defined by the icon’s `viewBox`, not in screen pixels. Almost every modern outline set uses a 24×24 viewBox, so `stroke-width="2"` means “a line one-twelfth as thick as the icon is wide.” When the browser scales the viewBox to the element’s rendered width, the stroke is scaled along with the shapes:' },
      { type: 'code', lang: 'text', code: SCALE_MATH },
      { type: 'p', text: 'That is why a default Lucide icon looks noticeably heavier at 48px than at 24px: the proportions are the same, but the absolute line is twice as thick while your body text stays the same. At small sizes it works the other way: a default 16px icon has 1.33px lines, which look lighter than the same icon at 24px.' },
      { type: 'p', text: 'The stroke is also **centered on the path**: half of the width falls inside the shape’s outline and half outside. Increasing the width from 2 to 3 therefore grows the line by 0.5 units in each direction, which matters when the artwork is close to the edge of the viewBox (covered below).' },

      { type: 'h2', text: 'The defaults each library ships' },
      { type: 'p', text: 'We rendered one icon from each package installed in Icony’s codebase and read the output. Here is what you get before you change anything:' },
      { type: 'ul', items: [
        '**Lucide (lucide-react 0.460):** `stroke-width="2"` on the root `<svg>`, round caps and joins. The `strokeWidth` prop changes it.',
        '**Tabler (@tabler/icons-react 3.36):** also `2`, round caps and joins. The prop is called `stroke`, not `strokeWidth`.',
        '**Heroicons outline (2.2.0):** `stroke-width="1.5"` on the root, with round caps and joins set on each path. The component spreads your props after its defaults, so passing `strokeWidth={2}` does override it.',
        '**Phosphor (2.1.10):** no stroke at all. Every weight is a separate filled outline. See the next section.',
        '**Heroicons solid, Tabler filled, Bootstrap Icons, Radix Icons:** fill-based. You can pass a `stroke-width` and it will appear in the markup, but with no `stroke` color there is nothing for it to thicken.',
      ] },
      { type: 'tip', text: 'Mixing libraries is the most common reason a UI’s icons look inconsistent. Heroicons at its default 1.5 next to Lucide at its default 2 will look like two weights, because they are. Set one value explicitly and apply it to both.' },

      { type: 'h2', text: 'Phosphor: weights instead of widths' },
      { type: 'p', text: 'Phosphor ships six styles (thin, light, regular, bold, fill, duotone) as separate artwork on a 256×256 grid. Each “line” is really a filled shape with rounded ends, so you can measure its thickness from the arc radius in the path data:' },
      { type: 'code', lang: 'html', code: PHOSPHOR_WEIGHTS },
      { type: 'p', text: 'Doing that for all four line weights (end radii 4, 6, 8 and 12 in the paths we checked) and scaling to a 24-unit grid gives rough stroke-width equivalents of **thin ≈ 0.75, light ≈ 1.125, regular ≈ 1.5, bold ≈ 2.25**. So Phosphor regular sits close to Heroicons outline, and Phosphor bold is slightly heavier than Lucide’s default. You can’t choose values in between; you pick a weight. When Icony’s stroke slider is used on a Phosphor icon, it maps the value to a weight with fixed thresholds: above 2.5 is bold, above 1.75 regular, above 1 light, and anything else thin.' },

      { type: 'h2', text: 'Keeping line weight consistent across sizes' },
      { type: 'p', text: 'Design systems usually want every icon to have the same line thickness on screen, whether it’s a 16px icon in a table row or a 32px icon in an empty state. Because `stroke-width` scales with the icon, you have to compensate. There are three ways to do it.' },
      { type: 'p', text: '**1. Set the width per size.** The formula is `stroke-width = target px × viewBox width ÷ rendered size`. It needs no special features and works in exported files as well as in the browser:' },
      { type: 'code', lang: 'css', code: PER_SIZE_CSS },
      { type: 'p', text: '**2. Use Lucide’s `absoluteStrokeWidth`.** Lucide’s React component has this compensation built in. Its source multiplies `strokeWidth` by `24 / size` when the flag is set, which we confirmed by rendering:' },
      { type: 'code', lang: 'tsx', code: LUCIDE_ABS },
      { type: 'p', text: '**3. Use `vector-effect: non-scaling-stroke`.** This CSS property (also available as an SVG attribute) tells the browser to apply the stroke width in the screen’s coordinate system rather than the icon’s. The line stays at the width you set regardless of the icon’s size. It has to be applied to the shapes, not to the root `<svg>`, and it only works on inline SVG you control:' },
      { type: 'code', lang: 'css', code: NON_SCALING },
      { type: 'p', text: 'Which one to pick: use per-size values or `absoluteStrokeWidth` if the icons will also be exported as files (a PNG or a standalone SVG doesn’t carry your CSS). Use `non-scaling-stroke` for icons that live only inside your app, especially if they are resized fluidly with `em` or container units.' },

      { type: 'h2', text: 'Thick strokes and clipping' },
      { type: 'p', text: 'Icon grids leave a small margin, but not much. Because the stroke is centered on the path, anything drawn near the edge of the viewBox runs out of room as the width goes up. Lucide’s heart is a good example because its outline touches the left and right keylines exactly:' },
      { type: 'code', lang: 'html', code: CLIP_EXAMPLE },
      { type: 'p', text: 'Round caps and joins extend the same half-width beyond the endpoints, so line ends near the edge clip too. SVG clips to the viewBox by default. If you need heavy weights, either allow overflow or give the artwork more room:' },
      { type: 'code', lang: 'css', code: OVERFLOW_CSS },
      { type: 'code', lang: 'html', code: OVERFLOW_VIEWBOX },
      { type: 'p', text: 'Widening the viewBox makes the drawn icon slightly smaller inside the same box (24 of 26 units instead of 24 of 24), so do it for the whole set, not for individual icons. Rasterizers face the same issue, and drawing the image smaller on the canvas doesn’t help: an SVG loaded as an image is already clipped to its own viewBox. Icony’s exports (PNG, SVG, copied code and ZIP) therefore widen the viewBox itself, by exactly the extra half-width, (stroke − native stroke) ÷ 2 units on each side. The native stroke is 2 for Lucide and Tabler and 1.5 for Heroicons. At or below the native weight nothing changes and the icon fills its box edge to edge. At stroke 4, a Lucide icon is drawn in a 26-unit box, so a 32px export shows its 24-unit grid at about 29.5px. Filled sets such as Phosphor, Bootstrap and Radix have no stroke to grow, so they are never shrunk.' },

      { type: 'h2', text: 'Crisp lines at small sizes' },
      { type: 'p', text: 'On a standard-density screen, a 1.33px line can’t cover whole pixels, so antialiasing spreads it across two rows of partially shaded pixels. It looks slightly gray and soft next to text. High-density screens hide this, but for small icons on 1× displays it helps to choose combinations that land on whole pixels: 1.5 at 16px (1px), 2 at 24px (2px), or 1.5 at 32px (2px). Straight lines that sit on half-units in the path data (such as `x = 12` with a 1px line) can still blur. That is a drawing problem rather than a width problem, which our blurry-icons guide covers.' },

      { type: 'h2', text: 'Choosing a weight for your UI' },
      { type: 'p', text: 'There isn’t a universally correct width, but there are good decision criteria:' },
      { type: 'ul', items: [
        '**Match your text.** Put the icon next to the label it will actually sit beside. The icon’s line should look close to the thickness of the letters’ vertical strokes. Regular-weight UI text at 14–16px usually pairs with rendered lines of about 1.25–2px; semibold labels can take 2px or a little more.',
        '**Heavier for small and busy contexts.** Toolbars, tab bars and dense tables benefit from a slightly heavier line, since thin lines at 16px or smaller start to break up.',
        '**Lighter for large, decorative sizes.** Feature illustrations and empty states at 48px and up usually look better with a lighter line (1–1.5 units), or with `absoluteStrokeWidth`, so they don’t look clumsy.',
        '**One value per product.** Choose a single rendered line thickness and derive per-size values from it. Consistency matters more than the exact number.',
      ] },

      { type: 'h2', text: 'Common mistakes' },
      { type: 'ul', items: [
        '**Adjusting stroke on a filled icon.** Nothing happens because there is no stroke. Switch to the outline variant, or for Phosphor choose a different weight.',
        '**Mixing up prop names.** Tabler’s React components document `stroke={1.5}`; Lucide and Heroicons use `strokeWidth`. In the Tabler version we tested, `strokeWidth` also happens to work because extra props are passed through to the `<svg>`, but passing a color string to Tabler’s `stroke` by habit won’t change the color, because that prop is the width.',
        '**Setting stroke-width on the root when shapes have their own.** Hand-exported SVGs often repeat `stroke-width` on every path. A value on the root is inherited only where the child doesn’t set one; override with a CSS rule on the shapes instead.',
        '**Changing caps and joins to “sharpen” an icon.** Switching `stroke-linecap` from round to butt makes short strokes look thinner and uneven, because the libraries’ artwork was designed around round ends.',
        '**Resizing with `transform: scale()`.** A CSS transform scales the whole rendering, stroke included, and leaves the layout box at its original size. Resize icons with `width` and `height` so the stroke math above still applies.',
      ] },

      { type: 'h2', text: 'Quick answers' },
      { type: 'p', text: '**Is stroke-width in pixels?** Only when the viewBox size equals the rendered size, as with a 24-unit icon shown at 24px. Otherwise it’s in viewBox units, scaled by the ratio.' },
      { type: 'p', text: '**Can I make a filled icon thinner?** Not with `stroke-width`. You need a different set of artwork, such as a lighter Phosphor weight or the outline version of the icon.' },
      { type: 'p', text: '**What’s a safe maximum?** It depends on how close the artwork gets to the edge. For shapes that come within 2 units of it, like Lucide’s heart, anything above 4 clips unless you allow overflow. Test your largest and most edge-heavy icons at the weight you plan to use.' },
      { type: 'p', text: '**Takeaway:** decide on the line thickness you want on screen, convert it to units for each size you use, and apply it to every library in the project. The icons will then look like one family even when they come from several.' },
    ],
    ko: [
      { type: 'p', text: 'Lucide, Tabler, Heroicons outline 같은 외곽선 아이콘 세트는 `fill="none"`에 `stroke` 색을 준 열린 선으로 그려집니다. 이 선의 굵기를 정하는 것이 `stroke-width` 속성입니다. 숫자 하나지만 아이콘 인상을 색보다 더 크게 좌우합니다. 같은 글리프라도 1이면 섬세하고 가볍고, 3이면 굵고 친근해 보입니다. 동시에 사람들이 잘 예상하지 못하는 실무 문제도 두 가지 일으킵니다. 아이콘을 키울수록 선이 무거워지는 문제, 그리고 굵은 선이 가장자리에서 잘리는 문제입니다. 이 글은 라이브러리에서 직접 측정한 숫자로 둘 다 다룹니다.' },

      { type: 'h2', text: '이 숫자가 재는 것' },
      { type: 'p', text: '`stroke-width`의 단위는 화면 픽셀이 아니라 아이콘의 `viewBox`가 정하는 좌표계, 즉 **사용자 단위**입니다. 요즘 외곽선 세트는 거의 다 24×24 viewBox를 쓰므로 `stroke-width="2"`는 “아이콘 너비의 12분의 1 두께인 선”이라는 뜻입니다. 브라우저가 viewBox를 요소의 실제 렌더링 너비에 맞춰 늘리거나 줄이면 선도 도형과 함께 확대·축소됩니다.' },
      { type: 'code', lang: 'text', code: SCALE_MATH },
      { type: 'p', text: '기본 Lucide 아이콘이 24px보다 48px에서 눈에 띄게 무거워 보이는 이유입니다. 비율은 같지만 선의 절대 굵기는 두 배가 되고, 본문 글자는 그대로이기 때문입니다. 작을 때는 반대입니다. 기본값 16px 아이콘의 선은 1.33px라서 같은 아이콘을 24px로 볼 때보다 가벼워 보입니다.' },
      { type: 'p', text: '선은 또 **path를 중심으로** 그려집니다. 굵기의 절반은 도형 윤곽 안쪽에, 절반은 바깥쪽에 놓입니다. 그래서 굵기를 2에서 3으로 올리면 선이 양쪽으로 0.5단위씩 넓어지고, 그림이 viewBox 가장자리에 가까울 때 문제가 됩니다(아래에서 다룹니다).' },

      { type: 'h2', text: '라이브러리별 기본값' },
      { type: 'p', text: 'Icony 코드베이스에 설치된 패키지에서 아이콘을 하나씩 렌더링해 출력 결과를 확인했습니다. 아무것도 바꾸지 않았을 때 얻는 값은 다음과 같습니다.' },
      { type: 'ul', items: [
        '**Lucide(lucide-react 0.460):** 루트 `<svg>`에 `stroke-width="2"`, 끝과 모서리는 둥글게 처리됩니다. `strokeWidth` prop으로 바꿉니다.',
        '**Tabler(@tabler/icons-react 3.36):** 역시 `2`에 둥근 끝과 모서리입니다. prop 이름이 `strokeWidth`가 아니라 `stroke`입니다.',
        '**Heroicons outline(2.2.0):** 루트에 `stroke-width="1.5"`, 둥근 끝과 모서리는 path마다 지정됩니다. 컴포넌트가 기본값 뒤에 사용자 props를 펼치므로 `strokeWidth={2}`를 넘기면 실제로 덮어씁니다.',
        '**Phosphor(2.1.10):** stroke가 아예 없습니다. 굵기마다 별도의 채움 윤곽 도형입니다. 다음 절을 보세요.',
        '**Heroicons solid, Tabler filled, Bootstrap Icons, Radix Icons:** 채움 기반입니다. `stroke-width`를 넘기면 마크업에 나타나긴 하지만 `stroke` 색이 없으니 굵어질 대상이 없습니다.',
      ] },
      { type: 'tip', text: 'UI 아이콘이 들쭉날쭉해 보이는 가장 흔한 이유는 라이브러리를 섞어 쓰는 것입니다. 기본값 1.5인 Heroicons와 기본값 2인 Lucide를 나란히 두면 굵기가 두 가지로 보이는데, 실제로 두 가지이기 때문입니다. 값 하나를 명시적으로 정해서 양쪽에 똑같이 적용하세요.' },

      { type: 'h2', text: 'Phosphor: 두께 대신 굵기 단계' },
      { type: 'p', text: 'Phosphor는 thin, light, regular, bold, fill, duotone 여섯 스타일을 256×256 그리드 위의 별도 그림으로 제공합니다. 각 “선”은 사실 끝이 둥근 채움 도형이라서 path 데이터의 호 반지름으로 두께를 잴 수 있습니다.' },
      { type: 'code', lang: 'html', code: PHOSPHOR_WEIGHTS },
      { type: 'p', text: '선 스타일 네 가지 모두에 이렇게 해 보면(확인한 path에서 끝 반지름이 4, 6, 8, 12) 24단위 그리드로 환산한 stroke-width는 대략 **thin ≈ 0.75, light ≈ 1.125, regular ≈ 1.5, bold ≈ 2.25**입니다. Phosphor regular는 Heroicons outline에 가깝고, Phosphor bold는 Lucide 기본값보다 조금 더 굵습니다. 중간값은 고를 수 없고 단계 중 하나를 골라야 합니다. Icony의 선 두께 슬라이더를 Phosphor 아이콘에 쓰면 고정된 기준으로 단계에 대응시킵니다. 2.5 초과는 bold, 1.75 초과는 regular, 1 초과는 light, 나머지는 thin입니다.' },

      { type: 'h2', text: '크기가 달라도 선 굵기를 일정하게 유지하기' },
      { type: 'p', text: '디자인 시스템은 보통 표 안의 16px 아이콘이든 빈 화면의 32px 아이콘이든 화면상 선 두께가 같기를 원합니다. `stroke-width`는 아이콘과 함께 커지므로 보정이 필요합니다. 방법은 세 가지입니다.' },
      { type: 'p', text: '**1. 크기별로 값을 지정한다.** 공식은 `stroke-width = 목표 px × viewBox 너비 ÷ 렌더링 크기`입니다. 특별한 기능이 필요 없고, 브라우저뿐 아니라 내보낸 파일에서도 그대로 통합니다.' },
      { type: 'code', lang: 'css', code: PER_SIZE_CSS },
      { type: 'p', text: '**2. Lucide의 `absoluteStrokeWidth`를 쓴다.** Lucide React 컴포넌트에는 이 보정이 내장돼 있습니다. 플래그를 켜면 소스 코드가 `strokeWidth`에 `24 / size`를 곱하는데, 직접 렌더링해서 확인했습니다.' },
      { type: 'code', lang: 'tsx', code: LUCIDE_ABS },
      { type: 'p', text: '**3. `vector-effect: non-scaling-stroke`를 쓴다.** 이 CSS 속성(SVG 속성으로도 쓸 수 있음)은 선 두께를 아이콘 좌표계가 아닌 화면 좌표계로 적용하라고 브라우저에 지시합니다. 아이콘 크기와 상관없이 지정한 두께가 유지됩니다. 루트 `<svg>`가 아니라 도형에 적용해야 하고, 직접 다룰 수 있는 인라인 SVG에서만 동작합니다.' },
      { type: 'code', lang: 'css', code: NON_SCALING },
      { type: 'p', text: '고르는 기준은 이렇습니다. 아이콘을 파일로도 내보낸다면 크기별 값이나 `absoluteStrokeWidth`를 쓰세요. PNG나 단독 SVG 파일에는 CSS가 따라가지 않습니다. 앱 안에서만 쓰는 아이콘, 특히 `em`이나 컨테이너 단위로 크기가 유동적으로 바뀌는 아이콘이라면 `non-scaling-stroke`가 편합니다.' },

      { type: 'h2', text: '굵은 선과 잘림' },
      { type: 'p', text: '아이콘 그리드는 여백을 조금 남기지만 넉넉하지는 않습니다. 선이 path 중심에 그려지기 때문에 viewBox 가장자리 근처의 그림은 굵기가 올라갈수록 공간이 모자랍니다. Lucide의 하트가 좋은 예인데, 윤곽이 좌우 기준선에 정확히 닿기 때문입니다.' },
      { type: 'code', lang: 'html', code: CLIP_EXAMPLE },
      { type: 'p', text: '둥근 끝과 모서리도 끝점 바깥으로 굵기의 절반만큼 튀어나오므로, 가장자리 근처의 선 끝도 잘립니다. SVG는 기본적으로 viewBox 밖을 잘라냅니다. 굵은 선이 필요하다면 넘침을 허용하거나 그림에 여유 공간을 주세요.' },
      { type: 'code', lang: 'css', code: OVERFLOW_CSS },
      { type: 'code', lang: 'html', code: OVERFLOW_VIEWBOX },
      { type: 'p', text: 'viewBox를 넓히면 같은 상자 안에서 그림이 조금 작아지므로(24/24가 아니라 24/26) 아이콘 몇 개가 아니라 세트 전체에 적용하세요. 래스터 변환도 같은 문제를 겪는데, 캔버스에 이미지를 작게 그린다고 해결되지는 않습니다. 이미지로 불러온 SVG는 이미 자기 viewBox에서 잘려 있기 때문입니다. 그래서 Icony의 내보내기(PNG, SVG, 코드 복사, ZIP)는 viewBox 자체를 늘어난 반폭만큼, 즉 사방으로 (선 두께 − 기본 두께) ÷ 2단위씩 넓힙니다. 기본 두께는 Lucide와 Tabler가 2, Heroicons가 1.5입니다. 기본 두께 이하에서는 아무것도 바뀌지 않아 아이콘이 상자를 꽉 채웁니다. 선 두께 4의 Lucide 아이콘은 26단위 상자에 그려지므로, 32px 내보내기에서 24단위 격자는 약 29.5px이 됩니다. Phosphor, Bootstrap, Radix처럼 채운 도형으로 그린 세트는 늘어날 선이 없어 줄이지 않습니다.' },

      { type: 'h2', text: '작은 크기에서 선을 선명하게' },
      { type: 'p', text: '일반 밀도 화면에서 1.33px 선은 픽셀을 딱 맞게 채울 수 없어서, 안티앨리어싱이 두 줄의 픽셀에 걸쳐 옅게 칠합니다. 텍스트 옆에서 약간 회색빛으로 흐려 보입니다. 고밀도 화면에서는 티가 덜 나지만, 1× 화면의 작은 아이콘이라면 정수 픽셀로 떨어지는 조합을 고르는 게 좋습니다. 16px에서 1.5(1px), 24px에서 2(2px), 32px에서 1.5(2px) 같은 조합입니다. 다만 path 데이터에서 반 단위 좌표에 놓인 직선(예: 1px 선이 `x = 12`에 있는 경우)은 그래도 흐려질 수 있습니다. 두께가 아니라 그림 자체의 문제이고, 흐린 아이콘 가이드에서 다룹니다.' },

      { type: 'h2', text: 'UI에 맞는 굵기 고르기' },
      { type: 'p', text: '모두에게 맞는 정답 두께는 없지만, 판단 기준은 분명히 있습니다.' },
      { type: 'ul', items: [
        '**텍스트에 맞춘다.** 아이콘을 실제로 옆에 놓일 레이블 옆에 두고 보세요. 아이콘 선이 글자의 세로획 두께와 비슷해 보여야 합니다. 14~16px 보통 굵기 UI 텍스트라면 렌더링된 선이 1.25~2px 정도일 때 잘 어울리고, 세미볼드 레이블이라면 2px 이상도 괜찮습니다.',
        '**작고 복잡한 곳은 조금 굵게.** 툴바, 탭 바, 촘촘한 표에서는 선을 조금 굵게 하는 편이 낫습니다. 16px 이하에서 가는 선은 쪼개져 보이기 시작합니다.',
        '**크고 장식적인 곳은 가볍게.** 48px 이상의 기능 소개 그림이나 빈 화면 아이콘은 선을 가볍게(1~1.5단위) 하거나 `absoluteStrokeWidth`를 써야 둔해 보이지 않습니다.',
        '**제품 전체에 값 하나.** 화면상 선 두께를 하나 정하고 크기별 값은 거기서 계산하세요. 정확한 숫자보다 일관성이 중요합니다.',
      ] },

      { type: 'h2', text: '흔한 실수' },
      { type: 'ul', items: [
        '**채움 아이콘의 선 두께를 조절한다.** stroke가 없으니 아무 일도 일어나지 않습니다. 외곽선 버전으로 바꾸거나, Phosphor라면 다른 굵기를 고르세요.',
        '**prop 이름을 헷갈린다.** Tabler React 컴포넌트는 문서상 `stroke={1.5}`를 쓰고, Lucide와 Heroicons는 `strokeWidth`를 씁니다. 테스트한 Tabler 버전에서는 나머지 props가 `<svg>`로 그대로 전달돼서 `strokeWidth`도 우연히 동작합니다. 하지만 습관처럼 Tabler의 `stroke`에 색 문자열을 넘기면 색은 바뀌지 않습니다. 이 prop은 두께입니다.',
        '**도형마다 값이 있는데 루트에만 지정한다.** 손으로 내보낸 SVG는 path마다 `stroke-width`를 반복하는 경우가 많습니다. 루트 값은 자식에 값이 없을 때만 상속되니, 도형에 CSS 규칙을 걸어 덮어쓰세요.',
        '**아이콘을 “날카롭게” 하려고 끝 모양을 바꾼다.** `stroke-linecap`을 round에서 butt로 바꾸면 짧은 획이 가늘고 고르지 않게 보입니다. 라이브러리 그림 자체가 둥근 끝을 전제로 디자인됐기 때문입니다.',
        '**`transform: scale()`로 크기를 바꾼다.** CSS transform은 선을 포함한 렌더링 전체를 키우고, 레이아웃 상자는 원래 크기로 남겨 둡니다. 위의 선 두께 계산이 그대로 통하도록 크기는 `width`와 `height`로 바꾸세요.',
      ] },

      { type: 'h2', text: '자주 묻는 질문' },
      { type: 'p', text: '**stroke-width는 픽셀 단위인가요?** 24단위 아이콘을 24px로 보여 줄 때처럼 viewBox 크기와 렌더링 크기가 같을 때만 그렇습니다. 나머지 경우엔 viewBox 단위이고, 그 비율만큼 늘거나 줄어듭니다.' },
      { type: 'p', text: '**채움 아이콘을 더 가늘게 만들 수 있나요?** `stroke-width`로는 안 됩니다. 더 가벼운 Phosphor 굵기나 아이콘의 외곽선 버전처럼 다른 그림이 필요합니다.' },
      { type: 'p', text: '**안전한 최댓값은 얼마인가요?** 그림이 가장자리에 얼마나 가까운지에 달렸습니다. Lucide 하트처럼 가장자리에서 2단위 안까지 오는 도형이라면, 넘침을 허용하지 않는 한 4를 넘으면 잘립니다. 쓰려는 굵기로 가장 크고 가장자리에 붙은 아이콘들을 직접 확인해 보세요.' },
      { type: 'p', text: '**정리:** 화면에서 원하는 선 두께를 먼저 정하고, 쓰는 크기마다 단위로 환산해서 프로젝트의 모든 라이브러리에 적용하세요. 여러 세트에서 가져온 아이콘도 한 가족처럼 보이게 됩니다.' },
    ],
  },
};
