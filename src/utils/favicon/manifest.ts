export interface ManifestOptions {
  name: string;
  shortName: string;
  themeColor: string;
  backgroundColor: string;
}

/** Every file written into the favicon bundle, in the order they appear in the ZIP. */
export const BUNDLE_FILES: readonly string[] = [
  'favicon.ico',
  'favicon.svg',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'site.webmanifest',
  'head-snippet.html',
];

export function buildWebManifest(o: ManifestOptions): string {
  const manifest = {
    name: o.name,
    short_name: o.shortName,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    theme_color: o.themeColor,
    background_color: o.backgroundColor,
    display: 'standalone',
  };
  return JSON.stringify(manifest, null, 2);
}

export function buildHeadSnippet(): string {
  return [
    '<link rel="icon" href="/favicon.ico" sizes="32x32" />',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml" />',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png" />',
    '<link rel="manifest" href="/site.webmanifest" />',
  ].join('\n');
}
