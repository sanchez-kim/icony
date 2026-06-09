/**
 * svgCode.ts — turns a rendered SVG markup string into copy-ready code.
 *
 * Source SVG comes from IconRenderer.iconToSvgString() (react-dom/server output),
 * so it is a single-line, valid SVG with the user's color/size/stroke already
 * baked in. These helpers format it for humans and convert it to a JSX component.
 */

/** Pretty-prints a flat icon SVG: one child element per indented line. */
export function prettifySvg(svg: string): string {
  const match = svg.match(/^(<svg[^>]*>)([\s\S]*)(<\/svg>)$/);
  if (!match) return svg;

  const [, open, inner, close] = match;
  const children = inner
    .replace(/></g, '>\n<')
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => `  ${line}`)
    .join('\n');

  return children ? `${open}\n${children}\n${close}` : `${open}${close}`;
}

/**
 * Converts SVG attribute names to their JSX (camelCase) equivalents.
 * Leaves data-* / aria-* attributes untouched (they stay kebab-case in JSX).
 */
export function svgToJsxAttrs(svg: string): string {
  return svg
    .replace(/ class=/g, ' className=')
    .replace(/ ([a-z]+)-([a-z]+)=/g, (whole, prefix: string, rest: string) => {
      if (prefix === 'data' || prefix === 'aria') return whole;
      return ` ${prefix}${rest.charAt(0).toUpperCase()}${rest.slice(1)}=`;
    });
}

/** Derives a valid PascalCase component name ending in "Icon" from a display name. */
export function iconComponentName(name: string): string {
  const pascal = name
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const safe = /^[A-Za-z]/.test(pascal) ? pascal : `Icon${pascal}`;
  return safe.endsWith('Icon') ? safe : `${safe}Icon`;
}

/** Copy-ready, pretty-printed SVG markup. */
export function buildSvgCode(svg: string): string {
  return prettifySvg(svg);
}

/**
 * Copy-ready React component. Spreads `props` last so consumers can override
 * the baked-in size/color/className at the call site.
 */
export function buildJsxCode(svg: string, name: string): string {
  const pretty = prettifySvg(svg);
  const jsx = svgToJsxAttrs(pretty)
    .replace(/^(<svg\b[^>]*?)>/, '$1 {...props}>')
    .split('\n')
    .map((line) => `      ${line}`)
    .join('\n')
    .trimStart();

  const component = iconComponentName(name);

  return `import * as React from 'react';

export function ${component}(props: React.SVGProps<SVGSVGElement>) {
  return (
    ${jsx}
  );
}
`;
}
