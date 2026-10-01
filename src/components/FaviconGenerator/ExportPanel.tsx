'use client';

import { useEffect, useId, useState } from 'react';
import { Check, Copy, Download, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ClipboardManager } from '../../services/clipboardManager';
import { ExportManager } from '../../services/exportManager';
import { IconRenderer } from '../../services/iconRenderer';
import {
  buildFaviconBundle,
  bundleFilename,
  type FaviconBundleInput,
  type FaviconBundleMeta,
} from '../../services/faviconExporter';
import { buildHeadSnippet, BUNDLE_FILES } from '../../utils/favicon/manifest';

const renderer = new IconRenderer();
const exporter = new ExportManager();
const clipboard = new ClipboardManager();

type Status = { kind: 'idle' } | { kind: 'copied' } | { kind: 'error'; message: string };

interface ExportPanelProps {
  /** null until a main icon is selected. */
  input: FaviconBundleInput | null;
  iconName: string | null;
  meta: FaviconBundleMeta;
  onMetaChange: (meta: FaviconBundleMeta) => void;
}

export function ExportPanel({ input, iconName, meta, onMetaChange }: ExportPanelProps) {
  const { t } = useLanguage();
  const fg = t.faviconGenerator;
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const snippet = buildHeadSnippet();

  // Clear the "copied" confirmation after a moment, like CodeBlock.
  useEffect(() => {
    if (status.kind !== 'copied') return;
    const timer = setTimeout(() => setStatus({ kind: 'idle' }), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  const handleDownload = async () => {
    if (!input) return;
    setBusy(true);
    setStatus({ kind: 'idle' });
    try {
      const zip = await buildFaviconBundle(input, renderer);
      exporter.download(zip, bundleFilename(iconName));
    } catch (err) {
      console.error('[FaviconGenerator] export failed:', err);
      setStatus({ kind: 'error', message: fg.exportFailed });
    } finally {
      setBusy(false);
    }
  };

  // Safari only honours clipboard writes reached synchronously inside the
  // click handler: copyText calls navigator.clipboard.writeText before its
  // first await, and the snippet is built ahead of time.
  const handleCopy = () => {
    clipboard
      .copyText(snippet)
      .then(() => setStatus({ kind: 'copied' }))
      .catch((err: unknown) => {
        console.error('[FaviconGenerator] clipboard copy failed:', err);
        setStatus({ kind: 'error', message: fg.copyFailed });
      });
  };

  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500';

  return (
    <section aria-label={fg.downloadZip} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor={`${id}-name`} className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            {fg.appName}
          </label>
          <input
            id={`${id}-name`}
            type="text"
            value={meta.appName}
            maxLength={60}
            onChange={(e) => onMetaChange({ ...meta, appName: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`${id}-short`} className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            {fg.shortName}
          </label>
          <input
            id={`${id}-short`}
            type="text"
            value={meta.shortName}
            maxLength={24}
            onChange={(e) => onMetaChange({ ...meta, shortName: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={!input ? undefined : handleDownload}
          disabled={busy}
          aria-disabled={!input || busy}
          aria-describedby={!input ? `${id}-hint` : undefined}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
        >
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Download size={16} aria-hidden />}
          {fg.downloadZip}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {status.kind === 'copied' ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
          {fg.copySnippet}
        </button>
      </div>

      {!input && (
        <p id={`${id}-hint`} className="text-xs text-gray-600 dark:text-gray-400">
          {fg.selectIconFirst}
        </p>
      )}

      <p role="status" aria-live="polite" className="min-h-[1.25rem] text-xs">
        {status.kind === 'copied' && <span className="text-green-600 dark:text-green-400">{fg.snippetCopied}</span>}
        {status.kind === 'error' && <span className="text-red-600 dark:text-red-400">{status.message}</span>}
      </p>

      <pre className="text-xs leading-relaxed bg-gray-900 text-gray-100 rounded-lg p-3 overflow-x-auto">
        <code>{snippet}</code>
      </pre>

      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{fg.whatYouGet}</p>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs font-mono text-gray-600 dark:text-gray-400">
          {BUNDLE_FILES.map((f) => (
            <li key={f} className="truncate">
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
