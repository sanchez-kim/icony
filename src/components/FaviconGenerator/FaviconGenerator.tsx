'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Icon } from '../../types';
import type { LibraryKey } from '../../types/icon';
import { useLanguage } from '../../context/LanguageContext';
import { IconRenderer } from '../../services/iconRenderer';
import type { FaviconBundleInput, FaviconBundleMeta } from '../../services/faviconExporter';
import {
  CANVAS,
  composeFaviconSvg,
  svgToDataUrl,
  type CompositionLayers,
  type TileSpec,
} from '../../utils/favicon/compose';
import { BadgeControls, type BadgeState } from './BadgeControls';
import { ColorField } from './ColorField';
import { ExportPanel } from './ExportPanel';
import { IconPicker } from './IconPicker';
import { PreviewStrip, type PreviewUrls } from './PreviewStrip';
import { Slider, TileControls } from './TileControls';

const renderer = new IconRenderer();

/** Libraries where the stroke slider changes the artwork (see iconRenderer). */
const STROKE_LIBRARIES: ReadonlySet<LibraryKey> = new Set<LibraryKey>(['lucide', 'tabler', 'phosphor', 'heroicons']);

/** Auto-selected after the default library loads (client-only, post-hydration). */
const DEFAULT_MAIN_ICON_ID = 'phosphor-fill-Star';

interface MainState {
  icon: Icon | null;
  library: LibraryKey;
  color: string;
  strokeWeight: number;
}

const INITIAL_TILE: TileSpec = { color: '#4f46e5', radiusPct: 25, paddingPct: 12 };
const INITIAL_MAIN: MainState = { icon: null, library: 'phosphor-fill', color: '#ffffff', strokeWeight: 2 };
// Badge glyph defaults to the tile colour: the 'auto' disc is white on the
// default (dark) tile, so a white glyph would vanish into it.
const INITIAL_BADGE: BadgeState = {
  enabled: false,
  icon: null,
  library: 'phosphor-fill',
  spec: { corner: 'bottom-right', size: 'small', color: INITIAL_TILE.color, discColor: 'auto' },
  hideAt16: true,
};
const INITIAL_META: FaviconBundleMeta = { appName: 'My App', shortName: 'App' };

export function FaviconGenerator() {
  const { t } = useLanguage();
  const fg = t.faviconGenerator;

  const [tile, setTile] = useState<TileSpec>(INITIAL_TILE);
  const [main, setMain] = useState<MainState>(INITIAL_MAIN);
  const [badge, setBadge] = useState<BadgeState>(INITIAL_BADGE);
  const [meta, setMeta] = useState<FaviconBundleMeta>(INITIAL_META);

  const selectMain = useCallback((icon: Icon) => setMain((m) => ({ ...m, icon })), []);
  const setMainLibrary = useCallback((library: LibraryKey) => setMain((m) => ({ ...m, library })), []);
  const updateBadge = useCallback((update: (prev: BadgeState) => BadgeState) => setBadge(update), []);

  const mainSvg = useMemo(
    () => (main.icon ? renderer.iconToSvgString(main.icon, CANVAS, main.color, main.strokeWeight) : null),
    [main.icon, main.color, main.strokeWeight]
  );
  const badgeSvg = useMemo(
    () => (badge.enabled && badge.icon ? renderer.iconToSvgString(badge.icon, CANVAS, badge.spec.color, 2) : null),
    [badge.enabled, badge.icon, badge.spec.color]
  );

  const layers = useMemo<CompositionLayers>(
    () => ({ tile, mainSvg, badge: badgeSvg ? { svg: badgeSvg, spec: badge.spec } : null }),
    [tile, mainSvg, badgeSvg, badge.spec]
  );

  const previews = useMemo<PreviewUrls>(
    () => ({
      s16: svgToDataUrl(composeFaviconSvg(layers, { width: 16, includeBadge: !badge.hideAt16 })),
      s32: svgToDataUrl(composeFaviconSvg(layers, { width: 32 })),
      s180: svgToDataUrl(composeFaviconSvg(layers, { width: 180, variant: 'opaque' })),
      s512: svgToDataUrl(composeFaviconSvg(layers, { width: 512 })),
    }),
    [layers, badge.hideAt16]
  );

  const exportInput = useMemo<FaviconBundleInput | null>(
    () => (mainSvg ? { layers, hideBadgeAt16: badge.hideAt16, meta } : null),
    [mainSvg, layers, badge.hideAt16, meta]
  );

  const showStroke = main.icon !== null && STROKE_LIBRARIES.has(main.icon.type);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-5 sm:p-6 transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] gap-8">
        <div className="space-y-8 min-w-0">
          <div className="space-y-4">
            <IconPicker
              label={fg.mainIcon}
              library={main.library}
              onLibraryChange={setMainLibrary}
              selected={main.icon}
              onSelect={selectMain}
              defaultIconId={DEFAULT_MAIN_ICON_ID}
              showLegibilityHint
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorField
                label={fg.iconColor}
                value={main.color}
                onChange={(color) => setMain((m) => ({ ...m, color }))}
              />
              {showStroke && (
                <Slider
                  label={fg.strokeWeight}
                  value={main.strokeWeight}
                  min={1}
                  max={4}
                  step={0.5}
                  onChange={(strokeWeight) => setMain((m) => ({ ...m, strokeWeight }))}
                />
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
            <TileControls tile={tile} onChange={setTile} />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
            <BadgeControls badge={badge} tileColor={tile.color} onChange={updateBadge} />
          </div>
        </div>

        <div className="space-y-8 lg:sticky lg:top-6 self-start min-w-0">
          <PreviewStrip previews={previews} appName={meta.appName} />
          <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
            <ExportPanel input={exportInput} iconName={main.icon?.name ?? null} meta={meta} onMetaChange={setMeta} />
          </div>
        </div>
      </div>
    </div>
  );
}
