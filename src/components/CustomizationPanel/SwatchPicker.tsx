import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { PRESET_COLORS } from '../../utils/colors';

interface SwatchPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export function SwatchPicker({
  selectedColor,
  onColorSelect,
}: SwatchPickerProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {PRESET_COLORS.map((color) => {
        const isSelected =
          selectedColor.toLowerCase() === color.hex.toLowerCase();

        return (
          <button
            key={color.hex}
            onClick={() => onColorSelect(color.hex)}
            className={cn(
              'relative w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              isSelected
                ? 'border-primary-500 scale-110 shadow-lg ring-2 ring-primary-500'
                : 'border-gray-300 hover:shadow-md'
            )}
            style={{ backgroundColor: color.hex }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
            aria-pressed={isSelected}
          >
            {isSelected && (
              <Check
                className="absolute inset-0 m-auto text-white"
                style={{
                  filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))',
                }}
                size={22}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
