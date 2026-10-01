import type { BlogPost } from '../types';

const LIB_DEFAULTS = `<!-- Heroicons 2.2.0 <CheckIcon title="Done" titleId="t1" /> -->
<svg … aria-hidden="true" aria-labelledby="t1"><title id="t1">Done</title>…</svg>
<!-- still hidden: aria-hidden wins, the title is never announced -->

<!-- Tabler 3.36.1 <IconCheck title="Done" /> -->
<svg … class="tabler-icon tabler-icon-check"><title>Done</title>…</svg>

<!-- Phosphor 2.1.10 <Check alt="Done" /> -->
<svg … fill="currentColor" viewBox="0 0 256 256"><title>Done</title>…</svg>

<!-- lucide-react 0.460 <Check /> : no aria attributes at all -->
<svg … class="lucide lucide-check"><path d="M20 6 9 17l-5-5"></path></svg>`;

const DECORATIVE = `<!-- The word "Delete" already says everything -->
<button type="button">
  <svg aria-hidden="true" …>…</svg>
  Delete
</button>

// React: same idea with a component library
<button type="button">
  <Trash2 aria-hidden="true" />
  Delete
</button>`;

const INFORMATIVE = `<!-- Option A: aria-label (simplest, no tooltip) -->
<svg role="img" aria-label="Verified account" viewBox="0 0 24 24" …>
  <path d="…" />
</svg>

<!-- Option B: <title> referenced by id (shows a native tooltip on hover) -->
<svg role="img" aria-labelledby="verified-t" viewBox="0 0 24 24" …>
  <title id="verified-t">Verified account</title>
  <path d="…" />
</svg>

// Heroicons: its hard-coded aria-hidden must be removed explicitly
<CheckBadgeIcon role="img" title="Verified account" titleId="verified-t"
                aria-hidden={undefined} />`;

const ICON_BUTTON = `<!-- 1. aria-label on the control -->
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true" …>…</svg>
</button>

<!-- 2. Visually hidden text (also works with <a>, and is plain page text) -->
<a href="/cart" class="icon-link">
  <svg aria-hidden="true" …>…</svg>
  <span class="visually-hidden">Cart, 3 items</span>
</a>

.visually-hidden {
  position: absolute !important;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}`;

const IMG_SPRITE = `<!-- SVG as an image file: alt does the work -->
<img src="/icons/warning.svg" alt="Warning" width="20" height="20">
<img src="/icons/sparkle.svg" alt="" width="20" height="20">  <!-- decorative -->

<!-- Sprite reference: hide the graphic, label the control -->
<button type="button" aria-label="Search">
  <svg class="icon" aria-hidden="true"><use href="#icon-search" /></svg>
</button>`;

const TOGGLE = `<!-- The label stays the same; the state is a separate attribute -->
<button type="button" aria-label="Mute" aria-pressed="false">
  <svg aria-hidden="true" …><!-- speaker icon --></svg>
</button>

<!-- Disclosure: the icon flips, aria-expanded carries the meaning -->
<button type="button" aria-expanded="false" aria-controls="filters">
  Filters
  <svg aria-hidden="true" class="chevron" …>…</svg>
</button>`;

const VISUAL_CSS = `/* 24×24 minimum target (WCAG 2.2, 2.5.8) without enlarging the icon */
.icon-button {
  display: inline-grid;
  place-items: center;
  min-width: 24px;
  min-height: 24px;
  padding: 8px;                 /* a 16px icon becomes a 32px target */
}

/* Visible keyboard focus */
.icon-button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Windows high-contrast / forced colors: currentColor icons follow the
   forced text color automatically; hard-coded fills need a nudge */
@media (forced-colors: active) {
  .icon-hardcoded path { fill: CanvasText; }
}`;

export const post: BlogPost = {
  slug: 'accessible-svg-icons',
  category: 'how-to',
  readingMinutes: 7,
  published: '2026-06-04',
  updated: '2026-09-30',
  related: ['svg-to-react-component', 'add-icons-to-website', 'svg-not-showing'],
  title: {
    en: 'How to Make SVG Icons Accessible',
    ko: '접근성 있는 SVG 아이콘 만드는 법',
  },
  description: {
    en: 'Decide whether an icon is decorative, informative or a control, then mark it up correctly. Includes what Lucide, Heroicons, Tabler and Phosphor do by default, contrast, target size and testing.',
    ko: '아이콘이 장식인지, 정보인지, 컨트롤인지 먼저 판단하고 그에 맞게 마크업하세요. Lucide·Heroicons·Tabler·Phosphor의 기본 동작, 대비, 터치 영역, 테스트 방법까지 다룹니다.',
  },
  metaTitle: {
    en: 'Accessible SVG Icons: aria-hidden, role, and Labels | Icony',
    ko: '접근성 있는 SVG 아이콘: aria-hidden·role·레이블 | Icony',
  },
  metaDescription: {
    en: 'Make SVG icons accessible: hide decorative icons, label meaningful ones, name icon-only buttons, avoid library defaults that hide your labels, and meet contrast and target-size rules.',
    ko: '접근성 있는 SVG 아이콘: 장식은 숨기고, 의미 있는 아이콘엔 레이블을, 아이콘 버튼엔 이름을. 레이블을 숨겨 버리는 라이브러리 기본값과 대비·터치 영역 기준까지.',
  },
  blocks: {
    en: [
      { type: 'p', text: 'Accessible icon markup comes down to one question: **if the icon disappeared, would a screen reader user lose any information?** If not, hide it. If so, give the information a text equivalent, and put that text on the thing the user interacts with. Most icon accessibility bugs come from answering the question wrong, or from a library default quietly overriding the markup you wrote.' },

      { type: 'h2', text: 'The four situations you will meet' },
      { type: 'ol', items: [
        '**Decorative, next to text.** A trash can beside the word “Delete”. The icon repeats the label. Hide it.',
        '**Informative, standing alone.** A shield next to a username that means “verified”, with no text saying so. Give the graphic a name.',
        '**The only content of a control.** A close button that contains nothing but an ×. Name the button, not the icon.',
        '**Carrying state.** A chevron that flips when a panel opens, or a filled versus outline star. The state belongs in an ARIA attribute on the control; the icon stays hidden.',
      ] },
      { type: 'p', text: 'Almost every icon on a typical page falls into case 1 or case 3. Case 2 is rarer than people assume, because designers usually put a text label or tooltip next to meaningful icons anyway.' },

      { type: 'h2', text: 'First, check what your icon library already does' },
      { type: 'p', text: 'Icon packages differ in their defaults, and some of them conflict with the markup you might add. We rendered one icon from each package in Icony’s codebase with `react-dom/server`:' },
      { type: 'code', lang: 'html', code: LIB_DEFAULTS },
      { type: 'ul', items: [
        '**Heroicons** sets `aria-hidden="true"` on every icon, which is a good default for decoration. But passing `title` doesn’t remove it, so the `<title>` you added is never announced. To make a Heroicon informative, override `aria-hidden` yourself.',
        '**Tabler** (`title`) and **Phosphor** (`alt`) turn their prop into a `<title>` element but add no `role`. Screen readers can still handle this, but support for SVG without `role="img"` has historically been inconsistent. Add the role when the icon is informative.',
        '**Lucide 0.460** adds nothing. Its icons are exposed or hidden depending on what you pass, so a decorative Lucide icon needs `aria-hidden="true"` from you.',
      ] },
      { type: 'tip', text: 'Library defaults change between versions. Before trusting any of the above for your project, render the icon and inspect the DOM output. It takes a minute and settles the question for the version you actually ship.' },

      { type: 'h2', text: 'Decorative icons: hide them' },
      { type: 'p', text: 'When the text already says what the icon shows, the icon is noise to a screen reader. Depending on the browser and the SVG’s contents, an unhidden icon may be announced as “image”, “group”, or not at all. None of that helps. `aria-hidden="true"` removes it from the accessibility tree:' },
      { type: 'code', lang: 'html', code: DECORATIVE },
      { type: 'p', text: 'Don’t put `aria-hidden` on a parent that contains the text, or you hide the label along with the icon. And don’t hide an icon that is the only content of a link or button unless you give that control its own name. Otherwise you have created a control with no name, which is worse than an unlabeled icon.' },

      { type: 'h2', text: 'Informative icons: give them a name' },
      { type: 'p', text: 'When the icon carries meaning that no nearby text provides, expose it as an image with a name. `role="img"` tells assistive technology to treat the whole SVG as one graphic instead of a group of shapes, and the name comes from either `aria-label` or a `<title>` referenced with `aria-labelledby`:' },
      { type: 'code', lang: 'html', code: INFORMATIVE },
      { type: 'p', text: 'Pick one naming method. Option A is simpler and doesn’t show a tooltip. Option B shows the title as a browser tooltip when a mouse user hovers, which can be useful, but that tooltip never appears for keyboard or touch users, so don’t rely on it as the only visible explanation. Write names that describe the meaning, not the drawing: “Verified account”, not “blue shield with checkmark”.' },

      { type: 'h2', text: 'Icon-only buttons and links: name the control' },
      { type: 'p', text: 'This is the case that breaks most often, and the one with the biggest impact. A button with only an icon inside has no text, so a screen reader announces it as “button” with no name, and speech-control users have nothing to say to activate it. Name the control and hide the icon:' },
      { type: 'code', lang: 'html', code: ICON_BUTTON },
      { type: 'p', text: 'Both patterns produce the same accessible name. Visually hidden text has two practical advantages: it’s regular page content, so page translation tools and in-page search see it, and it can include dynamic details such as the item count. Whichever you use, the name should say what the control does (“Close dialog”, “Search”), and it should match any visible tooltip so voice-control users can say what they see.' },
      { type: 'tip', text: 'A `title` attribute on the button is not a substitute. It only appears on mouse hover after a delay, never on touch or keyboard focus, and it’s used as the accessible name only when nothing better exists. Use `aria-label` or hidden text for the name, and a custom tooltip if sighted users need a hint too.' },

      { type: 'h2', text: 'Icons that show state' },
      { type: 'p', text: 'Toggles and disclosures often change their icon: a speaker gets a slash, a chevron rotates, a star fills in. The icon change is visual only. Screen readers need the state as an attribute, and the name should stay constant so users know it’s the same control:' },
      { type: 'code', lang: 'html', code: TOGGLE },
      { type: 'p', text: 'Avoid swapping the label between “Mute” and “Unmute” while also setting `aria-pressed`. The two announce conflicting things (“Unmute, toggle button, pressed”). Use one approach: a fixed label with `aria-pressed`, or a label that changes with no pressed state.' },

      { type: 'h2', text: 'Icons in <img> tags and sprites' },
      { type: 'p', text: 'When an SVG is loaded as a file, the `<img>` element’s `alt` attribute is the text equivalent, and the rules are the same as for any image: meaningful icons get a short description, decorative ones get an empty `alt=""` (not a missing one, which leaves some screen readers to read the file name). For `<use>` sprites, treat the outer `<svg>` like an inline icon:' },
      { type: 'code', lang: 'html', code: IMG_SPRITE },

      { type: 'h2', text: 'Accessibility you can see: contrast, size and color' },
      { type: 'p', text: 'Screen reader markup is half the job. The other half is for people who see the icon but may have low vision, color blindness or limited dexterity:' },
      { type: 'ul', items: [
        '**Contrast.** WCAG 1.4.11 asks for at least 3:1 against the adjacent background for icons needed to understand content or operate a control. Some common palette colors fail on white. In our measurements, emerald #10B981 reaches only 2.54:1 and amber #F59E0B 2.15:1.',
        '**Don’t rely on color alone** (WCAG 1.4.1). A red icon versus a green icon for error versus success needs a shape difference too, such as an × versus a ✓, or a text label.',
        '**Target size.** WCAG 2.2’s 2.5.8 asks for pointer targets of at least 24×24 CSS pixels, with an exception for smaller targets that have enough spacing. Enlarge the button with padding and leave the icon at its designed size.',
        '**Focus.** Icon buttons need a visible focus indicator. `outline: 2px solid currentColor` picks up the icon’s color, so it stays visible in both themes.',
        '**Forced colors.** In Windows high-contrast modes, the text color is overridden, so icons painted with `currentColor` follow it. Icons with hard-coded fills don’t, and can vanish against the forced background.',
      ] },
      { type: 'code', lang: 'css', code: VISUAL_CSS },

      { type: 'h2', text: 'How to test in five minutes' },
      { type: 'ol', items: [
        'Open the browser’s accessibility inspector (Chrome DevTools: Elements › Accessibility; Firefox: the Accessibility panel). Select each icon button and check its computed **Name** is what you expect, and that decorative icons are absent from the tree.',
        'Tab through the page. Every icon control should get a visible focus ring, and nothing that isn’t interactive should receive focus.',
        'Turn on a screen reader (VoiceOver on macOS with Cmd+F5, or NVDA on Windows) and move through the toolbar. Listen for “button” with no name, and for icons announced twice.',
        'Check contrast of icon colors with any WCAG contrast checker, against every background they appear on, in both light and dark themes.',
      ] },

      { type: 'h2', text: 'Common mistakes' },
      { type: 'ul', items: [
        '**Labeling both the button and the icon.** The name gets read twice, or the icon adds a second, different name. Label one thing.',
        '**`aria-label` on a plain `<div>` or `<span>` wrapper.** ARIA 1.2 prohibits naming generic elements, and screen readers announce such labels inconsistently or not at all. Put the label on a button, link or `role="img"` element.',
        '**Trusting `title` on Heroicons.** The component’s `aria-hidden="true"` still hides everything unless you override it.',
        '**Describing the picture.** “Magnifying glass” tells users what’s drawn, not what happens. Say “Search”.',
        '**Adding `focusable="false"` everywhere.** It was a workaround for Internet Explorer, which put SVGs in the tab order. Current browsers don’t, so it’s harmless but unnecessary.',
      ] },
      { type: 'p', text: 'Icons you download or copy from a customizer are usually bare graphics. In Icony’s case, the SVG and React output is whatever the source library renders, so Heroicons exports keep their `aria-hidden="true"` and the other libraries export with no role, no label and no `aria-hidden`. Only you know whether an icon is decorative or a control where it’s used, so add or adjust the attributes at that point.' },
      { type: 'p', text: '**Takeaway:** hide icons that repeat text, name icons that stand alone, put the name on the control for icon-only buttons, keep state in ARIA attributes rather than in the drawing, and inspect the rendered DOM, because library defaults can undo all of it.' },
    ],
    ko: [
      { type: 'p', text: '접근성 있는 아이콘 마크업은 결국 한 가지 질문으로 정리됩니다. **아이콘이 사라진다면 스크린 리더 사용자가 잃는 정보가 있는가?** 없다면 숨기세요. 있다면 그 정보를 텍스트로 제공하고, 그 텍스트는 사용자가 실제로 조작하는 요소에 두세요. 아이콘 접근성 버그는 대부분 이 질문에 잘못 답했거나, 라이브러리 기본값이 작성한 마크업을 조용히 덮어써서 생깁니다.' },

      { type: 'h2', text: '만나게 될 네 가지 상황' },
      { type: 'ol', items: [
        '**텍스트 옆의 장식.** “삭제”라는 글자 옆의 휴지통. 아이콘이 레이블을 반복할 뿐이니 숨깁니다.',
        '**홀로 쓰인 정보.** 사용자 이름 옆에서 “인증됨”을 뜻하는 방패 아이콘인데, 그렇다고 알려 주는 텍스트가 없는 경우. 그래픽에 이름을 줍니다.',
        '**컨트롤의 유일한 내용.** × 하나만 들어 있는 닫기 버튼. 아이콘이 아니라 버튼에 이름을 줍니다.',
        '**상태를 나타냄.** 패널이 열리면 뒤집히는 화살표, 채워진 별과 빈 별. 상태는 컨트롤의 ARIA 속성에 두고 아이콘은 숨깁니다.',
      ] },
      { type: 'p', text: '일반적인 페이지의 아이콘은 거의 다 1번이나 3번입니다. 2번은 생각보다 드문데, 디자이너가 의미 있는 아이콘 옆에는 보통 텍스트 레이블이나 툴팁을 두기 때문입니다.' },

      { type: 'h2', text: '먼저 아이콘 라이브러리가 이미 하는 일을 확인하기' },
      { type: 'p', text: '아이콘 패키지마다 기본값이 다르고, 일부는 직접 추가한 마크업과 충돌합니다. Icony 코드베이스의 패키지에서 아이콘을 하나씩 `react-dom/server`로 렌더링해 봤습니다.' },
      { type: 'code', lang: 'html', code: LIB_DEFAULTS },
      { type: 'ul', items: [
        '**Heroicons**는 모든 아이콘에 `aria-hidden="true"`를 붙입니다. 장식용으로는 좋은 기본값입니다. 하지만 `title`을 넘겨도 이 속성이 사라지지 않아서 추가한 `<title>`은 절대 읽히지 않습니다. Heroicon을 정보용으로 쓰려면 `aria-hidden`을 직접 덮어써야 합니다.',
        '**Tabler**(`title`)와 **Phosphor**(`alt`)는 prop을 `<title>` 요소로 바꿔 주지만 `role`은 붙이지 않습니다. 스크린 리더가 처리할 수는 있어도, `role="img"`가 없는 SVG는 예전부터 지원이 들쭉날쭉했습니다. 정보용 아이콘이라면 role을 추가하세요.',
        '**Lucide 0.460**은 아무것도 붙이지 않습니다. 넘긴 속성에 따라 노출되거나 숨겨지므로, 장식용 Lucide 아이콘에는 직접 `aria-hidden="true"`를 넣어야 합니다.',
      ] },
      { type: 'tip', text: '라이브러리 기본값은 버전마다 바뀝니다. 위 내용을 프로젝트에 그대로 믿기 전에 아이콘을 렌더링해서 DOM 결과를 확인하세요. 1분이면 실제로 배포하는 버전 기준으로 답이 나옵니다.' },

      { type: 'h2', text: '장식용 아이콘: 숨긴다' },
      { type: 'p', text: '아이콘이 보여 주는 내용을 텍스트가 이미 말하고 있다면, 스크린 리더에게 아이콘은 잡음입니다. 브라우저와 SVG 내용에 따라 숨기지 않은 아이콘은 “이미지”, “그룹”으로 읽히거나 아예 읽히지 않는데, 어느 쪽도 도움이 안 됩니다. `aria-hidden="true"`는 아이콘을 접근성 트리에서 빼 줍니다.' },
      { type: 'code', lang: 'html', code: DECORATIVE },
      { type: 'p', text: '텍스트를 포함한 부모에 `aria-hidden`을 걸지 마세요. 아이콘과 함께 레이블까지 숨겨집니다. 또 링크나 버튼의 유일한 내용인 아이콘은, 그 컨트롤에 따로 이름을 주지 않는 한 숨기면 안 됩니다. 그러면 이름 없는 컨트롤이 되는데, 레이블 없는 아이콘보다 더 나쁩니다.' },

      { type: 'h2', text: '정보용 아이콘: 이름을 준다' },
      { type: 'p', text: '주변 텍스트가 주지 않는 의미를 아이콘이 담고 있다면 이름이 있는 이미지로 노출하세요. `role="img"`는 보조 기술에게 SVG 전체를 도형 묶음이 아닌 그래픽 하나로 다루라고 알려 주고, 이름은 `aria-label`이나 `aria-labelledby`로 참조한 `<title>`에서 가져옵니다.' },
      { type: 'code', lang: 'html', code: INFORMATIVE },
      { type: 'p', text: '이름 붙이는 방법은 하나만 고르세요. A는 더 단순하고 툴팁이 뜨지 않습니다. B는 마우스를 올리면 제목이 브라우저 툴팁으로 떠서 유용할 수 있지만, 키보드나 터치 사용자에게는 절대 나타나지 않으니 유일한 시각적 설명으로 의존하면 안 됩니다. 이름은 그림이 아니라 의미를 설명해야 합니다. “파란 방패와 체크 표시”가 아니라 “인증된 계정”입니다.' },

      { type: 'h2', text: '아이콘 전용 버튼과 링크: 컨트롤에 이름을 준다' },
      { type: 'p', text: '가장 자주 깨지고 영향도 가장 큰 경우입니다. 아이콘만 든 버튼은 텍스트가 없어서 스크린 리더가 이름 없이 “버튼”이라고만 읽고, 음성 제어 사용자는 눌러 달라고 말할 이름이 없습니다. 컨트롤에 이름을 주고 아이콘은 숨기세요.' },
      { type: 'code', lang: 'html', code: ICON_BUTTON },
      { type: 'p', text: '두 패턴 모두 같은 접근 가능한 이름을 만듭니다. 시각적으로 숨긴 텍스트에는 실용적인 장점이 두 가지 있습니다. 일반 페이지 콘텐츠라서 페이지 번역 도구와 페이지 내 검색이 볼 수 있고, 상품 개수 같은 동적인 정보도 넣을 수 있습니다. 어느 쪽이든 이름은 컨트롤이 하는 일을 말해야 하고(“대화상자 닫기”, “검색”), 눈에 보이는 툴팁이 있다면 그와 일치해야 음성 제어 사용자가 보이는 대로 말할 수 있습니다.' },
      { type: 'tip', text: '버튼의 `title` 속성은 대안이 아닙니다. 마우스를 올린 뒤 잠시 지나야 나타나고, 터치나 키보드 포커스에서는 절대 나타나지 않으며, 더 나은 이름이 없을 때만 접근 가능한 이름으로 쓰입니다. 이름은 `aria-label`이나 숨긴 텍스트로 주고, 보이는 사용자에게도 힌트가 필요하면 커스텀 툴팁을 쓰세요.' },

      { type: 'h2', text: '상태를 보여 주는 아이콘' },
      { type: 'p', text: '토글과 펼침 컨트롤은 아이콘을 자주 바꿉니다. 스피커에 사선이 그어지고, 화살표가 돌고, 별이 채워집니다. 아이콘 변화는 시각적인 것일 뿐입니다. 스크린 리더에는 상태가 속성으로 필요하고, 같은 컨트롤임을 알 수 있도록 이름은 그대로 유지해야 합니다.' },
      { type: 'code', lang: 'html', code: TOGGLE },
      { type: 'p', text: '`aria-pressed`를 쓰면서 레이블까지 “음소거”와 “음소거 해제”로 바꾸지 마세요. 둘이 서로 모순되게 읽힙니다(“음소거 해제, 토글 버튼, 눌림”). 고정된 레이블에 `aria-pressed`를 쓰거나, 눌림 상태 없이 레이블만 바꾸거나, 한 가지만 쓰세요.' },

      { type: 'h2', text: '<img> 태그와 스프라이트의 아이콘' },
      { type: 'p', text: 'SVG를 파일로 불러오면 `<img>` 요소의 `alt` 속성이 텍스트 대체 수단이고, 규칙은 다른 이미지와 같습니다. 의미 있는 아이콘에는 짧은 설명을, 장식용에는 빈 `alt=""`를 주세요. alt를 아예 빼면 일부 스크린 리더는 파일 이름을 읽습니다. `<use>` 스프라이트는 바깥 `<svg>`를 인라인 아이콘처럼 다루면 됩니다.' },
      { type: 'code', lang: 'html', code: IMG_SPRITE },

      { type: 'h2', text: '눈에 보이는 접근성: 대비, 크기, 색' },
      { type: 'p', text: '스크린 리더용 마크업은 절반입니다. 나머지 절반은 아이콘을 보지만 저시력, 색각 이상, 손 사용의 제약이 있을 수 있는 사람들을 위한 것입니다.' },
      { type: 'ul', items: [
        '**대비.** WCAG 1.4.11은 내용을 이해하거나 컨트롤을 조작하는 데 필요한 아이콘에 인접 배경과 최소 3:1 대비를 요구합니다. 흔한 팔레트 색 중에도 흰 배경에서 미달하는 것이 있습니다. 측정해 보니 에메랄드 #10B981은 2.54:1, 앰버 #F59E0B는 2.15:1에 그쳤습니다.',
        '**색에만 의존하지 않는다**(WCAG 1.4.1). 오류와 성공을 빨간 아이콘과 초록 아이콘으로만 구분하면 안 되고, × 대 ✓처럼 모양 차이나 텍스트 레이블이 함께 있어야 합니다.',
        '**터치 영역.** WCAG 2.2의 2.5.8은 포인터 대상이 최소 24×24 CSS 픽셀이어야 한다고 요구하며, 간격이 충분한 작은 대상은 예외로 둡니다. 아이콘은 디자인된 크기 그대로 두고 패딩으로 버튼을 키우세요.',
        '**포커스.** 아이콘 버튼에는 눈에 보이는 포커스 표시가 필요합니다. `outline: 2px solid currentColor`는 아이콘 색을 따라가므로 두 테마 모두에서 잘 보입니다.',
        '**강제 색상 모드.** Windows 고대비 모드에서는 글자색이 강제로 바뀌므로 `currentColor`로 칠한 아이콘은 그 색을 따릅니다. 색을 박아 넣은 아이콘은 따르지 않아서 강제된 배경에 묻혀 사라질 수 있습니다.',
      ] },
      { type: 'code', lang: 'css', code: VISUAL_CSS },

      { type: 'h2', text: '5분 테스트 방법' },
      { type: 'ol', items: [
        '브라우저 접근성 검사기를 여세요(Chrome 개발자 도구: Elements › Accessibility, Firefox: 접근성 패널). 아이콘 버튼마다 계산된 **이름(Name)**이 기대한 값인지, 장식용 아이콘이 트리에서 빠져 있는지 확인합니다.',
        'Tab 키로 페이지를 이동해 보세요. 모든 아이콘 컨트롤에 포커스 표시가 보여야 하고, 상호작용하지 않는 요소는 포커스를 받으면 안 됩니다.',
        '스크린 리더(macOS는 Cmd+F5로 VoiceOver, Windows는 NVDA)를 켜고 툴바를 훑어 보세요. 이름 없는 “버튼”과 두 번 읽히는 아이콘이 있는지 들어 봅니다.',
        'WCAG 대비 검사 도구로 아이콘 색을 확인하세요. 아이콘이 놓이는 모든 배경에서, 밝은 테마와 어두운 테마 모두 확인합니다.',
      ] },

      { type: 'h2', text: '흔한 실수' },
      { type: 'ul', items: [
        '**버튼과 아이콘 모두에 레이블을 단다.** 이름이 두 번 읽히거나, 아이콘이 다른 이름을 하나 더 얹습니다. 레이블은 한 곳에만.',
        '**평범한 `<div>`나 `<span>` 래퍼에 `aria-label`을 단다.** ARIA 1.2는 일반 요소에 이름 붙이는 것을 금지하고 있고, 스크린 리더도 이런 레이블을 들쭉날쭉하게 읽거나 아예 무시합니다. 버튼, 링크, `role="img"` 요소에 다세요.',
        '**Heroicons의 `title`을 믿는다.** 컴포넌트의 `aria-hidden="true"`를 덮어쓰지 않으면 여전히 전부 숨겨집니다.',
        '**그림을 묘사한다.** “돋보기”는 무엇이 그려졌는지 알려 줄 뿐, 무슨 일이 일어나는지는 알려 주지 않습니다. “검색”이라고 쓰세요.',
        '**모든 곳에 `focusable="false"`를 붙인다.** SVG를 탭 순서에 넣던 Internet Explorer용 우회책이었습니다. 요즘 브라우저는 그러지 않으니 해는 없지만 필요도 없습니다.',
      ] },
      { type: 'p', text: '아이콘 커스터마이저에서 내려받거나 복사한 아이콘은 대개 맨 그래픽입니다. Icony의 경우 SVG와 React 출력이 원본 라이브러리가 렌더링하는 그대로라서, Heroicons는 `aria-hidden="true"`가 남아 있고 나머지 라이브러리는 role, 레이블, `aria-hidden` 없이 나옵니다. 그 아이콘이 쓰이는 자리에서 장식인지 컨트롤인지는 여러분만 알기 때문에, 속성은 그 자리에서 추가하거나 고치세요.' },
      { type: 'p', text: '**정리:** 텍스트를 반복하는 아이콘은 숨기고, 홀로 쓰인 아이콘에는 이름을 주고, 아이콘 전용 버튼은 컨트롤에 이름을 주고, 상태는 그림이 아닌 ARIA 속성에 담고, 렌더링된 DOM을 직접 확인하세요. 라이브러리 기본값이 이 모든 것을 무너뜨릴 수 있습니다.' },
    ],
  },
};
