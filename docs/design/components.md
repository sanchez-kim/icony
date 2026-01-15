# Component Design

## 컴포넌트 계층 구조

```typescript
App
├── Header
├── MainLayout
│   ├── Sidebar
│   │   ├── SearchBar
│   │   └── IconGallery
│   │       └── IconCard[] (mapped)
│   └── CustomizationPanel
│       ├── IconPreview
│       ├── ColorSelector
│       │   ├── SwatchPicker
│       │   └── ColorPicker (react-colorful)
│       ├── SizeSelector
│       └── ExportButtons
│           ├── DownloadButton
│           └── CopyButton
└── Footer
```

## 핵심 컴포넌트 명세

### 1. App.tsx

**책임**: 애플리케이션 루트, Context Provider 설정

```typescript
import { IconProvider } from './context/IconContext';

function App() {
  return (
    <IconProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <MainLayout />
        <Footer />
      </div>
    </IconProvider>
  );
}
```

**Props**: 없음

---

### 2. Header.tsx

**책임**: 앱 헤더, 브랜딩, 선택적 네비게이션

```typescript
interface HeaderProps {
  className?: string;
}

function Header({ className }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold">
          🎨 Icony
        </h1>
        <p className="text-gray-600">
          Icon Customization Made Simple
        </p>
      </div>
    </header>
  );
}
```

---

### 3. MainLayout.tsx

**책임**: 메인 레이아웃, 사이드바와 커스터마이징 패널 배치

```typescript
function MainLayout() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
        <div className="lg:col-span-2">
          <CustomizationPanel />
        </div>
      </div>
    </div>
  );
}
```

**반응형 동작**:
- Mobile: 세로 스택 (1열)
- Desktop: 1:2 비율 그리드

---

### 4. SearchBar.tsx

**책임**: 아이콘 검색 입력, 실시간 필터링

```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search icons..."}
        className="w-full px-4 py-2 pl-10 border rounded-lg"
      />
      <SearchIcon className="absolute left-3 top-2.5 text-gray-400" />
    </div>
  );
}
```

**기능**:
- 실시간 검색 (debounced 300ms)
- 아이콘 이름, 태그 검색
- 검색어 하이라이팅

---

### 5. IconGallery.tsx

**책임**: 아이콘 그리드 표시, 선택 관리

```typescript
interface IconGalleryProps {
  searchQuery: string;
}

function IconGallery({ searchQuery }: IconGalleryProps) {
  const { icons, selectedIcon, selectIcon } = useIconContext();
  const filteredIcons = useIconSearch(icons, searchQuery);

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        {filteredIcons.length} icons found
      </div>

      <div className="grid grid-cols-4 gap-3 max-h-[600px] overflow-y-auto">
        {filteredIcons.map((icon) => (
          <IconCard
            key={icon.id}
            icon={icon}
            selected={selectedIcon?.id === icon.id}
            onClick={() => selectIcon(icon)}
          />
        ))}
      </div>
    </div>
  );
}
```

**최적화**:
- Virtual scrolling (큰 아이콘 세트)
- Memoization
- Lazy loading

---

### 6. IconCard.tsx

**책임**: 개별 아이콘 표시, 선택 상태 표시

```typescript
interface IconCardProps {
  icon: Icon;
  selected: boolean;
  onClick: () => void;
}

const IconCard = React.memo(function IconCard({
  icon,
  selected,
  onClick,
}: IconCardProps) {
  const IconComponent = icon.component;

  return (
    <button
      onClick={onClick}
      className={cn(
        "p-4 border-2 rounded-lg transition-all hover:border-blue-400",
        selected ? "border-blue-500 bg-blue-50" : "border-gray-200"
      )}
      title={icon.name}
    >
      <IconComponent className="w-full h-full" />
    </button>
  );
});
```

**상태**:
- Default: 회색 테두리
- Hover: 파란색 테두리
- Selected: 진한 파란색 테두리 + 배경

---

### 7. CustomizationPanel.tsx

**책임**: 커스터마이징 영역 컨테이너

```typescript
function CustomizationPanel() {
  const { selectedIcon } = useIconContext();

  if (!selectedIcon) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <ImageIcon className="mx-auto mb-4 w-16 h-16" />
          <p>Select an icon to customize</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <IconPreview />
      <ColorSelector />
      <SizeSelector />
      <ExportButtons />
    </div>
  );
}
```

**Empty State**: 아이콘 미선택 시 안내 메시지

---

### 8. IconPreview.tsx

**책임**: 선택된 아이콘 미리보기, 색상 실시간 반영

```typescript
function IconPreview() {
  const { selectedIcon, color, size } = useIconContext();

  if (!selectedIcon) return null;

  const IconComponent = selectedIcon.component;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-sm font-medium text-gray-700">
        {selectedIcon.name}
      </div>

      <div
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ width: size + 40, height: size + 40 }}
      >
        <IconComponent
          size={size}
          color={color}
          className="transition-colors duration-200"
        />
      </div>
    </div>
  );
}
```

**애니메이션**:
- 색상 변경: 200ms transition
- 크기 변경: 300ms transition

---

### 9. ColorSelector.tsx

**책임**: 색상 선택 UI, 스와치 + 커스텀 피커

```typescript
function ColorSelector() {
  const { color, setColor } = useIconContext();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        Color
      </label>

      <SwatchPicker
        selectedColor={color}
        onColorSelect={setColor}
      />

      <button
        onClick={() => setShowPicker(!showPicker)}
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        {showPicker ? 'Hide' : 'Show'} Custom Picker
      </button>

      {showPicker && (
        <HexColorPicker
          color={color}
          onChange={setColor}
        />
      )}
    </div>
  );
}
```

---

### 10. SwatchPicker.tsx

**책임**: 프리셋 색상 스와치 표시

```typescript
interface SwatchPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const PRESET_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
];

function SwatchPicker({ selectedColor, onColorSelect }: SwatchPickerProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className={cn(
            "w-10 h-10 rounded-lg border-2 transition-transform hover:scale-110",
            selectedColor === color ? "border-blue-500 scale-110" : "border-gray-300"
          )}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
}
```

---

### 11. SizeSelector.tsx

**책임**: 아이콘 크기 선택 (32, 64, 128, 256px)

```typescript
function SizeSelector() {
  const { size, setSize } = useIconContext();
  const sizes = [32, 64, 128, 256];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        Size
      </label>

      <div className="flex gap-3">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={cn(
              "px-4 py-2 rounded-lg border-2 transition-colors",
              size === s
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 hover:border-gray-400"
            )}
          >
            {s}px
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

### 12. ExportButtons.tsx

**책임**: PNG 다운로드 및 클립보드 복사 버튼

```typescript
function ExportButtons() {
  const { downloadPng, copyToClipboard } = useIconContext();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadPng();
      toast.success('Downloaded successfully!');
    } catch (error) {
      toast.error('Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      await copyToClipboard();
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Copy failed');
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isDownloading ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : (
          <>
            <Download className="inline mr-2" />
            Download PNG
          </>
        )}
      </button>

      <button
        onClick={handleCopy}
        disabled={isCopying}
        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {isCopying ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : (
          <>
            <Copy className="inline mr-2" />
            Copy to Clipboard
          </>
        )}
      </button>
    </div>
  );
}
```

**피드백**:
- 로딩 상태 (스피너)
- 성공 토스트 알림
- 에러 처리

---

## 공통 패턴

### 1. Props 인터페이스
```typescript
// 모든 컴포넌트는 명시적 Props 인터페이스 사용
interface ComponentNameProps {
  required: Type;
  optional?: Type;
  children?: React.ReactNode;
}
```

### 2. 스타일링 규칙
```typescript
// Tailwind CSS 클래스 + cn() 유틸리티
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className // Props로 받은 추가 클래스
)} />
```

### 3. 이벤트 핸들러
```typescript
// 명시적 타입 + async/await
const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  try {
    await someAsyncOperation();
  } catch (error) {
    handleError(error);
  }
};
```

### 4. Context 사용
```typescript
// 커스텀 훅으로 Context 접근
const { state, actions } = useIconContext();
```

## 접근성 (A11y)

### 키보드 네비게이션
- Tab: 포커스 이동
- Enter/Space: 버튼/카드 선택
- Arrow keys: 아이콘 그리드 네비게이션

### ARIA 속성
```typescript
<button
  aria-label={`Select ${icon.name} icon`}
  aria-pressed={selected}
  role="button"
>
```

### 색상 대비
- WCAG AA 준수 (4.5:1 이상)
- 포커스 인디케이터 명확

## 반응형 디자인

### Breakpoints (Tailwind)
```typescript
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

### 레이아웃 변화
- Mobile (<768px): 1열 스택
- Tablet (768-1024px): 1열, 아이콘 그리드 조정
- Desktop (>1024px): 2열 그리드 (1:2 비율)
