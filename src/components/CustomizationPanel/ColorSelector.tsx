import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ChevronDown, ChevronUp, Pipette } from 'lucide-react';
import { useIconContext } from '../../context/IconContext';
import { useLanguage } from '../../context/LanguageContext';
import { SwatchPicker } from './SwatchPicker';
import { PaletteSaver } from './PaletteSaver';
import toast from 'react-hot-toast';

export function ColorSelector() {
  const { color, setColor } = useIconContext();
  const { t } = useLanguage();
  const [showPicker, setShowPicker] = useState(false);
  const [eyeDropperSupported, setEyeDropperSupported] = useState(false);

  useEffect(() => {
    // Check EyeDropper support on mount
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      setEyeDropperSupported(true);
      console.log('✅ EyeDropper API is supported');
    } else {
      console.log('❌ EyeDropper API is NOT supported');
      console.log('Browser:', navigator.userAgent);
      console.log('Current URL:', window.location.href);
      console.log('Is HTTPS or localhost?', window.location.protocol === 'https:' || window.location.hostname === 'localhost');
      console.log('\n💡 Solution: EyeDropper API requires HTTPS or localhost.');
      console.log('Try accessing via: http://localhost:5173 instead of IP address');
    }
  }, []);

  const handleEyeDropper = async () => {
    if (!eyeDropperSupported) {
      toast.error(t.toast.eyeDropperNotSupported);
      return;
    }

    try {
      // @ts-ignore - EyeDropper API is not yet in TypeScript types
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      setColor(result.sRGBHex);
      toast.success(t.toast.colorPicked);
    } catch (err: any) {
      // User cancelled or error occurred
      if (err.name !== 'AbortError') {
        console.error('EyeDropper error:', err);
        toast.error(t.toast.failedToPickColor);
      }
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {t.ui.color}
      </label>

      <SwatchPicker selectedColor={color} onColorSelect={setColor} />

      <PaletteSaver currentColor={color} onColorSelect={setColor} />

      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors focus:outline-none focus:underline"
      >
        {showPicker ? (
          <>
            <ChevronUp size={16} /> {t.ui.hideCustomPicker}
          </>
        ) : (
          <>
            <ChevronDown size={16} /> {t.ui.showCustomPicker}
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
              aria-label={t.ui.currentColor}
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
              className="w-11 h-11 bg-primary-600 text-white rounded-lg hover:bg-primary-700 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
              disabled={!eyeDropperSupported}
              title={t.ui.pick}
              aria-label={t.ui.pick}
            >
              <Pipette size={18} className="text-white" />
            </button>
          </div>
          {!eyeDropperSupported && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-200 font-semibold mb-1">
                {t.eyeDropper.notAvailable}
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                {t.eyeDropper.requirements}
              </p>
              <ul className="mt-1 text-xs text-yellow-700 dark:text-yellow-300 list-disc list-inside space-y-0.5">
                <li>{t.eyeDropper.browser}</li>
                <li>{t.eyeDropper.https}</li>
              </ul>
              <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                💡 {t.eyeDropper.tryLocalhost} <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">http://localhost:5173</code>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
