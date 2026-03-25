import { useMemo } from 'react';
import { Icon } from '../types';
import { KO_SEARCH_MAP } from '../data/ko-search-map';
import { EN_SYNONYMS } from '../data/en-synonyms';

// ─── Korean detection ────────────────────────────────────────────────────────

/** Returns true if the string contains at least one Korean (Hangul) character. */
function isKorean(text: string): boolean {
  return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(text);
}

/**
 * Resolves Korean partial matches from KO_SEARCH_MAP.
 * e.g. "설" matches "설정" and returns its English tags.
 */
function resolveKoreanQuery(query: string): string[] {
  const englishTerms: string[] = [];

  for (const [koKey, enTags] of Object.entries(KO_SEARCH_MAP)) {
    // Exact match or the stored key starts with the query (prefix match for partial input)
    if (koKey === query || koKey.startsWith(query) || query.startsWith(koKey)) {
      for (const tag of enTags) {
        if (!englishTerms.includes(tag)) {
          englishTerms.push(tag);
        }
      }
    }
  }

  return englishTerms;
}

// ─── Synonym expansion ───────────────────────────────────────────────────────

/**
 * Expands a single English term to include its synonyms.
 * Returns a deduplicated array that includes the original term.
 */
function expandWithSynonyms(term: string): string[] {
  const synonyms = EN_SYNONYMS[term] ?? [];
  const result = [term, ...synonyms];

  // Also check if this term appears as a value in any synonym group
  for (const [canonical, related] of Object.entries(EN_SYNONYMS)) {
    if (related.includes(term) && !result.includes(canonical)) {
      result.push(canonical);
    }
  }

  return [...new Set(result)];
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useIconSearch(icons: Icon[], query: string): Icon[] {
  return useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return icons;

    // Split into individual words (handles multi-word queries)
    const rawWords = trimmed.toLowerCase().split(/\s+/);

    // Resolve each word to a set of search terms
    const resolvedTermSets: string[][] = rawWords.map((word) => {
      if (isKorean(word)) {
        // Korean word → map to English tags, then expand each with synonyms
        const englishTags = resolveKoreanQuery(word);

        if (englishTags.length === 0) {
          // No mapping found: keep the original word as fallback
          return [word];
        }

        const expanded = new Set<string>();
        for (const tag of englishTags) {
          for (const syn of expandWithSynonyms(tag)) {
            expanded.add(syn);
          }
        }
        return [...expanded];
      }

      // English word → expand with synonyms
      return expandWithSynonyms(word);
    });

    // Score icons: each raw word must match at least one of its resolved terms
    const scored = icons
      .map((icon) => {
        let totalScore = 0;
        const lowerName = icon.name.toLowerCase();
        const lowerTags = icon.tags.map((t) => t.toLowerCase());
        const lowerCategory = icon.category.toLowerCase();

        const allRawWordsMatch = resolvedTermSets.every((termSet) => {
          // Try every expanded term — use the best matching score for this word
          let bestScore = 0;
          let matched = false;

          for (const term of termSet) {
            let termScore = 0;

            if (lowerName === term) {
              termScore += 100;
            } else if (lowerName.startsWith(term)) {
              termScore += 90;
            } else if (lowerName.includes(term)) {
              termScore += 80;
            }

            if (lowerTags.some((tag) => tag === term)) {
              termScore += 60;
            } else if (lowerTags.some((tag) => tag.startsWith(term))) {
              termScore += 50;
            } else if (lowerTags.some((tag) => tag.includes(term))) {
              termScore += 40;
            }

            if (lowerCategory.includes(term)) {
              termScore += 20;
            }

            if (termScore > 0) {
              matched = true;
              if (termScore > bestScore) bestScore = termScore;
            }
          }

          totalScore += bestScore;
          return matched;
        });

        return allRawWordsMatch ? { icon, score: totalScore } : null;
      })
      .filter((item): item is { icon: Icon; score: number } => item !== null);

    // ── Fuzzy fallback when query returns 0 results ──────────────────────────
    if (scored.length === 0) {
      const fuzzyResults = icons
        .map((icon) => {
          const lowerName = icon.name.toLowerCase();
          const lowerTags = icon.tags.map((t) => t.toLowerCase());

          // Use all resolved terms from all word groups for fuzzy matching
          const allTerms = resolvedTermSets.flat();
          let fuzzyScore = 0;

          for (const term of allTerms) {
            if (term.length < 3) continue;

            // Partial inclusion of query fragment in name/tags
            if (lowerName.includes(term.slice(0, Math.ceil(term.length * 0.7)))) {
              fuzzyScore += 15;
            }
            for (const tag of lowerTags) {
              if (tag.includes(term.slice(0, Math.ceil(term.length * 0.7)))) {
                fuzzyScore += 10;
                break;
              }
            }
          }

          return fuzzyScore > 0 ? { icon, score: fuzzyScore } : null;
        })
        .filter((item): item is { icon: Icon; score: number } => item !== null);

      fuzzyResults.sort((a, b) =>
        b.score !== a.score ? b.score - a.score : a.icon.name.localeCompare(b.icon.name),
      );

      // Return top 20 fuzzy suggestions so the UI can flag them as "did you mean"
      return fuzzyResults.slice(0, 20).map((item) => item.icon);
    }

    // Sort by score descending, then alphabetically
    scored.sort((a, b) =>
      b.score !== a.score ? b.score - a.score : a.icon.name.localeCompare(b.icon.name),
    );

    return scored.map((item) => item.icon);
  }, [icons, query]);
}
