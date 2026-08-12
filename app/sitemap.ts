import type { MetadataRoute } from 'next';
import { ALL_LIBRARY_SLUGS } from '../src/data/library-content';
import { BLOG_POSTS } from '../src/data/blog-content';

const BASE_URL = 'https://iconyapp.com';

// Content-stable lastmod dates, not build time. `new Date()` here would claim
// every page changed on every deploy, which Google learns to ignore — and a
// trustworthy lastmod is one of the few signals that feeds crawl scheduling.
// Update an entry only when that page's content meaningfully changes.
const UPDATED = {
  home: '2026-07-12',
  app: '2026-08-12',
  contact: '2026-08-12',
  faq: '2026-08-12',
  about: '2026-07-12',
  iconLibraries: '2026-07-12',
  library: '2026-07-12',
  blogIndex: '2026-07-12',
  terms: '2026-07-12',
  privacy: '2026-07-12',
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const libraryPages: MetadataRoute.Sitemap = ALL_LIBRARY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/icon-libraries/${slug}`,
    lastModified: new Date(UPDATED.library),
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
    { url: BASE_URL, lastModified: new Date(UPDATED.home), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/app`, lastModified: new Date(UPDATED.app), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/icon-libraries`, lastModified: new Date(UPDATED.iconLibraries), changeFrequency: 'monthly', priority: 0.8 },
    ...libraryPages,
    { url: `${BASE_URL}/blog`, lastModified: new Date(UPDATED.blogIndex), changeFrequency: 'weekly', priority: 0.7 },
    ...blogPages,
    { url: `${BASE_URL}/about`, lastModified: new Date(UPDATED.about), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(UPDATED.faq), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(UPDATED.contact), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(UPDATED.terms), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(UPDATED.privacy), changeFrequency: 'monthly', priority: 0.3 },
  ];
}
