import type { ElementType } from 'react';
import { splitSentences } from '../utils/splitSentences';

interface SentenceLinesProps {
  text: string;
  className?: string;
  id?: string;
  /** Wrapper element. Defaults to `p`. */
  as?: ElementType;
}

/**
 * Renders short copy with every sentence starting on a new line. A sentence
 * that is too long for the width still wraps on its own, balanced, and Korean
 * keeps the page-level `word-break: keep-all`.
 *
 * Use for headings' subtitles, card descriptions, FAQ answers and similar
 * short copy. Long-form paragraphs (blog bodies, legal pages) should keep
 * flowing as normal paragraphs instead.
 */
export function SentenceLines({ text, className, id, as: Tag = 'p' }: SentenceLinesProps) {
  const sentences = splitSentences(text);
  return (
    <Tag id={id} className={className}>
      {sentences.map((sentence, index) => (
        <span key={index} className="block text-balance">
          {sentence}
        </span>
      ))}
    </Tag>
  );
}
