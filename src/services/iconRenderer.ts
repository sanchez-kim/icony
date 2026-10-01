import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { Icon, LibraryKey } from '../types';

/**
 * Maps the 0.5-4 stroke weight slider onto Phosphor's non-fill weights.
 * Phosphor also offers 'duotone', but that's a distinct visual style rather
 * than a point on the thin→bold spectrum, so it's intentionally not mapped.
 */
export function phosphorWeightForStroke(strokeWeight: number): 'thin' | 'light' | 'regular' | 'bold' {
  if (strokeWeight > 2.5) return 'bold';
  if (strokeWeight > 1.75) return 'regular';
  if (strokeWeight > 1) return 'light';
  return 'thin';
}

/**
 * Native stroke width (in viewBox units) of the stroke-based libraries whose
 * stroke the user can change. Each library's artwork is designed to fit its
 * viewBox at this width. Libraries not listed are fill-based (Phosphor's
 * weights are separate filled outlines; Heroicons solid, Bootstrap and Radix
 * are fills), so the stroke slider can't push them past their viewBox.
 */
export const NATIVE_STROKE_WIDTH: Partial<Record<LibraryKey, number>> = {
  lucide: 2,
  tabler: 2,
  heroicons: 1.5,
};

/**
 * How far (viewBox units, per side) a stroke can extend past the viewBox when
 * the user thickens it beyond the library's native width. A stroke straddles
 * its path, so going from native width n to s pushes every outer edge out by
 * (s - n) / 2. Artwork that fits at n therefore fits inside a viewBox widened
 * by that much on each side. Zero for thinner strokes and fill libraries.
 */
export function strokeOverflow(library: LibraryKey, strokeWeight: number): number {
  const native = NATIVE_STROKE_WIDTH[library];
  if (native === undefined || !Number.isFinite(strokeWeight)) return 0;
  return Math.max(0, (strokeWeight - native) / 2);
}

/**
 * Widen the root <svg>'s viewBox by `margin` viewBox units on every side,
 * keeping the rendered width/height. The artwork shrinks by
 * viewBoxSize / (viewBoxSize + 2 * margin) and stays centered. Returns the
 * markup unchanged when margin is 0 or there is no viewBox to widen.
 */
export function expandViewBox(svg: string, margin: number): string {
  if (!(margin > 0)) return svg;
  const rootTag = svg.match(/^<svg\b[^>]*>/)?.[0];
  if (!rootTag) return svg;
  const viewBoxAttr = rootTag.match(/\sviewBox="([^"]*)"/);
  if (!viewBoxAttr) return svg;
  const parts = viewBoxAttr[1].trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return svg;
  const [x, y, w, h] = parts;
  const expanded = [x - margin, y - margin, w + margin * 2, h + margin * 2].join(' ');
  const newRootTag = rootTag.replace(viewBoxAttr[0], ` viewBox="${expanded}"`);
  return newRootTag + svg.slice(rootTag.length);
}

export class IconRenderer {
  /**
   * Render an icon to an SVG markup string with color/size/stroke applied.
   * Single source for SVG download, clipboard copy, ZIP entries, copy-as-code
   * and PNG rasterisation. When the user thickens a stroke past the library's
   * native width the viewBox is widened (see expandViewBox) so the stroke isn't
   * clipped; at native width or below, and for fill libraries, it is untouched.
   */
  iconToSvgString(
    iconData: Icon,
    size: number,
    color: string,
    strokeWeight: number = 2
  ): string {
    return expandViewBox(
      this.renderSvgMarkup(iconData, size, color, strokeWeight),
      strokeOverflow(iconData.type, strokeWeight)
    );
  }

  /** Raw react-dom/server output with the library's own viewBox. */
  private renderSvgMarkup(
    iconData: Icon,
    size: number,
    color: string,
    strokeWeight: number = 2
  ): string {
    if (iconData.type === 'lucide') {
      // Render Lucide icon to SVG string
      return renderToString(
        createElement(iconData.component, {
          size,
          color,
          strokeWidth: strokeWeight,
        })
      );
    } else if (iconData.type === 'tabler') {
      // Render Tabler icon to SVG string
      return renderToString(
        createElement(iconData.component, {
          size,
          color,
          stroke: strokeWeight,
        })
      );
    } else if (iconData.type === 'phosphor' || iconData.type === 'phosphor-fill') {
      // Render Phosphor icon to SVG string. phosphor-fill reuses the same
      // components as phosphor — weight must be forced to 'fill' here or it
      // falls back to Phosphor's default (outline) weight.
      const weight = iconData.type === 'phosphor-fill'
        ? 'fill'
        : phosphorWeightForStroke(strokeWeight);
      return renderToString(
        createElement(iconData.component, {
          size,
          color,
          weight,
        })
      );
    } else {
      // heroicons (outline), heroicons-solid, bootstrap, radix — generic props.
      // strokeWidth overrides Heroicons outline's fixed 1.5 stroke; it's an
      // inert no-op for fill-based libraries (no stroke to apply it to).
      return renderToString(
        createElement(iconData.component, {
          width: size,
          height: size,
          color,
          strokeWidth: strokeWeight,
        })
      );
    }
  }

  /**
   * Convert icon to SVG Blob
   */
  async iconToSvg(
    iconData: Icon,
    size: number,
    color: string,
    strokeWeight: number = 2
  ): Promise<Blob> {
    const svgString = this.iconToSvgString(iconData, size, color, strokeWeight);

    // Create SVG Blob
    return new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });
  }

  /**
   * Convert icon to PNG Blob. Shared by PNG download, clipboard copy and ZIP
   * export. Rasterises the same markup as SVG export (iconToSvgString), whose
   * viewBox is already widened as far as a user-thickened stroke can overflow.
   */
  async iconToPng(
    iconData: Icon,
    size: number,
    color: string,
    strokeWeight: number = 2
  ): Promise<Blob> {
    // iconToSvgString already widens the viewBox; don't expand again here.
    const svgString = this.iconToSvgString(iconData, size, color, strokeWeight);
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });
    return this.svgBlobToPng(svgBlob, size);
  }

  /**
   * Convert SVG Blob to PNG Blob using Canvas API. The SVG is drawn edge to
   * edge: an SVG rasterised as an image is clipped to its own viewport, so any
   * room for overflowing strokes must already be in its viewBox (see
   * expandViewBox, applied in iconToSvgString) — shrinking the image on the canvas cannot recover it.
   */
  private async svgBlobToPng(svgBlob: Blob, size: number): Promise<Blob> {
    // Canvas at the exact export size, matching SVG export and the user's selection
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Fill with transparent background
    ctx.clearRect(0, 0, size, size);

    // Load SVG as image
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load SVG'));
        img.src = url;
      });

      ctx.drawImage(img, 0, 0, size, size);
    } finally {
      URL.revokeObjectURL(url);
    }

    // Export as PNG Blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create PNG blob'));
        }
      }, 'image/png', 1.0);
    });
  }
}
