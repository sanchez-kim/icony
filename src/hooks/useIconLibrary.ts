/**
 * useIconLibrary.ts - Hook for lazy-loading icon library components
 *
 * Loads the selected library (or all available libraries) on demand.
 * Exposes loading state and a helper to resolve individual components.
 *
 * Usage:
 *   const { isLoading, resolveIcon, error } = useIconLibrary('lucide');
 *   const HomeIcon = resolveIcon('Home');
 *
 * When `selectedLibrary` is 'all', all available libraries are loaded in
 * parallel so the gallery can render without waiting for individual chunks.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { LibraryComponents, LibraryKey, LibraryLoadState } from '../types/icon';
import { loadLibrary, preloadLibraries } from '../data/icon-registry';
import { getAvailableLibraries } from '../data/libraries';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseIconLibraryResult {
  /** True while any requested library is still loading */
  isLoading: boolean;
  /** Resolved component map for the requested library/libraries */
  components: Record<LibraryKey, LibraryComponents>;
  /** Per-library load states */
  loadStates: Record<string, LibraryLoadState>;
  /** Last error encountered during loading (if any) */
  error: Error | null;
  /**
   * Resolve a component by library key and export name.
   * Returns null synchronously if the library hasn't finished loading yet.
   */
  resolveIcon: (key: LibraryKey, componentName: string) => React.ComponentType<any> | null;
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function getLibrariesToLoad(selectedLibrary: LibraryKey | 'all'): LibraryKey[] {
  if (selectedLibrary === 'all') {
    return getAvailableLibraries().map((lib) => lib.key);
  }
  return [selectedLibrary];
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * @param selectedLibrary - The library to load, or 'all' to load every
 *   available library in parallel.
 */
export function useIconLibrary(
  selectedLibrary: LibraryKey | 'all',
): UseIconLibraryResult {
  const [components, setComponents] = useState<Record<LibraryKey, LibraryComponents>>(
    {} as Record<LibraryKey, LibraryComponents>,
  );
  const [loadStates, setLoadStates] = useState<Record<string, LibraryLoadState>>({});
  const [error, setError] = useState<Error | null>(null);

  // Track mounted state to avoid setState after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const keys = getLibrariesToLoad(selectedLibrary);

    // Mark all target libraries as loading
    setLoadStates((prev) => {
      const next = { ...prev };
      keys.forEach((k) => {
        if (next[k] !== 'loaded') next[k] = 'loading';
      });
      return next;
    });

    // Load libraries that aren't already cached/loaded
    const pending = keys.filter((k) => loadStates[k] !== 'loaded');

    if (pending.length === 0) return;

    let cancelled = false;

    Promise.all(
      pending.map(async (key) => {
        try {
          const lib = await loadLibrary(key);
          return { key, lib, err: null };
        } catch (e) {
          return { key, lib: null, err: e as Error };
        }
      }),
    ).then((results) => {
      if (cancelled || !mountedRef.current) return;

      setComponents((prev) => {
        const next = { ...prev };
        results.forEach(({ key, lib }) => {
          if (lib) next[key] = lib;
        });
        return next;
      });

      setLoadStates((prev) => {
        const next = { ...prev };
        results.forEach(({ key, err }) => {
          next[key] = err ? 'error' : 'loaded';
        });
        return next;
      });

      const firstError = results.find((r) => r.err)?.err ?? null;
      setError(firstError);
    });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLibrary]);

  const isLoading = Object.values(loadStates).some((s) => s === 'loading');

  const resolveIcon = useCallback(
    (key: LibraryKey, componentName: string): React.ComponentType<any> | null => {
      const lib = components[key];
      if (!lib) return null;
      return (lib[componentName] as React.ComponentType<any>) ?? null;
    },
    [components],
  );

  return { isLoading, components, loadStates, error, resolveIcon };
}

// ---------------------------------------------------------------------------
// Preload helper hook
// ---------------------------------------------------------------------------

/**
 * Preloads all available icon libraries after the component mounts.
 * Drop this into a top-level component (e.g. App) to warm the cache early.
 *
 * @param enabled - Set to false to skip preloading (e.g. during SSR)
 */
export function usePreloadLibraries(enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    const keys = getAvailableLibraries().map((lib) => lib.key);
    // Fire-and-forget — errors are silently swallowed here since this is
    // just cache warming; real error handling happens in useIconLibrary.
    preloadLibraries(keys).catch((err) => {
      console.debug('[usePreloadLibraries] Preload failed:', err);
    });
  }, [enabled]);
}
