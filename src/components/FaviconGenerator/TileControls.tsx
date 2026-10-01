'use client';

import { useId } from 'react';
import type { TileSpec } from '../../utils/favicon/compose';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/cn';
import { ColorField } from './ColorField';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

/** Radio-group style button row (aria-pressed buttons inside a labelled group). */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  columns,
}: {
  label: string;
  value: T | null;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  columns?: number;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <span id={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={id}
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${columns ?? options.length}, minmax(0, 1fr))` }}
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={cn(
              'px-2 py-2 text-xs font-medium rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
              value === o.value
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Labelled range input with the current value shown. */
export function Slider({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
          {value}
          {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary-600"
      />
    </div>
  );
}

type Shape = 'square' | 'rounded' | 'circle';
const SHAPE_RADIUS: Record<Shape, number> = { square: 0, rounded: 25, circle: 50 };

function shapeOf(radiusPct: number): Shape {
  if (radiusPct <= 0) return 'square';
  if (radiusPct >= 50) return 'circle';
  return 'rounded';
}

interface TileControlsProps {
  tile: TileSpec;
  onChange: (tile: TileSpec) => void;
}

export function TileControls({ tile, onChange }: TileControlsProps) {
  const { t } = useLanguage();
  const fg = t.faviconGenerator;

  return (
    <fieldset className="space-y-4">
      <legend className="text-base font-semibold text-gray-900 dark:text-white mb-1">{fg.tile}</legend>
      <ColorField label={fg.tileColor} value={tile.color} onChange={(color) => onChange({ ...tile, color })} />
      <Segmented<Shape>
        label={fg.shape}
        value={shapeOf(tile.radiusPct)}
        options={[
          { value: 'square', label: fg.square },
          { value: 'rounded', label: fg.rounded },
          { value: 'circle', label: fg.circle },
        ]}
        onChange={(s) => onChange({ ...tile, radiusPct: SHAPE_RADIUS[s] })}
      />
      <Slider
        label={fg.radius}
        value={tile.radiusPct}
        min={0}
        max={50}
        step={1}
        unit="%"
        onChange={(radiusPct) => onChange({ ...tile, radiusPct })}
      />
      <Slider
        label={fg.padding}
        value={tile.paddingPct}
        min={0}
        max={30}
        step={1}
        unit="%"
        onChange={(paddingPct) => onChange({ ...tile, paddingPct })}
      />
    </fieldset>
  );
}
