import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Icony Icon Customization Tool',
  description:
    'Frequently asked questions about Icony. Learn about supported formats (PNG, SVG), icon libraries, commercial use, pricing, and how to customize icons for your projects.',
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
