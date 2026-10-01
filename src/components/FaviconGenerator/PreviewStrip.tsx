'use client';

import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/cn';

export interface PreviewUrls {
  /** data: URLs of composed SVGs whose root width/height equal the size. */
  s16: string;
  s32: string;
  s180: string;
  s512: string;
}

interface PreviewStripProps {
  previews: PreviewUrls;
  appName: string;
}

/** One preview tile: the image at its true pixel size (or scaled for big ones). */
function Sample({ src, display, label }: { src: string; display: number; label: string }) {
  return (
    <figure className="flex flex-col items-center gap-2">
      <div
        className="flex items-center justify-center rounded-lg bg-[conic-gradient(#e5e7eb_25%,#fff_0_50%,#e5e7eb_0_75%,#fff_0)] dark:bg-[conic-gradient(#1f2937_25%,#111827_0_50%,#1f2937_0_75%,#111827_0)] bg-[length:12px_12px] p-2"
        style={{ minWidth: display + 16, minHeight: display + 16 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- data: URL preview, next/image adds nothing */}
        <img src={src} width={display} height={display} alt={`${label}×${label}`} draggable={false} />
      </div>
      <figcaption className="text-xs font-mono text-gray-500 dark:text-gray-400">{label}</figcaption>
    </figure>
  );
}

function TabMock({ src, title, dark, label }: { src: string; title: string; dark: boolean; label: string }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <div className={cn('rounded-t-lg pt-2 px-2', dark ? 'bg-[#202124]' : 'bg-[#dee1e6]')} aria-hidden>
        <div
          className={cn(
            'flex items-center gap-2 w-56 max-w-full h-8 px-3 rounded-t-lg text-xs',
            dark ? 'bg-[#35363a] text-gray-200' : 'bg-white text-gray-800'
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={16} height={16} alt="" draggable={false} className="flex-shrink-0" />
          <span className="truncate flex-1">{title}</span>
          <X size={12} className="flex-shrink-0 opacity-60" />
        </div>
      </div>
      <div className={cn('h-3 rounded-b-lg', dark ? 'bg-[#35363a]' : 'bg-white border-x border-b border-gray-200')} aria-hidden />
    </div>
  );
}

export function PreviewStrip({ previews, appName }: PreviewStripProps) {
  const { t } = useLanguage();
  const fg = t.faviconGenerator;
  const title = appName.trim() || 'My App';

  return (
    <section aria-label={fg.preview} className="space-y-5">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white">{fg.preview}</h2>

      <div className="flex flex-wrap items-end gap-4">
        <Sample src={previews.s16} display={16} label="16" />
        <Sample src={previews.s32} display={32} label="32" />
        <Sample src={previews.s180} display={90} label="180" />
        <Sample src={previews.s512} display={128} label="512" />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{fg.browserTab}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TabMock src={previews.s16} title={title} dark={false} label={fg.light} />
          <TabMock src={previews.s16} title={title} dark label={fg.dark} />
        </div>
      </div>
    </section>
  );
}
