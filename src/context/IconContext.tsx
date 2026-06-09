'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import toast from 'react-hot-toast';
import { Icon } from '../types';
import { IconDescriptor, LibraryKey } from '../types/icon';
import { loadLibrary } from '../data/icon-registry';

// Lazy-load descriptor files so they don't bloat the main bundle
async function loadDescriptors(key: LibraryKey): Promise<IconDescriptor[]> {
  switch (key) {
    case 'lucide':    return (await import('../data/lucide-icons-full')).lucideIconsFull;
    case 'tabler':    return (await import('../data/tabler-icons-full')).tablerIconsFull;
    case 'phosphor':  return (await import('../data/phosphor-icons-full')).phosphorIconsFull;
    case 'phosphor-fill': return (await import('../data/phosphor-fill-descriptors')).phosphorFillDescriptors;
    case 'heroicons': return (await import('../data/heroicons-descriptors')).heroiconsDescriptors;
    case 'heroicons-solid': return (await import('../data/heroicons-solid-descriptors')).heroiconsSolidDescriptors;
    case 'bootstrap': return (await import('../data/bootstrap-icons-descriptors')).bootstrapDescriptors;
    case 'radix':     return (await import('../data/radix-icons-descriptors')).radixDescriptors;
    default:          return [];
  }
}
import { IconRenderer } from '../services/iconRenderer';
import { ClipboardManager } from '../services/clipboardManager';
import { ExportManager } from '../services/exportManager';
import { StorageManager } from '../utils/storage';

type IconLibrary = 'all' | 'lucide' | 'tabler' | 'phosphor' | 'phosphor-fill' | 'heroicons' | 'heroicons-solid' | 'bootstrap' | 'radix';
type SortOption = 'name-asc' | 'name-desc' | 'recent' | 'popular';

// Placeholder component rendered while the real component is still loading
function IconPlaceholder() {
  return (
    <div className="w-full h-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
  );
}

/**
 * Converts an IconDescriptor into a legacy Icon shape.
 * If the library has already been loaded into the cache the real component
 * is embedded; otherwise a lightweight placeholder is used and the icon is
 * updated once loading completes.
 */
function descriptorToIcon(
  descriptor: IconDescriptor,
  componentMap: Map<string, React.ComponentType<any>>,
): Icon {
  const cacheKey = `${descriptor.library}::${descriptor.componentName}`;
  const component = componentMap.get(cacheKey) ?? IconPlaceholder;
  return {
    id: descriptor.id,
    name: descriptor.name,
    category: descriptor.category,
    tags: descriptor.tags,
    // Map 'library' → 'type' for backward-compat (legacy Icon uses IconType)
    type: descriptor.library as any,
    component,
    // Precompute lowercase search fields once, so useIconSearch never has to
    // re-lowercase 10k+ names/tags on every keystroke.
    searchName: descriptor.name.toLowerCase(),
    searchTags: descriptor.tags.map((t) => t.toLowerCase()),
    searchCategory: descriptor.category.toLowerCase(),
  };
}

interface IconContextValue {
  icons: Icon[];
  selectedIcon: Icon | null;
  color: string;
  size: number;
  strokeWeight: number;
  favorites: string[];
  recentIcons: string[];
  selectedLibrary: IconLibrary;
  sortBy: SortOption;
  selectIcon: (icon: Icon) => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  setStrokeWeight: (weight: number) => void;
  setSelectedLibrary: (library: IconLibrary) => void;
  setSortBy: (sort: SortOption) => void;
  toggleFavorite: (iconId: string) => void;
  isFavorite: (iconId: string) => boolean;
  downloadPng: () => Promise<void>;
  downloadSvg: () => Promise<void>;
  copyToClipboard: () => Promise<void>;
  isExporting: boolean;
}

const IconContext = createContext<IconContextValue | undefined>(undefined);

export function IconProvider({ children }: { children: React.ReactNode }) {
  // Component cache: "library::componentName" → React.ComponentType
  const componentMapRef = useRef<Map<string, React.ComponentType<any>>>(new Map());
  // Track which libraries have already been loaded (prevents Strict Mode double-load)
  const loadedLibsRef = useRef<Set<string>>(new Set());

  // Icons state — empty initially, populated as each library loads lazily
  const [icons, setIcons] = useState<Icon[]>([]);

  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(128);
  const [strokeWeight, setStrokeWeight] = useState(2);
  const [selectedLibrary, setSelectedLibrary] = useState<IconLibrary>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [isExporting, setIsExporting] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentIcons, setRecentIcons] = useState<string[]>([]);

  // Load favorites and recent icons on mount
  useEffect(() => {
    setFavorites(StorageManager.getFavorites());
    setRecentIcons(StorageManager.getRecentIcons());
  }, []);

  // ── On-demand library loading ─────────────────────────────────────────────
  // Loading all 8 libraries (descriptors + full component packages, several MB)
  // up front blocked first paint and the first search. Instead we load the
  // default library (Lucide) immediately so the gallery is usable at once, then
  // stream in the rest during browser idle time so they never compete with the
  // initial render. The "all" view still fills in progressively.
  useEffect(() => {
    let cancelled = false;

    const PRIMARY_LIBRARY: LibraryKey = 'lucide';
    const DEFERRED_LIBRARIES: LibraryKey[] = [
      'tabler', 'phosphor', 'phosphor-fill', 'heroicons', 'heroicons-solid', 'bootstrap', 'radix',
    ];

    async function ingestLibrary(libKey: LibraryKey): Promise<void> {
      if (cancelled || loadedLibsRef.current.has(libKey)) return;
      loadedLibsRef.current.add(libKey);

      try {
        const [descriptors, components] = await Promise.all([
          loadDescriptors(libKey),
          loadLibrary(libKey),
        ]);
        if (cancelled) return;

        const map = componentMapRef.current;

        // Only cache actual React-renderable components.
        // All modern icon libraries (Lucide, Tabler, Phosphor, Heroicons, etc.)
        // wrap icons with React.forwardRef, which sets $$typeof on the object.
        // Plain utility functions (createLucideIcon, createReactComponent, etc.)
        // do NOT have $$typeof and must be excluded to prevent render crashes.
        for (const [name, comp] of Object.entries(components)) {
          if (comp != null && !!(comp as any).$$typeof) {
            map.set(`${libKey}::${name}`, comp as React.ComponentType<any>);
          }
        }

        const newIcons = descriptors.map((d) => descriptorToIcon(d, map));
        // Append to existing icons (each library appends when ready)
        setIcons((prev) => [...prev, ...newIcons]);
      } catch (err) {
        // Allow a retry on a later effect run if this library failed
        loadedLibsRef.current.delete(libKey);
        console.error(`[IconContext] Failed to load library "${libKey}":`, err);
      }
    }

    (async () => {
      // 1. Load the default library first → gallery interactive ASAP
      await ingestLibrary(PRIMARY_LIBRARY);
      if (cancelled) return;

      // 2. Stream in the remaining libraries during idle time, one at a time,
      //    so heavy parses (e.g. Tabler ~6k icons) don't jank the main thread.
      const loadRestSequentially = () => {
        DEFERRED_LIBRARIES.reduce(
          (chain, key) => chain.then(() => (cancelled ? undefined : ingestLibrary(key))),
          Promise.resolve(),
        );
      };

      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void })
          .requestIdleCallback(loadRestSequentially, { timeout: 2000 });
      } else {
        setTimeout(loadRestSequentially, 200);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Service instances
  const renderer = useMemo(() => new IconRenderer(), []);
  const clipboard = useMemo(() => new ClipboardManager(), []);
  const exporter = useMemo(() => new ExportManager(), []);

  // Select icon and add to recent history
  const selectIcon = useCallback((icon: Icon) => {
    setSelectedIcon(icon);
    StorageManager.addRecentIcon(icon.id);
    setRecentIcons(StorageManager.getRecentIcons());
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((iconId: string) => {
    if (StorageManager.isFavorite(iconId)) {
      StorageManager.removeFavorite(iconId);
      toast.success('Removed from favorites');
    } else {
      StorageManager.addFavorite(iconId);
      toast.success('Added to favorites');
    }
    setFavorites(StorageManager.getFavorites());
  }, []);

  // Check if icon is favorite
  const isFavorite = useCallback((iconId: string) => {
    return favorites.includes(iconId);
  }, [favorites]);

  // Update color and add to recent colors
  const handleSetColor = useCallback((newColor: string) => {
    setColor(newColor);
    StorageManager.addRecentColor(newColor);
  }, []);

  // Download PNG
  const downloadPng = useCallback(async () => {
    if (!selectedIcon) {
      toast.error('Please select an icon first');
      return;
    }

    setIsExporting(true);
    try {
      const blob = await renderer.iconToPng(
        selectedIcon,
        size,
        color,
        strokeWeight
      );

      const filename = exporter.generateFilename(selectedIcon, color, size, 'png');
      exporter.downloadPng(blob, filename);

      toast.success('Downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed');
    } finally {
      setIsExporting(false);
    }
  }, [selectedIcon, size, color, strokeWeight, renderer, exporter]);

  // Download SVG
  const downloadSvg = useCallback(async () => {
    if (!selectedIcon) {
      toast.error('Please select an icon first');
      return;
    }

    setIsExporting(true);
    try {
      const blob = await renderer.iconToSvg(
        selectedIcon,
        size,
        color,
        strokeWeight
      );

      const filename = exporter.generateFilename(selectedIcon, color, size, 'svg');
      exporter.downloadSvg(blob, filename);

      toast.success('Downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed');
    } finally {
      setIsExporting(false);
    }
  }, [selectedIcon, size, color, strokeWeight, renderer, exporter]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    if (!selectedIcon) {
      toast.error('Please select an icon first');
      return;
    }

    if (!clipboard.isSupported()) {
      toast.error('Clipboard not supported in your browser');
      return;
    }

    setIsExporting(true);
    try {
      const blob = await renderer.iconToPng(
        selectedIcon,
        size,
        color,
        strokeWeight
      );

      await clipboard.copyImage(blob);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Copy failed');
    } finally {
      setIsExporting(false);
    }
  }, [selectedIcon, size, color, strokeWeight, renderer, clipboard]);

  const value: IconContextValue = {
    icons,
    selectedIcon,
    color,
    size,
    strokeWeight,
    selectedLibrary,
    sortBy,
    favorites,
    recentIcons,
    selectIcon,
    setColor: handleSetColor,
    setSize,
    setStrokeWeight,
    setSelectedLibrary,
    setSortBy,
    toggleFavorite,
    isFavorite,
    downloadPng,
    downloadSvg,
    copyToClipboard,
    isExporting,
  };

  return <IconContext.Provider value={value}>{children}</IconContext.Provider>;
}

export function useIconContext() {
  const context = useContext(IconContext);
  if (!context) {
    throw new Error('useIconContext must be used within IconProvider');
  }
  return context;
}
