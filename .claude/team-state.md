# Team State - 2026-03-25

## 프로젝트
- 이름: icony
- 스택: React 18, TypeScript, Vite, Tailwind CSS, Vercel
- 브랜치: main (clean)
- 설명: 아이콘 커스터마이징 & 익스포트 도구 (색상/크기/획두께/PNG/SVG)

## 현재 목표
아이콘 라이센스 정비 + 아이콘 수 대폭 확장 + 검색 품질 개선

### 핵심 요구사항
1. Font Awesome 제거 (CC BY 4.0 → 상업적 재배포 리스크)
2. MIT/Apache/ISC 라이브러리만으로 13,000+ 아이콘 구성
3. 라이브러리별 Lazy Loading (번들 사이즈 관리)
4. 한국어 + 영어 검색 동시 최적화
5. 아이콘 명세 문서 정비

## 현재 아이콘 현황
| 라이브러리 | 현재 | 목표 | 라이선스 | 액션 |
|-----------|------|------|---------|------|
| Font Awesome | 1,983개 | 0 | CC BY 4.0 | ❌ 제거 |
| Lucide | 96개 | ~1,000개 | ISC | ↑ 확장 |
| Tabler | 909개 | ~5,700개 | MIT | ↑ 확장 |
| Phosphor | 870개 | ~1,300개 | MIT | ↑ 확장 |
| Heroicons | 0 | ~300개 | MIT | ➕ 신규 |
| Bootstrap Icons | 0 | ~2,000개 | MIT | ➕ 신규 |
| Radix Icons | 0 | ~318개 | MIT | ➕ 신규 |
| Remix Icon | 0 | ~2,800개 | Apache 2.0 | ➕ 신규 |

예상 합계: ~13,400개 (현재 3,858개의 3.5x)

## 진행 중인 작업
| 작업 | 담당 | 상태 | 비고 |
|------|------|------|------|
| TASK-01: 아이콘 스키마 재설계 | agent-alpha | ✅ done | icon.ts, libraries.ts, icon-registry.ts, useIconLibrary.ts, lucide-descriptors.ts |
| TASK-02: Vite 코드스플리팅 최적화 | agent-beta | ✅ done | vite.config.ts 9개 청크 분리, 빌드 성공 4.74s |
| TASK-03: 한국어-영어 태그 매핑 | agent-gamma | ✅ done | ko-search-map.ts(375개 KO항목), en-synonyms.ts(412개 동의어), useIconSearch.ts 업데이트 |
| TASK-04: Font Awesome 완전 제거 | agent-delta | ✅ done | package.json 5개 패키지 제거, 17개 파일 정리, npm install 완료 |
| TASK-05~07: 기존 라이브러리 전량 확장 | agent-epsilon | ✅ done | Lucide 1541 / Tabler 5986 / Phosphor 1047 descriptor 생성 |
| TASK-08~09: 신규 라이브러리 통합 | agent-zeta | ✅ done | heroicons 145 / bootstrap 280 / radix 150, npm install 완료 |
| TASK-12: 렌더링 파이프라인 마이그레이션 | agent-eta | 🔄 in_progress | IconContext + IconCard를 descriptor 기반으로 연결 |

## 완료된 작업
- 비즈니스 패널 분석 완료 (SEO, 수익화, 검색 UX 전략 수립)
- 라이선스 리스크 분석 완료 (FA 제거 결정)
- 실행 계획 설계 완료

## 결정 사항
- [2026-03-25] Font Awesome 전면 제거 결정 (CC BY 4.0 상업 재배포 리스크)
- [2026-03-25] Lazy Loading: Vite manualChunks + React.lazy() 라이브러리별 코드 스플리팅
- [2026-03-25] 검색: 한국어 태그 매핑 파일 별도 구성 (ko-tags.ts) + 영어 동의어 확장
- [2026-03-25] 기본 무료 유지 (Freemium은 추후 단계)

## 작업 스프린트 계획

### Sprint 1 — 아키텍처 기반 (병렬 실행 가능)
- [ ] [TASK-01] 아이콘 데이터 스키마 & 타입 재설계
- [ ] [TASK-02] Vite lazy loading 아키텍처 설계 & 구현
- [ ] [TASK-03] 한국어-영어 태그 매핑 파일 구축

### Sprint 2 — 라이브러리 교체 (TASK-01 완료 후)
- [ ] [TASK-04] Font Awesome 제거 + 의존성 정리
- [ ] [TASK-05] Lucide 전량 확장 (96 → ~1,000)
- [ ] [TASK-06] Tabler 전량 확장 (909 → ~5,700)
- [ ] [TASK-07] Phosphor 전량 확장 (870 → ~1,300)
- [ ] [TASK-08] Heroicons 신규 통합
- [ ] [TASK-09] Bootstrap Icons 신규 통합
- [ ] [TASK-10] Radix Icons 신규 통합
- [ ] [TASK-11] Remix Icon 신규 통합

### Sprint 3 — 검색 & 문서화 (Sprint 2 완료 후)
- [ ] [TASK-12] 검색 엔진 한국어 지원 업데이트
- [ ] [TASK-13] 아이콘 명세 문서 작성 (/docs/)
- [ ] [TASK-14] ATTRIBUTION.md 업데이트

## 다음 할 일
1. TASK-01: 스키마 설계 (선행 조건)
2. TASK-02 + TASK-03 병렬 착수 (TASK-01 완료 후)
