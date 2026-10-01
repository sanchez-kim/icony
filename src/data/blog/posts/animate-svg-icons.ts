import type { BlogPost } from '../types';

const IMG_VS_INLINE = `<!-- Only the box can move: CSS can rotate or fade the <img> itself -->
<img class="spin" src="/icons/loader.svg" alt="" width="24" height="24">

<!-- Every shape is reachable: stroke, dash offset, per-path timing -->
<svg class="icon draw" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="10" />
  <path d="m9 12 2 2 4-4" />
</svg>`;

const HOVER_CSS = `.icon-btn svg {
  transition: transform 180ms ease-out, color 180ms ease-out;
}
.icon-btn:hover svg,
.icon-btn:focus-visible svg {
  transform: translateX(3px);        /* arrow nudges forward */
  color: #4f46e5;
}
.icon-btn:active svg {
  transform: translateX(1px) scale(0.95);
  transition-duration: 60ms;         /* press feels immediate */
}`;

const SPIN_HTML = `<!-- lucide-react 0.460 LoaderCircle: a 3/4 arc on a 24×24 grid -->
<svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" aria-hidden="true">
  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
</svg>`;

const SPIN_CSS = `.spinner {
  animation: spin 0.8s linear infinite;   /* linear: no speed-up/slow-down */
}
@keyframes spin { to { transform: rotate(360deg); } }`;

const ORIGIN_CSS = `/* Rotating a shape INSIDE the SVG (e.g. a gear in a larger icon) */
.icon .gear {
  transform-box: fill-box;      /* measure the origin from the shape itself */
  transform-origin: center;
  animation: spin 2s linear infinite;
}

/* Swinging a bell from its top edge: rotate the whole <svg> */
.bell:hover svg {
  transform-origin: 50% 10%;
  animation: ring 0.6s ease-in-out;
}
@keyframes ring {
  0%, 100% { transform: rotate(0); }
  20% { transform: rotate(14deg); }
  40% { transform: rotate(-12deg); }
  60% { transform: rotate(8deg); }
  80% { transform: rotate(-4deg); }
}`;

const DRAW_HTML = `<svg class="icon draw" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10" pathLength="1" />
  <path d="m9 12 2 2 4-4" pathLength="1" />
</svg>`;

const DRAW_CSS = `.draw > * {
  stroke-dasharray: 1;          /* one dash as long as the whole shape */
  stroke-dashoffset: 1;         /* shifted fully out of view */
  animation: draw 600ms ease-out forwards;
}
.draw > :nth-child(2) { animation-delay: 450ms; }  /* check after circle */

@keyframes draw { to { stroke-dashoffset: 0; } }`;

const DRAW_JS = `// For icons rendered by a component library, where you can't add
// pathLength in the markup: normalise every drawable shape at runtime.
const SHAPES = 'path, circle, rect, line, polyline, polygon, ellipse';

export function prepareDraw(svg) {
  svg.querySelectorAll(SHAPES).forEach((el, i) => {
    el.setAttribute('pathLength', '1');
    el.style.setProperty('--i', String(i));   // index for staggering
  });
}`;

const DRAW_JS_CSS = `.draw :is(path, circle, rect, line, polyline, polygon, ellipse) {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 500ms ease-out forwards;
  animation-delay: calc(var(--i, 0) * 120ms);
}`;

const REACT_DRAW = `import { useEffect, useRef } from 'react';
import { CircleCheck } from 'lucide-react';
import { prepareDraw } from './prepareDraw';

export function SuccessMark() {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) prepareDraw(ref.current);
  }, []);
  // lucide-react forwards the ref and className to the <svg>
  return <CircleCheck ref={ref} className="draw" aria-hidden="true" />;
}`;

const SWAP_HTML = `<button class="menu-toggle" aria-expanded="false" aria-label="Menu">
  <svg class="i-open"  …><!-- menu (three lines) --></svg>
  <svg class="i-close" …><!-- x --></svg>
</button>`;

const SWAP_CSS = `.menu-toggle { display: grid; }
.menu-toggle svg {
  grid-area: 1 / 1;                     /* stack both icons in one cell */
  transition: opacity 150ms, transform 200ms ease-out;
}
.menu-toggle .i-close { opacity: 0; transform: rotate(-90deg); }
.menu-toggle[aria-expanded="true"] .i-open  { opacity: 0; transform: rotate(90deg); }
.menu-toggle[aria-expanded="true"] .i-close { opacity: 1; transform: none; }`;

const REDUCED_CSS = `@media (prefers-reduced-motion: reduce) {
  /* Decorative motion: remove it */
  .draw > *, .draw :is(path, circle, rect, line, polyline, polygon, ellipse) {
    animation: none;
    stroke-dashoffset: 0;               /* show the finished drawing */
  }
  .bell:hover svg { animation: none; }
  .icon-btn svg, .menu-toggle svg { transition-duration: 0.01ms; }

  /* Status motion: keep the signal, lose the spin */
  .spinner { animation: pulse 1.6s ease-in-out infinite; }
}
@keyframes pulse { 50% { opacity: 0.4; } }`;

export const post: BlogPost = {
  slug: 'animate-svg-icons',
  category: 'how-to',
  readingMinutes: 8,
  published: '2026-06-16',
  updated: '2026-09-30',
  related: ['change-svg-icon-color', 'svg-to-react-component', 'add-icons-to-website'],
  title: { en: 'How to Animate SVG Icons with CSS', ko: 'CSS로 SVG 아이콘 애니메이션 넣기' },
  description: {
    en: 'Hover nudges, spinners, bell swings, icon swaps and the line-drawing effect in plain CSS, plus why the classic dasharray trick mistimes and how pathLength fixes it.',
    ko: '호버 반응, 스피너, 종 흔들기, 아이콘 전환, 라인 드로잉을 순수 CSS로. 흔히 쓰는 dasharray 기법의 타이밍이 어긋나는 이유와 pathLength로 고치는 법까지.',
  },
  metaTitle: { en: 'How to Animate SVG Icons with CSS | Icony', ko: 'CSS로 SVG 아이콘 애니메이션 만들기 | Icony' },
  metaDescription: {
    en: 'Animate SVG icons with CSS: hover transitions, spinners, transform-origin fixes, icon swaps and a line-drawing effect that times correctly with pathLength. Includes reduced-motion handling.',
    ko: 'CSS로 SVG 아이콘 애니메이션 만들기: 호버 트랜지션, 스피너, transform-origin 문제 해결, 아이콘 전환, pathLength로 타이밍을 맞춘 라인 드로잉, reduced motion 대응까지.',
  },
  blocks: {
    en: [
      { type: 'p', text: 'Icon animation is mostly small stuff: an arrow that nudges forward on hover, a spinner, a checkmark that draws itself after a save. All of it can be done in CSS without a library. What usually goes wrong is something specific: the icon rotates around the wrong point, the draw effect finishes in the first quarter of its duration and then sits idle, or the effect does nothing because it targets `path` and the icon is built from circles and lines. This guide covers the techniques and those failure points.' },

      { type: 'h2', text: 'Rule one: the markup must be in the DOM' },
      { type: 'p', text: 'CSS can style only elements it can select. An SVG loaded through `<img>` or `background-image` is a sealed image. You can still move, rotate or fade the box it sits in, which is enough for a spinner, but you can’t reach its paths. For stroke colors, dash offsets or per-shape timing, the SVG has to be inline: pasted markup, an SVGR import, or an icon component such as `lucide-react` that renders a real `<svg>`.' },
      { type: 'code', lang: 'html', code: IMG_VS_INLINE },

      { type: 'h2', text: 'Know what your icon is made of' },
      { type: 'p', text: 'Before writing selectors, check the shapes inside the icon. We counted the elements in the icon data shipped with two popular sets:' },
      { type: 'ul', items: [
        '**Lucide (lucide-react 0.460):** 1,539 icons built from 5,363 shapes of seven types: 4,180 `path`, 444 `circle`, 366 `rect`, 276 `line`, 74 `polyline`, 15 `polygon` and 8 `ellipse`. Only 155 icons consist of a single element.',
        '**Tabler outline (@tabler/icons 3.36):** 4,985 icons, and the node data contains nothing but `path` elements (plus two `g` groups).',
        '**Phosphor:** every weight is a filled shape with no stroke, so stroke-based effects (drawing, dash animations) don’t apply. Animate transform, opacity or color instead.',
      ] },
      { type: 'p', text: 'The practical consequence is that a selector like `.draw path` works for every Tabler icon but misses the circle in Lucide’s `CircleCheck` and the rectangles in its calendar icons. Target all drawable shapes with `:is(path, circle, rect, line, polyline, polygon, ellipse)`.' },

      { type: 'h2', text: 'Hover and press feedback' },
      { type: 'p', text: 'The most useful icon animation is also the simplest: a short transition when the control it belongs to is hovered, focused or pressed. Put the trigger on the control and the transition on the icon, and include `:focus-visible` so keyboard users get the same feedback:' },
      { type: 'code', lang: 'css', code: HOVER_CSS },
      { type: 'p', text: 'Keep these effects between roughly 100 and 250ms. Anything longer starts to feel like lag on an element people click repeatedly. Prefer `transform` and `opacity`: browsers can usually animate them without re-running layout, and they don’t move surrounding text. Animating `width`, `height` or `margin` on an inline icon shifts the words next to it.' },

      { type: 'h2', text: 'Spinners' },
      { type: 'p', text: 'A loading spinner is one keyframe. Use an icon that is already asymmetric, such as an open arc, so the rotation is visible, and use `linear` timing so it doesn’t speed up and slow down on every turn:' },
      { type: 'code', lang: 'html', code: SPIN_HTML },
      { type: 'code', lang: 'css', code: SPIN_CSS },
      { type: 'p', text: 'Rotating the root `<svg>` is safe: it is laid out like an inline box, so its default `transform-origin` is its center. Most “my icon wobbles when it spins” reports come from rotating something else.' },

      { type: 'h2', text: 'Transform origin: the most common bug' },
      { type: 'p', text: 'Elements inside an SVG (a `<path>`, a `<g>`) don’t use their own bounding box as the reference for transforms. By default the origin is the top-left of the SVG’s coordinate system, so `rotate()` on a path swings it around the icon’s corner, and `scale()` pulls it toward that corner. Use `transform-box: fill-box` to measure from the shape’s own bounds, then set the origin relative to that. For swinging motions (a bell, a hanging tag), move the origin to the pivot point:' },
      { type: 'code', lang: 'css', code: ORIGIN_CSS },
      { type: 'p', text: 'Lucide’s bell has its body at the top and the clapper as a separate path at the bottom. Swinging the whole icon from a point near the top looks right because the artwork hangs from there. Pick the origin by looking at the drawing, not by default.' },

      { type: 'h2', text: 'The line-drawing effect, done correctly' },
      { type: 'p', text: 'The draw-in effect uses two stroke properties. `stroke-dasharray` turns the line into dashes and gaps, and `stroke-dashoffset` slides that pattern along the path. If a single dash is as long as the path and it’s offset by that same length, the line starts invisible, and animating the offset to zero draws it.' },
      { type: 'p', text: 'Most tutorials use a fixed value such as 100 for both. That works, but it wastes most of the animation. The lengths involved are far shorter. Computed from the path data:' },
      { type: 'ul', items: [
        'Lucide `Check` (`M20 6 9 17l-5-5`): 15.56 + 7.07 = **22.6 units**.',
        'Tabler `IconCheck` (`M5 12l5 5l10 -10`): 7.07 + 14.14 = **21.2 units**.',
        'Heroicons outline `CheckIcon`: 8.49 + 16.22 = **24.7 units**.',
        'Lucide `CircleCheck`: the circle is 2π × 10 = **62.8 units**, the check inside only **8.5**.',
      ] },
      { type: 'p', text: 'With `dasharray: 100` the visible length at offset d is min(100 − d, path length). For the 22.6-unit Lucide check that means it is fully drawn once the offset reaches about 77, so with a 1-second linear animation it finishes after roughly the first 23% and then sits fully drawn and idle for the remaining 77%. Most of the timing is wasted, and the effect feels rushed. On `CircleCheck` the circle and the check finish at completely different times. The fix is the `pathLength` attribute: it tells the browser to treat the shape’s length as whatever number you give, so every shape measures 1 and the same CSS works for all of them. It’s part of SVG 2 and applies to every shape element; as with any SVG feature, check it in the browsers you support, and fall back to measured lengths if a shape misbehaves:' },
      { type: 'code', lang: 'html', code: DRAW_HTML },
      { type: 'code', lang: 'css', code: DRAW_CSS },
      { type: 'tip', text: 'A circle’s stroke starts at its rightmost point (3 o’clock). If you want the ring to draw from the top, rotate the circle by -90deg with `transform-box: fill-box` and `transform-origin: center`, as in the transform-origin section.' },
      { type: 'p', text: 'When the icon comes from a component library, you can’t add `pathLength` to its internal shapes in JSX. Add it at runtime instead. The helper below also stores each shape’s index in a custom property so the shapes draw one after another:' },
      { type: 'code', lang: 'js', code: DRAW_JS },
      { type: 'code', lang: 'css', code: DRAW_JS_CSS },
      { type: 'code', lang: 'tsx', code: REACT_DRAW },
      { type: 'p', text: 'If you prefer real lengths (to keep the drawing speed constant across icons of different sizes), read them with `element.getTotalLength()`, which works on every SVG shape element, and set the dasharray and offset to that value instead.' },

      { type: 'h2', text: 'Swapping between two icons' },
      { type: 'p', text: 'Menu-to-close, play-to-pause and copy-to-check transitions are usually two icons cross-faded, not one icon morphed. Morphing paths needs matching point structures, which unrelated icons don’t have. Stack both icons in the same grid cell and let the control’s state drive them:' },
      { type: 'code', lang: 'html', code: SWAP_HTML },
      { type: 'code', lang: 'css', code: SWAP_CSS },
      { type: 'p', text: 'Tying the animation to `aria-expanded` has a useful side effect: the visual state can’t drift out of sync with what screen readers announce, because both come from the same attribute.' },

      { type: 'h2', text: 'Respect reduced motion without breaking meaning' },
      { type: 'p', text: 'Operating systems let people ask for less motion, and CSS exposes it through `prefers-reduced-motion`. The common snippet turns every animation off, but it’s worth separating decorative motion from motion that carries information. A draw-in is decoration: skip it and show the finished icon. A spinner tells the user something is happening: replace the rotation with a gentle opacity pulse instead of freezing it, or it looks like the page has stalled.' },
      { type: 'code', lang: 'css', code: REDUCED_CSS },
      { type: 'p', text: 'Also avoid anything that flashes more than three times a second. WCAG 2.3.1 sets that threshold for content that could trigger seizures, and a fast-blinking notification badge can cross it.' },

      { type: 'h2', text: 'Common mistakes' },
      { type: 'ul', items: [
        '**Animating a filled icon’s stroke.** Heroicons solid, Bootstrap, Radix and Phosphor have no stroke to draw. Use scale, opacity or color.',
        '**Forgetting `forwards`.** Without `animation-fill-mode: forwards`, a drawn icon snaps back to invisible when the animation ends.',
        '**Selecting only `path`.** Lucide uses seven shape types; the circle, rectangle or line you missed will sit there fully drawn while the rest animates.',
        '**Hovering the icon instead of the control.** The icon is a small target. Trigger the effect from the button or link so the whole hit area responds.',
        '**Rotating inner shapes without `transform-box`.** The shape orbits the icon’s top-left corner instead of turning in place.',
        '**Endless decorative loops.** A bouncing icon that never stops competes with the content. Loop only things that represent ongoing state.',
      ] },

      { type: 'h2', text: 'When CSS isn’t enough' },
      { type: 'p', text: 'Reach for a JavaScript animation library (Motion, GSAP) or a Lottie file when you need to sequence many steps with interruptions, respond to scroll or drag position, or morph between shapes. For hover states, spinners, draw-ins and swaps, CSS is smaller, has no dependency, and is easier for the next developer to read.' },
      { type: 'p', text: 'If you start from an exported icon, for example a recolored SVG copied from Icony, keep in mind that the export hard-codes the color and size you chose. For animated UI icons, swap the hex for `currentColor` and remove the fixed `width` and `height` so your CSS controls both.' },
      { type: 'p', text: '**Takeaway:** inline the icon, animate `transform` and `opacity` for interaction, use `transform-box: fill-box` for anything inside the SVG, normalize drawn shapes with `pathLength="1"`, and design a reduced-motion version rather than just switching animation off.' },
    ],
    ko: [
      { type: 'p', text: '아이콘 애니메이션은 대부분 작은 것들입니다. 호버하면 살짝 앞으로 밀리는 화살표, 로딩 스피너, 저장이 끝나면 스스로 그려지는 체크 표시 같은 것들이죠. 모두 라이브러리 없이 CSS로 만들 수 있습니다. 문제가 생기는 지점은 대개 정해져 있습니다. 아이콘이 엉뚱한 점을 축으로 돌거나, 드로잉 효과가 재생 시간의 첫 4분의 1 만에 끝나고 나머지 시간은 가만히 있거나, 선택자가 `path`만 겨냥했는데 아이콘은 원과 직선으로 이루어져 있어서 아무 효과가 없는 경우입니다. 이 글은 기법과 함께 이런 실패 지점을 다룹니다.' },

      { type: 'h2', text: '첫 번째 규칙: 마크업이 DOM 안에 있어야 한다' },
      { type: 'p', text: 'CSS는 선택할 수 있는 요소만 스타일링합니다. `<img>`나 `background-image`로 불러온 SVG는 봉인된 이미지입니다. 담긴 상자를 움직이거나 돌리거나 흐리게 할 수는 있어서 스피너 정도는 되지만, 안쪽 path에는 닿지 못합니다. 선 색, 대시 오프셋, 도형별 타이밍을 다루려면 SVG가 인라인이어야 합니다. 마크업을 직접 붙여 넣거나, SVGR로 가져오거나, `lucide-react`처럼 실제 `<svg>`를 렌더링하는 아이콘 컴포넌트를 쓰면 됩니다.' },
      { type: 'code', lang: 'html', code: IMG_VS_INLINE },

      { type: 'h2', text: '아이콘이 무엇으로 이루어졌는지 알기' },
      { type: 'p', text: '선택자를 쓰기 전에 아이콘 안의 도형부터 확인하세요. 많이 쓰는 두 세트의 아이콘 데이터에 든 요소를 세어 봤습니다.' },
      { type: 'ul', items: [
        '**Lucide(lucide-react 0.460):** 아이콘 1,539개가 일곱 종류, 총 5,363개 도형으로 이루어져 있습니다. `path` 4,180개, `circle` 444개, `rect` 366개, `line` 276개, `polyline` 74개, `polygon` 15개, `ellipse` 8개입니다. 요소 하나로만 된 아이콘은 155개뿐입니다.',
        '**Tabler 외곽선(@tabler/icons 3.36):** 아이콘 4,985개이고, 노드 데이터에는 `path` 요소만 있습니다(`g` 그룹 두 개 제외).',
        '**Phosphor:** 모든 굵기가 stroke 없는 채움 도형이라 선 기반 효과(드로잉, 대시 애니메이션)는 적용되지 않습니다. 대신 transform, opacity, 색을 애니메이션하세요.',
      ] },
      { type: 'p', text: '실제로 뜻하는 바는 이렇습니다. `.draw path` 같은 선택자는 Tabler 아이콘에는 모두 통하지만 Lucide `CircleCheck`의 원이나 달력 아이콘의 사각형은 놓칩니다. `:is(path, circle, rect, line, polyline, polygon, ellipse)`로 그릴 수 있는 도형 전체를 겨냥하세요.' },

      { type: 'h2', text: '호버와 누름 반응' },
      { type: 'p', text: '가장 쓸모 있는 아이콘 애니메이션이 가장 단순하기도 합니다. 아이콘이 속한 컨트롤에 호버, 포커스, 누름이 일어날 때의 짧은 트랜지션입니다. 트리거는 컨트롤에, 트랜지션은 아이콘에 두고, 키보드 사용자도 같은 반응을 받도록 `:focus-visible`을 함께 넣으세요.' },
      { type: 'code', lang: 'css', code: HOVER_CSS },
      { type: 'p', text: '이런 효과는 대략 100~250ms 사이로 유지하세요. 반복해서 누르는 요소에서 그보다 길면 지연처럼 느껴집니다. `transform`과 `opacity`를 우선 쓰세요. 브라우저가 대개 레이아웃을 다시 계산하지 않고 애니메이션할 수 있고, 주변 텍스트도 밀어내지 않습니다. 인라인 아이콘의 `width`, `height`, `margin`을 애니메이션하면 옆 글자가 움직입니다.' },

      { type: 'h2', text: '스피너' },
      { type: 'p', text: '로딩 스피너는 키프레임 하나면 됩니다. 회전이 눈에 보이도록 열린 호처럼 비대칭인 아이콘을 쓰고, 한 바퀴마다 빨라졌다 느려지지 않도록 `linear` 타이밍을 쓰세요.' },
      { type: 'code', lang: 'html', code: SPIN_HTML },
      { type: 'code', lang: 'css', code: SPIN_CSS },
      { type: 'p', text: '루트 `<svg>`를 돌리는 건 안전합니다. 인라인 상자처럼 배치되기 때문에 기본 `transform-origin`이 중앙입니다. “돌릴 때 아이콘이 흔들린다”는 문제는 대부분 루트가 아닌 다른 요소를 돌릴 때 생깁니다.' },

      { type: 'h2', text: 'transform-origin: 가장 흔한 버그' },
      { type: 'p', text: 'SVG 안쪽 요소(`<path>`, `<g>`)는 transform의 기준으로 자기 바운딩 박스를 쓰지 않습니다. 기본 기준점이 SVG 좌표계의 왼쪽 위라서, path에 `rotate()`를 주면 아이콘 모서리를 축으로 휘돌고, `scale()`을 주면 그 모서리 쪽으로 끌려갑니다. `transform-box: fill-box`로 도형 자신의 경계를 기준으로 삼은 뒤 그에 맞춰 기준점을 정하세요. 종이나 걸린 태그처럼 흔들리는 동작이라면 기준점을 매달린 지점으로 옮기면 됩니다.' },
      { type: 'code', lang: 'css', code: ORIGIN_CSS },
      { type: 'p', text: 'Lucide의 종 아이콘은 몸통이 위에 있고 추가 아래쪽의 별도 path로 되어 있습니다. 그림이 위에서 매달려 있으니 위쪽 근처를 축으로 아이콘 전체를 흔들어야 자연스럽습니다. 기준점은 기본값이 아니라 그림을 보고 정하세요.' },

      { type: 'h2', text: '라인 드로잉 효과, 제대로 하기' },
      { type: 'p', text: '그려지는 효과는 선 속성 두 개를 씁니다. `stroke-dasharray`는 선을 대시와 간격으로 나누고, `stroke-dashoffset`은 그 패턴을 path를 따라 밀어냅니다. 대시 하나가 path 길이만큼 길고 그 길이만큼 밀려 있으면 선이 보이지 않는 상태로 시작하고, 오프셋을 0으로 애니메이션하면 선이 그려집니다.' },
      { type: 'p', text: '대부분의 튜토리얼은 두 값에 100 같은 고정값을 씁니다. 동작은 하지만 애니메이션의 대부분을 낭비합니다. 실제 길이는 훨씬 짧기 때문입니다. path 데이터로 계산한 값은 이렇습니다.' },
      { type: 'ul', items: [
        'Lucide `Check`(`M20 6 9 17l-5-5`): 15.56 + 7.07 = **22.6단위**.',
        'Tabler `IconCheck`(`M5 12l5 5l10 -10`): 7.07 + 14.14 = **21.2단위**.',
        'Heroicons outline `CheckIcon`: 8.49 + 16.22 = **24.7단위**.',
        'Lucide `CircleCheck`: 원은 2π × 10 = **62.8단위**, 안쪽 체크는 **8.5단위**뿐입니다.',
      ] },
      { type: 'p', text: '`dasharray: 100`이면 오프셋 d에서 보이는 길이는 min(100 − d, path 길이)입니다. 길이 22.6단위인 Lucide 체크는 오프셋이 약 77에 이르면 이미 전부 그려지므로, 1초짜리 linear 애니메이션에서는 처음 약 23% 만에 다 그려지고 나머지 77% 동안은 완성된 채 멈춰 있습니다. 애니메이션 시간 대부분이 낭비되고 효과도 서두르는 느낌이 납니다. `CircleCheck`에서는 원과 체크가 전혀 다른 시점에 끝납니다. 해결책은 `pathLength` 속성입니다. 도형의 길이를 지정한 숫자로 간주하라고 브라우저에 알려 주므로, 모든 도형의 길이를 1로 맞추면 같은 CSS가 전부에 통합니다. SVG 2에 정의된 속성으로 모든 도형 요소에 적용되지만, 다른 SVG 기능과 마찬가지로 지원하는 브라우저에서 확인하고, 특정 도형이 이상하게 동작하면 실제로 잰 길이로 대체하세요.' },
      { type: 'code', lang: 'html', code: DRAW_HTML },
      { type: 'code', lang: 'css', code: DRAW_CSS },
      { type: 'tip', text: '원의 선은 가장 오른쪽 점(3시 방향)에서 시작합니다. 위에서부터 그려지게 하려면 transform-origin 절처럼 `transform-box: fill-box`와 `transform-origin: center`를 주고 원을 -90deg 회전하세요.' },
      { type: 'p', text: '아이콘이 컴포넌트 라이브러리에서 온다면 JSX로 내부 도형에 `pathLength`를 넣을 수 없습니다. 대신 런타임에 넣으세요. 아래 헬퍼는 각 도형의 순서를 커스텀 속성에 저장해서 도형이 하나씩 차례로 그려지게 합니다.' },
      { type: 'code', lang: 'js', code: DRAW_JS },
      { type: 'code', lang: 'css', code: DRAW_JS_CSS },
      { type: 'code', lang: 'tsx', code: REACT_DRAW },
      { type: 'p', text: '크기가 다른 아이콘에서도 그리는 속도를 일정하게 하고 싶어서 실제 길이를 쓰고 싶다면, 모든 SVG 도형 요소에서 동작하는 `element.getTotalLength()`로 길이를 읽고 dasharray와 오프셋을 그 값으로 지정하세요.' },

      { type: 'h2', text: '두 아이콘 사이 전환하기' },
      { type: 'p', text: '메뉴↔닫기, 재생↔일시정지, 복사↔체크 전환은 보통 아이콘 하나를 변형하는 게 아니라 두 아이콘을 교차 페이드합니다. path 모핑은 점 구조가 맞아야 하는데, 서로 관계없는 아이콘은 그렇지 않기 때문입니다. 두 아이콘을 같은 그리드 셀에 겹쳐 두고 컨트롤 상태로 움직이게 하세요.' },
      { type: 'code', lang: 'html', code: SWAP_HTML },
      { type: 'code', lang: 'css', code: SWAP_CSS },
      { type: 'p', text: '애니메이션을 `aria-expanded`에 묶으면 좋은 부수 효과가 있습니다. 화면 상태와 스크린 리더가 읽어 주는 상태가 같은 속성에서 나오니 서로 어긋날 수 없습니다.' },

      { type: 'h2', text: '의미는 지키면서 reduced motion 존중하기' },
      { type: 'p', text: '운영체제에는 움직임을 줄여 달라는 설정이 있고, CSS에서는 `prefers-reduced-motion`으로 확인할 수 있습니다. 흔히 쓰는 스니펫은 애니메이션을 전부 끄지만, 장식용 움직임과 정보를 전달하는 움직임은 나눠서 다루는 게 좋습니다. 드로잉은 장식이니 건너뛰고 완성된 아이콘을 보여 주면 됩니다. 스피너는 무언가 진행 중이라는 신호이므로 멈추지 말고 회전을 부드러운 투명도 깜빡임으로 바꾸세요. 그냥 멈추면 페이지가 멈춘 것처럼 보입니다.' },
      { type: 'code', lang: 'css', code: REDUCED_CSS },
      { type: 'p', text: '1초에 세 번 넘게 번쩍이는 것도 피하세요. WCAG 2.3.1은 발작을 일으킬 수 있는 콘텐츠의 기준을 그렇게 정하고 있고, 빠르게 깜빡이는 알림 배지는 이 기준을 넘을 수 있습니다.' },

      { type: 'h2', text: '흔한 실수' },
      { type: 'ul', items: [
        '**채움 아이콘의 선을 애니메이션한다.** Heroicons solid, Bootstrap, Radix, Phosphor에는 그릴 stroke가 없습니다. 크기, 투명도, 색을 쓰세요.',
        '**`forwards`를 빠뜨린다.** `animation-fill-mode: forwards`가 없으면 다 그려진 아이콘이 애니메이션이 끝나는 순간 다시 사라집니다.',
        '**`path`만 선택한다.** Lucide는 도형을 일곱 종류나 씁니다. 빠뜨린 원, 사각형, 직선은 나머지가 움직이는 동안 다 그려진 채로 가만히 있습니다.',
        '**컨트롤이 아니라 아이콘에 호버를 건다.** 아이콘은 작은 표적입니다. 버튼이나 링크에서 효과를 발동시켜 클릭 영역 전체가 반응하게 하세요.',
        '**`transform-box` 없이 안쪽 도형을 돌린다.** 제자리에서 도는 대신 아이콘 왼쪽 위 모서리를 축으로 공전합니다.',
        '**끝없이 반복되는 장식 루프.** 멈추지 않고 튀는 아이콘은 콘텐츠와 시선을 다툽니다. 진행 중인 상태를 나타내는 것만 반복하세요.',
      ] },

      { type: 'h2', text: 'CSS로 부족할 때' },
      { type: 'p', text: '중간에 끊길 수 있는 여러 단계를 순서대로 이어야 하거나, 스크롤이나 드래그 위치에 반응해야 하거나, 도형 사이를 모핑해야 한다면 JavaScript 애니메이션 라이브러리(Motion, GSAP)나 Lottie 파일을 쓰세요. 호버 상태, 스피너, 드로잉, 아이콘 전환이라면 CSS가 더 가볍고, 의존성이 없고, 다음 개발자가 읽기도 쉽습니다.' },
      { type: 'p', text: 'Icony에서 색을 입혀 복사한 SVG처럼 내보낸 아이콘에서 시작한다면, 내보낼 때 고른 색과 크기가 파일에 고정돼 있다는 점을 기억하세요. 애니메이션할 UI 아이콘이라면 HEX를 `currentColor`로 바꾸고 고정된 `width`와 `height`를 지워서 둘 다 CSS가 제어하게 하세요.' },
      { type: 'p', text: '**정리:** 아이콘은 인라인으로 넣고, 상호작용에는 `transform`과 `opacity`를 애니메이션하고, SVG 안쪽 요소에는 `transform-box: fill-box`를 쓰고, 그리는 도형은 `pathLength="1"`로 길이를 맞추고, 애니메이션을 그냥 끄는 대신 reduced motion용 버전을 따로 설계하세요.' },
    ],
  },
};
