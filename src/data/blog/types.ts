export type BlogLang = 'en' | 'ko';

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'code'; lang?: string; code: string }
  | { type: 'tip'; text: string }
  | { type: 'link'; href: string; text: string };

export type BlogCategory = 'how-to' | 'comparison' | 'troubleshooting';

export type L<T> = Record<BlogLang, T>;

export interface BlogPost {
  slug: string;
  category: BlogCategory;
  readingMinutes: number;
  /** ISO date the post was first published (absolute). */
  published: string;
  /** ISO date the post was last reviewed/updated (absolute). */
  updated: string;
  related: string[];
  title: L<string>;
  /** Short excerpt for the index card. */
  description: L<string>;
  blocks: L<BlogBlock[]>;
  metaTitle: L<string>;
  metaDescription: L<string>;
}
