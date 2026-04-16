/**
 * library-content.ts
 * Rich content data for each icon library — used by /icon-libraries pages.
 * Server-component safe (no 'use client').
 */

export type LibrarySlug =
  | 'lucide'
  | 'tabler'
  | 'phosphor'
  | 'phosphor-fill'
  | 'heroicons'
  | 'heroicons-solid'
  | 'bootstrap'
  | 'radix';

export interface LibraryContent {
  slug: LibrarySlug;
  name: string;
  tagline: string;
  description: string;
  npm: string;
  iconCount: number;
  license: string;
  url: string;
  color: string;
  features: string[];
  useCases: string[];
  installCmd: string;
  usageCode: string;
  relatedSlugs: LibrarySlug[];
  metaTitle: string;
  metaDescription: string;
}

export const LIBRARY_CONTENT: Record<LibrarySlug, LibraryContent> = {
  lucide: {
    slug: 'lucide',
    name: 'Lucide Icons',
    tagline: 'Beautiful & consistent icon toolkit made by the community',
    description:
      'Lucide is a community-maintained open-source icon library that started as a fork of Feather Icons. With 1,500+ carefully crafted SVG icons and a consistent 24×24 design grid, it has become one of the most popular icon libraries in the React ecosystem. Every icon uses a clean 2px stroke style, ensuring a uniform look across your entire UI.',
    npm: 'lucide-react',
    iconCount: 1539,
    license: 'ISC',
    url: 'https://lucide.dev',
    color: 'from-orange-500 to-red-500',
    features: [
      'Consistent 24×24 grid with 2px stroke width',
      'Adjustable stroke width via prop',
      'TypeScript and JSDoc support',
      'Works with React, Vue, Svelte, and Angular',
      'Tree-shakeable — import only what you use',
      'Actively maintained with frequent updates',
    ],
    useCases: [
      'Web apps and SaaS dashboards',
      'Admin panels and back-office tools',
      'Developer tools and documentation sites',
      'General-purpose UI icon needs',
    ],
    installCmd: 'npm install lucide-react',
    usageCode: `import { Home, Search, Settings, User } from 'lucide-react';

export default function App() {
  return (
    <div>
      <Home size={24} color="#6366f1" />
      <Search size={24} strokeWidth={1.5} />
      <Settings size={32} />
    </div>
  );
}`,
    relatedSlugs: ['tabler', 'heroicons'],
    metaTitle: 'Lucide Icons — 1,500+ Free React Icons | Icony',
    metaDescription:
      'Lucide Icons: 1,500+ beautiful open-source SVG icons for React. ISC license, TypeScript support, adjustable stroke width. Customize & download free with Icony.',
  },

  tabler: {
    slug: 'tabler',
    name: 'Tabler Icons',
    tagline: 'The largest open-source icon collection — 5,900+ icons',
    description:
      'Tabler Icons is the most comprehensive icon library available in Icony, with over 5,900 meticulously designed SVG icons. All icons are drawn on a consistent 24×24 grid and cover virtually every UI and domain use case imaginable — from common navigation icons to specialized industry symbols. The MIT license and wide coverage make it a go-to choice for large-scale projects.',
    npm: '@tabler/icons-react',
    iconCount: 5986,
    license: 'MIT',
    url: 'https://tabler.io/icons',
    color: 'from-blue-500 to-cyan-500',
    features: [
      '5,900+ icons — the largest collection in Icony',
      'Consistent 24×24 design grid',
      'Outline style with customizable stroke width',
      'TypeScript support with named exports',
      'React, Vue, Svelte, Angular, and vanilla SVG',
      'Grouped into 30+ categories',
    ],
    useCases: [
      'Enterprise applications and dashboards',
      'Data visualization and analytics tools',
      'Comprehensive UI kits and design systems',
      'Projects that need broad icon coverage',
    ],
    installCmd: 'npm install @tabler/icons-react',
    usageCode: `import { IconHome, IconSearch, IconSettings } from '@tabler/icons-react';

export default function App() {
  return (
    <div>
      <IconHome size={24} color="#3b82f6" />
      <IconSearch size={24} stroke={1.5} />
      <IconSettings size={32} />
    </div>
  );
}`,
    relatedSlugs: ['lucide', 'bootstrap'],
    metaTitle: 'Tabler Icons — 5,900+ Free React Icons | Icony',
    metaDescription:
      'Tabler Icons: 5,900+ open-source SVG icons for React. MIT license, consistent design, TypeScript support. The largest icon library — customize & download free with Icony.',
  },

  phosphor: {
    slug: 'phosphor',
    name: 'Phosphor Icons',
    tagline: 'Flexible icons with 6 weight variants',
    description:
      'Phosphor Icons sets itself apart with a unique multi-weight system. Each of the 1,000+ icons comes in six distinct weights: Thin, Light, Regular, Bold, Fill, and Duotone. This flexibility makes Phosphor ideal for design systems that require subtle visual hierarchy — use lighter weights for decorative elements and heavier weights for primary actions.',
    npm: 'phosphor-react',
    iconCount: 1047,
    license: 'MIT',
    url: 'https://phosphoricons.com',
    color: 'from-purple-500 to-pink-500',
    features: [
      '6 weight variants: Thin, Light, Regular, Bold, Fill, Duotone',
      '1,000+ icons × 6 weights',
      'Single package — switch weights with a prop',
      'TypeScript support',
      'Consistent design across all weights',
      'Perfect for mobile-first interfaces',
    ],
    useCases: [
      'Design systems that need visual weight hierarchy',
      'Mobile and native-feeling web apps',
      'Brand identities requiring expressive icons',
      'Applications with active/inactive state icons',
    ],
    installCmd: 'npm install phosphor-react',
    usageCode: `import { House, MagnifyingGlass, Gear } from 'phosphor-react';

export default function App() {
  return (
    <div>
      {/* Regular weight (default) */}
      <House size={24} />

      {/* Bold weight */}
      <MagnifyingGlass size={24} weight="bold" />

      {/* Duotone weight */}
      <Gear size={32} weight="duotone" color="#8b5cf6" />
    </div>
  );
}`,
    relatedSlugs: ['phosphor-fill', 'lucide'],
    metaTitle: 'Phosphor Icons — 1,000+ Free React Icons with 6 Weights | Icony',
    metaDescription:
      'Phosphor Icons: 1,000+ flexible SVG icons in 6 weights (Thin, Light, Regular, Bold, Fill, Duotone). MIT license. Customize & download free with Icony.',
  },

  'phosphor-fill': {
    slug: 'phosphor-fill',
    name: 'Phosphor Icons (Filled)',
    tagline: 'Phosphor icons in solid filled style',
    description:
      'The filled weight variant of Phosphor Icons. All 1,000+ Phosphor icons rendered in a solid, filled style — ideal for active states, selected navigation items, or any scenario where you need strong visual emphasis. Pairs perfectly with Phosphor Regular to indicate active vs. inactive states.',
    npm: 'phosphor-react',
    iconCount: 1047,
    license: 'MIT',
    url: 'https://phosphoricons.com',
    color: 'from-violet-500 to-purple-600',
    features: [
      'Same 1,000+ icons as Phosphor Regular',
      'Filled/solid style for strong visual emphasis',
      'Same package as Phosphor — no extra install',
      'Perfect for active/selected states',
      'Pairs naturally with Phosphor outline style',
      'TypeScript support',
    ],
    useCases: [
      'Active navigation states',
      'Selected or toggled UI elements',
      'Emphasis icons in call-to-action buttons',
      'Notification badges and status indicators',
    ],
    installCmd: 'npm install phosphor-react',
    usageCode: `import { House, MagnifyingGlass, Gear } from 'phosphor-react';

export default function NavItem({ isActive }: { isActive: boolean }) {
  return (
    <div>
      {/* Toggle between outline and fill based on state */}
      <House
        size={24}
        weight={isActive ? 'fill' : 'regular'}
        color={isActive ? '#8b5cf6' : '#6b7280'}
      />
    </div>
  );
}`,
    relatedSlugs: ['phosphor', 'heroicons-solid'],
    metaTitle: 'Phosphor Icons Filled — 1,000+ Solid React Icons | Icony',
    metaDescription:
      'Phosphor Icons Filled: 1,000+ solid SVG icons for React. Perfect for active states and emphasis. MIT license. Customize & download free with Icony.',
  },

  heroicons: {
    slug: 'heroicons',
    name: 'Heroicons',
    tagline: 'Hand-crafted icons by the makers of Tailwind CSS',
    description:
      'Heroicons are beautiful, hand-crafted SVG icons created by the team behind Tailwind CSS. Designed specifically for modern web interfaces, Heroicons come in outline style (24×24 and 20×20) and pair seamlessly with Tailwind CSS utility classes. The clean, professional aesthetic makes them a natural choice for any Tailwind-based project.',
    npm: '@heroicons/react',
    iconCount: 175,
    license: 'MIT',
    url: 'https://heroicons.com',
    color: 'from-sky-500 to-blue-600',
    features: [
      'Crafted by the Tailwind CSS team',
      'Available in 24×24 outline and 20×20 mini sizes',
      'Optimized for Tailwind CSS className usage',
      'TypeScript support with full type definitions',
      'Pixel-perfect at small sizes',
      'Pairs naturally with shadcn/ui components',
    ],
    useCases: [
      'Tailwind CSS projects',
      'Next.js and React applications',
      'shadcn/ui-based design systems',
      'Clean, professional SaaS interfaces',
    ],
    installCmd: 'npm install @heroicons/react',
    usageCode: `import { HomeIcon, MagnifyingGlassIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function App() {
  return (
    <div>
      <HomeIcon className="w-6 h-6 text-indigo-500" />
      <MagnifyingGlassIcon className="w-6 h-6 text-gray-500" />
      <Cog6ToothIcon className="w-8 h-8" />
    </div>
  );
}`,
    relatedSlugs: ['heroicons-solid', 'lucide'],
    metaTitle: 'Heroicons — Free React Icons by Tailwind CSS Team | Icony',
    metaDescription:
      'Heroicons: Hand-crafted SVG icons by the Tailwind CSS team. MIT license, outline & solid styles, TypeScript support. Customize & download free with Icony.',
  },

  'heroicons-solid': {
    slug: 'heroicons-solid',
    name: 'Heroicons (Solid)',
    tagline: 'Heroicons in bold solid style',
    description:
      'The solid variant of Heroicons, featuring filled shapes for a bolder, more prominent appearance. Created by the Tailwind CSS team, solid Heroicons are perfect for navigation indicators, active states, and interactive elements where you need clear visual feedback. They maintain the same clean aesthetic as Heroicons Outline.',
    npm: '@heroicons/react',
    iconCount: 175,
    license: 'MIT',
    url: 'https://heroicons.com',
    color: 'from-blue-600 to-indigo-600',
    features: [
      'Solid filled style for strong visual weight',
      'Same icons as Heroicons Outline',
      'Made by the Tailwind CSS team',
      'TypeScript support',
      'Ideal for active navigation states',
      'Seamless pairing with Tailwind CSS',
    ],
    useCases: [
      'Active and selected navigation states',
      'Primary action buttons',
      'Sidebar navigation with active indicators',
      'Tailwind CSS and shadcn/ui projects',
    ],
    installCmd: 'npm install @heroicons/react',
    usageCode: `import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function NavItem({ isActive }: { isActive: boolean }) {
  // Mix outline and solid based on state
  const Icon = isActive
    ? HomeIcon  // from /24/solid
    : HomeIcon; // swap with outline variant when needed

  return (
    <Icon className="w-6 h-6 text-indigo-600" />
  );
}`,
    relatedSlugs: ['heroicons', 'phosphor-fill'],
    metaTitle: 'Heroicons Solid — Free Solid React Icons | Icony',
    metaDescription:
      'Heroicons Solid: Filled SVG icons by the Tailwind CSS team. MIT license, TypeScript support, perfect for active states. Customize & download free with Icony.',
  },

  bootstrap: {
    slug: 'bootstrap',
    name: 'Bootstrap Icons',
    tagline: 'Official icon library from the Bootstrap team',
    description:
      'Bootstrap Icons is the official open-source icon library from the creators of Bootstrap. With over 2,000 icons in a clean, consistent style, it covers a broad range of UI needs from basic interface controls to specialized domain icons. While originally designed for Bootstrap-based projects, Bootstrap Icons work equally well in any React application.',
    npm: 'react-bootstrap-icons',
    iconCount: 325,
    license: 'MIT',
    url: 'https://icons.getbootstrap.com',
    color: 'from-purple-600 to-indigo-700',
    features: [
      'Official Bootstrap project — trusted and well-maintained',
      'Consistent, clean design language',
      'MIT license for commercial use',
      'React component wrapper available',
      'Works without Bootstrap CSS',
      'Wide coverage of UI patterns',
    ],
    useCases: [
      'Bootstrap-based web projects',
      'Admin panels and back-office UIs',
      'E-commerce interfaces',
      'Content management systems',
    ],
    installCmd: 'npm install react-bootstrap-icons',
    usageCode: `import { HouseFill, Search, GearFill } from 'react-bootstrap-icons';

export default function App() {
  return (
    <div>
      <HouseFill size={24} color="#6f42c1" />
      <Search size={24} />
      <GearFill size={32} />
    </div>
  );
}`,
    relatedSlugs: ['tabler', 'lucide'],
    metaTitle: 'Bootstrap Icons — 2,000+ Free React Icons | Icony',
    metaDescription:
      'Bootstrap Icons: 2,000+ official SVG icons from the Bootstrap team. MIT license, React support, clean consistent design. Customize & download free with Icony.',
  },

  radix: {
    slug: 'radix',
    name: 'Radix Icons',
    tagline: 'Crisp icons designed for accessible UI primitives',
    description:
      'Radix Icons is a carefully crafted set of icons designed specifically for use with Radix UI primitives and other accessible component libraries. Drawn on a compact 15×15 grid, these icons render crisp and clear at small sizes — ideal for form controls, dropdowns, and other compact UI elements. They are the default icon set for shadcn/ui.',
    npm: '@radix-ui/react-icons',
    iconCount: 218,
    license: 'MIT',
    url: 'https://www.radix-ui.com/icons',
    color: 'from-gray-700 to-gray-900',
    features: [
      'Designed for Radix UI primitives',
      '15×15 grid — pixel-perfect at small sizes',
      'Default icons for shadcn/ui',
      'TypeScript support',
      'Minimal, precise design language',
      'Accessible by design',
    ],
    useCases: [
      'Radix UI component projects',
      'shadcn/ui-based applications',
      'Minimal and precise interfaces',
      'Form controls and compact UI elements',
    ],
    installCmd: 'npm install @radix-ui/react-icons',
    usageCode: `import { HomeIcon, MagnifyingGlassIcon, GearIcon } from '@radix-ui/react-icons';

export default function App() {
  return (
    <div>
      <HomeIcon />
      <MagnifyingGlassIcon />
      <GearIcon />
    </div>
  );
}`,
    relatedSlugs: ['heroicons', 'lucide'],
    metaTitle: 'Radix Icons — Free React Icons for shadcn/ui | Icony',
    metaDescription:
      'Radix Icons: 300+ crisp SVG icons for Radix UI and shadcn/ui. MIT license, 15×15 grid, TypeScript support. Customize & download free with Icony.',
  },
};

export const ALL_LIBRARY_SLUGS = Object.keys(LIBRARY_CONTENT) as LibrarySlug[];
