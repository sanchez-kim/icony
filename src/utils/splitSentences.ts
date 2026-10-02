/**
 * Split short copy into sentences so each one can start on its own line.
 *
 * A sentence ends only at `.`, `?`, `!` or `。` that is followed by
 * whitespace. That leaves "Next.js", "10,000", "v1.0", "0.5px" and URLs
 * intact, since none of them have a space right after the period.
 *
 * Also not treated as a sentence end:
 * - a terminator inside parentheses, brackets or quotes
 * - the period of a known abbreviation ("e.g.", "i.e.", "vs.", "Dr." ...)
 *
 * Pure and deterministic, so server and client render the same markup.
 */

const TERMINATORS = new Set(['.', '?', '!', '。']);

// Lower-cased word before the period, without the period itself.
const ABBREVIATIONS = new Set(['e.g', 'i.e', 'vs', 'cf', 'mr', 'mrs', 'ms', 'dr', 'approx']);

const OPENERS: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '“': '”',
  '「': '」',
  '『': '』',
  '（': '）',
};
const CLOSERS = new Set(Object.values(OPENERS));

function isWhitespace(ch: string | undefined): boolean {
  return ch !== undefined && /\s/.test(ch);
}

/** The run of non-whitespace characters that ends at `end` (exclusive). */
function wordBefore(text: string, end: number): string {
  let start = end;
  while (start > 0 && !isWhitespace(text[start - 1])) start--;
  // Drop leading punctuation such as "(" so "(e.g" still matches.
  return text.slice(start, end).replace(/^[^\p{L}\p{N}]+/u, '').toLowerCase();
}

function split(text: string, trackNesting: boolean): { parts: string[]; balanced: boolean } {
  const parts: string[] = [];
  const stack: string[] = [];
  let inStraightQuote = false;
  let start = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (trackNesting) {
      if (ch === '"') {
        inStraightQuote = !inStraightQuote;
        continue;
      }
      if (OPENERS[ch]) {
        stack.push(OPENERS[ch]);
        continue;
      }
      if (CLOSERS.has(ch)) {
        if (stack[stack.length - 1] === ch) stack.pop();
        continue;
      }
    }

    if (!TERMINATORS.has(ch)) continue;

    // Swallow runs like "?!" or "..." so the split lands after the last one.
    let end = i + 1;
    while (end < text.length && TERMINATORS.has(text[end])) end++;

    if (!isWhitespace(text[end])) {
      i = end - 1;
      continue;
    }
    if (stack.length > 0 || inStraightQuote) {
      i = end - 1;
      continue;
    }
    if (ch === '.' && end === i + 1 && ABBREVIATIONS.has(wordBefore(text, i))) {
      continue;
    }

    const sentence = text.slice(start, end).trim();
    if (sentence) parts.push(sentence);
    start = end;
    i = end - 1;
  }

  const rest = text.slice(start).trim();
  if (rest) parts.push(rest);

  return { parts, balanced: stack.length === 0 && !inStraightQuote };
}

export function splitSentences(text: string): string[] {
  if (!text) return [];
  const nested = split(text, true);
  // A stray "(" or quote would otherwise suppress every split after it.
  if (!nested.balanced) return split(text, false).parts;
  return nested.parts;
}
