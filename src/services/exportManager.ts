import { Icon } from '../types';
import { hexToColorName } from '../utils/colors';

export class ExportManager {
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

    URL.revokeObjectURL(url);
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

    URL.revokeObjectURL(url);
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
