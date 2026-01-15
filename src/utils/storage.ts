const STORAGE_KEYS = {
  FAVORITES: 'icony_favorites',
  RECENT_ICONS: 'icony_recent_icons',
  RECENT_COLORS: 'icony_recent_colors',
} as const;

export class StorageManager {
  /**
   * Get favorites from localStorage
   */
  static getFavorites(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get favorites:', error);
      return [];
    }
  }

  /**
   * Add icon to favorites
   */
  static addFavorite(iconId: string): void {
    try {
      const favorites = this.getFavorites();
      if (!favorites.includes(iconId)) {
        favorites.push(iconId);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  }

  /**
   * Remove icon from favorites
   */
  static removeFavorite(iconId: string): void {
    try {
      const favorites = this.getFavorites();
      const filtered = favorites.filter((id) => id !== iconId);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  }

  /**
   * Check if icon is favorite
   */
  static isFavorite(iconId: string): boolean {
    return this.getFavorites().includes(iconId);
  }

  /**
   * Get recent icons
   */
  static getRecentIcons(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECENT_ICONS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get recent icons:', error);
      return [];
    }
  }

  /**
   * Add icon to recent history (max 10)
   */
  static addRecentIcon(iconId: string): void {
    try {
      let recent = this.getRecentIcons();
      // Remove if already exists
      recent = recent.filter((id) => id !== iconId);
      // Add to front
      recent.unshift(iconId);
      // Keep only last 10
      recent = recent.slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.RECENT_ICONS, JSON.stringify(recent));
    } catch (error) {
      console.error('Failed to add recent icon:', error);
    }
  }

  /**
   * Get recent colors
   */
  static getRecentColors(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECENT_COLORS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get recent colors:', error);
      return [];
    }
  }

  /**
   * Add color to recent history (max 8)
   */
  static addRecentColor(color: string): void {
    try {
      let recent = this.getRecentColors();
      // Remove if already exists
      recent = recent.filter((c) => c !== color);
      // Add to front
      recent.unshift(color);
      // Keep only last 8
      recent = recent.slice(0, 8);
      localStorage.setItem(STORAGE_KEYS.RECENT_COLORS, JSON.stringify(recent));
    } catch (error) {
      console.error('Failed to add recent color:', error);
    }
  }

  /**
   * Get saved color palettes
   */
  static getPalettes(): Array<{ name: string; colors: string[] }> {
    try {
      const stored = localStorage.getItem('icony_palettes');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get palettes:', error);
      return [];
    }
  }

  /**
   * Save a color palette
   */
  static savePalette(name: string, colors: string[]): void {
    try {
      const palettes = this.getPalettes();
      // Check if palette with same name exists
      const existingIndex = palettes.findIndex((p) => p.name === name);
      if (existingIndex >= 0) {
        palettes[existingIndex] = { name, colors };
      } else {
        palettes.push({ name, colors });
      }
      localStorage.setItem('icony_palettes', JSON.stringify(palettes));
    } catch (error) {
      console.error('Failed to save palette:', error);
    }
  }

  /**
   * Delete a color palette
   */
  static deletePalette(name: string): void {
    try {
      const palettes = this.getPalettes();
      const filtered = palettes.filter((p) => p.name !== name);
      localStorage.setItem('icony_palettes', JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete palette:', error);
    }
  }
}
