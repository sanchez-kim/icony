import { useIconContext } from '../../context/IconContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/cn';

const SIZES = [32, 64, 128, 256];

export function SizeSelector() {
  const { size, setSize } = useIconContext();
  const { t } = useLanguage();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 16 && value <= 512) {
      setSize(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t.ui.size}</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="16"
            max="512"
            value={size}
            onChange={handleInputChange}
            className="w-20 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-center font-medium"
          />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">px</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={cn(
              'px-2 py-2 rounded-lg border-2 font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              size === s
                ? 'border-primary-600 bg-primary-600 text-white shadow-lg'
                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-400 dark:hover:border-primary-600 text-gray-700 dark:text-gray-300 hover:shadow-md'
            )}
            aria-label={`Select ${s} pixels size`}
            aria-pressed={size === s}
          >
            {s}px
          </button>
        ))}
      </div>
    </div>
  );
}
