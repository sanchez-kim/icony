import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3030,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // 소스맵은 프로덕션 번들 크기를 크게 늘리므로 비활성화
    sourcemap: false,

    // 아이콘 라이브러리는 개별 청크가 클 수 있으므로 경고 임계값 상향
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        /**
         * manualChunks 함수 방식:
         *   - 정적 객체 방식보다 유연하게 모듈 경로를 검사하여 청크를 결정
         *   - node_modules 경로를 기준으로 아이콘 라이브러리를 각각 독립 청크로 분리
         *   - 초기 로드에 필요한 React 코어만 vendor-react에 묶어 캐시 효율화
         *
         * 청크 구조:
         *   vendor-react   — React 런타임 (항상 로드, 안정적 캐시)
         *   icons-lucide   — lucide-react (lazy, icon-registry 동적 임포트)
         *   icons-tabler   — @tabler/icons-react (lazy)
         *   icons-phosphor — phosphor-react (lazy)
         *   icons-fa       — @fortawesome/* (lazy, 향후 제거 예정)
         *   icons-heroicons — @heroicons/react (lazy, 향후 추가)
         *   icons-bootstrap — react-bootstrap-icons (lazy, 향후 추가)
         *   icons-radix    — @radix-ui/react-icons (lazy, 향후 추가)
         *   icons-remix    — remixicon (lazy, 향후 추가)
         *   app            — 나머지 앱 코드 (자동 처리)
         */
        manualChunks(id: string) {
          // ── React 코어 ──────────────────────────────────────────────────────
          // react, react-dom, scheduler 등 React 런타임은 항상 필요하므로
          // 하나의 vendor 청크로 묶어 브라우저 캐시를 최대화한다.
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }

          // ── 아이콘 라이브러리 (각 라이브러리 → 독립 청크) ──────────────
          // icon-registry.ts의 동적 import()와 1:1 대응하여
          // 사용자가 특정 라이브러리를 선택할 때만 해당 청크를 다운로드한다.

          if (id.includes('node_modules/lucide-react/')) {
            // lucide-react: 가장 많이 쓰이는 아이콘 세트
            return 'icons-lucide';
          }

          if (id.includes('node_modules/@tabler/')) {
            // @tabler/icons-react: Tabler 아이콘 세트
            return 'icons-tabler';
          }

          if (id.includes('node_modules/phosphor-react/') ||
              id.includes('node_modules/phosphor-icons/')) {
            // phosphor-react: Phosphor 아이콘 세트
            return 'icons-phosphor';
          }

          if (id.includes('node_modules/@fortawesome/')) {
            // @fortawesome/*: Font Awesome (현재는 제거 예정이지만 임시 분리 유지)
            return 'icons-fa';
          }

          if (id.includes('node_modules/@heroicons/')) {
            // @heroicons/react: Heroicons (향후 추가 예정)
            return 'icons-heroicons';
          }

          if (id.includes('node_modules/react-bootstrap-icons/')) {
            // react-bootstrap-icons: Bootstrap 아이콘 (향후 추가 예정)
            return 'icons-bootstrap';
          }

          if (id.includes('node_modules/@radix-ui/react-icons/')) {
            // @radix-ui/react-icons: Radix UI 아이콘 (향후 추가 예정)
            return 'icons-radix';
          }

          if (id.includes('node_modules/remixicon/')) {
            // remixicon: Remix 아이콘 (향후 추가 예정)
            return 'icons-remix';
          }

          // 그 외 node_modules는 Rollup 기본 청크 분리에 위임
          // (앱 코드는 별도 청크로 자동 처리됨)
        },
      },
    },
  },

  // 개발 서버 사전 번들링 최적화:
  // 자주 쓰이는 의존성을 미리 번들링해 HMR 속도를 높인다.
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
    ],
  },
})
