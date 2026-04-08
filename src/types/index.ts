import { LucideIcon } from 'lucide-react';

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

// Generic icon component type that works for all libraries
export type IconComponent = LucideIcon | React.ComponentType<any>;

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
}
