import type { Metadata } from 'next';
import Script from 'next/script';
import { Providers } from '../src/components/Providers';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'Icony - 아이콘 커스터마이징 도구',
  description: 'Icony - 아이콘 커스터마이징을 쉽게. 수천 개의 아이콘을 선택하고, 색상과 선 두께를 변경하여 PNG/SVG로 내보내세요.',
  icons: { icon: '/favicon.svg' },
  keywords: ['icon', 'customization', 'png', 'svg', 'export', 'lucide', 'tabler', 'phosphor', 'stroke weight', '아이콘', '커스터마이징'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "f247e4eb8b3d406ab383463d62f1abcd"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
