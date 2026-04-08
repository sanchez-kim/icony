/**
 * icon-registry.ts - Lazy loading registry for icon libraries
 *
 * Each loadLibrary() call uses a dynamic import so Next.js (webpack/Turbopack)
 * can split the library into a separate chunk.  The switch statement is
 * intentional: bundlers perform static analysis on `import()` calls and
 * require the module specifier to be a string literal.  A plain variable
 * inside import() would defeat tree-shaking and chunking.
 *
 * Usage:
 *   const components = await loadLibrary('lucide');
 *   const HomeIcon = components['Home'];
 */

import type { LibraryComponents, LibraryKey } from '../types/icon';

// ---------------------------------------------------------------------------
// In-memory cache — avoids re-importing on repeated calls
// ---------------------------------------------------------------------------

const _cache = new Map<LibraryKey, LibraryComponents>();

// ---------------------------------------------------------------------------
// Dynamic loaders — one branch per library
// ---------------------------------------------------------------------------

async function loadLucide(): Promise<LibraryComponents> {
  const mod = await import('lucide-react');
  return mod as unknown as LibraryComponents;
}

async function loadTabler(): Promise<LibraryComponents> {
  const mod = await import('@tabler/icons-react');
  return mod as unknown as LibraryComponents;
}

async function loadPhosphor(): Promise<LibraryComponents> {
  const mod = await import('phosphor-react');
  return mod as unknown as LibraryComponents;
}

// phosphor-fill reuses the same components — weight="fill" is set at render time
async function loadPhosphorFill(): Promise<LibraryComponents> {
  const mod = await import('phosphor-react');
  return mod as unknown as LibraryComponents;
}

async function loadHeroicons(): Promise<LibraryComponents> {
  const mod = await import('@heroicons/react/24/outline');
  return mod as unknown as LibraryComponents;
}

async function loadHeroiconsSolid(): Promise<LibraryComponents> {
  const mod = await import('@heroicons/react/24/solid');
  return mod as unknown as LibraryComponents;
}

async function loadBootstrap(): Promise<LibraryComponents> {
  const mod = await import('react-bootstrap-icons');
  return mod as unknown as LibraryComponents;
}

async function loadRadix(): Promise<LibraryComponents> {
  const mod = await import('@radix-ui/react-icons');
  return mod as unknown as LibraryComponents;
}

// Stub for libraries not yet installed — returns empty map with clear error
async function loadUnavailable(key: LibraryKey): Promise<LibraryComponents> {
  console.debug(`[icon-registry] Library "${key}" is not yet available in this build.`);
  return {};
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Dynamically loads a library and returns a map of componentName → component.
 * Results are cached; subsequent calls for the same key resolve instantly.
 *
 * @param key - The LibraryKey to load
 * @returns Promise resolving to the library's component map
 */
export async function loadLibrary(key: LibraryKey): Promise<LibraryComponents> {
  const cached = _cache.get(key);
  if (cached) return cached;

  let components: LibraryComponents;

  // Static switch required for bundler static import() analysis
  switch (key) {
    case 'lucide':
      components = await loadLucide();
      break;
    case 'tabler':
      components = await loadTabler();
      break;
    case 'phosphor':
      components = await loadPhosphor();
      break;
    case 'phosphor-fill':
      components = await loadPhosphorFill();
      break;
    case 'heroicons':
      components = await loadHeroicons();
      break;
    case 'heroicons-solid':
      components = await loadHeroiconsSolid();
      break;
    case 'bootstrap':
      components = await loadBootstrap();
      break;
    case 'radix':
      components = await loadRadix();
      break;
    case 'remix':
      components = await loadUnavailable(key);
      break;
    default: {
      // Exhaustive check — TypeScript will error if a new LibraryKey is added
      // without a corresponding case above.
      const _exhaustive: never = key;
      throw new Error(`[icon-registry] Unknown library key: ${_exhaustive}`);
    }
  }

  _cache.set(key, components);
  return components;
}

/**
 * Preloads multiple libraries in parallel.
 * Call this early (e.g. after the app mounts) to warm the cache.
 *
 * @param keys - Library keys to preload
 */
export async function preloadLibraries(keys: LibraryKey[]): Promise<void> {
  await Promise.all(keys.map((k) => loadLibrary(k)));
}

/**
 * Resolves a single component from a library by its export name.
 * Returns null if the library is not loaded or the component is not found.
 *
 * @param key - Library key
 * @param componentName - Exact export name (e.g. "Home", "IconHome")
 */
export async function resolveComponent(
  key: LibraryKey,
  componentName: string,
): Promise<React.ComponentType<any> | null> {
  const lib = await loadLibrary(key);
  return (lib[componentName] as React.ComponentType<any>) ?? null;
}

/**
 * Synchronous cache lookup — returns null if the library hasn't been loaded yet.
 * Useful for render-path code that cannot be async.
 */
export function getCachedComponent(
  key: LibraryKey,
  componentName: string,
): React.ComponentType<any> | null {
  const lib = _cache.get(key);
  if (!lib) return null;
  return (lib[componentName] as React.ComponentType<any>) ?? null;
}

/** Clears the in-memory cache (useful for testing) */
export function clearLibraryCache(): void {
  _cache.clear();
}
