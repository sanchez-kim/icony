import type React from 'react';
import type { Icon } from '../types';
import type { IconDescriptor, LibraryKey } from '../types/icon';

// Lazy-load descriptor files so they don't bloat the main bundle
export async function loadDescriptors(key: LibraryKey): Promise<IconDescriptor[]> {
  switch (key) {
    case 'lucide':    return (await import('./lucide-icons-full')).lucideIconsFull;
    case 'tabler':    return (await import('./tabler-icons-full')).tablerIconsFull;
    case 'phosphor':  return (await import('./phosphor-icons-full')).phosphorIconsFull;
    case 'phosphor-fill': return (await import('./phosphor-fill-descriptors')).phosphorFillDescriptors;
    case 'heroicons': return (await import('./heroicons-descriptors')).heroiconsDescriptors;
    case 'heroicons-solid': return (await import('./heroicons-solid-descriptors')).heroiconsSolidDescriptors;
    case 'bootstrap': return (await import('./bootstrap-icons-descriptors')).bootstrapDescriptors;
    case 'radix':     return (await import('./radix-icons-descriptors')).radixDescriptors;
    default:          return [];
  }
}

/**
 * Converts an IconDescriptor into a legacy Icon shape, embedding the given
 * component. Pure: callers decide which component (real or placeholder).
 */
export function descriptorToIcon(
  descriptor: IconDescriptor,
  component: React.ComponentType<any>,
): Icon {
  return {
    id: descriptor.id,
    name: descriptor.name,
    category: descriptor.category,
    tags: descriptor.tags,
    // Map 'library' → 'type' for backward-compat (legacy Icon uses IconType)
    type: descriptor.library,
    component,
    // Precompute lowercase search fields once, so useIconSearch never has to
    // re-lowercase 10k+ names/tags on every keystroke.
    searchName: descriptor.name.toLowerCase(),
    searchTags: descriptor.tags.map((t) => t.toLowerCase()),
    searchCategory: descriptor.category.toLowerCase(),
  };
}
