export const PRESET_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Yellow', hex: '#F59E0B' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Pink', hex: '#EC4899' },
];

export function hexToColorName(hex: string): string | null {
  const color = PRESET_COLORS.find(
    (c) => c.hex.toLowerCase() === hex.toLowerCase()
  );
  return color?.name.toLowerCase() || null;
}
