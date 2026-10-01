'use client';

import { useCallback, useId } from 'react';
import type { Icon } from '../../types';
import type { LibraryKey } from '../../types/icon';
import { autoDiscColor, type BadgeSize, type BadgeSpec, type Corner } from '../../utils/favicon/compose';
import { useLanguage } from '../../context/LanguageContext';
import { ColorField } from './ColorField';
import { IconPicker } from './IconPicker';
import { Segmented } from './TileControls';

export interface BadgeState {
  enabled: boolean;
  icon: Icon | null;
  library: LibraryKey;
  spec: BadgeSpec;
  hideAt16: boolean;
}

/** Badge picker default: a notification bell is the classic favicon badge. */
const DEFAULT_BADGE_ICON_ID = 'phosphor-fill-Bell';

interface BadgeControlsProps {
  badge: BadgeState;
  /** Tile colour, used to show what the 'auto' disc colour resolves to. */
  tileColor: string;
  onChange: (update: (prev: BadgeState) => BadgeState) => void;
}

export function BadgeControls({ badge, tileColor, onChange }: BadgeControlsProps) {
  const { t } = useLanguage();
  const fg = t.faviconGenerator;
  const id = useId();

  const setSpec = (patch: Partial<BadgeSpec>) => onChange((b) => ({ ...b, spec: { ...b.spec, ...patch } }));
  const selectIcon = useCallback((icon: Icon) => onChange((b) => ({ ...b, icon })), [onChange]);
  const setLibrary = useCallback((library: LibraryKey) => onChange((b) => ({ ...b, library })), [onChange]);

  const autoDisc = badge.spec.discColor === 'auto';

  return (
    <fieldset className="space-y-4">
      <legend className="text-base font-semibold text-gray-900 dark:text-white mb-1">{fg.badge}</legend>

      <label htmlFor={`${id}-on`} className="flex items-center gap-3 cursor-pointer">
        <input
          id={`${id}-on`}
          type="checkbox"
          checked={badge.enabled}
          onChange={(e) => onChange((b) => ({ ...b, enabled: e.target.checked }))}
          className="w-4 h-4 rounded accent-primary-600"
        />
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{fg.enableBadge}</span>
      </label>

      {badge.enabled && (
        <div className="space-y-4 pl-0 sm:pl-7">
          <IconPicker
            label={fg.badgeIcon}
            library={badge.library}
            onLibraryChange={setLibrary}
            selected={badge.icon}
            onSelect={selectIcon}
            defaultIconId={DEFAULT_BADGE_ICON_ID}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ColorField label={fg.badgeColor} value={badge.spec.color} onChange={(color) => setSpec({ color })} />
            <div className="space-y-2">
              <ColorField
                label={fg.discColor}
                value={autoDisc ? autoDiscColor(tileColor) : badge.spec.discColor}
                onChange={(discColor) => setSpec({ discColor })}
              />
              <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoDisc}
                  onChange={(e) => setSpec({ discColor: e.target.checked ? 'auto' : autoDiscColor(tileColor) })}
                  className="w-3.5 h-3.5 rounded accent-primary-600"
                />
                {fg.auto}
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Segmented<Corner>
              label={fg.corner}
              value={badge.spec.corner}
              columns={2}
              options={[
                { value: 'top-left', label: fg.topLeft },
                { value: 'top-right', label: fg.topRight },
                { value: 'bottom-left', label: fg.bottomLeft },
                { value: 'bottom-right', label: fg.bottomRight },
              ]}
              onChange={(corner) => setSpec({ corner })}
            />
            <Segmented<BadgeSize>
              label={fg.badgeSize}
              value={badge.spec.size}
              options={[
                { value: 'small', label: fg.small },
                { value: 'medium', label: fg.medium },
              ]}
              onChange={(size) => setSpec({ size })}
            />
          </div>

          <label htmlFor={`${id}-h16`} className="flex items-center gap-3 cursor-pointer">
            <input
              id={`${id}-h16`}
              type="checkbox"
              checked={badge.hideAt16}
              onChange={(e) => onChange((b) => ({ ...b, hideAt16: e.target.checked }))}
              className="w-4 h-4 rounded accent-primary-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{fg.hideAt16}</span>
          </label>
        </div>
      )}
    </fieldset>
  );
}
