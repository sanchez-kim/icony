'use client';

import { Download, Copy, Loader2, Share2, Code2, Braces } from 'lucide-react';
import { useIconContext } from '../../context/IconContext';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

export function ExportButtons() {
  const { downloadPng, downloadSvg, copyToClipboard, copySvgCode, copyJsxCode, isExporting, selectedIcon, color, size } = useIconContext();
  const { t, language } = useLanguage();
  const ko = language === 'ko';
  const sectionLabel = 'text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500';

  const handleShare = () => {
    if (!selectedIcon) {
      toast.error(t.toast.selectIconFirst);
      return;
    }

    const params = new URLSearchParams({
      icon: selectedIcon.id,
      color: color.replace('#', ''),
      size: size.toString(),
    });

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/app?${params.toString()}`;

    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      toast.error('Failed to copy link');
      return;
    }

    navigator.clipboard.writeText(url).then(() => {
      toast.success(t.toast.linkCopied);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return (
    <div className="space-y-4">
      <p className={sectionLabel}>{ko ? '파일로 다운로드' : 'Download file'}</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={downloadPng}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label={t.ui.downloadPNG}
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
          aria-label={t.ui.downloadSVG}
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

      <p className={sectionLabel}>{ko ? '클립보드로 복사' : 'Copy to clipboard'}</p>
      <button
        onClick={copyToClipboard}
        disabled={isExporting}
        title={ko ? 'PNG 이미지를 클립보드에 복사합니다 (문서·채팅에 붙여넣기)' : 'Copies a PNG image to your clipboard (paste into docs / chat)'}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-label={`${t.ui.copyClipboard} — ${ko ? 'PNG 이미지' : 'PNG image'}`}
      >
        {isExporting ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            <Copy size={18} />
            <span>{t.ui.copyClipboard}</span>
            <span className="text-green-200 font-normal">· {ko ? '이미지' : 'image'}</span>
          </>
        )}
      </button>

      {/* Copy as code — for developers */}
      <p className={sectionLabel}>{ko ? '코드로 복사 (개발자용)' : 'Copy as code (for developers)'}</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={copySvgCode}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          aria-label={t.ui.copySVG}
        >
          <Code2 size={18} />
          <span>{t.ui.copySVG}</span>
        </button>

        <button
          onClick={copyJsxCode}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          aria-label={t.ui.copyJSX}
        >
          <Braces size={18} />
          <span>{t.ui.copyJSX}</span>
        </button>
      </div>

      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={t.ui.share}
      >
        <Share2 size={18} />
        <span>{t.ui.share}</span>
      </button>
    </div>
  );
}
