import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Home } from 'lucide-react';
import { IconHome } from '@tabler/icons-react';
import { HomeIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid } from '@heroicons/react/24/solid';
import { House } from '@phosphor-icons/react';
import { HouseFill } from 'react-bootstrap-icons';
import { HomeIcon as RadixHomeIcon } from '@radix-ui/react-icons';
import {
  IconRenderer,
  NATIVE_STROKE_WIDTH,
  expandViewBox,
  strokeOverflow,
} from './iconRenderer';
import type { Icon, LibraryKey } from '../types';

function makeIcon(type: LibraryKey, component: unknown): Icon {
  return {
    id: `test-${type}`,
    name: 'home',
    category: 'misc',
    tags: [],
    type,
    component: component as Icon['component'],
    searchName: 'home',
    searchTags: [],
    searchCategory: 'misc',
  };
}

function viewBoxOf(svg: string): number[] {
  const m = svg.match(/^<svg\b[^>]*\sviewBox="([^"]*)"/);
  if (!m) throw new Error(`no viewBox in ${svg.slice(0, 120)}`);
  return m[1].trim().split(/[\s,]+/).map(Number);
}

describe('strokeOverflow', () => {
  it('is zero at or below the native stroke width', () => {
    expect(strokeOverflow('lucide', 2)).toBe(0);
    expect(strokeOverflow('lucide', 0.5)).toBe(0);
    expect(strokeOverflow('tabler', 1)).toBe(0);
    expect(strokeOverflow('heroicons', 1.5)).toBe(0);
  });

  it('is half the extra stroke width beyond native, in viewBox units', () => {
    expect(strokeOverflow('lucide', 3)).toBe(0.5);
    expect(strokeOverflow('lucide', 4)).toBe(1);
    expect(strokeOverflow('tabler', 4)).toBe(1);
    expect(strokeOverflow('heroicons', 2)).toBe(0.25);
    expect(strokeOverflow('heroicons', 4)).toBe(1.25);
  });

  it('is zero for fill-based libraries at any slider value', () => {
    const fillLibs: LibraryKey[] = ['phosphor', 'phosphor-fill', 'heroicons-solid', 'bootstrap', 'radix'];
    for (const lib of fillLibs) {
      expect(NATIVE_STROKE_WIDTH[lib]).toBeUndefined();
      for (const sw of [0.5, 2, 4]) expect(strokeOverflow(lib, sw)).toBe(0);
    }
  });

  it('ignores non-finite stroke weights', () => {
    expect(strokeOverflow('lucide', Number.NaN)).toBe(0);
    expect(strokeOverflow('lucide', Number.POSITIVE_INFINITY)).toBe(0);
  });

});

describe('expandViewBox', () => {
  const svg = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M0 0h24"></path></svg>';

  it('returns markup unchanged for a zero or negative margin', () => {
    expect(expandViewBox(svg, 0)).toBe(svg);
    expect(expandViewBox(svg, -1)).toBe(svg);
  });

  it('widens the viewBox symmetrically and keeps width/height and children', () => {
    const out = expandViewBox(svg, 1);
    expect(viewBoxOf(out)).toEqual([-1, -1, 26, 26]);
    expect(out).toContain('width="32" height="32"');
    expect(out).toContain('<path d="M0 0h24"></path>');
  });

  it('handles non-zero origins and comma-separated values', () => {
    const out = expandViewBox('<svg viewBox="2,2,20,20"></svg>', 0.5);
    expect(viewBoxOf(out)).toEqual([1.5, 1.5, 21, 21]);
  });

  it('only touches the root svg element', () => {
    const nested = '<svg viewBox="0 0 24 24"><svg viewBox="0 0 10 10"></svg></svg>';
    const out = expandViewBox(nested, 1);
    expect(out).toBe('<svg viewBox="-1 -1 26 26"><svg viewBox="0 0 10 10"></svg></svg>');
  });

  it('returns markup unchanged when there is no usable viewBox', () => {
    expect(expandViewBox('<svg width="24"></svg>', 1)).toBe('<svg width="24"></svg>');
    expect(expandViewBox('<svg viewBox="0 0 24"></svg>', 1)).toBe('<svg viewBox="0 0 24"></svg>');
    expect(expandViewBox('<div></div>', 1)).toBe('<div></div>');
  });
});

describe('export viewBox per library (rendered markup)', () => {
  const renderer = new IconRenderer();
  const cases: Array<{ lib: LibraryKey; component: unknown; native: number[] }> = [
    { lib: 'lucide', component: Home, native: [0, 0, 24, 24] },
    { lib: 'tabler', component: IconHome, native: [0, 0, 24, 24] },
    { lib: 'heroicons', component: HomeIcon, native: [0, 0, 24, 24] },
    { lib: 'heroicons-solid', component: HomeIconSolid, native: [0, 0, 24, 24] },
    { lib: 'phosphor', component: House, native: [0, 0, 256, 256] },
    { lib: 'phosphor-fill', component: House, native: [0, 0, 256, 256] },
    { lib: 'bootstrap', component: HouseFill, native: [0, 0, 16, 16] },
    { lib: 'radix', component: RadixHomeIcon, native: [0, 0, 15, 15] },
  ];

  for (const { lib, component, native } of cases) {
    it(`${lib}: renders its native grid and widens only by the stroke overflow`, () => {
      const icon = makeIcon(lib, component);
      for (const sw of [0.5, 1, 2, 3, 4]) {
        const svg = renderer.iconToSvgString(icon, 32, '#000000', sw);
        expect(viewBoxOf(svg)).toEqual(native);
        const m = strokeOverflow(lib, sw);
        const [x, y, w, h] = native;
        expect(viewBoxOf(expandViewBox(svg, m))).toEqual([x - m, y - m, w + 2 * m, h + 2 * m]);
      }
    });
  }

  it('stroke libraries render with the stroke width the overflow math assumes', () => {
    // The overflow formula relies on stroke-width being in viewBox units and on
    // round joins/caps (no miter spikes past the half-width).
    for (const [lib, component] of [['lucide', Home], ['tabler', IconHome], ['heroicons', HomeIcon]] as const) {
      const svg = renderer.iconToSvgString(makeIcon(lib, component), 32, '#000000', 3);
      expect(svg).toMatch(/stroke-width="3"/);
      expect(svg).toMatch(/stroke-linejoin="round"/);
      expect(svg).not.toMatch(/stroke-linejoin="miter"/);
      expect(svg).not.toMatch(/vector-effect/);
    }
  });

  it('native stroke widths match what each library renders by default', () => {
    for (const [lib, component] of [['lucide', Home], ['tabler', IconHome], ['heroicons', HomeIcon]] as const) {
      const svg = renderToString(createElement(component as React.ComponentType));
      expect(svg).toMatch(new RegExp(`stroke-width="${NATIVE_STROKE_WIDTH[lib]}"`));
    }
  });
});
