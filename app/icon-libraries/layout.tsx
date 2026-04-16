import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Icon Libraries — 10,000+ Free React SVG Icons | Icony',
  description:
    'Explore 8 open-source icon libraries available in Icony: Lucide, Tabler, Phosphor, Heroicons, Bootstrap, and Radix Icons. Customize colors, sizes, and download as PNG or SVG for free.',
};

export default function IconLibrariesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
