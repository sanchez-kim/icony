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
      publishedTime: post.published,
      modifiedTime: post.updated,
    },
  };
}

export default async function BlogPostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const url = `https://iconyapp.com/blog/${slug}`;

  // Server-rendered Article JSON-LD (English, matching the static metadata) with
  // full Google-recommended fields: datePublished, image, and a publisher logo.
  const jsonLd = post && {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title.en,
    description: post.metaDescription.en,
    datePublished: post.published,
    dateModified: post.updated,
    image: ['https://iconyapp.com/opengraph-image'],
    author: { '@type': 'Organization', name: 'Icony', url: 'https://iconyapp.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Icony',
      url: 'https://iconyapp.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://iconyapp.com/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
