import { describe, it, expect } from 'vitest';
import { encodeIco } from './ico';

const SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const fakePng = (size: number, len: number) => {
  const b = new Uint8Array(len);
  b.set(SIG);
  b[8] = size;
  return b;
};

describe('encodeIco', () => {
  const entries = [
    { size: 16, png: fakePng(16, 40) },
    { size: 32, png: fakePng(32, 70) },
    { size: 256, png: fakePng(255, 100) },
  ];
  const out = encodeIco(entries);
  const v = new DataView(out.buffer);

  it('writes the ICONDIR header', () => {
    expect(Array.from(out.slice(0, 6))).toEqual([0, 0, 1, 0, 3, 0]);
  });

  it('writes directory entries with size, bpp 32 and lengths', () => {
    expect([out[6], out[22], out[38]]).toEqual([16, 32, 0]);
    expect([out[7], out[23], out[39]]).toEqual([16, 32, 0]);
    for (let i = 0; i < 3; i++) {
      const p = 6 + 16 * i;
      expect(v.getUint16(p + 4, true)).toBe(1);
      expect(v.getUint16(p + 6, true)).toBe(32);
      expect(v.getUint32(p + 8, true)).toBe(entries[i].png.length);
    }
  });

  it('uses contiguous offsets starting after the directory', () => {
    let expected = 6 + 16 * 3;
    for (let i = 0; i < 3; i++) {
      expect(v.getUint32(6 + 16 * i + 12, true)).toBe(expected);
      expected += entries[i].png.length;
    }
    expect(out.length).toBe(expected);
  });

  it('places PNG data (signature) at each offset', () => {
    for (let i = 0; i < 3; i++) {
      const off = v.getUint32(6 + 16 * i + 12, true);
      expect(Array.from(out.slice(off, off + 8))).toEqual(SIG);
      expect(Array.from(out.slice(off, off + entries[i].png.length))).toEqual(Array.from(entries[i].png));
    }
  });
});
