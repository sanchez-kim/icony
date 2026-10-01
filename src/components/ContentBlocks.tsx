'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Copy, Check, Lightbulb } from 'lucide-react';
import type { BlogBlock } from '../data/blog-content';

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group my-5">
      <pre className="bg-gray-950 dark:bg-gray-900 text-gray-100 rounded-xl p-5 text-sm overflow-x-auto font-mono leading-relaxed border border-gray-800">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label={`Copy ${language} code`}
      >
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </button>
    </div>
  );
}

/** Renders inline **bold** and `code` spans within authored text. */
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-gray-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-primary-700 dark:text-primary-300 text-[0.9em] font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 scroll-mt-24">
          {block.text}
        </h2>
      );
    case 'p':
      return (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed my-4">
          {renderInline(block.text)}
        </p>
      );
    case 'ul':
      return (
        <ul className="my-4 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="my-4 space-y-2 list-decimal list-inside marker:text-primary-500 marker:font-bold">
          {block.items.map((item, i) => (
            <li key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    case 'code':
      return <CodeBlock code={block.code} language={block.lang} />;
    case 'tip':
      return (
        <div className="my-6 flex gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/50">
          <Lightbulb size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
            {renderInline(block.text)}
          </p>
        </div>
      );
    case 'link':
      return (
        <Link
          href={block.href}
          className="my-6 flex items-center justify-between gap-3 p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all group"
        >
          <span className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
            {block.text}
          </span>
          <ArrowRight size={16} className="text-gray-400 group-hover:text-primary-500 transition-colors shrink-0" />
        </Link>
      );
    default:
      return null;
  }
}
