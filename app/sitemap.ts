import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://icony.vercel.app', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://icony.vercel.app/app', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://icony.vercel.app/terms', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];
}
