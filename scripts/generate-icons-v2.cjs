const fs = require('fs');

// Read all available icons
const allIcons = fs.readFileSync('all-icons.txt', 'utf-8').split('\n').filter(Boolean);

// MUST-HAVE icons requested by user
const mustHaveIcons = [
  'faBalanceScale',
  'faFlask',
  'faFileContract',
  'faArrowRight',
  'faArrowLeft',
  'faArrowUp',
  'faArrowDown'
];

// Define important categories with keywords
const categories = {
  'ui': ['home', 'house', 'user', 'cog', 'settings', 'gear', 'heart', 'star', 'envelope', 'mail', 'search', 'bell', 'notification', 'calendar', 'camera', 'download', 'upload', 'edit', 'pencil', 'pen', 'trash', 'delete', 'check', 'times', 'xmark', 'cross', 'plus', 'minus', 'bars', 'menu', 'sun', 'moon', 'filter', 'share', 'copy', 'clone', 'save', 'bookmark', 'tag', 'label', 'eye', 'view', 'lock', 'unlock', 'key', 'shield', 'power', 'sliders', 'toggle', 'ellipsis', 'grip', 'grid', 'list'],
  'arrows': ['arrow', 'chevron', 'angle', 'caret', 'sort', 'exchange', 'rotate', 'sync', 'refresh', 'redo', 'undo', 'reply', 'share', 'turn', 'level'],
  'files': ['file', 'folder', 'document', 'paper', 'clipboard', 'note', 'archive', 'box', 'briefcase', 'contract'],
  'users': ['user', 'users', 'person', 'people', 'group', 'team', 'profile', 'account', 'address', 'contact', 'id'],
  'communication': ['comment', 'message', 'chat', 'conversation', 'phone', 'mobile', 'envelope', 'mail', 'inbox', 'reply', 'forward', 'paperclip', 'at', 'hashtag', 'microphone', 'video', 'voicemail'],
  'business': ['briefcase', 'suitcase', 'business', 'chart', 'graph', 'analytics', 'statistics', 'money', 'dollar', 'euro', 'pound', 'yen', 'credit', 'card', 'shopping', 'cart', 'store', 'shop', 'building', 'bank', 'certificate', 'award', 'trophy', 'medal', 'gift', 'percent', 'calculator', 'balance', 'scale'],
  'media': ['image', 'photo', 'picture', 'video', 'film', 'camera', 'music', 'audio', 'volume', 'sound', 'play', 'pause', 'stop', 'forward', 'backward', 'eject', 'record'],
  'devices': ['mobile', 'phone', 'tablet', 'laptop', 'desktop', 'computer', 'tv', 'display', 'screen', 'keyboard', 'mouse', 'headphones', 'gamepad', 'print', 'fax', 'scanner'],
  'network': ['wifi', 'signal', 'ethernet', 'globe', 'world', 'network', 'server', 'database', 'cloud', 'tower', 'satellite', 'broadcast'],
  'science': ['flask', 'vial', 'microscope', 'atom', 'dna', 'bacteria', 'virus', 'magnet', 'experiment', 'beaker', 'test'],
  'medical': ['hospital', 'clinic', 'ambulance', 'stethoscope', 'heart', 'pulse', 'pills', 'capsule', 'syringe', 'vaccine', 'bandage', 'thermometer', 'notes', 'medical', 'health'],
  'education': ['book', 'read', 'graduation', 'cap', 'school', 'university', 'pencil', 'pen', 'marker', 'highlighter', 'eraser', 'ruler', 'compass', 'backpack', 'chalkboard'],
  'weather': ['sun', 'moon', 'cloud', 'rain', 'snow', 'snowflake', 'wind', 'bolt', 'lightning', 'temperature', 'umbrella', 'rainbow'],
  'transportation': ['car', 'truck', 'van', 'bus', 'taxi', 'bicycle', 'motorcycle', 'train', 'subway', 'tram', 'plane', 'helicopter', 'ship', 'boat', 'rocket', 'space'],
  'location': ['map', 'location', 'marker', 'pin', 'compass', 'route', 'road', 'signpost', 'directions', 'navigation'],
  'time': ['clock', 'time', 'alarm', 'stopwatch', 'timer', 'hourglass', 'history'],
  'food': ['utensils', 'fork', 'spoon', 'knife', 'plate', 'bowl', 'mug', 'cup', 'coffee', 'tea', 'beer', 'wine', 'glass', 'bottle', 'pizza', 'burger', 'apple', 'carrot', 'cake', 'ice', 'cream'],
  'sports': ['football', 'basketball', 'baseball', 'tennis', 'golf', 'hockey', 'volleyball', 'trophy', 'medal', 'award', 'dumbbell', 'weight', 'bicycle'],
  'actions': ['thumbs', 'hand', 'finger', 'fist', 'handshake', 'clap', 'wave', 'peace', 'point'],
  'nature': ['tree', 'leaf', 'plant', 'flower', 'seedling', 'mountain', 'fire', 'water', 'droplet', 'paw', 'feather', 'bug', 'spider'],
  'symbols': ['question', 'info', 'exclamation', 'warning', 'ban', 'circle', 'square', 'triangle', 'diamond', 'infinity', 'hashtag', 'percent', 'section', 'paragraph'],
  'security': ['lock', 'unlock', 'key', 'shield', 'fingerprint', 'user-secret', 'mask', 'eye-slash', 'ban'],
  'data': ['chart', 'graph', 'pie', 'line', 'column', 'bar', 'area', 'table', 'database', 'server'],
  'code': ['code', 'terminal', 'command', 'brackets', 'bug', 'debug', 'git', 'branch', 'commit', 'merge', 'pull', 'push'],
};

// Score icons based on category relevance
const scoredIcons = allIcons.map(icon => {
  const iconLower = icon.toLowerCase();
  let score = 0;
  let matchedCategories = [];

  // Must-have icons get maximum score
  if (mustHaveIcons.includes(icon)) {
    score = 1000;
    matchedCategories.push('ui');
  }

  for (const [category, keywords] of Object.entries(categories)) {
    for (const keyword of keywords) {
      if (iconLower.includes(keyword.toLowerCase())) {
        score += 1;
        matchedCategories.push(category);
        break;
      }
    }
  }

  return { icon, score, category: matchedCategories[0] || 'other' };
});

// Sort by score and take top 800
const selectedIcons = scoredIcons
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 800);

console.log(`Selected ${selectedIcons.length} icons out of ${allIcons.length}`);

// Verify must-have icons are included
console.log('\nVerifying must-have icons:');
mustHaveIcons.forEach(icon => {
  const found = selectedIcons.find(item => item.icon === icon);
  console.log(`  ${icon}: ${found ? '✓ Included' : '✗ MISSING'}`);
});

// Group by category
const groupedByCategory = {};
selectedIcons.forEach(({ icon, category }) => {
  if (!groupedByCategory[category]) {
    groupedByCategory[category] = [];
  }
  groupedByCategory[category].push(icon);
});

// Generate import statement
const imports = selectedIcons.map(item => item.icon).join(', \n  ');

// Generate icon objects
const iconObjects = selectedIcons.map(({ icon, category }) => {
  // Convert camelCase to kebab-case for ID
  const id = 'fa-' + icon.substring(2).replace(/([A-Z])/g, '-$1').toLowerCase();
  // Convert camelCase to Title Case for name
  const name = icon.substring(2).replace(/([A-Z])/g, ' $1').trim();

  return `  { id: '${id}', name: '${name}', category: '${category}', tags: [], type: 'fontawesome', component: ${icon} }`;
}).join(',\n');

// Write the complete file
const output = `// FontAwesome Solid Icons - Comprehensive Selection (${selectedIcons.length} icons)
import {
  ${imports}
} from '@fortawesome/free-solid-svg-icons';
import { Icon } from '../types';

export const fontAwesomeIcons: Icon[] = [
${iconObjects}
];
`;

fs.writeFileSync('src/data/fontawesome-icons.ts', output);
console.log('\nGenerated fontawesome-icons.ts');
console.log('\nIcons by category:');
Object.entries(groupedByCategory).forEach(([cat, icons]) => {
  console.log(`  ${cat}: ${icons.length}`);
});
