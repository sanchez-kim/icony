import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Icon & SVG Guides',
  description:
    'Practical guides, tips, and troubleshooting for working with icons and SVG: color, sizing, React components, library comparisons, and more.',
  alternates: { canonical: 'https://iconyapp.com/blog' },
  openGraph: {
    type: 'website',
    url: 'https://iconyapp.com/blog',
    title: 'Icony Blog — Icon & SVG Guides',
    description:
      'Practical guides and troubleshooting for icons and SVG — color, sizing, React components, and library comparisons.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
