'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

/**
 * Local-state colour control (swatch + hex input + collapsible HexColorPicker),
 * modelled on CustomizationPanel/ColorSelector but without IconContext. Only
 * valid #rgb/#rrggbb values propagate; the text box can hold a draft meanwhile.
 */
export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const { t } = useLanguage();
  const id = useId();
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Don't clobber what the user is typing; onBlur re-syncs the draft.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setDraft(value);
  }, [value]);

  const commit = (next: string) => {
    setDraft(next);
    const v = next.startsWith('#') ? next : `#${next}`;
    if (HEX_RE.test(v)) onChange(v.toLowerCase());
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          tabIndex={-1}
          className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex-shrink-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          style={{ backgroundColor: value }}
          aria-label={`${label}: ${open ? t.ui.hideCustomPicker : t.ui.showCustomPicker}`}
          aria-expanded={open}
        />
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => commit(e.target.value.trim())}
          onBlur={() => setDraft(value)}
          spellCheck={false}
          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
          placeholder="#000000"
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label={open ? t.ui.hideCustomPicker : t.ui.showCustomPicker}
          aria-expanded={open}
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {open && (
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm [&_.react-colorful]:w-full">
          <HexColorPicker color={value} onChange={(c) => onChange(c.toLowerCase())} />
        </div>
      )}
    </div>
  );
}
