import { useIconContext } from '../../context/IconContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/cn';

const STROKE_WEIGHTS = [1, 1.5, 2, 2.5, 3];

export function StrokeWeightSelector() {
  const { strokeWeight, setStrokeWeight, selectedIcon } = useIconContext();
  const { t } = useLanguage();

  // Only show for stroke-based icons (Lucide, Tabler, Phosphor)
  if (!selectedIcon || selectedIcon.type === 'fontawesome') {
    return null;
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeWeight(Number(e.target.value));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t.language === 'ko' ? '선 두께' : 'Stroke Weight'}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0.5"
            max="4"
            step="0.1"
            value={strokeWeight}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 0.5 && value <= 4) {
                setStrokeWeight(value);
              }
            }}
            className="w-20 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-center font-medium"
          />
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="range"
          min="0.5"
          max="4"
          step="0.1"
          value={strokeWeight}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
          aria-label="Stroke weight slider"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
          <span>{t.language === 'ko' ? '얇게' : 'Thin'}</span>
          <span>{t.language === 'ko' ? '두껍게' : 'Bold'}</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {STROKE_WEIGHTS.map((weight) => (
          <button
            key={weight}
            onClick={() => setStrokeWeight(weight)}
            className={cn(
              'px-3 py-2 rounded-lg border-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm',
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

      <p className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
        💡 {t.language === 'ko'
          ? 'Stroke weight는 Lucide, Tabler, Phosphor 아이콘에서 사용할 수 있습니다. Font Awesome 아이콘은 선 두께 조정을 지원하지 않습니다.'
          : 'Stroke weight is available for Lucide, Tabler, and Phosphor icons. Font Awesome icons do not support stroke customization.'}
      </p>
    </div>
  );
}
