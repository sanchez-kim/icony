import { useMemo } from 'react';
import { Icon } from '../types';

export function useIconSearch(icons: Icon[], query: string): Icon[] {
  return useMemo(() => {
    if (!query.trim()) {
      return icons;
    }

    // Split query into words and convert to lowercase
    const queryWords = query.toLowerCase().trim().split(/\s+/);

    // Score each icon based on relevance
    const scoredIcons = icons
      .map((icon) => {
        let score = 0;
        const lowerName = icon.name.toLowerCase();
        const lowerTags = icon.tags.map(tag => tag.toLowerCase());
        const lowerCategory = icon.category.toLowerCase();

        // Check if all query words match somewhere
        const allWordsMatch = queryWords.every(word => {
          let wordMatched = false;

          // Exact name match (highest priority)
          if (lowerName === word) {
            score += 100;
            wordMatched = true;
          }
          // Name starts with word
          else if (lowerName.startsWith(word)) {
            score += 90;
            wordMatched = true;
          }
          // Name includes word
          else if (lowerName.includes(word)) {
            score += 80;
            wordMatched = true;
          }

          // Exact tag match
          if (lowerTags.some(tag => tag === word)) {
            score += 60;
            wordMatched = true;
          }
          // Tag starts with word
          else if (lowerTags.some(tag => tag.startsWith(word))) {
            score += 50;
            wordMatched = true;
          }
          // Tag includes word
          else if (lowerTags.some(tag => tag.includes(word))) {
            score += 40;
            wordMatched = true;
          }

          // Category includes word
          if (lowerCategory.includes(word)) {
            score += 20;
            wordMatched = true;
          }

          return wordMatched;
        });

        return allWordsMatch ? { icon, score } : null;
      })
      .filter((item): item is { icon: Icon; score: number } => item !== null);

    // Sort by score (highest first), then by name
    scoredIcons.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.icon.name.localeCompare(b.icon.name);
    });

    return scoredIcons.map(item => item.icon);
  }, [icons, query]);
}
