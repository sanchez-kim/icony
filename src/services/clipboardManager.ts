export class ClipboardManager {
  /**
   * Check if Clipboard API is supported
   */
  isSupported(): boolean {
    return !!(
      navigator.clipboard &&
      navigator.clipboard.write &&
      typeof ClipboardItem !== 'undefined'
    );
  }

  /**
   * Copy image Blob to clipboard
   */
  async copyImage(blob: Blob): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Clipboard API not supported in this browser');
    }

    try {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
    } catch (error) {
      if (error instanceof Error && error.name === 'NotAllowedError') {
        throw new Error('Clipboard permission denied');
      }
      throw error;
    }
  }
}
