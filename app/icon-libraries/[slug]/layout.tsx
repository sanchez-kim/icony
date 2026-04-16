import type { Metadata } from 'next';
import { LIBRARY_CONTENT, ALL_LIBRARY_SLUGS, type LibrarySlug } from '../../../src/data/library-content';

export function generateStaticParams() {
  return ALL_LIBRARY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lib = LIBRARY_CONTENT[slug as LibrarySlug];

  if (!lib) {
    return {
      title: 'Icon Library | Icony',
      description: 'Free open-source icon library — customize and download icons with Icony.',
    };
  }

  return {
    title: lib.metaTitle,
    description: lib.metaDescription,
  };
}

export default function SlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
