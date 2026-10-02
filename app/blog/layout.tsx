import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Icon & SVG Guides',
  description:
    'Guides, tips, and fixes for working with icons and SVG, covering color, sizing, React components, and how the popular icon libraries compare.',
  alternates: { canonical: 'https://iconyapp.com/blog' },
  openGraph: {
    type: 'website',
    url: 'https://iconyapp.com/blog',
    title: 'Icony Blog — Icon & SVG Guides',
    description:
      'Guides and fixes for icons and SVG: color, sizing, React components, and library comparisons.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
