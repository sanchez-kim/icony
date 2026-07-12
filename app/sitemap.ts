import type { MetadataRoute } from 'next';
import { ALL_LIBRARY_SLUGS } from '../src/data/library-content';
import { BLOG_POSTS } from '../src/data/blog-content';

const BASE_URL = 'https://iconyapp.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const libraryPages: MetadataRoute.Sitemap = ALL_LIBRARY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/icon-libraries/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Use each post's real `updated` date, not the build time — a stable,
  // content-driven lastmod is a stronger signal than "everything changed on
  // the last deploy," which Google learns to ignore.
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/app`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/icon-libraries`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...libraryPages,
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...blogPages,
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];
}
