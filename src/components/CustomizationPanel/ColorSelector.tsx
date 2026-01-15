import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ChevronDown, ChevronUp, Pipette } from 'lucide-react';
import { useIconContext } from '../../context/IconContext';
import { SwatchPicker } from './SwatchPicker';
import { PaletteSaver } from './PaletteSaver';

export function ColorSelector() {
  const { color, setColor } = useIconContext();
  const [showPicker, setShowPicker] = useState(false);
  const [eyeDropperSupported, setEyeDropperSupported] = useState(
    typeof window !== 'undefined' && 'EyeDropper' in window
  );

  const handleEyeDropper = async () => {
    if (!eyeDropperSupported) {
      alert('EyeDropper API is not supported in this browser. Please use Chrome, Edge, or Opera.');
      return;
    }

    try {
      // @ts-ignore - EyeDropper API is not yet in TypeScript types
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      setColor(result.sRGBHex);
    } catch (err) {
      // User cancelled or error occurred
      console.log('EyeDropper cancelled or error:', err);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        Color
      </label>

      <SwatchPicker selectedColor={color} onColorSelect={setColor} />

      <PaletteSaver currentColor={color} onColorSelect={setColor} />

      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors focus:outline-none focus:underline"
      >
        {showPicker ? (
          <>
            <ChevronUp size={16} /> Hide Custom Picker
          </>
        ) : (
          <>
            <ChevronDown size={16} /> Show Custom Picker
          </>
        )}
      </button>

      {showPicker && (
        <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm">
          <HexColorPicker color={color} onChange={setColor} />
          <div className="mt-4 flex items-center gap-2">
            <div
              className="w-11 h-11 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex-shrink-0 shadow-sm"
              style={{ backgroundColor: color }}
              aria-label="Current color"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              placeholder="#000000"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
            <button
              onClick={handleEyeDropper}
              className="px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={!eyeDropperSupported}
              title={eyeDropperSupported ? "Pick color from screen" : "EyeDropper not supported in this browser"}
            >
              <Pipette size={16} className="text-white" />
              <span className="text-sm font-medium text-white">Pick</span>
            </button>
          </div>
          {!eyeDropperSupported && (
            <p className="mt-2 text-xs text-gray-500">
              Screen color picker is available in Chrome, Edge, and Opera browsers
            </p>
          )}
        </div>
      )}
    </div>
  );
}
