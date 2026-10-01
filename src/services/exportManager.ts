import { Icon } from '../types';
import { hexToColorName } from '../utils/colors';

export class ExportManager {
  /**
   * Trigger a browser download for any Blob (used by ZIP/batch export).
   */
  download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /**
   * Download PNG file
   */
  downloadPng(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /**
   * Download SVG file
   */
  downloadSvg(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /**
   * Generate filename with metadata
   */
  generateFilename(icon: Icon, color: string, size: number, format: 'png' | 'svg' = 'png'): string {
    const colorName = hexToColorName(color) || 'custom';
    const iconName = icon.name.toLowerCase().replace(/\s+/g, '-');
    const timestamp = Date.now();

    return `${iconName}-${colorName}-${size}px-${timestamp}.${format}`;
  }
}
