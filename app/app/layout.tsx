import type { Metadata } from 'next';

const title = 'Icon Editor';
const description = 'Customize 10,000+ icons from Lucide, Tabler, Phosphor, Heroicons, Bootstrap Icons, and Radix. Set the color, size, and stroke width, then export PNG or SVG.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/app' },
  openGraph: { type: 'website', url: 'https://iconyapp.com/app', title, description },
  twitter: { card: 'summary_large_image', title, description },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
