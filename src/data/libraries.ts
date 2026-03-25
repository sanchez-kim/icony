/**
 * libraries.ts - Library metadata registry
 *
 * Single source of truth for all icon library metadata.
 * Does NOT import any library package directly — stays dependency-free
 * so it can be imported anywhere without triggering side effects.
 */

import type { LibraryKey, LibraryMeta } from '../types/icon';

// ---------------------------------------------------------------------------
// Library metadata constants
// ---------------------------------------------------------------------------

export const LIBRARIES: Record<LibraryKey, LibraryMeta> = {
  lucide: {
    key: 'lucide',
    name: 'Lucide',
    shortName: 'Lucide',
    license: 'ISC',
    version: '0.462.0',
    url: 'https://lucide.dev',
    iconCount: 1500,
    available: true,
  },
  tabler: {
    key: 'tabler',
    name: 'Tabler Icons',
    shortName: 'Tabler',
    license: 'MIT',
    version: '3.x',
    url: 'https://tabler.io/icons',
    iconCount: 5500,
    available: true,
  },
  phosphor: {
    key: 'phosphor',
    name: 'Phosphor Icons',
    shortName: 'Phosphor',
    license: 'MIT',
    version: '1.x',
    url: 'https://phosphoricons.com',
    iconCount: 1248,
    available: true,
  },
  heroicons: {
    key: 'heroicons',
    name: 'Heroicons',
    shortName: 'Heroicons',
    license: 'MIT',
    version: '2.x',
    url: 'https://heroicons.com',
    iconCount: 292,
    available: false,
  },
  bootstrap: {
    key: 'bootstrap',
    name: 'Bootstrap Icons',
    shortName: 'Bootstrap',
    license: 'MIT',
    version: '1.x',
    url: 'https://icons.getbootstrap.com',
    iconCount: 2000,
    available: false,
  },
  radix: {
    key: 'radix',
    name: 'Radix Icons',
    shortName: 'Radix',
    license: 'MIT',
    version: '1.x',
    url: 'https://www.radix-ui.com/icons',
    iconCount: 318,
    available: false,
  },
  remix: {
    key: 'remix',
    name: 'Remix Icon',
    shortName: 'Remix',
    license: 'Apache-2.0',
    version: '4.x',
    url: 'https://remixicon.com',
    iconCount: 2800,
    available: false,
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns only the libraries that are bundled and ready to use */
export function getAvailableLibraries(): LibraryMeta[] {
  return Object.values(LIBRARIES).filter((lib) => lib.available);
}

/** Returns all libraries including those not yet available */
export function getAllLibraries(): LibraryMeta[] {
  return Object.values(LIBRARIES);
}

/** Type-guard: is the given string a valid LibraryKey? */
export function isLibraryKey(value: string): value is LibraryKey {
  return value in LIBRARIES;
}

/**
 * Legacy IconType values used by existing code.
 * Maps the old 'all' sentinel + existing library keys.
 */
export type LegacyIconLibrary = 'all' | LibraryKey;

/** Display name for a library given its key (falls back gracefully) */
export function getLibraryDisplayName(key: LibraryKey | 'all', lang: 'en' | 'ko' = 'en'): string {
  if (key === 'all') {
    return lang === 'ko' ? '전체' : 'All Libraries';
  }
  return LIBRARIES[key]?.name ?? key;
}
