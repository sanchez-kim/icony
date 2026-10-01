import { useCallback, useEffect, useState } from 'react';
import type React from 'react';
import type { Icon } from '../types';
import type { LibraryKey } from '../types/icon';
import { loadLibrary } from '../data/icon-registry';
import { loadDescriptors, descriptorToIcon } from '../data/icon-descriptors';

export interface UseLibraryIconsResult {
  icons: Icon[];
  isLoading: boolean;
  error: Error | null;
  /** Re-run the load after a failure. */
  retry: () => void;
}

interface LoadedState {
  library: LibraryKey;
  icons: Icon[];
  error: Error | null;
}

/** True for forwardRef/memo components; excludes helper exports like createLucideIcon. */
function isRenderable(comp: unknown): comp is React.ComponentType<any> {
  return comp != null && !!(comp as { $$typeof?: unknown }).$$typeof;
}

/**
 * Loads ONE icon library (descriptors + components in parallel) as ready-to-render
 * Icons. Unlike IconContext it never loads the other libraries. A library
 * change discards any in-flight load for the previous one.
 */
export function useLibraryIcons(library: LibraryKey): UseLibraryIconsResult {
  const [state, setState] = useState<LoadedState | null>(null);
  const [nonce, setNonce] = useState(0);
  const retry = useCallback(() => {
    setState(null);
    setNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.all([loadDescriptors(library), loadLibrary(library)])
      .then(([descriptors, components]) => {
        if (cancelled) return;
        const icons: Icon[] = [];
        for (const d of descriptors) {
          const comp = (components as Record<string, unknown>)[d.componentName];
          if (isRenderable(comp)) icons.push(descriptorToIcon(d, comp));
        }
        setState({ library, icons, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState({ library, icons: [], error: err instanceof Error ? err : new Error(String(err)) });
      });

    return () => {
      cancelled = true;
    };
  }, [library, nonce]);

  // Until the current library resolves, report loading with no (stale) icons.
  if (!state || state.library !== library) {
    return { icons: EMPTY, isLoading: true, error: null, retry };
  }
  return { icons: state.icons, isLoading: false, error: state.error, retry };
}

const EMPTY: Icon[] = [];
