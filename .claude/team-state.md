# Team State - 2026-04-08

## 프로젝트
- 이름: icony
- 스택: React 18, TypeScript, Vite 6, Tailwind CSS 3, Vercel
- 브랜치: main (clean)
- 설명: 아이콘 커스터마이징 & 익스포트 도구 (9,000+ 아이콘, 8개 라이브러리)

## 현재 목표
**Vite React SPA → Next.js 마이그레이션** (SSR/SSG + SEO 최적화)

### 마이그레이션 배경
- 현재 순수 SPA로 검색엔진 크롤링 불가
- SEO 최적화를 위해 Next.js 전환 결정
- 페이지 3개, 컴포넌트 22개, Context 3개 규모

### 핵심 과제
1. Next.js App Router 프로젝트 생성 + 기본 설정
2. 파일 기반 라우팅 전환 (3 routes: /, /app, /terms)
3. 컴포넌트/컨텍스트 포팅 ('use client' 디렉티브)
4. 아이콘 라이브러리 코드 스플리팅 재설계 (Vite manualChunks → next/dynamic)
5. SEO 최적화 (메타태그, sitemap, JSON-LD, OG 이미지)
6. Vercel 배포 설정 전환

## 진행 중인 작업
| 작업 | 담당 | 상태 | 비고 |
|------|------|------|------|
| TASK-01: Next.js 프로젝트 초기화 | - | pending | App Router, TypeScript, Tailwind |
| TASK-02: 라우팅 & 레이아웃 구조 | - | pending | layout.tsx, 3 pages |
| TASK-03: 컨텍스트/훅 포팅 | - | pending | IconContext, ThemeContext, LanguageContext |
| TASK-04: 컴포넌트 포팅 | - | pending | 22개 컴포넌트 + 'use client' |
| TASK-05: 아이콘 코드스플리팅 | - | pending | icon-registry.ts → next/dynamic 전략 |
| TASK-06: SEO 최적화 | - | pending | metadata, sitemap, JSON-LD, robots |
| TASK-07: 빌드 검증 & 배포 | - | pending | Vercel 배포 테스트 |

## 이전 스프린트 완료 사항
- Font Awesome 완전 제거 + MIT/ISC 라이브러리 전환
- 8개 라이브러리 통합 (Lucide, Tabler, Phosphor, Phosphor Fill, Heroicons, Heroicons Solid, Bootstrap, Radix)
- ~10,000+ 아이콘 갤러리 구축
- 반응형 레이아웃 수정, 로고/파비콘 교체
- 이용약관/푸터 업데이트, 아이콘 출처 표시

## 결정 사항
- [2026-04-08] Vite → Next.js App Router 마이그레이션 결정 (SEO 최적화 목적)
- [2026-04-08] 팀모드로 병렬 진행

## 스프린트 계획

### Sprint 1 — 기반 구축 (병렬)
- [ ] TASK-01: Next.js 프로젝트 초기화 (create-next-app + Tailwind + TS)
- [ ] TASK-02: 라우팅 & 레이아웃 구조 설계

### Sprint 2 — 코어 포팅 (TASK-01,02 완료 후, 병렬)
- [ ] TASK-03: 컨텍스트/훅 포팅
- [ ] TASK-04: 컴포넌트 포팅

### Sprint 3 — 최적화 (Sprint 2 완료 후)
- [ ] TASK-05: 아이콘 코드스플리팅 재설계
- [ ] TASK-06: SEO 최적화
- [ ] TASK-07: 빌드 검증 & Vercel 배포

## 다음 할 일
1. Sprint 1 착수: TASK-01 + TASK-02 병렬 위임
