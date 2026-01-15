# Icony 프로젝트 문서

Icony 프로젝트의 모든 문서를 체계적으로 정리한 디렉토리입니다.

## 📚 문서 구조

```
docs/
├── README.md                 # 이 문서 (문서 인덱스)
├── CHANGELOG.md              # 변경 이력
├── PROJECT_SUMMARY.md        # 프로젝트 요약
│
├── 📂 design/                # 설계 문서
│   ├── architecture.md       # 시스템 아키텍처
│   ├── components.md         # 컴포넌트 스펙
│   ├── technical-specs.md    # 기술 사양
│   ├── implementation-guide.md  # 구현 가이드
│   └── user-flows.md         # 사용자 플로우
│
├── 📂 guides/                # 가이드 문서
│   ├── QUICK_START.md        # 빠른 시작 가이드
│   ├── PROJECT_ORGANIZATION.md  # 프로젝트 구조 가이드
│   └── DEPLOYMENT.md         # 배포 가이드
│
└── 📂 reports/               # 작업 보고서
    ├── CLEANUP_SUMMARY.md    # 프로젝트 정리 보고서
    └── PUBLIC_FOLDER_UPDATE.md  # Public 폴더 정리 보고서
```

## 📖 문서 가이드

### 🎨 설계 문서 (design/)

프로젝트 초기 설계 및 기술 사양 문서입니다.

| 문서 | 내용 | 대상 독자 |
|------|------|----------|
| [architecture.md](./design/architecture.md) | 시스템 아키텍처, 컴포넌트 구조, 데이터 흐름 | 개발자, 아키텍트 |
| [components.md](./design/components.md) | 12개 컴포넌트 상세 스펙 및 인터페이스 | 프론트엔드 개발자 |
| [technical-specs.md](./design/technical-specs.md) | TypeScript 타입 정의, 서비스 API | 전체 개발자 |
| [implementation-guide.md](./design/implementation-guide.md) | 6단계 구현 가이드 (4-5일) | 개발 리더 |
| [user-flows.md](./design/user-flows.md) | 사용자 시나리오 및 플로우 | PM, 디자이너 |

### 📘 가이드 문서 (guides/)

프로젝트 사용 및 관리 가이드입니다.

| 문서 | 내용 | 목적 |
|------|------|------|
| [QUICK_START.md](./guides/QUICK_START.md) | 빠른 시작 가이드 | 신규 개발자 온보딩 |
| [PROJECT_ORGANIZATION.md](./guides/PROJECT_ORGANIZATION.md) | 프로젝트 구조, 파일 명명 규칙 | 프로젝트 이해 |
| [DEPLOYMENT.md](./guides/DEPLOYMENT.md) | 배포 가이드 및 절차 | 배포 담당자 |

### 📋 작업 보고서 (reports/)

프로젝트 정리 및 개선 작업 보고서입니다.

| 문서 | 내용 | 작성일 |
|------|------|--------|
| [CLEANUP_SUMMARY.md](./reports/CLEANUP_SUMMARY.md) | 프로젝트 파일 구조 정리 작업 | 2026-01-14 |
| [PUBLIC_FOLDER_UPDATE.md](./reports/PUBLIC_FOLDER_UPDATE.md) | public/ 폴더 구조 생성 작업 | 2026-01-14 |

### 📝 프로젝트 문서

| 문서 | 내용 |
|------|------|
| [CHANGELOG.md](./CHANGELOG.md) | 버전별 변경 이력 |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | 프로젝트 전체 요약 |

## 🚀 빠른 참조

### 처음 시작하시나요?
1. 📖 [README.md](../README.md) - 프로젝트 소개
2. 📘 [QUICK_START.md](./guides/QUICK_START.md) - 설치 및 실행
3. 🎨 [architecture.md](./design/architecture.md) - 시스템 이해

### 개발 중이신가요?
1. 📋 [components.md](./design/components.md) - 컴포넌트 스펙
2. 🔧 [technical-specs.md](./design/technical-specs.md) - 기술 사양
3. 📂 [PROJECT_ORGANIZATION.md](./guides/PROJECT_ORGANIZATION.md) - 파일 구조

### 배포 준비 중이신가요?
1. 🚀 [DEPLOYMENT.md](./guides/DEPLOYMENT.md) - 배포 가이드
2. 📝 [CHANGELOG.md](./CHANGELOG.md) - 변경 이력

## 🔍 문서 검색

### 키워드별 문서 찾기

- **아키텍처**: design/architecture.md
- **컴포넌트**: design/components.md
- **타입 정의**: design/technical-specs.md
- **설치/실행**: guides/QUICK_START.md
- **프로젝트 구조**: guides/PROJECT_ORGANIZATION.md
- **배포**: guides/DEPLOYMENT.md
- **변경 이력**: CHANGELOG.md

### 역할별 필수 문서

**프론트엔드 개발자**
- design/components.md
- design/technical-specs.md
- guides/PROJECT_ORGANIZATION.md

**백엔드 개발자**
- design/architecture.md
- design/technical-specs.md

**프로젝트 매니저**
- PROJECT_SUMMARY.md
- design/implementation-guide.md
- CHANGELOG.md

**신규 개발자**
- ../README.md
- guides/QUICK_START.md
- design/architecture.md

## 📝 문서 작성 가이드

### 문서 위치 규칙

| 문서 유형 | 위치 | 예시 |
|----------|------|------|
| 설계/기술 문서 | docs/design/ | architecture.md |
| 사용 가이드 | docs/guides/ | QUICK_START.md |
| 작업 보고서 | docs/reports/ | CLEANUP_SUMMARY.md |
| 변경 이력 | docs/ | CHANGELOG.md |
| 프로젝트 요약 | docs/ | PROJECT_SUMMARY.md |

### 문서 명명 규칙

- **대문자 시작**: 루트 레벨 문서 (README.md, CHANGELOG.md)
- **kebab-case**: 설계 문서 (architecture.md, user-flows.md)
- **UPPER_CASE**: 중요 프로젝트 문서 (QUICK_START.md)

### 링크 참조

```markdown
<!-- docs/ 내부에서 상대 경로 -->
[Architecture](./design/architecture.md)

<!-- docs/ 내부에서 루트 참조 -->
[Main README](../README.md)

<!-- 루트에서 docs/ 참조 -->
[Documentation](./docs/README.md)
```

## 🔄 문서 업데이트

### 문서 유지보수

1. **변경 사항 발생 시**
   - 관련 문서 업데이트
   - CHANGELOG.md에 기록

2. **새 기능 추가 시**
   - design/components.md 업데이트
   - design/technical-specs.md 타입 추가

3. **프로젝트 구조 변경 시**
   - guides/PROJECT_ORGANIZATION.md 업데이트
   - 관련 링크 확인

## 📚 추가 리소스

- [프로젝트 메인 README](../README.md)
- [Scripts 문서](../scripts/README.md)
- [Public 폴더 가이드](../public/README.md)

---

**최종 업데이트**: 2026-01-14
**문서 버전**: 2.0 (체계적 정리 완료)
