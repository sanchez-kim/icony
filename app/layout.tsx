import type { Metadata } from 'next';
import Script from 'next/script';
import { Providers } from '../src/components/Providers';
import '../src/index.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://icony.vercel.app'),
  title: {
    default: 'Icony - Free Icon Customizer & Exporter',
    template: '%s | Icony',
  },
  description: 'Customize and export 10,000+ open-source icons from Lucide, Tabler, Phosphor, Heroicons, Bootstrap Icons, and Radix. Change colors, sizes, stroke weights. Free PNG & SVG export.',
  keywords: ['icon', 'icon customizer', 'icon editor', 'free icons', 'SVG icons', 'PNG export', 'Lucide', 'Tabler Icons', 'Phosphor', 'Heroicons', 'Bootstrap Icons', 'open source icons', '아이콘', '아이콘 편집기', '무료 아이콘'],
  authors: [{ name: 'Icony' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: 'en_US',
    url: 'https://icony.vercel.app',
    siteName: 'Icony',
    title: 'Icony - Free Icon Customizer & Exporter',
    description: 'Customize and export 10,000+ open-source icons. Change colors, sizes, stroke weights. Free PNG & SVG.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Icony - Free Icon Customizer & Exporter',
    description: 'Customize and export 10,000+ open-source icons for free.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="!m-0 !p-0">
        <Providers>{children}</Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Icony',
              url: 'https://icony.vercel.app',
              description: 'Customize and export 10,000+ open-source icons',
              applicationCategory: 'DesignApplication',
              operatingSystem: 'Web',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            }),
          }}
        />
        {process.env.NODE_ENV === 'production' && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "f247e4eb8b3d406ab383463d62f1abcd"}'
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
