import { renderToString } from 'react-dom/server';
import { LucideIcon } from 'lucide-react';
import { createElement } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { Icon, IconType } from '../types';

export class IconRenderer {
  /**
   * Convert icon to SVG Blob
   */
  async iconToSvg(
    iconData: Icon,
    size: number,
    color: string,
    strokeWeight: number = 2
  ): Promise<Blob> {
    let svgString: string;

    if (iconData.type === 'lucide') {
      // Render Lucide icon to SVG string
      svgString = renderToString(
        createElement(iconData.component as LucideIcon, {
          size,
          color,
          strokeWidth: strokeWeight,
        })
      );
    } else if (iconData.type === 'tabler') {
      // Render Tabler icon to SVG string
      svgString = renderToString(
        createElement(iconData.component as React.ComponentType<any>, {
          size,
          color,
          stroke: strokeWeight,
        })
      );
    } else if (iconData.type === 'phosphor') {
      // Render Phosphor icon to SVG string
      const weight = strokeWeight > 2 ? 'bold' : strokeWeight > 1.5 ? 'regular' : 'light';
      svgString = renderToString(
        createElement(iconData.component as React.ComponentType<any>, {
          size,
          color,
          weight,
        })
      );
    } else {
      // Generate FontAwesome SVG
      const abstractIcon = icon(iconData.component as IconDefinition);
      const svgElement = abstractIcon.abstract[0] as any;
      svgString = this.buildFontAwesomeSVG(svgElement, size, color);
    }

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
      return this.lucideIconToPng(iconData.component as LucideIcon, size, color, strokeWeight);
    } else if (iconData.type === 'tabler') {
      return this.tablerIconToPng(iconData.component as React.ComponentType<any>, size, color, strokeWeight);
    } else if (iconData.type === 'phosphor') {
      return this.phosphorIconToPng(iconData.component as React.ComponentType<any>, size, color, strokeWeight);
    } else {
      return this.fontAwesomeIconToPng(iconData.component as IconDefinition, size, color);
    }
  }

  /**
   * Convert Lucide React icon component to PNG Blob
   */
  private async lucideIconToPng(
    IconComponent: LucideIcon,
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
    strokeWeight: number = 2
  ): Promise<Blob> {
    // Map strokeWeight to Phosphor weight values
    const weight = strokeWeight > 2 ? 'bold' : strokeWeight > 1.5 ? 'regular' : 'light';

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
   * Convert FontAwesome icon to PNG Blob
   */
  private async fontAwesomeIconToPng(
    iconDefinition: IconDefinition,
    size: number,
    color: string
  ): Promise<Blob> {
    // Generate FontAwesome SVG
    const abstractIcon = icon(iconDefinition);
    const svgElement = abstractIcon.abstract[0] as any;

    // Build SVG string with custom color and size
    const svgString = this.buildFontAwesomeSVG(svgElement, size, color);

    // Create SVG Blob
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });

    // Convert to PNG via Canvas
    return this.svgBlobToPng(svgBlob, size);
  }

  /**
   * Build FontAwesome SVG string with custom attributes
   */
  private buildFontAwesomeSVG(element: any, size: number, color: string): string {
    const { tag, attributes, children } = element;

    // Build attributes string
    let attrs = '';
    if (attributes) {
      Object.keys(attributes).forEach((key) => {
        if (key === 'fill') {
          attrs += ` fill="${color}"`;
        } else if (key === 'viewBox') {
          attrs += ` viewBox="${attributes[key]}"`;
        } else {
          attrs += ` ${key}="${attributes[key]}"`;
        }
      });
    }

    // Add size and xmlns
    attrs += ` width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"`;

    // Build children recursively
    let childrenStr = '';
    if (children && children.length > 0) {
      children.forEach((child: any) => {
        if (typeof child === 'string') {
          childrenStr += child;
        } else {
          childrenStr += this.buildFontAwesomeSVG(child, size, color);
        }
      });
    }

    return `<${tag}${attrs}>${childrenStr}</${tag}>`;
  }

  /**
   * Convert SVG Blob to PNG Blob using Canvas API
   */
  private async svgBlobToPng(svgBlob: Blob, size: number, strokeWeight: number = 2): Promise<Blob> {
    // Add padding to prevent clipping - more padding for thicker strokes
    const padding = Math.max(20, strokeWeight * 4);
    const canvasSize = size + padding * 2;

    // Create canvas with padding
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

    // Draw to canvas with padding (centered)
    ctx.drawImage(img, padding, padding, size, size);
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
