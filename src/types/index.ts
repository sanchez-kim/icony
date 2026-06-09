// ---------------------------------------------------------------------------
// Re-export type system from icon.ts
// ---------------------------------------------------------------------------
export type {
  LibraryKey,
  LicenseType,
  LibraryMeta,
  IconDescriptor,
  ResolvedIcon,
  LibraryComponents,
  LibraryLoadState,
  LibraryState,
} from './icon';

// Generic icon component type that works for all libraries.
// All icon packages expose forwardRef/function components, so a single
// ComponentType<any> covers every library and avoids per-library casts.
export type IconComponent = React.ComponentType<any>;

/**
 * Icon is the runtime type used by all components and hooks.
 */
export interface Icon {
  id: string;
  name: string;
  category: string;
  tags: string[];
  type: import('./icon').LibraryKey;
  component: IconComponent;
  /**
   * Precomputed lowercase search index, built once when the icon is created.
   * Lets the search hot-loop skip per-keystroke `.toLowerCase()` allocations.
   */
  searchName: string;
  searchTags: string[];
  searchCategory: string;
}
