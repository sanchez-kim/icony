import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useIconContext } from '../context/IconContext';
import { useTheme } from '../context/ThemeContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Header } from '../components/Header';
import { MainLayout } from '../components/Layout/MainLayout';
import toast from 'react-hot-toast';

export function AppPage() {
  const [searchParams] = useSearchParams();
  const { downloadPng, downloadSvg, copyToClipboard, selectedIcon, toggleFavorite, icons, selectIcon, setColor, setSize } = useIconContext();
  const { toggleTheme } = useTheme();

  // Load state from URL parameters
  useEffect(() => {
    const iconId = searchParams.get('icon');
    const colorParam = searchParams.get('color');
    const sizeParam = searchParams.get('size');

    if (iconId) {
      const icon = icons.find((i) => i.id === iconId);
      if (icon) {
        selectIcon(icon);
      }
    }

    if (colorParam) {
      setColor(`#${colorParam}`);
    }

    if (sizeParam) {
      const size = parseInt(sizeParam, 10);
      if (size >= 16 && size <= 512) {
        setSize(size);
      }
    }
  }, [searchParams, icons, selectIcon, setColor, setSize]);

  useKeyboardShortcuts([
    {
      key: 'd',
      ctrl: true,
      action: downloadPng,
      description: 'Download PNG',
    },
    {
      key: 's',
      ctrl: true,
      action: downloadSvg,
      description: 'Download SVG',
    },
    {
      key: 'c',
      ctrl: true,
      action: copyToClipboard,
      description: 'Copy to clipboard',
    },
    {
      key: 'd',
      action: toggleTheme,
      description: 'Toggle dark mode',
    },
    {
      key: 'f',
      action: () => {
        if (selectedIcon) {
          toggleFavorite(selectedIcon.id);
        } else {
          toast.error('Select an icon first');
        }
      },
      description: 'Toggle favorite',
    },
    {
      key: '?',
      shift: true,
      action: () => {
        toast(
          <div className="text-sm">
            <div className="font-bold mb-2">Keyboard Shortcuts</div>
            <div className="space-y-1 text-xs">
              <div><kbd>Ctrl+D</kbd> Download PNG</div>
              <div><kbd>Ctrl+S</kbd> Download SVG</div>
              <div><kbd>Ctrl+C</kbd> Copy to clipboard</div>
              <div><kbd>D</kbd> Toggle dark mode</div>
              <div><kbd>F</kbd> Toggle favorite</div>
            </div>
          </div>,
          { duration: 5000 }
        );
      },
      description: 'Show shortcuts',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header />
      <MainLayout />
    </div>
  );
}
