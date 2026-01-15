import { ImageIcon } from 'lucide-react';
import { useIconContext } from '../../context/IconContext';
import { IconPreview } from './IconPreview';
import { ColorSelector } from './ColorSelector';
import { SizeSelector } from './SizeSelector';
import { ExportButtons } from './ExportButtons';

export function CustomizationPanel() {
  const { selectedIcon } = useIconContext();

  if (!selectedIcon) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-16 flex items-center justify-center min-h-[600px] transition-colors">
        <div className="text-center text-gray-400 dark:text-gray-600">
          <ImageIcon className="w-20 h-20 mx-auto mb-6 opacity-50" />
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">Select an icon to customize</p>
          <p className="text-sm mt-2 text-gray-500 dark:text-gray-500">
            Choose from 2,000+ icons in the gallery
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-10 space-y-8 transition-colors">
      <IconPreview />
      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <ColorSelector />
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <SizeSelector />
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <ExportButtons />
      </div>
    </div>
  );
}
