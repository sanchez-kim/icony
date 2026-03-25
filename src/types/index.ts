import { LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Re-export new type system from icon.ts
// ---------------------------------------------------------------------------
export type {
  LibraryKey,
  LicenseType,
  LibraryMeta,
  IconDescriptor,
  ResolvedIcon,
  LegacyIcon,
  LibraryComponents,
  LibraryLoadState,
  LibraryState,
} from './icon';

// ---------------------------------------------------------------------------
// Legacy types — preserved for backward compatibility
// All existing code continues to compile unchanged.
// ---------------------------------------------------------------------------

/**
 * IconType is the legacy library discriminator.
 * New code should use LibraryKey from ./icon instead.
 *
 * @deprecated Use LibraryKey from './icon'
 */
export type IconType = 'lucide' | 'tabler' | 'phosphor';

// Generic icon component type that works for all libraries
export type IconComponent = LucideIcon | React.ComponentType<any>;

/**
 * Icon is the legacy icon shape with an embedded component reference.
 * It remains the runtime type used by all existing components and hooks.
 *
 * Migration path:
 *   1. Data files: replace Icon[] with IconDescriptor[] (no component field)
 *   2. Rendering: resolve components via useIconLibrary / getCachedComponent
 *   3. Once all data files are migrated, alias Icon → ResolvedIcon
 */
export interface Icon {
  id: string;
  name: string;
  category: string;
  tags: string[];
  type: IconType;
  component: IconComponent;
}

export interface CustomizationState {
  selectedIcon: Icon | null;
  color: string;
  size: number;
}

export interface ExportOptions {
  format: 'png';
  size: number;
  color: string;
  backgroundColor?: string;
}
