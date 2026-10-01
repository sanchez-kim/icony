/**
 * blog-content.ts
 * Original, fact-checked guide content for the /blog section, in English + Korean.
 * Server-component safe (no 'use client'). Rendered statically for SEO; the
 * visible language follows the app's LanguageContext (like the terms/privacy pages).
 *
 * Blocks use a tiny structured model rather than MDX to stay dependency-free.
 * Inline **bold** and `code` are supported in paragraph and list text.
 * Code blocks are language-agnostic and identical across locales.
 */
import type { BlogPost, BlogCategory, L } from './blog/types';
import { post as svgVsPngIcons } from './blog/posts/svg-vs-png-icons';
import { post as changeSvgIconColor } from './blog/posts/change-svg-icon-color';
import { post as svgToReactComponent } from './blog/posts/svg-to-react-component';
import { post as lucideVsTablerVsHeroicons } from './blog/posts/lucide-vs-tabler-vs-heroicons';
import { post as fixBlurrySvgIcons } from './blog/posts/fix-blurry-svg-icons';
import { post as addIconsToWebsite } from './blog/posts/add-icons-to-website';
import { post as iconSizesGuide } from './blog/posts/icon-sizes-guide';
import { post as svgStrokeWidth } from './blog/posts/svg-stroke-width';
import { post as makeAFavicon } from './blog/posts/make-a-favicon';
import { post as reduceSvgFileSize } from './blog/posts/reduce-svg-file-size';
import { post as accessibleSvgIcons } from './blog/posts/accessible-svg-icons';
import { post as svgNotShowing } from './blog/posts/svg-not-showing';
import { post as convertSvgToPng } from './blog/posts/convert-svg-to-png';
import { post as animateSvgIcons } from './blog/posts/animate-svg-icons';
import { post as svgSprites } from './blog/posts/svg-sprites';
import { post as bestFreeIconLibraries2026 } from './blog/posts/best-free-icon-libraries-2026';

export type { BlogLang, BlogBlock, BlogCategory, BlogPost } from './blog/types';

export const CATEGORY_LABEL: Record<BlogCategory, L<string>> = {
  'how-to': { en: 'How-to', ko: '하우투' },
  comparison: { en: 'Comparison', ko: '비교' },
  troubleshooting: { en: 'Troubleshooting', ko: '트러블슈팅' },
};

/**
 * Curated blog-slug → related icon-library slugs for cross-silo internal
 * linking. Only maps posts where a library is genuinely on-topic (a
 * comparison, a library round-up, or a technique a specific library exposes)
 * — irrelevant links dilute crawl signal rather than help it. Slugs are kept
 * as plain strings to avoid coupling this module to library-content's types.
 */
export const RELATED_LIBRARIES: Record<string, string[]> = {
  'lucide-vs-tabler-vs-heroicons': ['lucide', 'tabler', 'heroicons'],
  'best-free-icon-libraries-2026': ['lucide', 'tabler', 'phosphor', 'heroicons', 'bootstrap', 'radix'],
  'svg-stroke-width': ['lucide', 'tabler', 'phosphor', 'heroicons'],
  'svg-to-react-component': ['lucide', 'heroicons', 'radix'],
  'add-icons-to-website': ['lucide', 'heroicons', 'bootstrap'],
  'change-svg-icon-color': ['lucide', 'phosphor'],
};


export const BLOG_POSTS: BlogPost[] = [
  svgVsPngIcons,
  changeSvgIconColor,
  svgToReactComponent,
  lucideVsTablerVsHeroicons,
  fixBlurrySvgIcons,
  addIconsToWebsite,
  iconSizesGuide,
  svgStrokeWidth,
  makeAFavicon,
  reduceSvgFileSize,
  accessibleSvgIcons,
  svgNotShowing,
  convertSvgToPng,
  animateSvgIcons,
  svgSprites,
  bestFreeIconLibraries2026,
];

export const ALL_BLOG_SLUGS: string[] = BLOG_POSTS.map((p) => p.slug);

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}