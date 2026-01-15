import { Download, Copy, Loader2, Share2 } from 'lucide-react';
import { useIconContext } from '../../context/IconContext';
import toast from 'react-hot-toast';

export function ExportButtons() {
  const { downloadPng, downloadSvg, copyToClipboard, isExporting, selectedIcon, color, size } = useIconContext();

  const handleShare = () => {
    if (!selectedIcon) {
      toast.error('Please select an icon first');
      return;
    }

    const params = new URLSearchParams({
      icon: selectedIcon.id,
      color: color.replace('#', ''),
      size: size.toString(),
    });

    const url = `${window.location.origin}/app?${params.toString()}`;

    navigator.clipboard.writeText(url).then(() => {
      toast.success('Share link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={downloadPng}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Download PNG"
        >
          {isExporting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <Download size={18} />
              <span>PNG</span>
            </>
          )}
        </button>

        <button
          onClick={downloadSvg}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="Download SVG"
        >
          {isExporting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <Download size={18} />
              <span>SVG</span>
            </>
          )}
        </button>
      </div>

      <button
        onClick={copyToClipboard}
        disabled={isExporting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-label="Copy to clipboard"
      >
        {isExporting ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            <Copy size={18} />
            <span>Copy to Clipboard</span>
          </>
        )}
      </button>

      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Share link"
      >
        <Share2 size={18} />
        <span>Share Link</span>
      </button>
    </div>
  );
}
