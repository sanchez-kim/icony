import type { Metadata } from 'next';
import { FAQ_EN } from '../../src/data/faq-content';

const title = 'FAQ — Icony Icon Customization Tool';
const description =
  'Frequently asked questions about Icony. Learn about supported formats (PNG, SVG), icon libraries, commercial use, pricing, and how to customize icons for your projects.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/faq' },
  openGraph: { type: 'website', url: 'https://iconyapp.com/faq', title, description },
  twitter: { card: 'summary_large_image', title, description },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_EN.flatMap((section) =>
    section.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  ),
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
