import type { Metadata } from 'next';

const title = 'About Icony — Free Icon Customization Tool';
const description =
  'Icony is a free icon customizer run by one person. Browse 10,000+ icons from Lucide, Tabler, Phosphor, Heroicons, Bootstrap, and Radix, then export PNG or SVG.';

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
