import type { Metadata } from 'next';

const title = 'About Icony — Free Icon Customization Tool';
const description =
  'Learn about Icony — a free, open-source icon customizer tool. Browse 10,000+ icons from Lucide, Tabler, Phosphor, Heroicons, Bootstrap, and Radix. Customize colors and sizes, export as PNG or SVG.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/about' },
  openGraph: { type: 'website', url: 'https://iconyapp.com/about', title, description },
  twitter: { card: 'summary_large_image', title, description },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
