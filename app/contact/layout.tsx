import type { Metadata } from 'next';

// No ' | Icony' suffix: this is a direct child of the root layout, whose
// title.template ('%s | Icony') appends it.
const title = 'Contact — Icon Support, Bug Reports & Licensing';
const description =
  'Contact Icony: report a bug, request an icon library, or ask about licensing and commercial use. Email help@iconyapp.com — replies within a few business days.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/contact' },
  openGraph: { type: 'website', url: 'https://iconyapp.com/contact', title, description },
  twitter: { card: 'summary_large_image', title, description },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Icony',
  description,
  url: 'https://iconyapp.com/contact',
  mainEntity: {
    '@type': 'Organization',
    name: 'Icony',
    url: 'https://iconyapp.com',
    email: 'help@iconyapp.com',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'help@iconyapp.com',
      availableLanguage: ['English', 'Korean'],
    },
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
