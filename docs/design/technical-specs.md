# Technical Specifications

## 타입 정의

### 핵심 인터페이스

```typescript
// src/types/index.ts

/**
 * 아이콘 메타데이터
 */
interface Icon {
  id: string;              // 고유 식별자 (예: "home", "user")
  name: string;            // 표시 이름 (예: "Home", "User")
  category: string;        // 카테고리 (예: "ui", "arrows", "files")
  tags: string[];          // 검색 태그
  component: LucideIcon;   // Lucide React 컴포넌트
}

/**
 * 커스터마이징 상태
 */
interface CustomizationState {
  selectedIcon: Icon | null;  // 현재 선택된 아이콘
  color: string;              // Hex 색상 (예: "#3B82F6")
  size: number;               // 픽셀 크기 (32, 64, 128, 256)
}

/**
 * PNG 내보내기 옵션
 */
interface ExportOptions {
  format: 'png';              // 현재는 PNG만 지원
  size: number;               // 출력 크기 (픽셀)
  color: string;              // Hex 색상
  backgroundColor?: string;   // 배경색 (투명 = undefined)
  quality?: number;           // 품질 (0.0-1.0, 기본값 1.0)
}

/**
 * 검색 필터
 */
interface SearchFilter {
  query: string;              // 검색어
  category?: string;          // 선택적 카테고리 필터
  tags?: string[];            // 선택적 태그 필터
}

/**
 * 아이콘 검색 결과
 */
interface SearchResult {
  icon: Icon;
  relevance: number;          // 관련성 점수 (0.0-1.0)
  matchedFields: string[];    // 매칭된 필드 (name, tags 등)
}
```

---

## 서비스 명세

### 1. IconRenderer Service

**파일**: `src/services/iconRenderer.ts`

**책임**: SVG를 PNG로 변환하고 색상을 적용

```typescript
class IconRenderer {
  /**
   * SVG를 PNG Blob으로 변환
   * @param svgElement - SVG DOM 엘리먼트
   * @param size - 출력 크기 (픽셀)
   * @param color - Hex 색상
   * @returns PNG Blob
   */
  async svgToPng(
    svgElement: SVGElement,
    size: number,
    color: string
  ): Promise<Blob>;

  /**
   * SVG 문자열에 색상 적용
   * @param svgString - SVG 마크업 문자열
   * @param color - Hex 색상
   * @returns 색상이 적용된 SVG 문자열
   */
  applySvgColor(svgString: string, color: string): string;

  /**
   * Blob을 Data URL로 변환 (미리보기용)
   * @param blob - 이미지 Blob
   * @returns Data URL
   */
  getDataUrl(blob: Blob): Promise<string>;

  /**
   * React 아이콘 컴포넌트를 SVG 문자열로 변환
   * @param IconComponent - Lucide 아이콘 컴포넌트
   * @param size - 크기
   * @param color - 색상
   * @returns SVG 문자열
   */
  iconComponentToSvg(
    IconComponent: LucideIcon,
    size: number,
    color: string
  ): string;
}
```

**알고리즘 상세**:

```typescript
async svgToPng(svgElement, size, color) {
  // 1. SVG 직렬화
  const svgString = new XMLSerializer()
    .serializeToString(svgElement);

  // 2. 색상 적용
  const coloredSvg = svgString.replace(
    /stroke="[^"]*"/g,
    `stroke="${color}"`
  );

  // 3. Canvas 생성
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 4. SVG → Image 변환
  const img = new Image();
  const svgBlob = new Blob([coloredSvg], {
    type: 'image/svg+xml;charset=utf-8'
  });
  const url = URL.createObjectURL(svgBlob);

  // 5. Image 로딩 대기
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });

  // 6. Canvas에 그리기
  ctx.drawImage(img, 0, 0, size, size);
  URL.revokeObjectURL(url);

  // 7. PNG Blob 생성
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob!),
      'image/png',
      1.0 // 최고 품질
    );
  });
}
```

---

### 2. ClipboardManager Service

**파일**: `src/services/clipboardManager.ts`

**책임**: 클립보드에 이미지 복사

```typescript
class ClipboardManager {
  /**
   * 이미지 Blob을 클립보드에 복사
   * @param blob - PNG Blob
   * @throws {Error} 클립보드 API 미지원 또는 권한 거부
   */
  async copyImage(blob: Blob): Promise<void>;

  /**
   * Clipboard API 지원 여부 확인
   * @returns 지원 여부
   */
  isSupported(): boolean;

  /**
   * 클립보드 권한 요청
   * @returns 권한 상태
   */
  async requestPermission(): Promise<PermissionState>;
}
```

**구현 상세**:

```typescript
async copyImage(blob: Blob): Promise<void> {
  // Modern Clipboard API 체크
  if (!navigator.clipboard || !navigator.clipboard.write) {
    throw new Error('Clipboard API not supported');
  }

  try {
    // ClipboardItem 생성
    const item = new ClipboardItem({
      'image/png': blob
    });

    // 클립보드에 쓰기
    await navigator.clipboard.write([item]);
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      throw new Error('Clipboard permission denied');
    }
    throw error;
  }
}

isSupported(): boolean {
  return !!(
    navigator.clipboard &&
    navigator.clipboard.write &&
    typeof ClipboardItem !== 'undefined'
  );
}
```

**브라우저 호환성**:
- Chrome 76+: ✅ 완전 지원
- Firefox 87+: ✅ 완전 지원
- Safari 13.1+: ⚠️ 제한적 (사용자 제스처 필요)
- Edge 79+: ✅ 완전 지원

---

### 3. ExportManager Service

**파일**: `src/services/exportManager.ts`

**책임**: 파일 다운로드 처리

```typescript
class ExportManager {
  /**
   * PNG 파일 다운로드
   * @param blob - PNG Blob
   * @param filename - 파일명 (확장자 포함)
   */
  downloadPng(blob: Blob, filename: string): void;

  /**
   * 파일명 생성 (메타데이터 포함)
   * @param icon - 아이콘 정보
   * @param color - 색상
   * @param size - 크기
   * @returns 파일명 (예: "home-icon-blue-128.png")
   */
  generateFilename(icon: Icon, color: string, size: number): string;
}
```

**구현 상세**:

```typescript
downloadPng(blob: Blob, filename: string): void {
  // 1. Blob URL 생성
  const url = URL.createObjectURL(blob);

  // 2. 임시 링크 생성
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // 3. 클릭 트리거
  document.body.appendChild(link);
  link.click();

  // 4. 정리
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

generateFilename(icon: Icon, color: string, size: number): string {
  // 색상을 이름으로 변환 (예: #3B82F6 → "blue")
  const colorName = this.hexToColorName(color) || 'custom';

  // 아이콘 이름 정규화 (공백 → 하이픈)
  const iconName = icon.name.toLowerCase().replace(/\s+/g, '-');

  // 타임스탬프 추가 (중복 방지)
  const timestamp = Date.now();

  return `${iconName}-${colorName}-${size}px-${timestamp}.png`;
}
```

---

### 4. IconSearch Service

**파일**: `src/services/iconSearch.ts`

**책임**: 아이콘 검색 및 필터링

```typescript
class IconSearch {
  /**
   * Fuzzy 검색
   * @param icons - 아이콘 배열
   * @param query - 검색어
   * @returns 관련성 순으로 정렬된 결과
   */
  search(icons: Icon[], query: string): SearchResult[];

  /**
   * 카테고리 필터
   * @param icons - 아이콘 배열
   * @param category - 카테고리
   */
  filterByCategory(icons: Icon[], category: string): Icon[];

  /**
   * 태그 필터
   * @param icons - 아이콘 배열
   * @param tags - 태그 배열
   */
  filterByTags(icons: Icon[], tags: string[]): Icon[];
}
```

**검색 알고리즘**:

```typescript
search(icons: Icon[], query: string): SearchResult[] {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) {
    return icons.map(icon => ({
      icon,
      relevance: 1.0,
      matchedFields: []
    }));
  }

  return icons
    .map(icon => {
      let relevance = 0;
      const matchedFields: string[] = [];

      // 정확한 이름 매칭 (가중치: 1.0)
      if (icon.name.toLowerCase() === lowerQuery) {
        relevance += 1.0;
        matchedFields.push('name-exact');
      }
      // 이름 부분 매칭 (가중치: 0.7)
      else if (icon.name.toLowerCase().includes(lowerQuery)) {
        relevance += 0.7;
        matchedFields.push('name');
      }

      // 태그 매칭 (가중치: 0.5)
      const tagMatch = icon.tags.some(tag =>
        tag.toLowerCase().includes(lowerQuery)
      );
      if (tagMatch) {
        relevance += 0.5;
        matchedFields.push('tags');
      }

      // 카테고리 매칭 (가중치: 0.3)
      if (icon.category.toLowerCase().includes(lowerQuery)) {
        relevance += 0.3;
        matchedFields.push('category');
      }

      return { icon, relevance, matchedFields };
    })
    .filter(result => result.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance);
}
```

---

## Context API 명세

### IconContext

**파일**: `src/context/IconContext.tsx`

```typescript
interface IconContextValue {
  // 상태
  icons: Icon[];
  selectedIcon: Icon | null;
  color: string;
  size: number;

  // 액션
  selectIcon: (icon: Icon) => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;

  // 내보내기
  downloadPng: () => Promise<void>;
  copyToClipboard: () => Promise<void>;

  // 로딩 상태
  isExporting: boolean;
  error: Error | null;
}

const IconContext = createContext<IconContextValue | undefined>(undefined);

// 커스텀 훅
function useIconContext(): IconContextValue {
  const context = useContext(IconContext);
  if (!context) {
    throw new Error('useIconContext must be used within IconProvider');
  }
  return context;
}
```

**Provider 구현**:

```typescript
function IconProvider({ children }: { children: React.ReactNode }) {
  // 상태
  const [icons, setIcons] = useState<Icon[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(128);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 서비스 인스턴스
  const renderer = useMemo(() => new IconRenderer(), []);
  const clipboard = useMemo(() => new ClipboardManager(), []);
  const exporter = useMemo(() => new ExportManager(), []);

  // 아이콘 로드 (초기화)
  useEffect(() => {
    loadIcons().then(setIcons);
  }, []);

  // PNG 다운로드
  const downloadPng = useCallback(async () => {
    if (!selectedIcon) return;

    setIsExporting(true);
    setError(null);

    try {
      // SVG → PNG 변환
      const blob = await renderer.svgToPng(
        selectedIcon.component,
        size,
        color
      );

      // 파일명 생성 및 다운로드
      const filename = exporter.generateFilename(
        selectedIcon,
        color,
        size
      );
      exporter.downloadPng(blob, filename);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, [selectedIcon, size, color, renderer, exporter]);

  // 클립보드 복사
  const copyToClipboard = useCallback(async () => {
    if (!selectedIcon) return;

    setIsExporting(true);
    setError(null);

    try {
      // SVG → PNG 변환
      const blob = await renderer.svgToPng(
        selectedIcon.component,
        size,
        color
      );

      // 클립보드에 복사
      await clipboard.copyImage(blob);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, [selectedIcon, size, color, renderer, clipboard]);

  const value: IconContextValue = {
    icons,
    selectedIcon,
    color,
    size,
    selectIcon: setSelectedIcon,
    setColor,
    setSize,
    downloadPng,
    copyToClipboard,
    isExporting,
    error,
  };

  return (
    <IconContext.Provider value={value}>
      {children}
    </IconContext.Provider>
  );
}
```

---

## 성능 최적화

### 1. Memoization

```typescript
// 컴포넌트 메모이제이션
const IconCard = React.memo(IconCard, (prev, next) => {
  return (
    prev.icon.id === next.icon.id &&
    prev.selected === next.selected
  );
});

// 값 메모이제이션
const filteredIcons = useMemo(() => {
  return searchService.search(icons, searchQuery);
}, [icons, searchQuery]);

// 콜백 메모이제이션
const handleIconSelect = useCallback((icon: Icon) => {
  setSelectedIcon(icon);
}, []);
```

### 2. Debouncing

```typescript
import { useDebouncedCallback } from 'use-debounce';

const debouncedSetColor = useDebouncedCallback(
  (color: string) => setColor(color),
  300 // 300ms 지연
);
```

### 3. Lazy Loading

```typescript
// 컴포넌트 레이지 로딩
const IconGallery = React.lazy(() =>
  import('./components/IconGallery')
);

// 사용
<Suspense fallback={<Spinner />}>
  <IconGallery />
</Suspense>
```

### 4. Virtual Scrolling

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function IconGallery({ icons }: { icons: Icon[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: icons.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // 아이콘 카드 높이
    overscan: 5, // 버퍼 아이템 수
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <IconCard icon={icons[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5. PNG 캐싱

```typescript
class PngCache {
  private cache = new Map<string, Blob>();

  getKey(iconId: string, color: string, size: number): string {
    return `${iconId}-${color}-${size}`;
  }

  get(iconId: string, color: string, size: number): Blob | undefined {
    return this.cache.get(this.getKey(iconId, color, size));
  }

  set(iconId: string, color: string, size: number, blob: Blob): void {
    this.cache.set(this.getKey(iconId, color, size), blob);

    // 캐시 크기 제한 (최대 100개)
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  clear(): void {
    this.cache.clear();
  }
}
```

---

## 에러 처리

### 에러 타입

```typescript
enum ErrorCode {
  CLIPBOARD_NOT_SUPPORTED = 'CLIPBOARD_NOT_SUPPORTED',
  CLIPBOARD_PERMISSION_DENIED = 'CLIPBOARD_PERMISSION_DENIED',
  SVG_CONVERSION_FAILED = 'SVG_CONVERSION_FAILED',
  DOWNLOAD_FAILED = 'DOWNLOAD_FAILED',
  ICON_NOT_FOUND = 'ICON_NOT_FOUND',
}

class IconyError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'IconyError';
  }
}
```

### 에러 핸들러

```typescript
function handleError(error: unknown): void {
  if (error instanceof IconyError) {
    switch (error.code) {
      case ErrorCode.CLIPBOARD_NOT_SUPPORTED:
        toast.error('Your browser does not support clipboard operations');
        break;
      case ErrorCode.CLIPBOARD_PERMISSION_DENIED:
        toast.error('Clipboard permission denied. Please allow access.');
        break;
      case ErrorCode.SVG_CONVERSION_FAILED:
        toast.error('Failed to convert icon to PNG');
        break;
      default:
        toast.error('An unexpected error occurred');
    }
  } else {
    console.error('Unhandled error:', error);
    toast.error('An unexpected error occurred');
  }
}
```

---

## 테스트 전략

### 단위 테스트

```typescript
// iconRenderer.test.ts
describe('IconRenderer', () => {
  it('should convert SVG to PNG blob', async () => {
    const renderer = new IconRenderer();
    const blob = await renderer.svgToPng(mockSvg, 128, '#000000');

    expect(blob.type).toBe('image/png');
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should apply color to SVG', () => {
    const renderer = new IconRenderer();
    const colored = renderer.applySvgColor(mockSvg, '#FF0000');

    expect(colored).toContain('stroke="#FF0000"');
  });
});
```

### 통합 테스트

```typescript
// IconContext.test.tsx
describe('IconContext', () => {
  it('should download PNG successfully', async () => {
    const { result } = renderHook(() => useIconContext(), {
      wrapper: IconProvider,
    });

    act(() => {
      result.current.selectIcon(mockIcon);
    });

    await act(async () => {
      await result.current.downloadPng();
    });

    expect(result.current.error).toBeNull();
  });
});
```

### E2E 테스트

```typescript
// e2e/icon-export.spec.ts
import { test, expect } from '@playwright/test';

test('should export icon as PNG', async ({ page }) => {
  await page.goto('/');

  // 아이콘 선택
  await page.click('[data-testid="icon-home"]');

  // 색상 변경
  await page.click('[data-testid="color-blue"]');

  // 다운로드 트리거
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('[data-testid="download-button"]'),
  ]);

  // 파일명 검증
  expect(download.suggestedFilename()).toMatch(/home.*\.png$/);
});
```
