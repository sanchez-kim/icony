/**
 * Favicon bundle export.
 *
 * Split in two so the decisions are unit-testable without a DOM:
 * - planFaviconBundle (pure): which files, which raster sizes/variants, which
 *   ones carry the badge, and the exact SVG each raster is drawn from.
 * - buildFaviconBundle (browser): rasterises the plan through the renderer,
 *   packs the ICO, and zips everything with a dynamically imported JSZip.
 */

import {
  composeFaviconSvg,
  type CompositionLayers,
  type Variant,
} from '../utils/favicon/compose';
import { encodeIco } from '../utils/favicon/ico';
import { buildHeadSnippet, buildWebManifest, BUNDLE_FILES } from '../utils/favicon/manifest';

export interface FaviconBundleMeta {
  appName: string;
  shortName: string;
}

export interface FaviconBundleInput {
  layers: CompositionLayers;
  /** Drop the badge from the 16px ICO entry (it turns to mush at that size). */
  hideBadgeAt16: boolean;
  meta: FaviconBundleMeta;
}

/** Anything that can rasterise SVG markup to a PNG Blob (IconRenderer in the app). */
export interface SvgRasterizer {
  svgStringToPng(svg: string, size: number): Promise<Blob>;
}

/** One PNG to rasterise: either a standalone file or an entry of favicon.ico. */
export interface RasterJob {
  size: number;
  variant: Variant;
  includeBadge: boolean;
  /** Composed SVG whose root width/height equal `size`. */
  svg: string;
  target: { kind: 'file'; name: string } | { kind: 'ico' };
}

export interface FaviconBundlePlan {
  rasters: RasterJob[];
  /** Text files written as-is (favicon.svg, site.webmanifest, head-snippet.html). */
  texts: { name: string; content: string }[];
}

export const ICO_SIZES = [16, 32, 48] as const;

interface RasterSpec {
  size: number;
  variant: Variant;
  includeBadge: boolean;
  target: RasterJob['target'];
}

function rasterSpecs(hideBadgeAt16: boolean): RasterSpec[] {
  return [
    ...ICO_SIZES.map((size) => ({
      size,
      variant: 'standard' as const,
      includeBadge: !(size === 16 && hideBadgeAt16),
      target: { kind: 'ico' as const },
    })),
    { size: 180, variant: 'opaque', includeBadge: true, target: { kind: 'file', name: 'apple-touch-icon.png' } },
    { size: 192, variant: 'standard', includeBadge: true, target: { kind: 'file', name: 'icon-192.png' } },
    { size: 512, variant: 'standard', includeBadge: true, target: { kind: 'file', name: 'icon-512.png' } },
    { size: 512, variant: 'maskable', includeBadge: true, target: { kind: 'file', name: 'icon-maskable-512.png' } },
  ];
}

/** Pure: everything the bundle will contain, decided up front. */
export function planFaviconBundle(input: FaviconBundleInput): FaviconBundlePlan {
  const { layers, hideBadgeAt16, meta } = input;

  const rasters: RasterJob[] = rasterSpecs(hideBadgeAt16).map((s) => ({
    ...s,
    svg: composeFaviconSvg(layers, { width: s.size, variant: s.variant, includeBadge: s.includeBadge }),
  }));

  const name = meta.appName.trim() || 'My App';
  const shortName = meta.shortName.trim() || name;

  const texts = [
    {
      name: 'favicon.svg',
      content: composeFaviconSvg(layers, { width: 512, variant: 'standard', includeBadge: true }),
    },
    {
      name: 'site.webmanifest',
      content: buildWebManifest({
        name,
        shortName,
        themeColor: layers.tile.color,
        backgroundColor: layers.tile.color,
      }),
    },
    { name: 'head-snippet.html', content: buildHeadSnippet() + '\n' },
  ];

  return { rasters, texts };
}

/** Names of every file the plan produces, in BUNDLE_FILES order. */
export function planFileNames(plan: FaviconBundlePlan): string[] {
  const names = new Set<string>();
  if (plan.rasters.some((r) => r.target.kind === 'ico')) names.add('favicon.ico');
  for (const r of plan.rasters) if (r.target.kind === 'file') names.add(r.target.name);
  for (const t of plan.texts) names.add(t.name);
  return BUNDLE_FILES.filter((f) => names.has(f));
}

/** `favicon-<icon-name>.zip`, slugged; falls back to `favicon.zip`. */
export function bundleFilename(iconName: string | null | undefined): string {
  const slug = (iconName ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug ? `favicon-${slug}.zip` : 'favicon.zip';
}

/** Browser: rasterise the plan and return the ZIP. */
export async function buildFaviconBundle(
  input: FaviconBundleInput,
  renderer: SvgRasterizer
): Promise<Blob> {
  const plan = planFaviconBundle(input);

  const pngs = await Promise.all(
    plan.rasters.map(async (job) => {
      const blob = await renderer.svgStringToPng(job.svg, job.size);
      return { job, bytes: new Uint8Array(await blob.arrayBuffer()) };
    })
  );

  const files = new Map<string, string | Uint8Array>();
  const icoEntries = pngs
    .filter(({ job }) => job.target.kind === 'ico')
    .map(({ job, bytes }) => ({ size: job.size, png: bytes }));
  files.set('favicon.ico', encodeIco(icoEntries));
  for (const { job, bytes } of pngs) {
    if (job.target.kind === 'file') files.set(job.target.name, bytes);
  }
  for (const t of plan.texts) files.set(t.name, t.content);

  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  for (const name of BUNDLE_FILES) {
    const content = files.get(name);
    if (content !== undefined) zip.file(name, content);
  }
  return zip.generateAsync({ type: 'blob', mimeType: 'application/zip' });
}
