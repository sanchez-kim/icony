# Icony - Icon Customization Tool

A web application for browsing, customizing, and exporting 10,000+ open-source icons. Change colors, sizes, stroke weights, and download as PNG or SVG.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)

## Features

- **10,000+ Icons** from 8 libraries (outline + filled variants)
- **Color Customization** - Swatches, HEX picker, EyeDropper, custom palettes
- **Size Control** - 16px to 512px
- **Stroke Weight** - Adjustable for Lucide, Tabler, Phosphor
- **Export** - PNG, SVG, clipboard copy, shareable URL
- **Bilingual Search** - Korean + English with synonym matching
- **Dark Mode** - System preference detection + manual toggle
- **Favorites & History** - Quick access to frequently used icons
- **Virtual Scrolling** - Smooth browsing of 10,000+ icons
- **SEO Optimized** - Sitemap, Open Graph, JSON-LD structured data

## Icon Libraries

| Library | Icons | License | Variants |
|---------|-------|---------|----------|
| [Lucide](https://lucide.dev) | ~1,500 | ISC | Outline |
| [Tabler](https://tabler.io/icons) | ~5,500 | MIT | Outline + Filled |
| [Phosphor](https://phosphoricons.com) | ~1,050 | MIT | Outline |
| [Phosphor Filled](https://phosphoricons.com) | ~1,050 | MIT | Filled |
| [Heroicons](https://heroicons.com) | ~290 | MIT | Outline |
| [Heroicons Solid](https://heroicons.com) | ~175 | MIT | Solid |
| [Bootstrap Icons](https://icons.getbootstrap.com) | ~2,000 | MIT | Outline |
| [Radix](https://www.radix-ui.com/icons) | ~320 | MIT | Outline |

## Tech Stack

- **Next.js 16** - App Router, SSG, SEO
- **React 18** - UI
- **TypeScript** - Type safety
- **Tailwind CSS 3** - Styling
- **@tanstack/react-virtual** - Virtual scrolling

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm run start
```

## Project Structure

```
icony/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (metadata, providers, analytics)
│   ├── page.tsx            # Landing page
│   ├── app/page.tsx        # Icon editor
│   ├── terms/page.tsx      # Terms of service
│   ├── sitemap.ts          # SEO sitemap
│   └── robots.ts           # SEO robots
├── src/
│   ├── components/         # React components (22)
│   ├── context/            # IconContext, ThemeContext, LanguageContext
│   ├── hooks/              # Custom hooks (5)
│   ├── data/               # Icon descriptors + registry
│   ├── services/           # Export, clipboard, renderer
│   ├── types/              # TypeScript types
│   ├── locales/            # ko.ts, en.ts
│   └── utils/              # Utilities
├── scripts/                # Icon descriptor generation
└── public/                 # Static assets (favicon)
```

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `main` triggers automatic deployment.

```bash
vercel
```

## License

### Source Code

MIT License. See [LICENSE](LICENSE) for details.

### Icon Libraries

All icons are provided by third-party open-source libraries under their respective licenses:

| Library | License | Commercial Use | Attribution |
|---------|---------|----------------|-------------|
| Lucide | ISC | Allowed | Not required |
| Tabler | MIT | Allowed | Not required |
| Phosphor | MIT | Allowed | Not required |
| Heroicons | MIT | Allowed | Not required |
| Bootstrap Icons | MIT | Allowed | Not required |
| Radix Icons | MIT | Allowed | Not required |

All icon copyrights belong to their respective owners.
