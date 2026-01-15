# Icony - Icon Customization Service

## 프로젝트 개요

Icony는 FontAwesome과 유사한 아이콘 커스터마이징 서비스로, 사용자가 아이콘을 선택하고 원하는 색상으로 변경한 후 PNG로 저장하거나 클립보드에 복사하여 PowerPoint에 삽입할 수 있는 간단한 웹 서비스입니다.

## 주요 기능

- 📚 **아이콘 라이브러리**: 1000+ 아이콘 제공 (Lucide Icons 기반)
- 🎨 **색상 커스터마이징**: 프리셋 스와치 + 커스텀 컬러 피커
- 📐 **사이즈 조절**: 32px, 64px, 128px, 256px
- 💾 **PNG 다운로드**: 고품질 PNG 파일로 저장
- 📋 **클립보드 복사**: PPT/문서에 바로 붙여넣기 가능
- 🔍 **검색 및 필터링**: 빠른 아이콘 검색

## 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Color Picker**: react-colorful
- **State Management**: React Context API

## 문서 구조

```
docs/
├── README.md                  # 프로젝트 개요 (현재 문서)
├── architecture.md            # 시스템 아키텍처
├── components.md              # 컴포넌트 설계
├── technical-specs.md         # 기술 사양
├── implementation-guide.md    # 구현 가이드
└── user-flows.md              # 사용자 플로우
```

## 빠른 시작

구현을 시작하려면 [Implementation Guide](./implementation-guide.md)를 참고하세요.

## 개발 일정

- **Phase 1**: 프로젝트 설정 (0.5일)
- **Phase 2**: 코어 서비스 구현 (1일)
- **Phase 3**: 상태 관리 (0.5일)
- **Phase 4**: UI 컴포넌트 (1.5일)
- **Phase 5**: 통합 및 테스팅 (1일)
- **Phase 6**: 폴리싱 및 배포 (0.5일)

**총 예상 기간**: 4-5일

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 13.1+
- Edge 90+

## 라이선스

MIT License
