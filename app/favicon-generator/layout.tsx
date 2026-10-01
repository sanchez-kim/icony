import type { Metadata } from 'next';
import { FAVICON_GENERATOR_FAQ_EN } from '../../src/data/favicon-generator-content';

const title = 'Favicon Generator — favicon.ico, SVG & App Icons';
const description =
  'Free favicon generator: turn any of 10,000+ open-source icons into favicon.ico, SVG, Apple touch icon, Android/PWA icons, and a web manifest. Runs in your browser, no upload, no signup.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/favicon-generator' },
  openGraph: { type: 'website', url: 'https://iconyapp.com/favicon-generator', title, description },
  twitter: { card: 'summary_large_image', title, description },
};

const webAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Icony Favicon Generator',
  url: 'https://iconyapp.com/favicon-generator',
  description,
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Any (web browser)',
  inLanguage: 'en',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: 'en',
  mainEntity: FAVICON_GENERATOR_FAQ_EN.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function FaviconGeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
