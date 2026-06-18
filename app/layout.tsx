import type { Metadata } from 'next';
import Script from 'next/script';
import { Providers } from '../src/components/Providers';
import '../src/index.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://iconyapp.com'),
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
    url: 'https://iconyapp.com',
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
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.svg' },
  other: {
    'google-adsense-account': 'ca-pub-4776602848700794',
  },
};

// GA4 measurement ID (G-XXXXXXXXXX). Must be NEXT_PUBLIC_ to reach the client;
// Next inlines it at build time. GA only loads in production when set.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="!m-0 !p-0">
        {/* Apply theme before first paint to avoid a dark/light flash now that
            the app no longer hides its content until mount. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('icony_theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        <Providers>{children}</Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Icony',
              url: 'https://iconyapp.com',
              description: 'Customize and export 10,000+ open-source icons',
              applicationCategory: 'DesignApplication',
              operatingSystem: 'Web',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            }),
          }}
        />
        {process.env.NODE_ENV === 'production' && (
          <>
            {GA_ID && (
              <>
                <Script
                  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                  strategy="afterInteractive"
                />
                <Script id="ga4-init" strategy="afterInteractive">
                  {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
                </Script>
              </>
            )}
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4776602848700794"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            <Script
              defer
              src="https://static.cloudflareinsights.com/beacon.min.js"
              data-cf-beacon='{"token": "f247e4eb8b3d406ab383463d62f1abcd"}'
              strategy="afterInteractive"
            />
          </>
        )}
      </body>
    </html>
  );
}
