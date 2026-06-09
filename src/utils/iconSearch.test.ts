import { describe, it, expect } from 'vitest';
import { searchIcons, isKorean } from './iconSearch';
import type { Icon } from '../types';

/** Build a minimal Icon with the precomputed search fields populated. */
function makeIcon(name: string, tags: string[], category = 'misc'): Icon {
  return {
    id: `test-${name}`,
    name,
    category,
    tags,
    type: 'lucide',
    component: (() => null) as unknown as Icon['component'],
    searchName: name.toLowerCase(),
    searchTags: tags.map((t) => t.toLowerCase()),
    searchCategory: category.toLowerCase(),
  };
}

// Nonsense tokens that won't collide with the synonym/Korean dictionaries,
// keeping these assertions independent of the bundled search data.
describe('searchIcons', () => {
  it('returns the input array unchanged for an empty or whitespace query', () => {
    const icons = [makeIcon('home', [])];
    expect(searchIcons(icons, '')).toBe(icons);
    expect(searchIcons(icons, '   ')).toBe(icons);
  });

  it('ranks an exact name match above a tag-only match', () => {
    const exact = makeIcon('xqzalpha', []);
    const tagOnly = makeIcon('xqzbeta', ['xqzalpha']);

    const result = searchIcons([tagOnly, exact], 'xqzalpha');

    expect(result[0]).toBe(exact);
    expect(result).toContain(tagOnly);
  });

  it('matches by name prefix', () => {
    const result = searchIcons([makeIcon('xqzalphabet', [])], 'xqzalpha');
    expect(result).toHaveLength(1);
  });

  it('matches by tag', () => {
    const result = searchIcons([makeIcon('something', ['xqzgamma'])], 'xqzgamma');
    expect(result).toHaveLength(1);
  });

  it('is case-insensitive', () => {
    const icons = [makeIcon('XqzAlpha', [])];
    expect(searchIcons(icons, 'xqzalpha')).toHaveLength(1);
    expect(searchIcons(icons, 'XQZALPHA')).toHaveLength(1);
  });

  it('requires every word of a multi-word query to match (AND semantics)', () => {
    const both = makeIcon('xqzalpha', ['xqzbeta']);
    const onlyOne = makeIcon('xqzalpha', []);

    const result = searchIcons([both, onlyOne], 'xqzalpha xqzbeta');

    expect(result).toContain(both);
    expect(result).not.toContain(onlyOne);
  });

  it('returns an empty list when nothing matches and fuzzy finds nothing', () => {
    const result = searchIcons([makeIcon('home', ['house'])], 'zzzzq');
    expect(result).toEqual([]);
  });

  it('handles a Korean query without a dictionary entry gracefully', () => {
    const result = searchIcons([makeIcon('home', [])], '없는단어검색어');
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('isKorean', () => {
  it('detects Hangul syllables', () => {
    expect(isKorean('홈')).toBe(true);
    expect(isKorean('가나다')).toBe(true);
  });

  it('detects Hangul compatibility jamo', () => {
    expect(isKorean('ㄱ')).toBe(true);
  });

  it('returns false for non-Korean text', () => {
    expect(isKorean('home')).toBe(false);
    expect(isKorean('123')).toBe(false);
    expect(isKorean('')).toBe(false);
  });
});
