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
    color: string
  ): Promise<Blob> {
    let svgString: string;

    if (iconData.type === 'lucide') {
      // Render Lucide icon to SVG string
      svgString = renderToString(
        createElement(iconData.component as LucideIcon, {
          size,
          color,
          strokeWidth: 2,
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
    color: string
  ): Promise<Blob> {
    if (iconData.type === 'lucide') {
      return this.lucideIconToPng(iconData.component as LucideIcon, size, color);
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
    color: string
  ): Promise<Blob> {
    // 1. Render React component to SVG string
    const svgString = renderToString(
      createElement(IconComponent, {
        size,
        color,
        strokeWidth: 2,
      })
    );

    // 2. Create SVG Blob
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });

    // 3. Convert to PNG via Canvas
    return this.svgBlobToPng(svgBlob, size);
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
  private async svgBlobToPng(svgBlob: Blob, size: number): Promise<Blob> {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Load SVG as image
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load SVG'));
      img.src = url;
    });

    // Draw to canvas
    ctx.drawImage(img, 0, 0, size, size);
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
