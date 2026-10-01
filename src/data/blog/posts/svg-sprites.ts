import type { BlogPost } from '../types';

// Code samples used only by this post. Symbol markup is generated from real
// @tabler/icons 3.36.1 files with the build script below (tested).
const SPRITE_DEFINE = `<!-- Inline sprite: put it once, right after <body> -->
<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"
     style="position:absolute" aria-hidden="true" focusable="false">
  <symbol id="icon-home" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
  </symbol>
  <symbol id="icon-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
    <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
  </symbol>
</svg>`;

const SPRITE_USE = `<!-- Same document -->
<a href="/" class="nav-link">
  <svg class="icon" width="24" height="24" aria-hidden="true"><use href="#icon-home" /></svg>
  Home
</a>

<!-- External, cacheable file (must be same-origin) -->
<button class="icon-btn" aria-label="Notifications">
  <svg class="icon" width="24" height="24" aria-hidden="true">
    <use href="/sprite.svg#icon-bell" />
  </svg>
</button>`;

const SPRITE_CSS = `.icon {
  width: 1.25em;
  height: 1.25em;
  flex-shrink: 0;
}
.nav-link       { color: #334155; }
.nav-link:hover { color: #4f46e5; }   /* stroke="currentColor" follows this */

/* Two-tone icons: custom properties inherit into the <use> shadow tree */
.icon--alert { --icon-accent: #ef4444; }`;

const TWO_TONE_SYMBOL = `<symbol id="icon-bell-dot" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
  <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
  <!-- style="" is real CSS, so var() works here; a bare fill="var(...)" attribute is not reliable -->
  <circle cx="18" cy="5" r="3" stroke="none" style="fill: var(--icon-accent, currentColor)" />
</symbol>`;

const BUILD_SCRIPT = `// build-sprite.mjs — usage: node build-sprite.mjs ./icons ./public/sprite.svg
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [srcDir, outFile] = process.argv.slice(2);
const INHERITED = ['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'];

const files = (await readdir(srcDir)).filter((f) => f.endsWith('.svg')).sort();

const symbols = await Promise.all(
  files.map(async (file) => {
    const svg = await readFile(path.join(srcDir, file), 'utf8');
    const open = svg.match(/<svg\\b[^>]*>/)?.[0];
    const viewBox = open?.match(/viewBox="([^"]+)"/)?.[1];
    if (!viewBox) throw new Error(\`\${file}: no viewBox\`);

    // Copy root styling attributes so the children still inherit them
    const attrs = INHERITED
      .map((name) => open.match(new RegExp(\`\\\\s\${name}="([^"]*)"\`)))
      .filter(Boolean)
      .map((m) => m[0].trim())
      .join(' ');

    const inner = svg
      .slice(svg.indexOf(open) + open.length, svg.lastIndexOf('</svg>'))
      .replace(/<path stroke="none" d="M0 0h24v24H0z" fill="none"\\s*\\/>/, '') // Tabler's invisible box
      .replace(/\\s*\\n\\s*/g, '')
      .trim();

    const id = \`icon-\${path.basename(file, '.svg')}\`;
    return \`<symbol id="\${id}" viewBox="\${viewBox}" \${attrs}>\${inner}</symbol>\`;
  })
);

await writeFile(outFile, \`<svg xmlns="http://www.w3.org/2000/svg">\${symbols.join('')}</svg>\\n\`);
console.log(\`\${symbols.length} symbols -> \${outFile}\`);`;

const REACT_SPRITE = `// Icon.tsx — sprite served from /public/sprite.svg
type IconName = 'home' | 'bell' | 'search' | 'settings' | 'user';

export function Icon({
  name,
  size = 24,
  label,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & { name: IconName; size?: number; label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      {...props}
    >
      <use href={\`/sprite.svg#icon-\${name}\`} />
    </svg>
  );
}`;

export const post: BlogPost = {
  slug: 'svg-sprites',
  category: 'how-to',
  readingMinutes: 9,
  published: '2026-06-16',
  updated: '2026-09-30',
  related: ['add-icons-to-website', 'reduce-svg-file-size', 'svg-to-react-component'],
  title: { en: 'SVG Sprites: Reuse Icons with <symbol> and <use>', ko: 'SVG 스프라이트: <symbol>과 <use>로 아이콘 재사용' },
  description: {
    en: 'How SVG sprites work, what they actually save (measured with and without gzip), a tested script to build one, styling through the <use> shadow tree, and the same-origin and display:none traps.',
    ko: 'SVG 스프라이트의 동작 원리, 실제로 줄어드는 양(gzip 전후 실측), 검증된 빌드 스크립트, <use> 섀도 트리를 통한 스타일링, 동일 출처와 display:none 함정까지.',
  },
  metaTitle: { en: 'SVG Sprites with <symbol> and <use> | Icony', ko: 'SVG 스프라이트(<symbol>·<use>) 사용법 | Icony' },
  metaDescription: {
    en: 'Build an SVG sprite with <symbol> and <use>: measured size savings, a Node build script, currentColor and two-tone theming, a React <Icon> component, and why external sprites must be same-origin.',
    ko: '<symbol>과 <use>로 SVG 스프라이트 만들기: 실측 용량 비교, Node 빌드 스크립트, currentColor·투톤 테마, React <Icon> 컴포넌트, 외부 스프라이트가 동일 출처여야 하는 이유.',
  },
  blocks: {
    en: [
      { type: 'p', text: 'An SVG sprite is one SVG document that holds many icons as `<symbol>` elements. Anywhere you need an icon, a two-line `<use>` reference points at it by ID. The path data is written once, and every use is a lightweight reference instead of a full copy of the markup.' },
      { type: 'p', text: 'That much is well known. What gets less attention is what a sprite actually saves once gzip is involved, and which of its limitations will cost you an afternoon. This guide covers both, with numbers measured from real Tabler icons (`@tabler/icons` 3.36.1) and a build script tested against that package.' },

      { type: 'h2', text: 'How <symbol> and <use> work' },
      { type: 'p', text: 'A `<symbol>` is a template. It is never rendered by itself, only when a `<use>` element references it. Each symbol gets its own `viewBox`, so a sprite can hold icons drawn on different grids (24-unit Tabler icons next to 16-unit Bootstrap ones) without any conversion. Here is an inline sprite with two icons:' },
      { type: 'code', lang: 'html', code: SPRITE_DEFINE },
      { type: 'p', text: 'Note how the container is hidden: `width="0" height="0"` and `position:absolute`, not `display:none`. In some browsers, gradients, clip paths, masks and filters defined inside a `display:none` subtree fail to render when referenced from elsewhere. Plain stroke icons like these survive either way, but the zero-size approach works for everything, so there is no reason to use the risky one.' },
      { type: 'p', text: 'Then reference the icons wherever you need them:' },
      { type: 'code', lang: 'html', code: SPRITE_USE },
      { type: 'p', text: 'The outer `<svg>` sets the size. It needs no `viewBox` of its own, because the referenced symbol brings one and scales to fill the box. Plain `href` works in every current browser. Only quite old Safari versions needed the legacy `xlink:href`, which you will still see in older documentation, including Tabler’s own sprite docs.' },

      { type: 'h2', text: 'What a sprite actually saves: measured' },
      { type: 'p', text: 'For real numbers, the test used 20 common Tabler outline icons (home, search, user, settings, bell, heart, star, trash, edit, plus, x, check, two chevrons, arrow-left, mail, calendar, download, upload, menu-2) and built a test page that shows each one five times: 100 icons in total. Sizes were measured with `wc -c`, and gzip with `gzip -9c | wc -c`.' },
      { type: 'ul', items: [
        '**Every icon inline:** 31,015 bytes of HTML, **1,151 bytes gzipped**, 340 elements in the markup.',
        '**Inline sprite + 100 `<use>` references:** 12,597 bytes, **1,265 bytes gzipped**.',
        '**External sprite:** the page’s HTML is 7,105 bytes (**256 bytes gzipped**, 200 elements), plus a `sprite.svg` of 5,492 bytes (1,069 gzipped) that is downloaded once and then cached.',
      ] },
      { type: 'p', text: 'The surprising result is the second line. Once gzip is on, an inline sprite transferred slightly more than plain inline icons, because gzip already compresses repeated path data very well. The raw HTML is still 2.5× smaller, which means less to parse, but on the network an inline sprite is roughly a wash.' },
      { type: 'p', text: 'The real saving comes from the external file. After the first page view, each additional page carries only 256 gzipped bytes of icon markup instead of about 1.1 KB, and the sprite comes from cache. On a site where people view many pages, that adds up. On a single-page app it matters much less.' },
      { type: 'p', text: 'One more thing to know: the savings are in the markup, not in rendering. Each `<use>` still creates a copy of the symbol’s content in a shadow tree for the browser to lay out and paint, so a sprite does not make 1,000 icons cheaper to draw.' },

      { type: 'h2', text: 'Only ship the icons you use' },
      { type: 'p', text: 'It is tempting to generate a sprite from an entire icon set. Running the script below over all 4,985 Tabler outline icons produces a 1,840,403-byte `sprite.svg`, about 222 KB gzipped (226,897 bytes). That downloads before the first icon can appear. The five-icon sprite from the same script is 1,841 bytes, or 568 gzipped. Build the sprite from the icons your templates actually reference.' },

      { type: 'h2', text: 'Build the sprite with a script' },
      { type: 'p', text: 'You can build a sprite without any dependency. This Node script (Node 18+, ES modules) reads a folder of SVGs, keeps each file’s `viewBox`, copies the styling attributes the children inherit from the root `<svg>` onto the `<symbol>`, strips Tabler’s invisible bounding-box path, and writes a single file. It produced the sprites measured above, and the 4,985-symbol output passes `xmllint --noout`.' },
      { type: 'code', lang: 'js', code: BUILD_SCRIPT },
      { type: 'p', text: 'The regex approach works for icon sets exported by tools, where every file has the same shape. For hand-drawn or messy files, run SVGO first, and remember to check for `id` attributes inside the icons: two symbols that both define `<clipPath id="a">` will conflict once they share one document. If you prefer an existing tool, `svg-sprite` and `vite-plugin-svg-icons` handle ID prefixing and optimization for you.' },
      { type: 'tip', text: 'Put a content hash in the file name (`sprite.3f9a1c.svg`) and serve it with a long `Cache-Control: max-age`. The sprite then stays cached until an icon actually changes.' },

      { type: 'h2', text: 'Styling through the shadow tree' },
      { type: 'p', text: 'The content a `<use>` produces lives in a shadow tree. That has two consequences, and most sprite styling bugs come from not knowing about them:' },
      { type: 'ul', items: [
        '**Inheritance works.** Properties such as `color`, `fill` and `stroke` flow from the outer `<svg>` into the copy. Because the symbols use `stroke="currentColor"`, setting `color` on a parent recolors the icon, including hover states.',
        '**Selectors do not.** A page rule like `.icon path { stroke: red }` does not match the paths inside the shadow tree. You cannot target “the second path of this icon” from the page.',
        '**Attributes on the symbol beat inherited values.** The symbols above carry `stroke-width="2"`, so `.icon { stroke-width: 1.5 }` has no effect. If you want stroke width controlled from CSS, leave that attribute off the symbol and set it on `.icon` instead.',
      ] },
      { type: 'code', lang: 'css', code: SPRITE_CSS },
      { type: 'p', text: 'For two-tone icons, use CSS custom properties, which also inherit into the shadow tree. Inside the symbol, reference the variable from a `style` attribute (real CSS, so `var()` is supported) with `currentColor` as the fallback:' },
      { type: 'code', lang: 'html', code: TWO_TONE_SYMBOL },
      { type: 'p', text: 'Now `<svg class="icon icon--alert"><use href="#icon-bell-dot"/></svg>` draws the bell in the text color and the dot in red. Without the modifier class, both use the text color.' },

      { type: 'h2', text: 'Inline or external?' },
      { type: 'ul', items: [
        '**Inline sprite:** no extra request, works when a page is opened from `file://`, and gradient IDs resolve without surprises. It is re-sent with every page. Best for single-page apps and small sites.',
        '**External sprite:** one cached file shared by every page. Best for multi-page, server-rendered sites. It must be served from the **same origin** as the page: browsers refuse cross-origin `<use>` references, and CORS headers do not change that. A sprite on a separate CDN domain will not load. Chrome can also block it when you open a page directly from disk, so test on a local server.',
      ] },
      { type: 'p', text: 'If your assets have to live on another domain, fetch the sprite with JavaScript and inject it into the page as an inline sprite. That turns it into the first case.' },

      { type: 'h2', text: 'Using a sprite from React' },
      { type: 'p', text: 'Sprites are not only for plain HTML. In a React app with a lot of repeated icons (a data table with an icon in every row, say), a sprite keeps the path data out of your JavaScript bundle entirely. A tiny typed wrapper keeps call sites clean and prevents typos in icon names:' },
      { type: 'code', lang: 'tsx', code: REACT_SPRITE },
      { type: 'p', text: 'Accessibility works the same as for any inline SVG. Decorative icons get `aria-hidden`, meaningful standalone ones get `role="img"` and a label on the outer `<svg>`. Do not rely on a `<title>` inside the `<symbol>`: text inside the shadow tree is not reliably exposed to assistive technology.' },

      { type: 'h2', text: 'Common mistakes' },
      { type: 'ul', items: [
        '**Hiding the sprite with `display:none`** and then wondering why a gradient icon is blank. Use a zero-size, absolutely positioned container.',
        '**Hosting the sprite on a CDN subdomain.** `<use>` does not follow CORS, so it must be same-origin.',
        '**Hard-coded colors in the symbols.** If a symbol’s paths carry `fill="#000"`, no amount of CSS on `.icon` will recolor them. Convert to `currentColor` when building the sprite.',
        '**Duplicate IDs across symbols.** Masks and gradients from different source files often share names like `a` or `clip0`. Prefix them per icon.',
        '**Shipping the whole icon set.** As measured above, that is about 1.8 MB for Tabler outline alone.',
        '**Forgetting the size on the outer `<svg>`.** Without `width`/`height` (or CSS), the icon falls back to a default size and usually looks far too big.',
      ] },

      { type: 'h2', text: 'When a sprite is the right tool' },
      { type: 'p', text: 'Reach for a sprite when a fixed set of UI icons repeats across many server-rendered pages, when you want icon markup out of your JavaScript bundle, or when you are working without a component framework. If you are already using a component library such as Lucide or Tabler in React, per-icon components are simpler and tree-shake automatically. Only switch to a sprite if profiling shows icon markup is a measurable cost. Tabler even publishes a prebuilt `@tabler/icons-sprite` package, which is handy for prototypes. For production, build your own subset.' },
      { type: 'p', text: 'To assemble a subset without cloning a whole icon repository, you can export the individual SVGs you need, for example from Icony (multi-select, then ZIP), and run them through the build script above.' },

      { type: 'h2', text: 'Takeaway' },
      { type: 'p', text: 'A sprite saves markup, not rendering work. With gzip on, an inline sprite barely beats plain inline icons on transfer size. The real win is an external, cached, same-origin `sprite.svg` that contains only the icons you use. Hide it with zero size rather than `display:none`, theme it with `currentColor` and custom properties, and label icons on the outer `<svg>`.' },
    ],
    ko: [
      { type: 'p', text: 'SVG 스프라이트는 여러 아이콘을 `<symbol>` 요소로 담은 SVG 문서 하나입니다. 아이콘이 필요한 곳에서는 두 줄짜리 `<use>`로 ID를 가리키기만 하면 됩니다. path 데이터는 한 번만 쓰고, 아이콘을 쓸 때마다 마크업 전체를 복사하는 대신 가벼운 참조만 남습니다.' },
      { type: 'p', text: '여기까지는 잘 알려진 내용입니다. 덜 알려진 건 gzip까지 고려했을 때 실제로 얼마나 줄어드는지, 그리고 어떤 제약 때문에 반나절을 날리게 되는지입니다. 이 글은 두 가지를 모두 다룹니다. 수치는 실제 Tabler 아이콘(`@tabler/icons` 3.36.1)으로 측정했고, 빌드 스크립트도 이 패키지로 검증했습니다.' },

      { type: 'h2', text: '<symbol>과 <use>의 동작 방식' },
      { type: 'p', text: '`<symbol>`은 템플릿입니다. 그 자체로는 렌더링되지 않고, `<use>`가 참조할 때만 그려집니다. 심볼마다 `viewBox`를 따로 가지므로 서로 다른 그리드로 그린 아이콘(24단위 Tabler와 16단위 Bootstrap 등)을 변환 없이 한 스프라이트에 넣을 수 있습니다. 아이콘 두 개가 든 인라인 스프라이트는 다음과 같습니다.' },
      { type: 'code', lang: 'html', code: SPRITE_DEFINE },
      { type: 'p', text: '컨테이너를 숨긴 방식을 보세요. `display:none`이 아니라 `width="0" height="0"`과 `position:absolute`입니다. 일부 브라우저에서는 `display:none` 하위 트리에 정의된 그라디언트, clip path, 마스크, 필터를 다른 곳에서 참조하면 렌더링되지 않습니다. 이 예제처럼 선만 있는 아이콘은 어느 쪽이든 괜찮지만, 크기 0 방식은 모든 경우에 동작하니 굳이 위험한 쪽을 쓸 이유가 없습니다.' },
      { type: 'p', text: '이제 필요한 곳에서 아이콘을 참조합니다.' },
      { type: 'code', lang: 'html', code: SPRITE_USE },
      { type: 'p', text: '크기는 바깥쪽 `<svg>`가 정합니다. 참조한 심볼이 자신의 viewBox를 가지고 와서 상자에 맞게 늘어나므로 바깥 `<svg>`에는 `viewBox`가 없어도 됩니다. 현재 브라우저는 모두 그냥 `href`를 지원합니다. 레거시 `xlink:href`는 꽤 오래된 Safari에서만 필요했는데, Tabler의 스프라이트 문서를 비롯한 오래된 자료에는 아직 남아 있습니다.' },

      { type: 'h2', text: '실제로 얼마나 줄어드나: 실측' },
      { type: 'p', text: '실제 수치를 얻기 위해 자주 쓰는 Tabler outline 아이콘 20개(home, search, user, settings, bell, heart, star, trash, edit, plus, x, check, chevron 두 개, arrow-left, mail, calendar, download, upload, menu-2)를 골라, 각각 다섯 번씩 총 100개가 나오는 테스트 페이지를 만들었습니다. 크기는 `wc -c`, gzip 크기는 `gzip -9c | wc -c`로 측정했습니다.' },
      { type: 'ul', items: [
        '**모두 인라인:** HTML 31,015바이트, **gzip 1,151바이트**, 마크업 요소 340개.',
        '**인라인 스프라이트 + `<use>` 참조 100개:** 12,597바이트, **gzip 1,265바이트**.',
        '**외부 스프라이트:** 페이지 HTML 7,105바이트(**gzip 256바이트**, 요소 200개)에 더해, 한 번 받은 뒤 캐시되는 `sprite.svg` 5,492바이트(gzip 1,069바이트).',
      ] },
      { type: 'p', text: '의외인 건 두 번째 줄입니다. gzip을 켜면 인라인 스프라이트가 그냥 인라인으로 넣은 아이콘보다 오히려 조금 더 많이 전송됐습니다. 반복되는 path 데이터는 gzip이 이미 아주 잘 압축하기 때문입니다. 원본 HTML은 여전히 2.5배 작아서 파싱할 양은 줄지만, 네트워크 전송량으로는 거의 차이가 없습니다.' },
      { type: 'p', text: '진짜 이득은 외부 파일에서 나옵니다. 첫 페이지를 본 뒤로는 페이지마다 아이콘 마크업이 약 1.1KB 대신 gzip 256바이트만 오가고, 스프라이트는 캐시에서 나옵니다. 사용자가 여러 페이지를 둘러보는 사이트라면 이 차이가 쌓이고, 싱글 페이지 앱이라면 훨씬 덜 중요합니다.' },
      { type: 'p', text: '하나 더 알아 둘 점이 있습니다. 줄어드는 건 마크업이지 렌더링 비용이 아닙니다. `<use>`마다 브라우저는 심볼 내용을 섀도 트리에 복사해 레이아웃하고 그리므로, 스프라이트를 쓴다고 아이콘 1,000개를 그리는 비용이 줄지는 않습니다.' },

      { type: 'h2', text: '쓰는 아이콘만 넣기' },
      { type: 'p', text: '아이콘 세트 전체로 스프라이트를 만들고 싶어지기 쉽습니다. 아래 스크립트로 Tabler outline 아이콘 4,985개를 전부 넣으면 `sprite.svg`가 1,840,403바이트, gzip으로도 약 222KB(226,897바이트)가 됩니다. 첫 아이콘이 보이기 전에 이걸 다 받아야 합니다. 같은 스크립트로 아이콘 다섯 개만 넣으면 1,841바이트, gzip 568바이트입니다. 템플릿에서 실제로 참조하는 아이콘만으로 만드세요.' },

      { type: 'h2', text: '스크립트로 스프라이트 만들기' },
      { type: 'p', text: '의존성 없이도 스프라이트를 만들 수 있습니다. 아래 Node 스크립트(Node 18 이상, ES 모듈)는 SVG 폴더를 읽어 파일마다 `viewBox`를 유지하고, 자식들이 루트 `<svg>`에서 상속받던 스타일 속성을 `<symbol>`로 옮기고, Tabler의 투명 테두리 path를 지운 뒤 파일 하나로 씁니다. 위에서 측정한 스프라이트가 이 스크립트로 만든 것이고, 심볼 4,985개짜리 결과물도 `xmllint --noout` 검사를 통과했습니다.' },
      { type: 'code', lang: 'js', code: BUILD_SCRIPT },
      { type: 'p', text: '정규식 방식은 도구가 내보내 모든 파일의 구조가 같은 아이콘 세트에서 잘 동작합니다. 손으로 그렸거나 구조가 제각각인 파일이라면 먼저 SVGO를 돌리세요. 아이콘 안의 `id` 속성도 확인해야 합니다. 두 심볼이 모두 `<clipPath id="a">`를 정의하면 한 문서에 들어가는 순간 충돌합니다. 기존 도구를 쓰고 싶다면 `svg-sprite`나 `vite-plugin-svg-icons`가 ID 접두사와 최적화까지 처리해 줍니다.' },
      { type: 'tip', text: '파일 이름에 콘텐츠 해시를 넣고(`sprite.3f9a1c.svg`) 긴 `Cache-Control: max-age`로 제공하세요. 아이콘이 실제로 바뀌기 전까지 스프라이트가 캐시에 남습니다.' },

      { type: 'h2', text: '섀도 트리를 통한 스타일링' },
      { type: 'p', text: '`<use>`가 만든 내용은 섀도 트리 안에 있습니다. 여기서 두 가지 결과가 생기는데, 스프라이트 스타일 버그는 대부분 이걸 몰라서 생깁니다.' },
      { type: 'ul', items: [
        '**상속은 됩니다.** `color`, `fill`, `stroke` 같은 속성은 바깥 `<svg>`에서 복사본으로 흘러 들어갑니다. 심볼이 `stroke="currentColor"`를 쓰므로 부모에 `color`를 지정하면 호버 상태까지 포함해 아이콘 색이 바뀝니다.',
        '**선택자는 안 됩니다.** 페이지의 `.icon path { stroke: red }` 같은 규칙은 섀도 트리 안의 path에 적용되지 않습니다. 페이지에서 ‘이 아이콘의 두 번째 path’를 골라 스타일을 줄 수는 없습니다.',
        '**심볼에 있는 속성이 상속값보다 우선합니다.** 위 심볼에는 `stroke-width="2"`가 붙어 있어서 `.icon { stroke-width: 1.5 }`를 줘도 변화가 없습니다. 선 두께를 CSS로 조절하고 싶다면 심볼에서 그 속성을 빼고 `.icon`에 지정하세요.',
      ] },
      { type: 'code', lang: 'css', code: SPRITE_CSS },
      { type: 'p', text: '투톤 아이콘에는 CSS 사용자 정의 속성을 쓰세요. 이것도 섀도 트리 안으로 상속됩니다. 심볼 안에서는 `style` 속성(진짜 CSS라서 `var()`가 동작)으로 변수를 참조하고, 대체값으로 `currentColor`를 둡니다.' },
      { type: 'code', lang: 'html', code: TWO_TONE_SYMBOL },
      { type: 'p', text: '이제 `<svg class="icon icon--alert"><use href="#icon-bell-dot"/></svg>`는 종을 글자색으로, 점을 빨간색으로 그립니다. 수정자 클래스가 없으면 둘 다 글자색입니다.' },

      { type: 'h2', text: '인라인 vs 외부 파일' },
      { type: 'ul', items: [
        '**인라인 스프라이트:** 추가 요청이 없고, `file://`로 연 페이지에서도 동작하며, 그라디언트 ID도 예상대로 연결됩니다. 대신 페이지마다 다시 전송됩니다. 싱글 페이지 앱이나 작은 사이트에 적합합니다.',
        '**외부 스프라이트:** 모든 페이지가 캐시된 파일 하나를 공유합니다. 여러 페이지로 된 서버 렌더링 사이트에 적합합니다. 단, 페이지와 **동일 출처**에서 제공해야 합니다. 브라우저는 교차 출처 `<use>` 참조를 거부하고, CORS 헤더를 붙여도 달라지지 않습니다. 별도 CDN 도메인에 올린 스프라이트는 불러오지 못합니다. 디스크에서 페이지를 바로 열 때도 Chrome이 막을 수 있으니 로컬 서버에서 테스트하세요.',
      ] },
      { type: 'p', text: '에셋을 꼭 다른 도메인에 둬야 한다면, JavaScript로 스프라이트를 받아 페이지에 인라인 스프라이트로 넣으세요. 그러면 첫 번째 경우가 됩니다.' },

      { type: 'h2', text: 'React에서 스프라이트 쓰기' },
      { type: 'p', text: '스프라이트는 순수 HTML 전용이 아닙니다. 행마다 아이콘이 들어가는 데이터 테이블처럼 아이콘이 많이 반복되는 React 앱에서는 스프라이트를 쓰면 path 데이터가 JavaScript 번들에서 완전히 빠집니다. 타입이 있는 작은 래퍼를 두면 호출부가 깔끔해지고 아이콘 이름 오타도 막을 수 있습니다.' },
      { type: 'code', lang: 'tsx', code: REACT_SPRITE },
      { type: 'p', text: '접근성은 일반 인라인 SVG와 같습니다. 장식용 아이콘에는 `aria-hidden`을, 혼자 의미를 전달하는 아이콘에는 바깥 `<svg>`에 `role="img"`와 레이블을 붙입니다. `<symbol>` 안의 `<title>`에 기대지 마세요. 섀도 트리 안의 텍스트는 보조 기술에 안정적으로 전달되지 않습니다.' },

      { type: 'h2', text: '흔한 실수' },
      { type: 'ul', items: [
        '**`display:none`으로 스프라이트를 숨겨** 놓고 그라디언트 아이콘이 왜 비어 보이는지 고민하는 경우. 크기 0에 절대 위치로 둔 컨테이너를 쓰세요.',
        '**CDN 서브도메인에 스프라이트 올리기.** `<use>`는 CORS를 따르지 않으므로 동일 출처여야 합니다.',
        '**심볼에 하드코딩된 색.** 심볼의 path에 `fill="#000"`이 붙어 있으면 `.icon`에 CSS를 아무리 줘도 색이 바뀌지 않습니다. 스프라이트를 만들 때 `currentColor`로 바꾸세요.',
        '**심볼 간 ID 중복.** 서로 다른 원본 파일의 마스크나 그라디언트가 `a`, `clip0` 같은 이름을 함께 쓰는 경우가 많습니다. 아이콘별로 접두사를 붙이세요.',
        '**아이콘 세트 전체 배포.** 위 측정대로 Tabler outline만으로도 약 1.8MB입니다.',
        '**바깥 `<svg>` 크기 누락.** `width`·`height`(또는 CSS)가 없으면 기본 크기로 그려져 대개 지나치게 커 보입니다.',
      ] },

      { type: 'h2', text: '스프라이트가 맞는 경우' },
      { type: 'p', text: '고정된 UI 아이콘 세트가 서버 렌더링 페이지 여러 곳에 반복될 때, 아이콘 마크업을 JavaScript 번들에서 빼고 싶을 때, 컴포넌트 프레임워크 없이 작업할 때 스프라이트를 쓰세요. React에서 Lucide나 Tabler 같은 컴포넌트 라이브러리를 이미 쓰고 있다면 아이콘별 컴포넌트가 더 단순하고 트리셰이킹도 자동입니다. 프로파일링에서 아이콘 마크업이 측정 가능한 비용으로 나올 때만 스프라이트로 바꾸세요. Tabler는 미리 만든 `@tabler/icons-sprite` 패키지도 제공해서 프로토타입에는 편하지만, 운영 환경이라면 필요한 것만 골라 직접 만드세요.' },
      { type: 'p', text: '아이콘 저장소 전체를 받지 않고 필요한 것만 모으려면, 예를 들어 Icony에서 필요한 SVG만 여러 개 선택해 ZIP으로 내보낸 뒤 위 빌드 스크립트에 넣으면 됩니다.' },

      { type: 'h2', text: '정리' },
      { type: 'p', text: '스프라이트는 렌더링 비용이 아니라 마크업을 줄입니다. gzip을 켜면 인라인 스프라이트는 그냥 인라인 아이콘보다 전송량에서 거의 이득이 없습니다. 진짜 이득은 쓰는 아이콘만 담은, 캐시되는 동일 출처의 외부 `sprite.svg`에서 나옵니다. `display:none` 대신 크기 0으로 숨기고, `currentColor`와 사용자 정의 속성으로 테마를 입히고, 레이블은 바깥 `<svg>`에 붙이세요.' },
    ],
  },
};
