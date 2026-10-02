export interface IcoEntry {
  /** Pixel size (square). 256 is written as 0 per the ICO spec. */
  size: number;
  /** PNG-encoded image data. */
  png: Uint8Array;
}

const HEADER_BYTES = 6;
const DIR_ENTRY_BYTES = 16;

/** Encode PNG images into a PNG-in-ICO container (browser-safe, no Buffer). */
export function encodeIco(entries: IcoEntry[]): Uint8Array {
  const dataBytes = entries.reduce((sum, e) => sum + e.png.length, 0);
  const out = new Uint8Array(HEADER_BYTES + DIR_ENTRY_BYTES * entries.length + dataBytes);
  const view = new DataView(out.buffer);

  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: 1 = icon
  view.setUint16(4, entries.length, true);

  let offset = HEADER_BYTES + DIR_ENTRY_BYTES * entries.length;
  entries.forEach((e, i) => {
    const p = HEADER_BYTES + DIR_ENTRY_BYTES * i;
    view.setUint8(p, e.size % 256); // width (0 means 256)
    view.setUint8(p + 1, e.size % 256); // height (0 means 256)
    view.setUint8(p + 2, 0); // palette colours
    view.setUint8(p + 3, 0); // reserved
    view.setUint16(p + 4, 1, true); // colour planes
    view.setUint16(p + 6, 32, true); // bits per pixel
    view.setUint32(p + 8, e.png.length, true);
    view.setUint32(p + 12, offset, true);
    out.set(e.png, offset);
    offset += e.png.length;
  });

  return out;
}
