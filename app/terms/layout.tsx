import type { Metadata } from 'next';

const title = 'Terms of Service';
const description = 'Terms of service for Icony, the free icon customizer and exporter tool.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/terms' },
  openGraph: { type: 'website', url: 'https://iconyapp.com/terms', title, description },
  twitter: { card: 'summary_large_image', title, description },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
