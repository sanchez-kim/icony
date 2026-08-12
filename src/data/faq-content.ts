// Shared FAQ data so the page (visible accordion, bilingual) and the layout
// (FAQPage JSON-LD, English for global SEO) stay in sync.

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSection {
  category: string;
  items: FaqItem[];
}

export const FAQ_KO: FaqSection[] = [
  {
    category: '일반',
    items: [
      {
        question: 'Icony는 무료인가요?',
        answer:
          '네, 완전히 무료입니다. 가입 없이 모든 기능을 사용할 수 있으며, 아이콘 다운로드에도 제한이 없습니다. 워터마크도 붙지 않고, 다운로드 횟수 제한이나 유료 플랜도 없습니다. 영원히 무료로 유지될 예정입니다.',
      },
      {
        question: '계정을 만들어야 하나요?',
        answer:
          '아니요. Icony는 계정이 필요 없습니다. 사이트에 접속하면 바로 모든 기능을 사용할 수 있습니다. 즐겨찾기와 최근 사용 아이콘은 브라우저에 자동 저장되므로, 다음에 방문해도 같은 브라우저라면 그대로 남아 있습니다.',
      },
      {
        question: '개인정보는 수집하나요?',
        answer:
          '수집하지 않습니다. Icony는 서버에 어떠한 사용자 데이터도 저장하지 않습니다. 즐겨찾기, 최근 사용 아이콘, 색상 팔레트는 모두 브라우저의 로컬 스토리지에만 저장되며 외부로 전송되지 않습니다. 브라우저 데이터를 지우면 함께 사라집니다.',
      },
      {
        question: '무료라면 어떻게 운영되나요?',
        answer:
          'Icony는 개인이 만들고 운영하는 사이드 프로젝트입니다. 아이콘은 모두 오픈소스 라이선스라 별도 비용이 들지 않고, 운영 비용은 Buy Me a Coffee와 GitHub Sponsors를 통한 후원으로 충당하고 있습니다. 사용자에게 요금을 받을 계획은 없습니다.',
      },
      {
        question: '오프라인에서도 사용할 수 있나요?',
        answer:
          '아이콘 라이브러리를 처음 불러올 때는 인터넷 연결이 필요합니다. 페이지를 연 뒤에는 색상·크기 조정과 내보내기가 모두 브라우저 안에서 처리되므로, 파일이 서버로 업로드되지도 않고 변환도 로컬에서 이뤄집니다.',
      },
    ],
  },
  {
    category: '아이콘 & 라이브러리',
    items: [
      {
        question: '어떤 아이콘 라이브러리를 지원하나요?',
        answer:
          'Lucide Icons (1,539개), Tabler Icons (5,986개), Phosphor Icons (1,512개), Phosphor Fill (1,512개), Heroicons (175개), Heroicons Solid (175개), Bootstrap Icons (325개), Radix Icons (218개) — 총 11,442개의 아이콘을 지원합니다. 각 라이브러리의 특징과 설치 방법은 /icon-libraries 페이지에서 확인할 수 있습니다.',
      },
      {
        question: '다운로드한 아이콘을 상업적으로 사용할 수 있나요?',
        answer:
          '네. Icony가 지원하는 모든 아이콘 라이브러리는 MIT 또는 ISC 라이선스로 배포됩니다. 개인 프로젝트는 물론 상업적 프로젝트에도 자유롭게 사용할 수 있으며, 출처 표기는 법적으로 필수가 아닙니다. 다만 아이콘을 그대로 재판매하거나 아이콘 팩으로 다시 배포하는 것은 각 라이브러리의 라이선스 조건을 직접 확인하시기 바랍니다.',
      },
      {
        question: '특정 라이브러리의 아이콘만 볼 수 있나요?',
        answer:
          '네. 앱 상단의 라이브러리 필터를 사용해 특정 라이브러리의 아이콘만 표시할 수 있습니다. Lucide, Tabler, Phosphor 등 원하는 라이브러리를 선택하면 해당 아이콘만 보여지며, 필터를 켠 상태에서 검색하면 그 라이브러리 안에서만 검색됩니다.',
      },
      {
        question: '원하는 아이콘을 못 찾겠어요.',
        answer:
          '한국어 검색을 지원합니다. "휴지통", "화살표", "설정"처럼 우리말로 입력하면 대응하는 영문 아이콘 이름(trash, arrow, settings 등)으로 자동 변환해 찾아줍니다. 영어로 검색할 때도 동의어를 함께 훑기 때문에 정확한 이름을 몰라도 됩니다. 그래도 안 나온다면 라이브러리 필터가 켜져 있는지 확인하고 전체 범위에서 다시 검색해보세요. 같은 개념이라도 라이브러리마다 이름이 다를 수 있습니다(예: trash / trash-2 / bin).',
      },
      {
        question: '어떤 라이브러리를 골라야 하나요?',
        answer:
          '개수가 가장 많은 것은 Tabler(5,986개)이고, 선 두께 조절이 잘 되는 깔끔한 스타일은 Lucide입니다. Tailwind CSS를 쓴다면 같은 팀이 만든 Heroicons가, shadcn/ui 프로젝트라면 Radix Icons가 잘 맞습니다. 하나의 UI 안에서는 라이브러리를 섞지 말고 하나로 통일하는 편이 시각적으로 안정적입니다.',
      },
    ],
  },
  {
    category: '커스터마이징 & 내보내기',
    items: [
      {
        question: '어떤 파일 형식으로 내보낼 수 있나요?',
        answer:
          'PNG와 SVG 두 가지 형식을 지원합니다. PNG는 비트맵 이미지로 웹, 앱, 프레젠테이션에 적합하고, SVG는 벡터 형식으로 모든 크기에서 선명하게 표시되며 코드에 직접 삽입할 수 있습니다.',
      },
      {
        question: '아이콘 크기는 어떻게 설정하나요?',
        answer:
          '크기 입력란에 16px부터 512px 사이의 값을 직접 입력할 수 있고, 32·64·128·256px 프리셋 버튼도 준비돼 있습니다. 기본값은 128px입니다. UI 아이콘은 보통 16·20·24px를 쓰고, 앱 아이콘이나 썸네일에는 더 큰 크기를 사용합니다.',
      },
      {
        question: '선 두께(stroke width)를 조절할 수 있나요?',
        answer:
          'Lucide, Tabler, Phosphor, Heroicons 네 라이브러리에서 조절할 수 있습니다. Bootstrap Icons와 Radix Icons, 그리고 채워진 계열(Phosphor Filled, Heroicons Solid)은 선 두께가 적용되지 않습니다. 슬라이더나 입력란으로 0.5~4 사이를 지정할 수 있고 1·1.5·2·2.5·3 프리셋 버튼도 있으며, 기본값은 2입니다. 작은 크기에서는 선이 너무 얇으면 흐려 보일 수 있으니 1.5~2 사이를 권장합니다.',
      },
      {
        question: 'SVG 코드를 직접 복사할 수 있나요?',
        answer:
          '네. 아이콘을 선택하면 "SVG 코드" 버튼으로 SVG 마크업을, "JSX 코드" 버튼으로 React 컴포넌트 코드를 바로 복사할 수 있습니다. 별도의 "클립보드에 복사" 버튼은 코드가 아니라 PNG 이미지를 복사하므로, 문서나 채팅창에 이미지로 붙여넣을 때 사용하세요.',
      },
      {
        question: '설정한 아이콘을 링크로 공유할 수 있나요?',
        answer:
          '네. "공유" 버튼을 누르면 선택한 아이콘과 색상·크기 설정이 담긴 링크가 복사됩니다. 그 링크를 열면 같은 설정이 그대로 적용된 상태로 편집기가 시작되므로, 팀원에게 특정 아이콘 설정을 전달할 때 편리합니다.',
      },
      {
        question: '여러 아이콘을 한 번에 받을 수 있나요?',
        answer:
          '네. 여러 아이콘을 선택한 뒤 ZIP으로 한 번에 내려받을 수 있습니다. 이때 설정한 색상·크기·선 두께가 모든 아이콘에 동일하게 적용되므로, 일관된 아이콘 세트를 한 번에 만들 수 있습니다.',
      },
      {
        question: 'PNG를 투명 배경으로 받을 수 있나요?',
        answer:
          '네. PNG로 내보내면 배경은 항상 투명하게 처리됩니다. 별도 설정이 필요 없으며, 어두운 배경 위에 올릴 계획이라면 아이콘 색상을 밝게 지정한 뒤 내보내세요.',
      },
      {
        question: 'PNG와 SVG 중 어떤 형식을 써야 할까요?',
        answer:
          'SVG를 권장합니다. SVG는 어떤 크기에서도 선명하고 파일 크기가 작습니다. 단, 오래된 이메일 클라이언트나 특정 문서 도구처럼 SVG를 지원하지 않는 환경에서는 PNG를 사용하세요.',
      },
    ],
  },
  {
    category: '문제 해결',
    items: [
      {
        question: '내보낸 PNG가 흐릿하게 보여요.',
        answer:
          '표시할 크기보다 큰 크기로 내보내면 해결됩니다. 24px로 표시할 아이콘을 24px PNG로 받으면 고해상도 화면에서 흐려 보입니다. 2배(48px) 또는 3배(72px)로 내보내거나, 애초에 SVG를 사용하면 어떤 배율에서도 선명합니다.',
      },
      {
        question: '색상을 바꿨는데 적용되지 않아요.',
        answer:
          '아웃라인 아이콘은 선(stroke)에, 채움(Solid·Fill) 아이콘은 면(fill)에 색상이 들어갑니다. 미리보기에서 색이 바뀌지 않는다면 다른 계열의 아이콘을 선택했을 수 있습니다. 붙여넣은 SVG의 색이 안 바뀌는 경우라면, 코드의 fill 또는 stroke 값이 currentColor가 아닌 특정 색상으로 고정돼 있는지 확인해보세요.',
      },
      {
        question: '붙여넣은 SVG가 화면에 안 보여요.',
        answer:
          '가장 흔한 원인은 크기 지정 누락입니다. SVG에 width·height가 없고 부모 요소 크기도 0이면 렌더링되지 않습니다. viewBox 속성이 남아 있는지, 색상이 배경과 같지 않은지도 확인해보세요. 흰 배경에 흰 아이콘이라 안 보이는 경우가 의외로 많습니다.',
      },
      {
        question: '파비콘으로 쓰려면 어떤 크기로 받아야 하나요?',
        answer:
          'SVG로 받아 파비콘으로 지정하는 것이 가장 간단하며 모든 최신 브라우저가 지원합니다. 구형 브라우저까지 고려한다면 32px PNG를 함께 준비하고, iOS 홈 화면용으로는 180px PNG를 추가하세요. 파비콘은 아주 작게 표시되므로 디테일이 적고 선이 두꺼운 아이콘이 잘 보입니다.',
      },
    ],
  },
  {
    category: '기술적인 질문',
    items: [
      {
        question: 'React 프로젝트에서 아이콘 라이브러리를 직접 사용할 수 있나요?',
        answer:
          '네! Icony에서 커스터마이징한 아이콘을 다운로드하거나, 각 라이브러리를 직접 npm으로 설치해 사용할 수 있습니다. 자세한 설치 방법은 /icon-libraries 페이지에서 각 라이브러리별로 확인할 수 있습니다. 아이콘을 몇 개만 쓴다면 SVG를 복사해 컴포넌트로 만드는 편이 번들 크기 면에서 유리합니다.',
      },
      {
        question: '복사한 SVG를 React 컴포넌트로 어떻게 바꾸나요?',
        answer:
          '직접 바꿀 필요 없이 "JSX 코드" 버튼을 누르면 React 컴포넌트 형태로 바로 복사됩니다. 속성 이름도 카멜케이스(stroke-width → strokeWidth, fill-rule → fillRule)로 변환된 상태입니다. 직접 손보고 싶다면 fill 또는 stroke 값을 currentColor로 지정하세요. CSS의 color 속성을 따라가므로 색상을 props로 제어하기 쉬워집니다. 자세한 설명은 블로그의 SVG를 React 컴포넌트로 쓰는 법 글에 있습니다.',
      },
      {
        question: '어떤 브라우저를 지원하나요?',
        answer:
          'Chrome, Firefox, Safari, Edge 등 최신 브라우저를 모두 지원합니다. 단, 화면 색상 스포이드(EyeDropper) 기능은 Chrome, Edge, Opera에서만 지원됩니다.',
      },
    ],
  },
];

export const FAQ_EN: FaqSection[] = [
  {
    category: 'General',
    items: [
      {
        question: 'Is Icony free to use?',
        answer:
          'Yes, completely free. No signup required. All features and downloads are unlimited, there is no watermark, no download cap, and no paid tier. Icony will remain free forever.',
      },
      {
        question: 'Do I need to create an account?',
        answer:
          'No account needed. Open the site and all features are immediately available. Favorites, recent icons, and color palettes are automatically saved in your browser, so they are still there next time you visit from the same browser.',
      },
      {
        question: 'Does Icony collect any personal data?',
        answer:
          "No. Icony stores no user data on any server. Favorites, recent icons, and color palettes are stored only in your browser's local storage and are never transmitted anywhere. Clearing your browser data removes them.",
      },
      {
        question: 'If it is free, how is it funded?',
        answer:
          'Icony is a side project built and run by one person. The icons are open-source licensed, so they cost nothing to include, and running costs are currently covered by sponsorships through Buy Me a Coffee and GitHub Sponsors. There are no plans to charge users.',
      },
      {
        question: 'Does Icony work offline?',
        answer:
          'An internet connection is needed to load the icon libraries initially. Once the page is open, recoloring, resizing, and exporting all happen inside your browser — nothing is uploaded to a server and conversion runs locally.',
      },
    ],
  },
  {
    category: 'Icons & Libraries',
    items: [
      {
        question: 'Which icon libraries does Icony support?',
        answer:
          'Icony includes 8 libraries: Lucide Icons (1,539), Tabler Icons (5,986), Phosphor Icons (1,512), Phosphor Fill (1,512), Heroicons (175), Heroicons Solid (175), Bootstrap Icons (325), and Radix Icons (218) — totaling 11,442 icons. See the /icon-libraries page for what each one is good for and how to install it.',
      },
      {
        question: 'Can I use downloaded icons commercially?',
        answer:
          'Yes. All icon libraries in Icony are distributed under MIT or ISC licenses, which allow free use in both personal and commercial projects. Attribution is not legally required, though it is appreciated. If you plan to resell the icons as-is or redistribute them as an icon pack, check the original license terms first.',
      },
      {
        question: 'Can I filter icons by library?',
        answer:
          'Yes. Use the library filter at the top of the app to view icons from a specific library — Lucide, Tabler, Phosphor, and more. With a filter active, searching only looks inside that library.',
      },
      {
        question: 'I cannot find the icon I am looking for.',
        answer:
          'Search expands your term with synonyms, so you do not need the exact icon name — "bin" will surface trash, and Korean queries are mapped to their English equivalents automatically. If something still does not appear, check whether a library filter is active and search across all libraries instead. The same concept is often named differently between them (trash / trash-2 / bin).',
      },
      {
        question: 'Which library should I choose?',
        answer:
          'Tabler has the most icons (5,986). Lucide is a clean outline set that responds well to stroke-width changes. If you use Tailwind CSS, Heroicons comes from the same team; for shadcn/ui projects, Radix Icons fits naturally. Within a single interface, stick to one library rather than mixing — it looks noticeably more consistent.',
      },
    ],
  },
  {
    category: 'Customization & Export',
    items: [
      {
        question: 'What file formats can I export?',
        answer:
          'PNG and SVG. PNG is a bitmap format suitable for web, apps, and presentations. SVG is a vector format that stays crisp at any size and can be embedded directly in code.',
      },
      {
        question: 'What sizes are available?',
        answer:
          'Type any value between 16px and 512px into the size field, or use the 32, 64, 128, and 256px preset buttons. The default is 128px. UI icons are typically 16, 20, or 24px; app icons and thumbnails use the larger sizes.',
      },
      {
        question: 'Can I adjust the stroke width?',
        answer:
          'Stroke width is adjustable for four libraries: Lucide, Tabler, Phosphor, and Heroicons. It does not apply to Bootstrap Icons, Radix Icons, or the filled variants (Phosphor Filled, Heroicons Solid). Use the slider or input to set any value from 0.5 to 4, or pick one of the 1, 1.5, 2, 2.5, and 3 presets; the default is 2. At small sizes very thin strokes can look washed out, so 1.5–2 is a safe range.',
      },
      {
        question: 'Can I copy the SVG code directly?',
        answer:
          'Yes. With an icon selected, the "Copy SVG" button copies the SVG markup and "Copy JSX" copies it as a React component. The separate "Copy to Clipboard" button copies a PNG image rather than code — use that one when pasting into a document or chat.',
      },
      {
        question: 'Can I share my customized icon as a link?',
        answer:
          'Yes. The "Share" button copies a link that carries the selected icon along with your color and size settings. Opening that link starts the editor with the same configuration applied, which makes it easy to hand a specific setup to a teammate.',
      },
      {
        question: 'Can I download several icons at once?',
        answer:
          'Yes. Select multiple icons and download them together as a ZIP. Your chosen color, size, and stroke width are applied to every icon in the batch, so you get a consistent set in one step.',
      },
      {
        question: 'Do exported PNGs have a transparent background?',
        answer:
          'Yes. PNG exports always have a transparent background — no setting required. If you plan to place the icon on a dark background, pick a light icon color before exporting.',
      },
      {
        question: 'Should I use PNG or SVG?',
        answer:
          "SVG is recommended in most cases — it stays sharp at any size and has a smaller file size. Use PNG for environments that don't support SVG, such as older email clients or certain document tools.",
      },
    ],
  },
  {
    category: 'Troubleshooting',
    items: [
      {
        question: 'My exported PNG looks blurry.',
        answer:
          'Export at a larger size than you intend to display. A 24px PNG shown at 24px looks soft on high-density screens. Export at 2× (48px) or 3× (72px), or use SVG instead, which stays sharp at every scale.',
      },
      {
        question: 'Changing the color has no effect.',
        answer:
          'Outline icons carry their color on the stroke; solid and fill icons carry it on the fill. If the preview does not change, you may have selected an icon from the other style. If a pasted SVG will not recolor, check whether its fill or stroke is hardcoded to a specific color instead of currentColor.',
      },
      {
        question: 'My pasted SVG does not show up.',
        answer:
          'The most common cause is missing dimensions: if the SVG has no width or height and its parent has zero size, nothing renders. Also check that the viewBox attribute is still present, and that the icon color is not the same as the background — a white icon on white is a surprisingly frequent culprit.',
      },
      {
        question: 'What size should I export for a favicon?',
        answer:
          'Exporting SVG and using it directly as your favicon is simplest and works in all modern browsers. For older browsers, add a 32px PNG, and for the iOS home screen add a 180px PNG. Favicons render very small, so icons with fewer details and thicker strokes hold up best.',
      },
    ],
  },
  {
    category: 'Technical',
    items: [
      {
        question: 'Can I use these icon libraries directly in my React project?',
        answer:
          'Yes! You can download customized icons from Icony, or install the libraries directly via npm. Visit the /icon-libraries page for installation instructions and usage examples for each library. If you only need a handful of icons, copying the SVG into a component keeps your bundle smaller.',
      },
      {
        question: 'How do I turn a copied SVG into a React component?',
        answer:
          'You do not have to convert it by hand — the "Copy JSX" button gives you the icon already shaped as a React component, with attributes converted to camelCase (stroke-width becomes strokeWidth, fill-rule becomes fillRule). If you want to adapt it further, set fill or stroke to currentColor so the icon follows the CSS color property, which makes it easy to drive the color from props. Our blog post on using an SVG icon as a React component walks through a full example.',
      },
      {
        question: 'Which browsers are supported?',
        answer:
          'All modern browsers including Chrome, Firefox, Safari, and Edge. Note: the EyeDropper (screen color picker) feature is only available in Chrome, Edge, and Opera.',
      },
    ],
  },
];
