import type { Metadata } from 'next';

const title = 'Icon Libraries — 10,000+ Free React SVG Icons | Icony';
const description =
  'Explore 8 open-source icon libraries available in Icony: Lucide, Tabler, Phosphor, Heroicons, Bootstrap, and Radix Icons. Customize colors, sizes, and download as PNG or SVG for free.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/icon-libraries' },
  openGraph: { type: 'website', url: 'https://iconyapp.com/icon-libraries', title, description },
  twitter: { card: 'summary_large_image', title, description },
};

export default function IconLibrariesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
