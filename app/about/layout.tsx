import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Icony — Free Icon Customization Tool',
  description:
    'Learn about Icony — a free, open-source icon customizer tool. Browse 10,000+ icons from Lucide, Tabler, Phosphor, Heroicons, Bootstrap, and Radix. Customize colors and sizes, export as PNG or SVG.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
