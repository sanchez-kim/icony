import { ImageIcon } from 'lucide-react';
import { useIconContext } from '../../context/IconContext';
import { useLanguage } from '../../context/LanguageContext';
import { IconPreview } from './IconPreview';
import { ColorSelector } from './ColorSelector';
import { SizeSelector } from './SizeSelector';
import { StrokeWeightSelector } from './StrokeWeightSelector';
import { ExportButtons } from './ExportButtons';

export function CustomizationPanel() {
  const { selectedIcon } = useIconContext();
  const { t } = useLanguage();

  if (!selectedIcon) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-16 flex items-center justify-center min-h-[600px] transition-colors">
        <div className="text-center text-gray-400 dark:text-gray-600">
          <ImageIcon className="w-20 h-20 mx-auto mb-6 opacity-50" />
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">{t.ui.selectIcon}</p>
          <p className="text-sm mt-2 text-gray-500 dark:text-gray-500">
            {t.ui.selectIconDesc}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-10 space-y-6 transition-colors">
      {/* Icon Preview */}
      <IconPreview />

      {/* Controls Grid - 3 columns */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ColorSelector />
          <SizeSelector />
          <StrokeWeightSelector />
        </div>
      </div>

      {/* Export Buttons */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <ExportButtons />
      </div>
    </div>
  );
}
