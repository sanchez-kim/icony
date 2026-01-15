import { useMemo } from 'react';
import { Icon } from '../types';

export function useIconSearch(icons: Icon[], query: string): Icon[] {
  return useMemo(() => {
    if (!query.trim()) {
      return icons;
    }

    const lowerQuery = query.toLowerCase();

    return icons.filter((icon) => {
      // Name matching
      if (icon.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Tag matching
      if (icon.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
        return true;
      }

      // Category matching
      if (icon.category.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      return false;
    });
  }, [icons, query]);
}
