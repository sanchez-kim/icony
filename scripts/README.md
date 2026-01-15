# Scripts Directory

이 디렉토리는 아이콘 생성 및 프로젝트 관리를 위한 일회성 스크립트를 포함합니다.

## 📂 구조

```
scripts/
├── README.md                      # 이 파일
├── check-icons.cjs               # FontAwesome 아이콘 목록 확인
├── generate-icons.cjs            # 초기 아이콘 생성 스크립트
├── generate-icons-v2.cjs         # 개선된 아이콘 생성 스크립트
├── generate-all-icons.cjs        # 모든 아이콘 생성 (v1)
├── generate-all-icons-v2.cjs     # 모든 아이콘 생성 (v2, 카테고리 포함)
└── .archive/                     # 생성된 데이터 및 로그
    ├── all-icons.txt             # FontAwesome 아이콘 전체 목록
    ├── icon-generation.log       # 아이콘 생성 로그
    ├── category-test.txt         # 카테고리 테스트 결과
    └── final-summary.txt         # 최종 프로젝트 요약
```

## 🚀 스크립트 사용법

### 1. check-icons.cjs
FontAwesome 패키지에서 사용 가능한 모든 아이콘을 확인하고 목록을 생성합니다.

```bash
node scripts/check-icons.cjs
```

**출력:**
- 콘솔에 아이콘 통계 출력
- `all-icons.txt` 파일 생성 (모든 아이콘 이름)

### 2. generate-all-icons-v2.cjs (✅ 권장)
FontAwesome Free Solid 아이콘 전체를 카테고리와 함께 생성합니다.

```bash
node scripts/generate-all-icons-v2.cjs
```

**기능:**
- 1,983개의 FontAwesome 아이콘 생성
- 67개의 공식 카테고리로 자동 분류
- `src/data/fontawesome-icons.ts` 파일 생성

**출력:**
- 카테고리별 아이콘 개수
- 생성된 아이콘 총 개수
- TypeScript 타입 안전성 보장

## 📋 스크립트 히스토리

### v1 (generate-icons.cjs)
- 기본 아이콘 생성 (200개)
- 간단한 카테고리 분류

### v2 (generate-all-icons-v2.cjs)
- 전체 FontAwesome Free Solid 아이콘 (1,983개)
- 67개 공식 카테고리 매핑
- 키워드 기반 자동 분류
- exact match + keyword matching

## ⚠️ 주의사항

1. 스크립트 실행 전 반드시 `all-icons.txt` 파일이 필요합니다
2. 스크립트는 프로젝트 루트에서 실행되어야 합니다
3. 생성된 파일은 `src/data/` 디렉토리에 저장됩니다

## 🔄 재생성 방법

아이콘 데이터를 새로 생성해야 할 경우:

```bash
# 1. 아이콘 목록 확인
node scripts/check-icons.cjs

# 2. 아이콘 데이터 생성
node scripts/generate-all-icons-v2.cjs

# 3. 개발 서버 재시작 (자동 반영됨)
npm run dev
```

## 📝 노트

- `.archive/` 디렉토리는 git에서 추적되지 않습니다
- 스크립트 파일들은 개발 히스토리 보존을 위해 유지됩니다
- 프로덕션 빌드에는 포함되지 않습니다
