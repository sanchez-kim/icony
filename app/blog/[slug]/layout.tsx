import type { Metadata } from 'next';
import { ALL_BLOG_SLUGS, getBlogPost } from '../../../src/data/blog-content';

export function generateStaticParams() {
  return ALL_BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Guide | Icony Blog',
      description: 'Icon and SVG guides, tips, and troubleshooting from Icony.',
    };
  }

  const url = `https://iconyapp.com/blog/${post.slug}`;
  // Static page metadata uses the English copy (consistent, global-SEO friendly);
  // the visible article language follows the in-app language toggle.
  return {
    title: post.metaTitle.en,
    description: post.metaDescription.en,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.metaTitle.en,
      description: post.metaDescription.en,
    },
  };
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
