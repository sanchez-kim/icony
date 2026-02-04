import { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { StorageManager } from '../../utils/storage';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

interface PaletteSaverProps {
  currentColor: string;
  onColorSelect: (color: string) => void;
}

export function PaletteSaver({ currentColor, onColorSelect }: PaletteSaverProps) {
  const { t } = useLanguage();
  const [palettes, setPalettes] = useState(StorageManager.getPalettes());
  const [paletteName, setPaletteName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  const recentColors = StorageManager.getRecentColors();

  const handleSavePalette = () => {
    if (!paletteName.trim()) {
      toast.error(t.toast.enterPaletteName);
      return;
    }

    if (recentColors.length === 0) {
      toast.error(t.toast.noColorsToSave);
      return;
    }

    StorageManager.savePalette(paletteName.trim(), recentColors);
    setPalettes(StorageManager.getPalettes());
    setPaletteName('');
    setShowSaveInput(false);
    toast.success(t.toast.paletteSaved);
  };

  const handleDeletePalette = (name: string) => {
    StorageManager.deletePalette(name);
    setPalettes(StorageManager.getPalettes());
    toast.success(t.toast.paletteDeleted);
  };

  if (palettes.length === 0 && !showSaveInput) {
    return (
      <button
        onClick={() => setShowSaveInput(true)}
        className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
      >
        <Save size={14} />
        <span>{t.ui.saveRecentColors}</span>
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {showSaveInput && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={paletteName}
            onChange={(e) => setPaletteName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSavePalette()}
            placeholder={t.ui.paletteName}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={handleSavePalette}
            className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            {t.ui.save}
          </button>
          <button
            onClick={() => {
              setShowSaveInput(false);
              setPaletteName('');
            }}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            {t.ui.cancel}
          </button>
        </div>
      )}

      {!showSaveInput && (
        <button
          onClick={() => setShowSaveInput(true)}
          className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
        >
          <Save size={14} />
          <span>{t.ui.saveRecentColors}</span>
        </button>
      )}

      {palettes.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400">
            {t.ui.savedPalettes}
          </label>
          {palettes.map((palette) => (
            <div
              key={palette.name}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {palette.name}
                </span>
                <button
                  onClick={() => handleDeletePalette(palette.name)}
                  className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  aria-label={t.ui.delete}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex gap-1.5">
                {palette.colors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => onColorSelect(c)}
                    className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform shadow-sm"
                    style={{ backgroundColor: c }}
                    aria-label={`Select color ${c}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
