# Implementation Guide

## 개발 단계별 가이드

### Phase 1: 프로젝트 설정 (0.5일)

#### 1.1 프로젝트 생성

```bash
# Vite + React + TypeScript 프로젝트 생성
npm create vite@latest icony -- --template react-ts
cd icony
npm install
```

#### 1.2 의존성 설치

```bash
# 필수 의존성
npm install lucide-react react-colorful

# 유틸리티
npm install clsx tailwind-merge

# 선택적 (고급 기능)
npm install @tanstack/react-virtual use-debounce react-hot-toast

# 개발 의존성
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node
npm install -D prettier eslint
```

#### 1.3 Tailwind CSS 설정

```bash
npx tailwindcss init -p
```

**tailwind.config.js**:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
```

**src/index.css**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 1.4 프로젝트 구조 생성

```bash
mkdir -p src/{components,services,context,types,utils,data,hooks}
mkdir -p src/components/{IconGallery,CustomizationPanel,Layout}
```

최종 구조:
```
src/
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── IconGallery/
│   │   ├── IconGallery.tsx
│   │   ├── IconCard.tsx
│   │   └── SearchBar.tsx
│   ├── CustomizationPanel/
│   │   ├── CustomizationPanel.tsx
│   │   ├── IconPreview.tsx
│   │   ├── ColorSelector.tsx
│   │   ├── SwatchPicker.tsx
│   │   ├── SizeSelector.tsx
│   │   └── ExportButtons.tsx
│   └── Layout/
│       ├── MainLayout.tsx
│       └── Sidebar.tsx
├── services/
│   ├── iconRenderer.ts
│   ├── clipboardManager.ts
│   ├── exportManager.ts
│   └── iconSearch.ts
├── context/
│   └── IconContext.tsx
├── types/
│   └── index.ts
├── utils/
│   ├── cn.ts
│   └── colors.ts
├── data/
│   └── icons.ts
├── hooks/
│   └── useIconSearch.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

### Phase 2: 코어 서비스 구현 (1일)

#### 2.1 타입 정의

**src/types/index.ts**:
```typescript
import { LucideIcon } from 'lucide-react';

export interface Icon {
  id: string;
  name: string;
  category: string;
  tags: string[];
  component: LucideIcon;
}

export interface CustomizationState {
  selectedIcon: Icon | null;
  color: string;
  size: number;
}

export interface ExportOptions {
  format: 'png';
  size: number;
  color: string;
  backgroundColor?: string;
}
```

#### 2.2 유틸리티 함수

**src/utils/cn.ts**:
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**src/utils/colors.ts**:
```typescript
export const PRESET_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Yellow', hex: '#F59E0B' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Pink', hex: '#EC4899' },
];

export function hexToColorName(hex: string): string | null {
  const color = PRESET_COLORS.find(
    c => c.hex.toLowerCase() === hex.toLowerCase()
  );
  return color?.name.toLowerCase() || null;
}
```

#### 2.3 IconRenderer 서비스

**src/services/iconRenderer.ts**:
```typescript
import { renderToString } from 'react-dom/server';
import { LucideIcon } from 'lucide-react';
import React from 'react';

export class IconRenderer {
  /**
   * React 아이콘 컴포넌트를 PNG Blob으로 변환
   */
  async iconToPng(
    IconComponent: LucideIcon,
    size: number,
    color: string
  ): Promise<Blob> {
    // 1. React 컴포넌트를 SVG 문자열로 변환
    const svgString = renderToString(
      React.createElement(IconComponent, {
        size,
        color,
        strokeWidth: 2,
      })
    );

    // 2. SVG Blob 생성
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });

    // 3. Canvas에 그리기
    return this.svgBlobToPng(svgBlob, size);
  }

  /**
   * SVG Blob을 PNG Blob으로 변환
   */
  private async svgBlobToPng(
    svgBlob: Blob,
    size: number
  ): Promise<Blob> {
    // Canvas 생성
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // SVG를 이미지로 로드
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load SVG'));
      img.src = url;
    });

    // Canvas에 그리기
    ctx.drawImage(img, 0, 0, size, size);
    URL.revokeObjectURL(url);

    // PNG Blob 생성
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create PNG blob'));
        }
      }, 'image/png', 1.0);
    });
  }
}
```

#### 2.4 ClipboardManager 서비스

**src/services/clipboardManager.ts**:
```typescript
export class ClipboardManager {
  /**
   * 클립보드 API 지원 여부 확인
   */
  isSupported(): boolean {
    return !!(
      navigator.clipboard &&
      navigator.clipboard.write &&
      typeof ClipboardItem !== 'undefined'
    );
  }

  /**
   * 이미지를 클립보드에 복사
   */
  async copyImage(blob: Blob): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Clipboard API not supported in this browser');
    }

    try {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
    } catch (error) {
      if (error instanceof Error && error.name === 'NotAllowedError') {
        throw new Error('Clipboard permission denied');
      }
      throw error;
    }
  }
}
```

#### 2.5 ExportManager 서비스

**src/services/exportManager.ts**:
```typescript
import { Icon } from '../types';
import { hexToColorName } from '../utils/colors';

export class ExportManager {
  /**
   * PNG 파일 다운로드
   */
  downloadPng(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /**
   * 파일명 생성
   */
  generateFilename(icon: Icon, color: string, size: number): string {
    const colorName = hexToColorName(color) || 'custom';
    const iconName = icon.name.toLowerCase().replace(/\s+/g, '-');
    const timestamp = Date.now();

    return `${iconName}-${colorName}-${size}px-${timestamp}.png`;
  }
}
```

---

### Phase 3: 상태 관리 (0.5일)

#### 3.1 아이콘 데이터 준비

**src/data/icons.ts**:
```typescript
import {
  Home,
  User,
  Settings,
  Heart,
  Star,
  Mail,
  Search,
  Bell,
  Calendar,
  Camera,
  Download,
  Upload,
  Edit,
  Trash,
  Check,
  X,
  ChevronRight,
  Menu,
  Sun,
  Moon,
  // ... 더 많은 아이콘 import
} from 'lucide-react';
import { Icon } from '../types';

export const icons: Icon[] = [
  {
    id: 'home',
    name: 'Home',
    category: 'ui',
    tags: ['house', 'main', 'start'],
    component: Home,
  },
  {
    id: 'user',
    name: 'User',
    category: 'ui',
    tags: ['person', 'profile', 'account'],
    component: User,
  },
  {
    id: 'settings',
    name: 'Settings',
    category: 'ui',
    tags: ['config', 'preferences', 'options'],
    component: Settings,
  },
  // ... 더 많은 아이콘 정의
];
```

#### 3.2 IconContext 구현

**src/context/IconContext.tsx**:
```typescript
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Icon } from '../types';
import { icons as iconData } from '../data/icons';
import { IconRenderer } from '../services/iconRenderer';
import { ClipboardManager } from '../services/clipboardManager';
import { ExportManager } from '../services/exportManager';
import toast from 'react-hot-toast';

interface IconContextValue {
  icons: Icon[];
  selectedIcon: Icon | null;
  color: string;
  size: number;
  selectIcon: (icon: Icon) => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  downloadPng: () => Promise<void>;
  copyToClipboard: () => Promise<void>;
  isExporting: boolean;
}

const IconContext = createContext<IconContextValue | undefined>(undefined);

export function IconProvider({ children }: { children: React.ReactNode }) {
  const [icons] = useState<Icon[]>(iconData);
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(128);
  const [isExporting, setIsExporting] = useState(false);

  // 서비스 인스턴스
  const renderer = useMemo(() => new IconRenderer(), []);
  const clipboard = useMemo(() => new ClipboardManager(), []);
  const exporter = useMemo(() => new ExportManager(), []);

  // PNG 다운로드
  const downloadPng = useCallback(async () => {
    if (!selectedIcon) {
      toast.error('Please select an icon first');
      return;
    }

    setIsExporting(true);
    try {
      const blob = await renderer.iconToPng(
        selectedIcon.component,
        size,
        color
      );

      const filename = exporter.generateFilename(selectedIcon, color, size);
      exporter.downloadPng(blob, filename);

      toast.success('Downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed');
    } finally {
      setIsExporting(false);
    }
  }, [selectedIcon, size, color, renderer, exporter]);

  // 클립보드 복사
  const copyToClipboard = useCallback(async () => {
    if (!selectedIcon) {
      toast.error('Please select an icon first');
      return;
    }

    if (!clipboard.isSupported()) {
      toast.error('Clipboard not supported in your browser');
      return;
    }

    setIsExporting(true);
    try {
      const blob = await renderer.iconToPng(
        selectedIcon.component,
        size,
        color
      );

      await clipboard.copyImage(blob);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Copy failed');
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
  };

  return (
    <IconContext.Provider value={value}>
      {children}
    </IconContext.Provider>
  );
}

export function useIconContext() {
  const context = useContext(IconContext);
  if (!context) {
    throw new Error('useIconContext must be used within IconProvider');
  }
  return context;
}
```

---

### Phase 4: UI 컴포넌트 (1.5일)

#### 4.1 기본 레이아웃

**src/components/Header.tsx**:
```typescript
export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎨</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Icony</h1>
            <p className="text-sm text-gray-600">
              Icon Customization Made Simple
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
```

**src/components/Layout/MainLayout.tsx**:
```typescript
import { Sidebar } from './Sidebar';
import { CustomizationPanel } from '../CustomizationPanel/CustomizationPanel';

export function MainLayout() {
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

**src/components/Layout/Sidebar.tsx**:
```typescript
import { useState } from 'react';
import { SearchBar } from '../IconGallery/SearchBar';
import { IconGallery } from '../IconGallery/IconGallery';

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <IconGallery searchQuery={searchQuery} />
    </div>
  );
}
```

#### 4.2 아이콘 갤러리

**src/hooks/useIconSearch.ts**:
```typescript
import { useMemo } from 'react';
import { Icon } from '../types';

export function useIconSearch(icons: Icon[], query: string): Icon[] {
  return useMemo(() => {
    if (!query.trim()) {
      return icons;
    }

    const lowerQuery = query.toLowerCase();

    return icons.filter((icon) => {
      // 이름 매칭
      if (icon.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // 태그 매칭
      if (icon.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
        return true;
      }

      // 카테고리 매칭
      if (icon.category.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      return false;
    });
  }, [icons, query]);
}
```

**src/components/IconGallery/SearchBar.tsx**:
```typescript
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search icons..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
```

**src/components/IconGallery/IconCard.tsx**:
```typescript
import React from 'react';
import { Icon } from '../../types';
import { cn } from '../../utils/cn';

interface IconCardProps {
  icon: Icon;
  selected: boolean;
  onClick: () => void;
}

export const IconCard = React.memo(function IconCard({
  icon,
  selected,
  onClick,
}: IconCardProps) {
  const IconComponent = icon.component;

  return (
    <button
      onClick={onClick}
      className={cn(
        'p-3 border-2 rounded-lg transition-all hover:border-blue-400 hover:shadow-md',
        selected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white'
      )}
      title={icon.name}
    >
      <IconComponent className="w-full h-full text-gray-700" strokeWidth={1.5} />
    </button>
  );
});
```

**src/components/IconGallery/IconGallery.tsx**:
```typescript
import { useIconContext } from '../../context/IconContext';
import { useIconSearch } from '../../hooks/useIconSearch';
import { IconCard } from './IconCard';

interface IconGalleryProps {
  searchQuery: string;
}

export function IconGallery({ searchQuery }: IconGalleryProps) {
  const { icons, selectedIcon, selectIcon } = useIconContext();
  const filteredIcons = useIconSearch(icons, searchQuery);

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">
        {filteredIcons.length} {filteredIcons.length === 1 ? 'icon' : 'icons'}{' '}
        found
      </div>

      <div className="grid grid-cols-4 gap-2 max-h-[600px] overflow-y-auto pr-2">
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

#### 4.3 커스터마이징 패널

**src/components/CustomizationPanel/CustomizationPanel.tsx**:
```typescript
import { ImageIcon } from 'lucide-react';
import { useIconContext } from '../../context/IconContext';
import { IconPreview } from './IconPreview';
import { ColorSelector } from './ColorSelector';
import { SizeSelector } from './SizeSelector';
import { ExportButtons } from './ExportButtons';

export function CustomizationPanel() {
  const { selectedIcon } = useIconContext();

  if (!selectedIcon) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 flex items-center justify-center min-h-[600px]">
        <div className="text-center text-gray-400">
          <ImageIcon className="w-20 h-20 mx-auto mb-4" />
          <p className="text-lg">Select an icon to customize</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
      <IconPreview />
      <ColorSelector />
      <SizeSelector />
      <ExportButtons />
    </div>
  );
}
```

**src/components/CustomizationPanel/IconPreview.tsx**:
```typescript
import { useIconContext } from '../../context/IconContext';

export function IconPreview() {
  const { selectedIcon, color, size } = useIconContext();

  if (!selectedIcon) return null;

  const IconComponent = selectedIcon.component;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-lg font-medium text-gray-800">
        {selectedIcon.name}
      </div>

      <div
        className="flex items-center justify-center bg-gray-50 rounded-xl border-2 border-gray-200"
        style={{
          width: size + 60,
          height: size + 60,
        }}
      >
        <IconComponent
          size={size}
          color={color}
          strokeWidth={2}
          className="transition-all duration-200"
        />
      </div>
    </div>
  );
}
```

**src/components/CustomizationPanel/SwatchPicker.tsx**:
```typescript
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { PRESET_COLORS } from '../../utils/colors';

interface SwatchPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export function SwatchPicker({ selectedColor, onColorSelect }: SwatchPickerProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {PRESET_COLORS.map((color) => {
        const isSelected = selectedColor.toLowerCase() === color.hex.toLowerCase();

        return (
          <button
            key={color.hex}
            onClick={() => onColorSelect(color.hex)}
            className={cn(
              'relative w-10 h-10 rounded-lg border-2 transition-all hover:scale-110',
              isSelected ? 'border-blue-500 scale-110 shadow-lg' : 'border-gray-300'
            )}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          >
            {isSelected && (
              <Check
                className="absolute inset-0 m-auto text-white"
                style={{
                  filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))',
                }}
                size={20}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
```

**src/components/CustomizationPanel/ColorSelector.tsx**:
```typescript
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useIconContext } from '../../context/IconContext';
import { SwatchPicker } from './SwatchPicker';

export function ColorSelector() {
  const { color, setColor } = useIconContext();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        Color
      </label>

      <SwatchPicker selectedColor={color} onColorSelect={setColor} />

      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        {showPicker ? (
          <>
            <ChevronUp size={16} /> Hide Custom Picker
          </>
        ) : (
          <>
            <ChevronDown size={16} /> Show Custom Picker
          </>
        )}
      </button>

      {showPicker && (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <HexColorPicker color={color} onChange={setColor} />
          <div className="mt-3 flex items-center gap-2">
            <div
              className="w-10 h-10 rounded border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded font-mono text-sm"
              placeholder="#000000"
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

**src/components/CustomizationPanel/SizeSelector.tsx**:
```typescript
import { useIconContext } from '../../context/IconContext';
import { cn } from '../../utils/cn';

const SIZES = [32, 64, 128, 256];

export function SizeSelector() {
  const { size, setSize } = useIconContext();

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        Size
      </label>

      <div className="flex gap-3">
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={cn(
              'flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all',
              size === s
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                : 'border-gray-300 hover:border-gray-400 text-gray-700'
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

**src/components/CustomizationPanel/ExportButtons.tsx**:
```typescript
import { Download, Copy, Loader2 } from 'lucide-react';
import { useIconContext } from '../../context/IconContext';

export function ExportButtons() {
  const { downloadPng, copyToClipboard, isExporting } = useIconContext();

  return (
    <div className="flex gap-3 pt-4">
      <button
        onClick={downloadPng}
        disabled={isExporting}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isExporting ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            <Download size={20} />
            Download PNG
          </>
        )}
      </button>

      <button
        onClick={copyToClipboard}
        disabled={isExporting}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isExporting ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            <Copy size={20} />
            Copy to Clipboard
          </>
        )}
      </button>
    </div>
  );
}
```

#### 4.4 메인 App

**src/App.tsx**:
```typescript
import { Toaster } from 'react-hot-toast';
import { IconProvider } from './context/IconContext';
import { Header } from './components/Header';
import { MainLayout } from './components/Layout/MainLayout';

function App() {
  return (
    <IconProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <MainLayout />
        <Toaster position="bottom-right" />
      </div>
    </IconProvider>
  );
}

export default App;
```

---

### Phase 5: 통합 및 테스팅 (1일)

#### 5.1 개발 서버 실행

```bash
npm run dev
```

#### 5.2 테스트 체크리스트

**기능 테스트**:
- [ ] 아이콘 검색이 정상 작동
- [ ] 아이콘 선택 시 미리보기 표시
- [ ] 색상 변경이 실시간 반영
- [ ] 크기 변경이 정상 작동
- [ ] PNG 다운로드 성공
- [ ] 클립보드 복사 성공

**UI/UX 테스트**:
- [ ] 반응형 디자인 확인 (모바일/태블릿/데스크톱)
- [ ] 키보드 네비게이션 작동
- [ ] 로딩 상태 표시
- [ ] 에러 처리 확인

**브라우저 호환성**:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

#### 5.3 성능 최적화

```typescript
// React.memo 적용 확인
const IconCard = React.memo(IconCard);

// useMemo/useCallback 적용 확인
const filteredIcons = useMemo(() => {...}, [icons, query]);
const handleClick = useCallback(() => {...}, [deps]);
```

---

### Phase 6: 폴리싱 및 배포 (0.5일)

#### 6.1 빌드 최적화

**vite.config.ts**:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'lucide-react': ['lucide-react'],
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
});
```

#### 6.2 프로덕션 빌드

```bash
npm run build
npm run preview  # 빌드 결과 미리보기
```

#### 6.3 Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

또는 GitHub 연동:
1. GitHub에 푸시
2. Vercel 대시보드에서 Import Project
3. 자동 빌드 및 배포

---

## 추가 개선 사항

### 고급 기능 추가

**1. 최근 사용 색상 저장**:
```typescript
// LocalStorage 활용
const recentColors = JSON.parse(
  localStorage.getItem('recentColors') || '[]'
);
```

**2. 키보드 단축키**:
```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      downloadPng();
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [downloadPng]);
```

**3. Dark Mode**:
```typescript
// Tailwind dark mode 활용
<div className="bg-white dark:bg-gray-800">
```

---

## 트러블슈팅

### 문제: SVG → PNG 변환 실패

**원인**: CORS 정책 또는 SVG 형식 문제

**해결**:
```typescript
// SVG에 xmlns 속성 추가
const svgString = svgString.replace(
  '<svg',
  '<svg xmlns="http://www.w3.org/2000/svg"'
);
```

### 문제: 클립보드 복사 안됨 (Safari)

**원인**: Safari는 사용자 제스처 내에서만 클립보드 접근 허용

**해결**:
```typescript
// 버튼 클릭 핸들러 내부에서 직접 호출
// setTimeout 등 비동기 콜백 내에서는 실패할 수 있음
```

### 문제: PNG 품질 낮음

**원인**: Canvas 해상도 부족

**해결**:
```typescript
// 2x 스케일로 렌더링
const scale = 2;
canvas.width = size * scale;
canvas.height = size * scale;
ctx.scale(scale, scale);
```

---

## 다음 단계

프로젝트 완료 후 고려할 사항:

1. **Analytics 추가**: Google Analytics 또는 Plausible
2. **A/B 테스팅**: 다양한 UI 패턴 테스트
3. **사용자 피드백**: 피드백 폼 추가
4. **SEO 최적화**: 메타 태그, Open Graph
5. **PWA 변환**: 오프라인 지원, 설치 가능

구현을 시작하시려면:
```bash
npm create vite@latest icony -- --template react-ts
cd icony
# 위 가이드 단계별로 진행
```
