import type { Metadata } from 'next';

// No ' | Icony' suffix here: this segment is a direct child of the root layout,
// so the root's title.template ('%s | Icony') already appends it. Hardcoding it
// produced 'Icon Libraries — … | Icony | Icony'.
const title = 'Icon Libraries — 10,000+ Free React SVG Icons';
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
