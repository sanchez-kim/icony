# Public Directory

이 디렉토리는 Vite 빌드 시 변환 없이 `dist/` 폴더로 복사되는 정적 자산을 포함합니다.

## 📂 구조

```
public/
├── favicon.svg          # 사이트 파비콘
├── robots.txt           # 검색 엔진 크롤러 가이드
└── README.md            # 이 파일
```

## 🔧 사용 방법

### 정적 파일 추가
`public/` 폴더에 추가된 파일은 빌드 시 루트 경로로 복사됩니다.

```
public/logo.png  →  dist/logo.png
```

### HTML에서 참조
절대 경로를 사용하여 참조합니다.

```html
<!-- index.html -->
<link rel="icon" href="/favicon.svg" />
<img src="/logo.png" alt="Logo" />
```

### React에서 참조
절대 경로를 사용합니다.

```jsx
<img src="/logo.png" alt="Logo" />
```

## ⚠️ 주의사항

1. **변환되지 않음**: 이 폴더의 파일은 Vite에 의해 변환되지 않습니다
   - 이미지 최적화 없음
   - 파일 해싱 없음
   - 번들링 없음

2. **절대 경로 사용**: 항상 `/`로 시작하는 절대 경로를 사용하세요

3. **빌드 시 포함**: 모든 파일이 프로덕션 빌드에 포함됩니다

## 📋 권장 파일 유형

### 포함하면 좋은 것
- ✅ `favicon.ico`, `favicon.svg` - 파비콘
- ✅ `robots.txt` - 크롤러 가이드
- ✅ `sitemap.xml` - 사이트맵
- ✅ `manifest.json` - PWA 매니페스트
- ✅ 폰트 파일 (.woff, .woff2)
- ✅ 로고 이미지

### src/assets/에 넣어야 하는 것
- ❌ 컴포넌트에서 import하는 이미지
- ❌ 최적화가 필요한 이미지
- ❌ SVG 컴포넌트로 사용할 파일

## 🌐 빌드 결과

```bash
npm run build
```

결과:
```
dist/
├── index.html
├── favicon.svg         # public/에서 복사됨
├── robots.txt          # public/에서 복사됨
└── assets/
    └── [번들 파일들]
```

## 📚 추가 정보

- [Vite Static Asset Handling](https://vitejs.dev/guide/assets.html#the-public-directory)
- [프로젝트 구조](../PROJECT_ORGANIZATION.md)
