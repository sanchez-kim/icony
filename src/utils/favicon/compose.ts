/**
 * Favicon composition geometry and SVG assembly.
 *
 * Everything is laid out in a fixed 512-unit square (CANVAS) and emitted as a
 * single standalone SVG whose root carries explicit width/height (Firefox's
 * drawImage needs an intrinsic size). Icons are nested as their own <svg>
 * elements (see placeSvg) so each keeps its native viewBox — including the
 * widened viewBox IconRenderer.iconToSvgString produces for thick strokes.
 *
 * Pure module: no DOM, no React.
 */

export const CANVAS = 512;

const HALF = CANVAS / 2;
/** Maskable safe zone: a circle of radius 40% of the canvas (W3C spec). */
const MASKABLE_SAFE_RADIUS = CANVAS * 0.4; // 204.8
/** Gap between the badge disc and the tile edge, in canvas units. */
const BADGE_GAP = 20;
const BADGE_DIAMETER: Record<BadgeSize, number> = { small: 0.32, medium: 0.4 };
const BADGE_RING_RATIO = 0.06;
const BADGE_ICON_RATIO = 0.6;
const SVG_NS = 'http://www.w3.org/2000/svg';

export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type BadgeSize = 'small' | 'medium';

export interface TileSpec {
  color: string;
  /** 0..50; 50 = circle. */
  radiusPct: number;
  /** 0..30, per side. */
  paddingPct: number;
}

export interface BadgeSpec {
  corner: Corner;
  size: BadgeSize;
  color: string;
  discColor: string | 'auto';
}

export interface Box {
  x: number;
  y: number;
  size: number;
}

export interface CompositionLayers {
  tile: TileSpec;
  mainSvg: string | null;
  badge: { svg: string; spec: BadgeSpec } | null;
}

export type Variant = 'standard' | 'opaque' | 'maskable';

export interface ComposeOptions {
  width: number;
  variant?: Variant;
  includeBadge?: boolean;
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

/** Format a coordinate for markup: at most 3 decimals, no "-0". */
function fmt(n: number): string {
  const r = Math.round(n * 1000) / 1000;
  return String(r === 0 ? 0 : r);
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Tile corner radius in canvas units: clamp(radiusPct, 0..50) / 50 × 256. */
export function tileRadius(radiusPct: number): number {
  return (clamp(radiusPct, 0, 50) / 50) * HALF;
}

/** Centred box for the main icon; paddingPct (clamped 0..30) is per side. */
export function iconBox(paddingPct: number): Box {
  const inset = (CANVAS * clamp(paddingPct, 0, 30)) / 100;
  return { x: inset, y: inset, size: CANVAS - 2 * inset };
}

/**
 * Badge disc placement. The centre sits on the corner's diagonal; its per-axis
 * offset from the canvas centre shrinks from (256 − r − gap) on a square tile
 * towards ×0.7071 on a circle so the disc stays inside the rounded silhouette.
 */
export function badgeGeometry(
  spec: BadgeSpec,
  tile: TileSpec
): { cx: number; cy: number; r: number; ringWidth: number; iconBox: Box } {
  const diameter = BADGE_DIAMETER[spec.size] * CANVAS;
  const r = diameter / 2;
  const t = tileRadius(tile.radiusPct) / HALF; // 0 = square, 1 = circle
  const offset = (HALF - r - BADGE_GAP) * (1 + (Math.SQRT1_2 - 1) * t);
  const sx = spec.corner.endsWith('right') ? 1 : -1;
  const sy = spec.corner.startsWith('bottom') ? 1 : -1;
  const cx = HALF + sx * offset;
  const cy = HALF + sy * offset;
  const iconSize = BADGE_ICON_RATIO * diameter;
  return {
    cx,
    cy,
    r,
    ringWidth: BADGE_RING_RATIO * diameter,
    iconBox: { x: cx - iconSize / 2, y: cy - iconSize / 2, size: iconSize },
  };
}

/**
 * Largest per-axis distance from the canvas centre reached by drawn content
 * (main icon box and, when included, the badge disc including its ring).
 * The tile itself is not content. 0 when nothing is drawn.
 */
export function contentHalfExtent(layers: CompositionLayers, includeBadge: boolean): number {
  let h = 0;
  if (layers.mainSvg) {
    h = Math.max(h, iconBox(layers.tile.paddingPct).size / 2);
  }
  if (includeBadge && layers.badge) {
    const g = badgeGeometry(layers.badge.spec, layers.tile);
    const reach = g.r + g.ringWidth / 2;
    h = Math.max(h, Math.abs(g.cx - HALF) + reach, Math.abs(g.cy - HALF) + reach);
  }
  return h;
}

/**
 * Scale applied about the centre so the content square (half-extent h, corner
 * distance h·√2) fits the maskable safe circle of radius 204.8. Never enlarges.
 * includeBadge defaults to true (the exported maskable icon carries the badge).
 */
export function maskableScale(layers: CompositionLayers, includeBadge: boolean = true): number {
  const h = contentHalfExtent(layers, includeBadge);
  if (!(h > 0)) return 1;
  return Math.min(1, MASKABLE_SAFE_RADIUS / (h * Math.SQRT2));
}

function parseHex(hex: string): [number, number, number] | null {
  const m = hex.trim().match(/^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length <= 4) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

/** WCAG 2 relative luminance of a #rgb/#rrggbb colour (alpha ignored). Unparseable → 0. */
export function relativeLuminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const DARK_DISC = '#111827';
const LIGHT_DISC = '#ffffff';

/** Disc colour with the higher WCAG contrast against the tile: white on dark tiles, #111827 on light. */
export function autoDiscColor(tileColor: string): string {
  const l = relativeLuminance(tileColor);
  const contrastWhite = 1.05 / (l + 0.05);
  const contrastDark = (l + 0.05) / (relativeLuminance(DARK_DISC) + 0.05);
  return contrastWhite >= contrastDark ? LIGHT_DISC : DARK_DISC;
}

const ROOT_SVG_RE = /^\s*(?:<\?xml[^>]*\?>\s*)?<svg\b([^>]*)>/;
const POSITION_ATTR_RE = /\s(?:width|height|x|y)\s*=\s*(?:"[^"]*"|'[^']*')/g;

/**
 * Re-root an icon's <svg> into `box` of the composition: drops its own
 * width/height (and any x/y), sets x/y/width/height, and keeps the viewBox and
 * every other attribute (e.g. heroicons' color + stroke="currentColor").
 * Returns the input unchanged when it has no root <svg>.
 */
export function placeSvg(svg: string, box: Box): string {
  const m = svg.match(ROOT_SVG_RE);
  if (!m) return svg;
  const attrs = m[1].replace(POSITION_ATTR_RE, '');
  const placed =
    `<svg x="${fmt(box.x)}" y="${fmt(box.y)}" width="${fmt(box.size)}" height="${fmt(box.size)}"` +
    `${attrs}>`;
  return placed + svg.slice(m[0].length);
}

/**
 * Assemble the favicon SVG. Emit order: root svg → [opaque/maskable: full-bleed
 * tile-colour rect] → [maskable: scale group] → rounded tile rect (standard and
 * opaque only) → main icon → badge disc → badge icon.
 */
export function composeFaviconSvg(layers: CompositionLayers, opts: ComposeOptions): string {
  const variant = opts.variant ?? 'standard';
  const includeBadge = opts.includeBadge ?? true;
  const { tile } = layers;
  const tileFill = escapeAttr(tile.color);
  const parts: string[] = [
    `<svg xmlns="${SVG_NS}" width="${fmt(opts.width)}" height="${fmt(opts.width)}" viewBox="0 0 ${CANVAS} ${CANVAS}">`,
  ];

  if (variant !== 'standard') {
    parts.push(`<rect width="${CANVAS}" height="${CANVAS}" fill="${tileFill}"/>`);
  }
  if (variant === 'maskable') {
    const k = maskableScale(layers, includeBadge);
    parts.push(`<g transform="translate(${HALF} ${HALF}) scale(${fmt(k)}) translate(-${HALF} -${HALF})">`);
  } else {
    const rx = fmt(tileRadius(tile.radiusPct));
    parts.push(`<rect width="${CANVAS}" height="${CANVAS}" rx="${rx}" ry="${rx}" fill="${tileFill}"/>`);
  }

  if (layers.mainSvg) {
    parts.push(placeSvg(layers.mainSvg, iconBox(tile.paddingPct)));
  }

  if (includeBadge && layers.badge) {
    const { spec, svg } = layers.badge;
    const g = badgeGeometry(spec, tile);
    const disc = spec.discColor === 'auto' ? autoDiscColor(tile.color) : spec.discColor;
    parts.push(
      `<circle cx="${fmt(g.cx)}" cy="${fmt(g.cy)}" r="${fmt(g.r)}" fill="${escapeAttr(disc)}" ` +
        `stroke="${tileFill}" stroke-width="${fmt(g.ringWidth)}"/>`
    );
    if (svg) parts.push(placeSvg(svg, g.iconBox));
  }

  if (variant === 'maskable') parts.push('</g>');
  parts.push('</svg>');
  return parts.join('');
}

/** data: URL for an SVG string (percent-encoded, safe for <img src>). */
export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
