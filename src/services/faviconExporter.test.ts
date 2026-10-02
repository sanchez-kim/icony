import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import {
  buildFaviconBundle,
  bundleFilename,
  planFaviconBundle,
  planFileNames,
  type FaviconBundleInput,
  type SvgRasterizer,
} from './faviconExporter';
import { BUNDLE_FILES } from '../utils/favicon/manifest';
import type { CompositionLayers } from '../utils/favicon/compose';

const MAIN = '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>';
const BADGE = '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 16 16"><path d="M8 0l8 16H0z"/></svg>';

function layers(withBadge: boolean): CompositionLayers {
  return {
    tile: { color: '#4f46e5', radiusPct: 25, paddingPct: 12 },
    mainSvg: MAIN,
    badge: withBadge
      ? { svg: BADGE, spec: { corner: 'bottom-right', size: 'small', color: '#ffffff', discColor: 'auto' } }
      : null,
  };
}

function input(over: Partial<FaviconBundleInput> = {}): FaviconBundleInput {
  return { layers: layers(true), hideBadgeAt16: true, meta: { appName: 'My App', shortName: 'App' }, ...over };
}

const icoJobs = (p: ReturnType<typeof planFaviconBundle>) => p.rasters.filter((r) => r.target.kind === 'ico');
const fileJob = (p: ReturnType<typeof planFaviconBundle>, name: string) =>
  p.rasters.find((r) => r.target.kind === 'file' && r.target.name === name)!;

describe('planFaviconBundle', () => {
  it('produces exactly BUNDLE_FILES', () => {
    expect(planFileNames(planFaviconBundle(input()))).toEqual([...BUNDLE_FILES]);
  });

  it('ICO has 16/32/48 standard entries; 16 drops the badge when hideBadgeAt16', () => {
    const ico = icoJobs(planFaviconBundle(input()));
    expect(ico.map((j) => j.size)).toEqual([16, 32, 48]);
    expect(ico.every((j) => j.variant === 'standard')).toBe(true);
    expect(ico.map((j) => j.includeBadge)).toEqual([false, true, true]);
    expect(ico[0].svg).not.toContain('<circle');
    expect(ico[1].svg).toContain('<circle');
  });

  it('16 keeps the badge when hideBadgeAt16 is off', () => {
    const ico = icoJobs(planFaviconBundle(input({ hideBadgeAt16: false })));
    expect(ico[0].includeBadge).toBe(true);
    expect(ico[0].svg).toContain('<circle');
  });

  it('no badge layer → no disc anywhere', () => {
    const plan = planFaviconBundle(input({ layers: layers(false) }));
    for (const r of plan.rasters) expect(r.svg).not.toContain('<circle');
  });

  it('larger targets carry the badge and use the right variants and sizes', () => {
    const plan = planFaviconBundle(input());
    const apple = fileJob(plan, 'apple-touch-icon.png');
    expect([apple.size, apple.variant, apple.includeBadge]).toEqual([180, 'opaque', true]);
    expect(fileJob(plan, 'icon-192.png')).toMatchObject({ size: 192, variant: 'standard', includeBadge: true });
    expect(fileJob(plan, 'icon-512.png')).toMatchObject({ size: 512, variant: 'standard', includeBadge: true });
    const mask = fileJob(plan, 'icon-maskable-512.png');
    expect(mask).toMatchObject({ size: 512, variant: 'maskable', includeBadge: true });
    expect(mask.svg).toContain('scale(');
  });

  it('each raster SVG declares its own pixel size', () => {
    for (const r of planFaviconBundle(input()).rasters) {
      expect(r.svg).toMatch(new RegExp(`^<svg[^>]*width="${r.size}" height="${r.size}"`));
    }
  });

  it('manifest uses the meta names and tile colour; blank names fall back', () => {
    const m = (i: FaviconBundleInput) =>
      JSON.parse(planFaviconBundle(i).texts.find((t) => t.name === 'site.webmanifest')!.content);
    expect(m(input())).toMatchObject({ name: 'My App', short_name: 'App', theme_color: '#4f46e5' });
    expect(m(input({ meta: { appName: 'Acme', shortName: '  ' } }))).toMatchObject({ name: 'Acme', short_name: 'Acme' });
    expect(m(input({ meta: { appName: '', shortName: '' } })).name).toBe('My App');
  });
});

describe('bundleFilename', () => {
  it('slugs the icon name', () => {
    expect(bundleFilename('Calendar Star')).toBe('favicon-calendar-star.zip');
    expect(bundleFilename('  ')).toBe('favicon.zip');
    expect(bundleFilename(null)).toBe('favicon.zip');
  });
});

describe('buildFaviconBundle', () => {
  it('zips BUNDLE_FILES with a 3-entry ICO built from the rasterised PNGs', async () => {
    const calls: { svg: string; size: number }[] = [];
    const fake: SvgRasterizer = {
      async svgStringToPng(svg, size) {
        calls.push({ svg, size });
        return new Blob([new Uint8Array([0x89, 0x50, 0x4e, 0x47, size & 0xff])]);
      },
    };
    const blob = await buildFaviconBundle(input(), fake);
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    expect(Object.keys(zip.files).sort()).toEqual([...BUNDLE_FILES].sort());
    expect(calls.map((c) => c.size)).toEqual([16, 32, 48, 180, 192, 512, 512]);

    const ico = await zip.file('favicon.ico')!.async('uint8array');
    expect(Array.from(ico.slice(0, 6))).toEqual([0, 0, 1, 0, 3, 0]);
    expect([ico[6], ico[22], ico[38]]).toEqual([16, 32, 48]);

    const png = await zip.file('apple-touch-icon.png')!.async('uint8array');
    expect(png[4]).toBe(180);
  });
});
