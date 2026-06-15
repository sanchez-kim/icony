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
   * Copy a plain-text string (e.g. SVG markup or JSX) to the clipboard.
   */
  async copyText(text: string): Promise<void> {
    if (!navigator.clipboard?.writeText) {
      throw new Error('Clipboard API not supported in this browser');
    }

    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      if (error instanceof Error && error.name === 'NotAllowedError') {
        throw new Error('Clipboard permission denied');
      }
      throw error;
    }
  }

  /**
   * Copy a PNG image to the clipboard.
   *
   * Accepts a Blob *or a Promise<Blob>*. Safari only keeps the clipboard write
   * authorised when `navigator.clipboard.write` is reached synchronously within
   * the user gesture — so the caller must pass the un-awaited rasterisation
   * promise and let ClipboardItem resolve it, rather than `await`-ing the Blob
   * first (which would drop the gesture and throw NotAllowedError in Safari).
   */
  async copyImage(blob: Blob | Promise<Blob>): Promise<void> {
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
