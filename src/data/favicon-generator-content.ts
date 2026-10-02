import type { BlogBlock, L } from './blog/types';
import type { FaqItem } from './faq-content';
import { buildHeadSnippet } from '../utils/favicon/manifest';

// Explanatory content for /favicon-generator. Rendered with ContentBlocks
// below the tool so the page carries real prose for crawlers and readers.
// The FAQ at the end is built from the lists below so the visible text and
// the FAQPage JSON-LD (English) can never drift apart.

export const FAVICON_GENERATOR_FAQ_EN: FaqItem[] = [
  {
    question: 'Is the generator free, and are my icons uploaded anywhere?',
    answer:
      'It is free, needs no account, and adds no watermark. The icon is composed, rasterized, and zipped inside your browser, so nothing is uploaded to a server.',
  },
  {
    question: 'Do I need all eight files?',
    answer:
      'Not strictly. favicon.ico, favicon.svg, and apple-touch-icon.png cover browsers, Google Search, and iOS. The 192 and 512 pixel icons and the manifest only matter if you want the site to be installable as an app.',
  },
  {
    question: 'Why does my favicon still show the old icon after I replace it?',
    answer:
      'Browsers cache favicons separately from the page. Check in a private window, add a version to the link (for example /favicon.svg?v=2), and expect Google Search to refresh its copy on its own schedule.',
  },
  {
    question: 'Can I use an outline icon?',
    answer:
      'You can, but thin strokes turn into grey smudges at 16 pixels. A filled icon on a solid tile stays readable, which is why the generator defaults to a filled library.',
  },
  {
    question: 'Can I use the generated icons commercially?',
    answer:
      'The icon libraries are open source under MIT or ISC licenses, which allow commercial use. Check the license page of the library you picked for its attribution notes.',
  },
];

export const FAVICON_GENERATOR_FAQ_KO: FaqItem[] = [
  {
    question: '생성기는 무료인가요? 아이콘이 어딘가에 업로드되나요?',
    answer:
      '무료이고 계정도 워터마크도 필요 없습니다. 아이콘 합성, 이미지 변환, ZIP 압축이 모두 브라우저 안에서 이루어지므로 서버로 올라가는 것은 없습니다.',
  },
  {
    question: '여덟 개 파일이 전부 필요한가요?',
    answer:
      '꼭 그렇지는 않습니다. favicon.ico, favicon.svg, apple-touch-icon.png만 있어도 브라우저, Google 검색, iOS를 커버합니다. 192·512px 아이콘과 매니페스트는 사이트를 앱처럼 설치할 수 있게 하려는 경우에만 필요합니다.',
  },
  {
    question: '아이콘을 바꿨는데 예전 파비콘이 그대로 보여요.',
    answer:
      '브라우저는 파비콘을 페이지와 따로 캐시합니다. 시크릿 창에서 확인하고, 링크에 버전(예: /favicon.svg?v=2)을 붙여 보세요. Google 검색의 아이콘은 자체 일정에 따라 갱신됩니다.',
  },
  {
    question: '외곽선 아이콘을 써도 되나요?',
    answer:
      '쓸 수는 있지만 얇은 선은 16px에서 회색 얼룩처럼 뭉개집니다. 단색 타일 위의 채워진 아이콘은 작은 크기에서도 또렷해서, 생성기도 기본값으로 채워진 라이브러리를 씁니다.',
  },
  {
    question: '만든 아이콘을 상업적으로 써도 되나요?',
    answer:
      '아이콘 라이브러리는 MIT 또는 ISC 오픈소스 라이선스라 상업적 이용이 가능합니다. 출처 표기 조건은 고른 라이브러리의 라이선스 페이지에서 확인하세요.',
  },
];

const HTML_SNIPPET = buildHeadSnippet();

const NEXT_TREE = `app/
  favicon.ico            <- from the ZIP
  icon.svg               <- rename favicon.svg
  apple-icon.png         <- rename apple-touch-icon.png
public/
  icon-192.png
  icon-512.png
  icon-maskable-512.png
  site.webmanifest`;

const NEXT_MANIFEST = `// app/layout.tsx
export const metadata = {
  manifest: '/site.webmanifest',
};`;

const NEXT_TREE_KO = `app/
  favicon.ico            <- ZIP 안의 파일
  icon.svg               <- favicon.svg 이름 변경
  apple-icon.png         <- apple-touch-icon.png 이름 변경
public/
  icon-192.png
  icon-512.png
  icon-maskable-512.png
  site.webmanifest`;

const faqBlocks = (items: FaqItem[]): BlogBlock[] =>
  items.map((i) => ({ type: 'p', text: `**${i.question}** ${i.answer}` }));

export const FAVICON_GENERATOR_CONTENT: L<BlogBlock[]> = {
  en: [
    { type: 'h2', text: 'What you get in the ZIP' },
    { type: 'p', text: "One click produces eight files, and each one answers a specific question a browser, a search engine, or a phone will ask about your site." },
    { type: 'ul', items: [
      "**`favicon.ico`** holds 16, 32, and 48 pixel images in a single file. It is the universal fallback: older browsers request it by default, and Google Search can use it because it lists ICO and PNG, not SVG, among its supported formats.",
      "**`favicon.svg`** is the vector version. Chromium browsers and Firefox have used SVG favicons for years, and Safari added support in version 26. It stays sharp on high-density screens at any tab size.",
      "**`apple-touch-icon.png`** is a 180 by 180 PNG for the iOS and iPadOS home screen. It is opaque on purpose, because iOS does not keep transparency and fills empty corners with black.",
      "**`icon-192.png` and `icon-512.png`** are the icons an installed web app reads from its manifest, used on Android launchers and splash screens.",
      "**`icon-maskable-512.png`** is a full-bleed version that the operating system can crop into a circle or squircle without cutting off your mark.",
      "**`site.webmanifest`** names your app and points to the three PNGs above, with theme and background colors filled in.",
      "**`head-snippet.html`** is the four `<link>` tags that wire everything up, ready to paste.",
    ] },
    { type: 'p', text: "For the reasoning behind this file set and a script-based alternative, read our guide on how to make a favicon from an icon." },
    { type: 'link', href: '/blog/make-a-favicon', text: 'Read the guide: How to Make a Favicon from an Icon' },

    { type: 'h2', text: 'How to use the generator' },
    { type: 'ol', items: [
      "**Pick a main icon.** Choose a library, search by name, and click the result. The default library is a filled set because filled shapes survive at tiny sizes.",
      "**Style the tile.** Set the background color, switch between square, rounded, and circle shapes, and adjust corner radius and padding. A solid tile gives the icon contrast on both light and dark tab bars.",
      "**Optionally add a badge.** A small second icon in one corner can mark a variant such as a beta build or a notification state. Choose its corner, size, and color. The badge sits on a disc with a ring in the tile color so it stays legible.",
      "**Check the previews.** The browser tab mock shows the real 16 pixel rendering, next to 32 pixel, home-screen, and large versions.",
      "**Fill in the app name and download.** The name and short name go into the manifest. Download the ZIP, or just copy the HTML snippet if your files are already in place.",
    ] },

    { type: 'h2', text: 'Install the files' },
    { type: 'p', text: "Unzip the bundle first. Every setup below assumes the files end up at the root of your site, which is where browsers and crawlers look for them." },
    { type: 'p', text: "**Plain HTML.** Upload all the files to your web root, then paste the contents of `head-snippet.html` inside the `<head>` of every page, or at least your home page." },
    { type: 'code', lang: 'html', code: HTML_SNIPPET },
    { type: 'p', text: "**Next.js App Router.** Next.js generates the link tags when it finds specially named files in `app/`, so you skip the snippet. Put the ICO, SVG, and Apple icon in `app/` with the names below and keep the manifest files in `public/`." },
    { type: 'code', lang: 'text', code: NEXT_TREE },
    { type: 'code', lang: 'ts', code: NEXT_MANIFEST },
    { type: 'p', text: "**WordPress and other CMSs.** Most CMSs have a single site icon field and will generate their own sizes from one upload. In WordPress, open Appearance, then Customize, then Site Identity, and upload `icon-512.png` as the Site Icon. For full control, a child theme or a header-injection plugin lets you paste the snippet and upload the other files to the web root through your host's file manager. Website builders such as Shopify and Squarespace expose a favicon field as well, usually accepting a square PNG or ICO." },

    { type: 'h2', text: 'Sizes explained' },
    { type: 'ul', items: [
      "**16 and 32 pixels** are what tabs, bookmarks, and history lists actually draw. The 32 pixel image serves high-density displays.",
      "**48 pixels** is the size Windows and some desktop shortcuts prefer, and Google asks for favicons larger than 48 by 48 when possible.",
      "**180 pixels** is the iOS home-screen icon, rendered with the system's rounded corners applied for you.",
      "**192 and 512 pixels** are the manifest sizes Android and desktop installs use for launchers, task switchers, and splash screens.",
      "**512 maskable** exists because Android may crop the icon into any shape. The spec reserves a safe zone, a centered circle whose radius is 40 percent of the icon width. The generator extends the tile color to the edges and scales your mark to sit inside that circle.",
    ] },

    { type: 'h2', text: 'Design tips for 16 pixels' },
    { type: 'p', text: "A favicon is judged at a size smaller than most thumbnails, so a few rules matter more than any styling choice." },
    { type: 'ul', items: [
      "**Prefer fill icons.** Outline icons with one or two pixel strokes dissolve into partial pixels at 16 pixels. A filled glyph on a solid tile keeps large areas of flat color.",
      "**Expect the badge to disappear.** Even a small badge covers only a few pixels at 16 pixels and mostly adds noise. Leave the option to hide it at 16 pixels switched on, so tabs get the clean main icon while larger sizes keep the badge.",
      "**Keep contrast high.** Choose an icon color and a tile color with a clear lightness difference. White on a saturated mid-dark color is a safe starting point and reads on both light and dark browser chrome.",
      "**Mind the padding.** Roughly 10 to 15 percent on each side avoids a cramped look. Too much padding shrinks the mark to almost nothing in a tab, so lower it before you pick a simpler icon.",
      "**One idea only.** A single recognizable shape works. Words, taglines, and multi-part illustrations do not.",
    ] },

    { type: 'h2', text: 'FAQ' },
    ...faqBlocks(FAVICON_GENERATOR_FAQ_EN),
  ],
  ko: [
    { type: 'h2', text: 'ZIP에 담기는 파일' },
    { type: 'p', text: "한 번 누르면 파일 여덟 개가 만들어집니다. 각각은 브라우저, 검색엔진, 스마트폰이 사이트에 대해 던지는 서로 다른 질문에 답합니다." },
    { type: 'ul', items: [
      "**`favicon.ico`** 하나에 16·32·48px 이미지가 함께 들어 있습니다. 모든 환경의 기본 대체 파일로, 오래된 브라우저는 이 파일부터 요청하고 Google 검색은 지원 형식에 SVG가 없고 ICO와 PNG가 있어서 이 파일을 씁니다.",
      "**`favicon.svg`** 는 벡터 버전입니다. Chromium 계열 브라우저와 Firefox는 오래전부터 SVG 파비콘을 지원했고 Safari는 26 버전에서 지원을 추가했습니다. 고해상도 화면에서도 어떤 탭 크기든 선명합니다.",
      "**`apple-touch-icon.png`** 는 iOS·iPadOS 홈 화면용 180×180 PNG입니다. iOS는 투명도를 유지하지 않고 빈 모서리를 검게 채우기 때문에 일부러 불투명하게 만듭니다.",
      "**`icon-192.png`와 `icon-512.png`** 는 설치된 웹 앱이 매니페스트에서 읽는 아이콘으로, 안드로이드 런처와 스플래시 화면에 쓰입니다.",
      "**`icon-maskable-512.png`** 는 가장자리까지 꽉 채운 버전으로, 운영체제가 원형이나 스쿼클로 잘라도 심볼이 잘리지 않습니다.",
      "**`site.webmanifest`** 는 앱 이름을 적고 위 PNG 세 개를 가리키며, 테마 색과 배경색도 채워 줍니다.",
      "**`head-snippet.html`** 은 모든 것을 연결하는 `<link>` 태그 네 줄로, 그대로 붙여 넣으면 됩니다.",
    ] },
    { type: 'p', text: "이 파일 구성을 고른 이유와 스크립트로 직접 만드는 방법은 아래 가이드에서 자세히 다룹니다." },
    { type: 'link', href: '/blog/make-a-favicon', text: '가이드 읽기: 아이콘으로 파비콘 만드는 방법' },

    { type: 'h2', text: '생성기 사용 방법' },
    { type: 'ol', items: [
      "**메인 아이콘을 고르세요.** 라이브러리를 선택하고 이름으로 검색한 뒤 결과를 클릭합니다. 작은 크기에서도 형태가 유지되는 채워진 라이브러리가 기본값입니다.",
      "**타일을 꾸미세요.** 배경색을 정하고 사각형, 둥근 사각형, 원형 중에서 고른 뒤 모서리 둥글기와 여백을 조절합니다. 단색 타일은 밝은 탭과 어두운 탭 모두에서 아이콘의 대비를 확보해 줍니다.",
      "**필요하면 배지를 더하세요.** 모서리에 작은 아이콘을 하나 더 얹어 베타 빌드나 알림 상태 같은 변형을 표시할 수 있습니다. 위치, 크기, 색을 고르면 되고, 배지는 타일 색 테두리를 두른 원판 위에 놓여 알아보기 쉽습니다.",
      "**미리보기를 확인하세요.** 브라우저 탭 목업은 실제 16px 렌더링을 보여 주고, 옆에 32px, 홈 화면, 큰 버전이 함께 나옵니다.",
      "**앱 이름을 적고 내려받으세요.** 이름과 짧은 이름은 매니페스트에 들어갑니다. ZIP을 받거나, 파일을 이미 배치했다면 HTML 스니펫만 복사해도 됩니다.",
    ] },

    { type: 'h2', text: '파일 설치하기' },
    { type: 'p', text: "먼저 ZIP을 풉니다. 아래 방법은 모두 파일이 사이트 루트에 놓인다고 가정합니다. 브라우저와 크롤러가 찾아보는 위치가 바로 거기입니다." },
    { type: 'p', text: "**일반 HTML.** 모든 파일을 웹 루트에 올린 뒤 `head-snippet.html`의 내용을 모든 페이지, 최소한 홈페이지의 `<head>` 안에 붙여 넣습니다." },
    { type: 'code', lang: 'html', code: HTML_SNIPPET },
    { type: 'p', text: "**Next.js App Router.** `app/` 폴더에서 약속된 이름의 파일을 찾으면 Next.js가 link 태그를 알아서 만들어 주므로 스니펫은 필요 없습니다. ICO, SVG, Apple 아이콘은 아래 이름으로 `app/`에 두고, 매니페스트 관련 파일은 `public/`에 둡니다." },
    { type: 'code', lang: 'text', code: NEXT_TREE_KO },
    { type: 'code', lang: 'ts', code: NEXT_MANIFEST },
    { type: 'p', text: "**워드프레스와 기타 CMS.** 대부분의 CMS에는 사이트 아이콘 입력란이 하나 있고, 업로드한 이미지 한 장에서 필요한 크기를 알아서 만듭니다. 워드프레스에서는 외모, 사용자 정의하기, 사이트 아이덴티티 순서로 열어 `icon-512.png`를 사이트 아이콘으로 올리면 됩니다. 세밀하게 제어하고 싶다면 차일드 테마나 헤더 삽입 플러그인으로 스니펫을 붙여 넣고, 나머지 파일은 호스팅의 파일 관리자로 웹 루트에 올리세요. Shopify나 Squarespace 같은 웹사이트 빌더도 파비콘 입력란을 제공하며, 보통 정사각형 PNG나 ICO를 받습니다." },

    { type: 'h2', text: '크기별 용도' },
    { type: 'ul', items: [
      "**16px와 32px** 는 탭, 북마크, 방문 기록에서 실제로 그려지는 크기입니다. 32px 이미지는 고밀도 디스플레이를 담당합니다.",
      "**48px** 는 윈도우와 일부 데스크톱 바로가기가 선호하는 크기이고, Google도 가능하면 48×48보다 큰 파비콘을 권장합니다.",
      "**180px** 는 iOS 홈 화면 아이콘으로, 둥근 모서리는 시스템이 알아서 입힙니다.",
      "**192px와 512px** 는 안드로이드와 데스크톱 설치에서 런처, 작업 전환기, 스플래시 화면에 쓰는 매니페스트 크기입니다.",
      "**512 마스커블** 은 안드로이드가 아이콘을 어떤 모양으로든 자를 수 있어서 존재합니다. 사양은 안전 영역을 정해 두는데, 아이콘 너비의 40퍼센트를 반지름으로 하는 가운데 원입니다. 생성기는 타일 색을 가장자리까지 채우고 심볼을 그 원 안에 들어가도록 줄입니다.",
    ] },

    { type: 'h2', text: '16px를 위한 디자인 팁' },
    { type: 'p', text: "파비콘은 대부분의 썸네일보다 작은 크기에서 평가받습니다. 그래서 어떤 스타일링 선택보다 몇 가지 원칙이 더 중요합니다." },
    { type: 'ul', items: [
      "**채워진 아이콘을 쓰세요.** 선 두께가 1~2px인 외곽선 아이콘은 16px에서 반쯤 칠해진 픽셀로 흩어집니다. 단색 타일 위의 채워진 글리프는 넓은 면을 유지합니다.",
      "**배지는 사라진다고 생각하세요.** 작은 배지도 16px에서는 몇 픽셀만 차지해 잡음이 되기 쉽습니다. 16px에서 숨기는 옵션을 켜 두면 탭에는 깔끔한 메인 아이콘이, 큰 크기에는 배지가 함께 들어갑니다.",
      "**대비를 높게 유지하세요.** 아이콘 색과 타일 색은 밝기 차이가 분명해야 합니다. 채도 있는 중간~어두운 색 위의 흰색은 안전한 출발점이고, 밝은 브라우저 UI와 어두운 UI 모두에서 읽힙니다.",
      "**여백을 살피세요.** 사방 10~15퍼센트 정도면 답답해 보이지 않습니다. 여백이 너무 크면 탭에서 심볼이 거의 보이지 않으니, 더 단순한 아이콘을 찾기 전에 여백부터 줄여 보세요.",
      "**아이디어는 하나만.** 알아볼 수 있는 모양 하나면 충분합니다. 글자, 슬로건, 여러 요소로 된 일러스트는 맞지 않습니다.",
    ] },

    { type: 'h2', text: '자주 묻는 질문' },
    ...faqBlocks(FAVICON_GENERATOR_FAQ_KO),
  ],
};
