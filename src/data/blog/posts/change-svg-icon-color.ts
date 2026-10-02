import type { BlogPost } from '../types';

const LIB_MARKUP = `<!-- Lucide (lucide-react 0.460): paint on the <svg>, stroke only -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" …>
  <path d="M20 6 9 17l-5-5"></path>
</svg>

<!-- Heroicons solid (2.2.0): paint on the <svg>, fill only -->
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" …>
  <path fill-rule="evenodd" d="…"></path>
</svg>

<!-- Radix (1.3.2): the root says fill="none"; the PATH carries the color -->
<svg viewBox="0 0 15 15" fill="none" …>
  <path d="…" fill="currentColor" fill-rule="evenodd"></path>
</svg>

<!-- Phosphor (2.1.10): every weight, even "thin", is a filled shape -->
<svg viewBox="0 0 256 256" fill="currentColor" …>
  <path d="…"></path>
</svg>`;

const CURRENT_COLOR = `/* The icon inherits the text color of whatever it sits in */
.btn        { color: #1f2937; }
.btn:hover  { color: #2563eb; }   /* icon and label change together */
.btn-danger { color: #b91c1c; }

/* Dark mode comes for free: flip the text color, icons follow */
@media (prefers-color-scheme: dark) {
  .btn { color: #e5e7eb; }
}`;

const FILL_STROKE = `/* Stroke-based sets (Lucide, Tabler outline, Heroicons outline) */
.icon-outline { stroke: #2563eb; }

/* Fill-based sets (Heroicons solid, Phosphor, Bootstrap) */
.icon-solid { fill: #2563eb; }

/* Radix and other icons that put fill on the <path>:
   styling the <svg> is not enough, target the shape itself */
.icon-radix path { fill: #2563eb; }`;

const TABLER_TRAP = `<!-- A raw file from @tabler/icons (icons/outline/check.svg) -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" …>
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>  <!-- invisible 24×24 box -->
  <path d="M5 12l5 5l10 -10" />
</svg>

/* This rule overrides fill="none" on BOTH paths —
   the invisible bounding box turns into a solid blue square */
.icon path { fill: #2563eb; }

/* Safer: only touch shapes that are meant to be painted */
.icon path:not([fill="none"]) { fill: #2563eb; }`;

const SED_REPLACE = `# Replace a hard-coded black with currentColor in every SVG in a folder
# macOS (BSD sed needs the empty '' after -i):
sed -i '' 's/#000000/currentColor/g; s/#000"/currentColor"/g' icons/*.svg

# Linux (GNU sed):
sed -i 's/#000000/currentColor/g; s/#000"/currentColor"/g' icons/*.svg

# Check what is left before you commit
grep -l 'fill="#' icons/*.svg`;

const MASK_CSS = `/* Recolor an SVG you can only reference by URL (img-style usage) */
.icon-mask {
  width: 24px;
  height: 24px;
  background-color: currentColor;          /* the color you actually see */
  -webkit-mask: url(/icons/check.svg) center / contain no-repeat;
          mask: url(/icons/check.svg) center / contain no-repeat;
}

<!-- markup: an empty element, labelled if it carries meaning -->
<span class="icon-mask" aria-hidden="true"></span>`;

const DUOTONE_CSS = `/* Phosphor duotone renders two paths; the back one has opacity="0.2" */
.icon-duo            { color: #4f46e5; }       /* main outline */
.icon-duo path[opacity] {
  fill: #f59e0b;                                /* accent fill */
  opacity: 1;                                   /* drop the built-in 20% */
}`;

const SPRITE_CSS = `<!-- In the sprite: leave the base color to currentColor,
     expose the accent through a custom property -->
<symbol id="icon-badge" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="9" fill="currentColor" />
  <path d="M8 12l3 3 5-6" fill="none" stroke-width="2"
        style="stroke: var(--icon-accent, white)" />
</symbol>

<!-- At the call site: inherited properties reach inside <use> -->
<svg class="icon" style="color: #16a34a; --icon-accent: #fff">
  <use href="#icon-badge" />
</svg>`;

export const post: BlogPost = {
  slug: 'change-svg-icon-color',
  category: 'how-to',
  readingMinutes: 8,
  published: '2026-02-26',
  updated: '2026-10-02',
  related: ['animate-svg-icons', 'svg-to-react-component', 'fix-blurry-svg-icons'],
  title: {
    en: 'How to Change the Color of an SVG Icon',
    ko: 'SVG 아이콘 색상 바꾸는 방법',
  },
  description: {
    en: 'Why some SVG icons ignore your CSS, and how to recolor any of them: currentColor, fill vs stroke, specificity, masks for <img> icons, duotone and sprites.',
    ko: '어떤 SVG 아이콘은 왜 CSS를 무시할까요? currentColor, fill과 stroke, 우선순위, <img> 아이콘용 마스크, 듀오톤과 스프라이트까지 색 바꾸는 법을 정리했습니다.',
  },
  metaTitle: {
    en: 'How to Change the Color of an SVG Icon (and Why It Fails) | Icony',
    ko: 'SVG 아이콘 색상 바꾸는 법 (안 바뀌는 이유까지) | Icony',
  },
  metaDescription: {
    en: 'Recolor SVG icons with currentColor, fill or stroke, CSS masks and sprites. Real markup from Lucide, Heroicons, Radix, Phosphor and Tabler, plus the traps that stop color changes.',
    ko: 'currentColor, fill/stroke, CSS 마스크, 스프라이트로 SVG 아이콘 색을 바꾸는 법. Lucide·Heroicons·Radix·Phosphor·Tabler 실제 마크업과 색이 안 바뀌는 함정까지.',
  },
  blocks: {
    en: [
      { type: 'p', text: 'When an SVG icon refuses to change color, the CSS is usually fine. What decides which approach works are two things you can’t see from the outside: **where the icon keeps its paint** (a `fill` or a `stroke`, on the root `<svg>` or on each shape) and **how the icon got onto the page** (inline markup, an `<img>` tag, a CSS background, or a sprite reference).' },
      { type: 'p', text: 'We’ll answer those two questions first, then go through each technique and the traps that make it look like nothing happened.' },

      { type: 'h2', text: 'Step 1: look at where the paint lives' },
      { type: 'p', text: 'Open the icon in your editor or in the browser’s element inspector before writing any CSS. The snippet below is trimmed from what four popular React icon packages actually render (we rendered each with `react-dom/server` at the versions noted). They look alike, but they don’t recolor the same way:' },
      { type: 'code', lang: 'html', code: LIB_MARKUP },
      { type: 'ul', items: [
        '**Lucide, Tabler outline, Heroicons outline** draw with strokes. `fill` is `none`, so setting `fill` does nothing visible; the color is in `stroke`.',
        '**Heroicons solid, Bootstrap Icons, Tabler filled** are fills on the root element. `fill` works, `stroke` does nothing.',
        '**Radix Icons** set `fill="none"` on the `<svg>` and put `fill="currentColor"` on the `<path>`. Keep that in mind for later.',
        '**Phosphor** is filled at every weight. Its “thin” and “light” styles look like line icons but are outlined shapes, so `stroke` rules have nothing to act on.',
      ] },
      { type: 'p', text: 'All of these default to `currentColor`, so the first method below works on every one of them without you knowing the details.' },

      { type: 'h2', text: 'Method 1: set color and let currentColor do the work' },
      { type: 'p', text: '`currentColor` is a CSS keyword that resolves to the element’s computed `color` value. An inline SVG whose paint is `currentColor` inherits the text color of its parent, like a glyph in a font. You never style the icon directly; you style the text around it:' },
      { type: 'code', lang: 'css', code: CURRENT_COLOR },
      { type: 'p', text: 'Make this your default. Hover, focus, disabled and dark-mode states are already defined for your text, and the icons pick them up with no extra rules.' },
      { type: 'p', text: 'Component libraries in React work the same way. `<Check className="text-red-600" />` works in Tailwind because the class sets `color` and the icon’s stroke is `currentColor`.' },
      { type: 'tip', text: 'currentColor only works when the SVG is part of the DOM: inline markup, a React/Vue component, or a `<use>` reference. An `<img src="icon.svg">` is a separate document and never sees your page’s `color`. For that case, use the mask technique below.' },

      { type: 'h2', text: 'Method 2: set fill or stroke directly' },
      { type: 'p', text: 'Sometimes you want an icon to have its own color independent of the text, for example a green check inside a gray sentence. Then you set the paint property itself, and you have to pick the right one:' },
      { type: 'code', lang: 'css', code: FILL_STROKE },
      { type: 'p', text: 'Two rules explain almost every “my CSS is ignored” report:' },
      { type: 'ol', items: [
        '**Presentation attributes lose to CSS.** An attribute such as `fill="#000"` counts as the lowest-priority author style, so any stylesheet rule that matches the element wins, even a plain `svg { fill: red }`. An inline `style="fill: #000"` is different: it beats your stylesheet unless you use `!important`.',
        '**Inheritance loses to anything set on the element itself.** Setting `fill` on the `<svg>` only reaches children that don’t declare their own `fill`. Radix paths declare `fill="currentColor"`, so `.icon { fill: blue }` on the root has no visible effect, while `.icon { color: blue }` or `.icon path { fill: blue }` works.',
      ] },

      { type: 'h2', text: 'The Tabler bounding-box trap' },
      { type: 'p', text: 'The raw SVG files shipped in the `@tabler/icons` package (as opposed to the React components, which omit it) start with an invisible path that spans the full 24×24 canvas. It’s there so design tools keep the artboard size, and it causes no trouble until you write a broad selector:' },
      { type: 'code', lang: 'css', code: TABLER_TRAP },
      { type: 'p', text: '`stroke` has the same problem: a rule like `.icon path { stroke: red }` overrides `stroke="none"` and draws a square border around the icon. If you copy raw files from any library, check for helper shapes like this or scope your selectors to shapes that are actually painted.' },

      { type: 'h2', text: 'Method 3: change the color in the file' },
      { type: 'p', text: 'Icons exported from Figma, Illustrator or stock sites usually have colors written into every shape (`fill="#000000"`). CSS can still override attributes, but when the file is used through `<img>`, or when you want the icon to follow `currentColor` everywhere, it’s cleaner to fix the source.' },
      { type: 'p', text: 'For a single file, find and replace the hex value. For a folder, a one-line `sed` does it:' },
      { type: 'code', lang: 'bash', code: SED_REPLACE },
      { type: 'p', text: 'Look before you replace. Multi-color icons (flags, brand logos, illustrations) use different colors on purpose, and replacing all of them with `currentColor` flattens the artwork into a single-color silhouette.' },
      { type: 'p', text: 'Also watch for `fill="none"` and `fill="white"` used as cut-outs. A `white` shape inside a dark one often acts as negative space and should stay as it is, or become `transparent` if the background must show through.' },

      { type: 'h2', text: 'Icons you can only reference by URL' },
      { type: 'p', text: 'An SVG in `<img>`, in `background-image`, or in a CSS `content: url()` is rendered as an isolated image. No page CSS reaches inside it, so neither `color` nor `fill` works. You have three options:' },
      { type: 'ul', items: [
        '**Inline it** (or import it as a component with SVGR). It’s the most flexible option and the only one that lets you style individual shapes.',
        '**Use it as a CSS mask.** The SVG only supplies the shape; the element’s `background-color` supplies the color. Set that to `currentColor` and the icon follows the text color again:',
      ] },
      { type: 'code', lang: 'css', code: MASK_CSS },
      { type: 'ul', items: [
        '**Ship one file per color.** Do this for email templates, favicons and other places that can’t run CSS masks or inline SVG. Generate the variants rather than hand-editing them.',
      ] },
      { type: 'p', text: 'A mask renders the silhouette in one flat color, so a multi-color SVG loses its internal colors. Masks also hide the image from assistive technology, so if the icon means something, label the element (see our accessible icons guide).' },

      { type: 'h2', text: 'Two colors: duotone icons and sprites' },
      { type: 'p', text: 'Phosphor’s duotone weight renders two paths: the main shape and a background shape marked `opacity="0.2"`. Both use `currentColor`, which is why duotone icons come out as one hue at two strengths. To make the accent a different color, target the background layer by its attribute:' },
      { type: 'code', lang: 'css', code: DUOTONE_CSS },
      { type: 'p', text: 'Sprites (`<symbol>` + `<use>`) add a wrinkle: the shapes are cloned into a shadow tree, so selectors in your stylesheet can’t reach individual paths. Inherited properties still flow in, including `color` and CSS custom properties. Build the symbol around those two hooks:' },
      { type: 'code', lang: 'html', code: SPRITE_CSS },

      { type: 'h2', text: 'Pick a color that stays visible' },
      { type: 'p', text: 'WCAG 2.1 success criterion 1.4.11 (Non-text Contrast) asks for at least a **3:1** contrast ratio for graphics needed to understand the content. That covers icons that carry meaning or act as buttons.' },
      { type: 'p', text: 'Common UI palette colors can fall short on white. We ran the eight preset swatches in Icony’s color picker through the WCAG relative-luminance formula:' },
      { type: 'ul', items: [
        'On white (#FFFFFF): black 21.0, purple #8B5CF6 4.23, red #EF4444 3.76, blue #3B82F6 3.68, pink #EC4899 3.53 all pass; **green #10B981 (2.54) and yellow #F59E0B (2.15) fail**.',
        'On a dark gray background (#111827): every preset except black passes, ranging from purple at 4.19 to white at 17.74.',
      ] },
      { type: 'p', text: 'The usual fix is a darker shade of the same hue for light themes (and a lighter shade for dark themes). That’s one more reason to drive icon color through `color` and a theme variable instead of a hard-coded fill.' },

      { type: 'h2', text: 'Recolored exports and copied code' },
      { type: 'p', text: 'Visual tools that recolor icons for you have to write the color somewhere, and that usually means a hex value in an attribute. Icony’s exporter, for example, renders each library’s own React component with your chosen color. A Lucide or Tabler export comes out with `stroke="#EF4444"` on the root, Phosphor and Bootstrap get `fill="#EF4444"`, and Radix gets it on the path.' },
      { type: 'p', text: 'That’s what you want for a PNG, a slide or a design handoff. If you paste the SVG or the generated React component into an app that has themes, replace the hex with `currentColor` once, and the icon follows your CSS from then on.' },

      { type: 'h2', text: 'Troubleshooting: the color won’t change' },
      { type: 'ol', items: [
        'Is the SVG inline? If it’s an `<img>` or a background, page CSS can’t reach it. Inline it or use a mask.',
        'Are you setting the right property? Outline icons need `stroke` or `color`; filled icons need `fill` or `color`.',
        'Is the paint on the child shapes? Target `svg path` (and `circle`, `rect`, `line` for Lucide, which uses all of them) instead of the root.',
        'Is there an inline `style` attribute? It beats your stylesheet; remove it or use `!important` as a last resort.',
        'Did the whole square fill in? You hit a helper path such as Tabler’s bounding box. Narrow the selector.',
        'Does the color look washed out? Check for an `opacity` or `fill-opacity` attribute on the shape.',
      ] },

      { type: 'h2', text: 'Quick answers' },
      { type: 'p', text: '**Can I change an SVG’s color with only CSS if it’s in an `<img>` tag?** Not its internal colors. You can mask it (one flat color) or apply CSS `filter`, but filter chains only approximate a target hex and are hard to maintain.' },
      { type: 'p', text: '**Should I use `fill` or `color`?** Use `color` when the icon should match the surrounding text, which is the usual case. Use `fill` or `stroke` when the icon needs its own color and you know which of the two it uses.' },
      { type: 'p', text: '**Why does my icon turn black when I open the file on its own?** With no parent text color, `currentColor` falls back to the default text color, which is black. That’s expected and doesn’t affect the icon on your page.' },
      { type: 'p', text: 'Inline the icon, make sure its paint is `currentColor`, and set `color`. Almost every other technique is a fallback for when one of those three conditions can’t be met.' },
    ],
    ko: [
      { type: 'p', text: 'SVG 아이콘 색이 안 바뀔 때 CSS 자체가 틀린 경우는 드뭅니다. 겉으로는 보이지 않는 두 가지가 어떤 방법이 먹힐지를 정하기 때문입니다.' },
      { type: 'p', text: '하나는 **아이콘이 색을 어디에 칠해 두었는가**(`fill`인지 `stroke`인지, 루트 `<svg>`인지 개별 도형인지)이고, 다른 하나는 **아이콘을 페이지에 어떻게 넣었는가**(인라인 마크업, `<img>` 태그, CSS 배경, 스프라이트 참조)입니다. 이 글은 이 두 질문에서 출발해 방법별 사용법을 보고 CSS를 분명히 적용했는데도 아무 변화가 없어 보이게 만드는 함정까지 다룹니다.' },

      { type: 'h2', text: '1단계: 색이 어디에 칠해져 있는지 확인하기' },
      { type: 'p', text: 'CSS를 쓰기 전에 에디터나 브라우저 요소 검사기로 아이콘 마크업부터 여세요. 아래는 많이 쓰는 React 아이콘 패키지 네 개가 실제로 렌더링하는 결과를 줄인 것입니다(표시한 버전에서 `react-dom/server`로 직접 렌더링했습니다). 비슷해 보여도 색을 바꾸는 방법은 저마다 다릅니다.' },
      { type: 'code', lang: 'html', code: LIB_MARKUP },
      { type: 'ul', items: [
        '**Lucide, Tabler 외곽선, Heroicons 외곽선**은 선(stroke)으로 그립니다. `fill`이 `none`이라 `fill`을 지정해도 눈에 띄는 변화가 없고 색은 `stroke`에 있습니다.',
        '**Heroicons solid, Bootstrap Icons, Tabler filled**는 루트 요소의 채움(fill)입니다. `fill`은 먹히고 `stroke`는 소용없습니다.',
        '**Radix Icons**는 `<svg>`에 `fill="none"`을 두고 `<path>`에 `fill="currentColor"`를 둡니다. 이 차이가 뒤에서 중요해집니다.',
        '**Phosphor**는 모든 굵기가 채움 도형입니다. “thin”이나 “light”는 선 아이콘처럼 보이지만 윤곽을 딴 도형이라 `stroke` 규칙이 적용될 대상이 없습니다.',
      ] },
      { type: 'p', text: '다만 이 라이브러리들은 모두 기본값이 `currentColor`입니다. 그래서 아래 첫 번째 방법은 세부 구조를 몰라도 전부에 통합니다.' },

      { type: 'h2', text: '방법 1: color를 지정하고 currentColor에 맡기기' },
      { type: 'p', text: '`currentColor`는 요소의 계산된 `color` 값을 가리키는 CSS 키워드입니다. 칠이 `currentColor`인 인라인 SVG는 폰트 글리프처럼 부모의 글자색을 물려받습니다. 아이콘을 직접 스타일링하지 말고 주변 텍스트를 스타일링하면 됩니다.' },
      { type: 'code', lang: 'css', code: CURRENT_COLOR },
      { type: 'p', text: '기본으로 삼기 좋은 방법입니다. 호버, 포커스, 비활성, 다크 모드 상태는 이미 텍스트에 정의돼 있으니 아이콘은 규칙을 더 쓰지 않아도 그대로 따라옵니다.' },
      { type: 'p', text: 'React 컴포넌트 라이브러리도 같습니다. Tailwind에서 `<Check className="text-red-600" />`가 동작하는 것도 클래스가 `color`를 지정하고 아이콘의 stroke가 `currentColor`이기 때문입니다.' },
      { type: 'tip', text: 'currentColor는 SVG가 DOM 안에 있을 때만 통합니다. 인라인 마크업, React/Vue 컴포넌트, `<use>` 참조가 그렇습니다. `<img src="icon.svg">`는 별개 문서라 페이지의 `color`를 전혀 모르니 아래 마스크 기법을 보세요.' },

      { type: 'h2', text: '방법 2: fill이나 stroke를 직접 지정하기' },
      { type: 'p', text: '아이콘이 텍스트와 상관없이 자기 색을 가져야 할 때도 있습니다. 회색 문장 속 초록 체크 표시 같은 경우죠. 이때는 칠 속성을 직접 지정하는데 둘 중 맞는 쪽을 골라야 합니다.' },
      { type: 'code', lang: 'css', code: FILL_STROKE },
      { type: 'p', text: '“CSS가 무시된다”는 경우는 대부분 다음 두 규칙으로 설명됩니다.' },
      { type: 'ol', items: [
        '**프레젠테이션 속성은 CSS에 진다.** `fill="#000"` 같은 속성은 우선순위가 가장 낮은 작성자 스타일로 취급되므로 요소에 맞는 스타일시트 규칙이 있으면 `svg { fill: red }`처럼 단순한 규칙이라도 이깁니다. 인라인 `style="fill: #000"`은 다릅니다. `!important`를 쓰지 않는 한 스타일시트를 이깁니다.',
        '**상속은 요소 자신에게 지정된 값에 진다.** `<svg>`에 `fill`을 주면 자기 `fill`이 없는 자식에게만 전달됩니다. Radix의 path는 `fill="currentColor"`를 직접 갖고 있어서 루트에 `.icon { fill: blue }`를 줘도 보이는 변화가 없습니다. 대신 `.icon { color: blue }`나 `.icon path { fill: blue }`는 먹힙니다.',
      ] },

      { type: 'h2', text: 'Tabler 바운딩 박스 함정' },
      { type: 'p', text: '`@tabler/icons` 패키지에 들어 있는 원본 SVG 파일은(이 path를 빼고 렌더링하는 React 컴포넌트와 달리) 24×24 캔버스 전체를 덮는 보이지 않는 path로 시작합니다. 디자인 툴에서 아트보드 크기를 유지하려고 넣은 것인데 선택자를 넓게 쓰기 전까지는 아무 문제가 없습니다.' },
      { type: 'code', lang: 'css', code: TABLER_TRAP },
      { type: 'p', text: '`stroke`도 마찬가지입니다. `.icon path { stroke: red }` 같은 규칙이 `stroke="none"`을 덮어써서 아이콘 둘레에 사각형 테두리가 생깁니다. 어떤 라이브러리든 원본 파일을 복사해 쓴다면 이런 보조 도형이 있는지 확인하거나, 실제로 칠해지는 도형만 고르도록 선택자 범위를 좁히세요.' },

      { type: 'h2', text: '방법 3: 파일에서 색 바꾸기' },
      { type: 'p', text: 'Figma, Illustrator, 스톡 사이트에서 받은 아이콘은 보통 모든 도형에 색이 박혀 있습니다(`fill="#000000"`). CSS로 속성을 덮어쓸 수는 있지만 파일을 `<img>`로 쓰거나 어디서든 `currentColor`를 따르게 하고 싶다면 원본을 고치는 편이 깔끔합니다.' },
      { type: 'p', text: '파일 하나라면 HEX 값을 찾아 바꾸면 되고 폴더 전체라면 `sed` 한 줄이면 됩니다.' },
      { type: 'code', lang: 'bash', code: SED_REPLACE },
      { type: 'p', text: '바꾸기 전에 먼저 보세요. 국기, 브랜드 로고, 일러스트 같은 다색 아이콘은 일부러 여러 색을 쓰기 때문에 전부 `currentColor`로 바꾸면 단색 실루엣으로 뭉개집니다.' },
      { type: 'p', text: '구멍을 내려고 쓴 `fill="none"`이나 `fill="white"`도 조심해야 합니다. 어두운 도형 안의 `white`는 여백 역할을 하는 경우가 많으니 그대로 두거나, 배경이 비쳐 보여야 한다면 `transparent`로 바꾸세요.' },

      { type: 'h2', text: 'URL로만 참조할 수 있는 아이콘' },
      { type: 'p', text: '`<img>`, `background-image`, CSS `content: url()`로 넣은 SVG는 독립된 이미지로 렌더링됩니다. 페이지 CSS가 안쪽에 닿지 않으니 `color`도 `fill`도 소용없습니다. 선택지는 세 가지입니다.' },
      { type: 'ul', items: [
        '**인라인으로 넣기**(또는 SVGR로 컴포넌트로 가져오기). 가장 유연하고 도형을 하나하나 스타일링할 수 있는 유일한 방법입니다.',
        '**CSS 마스크로 쓰기.** SVG는 모양만 제공하고 색은 요소의 `background-color`가 정합니다. 이 값을 `currentColor`로 두면 아이콘이 다시 글자색을 따릅니다.',
      ] },
      { type: 'code', lang: 'css', code: MASK_CSS },
      { type: 'ul', items: [
        '**색마다 파일을 따로 만들기.** 이메일 템플릿, 파비콘처럼 CSS 마스크나 인라인 SVG를 쓸 수 없는 곳에서는 이게 정답입니다. 손으로 고치지 말고 변형 파일을 생성하세요.',
      ] },
      { type: 'p', text: '마스크는 실루엣을 단색으로 칠하므로 다색 SVG는 내부 색을 잃습니다. 보조 기술에서도 이미지가 보이지 않게 되니 아이콘이 의미를 가진다면 요소에 레이블을 달아야 합니다(접근성 아이콘 가이드 참고).' },

      { type: 'h2', text: '두 가지 색: 듀오톤 아이콘과 스프라이트' },
      { type: 'p', text: 'Phosphor의 duotone 굵기는 path 두 개를 렌더링합니다. 주 도형과 `opacity="0.2"`가 붙은 배경 도형입니다.' },
      { type: 'p', text: '둘 다 `currentColor`를 쓰기 때문에 듀오톤 아이콘은 한 가지 색이 진하기만 달리해서 나옵니다. 강조색을 따로 주려면 속성으로 배경 레이어를 고르세요.' },
      { type: 'code', lang: 'css', code: DUOTONE_CSS },
      { type: 'p', text: '스프라이트(`<symbol>` + `<use>`)에는 제약이 하나 더 있습니다. 도형이 섀도 트리로 복제되기 때문에 스타일시트 선택자가 개별 path에 닿지 않습니다.' },
      { type: 'p', text: '그래도 상속되는 속성은 안으로 흘러 들어가는데 `color`와 CSS 커스텀 속성도 여기에 들어갑니다. 심볼을 이 두 통로에 맞춰 만드세요.' },
      { type: 'code', lang: 'html', code: SPRITE_CSS },

      { type: 'h2', text: '잘 보이는 색 고르기' },
      { type: 'p', text: 'WCAG 2.1 성공 기준 1.4.11(비텍스트 대비)은 내용을 이해하는 데 필요한 그래픽에 최소 **3:1** 명도 대비를 요구합니다. 의미를 담은 아이콘이나 버튼 역할을 하는 아이콘이 여기에 해당합니다.' },
      { type: 'p', text: '흔히 쓰는 UI 팔레트 색도 흰 배경에서는 기준에 못 미칠 수 있습니다. Icony 색상 선택기의 프리셋 여덟 가지를 WCAG 상대 휘도 공식으로 계산해 봤습니다.' },
      { type: 'ul', items: [
        '흰 배경(#FFFFFF): 검정 21.0, 보라 #8B5CF6 4.23, 빨강 #EF4444 3.76, 파랑 #3B82F6 3.68, 분홍 #EC4899 3.53은 통과하고 **초록 #10B981(2.54)과 노랑 #F59E0B(2.15)는 미달**입니다.',
        '짙은 회색 배경(#111827): 검정을 뺀 모든 프리셋이 통과합니다. 보라 4.19부터 흰색 17.74까지입니다.',
      ] },
      { type: 'p', text: '대개는 같은 색상 계열에서 밝은 테마엔 더 진한 톤을, 어두운 테마엔 더 밝은 톤을 쓰면 해결됩니다. 아이콘 색을 박아 넣은 fill 대신 `color`와 테마 변수로 제어해야 하는 이유가 하나 더 생기는 셈입니다.' },

      { type: 'h2', text: '색을 입혀 내보낸 파일과 복사한 코드' },
      { type: 'p', text: '아이콘 색을 대신 바꿔 주는 비주얼 도구는 그 색을 어딘가에 적어야 하고 보통은 속성에 HEX 값으로 들어갑니다. 예를 들어 Icony는 각 라이브러리의 React 컴포넌트에 고른 색을 넣어 렌더링합니다. 그래서 Lucide나 Tabler는 루트에 `stroke="#EF4444"`가, Phosphor와 Bootstrap은 `fill="#EF4444"`가, Radix는 path에 그 값이 들어간 채로 나옵니다.' },
      { type: 'p', text: 'PNG나 슬라이드, 디자인 전달용이라면 바로 원하던 결과입니다. 테마가 있는 앱에 SVG나 생성된 React 컴포넌트를 붙여 넣는다면 HEX를 한 번만 `currentColor`로 바꿔 두세요. 그 뒤로는 아이콘이 CSS를 따릅니다.' },

      { type: 'h2', text: '문제 해결: 색이 안 바뀔 때' },
      { type: 'ol', items: [
        'SVG가 인라인인가요? `<img>`나 배경이라면 페이지 CSS가 닿지 않습니다. 인라인으로 넣거나 마스크를 쓰세요.',
        '맞는 속성을 지정했나요? 외곽선 아이콘은 `stroke`나 `color`, 채움 아이콘은 `fill`이나 `color`가 필요합니다.',
        '색이 자식 도형에 있나요? 루트 대신 `svg path`를 고르세요. Lucide는 `circle`, `rect`, `line`도 쓰니 함께 포함해야 합니다.',
        '인라인 `style` 속성이 있나요? 스타일시트보다 우선하니 지우거나, 최후의 수단으로 `!important`를 쓰세요.',
        '사각형 전체가 칠해졌나요? Tabler 바운딩 박스 같은 보조 path를 건드린 것입니다. 선택자를 좁히세요.',
        '색이 흐릿한가요? 도형에 `opacity`나 `fill-opacity` 속성이 있는지 확인하세요.',
      ] },

      { type: 'h2', text: '자주 묻는 질문' },
      { type: 'p', text: '**`<img>` 태그로 넣은 SVG도 CSS만으로 색을 바꿀 수 있나요?** 내부 색은 못 바꿉니다. 마스크로 단색 처리하거나 CSS `filter`를 쓸 수는 있지만 filter 조합은 목표 HEX에 근사할 뿐이고 관리하기도 어렵습니다.' },
      { type: 'p', text: '**`fill`과 `color` 중 무엇을 써야 하나요?** 아이콘이 주변 텍스트와 같은 색이어야 한다면 `color`를 쓰세요. 대부분 이 경우입니다. 아이콘만 다른 색이어야 하고 fill과 stroke 중 무엇을 쓰는지 안다면 그 속성을 직접 지정하세요.' },
      { type: 'p', text: '**파일을 따로 열면 아이콘이 왜 검은색인가요?** 부모 글자색이 없으면 `currentColor`는 기본 글자색인 검정으로 처리됩니다. 정상이고 페이지 안의 아이콘에는 영향이 없습니다.' },
      { type: 'p', text: '**정리:** 아이콘을 인라인으로 넣고, 칠이 `currentColor`인지 확인하고, `color`를 지정하세요. 나머지 기법은 거의 다 이 세 조건 중 하나를 맞출 수 없을 때 쓰는 대안입니다.' },
    ],
  },
};
