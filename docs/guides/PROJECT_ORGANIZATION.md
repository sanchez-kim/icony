# Project Organization

이 문서는 Icony 프로젝트의 파일 구조와 조직 원칙을 설명합니다.

## 📁 디렉토리 구조

### `/src` - 소스 코드
애플리케이션의 모든 소스 코드가 포함됩니다.

```
src/
├── components/          # React 컴포넌트
├── context/            # React Context API
├── services/           # 비즈니스 로직
├── hooks/              # 커스텀 React Hooks
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
└── data/               # 아이콘 데이터
```

### `/public` - 정적 자산
빌드 시 변환 없이 `dist/` 폴더로 복사되는 정적 파일들이 포함됩니다.

```
public/
├── favicon.svg          # 사이트 파비콘
├── robots.txt           # 검색 엔진 크롤러 가이드
└── README.md            # 사용 가이드
```

### `/docs` - 문서
프로젝트 설계 및 기술 문서가 포함됩니다.

```
docs/
├── README.md                   # 문서 인덱스
├── architecture.md             # 시스템 아키텍처
├── components.md               # 컴포넌트 스펙
├── technical-specs.md          # 기술 사양
├── implementation-guide.md     # 구현 가이드
└── user-flows.md               # 사용자 플로우
```

### `/scripts` - 유틸리티 스크립트
개발 및 빌드 관련 스크립트가 포함됩니다.

```
scripts/
├── README.md                   # 스크립트 문서
├── check-icons.cjs             # 아이콘 확인
├── generate-all-icons-v2.cjs   # 아이콘 생성 (최신)
└── .archive/                   # 생성된 데이터 보관
    ├── all-icons.txt           # 전체 아이콘 목록
    └── icon-generation.log     # 생성 로그
```

### 루트 디렉토리 파일

#### 설정 파일
- `vite.config.ts` - Vite 빌드 설정
- `tsconfig.json` - TypeScript 설정
- `tailwind.config.js` - Tailwind CSS 설정
- `postcss.config.js` - PostCSS 설정
- `package.json` - NPM 패키지 설정

#### 문서 파일
- `README.md` - 프로젝트 소개 (메인)
- `CHANGELOG.md` - 변경 이력
- `DEPLOYMENT.md` - 배포 가이드
- `PROJECT_SUMMARY.md` - 프로젝트 요약
- `QUICK_START.md` - 빠른 시작 가이드
- `PROJECT_ORGANIZATION.md` - 이 문서

## 🗂️ 파일 명명 규칙

### 컴포넌트
- **PascalCase**: `IconGallery.tsx`, `ColorSelector.tsx`
- 컴포넌트와 같은 이름의 디렉토리에 위치: `IconGallery/IconGallery.tsx`

### 서비스
- **camelCase**: `iconRenderer.ts`, `clipboardManager.ts`
- 클래스 기반 서비스는 PascalCase: `class IconRenderer`

### 유틸리티
- **camelCase**: `cn.ts` (classname utility)

### 타입
- **PascalCase**: `interface Icon`, `type IconType`

### 스크립트
- **kebab-case**: `generate-all-icons-v2.cjs`
- CommonJS 확장자: `.cjs`

## 📝 Git 무시 규칙

### `.gitignore` 주요 항목

```gitignore
# 빌드 출력
node_modules/
dist/

# 환경 변수
.env*

# 임시 파일
scripts/.archive/
*.log

# 에디터
.vscode/
.idea/
```

## 🔄 파일 라이프사이클

### 개발 중
1. **소스 코드** → `src/` 디렉토리
2. **문서** → `docs/` 디렉토리
3. **스크립트** → `scripts/` 디렉토리

### 빌드 시
1. `src/` → `dist/` (Vite 빌드)
2. `scripts/` → 실행되지 않음 (개발 전용)

### Git 추적
- ✅ 소스 코드 (`src/`)
- ✅ 문서 (`docs/`)
- ✅ 스크립트 (`scripts/*.cjs`)
- ✅ 설정 파일
- ❌ 빌드 출력 (`dist/`)
- ❌ 의존성 (`node_modules/`)
- ❌ 임시 파일 (`scripts/.archive/`)

## 🚮 정리 가이드

### 정기적으로 확인할 항목

1. **임시 파일**
   ```bash
   ls scripts/.archive/
   ```
   - 오래된 로그 파일 삭제
   - 더 이상 필요 없는 데이터 파일 제거

2. **미사용 의존성**
   ```bash
   npm outdated
   npm prune
   ```

3. **빌드 캐시**
   ```bash
   npm run build -- --clean
   ```

## 📦 배포 시 포함되는 파일

### 프로덕션 빌드
```bash
npm run build
```

**포함:**
- `dist/` - 빌드된 JavaScript, CSS, HTML
- 이미지 및 정적 자산

**제외:**
- `src/` - 원본 소스 코드
- `scripts/` - 개발 스크립트
- `docs/` - 문서
- `node_modules/` - 의존성
- 설정 파일

## 🔍 파일 찾기 팁

### 컴포넌트 찾기
```bash
find src/components -name "*.tsx"
```

### 타입 정의 찾기
```bash
grep -r "interface\|type" src/types/
```

### 스크립트 확인
```bash
ls scripts/
cat scripts/README.md
```

### 문서 확인
```bash
ls docs/
```

## 📚 추가 리소스

- [프로젝트 README](./README.md) - 프로젝트 개요
- [스크립트 문서](./scripts/README.md) - 스크립트 사용법
- [문서 인덱스](./docs/README.md) - 기술 문서
