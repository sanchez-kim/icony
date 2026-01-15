# System Architecture

## 전체 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                   Icony Architecture                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Frontend   │  │  Icon Data   │  │   Export     │ │
│  │   (React)    │  │   (JSON)     │  │   Engine     │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                  │                  │         │
│         └──────────────────┼──────────────────┘         │
│                            │                            │
│  ┌─────────────────────────▼──────────────────────────┐ │
│  │          Core Components Layer                     │ │
│  ├────────────────────────────────────────────────────┤ │
│  │  • IconGallery    • ColorPicker                    │ │
│  │  • IconRenderer   • SwatchSelector                 │ │
│  │  • ExportManager  • ClipboardManager               │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │          Utilities & Services                      │ │
│  ├────────────────────────────────────────────────────┤ │
│  │  • SVG → PNG Converter (Canvas API)                │ │
│  │  • Clipboard API Integration                       │ │
│  │  • Icon Search & Filter                            │ │
│  │  • Color Palette Management                        │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 레이어 구조

### 1. Presentation Layer (프레젠테이션 계층)

**책임**: 사용자 인터페이스 렌더링 및 사용자 상호작용 처리

**구성 요소**:
- React 컴포넌트
- Tailwind CSS 스타일링
- 반응형 레이아웃

**주요 컴포넌트**:
```
App.tsx
├── Header.tsx
├── MainLayout.tsx
│   ├── Sidebar/
│   │   ├── SearchBar.tsx
│   │   └── IconGallery.tsx
│   └── CustomizationPanel/
│       ├── IconPreview.tsx
│       ├── ColorSelector.tsx
│       ├── SizeSelector.tsx
│       └── ExportButtons.tsx
└── Footer.tsx
```

### 2. Business Logic Layer (비즈니스 로직 계층)

**책임**: 애플리케이션 핵심 기능 구현

**구성 요소**:
- Context API (상태 관리)
- 커스텀 훅
- 비즈니스 로직 함수

**주요 서비스**:
```typescript
services/
├── iconRenderer.ts      // SVG → PNG 변환
├── clipboardManager.ts  // 클립보드 복사
├── exportManager.ts     // 파일 다운로드
└── iconSearch.ts        // 검색 및 필터링
```

### 3. Data Layer (데이터 계층)

**책임**: 아이콘 데이터 관리 및 제공

**구성 요소**:
- 아이콘 메타데이터 (JSON)
- Lucide React 라이브러리
- 로컬 스토리지 (최근 사용 색상)

**데이터 구조**:
```typescript
interface Icon {
  id: string;
  name: string;
  category: string;
  tags: string[];
  component: LucideIcon; // React 컴포넌트
}
```

## 데이터 플로우

### 아이콘 선택 플로우

```
User clicks icon
    ↓
IconCard onClick event
    ↓
Context.selectIcon(icon)
    ↓
State update (selectedIcon)
    ↓
IconPreview re-renders
```

### 색상 변경 플로우

```
User selects color
    ↓
ColorPicker onChange event
    ↓
Context.setColor(color)
    ↓
State update (color)
    ↓
IconPreview re-renders with new color
```

### PNG 다운로드 플로우

```
User clicks Download
    ↓
ExportButtons.onDownload()
    ↓
IconRenderer.svgToPng(icon, color, size)
    ↓
Canvas API: SVG → PNG Blob
    ↓
ExportManager.downloadPng(blob, filename)
    ↓
Browser download triggered
```

### 클립보드 복사 플로우

```
User clicks Copy
    ↓
ExportButtons.onCopy()
    ↓
IconRenderer.svgToPng(icon, color, size)
    ↓
Canvas API: SVG → PNG Blob
    ↓
ClipboardManager.copyImage(blob)
    ↓
Clipboard API writes image
    ↓
Success notification
```

## 기술 스택 선택 근거

### React + TypeScript
- **React**: 컴포넌트 기반 아키텍처, 풍부한 생태계
- **TypeScript**: 타입 안정성, 개발자 경험 향상
- **Vite**: 빠른 빌드 속도, HMR 지원

### Tailwind CSS
- 빠른 UI 개발
- 일관된 디자인 시스템
- 작은 번들 사이즈 (purge)

### Lucide Icons
- 1000+ 고품질 아이콘
- MIT 라이선스
- Tree-shakeable (번들 최적화)
- React 네이티브 지원

### Canvas API
- 브라우저 네이티브 API (의존성 없음)
- 고품질 PNG 생성
- 모든 모던 브라우저 지원

### Context API
- React 내장 (추가 의존성 없음)
- 간단한 상태 관리에 충분
- 불필요한 복잡성 회피

## 성능 최적화 전략

### 1. 아이콘 로딩 최적화
```typescript
// Lazy loading with React.lazy
const IconGallery = React.lazy(() => import('./IconGallery'));

// Virtual scrolling for large icon lists
import { useVirtualizer } from '@tanstack/react-virtual';
```

### 2. PNG 생성 최적화
```typescript
// Web Worker for large images (256px+)
const worker = new Worker('./pngWorker.ts');

// Caching generated PNGs
const cache = new Map<string, Blob>();
const key = `${iconId}-${color}-${size}`;
```

### 3. 렌더링 최적화
```typescript
// Memoization
const MemoizedIconCard = React.memo(IconCard);

// Debounce color picker
const debouncedSetColor = useDebouncedCallback(setColor, 300);
```

### 4. 번들 사이즈 최적화
- Tree-shaking (Vite 자동 처리)
- Code splitting (React.lazy)
- Dynamic imports for services

## 확장성 고려사항

### 향후 추가 가능한 기능

1. **SVG 다운로드**
   - `exportManager.ts`에 `downloadSvg()` 메서드 추가

2. **커스텀 아이콘 업로드**
   - 파일 업로드 컴포넌트
   - SVG 파싱 및 검증 로직

3. **아이콘 컬렉션 저장**
   - LocalStorage 또는 IndexedDB
   - 로그인 시스템 (향후 백엔드 추가)

4. **일괄 다운로드**
   - JSZip 라이브러리 통합
   - 멀티 선택 UI

5. **그라디언트 지원**
   - 고급 색상 선택기
   - SVG gradient 적용 로직

## 보안 고려사항

### XSS 방지
```typescript
// SVG 업로드 시 sanitization 필요 (향후)
import DOMPurify from 'dompurify';
const cleanSvg = DOMPurify.sanitize(userSvg);
```

### CSP (Content Security Policy)
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; img-src 'self' blob: data:;">
```

## 배포 전략

### 정적 호스팅
- **Vercel**: 추천 (자동 빌드, CDN, 무료)
- **Netlify**: 대안
- **GitHub Pages**: 간단한 배포

### CI/CD
```yaml
# .github/workflows/deploy.yml
- Build on push to main
- Run tests
- Deploy to Vercel
```

### 환경 변수
```bash
# .env
VITE_ICON_COUNT=1000
VITE_MAX_SIZE=512
VITE_ANALYTICS_ID=xxx
```
