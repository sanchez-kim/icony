/**
 * icon.ts - New icon type system with lazy loading support
 *
 * Design goals:
 * 1. Library-level lazy loading via dynamic imports
 * 2. License metadata per library
 * 3. Korean + English tag support for bilingual search
 * 4. Extensible to future libraries (heroicons, bootstrap-icons, radix, remix-icon)
 * 5. Backward-compatible with existing Icon type (LegacyIcon alias)
 */

// ---------------------------------------------------------------------------
// Library keys — single source of truth
// ---------------------------------------------------------------------------

export type LibraryKey =
  | 'lucide'
  | 'tabler'
  | 'phosphor'
  | 'phosphor-fill'
  | 'heroicons'
  | 'heroicons-solid'
  | 'bootstrap'
  | 'radix'
  | 'remix';

export type LicenseType = 'MIT' | 'ISC' | 'Apache-2.0' | 'CC-BY-4.0' | 'SIL OFL 1.1';

// ---------------------------------------------------------------------------
// Library metadata
// ---------------------------------------------------------------------------

export interface LibraryMeta {
  /** Unique key used throughout the app to identify the library */
  key: LibraryKey;
  /** Human-readable display name */
  name: string;
  /** Short display name for compact UI */
  shortName: string;
  /** SPDX license identifier */
  license: LicenseType;
  /** Semver of the currently bundled package */
  version: string;
  /** Homepage / repository URL */
  url: string;
  /** Approximate icon count (informational, not enforced at runtime) */
  iconCount: number;
  /** Whether this library is currently available in the bundle */
  available: boolean;
}

// ---------------------------------------------------------------------------
// Icon descriptor — no component reference, enables lazy loading
// ---------------------------------------------------------------------------

/**
 * IconDescriptor contains only serialisable metadata.
 * The actual React component is resolved at runtime via `loadLibrary()`.
 *
 * - `id` is globally unique: `"<library>-<icon-name>"` e.g. `"lucide-home"`
 * - `componentName` is the export name inside the library package
 *   e.g. `"Home"` for lucide-react, `"IconHome"` for @tabler/icons-react
 */
export interface IconDescriptor {
  /** Globally unique identifier: "<library>-<componentName>" */
  id: string;
  /** Human-readable display name (may differ from componentName) */
  name: string;
  /** Library this icon belongs to */
  library: LibraryKey;
  /**
   * Exact export name from the library package.
   * Used to resolve the component via loadLibrary().
   */
  componentName: string;
  /**
   * Mixed English + Korean tags for bilingual search.
   * Convention: English tags first, then Korean tags.
   * Example: ['home', 'house', '홈', '집', '메인']
   */
  tags: string[];
  /**
   * Primary category slug (matches existing category filter values).
   * Kept as single string for backward compatibility.
   */
  category: string;
  /** Additional category slugs for icons that span multiple domains */
  categories?: string[];
}

// ---------------------------------------------------------------------------
// Resolved icon — includes the live React component
// ---------------------------------------------------------------------------

/**
 * ResolvedIcon extends IconDescriptor with the loaded React component.
 * This is what consumers (IconCard, CustomizationPanel, etc.) ultimately use.
 */
export interface ResolvedIcon extends IconDescriptor {
  component: React.ComponentType<any>;
}

// ---------------------------------------------------------------------------
// Backward-compatibility alias
// ---------------------------------------------------------------------------

/**
 * LegacyIcon is the original Icon interface shape.
 * Kept so existing code continues to compile while migration proceeds.
 *
 * @deprecated Use ResolvedIcon for new code. LegacyIcon will be removed
 *             once all data files are migrated to IconDescriptor format.
 */
export interface LegacyIcon {
  id: string;
  name: string;
  category: string;
  tags: string[];
  /** Library identifier — maps to LibraryKey */
  type: LibraryKey;
  component: React.ComponentType<any>;
}

// ---------------------------------------------------------------------------
// Library component map — what loadLibrary() returns
// ---------------------------------------------------------------------------

/**
 * A map from component name → React component for a single library.
 * Example: { Home: LucideHome, Search: LucideSearch, ... }
 */
export type LibraryComponents = Record<string, React.ComponentType<any>>;

// ---------------------------------------------------------------------------
// Loading state types (used by useIconLibrary hook)
// ---------------------------------------------------------------------------

export type LibraryLoadState = 'idle' | 'loading' | 'loaded' | 'error';

export interface LibraryState {
  state: LibraryLoadState;
  components: LibraryComponents | null;
  error: Error | null;
}
