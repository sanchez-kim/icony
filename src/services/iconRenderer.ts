import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { Icon } from '../types';

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

export class IconRenderer {
  /**
   * Render an icon to an SVG markup string with color/size/stroke applied.
   * Shared by SVG export, PNG rasterisation, and copy-as-code.
   */
  iconToSvgString(
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
   * Convert icon to PNG Blob
   */
  async iconToPng(
    iconData: Icon,
    size: number,
    color: string,
    strokeWeight: number = 2
  ): Promise<Blob> {
    if (iconData.type === 'lucide') {
      return this.lucideIconToPng(iconData.component, size, color, strokeWeight);
    } else if (iconData.type === 'tabler') {
      return this.tablerIconToPng(iconData.component, size, color, strokeWeight);
    } else if (iconData.type === 'phosphor' || iconData.type === 'phosphor-fill') {
      return this.phosphorIconToPng(
        iconData.component,
        size,
        color,
        strokeWeight,
        iconData.type === 'phosphor-fill'
      );
    } else {
      // heroicons, bootstrap, radix — generic renderer
      return this.genericIconToPng(iconData.component, size, color, strokeWeight);
    }
  }

  /**
   * Convert Lucide React icon component to PNG Blob
   */
  private async lucideIconToPng(
    IconComponent: React.ComponentType<any>,
    size: number,
    color: string,
    strokeWeight: number = 2
  ): Promise<Blob> {
    // 1. Render React component to SVG string
    const svgString = renderToString(
      createElement(IconComponent, {
        size,
        color,
        strokeWidth: strokeWeight,
      })
    );

    // 2. Create SVG Blob
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });

    // 3. Convert to PNG via Canvas
    return this.svgBlobToPng(svgBlob, size, strokeWeight);
  }

  /**
   * Convert Tabler React icon component to PNG Blob
   */
  private async tablerIconToPng(
    IconComponent: React.ComponentType<any>,
    size: number,
    color: string,
    strokeWeight: number = 2
  ): Promise<Blob> {
    // 1. Render React component to SVG string
    const svgString = renderToString(
      createElement(IconComponent, {
        size,
        color,
        stroke: strokeWeight,
      })
    );

    // 2. Create SVG Blob
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });

    // 3. Convert to PNG via Canvas
    return this.svgBlobToPng(svgBlob, size, strokeWeight);
  }

  /**
   * Convert Phosphor React icon component to PNG Blob
   */
  private async phosphorIconToPng(
    IconComponent: React.ComponentType<any>,
    size: number,
    color: string,
    strokeWeight: number = 2,
    isFill: boolean = false
  ): Promise<Blob> {
    // Map strokeWeight to Phosphor weight values. phosphor-fill reuses the
    // same components as phosphor — weight must be forced to 'fill' here or
    // it falls back to Phosphor's default (outline) weight.
    const weight = isFill ? 'fill' : phosphorWeightForStroke(strokeWeight);

    // 1. Render React component to SVG string
    const svgString = renderToString(
      createElement(IconComponent, {
        size,
        color,
        weight,
      })
    );

    // 2. Create SVG Blob
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });

    // 3. Convert to PNG via Canvas
    return this.svgBlobToPng(svgBlob, size, strokeWeight);
  }

  /**
   * Generic PNG renderer for heroicons, bootstrap, radix and future libraries.
   * strokeWidth overrides Heroicons outline's fixed 1.5 stroke, matching the
   * SVG export path; it's an inert no-op for fill-based libraries.
   */
  private async genericIconToPng(
    IconComponent: React.ComponentType<any>,
    size: number,
    color: string,
    strokeWeight: number = 2,
  ): Promise<Blob> {
    const svgString = renderToString(
      createElement(IconComponent, {
        width: size,
        height: size,
        color,
        strokeWidth: strokeWeight,
      })
    );

    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });

    return this.svgBlobToPng(svgBlob, size, strokeWeight);
  }

  /**
   * Convert SVG Blob to PNG Blob using Canvas API
   */
  private async svgBlobToPng(svgBlob: Blob, size: number, strokeWeight: number = 2): Promise<Blob> {
    // Shrink the glyph inward (rather than inflating the canvas) so the
    // exported PNG is exactly `size` pixels — matching the SVG export and
    // the size the user selected — while still leaving room for thick
    // strokes to avoid clipping at the edges.
    const paddingPercent = 0.15; // 15% inset on each side
    const strokePadding = strokeWeight * 6;
    const padding = Math.max(size * paddingPercent, strokePadding);
    const canvasSize = size;
    const glyphSize = Math.max(size - padding * 2, 1);
    const offset = (canvasSize - glyphSize) / 2;

    // Create canvas at the exact export size
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Fill with transparent background
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Load SVG as image
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load SVG'));
      img.src = url;
    });

    // Draw to canvas, inset and centered
    ctx.drawImage(img, offset, offset, glyphSize, glyphSize);
    URL.revokeObjectURL(url);

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
