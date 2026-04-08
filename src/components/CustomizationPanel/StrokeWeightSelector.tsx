'use client';

import { useIconContext } from '../../context/IconContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/cn';

const STROKE_WEIGHTS = [1, 1.5, 2, 2.5, 3];
const STROKE_SUPPORTED_LIBS = ['lucide', 'tabler', 'phosphor'];
const NO_STROKE_LIBS_MSG: Record<string, { en: string; ko: string }> = {
  'phosphor-fill':   { en: 'Filled variant — stroke weight does not apply.', ko: '채워진 아이콘 — 선 두께가 적용되지 않습니다.' },
  'heroicons-solid': { en: 'Solid variant — stroke weight does not apply.', ko: '솔리드 아이콘 — 선 두께가 적용되지 않습니다.' },
};

export function StrokeWeightSelector() {
  const { strokeWeight, setStrokeWeight, selectedIcon } = useIconContext();
  const { language } = useLanguage();

  if (!selectedIcon) return null;

  const supportsStroke = STROKE_SUPPORTED_LIBS.includes(selectedIcon.type as string);

  if (!supportsStroke) {
    const customMsg = NO_STROKE_LIBS_MSG[selectedIcon.type as string];
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-400 dark:text-gray-600">
          {language === 'ko' ? '선 두께' : 'Stroke Weight'}
        </label>
        <p className="text-xs text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          {customMsg
            ? (language === 'ko' ? customMsg.ko : customMsg.en)
            : (language === 'ko'
                ? '이 아이콘은 선 두께를 지원하지 않습니다.\n(Lucide, Tabler, Phosphor만 지원)'
                : 'This icon does not support stroke weight.\n(Lucide, Tabler, Phosphor only)')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {language === 'ko' ? '선 두께' : 'Stroke Weight'}
        </label>
        <input
          type="number"
          min="0.5"
          max="4"
          step="0.1"
          value={strokeWeight}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 0.5 && value <= 4) setStrokeWeight(value);
          }}
          className="w-20 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-center font-medium"
        />
      </div>

      <div className="space-y-3">
        <input
          type="range"
          min="0.5"
          max="4"
          step="0.1"
          value={strokeWeight}
          onChange={(e) => setStrokeWeight(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
          aria-label="Stroke weight slider"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
          <span>{language === 'ko' ? '얇게' : 'Thin'}</span>
          <span>{language === 'ko' ? '두껍게' : 'Bold'}</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {STROKE_WEIGHTS.map((weight) => (
          <button
            key={weight}
            onClick={() => setStrokeWeight(weight)}
            className={cn(
              'py-2 rounded-lg border-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-xs whitespace-nowrap overflow-hidden',
              strokeWeight === weight
                ? 'border-primary-600 bg-primary-600 text-white shadow-lg'
                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-400 dark:hover:border-primary-600 text-gray-700 dark:text-gray-300 hover:shadow-md'
            )}
            aria-label={`Select ${weight} stroke weight`}
            aria-pressed={strokeWeight === weight}
          >
            {weight}
          </button>
        ))}
      </div>
    </div>
  );
}
