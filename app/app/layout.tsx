import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Icon Editor',
  description: 'Browse and customize 10,000+ icons from Lucide, Tabler, Phosphor, Heroicons, Bootstrap Icons, and Radix. Change colors, sizes, stroke weights and export as PNG or SVG.',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
