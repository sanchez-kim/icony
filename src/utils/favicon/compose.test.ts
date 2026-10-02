import { describe, it, expect } from 'vitest';
import { Home } from 'lucide-react';
import { IconHome } from '@tabler/icons-react';
import { HomeIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid } from '@heroicons/react/24/solid';
import { House } from '@phosphor-icons/react';
import { HouseFill } from 'react-bootstrap-icons';
import { HomeIcon as RadixHomeIcon } from '@radix-ui/react-icons';
import { IconRenderer } from '../../services/iconRenderer';
import type { Icon, LibraryKey } from '../../types';
import {
  CANVAS,
  autoDiscColor,
  badgeGeometry,
  composeFaviconSvg,
  contentHalfExtent,
  iconBox,
  maskableScale,
  placeSvg,
  relativeLuminance,
  svgToDataUrl,
  tileRadius,
  type BadgeSpec,
  type CompositionLayers,
  type Corner,
  type TileSpec,
} from './compose';

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

function rootTag(svg: string): string {
  const m = svg.match(/^<svg\b[^>]*>/);
  if (!m) throw new Error(`no root svg in ${svg.slice(0, 120)}`);
  return m[0];
}

function attr(tag: string, name: string): string | undefined {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
}

const CORNERS: Corner[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const TILE: TileSpec = { color: '#4f46e5', radiusPct: 25, paddingPct: 12 };
const BADGE: BadgeSpec = { corner: 'bottom-right', size: 'small', color: '#ffffff', discColor: 'auto' };
const MAIN = '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 24 24" fill="#fff"><path d="M0 0h24v24H0z"></path></svg>';
const BADGE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 16 16" fill="#fff"><path d="M0 0h16v16H0z"></path></svg>';

function layers(over: Partial<CompositionLayers> = {}): CompositionLayers {
  return { tile: TILE, mainSvg: MAIN, badge: { svg: BADGE_SVG, spec: BADGE }, ...over };
}

describe('tileRadius', () => {
  it('maps 0/25/50 percent to 0/128/256', () => {
    expect(tileRadius(0)).toBe(0);
    expect(tileRadius(25)).toBe(128);
    expect(tileRadius(50)).toBe(256);
  });

  it('clamps out-of-range and non-finite input', () => {
    expect(tileRadius(-10)).toBe(0);
    expect(tileRadius(80)).toBe(256);
    expect(tileRadius(Number.NaN)).toBe(0);
  });
});

describe('iconBox', () => {
  it('centres the box with per-side padding', () => {
    const b = iconBox(12);
    expect(b.x).toBeCloseTo(61.44, 10);
    expect(b.y).toBeCloseTo(61.44, 10);
    expect(b.size).toBeCloseTo(389.12, 10);
    expect(b.x * 2 + b.size).toBeCloseTo(CANVAS, 10);
  });

  it('is the full canvas at 0 and clamps padding to 0..30', () => {
    expect(iconBox(0)).toEqual({ x: 0, y: 0, size: 512 });
    expect(iconBox(-5)).toEqual({ x: 0, y: 0, size: 512 });
    expect(iconBox(99)).toEqual(iconBox(30));
  });
});

describe('badgeGeometry', () => {
  for (const size of ['small', 'medium'] as const) {
    for (const radiusPct of [0, 25, 50]) {
      const tile = { ...TILE, radiusPct };
      const g = Object.fromEntries(
        CORNERS.map((corner) => [corner, badgeGeometry({ ...BADGE, size, corner }, tile)])
      ) as Record<Corner, ReturnType<typeof badgeGeometry>>;

      it(`${size} @ radius ${radiusPct}%: mirror-symmetric across corners`, () => {
        expect(g['top-left'].cx).toBeCloseTo(CANVAS - g['top-right'].cx, 10);
        expect(g['bottom-left'].cx).toBeCloseTo(CANVAS - g['bottom-right'].cx, 10);
        expect(g['top-left'].cy).toBeCloseTo(CANVAS - g['bottom-left'].cy, 10);
        expect(g['top-right'].cy).toBeCloseTo(CANVAS - g['bottom-right'].cy, 10);
        // On the diagonal.
        for (const c of CORNERS) {
          expect(Math.abs(g[c].cx - 256)).toBeCloseTo(Math.abs(g[c].cy - 256), 10);
        }
        expect(g['bottom-right'].cx).toBeGreaterThan(256);
        expect(g['bottom-right'].cy).toBeGreaterThan(256);
        expect(g['top-left'].cx).toBeLessThan(256);
        expect(g['top-left'].cy).toBeLessThan(256);
      });

      it(`${size} @ radius ${radiusPct}%: icon box is 0.6·D centred on the disc`, () => {
        for (const c of CORNERS) {
          const { cx, cy, r, iconBox: b } = g[c];
          expect(b.size).toBeCloseTo(0.6 * 2 * r, 10);
          expect(b.x + b.size / 2).toBeCloseTo(cx, 10);
          expect(b.y + b.size / 2).toBeCloseTo(cy, 10);
        }
      });
    }
  }

  it('uses the planned disc diameter and ring width', () => {
    const s = badgeGeometry({ ...BADGE, size: 'small' }, TILE);
    const m = badgeGeometry({ ...BADGE, size: 'medium' }, TILE);
    expect(s.r * 2).toBeCloseTo(0.32 * 512, 10);
    expect(m.r * 2).toBeCloseTo(0.4 * 512, 10);
    expect(s.ringWidth).toBeCloseTo(0.06 * 0.32 * 512, 10);
    expect(m.ringWidth).toBeCloseTo(0.06 * 0.4 * 512, 10);
  });

  it('square tile: disc (with ring) stays within the canvas, 20 units from the edge', () => {
    for (const size of ['small', 'medium'] as const) {
      for (const corner of CORNERS) {
        const g = badgeGeometry({ ...BADGE, size, corner }, { ...TILE, radiusPct: 0 });
        const reach = g.r + g.ringWidth / 2;
        expect(g.cx - reach).toBeGreaterThanOrEqual(0);
        expect(g.cy - reach).toBeGreaterThanOrEqual(0);
        expect(g.cx + reach).toBeLessThanOrEqual(512);
        expect(g.cy + reach).toBeLessThanOrEqual(512);
        expect(Math.min(g.cx - g.r, g.cy - g.r, 512 - g.cx - g.r, 512 - g.cy - g.r)).toBeCloseTo(20, 10);
      }
    }
  });

  it('circle tile: disc (with ring) stays within the inscribed circle', () => {
    for (const size of ['small', 'medium'] as const) {
      for (const corner of CORNERS) {
        const g = badgeGeometry({ ...BADGE, size, corner }, { ...TILE, radiusPct: 50 });
        const dist = Math.hypot(g.cx - 256, g.cy - 256);
        expect(dist + g.r + g.ringWidth / 2).toBeLessThanOrEqual(256);
      }
    }
  });
});

describe('contentHalfExtent / maskableScale', () => {
  it('is 0 / scale 1 for an empty composition', () => {
    const empty = layers({ mainSvg: null, badge: null });
    expect(contentHalfExtent(empty, true)).toBe(0);
    expect(maskableScale(empty)).toBe(1);
  });

  it('main icon only: half the icon box', () => {
    expect(contentHalfExtent(layers({ badge: null }), true)).toBeCloseTo(389.12 / 2, 10);
  });

  it('badge widens the extent only when included', () => {
    const l = layers({ tile: { ...TILE, radiusPct: 0, paddingPct: 30 } });
    const without = contentHalfExtent(l, false);
    const withBadge = contentHalfExtent(l, true);
    const g = badgeGeometry(BADGE, l.tile);
    expect(without).toBeCloseTo(iconBox(30).size / 2, 10);
    expect(withBadge).toBeCloseTo(Math.abs(g.cx - 256) + g.r + g.ringWidth / 2, 10);
    expect(withBadge).toBeGreaterThan(without);
  });

  it('never enlarges and fits the scaled content square in the 40% safe circle', () => {
    for (const radiusPct of [0, 25, 50]) {
      for (const paddingPct of [0, 12, 30]) {
        for (const badge of [null, { svg: BADGE_SVG, spec: BADGE }, { svg: BADGE_SVG, spec: { ...BADGE, size: 'medium' as const } }]) {
          const l = layers({ tile: { ...TILE, radiusPct, paddingPct }, badge });
          const k = maskableScale(l);
          expect(k).toBeGreaterThan(0);
          expect(k).toBeLessThanOrEqual(1);
          expect(contentHalfExtent(l, true) * k * Math.SQRT2).toBeLessThanOrEqual(204.8 + 1e-9);
        }
      }
    }
  });

  it('respects includeBadge', () => {
    const l = layers({ tile: { ...TILE, radiusPct: 0, paddingPct: 30 } });
    expect(maskableScale(l, false)).toBeGreaterThan(maskableScale(l, true));
  });
});

describe('relativeLuminance / autoDiscColor', () => {
  it('matches WCAG endpoints and accepts short hex', () => {
    expect(relativeLuminance('#000000')).toBe(0);
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 10);
    expect(relativeLuminance('#fff')).toBeCloseTo(1, 10);
    expect(relativeLuminance('FFFFFF')).toBeCloseTo(1, 10);
    expect(relativeLuminance('not a colour')).toBe(0);
  });

  it('white disc on dark tiles, #111827 on light tiles', () => {
    expect(autoDiscColor('#4f46e5')).toBe('#ffffff');
    expect(autoDiscColor('#000000')).toBe('#ffffff');
    expect(autoDiscColor('#ffffff')).toBe('#111827');
    expect(autoDiscColor('#facc15')).toBe('#111827');
  });
});

describe('placeSvg', () => {
  const box = { x: 61.44, y: 61.44, size: 389.12 };

  it('returns markup unchanged without a root <svg>', () => {
    expect(placeSvg('<div></div>', box)).toBe('<div></div>');
    expect(placeSvg('', box)).toBe('');
  });

  it('does not confuse stroke-width with width', () => {
    const out = placeSvg('<svg width="24" height="24" stroke-width="2" viewBox="0 0 24 24"><path/></svg>', box);
    expect(rootTag(out)).toBe('<svg x="61.44" y="61.44" width="389.12" height="389.12" stroke-width="2" viewBox="0 0 24 24">');
    expect(out.endsWith('<path/></svg>')).toBe(true);
  });

  const renderer = new IconRenderer();
  const cases: Array<{ lib: LibraryKey; component: unknown }> = [
    { lib: 'lucide', component: Home },
    { lib: 'tabler', component: IconHome },
    { lib: 'heroicons', component: HomeIcon },
    { lib: 'heroicons-solid', component: HomeIconSolid },
    { lib: 'phosphor', component: House },
    { lib: 'phosphor-fill', component: House },
    { lib: 'bootstrap', component: HouseFill },
    { lib: 'radix', component: RadixHomeIcon },
  ];

  for (const { lib, component } of cases) {
    it(`${lib}: real render keeps viewBox and attrs, swaps size for placement`, () => {
      for (const sw of [2, 4]) {
        const svg = renderer.iconToSvgString(makeIcon(lib, component), 512, '#123456', sw);
        const before = rootTag(svg);
        const out = placeSvg(svg, box);
        const after = rootTag(out);

        expect(attr(after, 'viewBox')).toBe(attr(before, 'viewBox'));
        expect(attr(after, 'x')).toBe('61.44');
        expect(attr(after, 'y')).toBe('61.44');
        expect(attr(after, 'width')).toBe('389.12');
        expect(attr(after, 'height')).toBe('389.12');
        expect(after.match(/\swidth=/g)).toHaveLength(1);
        expect(after.match(/\sheight=/g)).toHaveLength(1);
        expect(after).not.toContain('"512"');
        // Every other root attribute survives verbatim.
        for (const a of ['fill', 'stroke', 'color', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'class']) {
          expect(attr(after, a)).toBe(attr(before, a));
        }
        // Body untouched.
        expect(out.slice(after.length)).toBe(svg.slice(before.length));
      }
    });
  }

  it('heroicons keeps color + currentColor so the icon is tinted', () => {
    for (const component of [HomeIcon, HomeIconSolid]) {
      const lib: LibraryKey = component === HomeIcon ? 'heroicons' : 'heroicons-solid';
      const out = placeSvg(renderer.iconToSvgString(makeIcon(lib, component), 512, '#123456', 2), box);
      expect(rootTag(out)).toContain('color="#123456"');
      expect(out).toContain('currentColor');
    }
  });
});

describe('composeFaviconSvg', () => {
  const countTags = (svg: string, tag: string) => (svg.match(new RegExp(`<${tag}\\b`, 'g')) ?? []).length;

  it('root has the 512 viewBox and the requested width/height', () => {
    const out = composeFaviconSvg(layers(), { width: 32 });
    const root = rootTag(out);
    expect(attr(root, 'viewBox')).toBe('0 0 512 512');
    expect(attr(root, 'width')).toBe('32');
    expect(attr(root, 'height')).toBe('32');
    expect(attr(root, 'xmlns')).toBe('http://www.w3.org/2000/svg');
    expect(out.endsWith('</svg>')).toBe(true);
  });

  it('standard: rounded tile, then main, then disc, then badge', () => {
    const out = composeFaviconSvg(layers(), { width: 512 });
    expect(out).toContain('<rect width="512" height="512" rx="128" ry="128" fill="#4f46e5"/>');
    const iTile = out.indexOf('<rect');
    const iMain = out.indexOf('<svg x="61.44"');
    const iDisc = out.indexOf('<circle');
    const iBadge = out.indexOf('<svg x=', iDisc);
    expect(iTile).toBeGreaterThan(0);
    expect(iMain).toBeGreaterThan(iTile);
    expect(iDisc).toBeGreaterThan(iMain);
    expect(iBadge).toBeGreaterThan(iDisc);
    expect(countTags(out, 'rect')).toBe(1);
    // Auto disc on an indigo tile is white with a tile-coloured ring.
    expect(out).toMatch(/<circle [^>]*fill="#ffffff" stroke="#4f46e5"/);
  });

  it('explicit disc colour overrides auto', () => {
    const out = composeFaviconSvg(layers({ badge: { svg: BADGE_SVG, spec: { ...BADGE, discColor: '#ff0000' } } }), { width: 64 });
    expect(out).toMatch(/<circle [^>]*fill="#ff0000"/);
  });

  it('includeBadge:false omits disc and badge icon', () => {
    const out = composeFaviconSvg(layers(), { width: 16, includeBadge: false });
    expect(out).not.toContain('<circle');
    expect(countTags(out, 'svg')).toBe(2); // root + main
  });

  it('opaque: full-bleed rect first, then the rounded tile', () => {
    const out = composeFaviconSvg(layers(), { width: 180, variant: 'opaque' });
    const afterRoot = out.slice(rootTag(out).length);
    expect(afterRoot.startsWith('<rect width="512" height="512" fill="#4f46e5"/>')).toBe(true);
    expect(countTags(out, 'rect')).toBe(2);
    expect(out).toContain('rx="128"');
  });

  it('maskable: full-bleed rect + scale() group, no rounded tile', () => {
    const l = layers({ tile: { ...TILE, paddingPct: 0 } });
    const out = composeFaviconSvg(l, { width: 512, variant: 'maskable' });
    const afterRoot = out.slice(rootTag(out).length);
    expect(afterRoot.startsWith('<rect width="512" height="512" fill="#4f46e5"/><g transform=')).toBe(true);
    expect(countTags(out, 'rect')).toBe(1);
    expect(out).not.toContain(' rx=');
    const k = Number(out.match(/scale\(([^)]+)\)/)?.[1]);
    expect(k).toBeCloseTo(maskableScale(l), 3);
    expect(k).toBeLessThan(1);
    expect(out).toContain('translate(256 256)');
    expect(out.endsWith('</g></svg>')).toBe(true);
    // Everything drawn lives inside the group.
    const g = out.indexOf('<g ');
    expect(out.indexOf('<svg x=')).toBeGreaterThan(g);
    expect(out.indexOf('<circle')).toBeGreaterThan(g);
  });

  it('mainSvg null and no badge renders the tile only', () => {
    const out = composeFaviconSvg(layers({ mainSvg: null, badge: null }), { width: 48 });
    expect(out).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 512 512">' +
        '<rect width="512" height="512" rx="128" ry="128" fill="#4f46e5"/></svg>'
    );
  });

  it('circle tile emits rx 256', () => {
    const out = composeFaviconSvg(layers({ tile: { ...TILE, radiusPct: 50 } }), { width: 32 });
    expect(out).toContain('rx="256" ry="256"');
  });

  it('escapes attribute-breaking characters in colours', () => {
    const out = composeFaviconSvg(layers({ tile: { ...TILE, color: '"><script>' }, mainSvg: null, badge: null }), { width: 32 });
    expect(out).not.toContain('<script>');
    expect(out).toContain('fill="&quot;&gt;&lt;script&gt;"');
  });

  it('real renders: one root, nested icons only, no ids', () => {
    const renderer = new IconRenderer();
    const main = renderer.iconToSvgString(makeIcon('heroicons', HomeIcon), 512, '#ffffff', 2);
    const badge = renderer.iconToSvgString(makeIcon('phosphor-fill', House), 512, '#ffffff', 2);
    for (const variant of ['standard', 'opaque', 'maskable'] as const) {
      const out = composeFaviconSvg({ tile: TILE, mainSvg: main, badge: { svg: badge, spec: BADGE } }, { width: 512, variant });
      expect(out.startsWith('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">')).toBe(true);
      expect(countTags(out, 'svg')).toBe(3);
      expect(out.match(/<\/svg>/g)).toHaveLength(3);
      expect(out).not.toMatch(/\sid=/);
      // Root closes last: nothing after the final </svg>.
      expect(out.lastIndexOf('</svg>')).toBe(out.length - '</svg>'.length);
    }
  });
});

describe('svgToDataUrl', () => {
  it('percent-encodes the markup and round-trips', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect fill="#fff"/></svg>';
    const url = svgToDataUrl(svg);
    expect(url.startsWith('data:image/svg+xml,')).toBe(true);
    expect(url).not.toContain('#');
    expect(url).not.toContain('<');
    expect(decodeURIComponent(url.slice('data:image/svg+xml,'.length))).toBe(svg);
  });
});
