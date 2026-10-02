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
      "Yes, it's free. You don't need an account, and there's no watermark. The icon is composed, rasterized, and zipped in your browser, so nothing is uploaded to a server.",
  },
  {
    question: 'Do I need all eight files?',
    answer:
      'Not strictly. favicon.ico, favicon.svg, and apple-touch-icon.png cover browsers, Google Search, and iOS. You only need the 192 and 512 pixel icons and the manifest if you want the site to be installable as an app.',
  },
  {
    question: 'Why does my favicon still show the old icon after I replace it?',
    answer:
      'Browsers cache favicons separately from the page. Check in a private window and add a version to the link (for example /favicon.svg?v=2). Google Search refreshes its copy on its own schedule.',
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
      '무료입니다. 계정이 필요 없고 워터마크도 붙지 않습니다. 아이콘 합성, 이미지 변환, ZIP 압축을 모두 브라우저 안에서 처리하므로 서버로 올라가는 것은 없습니다.',
  },
  {
    question: '여덟 개 파일이 전부 필요한가요?',
    answer:
      '꼭 그렇지는 않습니다. favicon.ico, favicon.svg, apple-touch-icon.png만 있어도 브라우저, Google 검색, iOS는 해결됩니다. 192·512px 아이콘과 매니페스트는 사이트를 앱처럼 설치할 수 있게 하려는 경우에만 필요합니다.',
  },
  {
    question: '아이콘을 바꿨는데 예전 파비콘이 그대로 보여요.',
    answer:
      '브라우저는 파비콘을 페이지와 따로 캐시합니다. 시크릿 창에서 확인하고, 링크에 버전(예: /favicon.svg?v=2)을 붙여 보세요. Google 검색에 나오는 아이콘은 Google이 자체 일정에 따라 갱신합니다.',
  },
  {
    question: '외곽선 아이콘을 써도 되나요?',
    answer:
      '쓸 수는 있지만 얇은 선은 16px에서 회색 얼룩처럼 뭉개집니다. 단색 타일 위에 채워진 아이콘을 올리면 작은 크기에서도 또렷합니다. 생성기가 채워진 라이브러리를 기본값으로 쓰는 것도 그래서입니다.',
  },
  {
    question: '만든 아이콘을 상업적으로 써도 되나요?',
    answer:
      '아이콘 라이브러리는 MIT 또는 ISC 오픈소스 라이선스라 상업적으로 써도 됩니다. 출처 표기 조건은 고른 라이브러리의 라이선스 페이지에서 확인하세요.',
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
    { type: 'p', text: "One click gives you eight files. Each one covers something a browser, a search engine, or a phone looks for on your site." },
    { type: 'ul', items: [
      "**`favicon.ico`** holds 16, 32, and 48 pixel images in one file. It's the universal fallback. Older browsers request it by default, and Google Search can use it because its supported formats include ICO and PNG but not SVG.",
      "**`favicon.svg`** is the vector version. Chromium browsers and Firefox have supported SVG favicons for years, and Safari added support in version 26. It stays sharp on high-density screens at any tab size.",
      "**`apple-touch-icon.png`** is a 180 by 180 PNG for the iOS and iPadOS home screen. It's opaque on purpose, because iOS drops transparency and fills empty corners with black.",
      "**`icon-192.png` and `icon-512.png`** are the icons an installed web app reads from its manifest. Android uses them on launchers and splash screens.",
      "**`icon-maskable-512.png`** is a full-bleed version that the operating system can crop into a circle or squircle without cutting off your mark.",
      "**`site.webmanifest`** names your app and points to the three PNGs above, with theme and background colors filled in.",
      "**`head-snippet.html`** contains the four `<link>` tags that wire everything up. Paste it as is.",
    ] },
    { type: 'p', text: "Our guide on making a favicon from an icon explains why the bundle has these files and shows a script-based alternative." },
    { type: 'link', href: '/blog/make-a-favicon', text: 'Read the guide: How to Make a Favicon from an Icon' },

    { type: 'h2', text: 'How to use the generator' },
    { type: 'ol', items: [
      "**Pick a main icon.** Choose a library, search by name, and click the result. The default library is a filled set, since filled shapes survive at tiny sizes.",
      "**Style the tile.** Set the background color, choose a square, rounded, or circle shape, then adjust corner radius and padding. A solid tile keeps the icon visible on both light and dark tab bars.",
      "**Add a badge if you want one.** A small second icon in one corner can mark a variant, such as a beta build or a notification state. Choose its corner, size, and color. The badge sits on a disc ringed in the tile color so it stays legible.",
      "**Check the previews.** The browser tab mock shows the real 16 pixel rendering. Next to it are the 32 pixel, home-screen, and large versions.",
      "**Fill in the app name and download.** The name and short name go into the manifest. Download the ZIP, or copy only the HTML snippet if your files are already in place.",
    ] },

    { type: 'h2', text: 'Install the files' },
    { type: 'p', text: "Unzip the bundle first. Every setup below assumes the files end up at the root of your site, because that's where browsers and crawlers look for them." },
    { type: 'p', text: "**Plain HTML.** Upload all the files to your web root. Then paste the contents of `head-snippet.html` into the `<head>` of every page, or at least your home page." },
    { type: 'code', lang: 'html', code: HTML_SNIPPET },
    { type: 'p', text: "**Next.js App Router.** Next.js writes the link tags itself when it finds specially named files in `app/`, so you don't need the snippet. Put the ICO, SVG, and Apple icon in `app/` under the names below, and keep the manifest files in `public/`." },
    { type: 'code', lang: 'text', code: NEXT_TREE },
    { type: 'code', lang: 'ts', code: NEXT_MANIFEST },
    { type: 'p', text: "**WordPress and other CMSs.** Most CMSs have a single site icon field and generate their own sizes from one upload. In WordPress, open Appearance, then Customize, then Site Identity, and upload `icon-512.png` as the Site Icon." },
    { type: 'p', text: "For full control, use a child theme or a header-injection plugin to paste the snippet, and upload the other files to the web root with your host's file manager. Website builders such as Shopify and Squarespace also have a favicon field, which usually takes a square PNG or ICO." },

    { type: 'h2', text: 'Sizes explained' },
    { type: 'ul', items: [
      "**16 and 32 pixels** are what tabs, bookmarks, and history lists actually draw. The 32 pixel image is for high-density displays.",
      "**48 pixels** is the size Windows and some desktop shortcuts prefer. Google also asks for favicons larger than 48 by 48 when possible.",
      "**180 pixels** is the iOS home-screen icon. The system applies the rounded corners for you.",
      "**192 and 512 pixels** are the manifest sizes Android and desktop installs use for launchers, task switchers, and splash screens.",
      "**512 maskable** exists because Android may crop the icon into any shape. The spec reserves a safe zone, a centered circle whose radius is 40 percent of the icon width. The generator extends the tile color to the edges and scales your mark to fit inside that circle.",
    ] },

    { type: 'h2', text: 'Design tips for 16 pixels' },
    { type: 'p', text: "Most people see a favicon at a size smaller than a thumbnail. At that size, a few rules matter more than any styling choice." },
    { type: 'ul', items: [
      "**Prefer filled icons.** Outline icons with one or two pixel strokes break up into partial pixels at 16 pixels. A filled glyph on a solid tile keeps large areas of flat color.",
      "**Expect the badge to disappear.** At 16 pixels even a small badge covers only a few pixels and mostly adds noise. Leave the option to hide it at 16 pixels switched on, so tabs get the clean main icon while larger sizes keep the badge.",
      "**Keep contrast high.** Pick an icon color and a tile color with a clear difference in lightness. White on a saturated mid-to-dark color is a safe start, and it reads on both light and dark browser chrome.",
      "**Mind the padding.** About 10 to 15 percent on each side keeps the icon from looking cramped. Too much padding shrinks the mark to almost nothing in a tab, so lower the padding before you go looking for a simpler icon.",
      "**Stick to one idea.** A single recognizable shape works. Words, taglines, and multi-part illustrations don't.",
    ] },

    { type: 'h2', text: 'FAQ' },
    ...faqBlocks(FAVICON_GENERATOR_FAQ_EN),
  ],
  ko: [
    { type: 'h2', text: 'ZIP에 담기는 파일' },
    { type: 'p', text: "버튼 한 번에 파일 여덟 개가 만들어집니다. 각 파일은 브라우저, 검색엔진, 스마트폰이 사이트에 묻는 질문에 하나씩 답합니다." },
    { type: 'ul', items: [
      "**`favicon.ico`** 하나에 16·32·48px 이미지가 함께 들어 있습니다. 어디서나 통하는 기본 대체 파일입니다. 오래된 브라우저는 이 파일부터 요청합니다. Google 검색도 지원 형식에 SVG는 없고 ICO와 PNG가 있어서 이 파일을 쓸 수 있습니다.",
      "**`favicon.svg`** 는 벡터 버전입니다. Chromium 계열 브라우저와 Firefox는 오래전부터 SVG 파비콘을 지원했고 Safari는 26 버전부터 지원합니다. 고해상도 화면에서 탭 크기가 어떻든 선명하게 보입니다.",
      "**`apple-touch-icon.png`** 는 iOS·iPadOS 홈 화면용 180×180 PNG입니다. 일부러 불투명하게 만들었습니다. iOS는 투명도를 살리지 않고 빈 모서리를 검게 채우기 때문입니다.",
      "**`icon-192.png`와 `icon-512.png`** 는 설치된 웹 앱이 매니페스트에서 읽어 가는 아이콘입니다. 안드로이드 런처와 스플래시 화면에 쓰입니다.",
      "**`icon-maskable-512.png`** 는 가장자리까지 꽉 채운 버전입니다. 운영체제가 원형이나 스쿼클로 잘라 내도 심볼이 잘리지 않습니다.",
      "**`site.webmanifest`** 에는 앱 이름과 위 PNG 세 개의 경로가 들어 있고 테마 색과 배경색도 채워져 있습니다.",
      "**`head-snippet.html`** 은 이 파일들을 연결하는 `<link>` 태그 네 줄입니다. 그대로 붙여 넣으면 됩니다.",
    ] },
    { type: 'p', text: "이 파일 구성을 고른 이유와 스크립트로 직접 만드는 방법은 아래 가이드에 정리했습니다." },
    { type: 'link', href: '/blog/make-a-favicon', text: '가이드 읽기: 아이콘으로 파비콘 만드는 방법' },

    { type: 'h2', text: '생성기 사용 방법' },
    { type: 'ol', items: [
      "**메인 아이콘을 고르세요.** 라이브러리를 선택하고 이름으로 검색한 뒤 결과를 클릭합니다. 기본 라이브러리는 채워진 아이콘 세트입니다. 채워진 모양이 작은 크기에서도 형태를 유지하기 때문입니다.",
      "**타일을 꾸미세요.** 배경색을 정하고 사각형, 둥근 사각형, 원형 중 하나를 고른 뒤 모서리 둥글기와 여백을 조절합니다. 단색 타일을 깔면 밝은 탭에서도 어두운 탭에서도 아이콘이 또렷하게 보입니다.",
      "**필요하면 배지를 더하세요.** 모서리에 작은 아이콘을 하나 더 얹어 베타 빌드나 알림 상태 같은 변형을 표시할 수 있습니다. 위치, 크기, 색을 고르면 됩니다. 배지는 타일 색 테두리를 두른 원판 위에 놓여서 알아보기 쉽습니다.",
      "**미리보기를 확인하세요.** 브라우저 탭 목업에서 실제 16px 렌더링을 볼 수 있고 옆에 32px, 홈 화면, 큰 버전이 함께 나옵니다.",
      "**앱 이름을 적고 내려받으세요.** 이름과 짧은 이름은 매니페스트에 들어갑니다. ZIP을 받거나, 파일을 이미 배치했다면 HTML 스니펫만 복사해도 됩니다.",
    ] },

    { type: 'h2', text: '파일 설치하기' },
    { type: 'p', text: "먼저 ZIP을 풉니다. 아래 방법은 모두 파일을 사이트 루트에 둔다고 가정합니다. 브라우저와 크롤러가 찾아보는 위치가 루트입니다." },
    { type: 'p', text: "**일반 HTML.** 파일을 모두 웹 루트에 올리고 `head-snippet.html` 내용을 모든 페이지(최소한 홈페이지)의 `<head>` 안에 붙여 넣습니다." },
    { type: 'code', lang: 'html', code: HTML_SNIPPET },
    { type: 'p', text: "**Next.js App Router.** Next.js는 `app/` 폴더에서 약속된 이름의 파일을 찾으면 link 태그를 알아서 만듭니다. 그래서 스니펫은 필요 없습니다. ICO, SVG, Apple 아이콘은 아래 이름으로 `app/`에 두고 매니페스트 관련 파일은 `public/`에 둡니다." },
    { type: 'code', lang: 'text', code: NEXT_TREE_KO },
    { type: 'code', lang: 'ts', code: NEXT_MANIFEST },
    { type: 'p', text: "**워드프레스와 기타 CMS.** 대부분의 CMS에는 사이트 아이콘 입력란이 하나 있고 이미지 한 장을 올리면 필요한 크기를 알아서 만듭니다. 워드프레스에서는 외모, 사용자 정의하기, 사이트 아이덴티티 순서로 열어 `icon-512.png`를 사이트 아이콘으로 올리면 됩니다." },
    { type: 'p', text: "세밀하게 제어하고 싶다면 차일드 테마나 헤더 삽입 플러그인으로 스니펫을 붙여 넣고, 나머지 파일은 호스팅의 파일 관리자로 웹 루트에 올리세요. Shopify나 Squarespace 같은 웹사이트 빌더에도 파비콘 입력란이 있고 보통 정사각형 PNG나 ICO를 받습니다." },

    { type: 'h2', text: '크기별 용도' },
    { type: 'ul', items: [
      "**16px와 32px** 는 탭, 북마크, 방문 기록에 실제로 그려지는 크기입니다. 32px 이미지는 고밀도 디스플레이용입니다.",
      "**48px** 는 윈도우와 일부 데스크톱 바로가기가 선호하는 크기입니다. Google도 가능하면 48×48보다 큰 파비콘을 권장합니다.",
      "**180px** 는 iOS 홈 화면 아이콘입니다. 둥근 모서리는 시스템이 알아서 입힙니다.",
      "**192px와 512px** 는 안드로이드와 데스크톱에서 앱을 설치했을 때 런처, 작업 전환기, 스플래시 화면에 쓰는 매니페스트 크기입니다.",
      "**512 마스커블** 이 따로 있는 것은 안드로이드가 아이콘을 어떤 모양으로든 자를 수 있어서입니다. 사양은 아이콘 너비의 40퍼센트를 반지름으로 하는 가운데 원을 안전 영역으로 정해 둡니다. 생성기는 타일 색을 가장자리까지 채우고 심볼은 그 원 안에 들어가도록 줄입니다.",
    ] },

    { type: 'h2', text: '16px를 위한 디자인 팁' },
    { type: 'p', text: "파비콘은 웬만한 썸네일보다도 작게 보입니다. 그래서 스타일을 어떻게 잡느냐보다 몇 가지 원칙을 지키는 것이 더 중요합니다." },
    { type: 'ul', items: [
      "**채워진 아이콘을 쓰세요.** 선 두께가 1~2px인 외곽선 아이콘은 16px에서 반쯤 칠해진 픽셀로 흩어집니다. 단색 타일 위의 채워진 글리프는 넓은 면이 그대로 남습니다.",
      "**배지는 사라진다고 생각하세요.** 작은 배지는 16px에서 몇 픽셀밖에 차지하지 못해 잡음이 되기 쉽습니다. 16px에서 숨기는 옵션을 켜 둔 채로 두면 탭에는 깔끔한 메인 아이콘만 들어가고 큰 크기에는 배지가 남습니다.",
      "**대비를 높게 유지하세요.** 아이콘 색과 타일 색의 밝기 차이가 분명해야 합니다. 채도 있는 중간~어두운 색 위의 흰색이 무난한 출발점이고 밝은 브라우저 UI와 어두운 UI 모두에서 잘 읽힙니다.",
      "**여백을 살피세요.** 사방 10~15퍼센트 정도면 답답해 보이지 않습니다. 여백이 너무 크면 탭에서 심볼이 거의 안 보입니다. 더 단순한 아이콘을 찾기 전에 여백부터 줄여 보세요.",
      "**아이디어는 하나만.** 알아볼 수 있는 모양 하나면 충분합니다. 글자, 슬로건, 여러 요소로 된 일러스트는 파비콘에 맞지 않습니다.",
    ] },

    { type: 'h2', text: '자주 묻는 질문' },
    ...faqBlocks(FAVICON_GENERATOR_FAQ_KO),
  ],
};
