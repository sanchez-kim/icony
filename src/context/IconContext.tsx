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

  // ── Lazy loading: descriptors + components together per library ───────────
  useEffect(() => {
    const librariesToLoad: LibraryKey[] = ['lucide', 'tabler', 'phosphor', 'phosphor-fill', 'heroicons', 'heroicons-solid', 'bootstrap', 'radix'];

    for (const libKey of librariesToLoad) {
      Promise.all([
        loadDescriptors(libKey),
        loadLibrary(libKey),
      ]).then(([descriptors, components]) => {
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

        // Convert descriptors → icons with resolved components
        const newIcons = descriptors.map((d) => descriptorToIcon(d, map));

        // Append to existing icons (each library appends when ready)
        setIcons((prev) => [...prev, ...newIcons]);
      }).catch((err) => {
        console.error(`[IconContext] Failed to load library "${libKey}":`, err);
      });
    }
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
