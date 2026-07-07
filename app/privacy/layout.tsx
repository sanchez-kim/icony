import type { Metadata } from 'next';

const title = 'Privacy Policy';
const description = 'Privacy policy for Icony, including how cookies and third-party advertising (Google AdSense) are used.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/privacy' },
  openGraph: { type: 'website', url: 'https://iconyapp.com/privacy', title, description },
  twitter: { card: 'summary_large_image', title, description },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
