import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import toast from 'react-hot-toast';
import { Icon } from '../types';
import { icons as iconData } from '../data/icons';
import { IconRenderer } from '../services/iconRenderer';
import { ClipboardManager } from '../services/clipboardManager';
import { ExportManager } from '../services/exportManager';
import { StorageManager } from '../utils/storage';

type IconLibrary = 'all' | 'fontawesome' | 'lucide' | 'tabler' | 'phosphor';
type SortOption = 'name-asc' | 'name-desc' | 'recent' | 'popular';

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
  const [icons] = useState<Icon[]>(iconData);
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
        color
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
  }, [selectedIcon, size, color, renderer, exporter]);

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
        color
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
  }, [selectedIcon, size, color, renderer, exporter]);

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
        color
      );

      await clipboard.copyImage(blob);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Copy failed');
    } finally {
      setIsExporting(false);
    }
  }, [selectedIcon, size, color, renderer, clipboard]);

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
