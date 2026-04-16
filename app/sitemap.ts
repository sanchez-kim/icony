import type { MetadataRoute } from 'next';
import { ALL_LIBRARY_SLUGS } from '../src/data/library-content';

const BASE_URL = 'https://icony.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const libraryPages: MetadataRoute.Sitemap = ALL_LIBRARY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/icon-libraries/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/app`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/icon-libraries`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...libraryPages,
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];
}
