import { describe, it, expect } from 'vitest';
import { buildWebManifest, buildHeadSnippet, BUNDLE_FILES } from './manifest';

const opts = { name: 'My App', shortName: 'App', themeColor: '#4f46e5', backgroundColor: '#ffffff' };

describe('buildWebManifest', () => {
  const m = JSON.parse(buildWebManifest(opts));

  it('parses and carries the options', () => {
    expect(m.name).toBe('My App');
    expect(m.short_name).toBe('App');
    expect(m.theme_color).toBe('#4f46e5');
    expect(m.background_color).toBe('#ffffff');
  });

  it('has 3 icons with the third maskable', () => {
    expect(m.icons).toHaveLength(3);
    expect(m.icons[2].purpose).toBe('maskable');
    expect(m.icons[0].sizes).toBe('192x192');
    expect(m.icons[1].sizes).toBe('512x512');
  });

  it('icon srcs match BUNDLE_FILES', () => {
    for (const icon of m.icons) {
      expect(BUNDLE_FILES).toContain(String(icon.src).replace(/^\//, ''));
    }
  });

  it('uses 2-space indentation', () => {
    expect(buildWebManifest(opts)).toContain('\n  "name"');
  });
});

describe('buildHeadSnippet', () => {
  const s = buildHeadSnippet();
  it('contains the expected links', () => {
    expect(s.match(/rel="icon"/g)).toHaveLength(2);
    expect(s).toContain('rel="apple-touch-icon"');
    expect(s).toContain('rel="manifest" href="/site.webmanifest"');
    expect(s).toContain('sizes="32x32"');
  });
});

describe('BUNDLE_FILES', () => {
  it('lists the manifest and snippet', () => {
    expect(BUNDLE_FILES).toContain('site.webmanifest');
    expect(BUNDLE_FILES).toContain('head-snippet.html');
  });
});
