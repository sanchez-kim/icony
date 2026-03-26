/**
 * generate-icons.mjs
 *
 * Extracts icon names from Lucide, Tabler, and Phosphor node_modules and
 * generates IconDescriptor array TypeScript files.
 *
 * Usage:
 *   node scripts/generate-icons.mjs
 *
 * Output:
 *   src/data/lucide-icons-full.ts
 *   src/data/tabler-icons-full.ts
 *   src/data/phosphor-icons-full.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Utility: split PascalCase / camelCase name into lowercase word tokens
// e.g. "ArrowRight" → ["arrow", "right"]
//      "IconAlertCircle" → ["alert", "circle"]
// ---------------------------------------------------------------------------
function splitWords(name) {
  // Strip known prefixes
  const stripped = name.replace(/^Icon/, '').replace(/Icon$/, '');
  // Split on capital letters (preserve sequences like "UI", "SVG")
  return stripped
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .toLowerCase()
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Category detection — maps word tokens to a primary category slug
// ---------------------------------------------------------------------------
const CATEGORY_RULES = [
  { category: 'arrows',         keywords: ['arrow', 'chevron', 'caret', 'angle', 'sort', 'direction', 'next', 'prev', 'previous', 'back', 'forward', 'up', 'down', 'left', 'right', 'move', 'transfer', 'exchange', 'swap', 'turn', 'rotate', 'loop', 'repeat', 'undo', 'redo', 'refresh', 'sync', 'reload', 'cycle', 'revert', 'reply', 'return'] },
  { category: 'users',          keywords: ['user', 'person', 'people', 'profile', 'account', 'avatar', 'human', 'man', 'woman', 'boy', 'girl', 'child', 'baby', 'team', 'group', 'crowd', 'friend', 'contact', 'member', 'id', 'badge', 'face', 'head', 'body'] },
  { category: 'files',          keywords: ['file', 'folder', 'document', 'doc', 'page', 'paper', 'archive', 'zip', 'pdf', 'note', 'notebook', 'clipboard', 'board', 'form', 'contract', 'spreadsheet', 'presentation', 'slide', 'book', 'books', 'reading', 'library'] },
  { category: 'communication',  keywords: ['message', 'chat', 'comment', 'speech', 'bubble', 'mail', 'email', 'envelope', 'inbox', 'outbox', 'send', 'reply', 'forward', 'phone', 'mobile', 'call', 'voicemail', 'fax', 'broadcast', 'announce', 'notification', 'alert', 'mention', 'hashtag', 'at', 'paperclip', 'attachment', 'microphone', 'mic', 'speaker', 'headphone', 'headset', 'telephone', 'sms'] },
  { category: 'media',          keywords: ['play', 'pause', 'stop', 'record', 'video', 'film', 'movie', 'camera', 'photo', 'image', 'picture', 'gallery', 'album', 'music', 'audio', 'sound', 'volume', 'mute', 'speaker', 'headphone', 'microphone', 'podcast', 'stream', 'broadcast', 'tv', 'television', 'monitor', 'screen', 'projector', 'player', 'playlist', 'track', 'vinyl', 'cassette', 'disc', 'dvd'] },
  { category: 'devices',        keywords: ['device', 'laptop', 'desktop', 'computer', 'pc', 'mac', 'tablet', 'ipad', 'phone', 'smartphone', 'watch', 'smartwatch', 'printer', 'scanner', 'keyboard', 'mouse', 'touchpad', 'joystick', 'gamepad', 'controller', 'remote', 'router', 'modem', 'server', 'hardware', 'chip', 'cpu', 'gpu', 'ram', 'drive', 'disk', 'ssd', 'usb', 'hdmi', 'charger', 'battery', 'headphone', 'speaker', 'microphone', 'webcam'] },
  { category: 'network',        keywords: ['wifi', 'wireless', 'bluetooth', 'network', 'internet', 'web', 'cloud', 'server', 'database', 'api', 'globe', 'world', 'earth', 'signal', 'antenna', 'tower', 'satellite', 'broadcast', 'router', 'ethernet', 'cable', 'vpn', 'firewall', 'proxy', 'dns', 'http', 'https', 'protocol', 'connection', 'online', 'offline', 'upload', 'download', 'transfer', 'sync'] },
  { category: 'security',       keywords: ['lock', 'unlock', 'key', 'password', 'shield', 'security', 'safe', 'protected', 'encrypt', 'decrypt', 'fingerprint', 'biometric', 'auth', 'login', 'logout', 'ban', 'block', 'forbidden', 'private', 'secret', 'vault', 'privacy', 'mask', 'hide', 'incognito', 'anonymous', 'certificate', 'verify', 'badge', 'check', 'trust', 'access', 'permission', 'role', 'guard', 'patrol'] },
  { category: 'business',       keywords: ['briefcase', 'suitcase', 'office', 'work', 'job', 'career', 'chart', 'graph', 'analytics', 'report', 'statistics', 'data', 'trend', 'growth', 'dollar', 'euro', 'pound', 'yen', 'currency', 'money', 'cash', 'coin', 'credit', 'card', 'wallet', 'bank', 'finance', 'payment', 'invoice', 'receipt', 'tax', 'budget', 'profit', 'loss', 'investment', 'stock', 'market', 'trade', 'commerce', 'shopping', 'cart', 'bag', 'store', 'shop', 'sale', 'discount', 'coupon', 'gift', 'award', 'trophy', 'medal', 'certificate', 'stamp', 'seal', 'tag', 'label', 'price', 'percent', 'calculator', 'balance', 'scale', 'target', 'goal'] },
  { category: 'buildings',      keywords: ['building', 'house', 'home', 'apartment', 'office', 'school', 'university', 'college', 'hospital', 'clinic', 'church', 'mosque', 'temple', 'synagogue', 'bank', 'hotel', 'restaurant', 'store', 'shop', 'mall', 'market', 'warehouse', 'factory', 'museum', 'library', 'stadium', 'gym', 'garage', 'apartment', 'castle', 'fort', 'tower', 'city', 'urban', 'suburb', 'village', 'construction', 'architecture'] },
  { category: 'transportation', keywords: ['car', 'auto', 'vehicle', 'truck', 'van', 'bus', 'taxi', 'cab', 'train', 'tram', 'subway', 'metro', 'rail', 'bicycle', 'bike', 'motorcycle', 'moped', 'scooter', 'plane', 'airplane', 'aircraft', 'helicopter', 'rocket', 'shuttle', 'ship', 'boat', 'ferry', 'yacht', 'submarine', 'ambulance', 'police', 'fire', 'truck', 'crane', 'tractor', 'forklift', 'road', 'highway', 'traffic', 'parking', 'fuel', 'gas', 'charging', 'route', 'navigation', 'gps', 'map', 'compass'] },
  { category: 'nature',         keywords: ['tree', 'plant', 'flower', 'leaf', 'grass', 'forest', 'jungle', 'mountain', 'hill', 'valley', 'river', 'lake', 'ocean', 'sea', 'beach', 'island', 'desert', 'snow', 'ice', 'earth', 'globe', 'nature', 'environment', 'eco', 'green', 'organic', 'recycle', 'sun', 'moon', 'star', 'cloud', 'rain', 'wind', 'storm', 'lightning', 'thunder', 'rainbow', 'fire', 'flame', 'water', 'wave', 'seed', 'sprout', 'cactus', 'mushroom', 'bug', 'insect', 'butterfly', 'bird', 'fish', 'animal', 'paw', 'feather'] },
  { category: 'weather',        keywords: ['sun', 'sunny', 'cloud', 'cloudy', 'rain', 'rainy', 'snow', 'snowy', 'fog', 'foggy', 'wind', 'windy', 'storm', 'thunder', 'lightning', 'hail', 'rainbow', 'umbrella', 'tornado', 'hurricane', 'temperature', 'thermometer', 'hot', 'cold', 'freeze', 'humid', 'drought', 'forecast', 'weather', 'climate'] },
  { category: 'food',           keywords: ['food', 'eat', 'drink', 'meal', 'restaurant', 'kitchen', 'cook', 'chef', 'recipe', 'ingredient', 'utensil', 'fork', 'spoon', 'knife', 'plate', 'bowl', 'cup', 'mug', 'glass', 'bottle', 'can', 'coffee', 'tea', 'beer', 'wine', 'cocktail', 'juice', 'water', 'milk', 'bread', 'pizza', 'burger', 'sandwich', 'salad', 'soup', 'rice', 'pasta', 'noodle', 'sushi', 'taco', 'cake', 'cookie', 'candy', 'chocolate', 'ice', 'cream', 'fruit', 'vegetable', 'apple', 'banana', 'carrot', 'potato', 'tomato', 'lemon', 'grape', 'strawberry', 'cheese', 'egg', 'bacon', 'meat', 'fish', 'seafood'] },
  { category: 'medical',        keywords: ['medical', 'health', 'hospital', 'clinic', 'doctor', 'nurse', 'patient', 'medicine', 'drug', 'pill', 'capsule', 'syringe', 'vaccine', 'injection', 'blood', 'heart', 'pulse', 'heartbeat', 'stethoscope', 'bandage', 'wound', 'surgery', 'xray', 'scan', 'diagnosis', 'prescription', 'pharmacy', 'ambulance', 'emergency', 'firstaid', 'aid', 'virus', 'bacteria', 'dna', 'gene', 'microscope', 'lab', 'test', 'sample', 'thermometer', 'wheelchair', 'crutch', 'prosthetic', 'dental', 'tooth', 'brain', 'eye', 'ear', 'lungs', 'kidney', 'stomach'] },
  { category: 'education',      keywords: ['book', 'read', 'study', 'learn', 'education', 'school', 'class', 'student', 'teacher', 'professor', 'graduation', 'degree', 'diploma', 'certificate', 'academic', 'university', 'college', 'knowledge', 'wisdom', 'quiz', 'test', 'exam', 'homework', 'assignment', 'essay', 'pencil', 'pen', 'marker', 'highlighter', 'eraser', 'ruler', 'compass', 'calculator', 'backpack', 'chalkboard', 'whiteboard', 'blackboard', 'globe', 'microscope', 'chemistry', 'biology', 'physics', 'math', 'language', 'alphabet', 'library', 'research', 'science', 'experiment'] },
  { category: 'science',        keywords: ['science', 'scientific', 'research', 'experiment', 'lab', 'laboratory', 'microscope', 'telescope', 'atom', 'molecule', 'chemical', 'chemistry', 'biology', 'physics', 'astronomy', 'space', 'planet', 'galaxy', 'star', 'comet', 'meteor', 'rocket', 'satellite', 'dna', 'gene', 'cell', 'flask', 'beaker', 'test', 'tube', 'magnet', 'electron', 'proton', 'neutron', 'radiation', 'nuclear', 'formula', 'equation', 'hypothesis', 'theory'] },
  { category: 'sports',         keywords: ['sport', 'game', 'play', 'football', 'soccer', 'basketball', 'baseball', 'tennis', 'golf', 'hockey', 'volleyball', 'rugby', 'cricket', 'badminton', 'ping', 'pong', 'swimming', 'running', 'cycling', 'hiking', 'climbing', 'boxing', 'wrestling', 'martial', 'art', 'karate', 'judo', 'yoga', 'fitness', 'gym', 'dumbbell', 'weight', 'trophy', 'medal', 'award', 'olympic', 'stadium', 'court', 'field', 'track', 'pool', 'ball', 'goal', 'score', 'win', 'race'] },
  { category: 'time',           keywords: ['clock', 'time', 'alarm', 'watch', 'timer', 'stopwatch', 'hourglass', 'calendar', 'schedule', 'event', 'date', 'day', 'week', 'month', 'year', 'hour', 'minute', 'second', 'deadline', 'history', 'past', 'future', 'now', 'present', 'morning', 'evening', 'night', 'midnight', 'noon'] },
  { category: 'location',       keywords: ['map', 'location', 'place', 'position', 'gps', 'navigation', 'direction', 'compass', 'marker', 'pin', 'flag', 'destination', 'address', 'coordinates', 'latitude', 'longitude', 'route', 'path', 'road', 'street', 'highway', 'signpost', 'waypoint', 'landmark', 'city', 'country', 'region', 'area', 'zone', 'border', 'globe'] },
  { category: 'code',           keywords: ['code', 'coding', 'programming', 'developer', 'development', 'terminal', 'console', 'command', 'script', 'bug', 'debug', 'git', 'branch', 'commit', 'merge', 'fork', 'pull', 'push', 'repo', 'repository', 'database', 'api', 'server', 'backend', 'frontend', 'html', 'css', 'javascript', 'typescript', 'python', 'java', 'rust', 'go', 'ruby', 'php', 'swift', 'kotlin', 'react', 'vue', 'angular', 'node', 'docker', 'container', 'kubernetes', 'cloud', 'devops', 'ci', 'cd', 'deploy', 'build', 'test', 'lint', 'format', 'bracket', 'function', 'variable', 'class', 'object', 'array', 'string', 'integer', 'boolean'] },
  { category: 'ui',             keywords: ['home', 'menu', 'search', 'settings', 'gear', 'cog', 'bell', 'notification', 'heart', 'like', 'star', 'favorite', 'bookmark', 'tag', 'filter', 'sort', 'view', 'grid', 'list', 'sidebar', 'panel', 'modal', 'dialog', 'popup', 'tooltip', 'tab', 'button', 'toggle', 'switch', 'checkbox', 'radio', 'input', 'select', 'dropdown', 'slider', 'scroll', 'resize', 'fullscreen', 'minimize', 'maximize', 'close', 'open', 'expand', 'collapse', 'show', 'hide', 'eye', 'copy', 'paste', 'cut', 'undo', 'redo', 'zoom', 'focus', 'cursor', 'pointer', 'drag', 'drop', 'select', 'highlight', 'theme', 'dark', 'light', 'color', 'paint', 'brush', 'pen', 'eraser', 'tool', 'toolbar', 'layout', 'page', 'window', 'app', 'application'] },
];

function detectCategory(words) {
  const wordSet = new Set(words.map(w => w.toLowerCase()));
  const wordStr = words.join(' ').toLowerCase();

  for (const { category, keywords } of CATEGORY_RULES) {
    for (const kw of keywords) {
      if (wordSet.has(kw) || wordStr.includes(kw)) {
        return category;
      }
    }
  }
  return 'other';
}

// ---------------------------------------------------------------------------
// Tag generation — uses word tokens + semantic expansions
// ---------------------------------------------------------------------------
const TAG_EXPANSIONS = {
  home:       ['house', 'homepage', 'main', 'dashboard'],
  user:       ['person', 'account', 'profile', 'member'],
  users:      ['people', 'group', 'team', 'community'],
  star:       ['favorite', 'rating', 'bookmark', 'like'],
  heart:      ['love', 'like', 'favorite', 'health'],
  search:     ['find', 'look', 'magnify', 'query'],
  menu:       ['hamburger', 'navigation', 'list', 'bars'],
  settings:   ['configuration', 'preferences', 'gear', 'options'],
  gear:       ['settings', 'configuration', 'options'],
  cog:        ['settings', 'gear', 'options'],
  bell:       ['notification', 'alert', 'reminder'],
  mail:       ['email', 'message', 'envelope', 'inbox'],
  calendar:   ['date', 'schedule', 'event', 'time'],
  camera:     ['photo', 'picture', 'snapshot', 'image'],
  download:   ['save', 'export', 'pull', 'fetch'],
  upload:     ['import', 'push', 'publish', 'share'],
  arrow:      ['direction', 'pointer', 'navigate'],
  chevron:    ['arrow', 'caret', 'direction'],
  lock:       ['security', 'private', 'protected'],
  unlock:     ['open', 'access', 'public'],
  shield:     ['security', 'protection', 'safe'],
  cloud:      ['storage', 'online', 'remote'],
  code:       ['programming', 'developer', 'syntax'],
  terminal:   ['console', 'shell', 'command', 'cli'],
  file:       ['document', 'attachment', 'paper'],
  folder:     ['directory', 'collection', 'container'],
  map:        ['navigation', 'location', 'geography'],
  phone:      ['call', 'mobile', 'contact'],
  wifi:       ['internet', 'wireless', 'connection', 'network'],
  clock:      ['time', 'watch', 'schedule'],
  chart:      ['graph', 'analytics', 'statistics', 'data'],
  alert:      ['warning', 'caution', 'danger', 'notice'],
  check:      ['success', 'done', 'complete', 'valid'],
  plus:       ['add', 'create', 'new', 'insert'],
  minus:      ['remove', 'delete', 'subtract'],
  eye:        ['view', 'visibility', 'watch', 'look'],
  trash:      ['delete', 'remove', 'bin', 'garbage'],
  edit:       ['modify', 'change', 'update', 'write'],
  share:      ['send', 'distribute', 'export', 'social'],
  copy:       ['duplicate', 'clone', 'replicate'],
  globe:      ['world', 'earth', 'internet', 'international'],
  database:   ['storage', 'data', 'server', 'backend'],
  server:     ['host', 'backend', 'infrastructure'],
  tag:        ['label', 'category', 'mark', 'keyword'],
  filter:     ['sort', 'search', 'narrow', 'refine'],
  play:       ['start', 'run', 'media', 'video'],
  pause:      ['stop', 'hold', 'media'],
  send:       ['submit', 'transmit', 'forward'],
  link:       ['url', 'connect', 'chain', 'href'],
  image:      ['picture', 'photo', 'graphic'],
  video:      ['film', 'movie', 'recording'],
  music:      ['audio', 'song', 'sound', 'melody'],
  book:       ['read', 'library', 'document', 'knowledge'],
  message:    ['chat', 'conversation', 'text', 'communication'],
  info:       ['information', 'detail', 'about', 'help'],
  help:       ['support', 'question', 'faq', 'assist'],
  print:      ['printer', 'document', 'output', 'paper'],
  refresh:    ['reload', 'update', 'sync', 'reset'],
  logout:     ['exit', 'signout', 'leave'],
  login:      ['signin', 'enter', 'access'],
  sun:        ['light', 'day', 'bright', 'mode'],
  moon:       ['dark', 'night', 'mode', 'sleep'],
  laptop:     ['computer', 'device', 'portable'],
  mobile:     ['phone', 'smartphone', 'device'],
  battery:    ['power', 'charge', 'energy'],
  bolt:       ['lightning', 'fast', 'power', 'energy'],
  gift:       ['present', 'reward', 'offer'],
  medal:      ['award', 'achievement', 'honor'],
  trophy:     ['award', 'winner', 'achievement'],
  target:     ['goal', 'aim', 'objective'],
  activity:   ['health', 'fitness', 'pulse', 'heartbeat'],
  analytics:  ['data', 'statistics', 'metrics', 'insights'],
  credit:     ['payment', 'card', 'finance'],
  shopping:   ['cart', 'purchase', 'buy', 'ecommerce'],
};

function buildTags(words) {
  const tags = [...new Set(words)];
  for (const word of words) {
    const extra = TAG_EXPANSIONS[word.toLowerCase()];
    if (extra) {
      tags.push(...extra);
    }
  }
  return [...new Set(tags.filter(t => t.length > 1))];
}

// ---------------------------------------------------------------------------
// Human-readable display name from words
// e.g. ["arrow", "right"] → "Arrow Right"
// ---------------------------------------------------------------------------
function buildDisplayName(words) {
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ---------------------------------------------------------------------------
// Header / footer template
// ---------------------------------------------------------------------------
function fileHeader(library, count, generatedBy) {
  return `/**
 * ${library}-icons-full.ts — AUTO-GENERATED, DO NOT EDIT MANUALLY
 *
 * Generated by: ${generatedBy}
 * Icon count:   ${count}
 * Library:      ${library}
 *
 * Contains only serialisable IconDescriptor metadata.
 * Actual React components are resolved at runtime via icon-registry.ts.
 */

import type { IconDescriptor } from '../types/icon';

`;
}

// ---------------------------------------------------------------------------
// TS serialiser: converts an array of IconDescriptor objects to TS source
// ---------------------------------------------------------------------------
function serialiseDescriptors(varName, descriptors) {
  const lines = descriptors.map(d => {
    const tags = JSON.stringify(d.tags);
    const cats = d.categories && d.categories.length > 1
      ? `,\n    categories: ${JSON.stringify(d.categories)}`
      : '';
    return `  {\n    id: ${JSON.stringify(d.id)},\n    name: ${JSON.stringify(d.name)},\n    library: '${d.library}',\n    componentName: ${JSON.stringify(d.componentName)},\n    category: '${d.category}',\n    tags: ${tags}${cats},\n  }`;
  });
  return `export const ${varName}: IconDescriptor[] = [\n${lines.join(',\n')},\n];\n`;
}

// ===========================================================================
// LUCIDE
// ===========================================================================
function generateLucide() {
  const dtsPath = path.join(ROOT, 'node_modules/lucide-react/dist/lucide-react.d.ts');
  const src = fs.readFileSync(dtsPath, 'utf-8');

  // Extract "declare const <Name>:" lines
  const re = /^declare const ([A-Za-z][A-Za-z0-9]*)\s*:/gm;
  const names = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    const n = m[1];
    // Only keep PascalCase names — actual icon components start with uppercase.
    // Utility exports like createLucideIcon, defaultAttributes start with lowercase.
    if (!/^[A-Z]/.test(n)) continue;
    // Skip known non-icon type/helper exports
    if (/^(LucideIcon|LucideProps|IconNode|SVGAttributes)/.test(n)) continue;
    // Skip alias exports (e.g. HomeIcon is an alias of Home — same component)
    if (n.endsWith('Icon') && n.length > 4) continue;
    names.push(n);
  }

  const descriptors = names.map(componentName => {
    const words = splitWords(componentName);
    const category = detectCategory(words);
    const tags = buildTags(words);
    const name = buildDisplayName(words);
    return {
      id: `lucide-${componentName}`,
      name,
      library: 'lucide',
      componentName,
      category,
      tags,
    };
  });

  const output = fileHeader('Lucide', descriptors.length, 'scripts/generate-icons.mjs')
    + serialiseDescriptors('lucideIconsFull', descriptors);

  fs.writeFileSync(path.join(ROOT, 'src/data/lucide-icons-full.ts'), output, 'utf-8');
  return descriptors.length;
}

// ===========================================================================
// TABLER
// ===========================================================================
function generateTabler() {
  const dtsPath = path.join(ROOT, 'node_modules/@tabler/icons-react/dist/tabler-icons-react.d.ts');
  const src = fs.readFileSync(dtsPath, 'utf-8');

  // Collect only the top-level icon declarations.
  // The d.ts has two sections:
  //   1. "declare const Icon<Name>: ..."  — the actual icon declarations
  //   2. "declare const index_Icon<Name>: typeof Icon<Name>"  — re-export aliases
  // We only want section 1 (no "index_" prefix before "Icon").
  const iconNames = new Set();

  // Matches "declare const Icon<Name>:" but NOT "declare const index_Icon<Name>:"
  const declRe = /declare const (Icon[A-Za-z0-9]+)\s*:/g;
  let m;
  while ((m = declRe.exec(src)) !== null) {
    iconNames.add(m[1]);
  }

  const descriptors = [...iconNames].sort().map(componentName => {
    // Strip "Icon" prefix for word splitting
    const stripped = componentName.replace(/^Icon/, '');
    const words = splitWords(stripped);
    const category = detectCategory(words);
    const tags = buildTags(words);
    const name = buildDisplayName(words);
    return {
      id: `tabler-${componentName}`,
      name,
      library: 'tabler',
      componentName,
      category,
      tags,
    };
  });

  const output = fileHeader('Tabler', descriptors.length, 'scripts/generate-icons.mjs')
    + serialiseDescriptors('tablerIconsFull', descriptors);

  fs.writeFileSync(path.join(ROOT, 'src/data/tabler-icons-full.ts'), output, 'utf-8');
  return descriptors.length;
}

// ===========================================================================
// PHOSPHOR
// ===========================================================================
function generatePhosphor() {
  const srcDir = path.join(ROOT, 'node_modules/phosphor-react/src/icons');
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.tsx'));

  // Each file is named like "ArrowRight.tsx" — component name is filename stem
  const componentNames = files.map(f => path.basename(f, '.tsx'));

  const descriptors = componentNames.sort().map(componentName => {
    const words = splitWords(componentName);
    const category = detectCategory(words);
    const tags = buildTags(words);
    const name = buildDisplayName(words);
    return {
      id: `phosphor-${componentName}`,
      name,
      library: 'phosphor',
      componentName,
      category,
      tags,
    };
  });

  const output = fileHeader('Phosphor', descriptors.length, 'scripts/generate-icons.mjs')
    + serialiseDescriptors('phosphorIconsFull', descriptors);

  fs.writeFileSync(path.join(ROOT, 'src/data/phosphor-icons-full.ts'), output, 'utf-8');
  return descriptors.length;
}

// ===========================================================================
// Main
// ===========================================================================
console.log('Generating icon descriptor files...\n');

try {
  const lucideCount = generateLucide();
  console.log(`✓ Lucide:   ${lucideCount} icons  → src/data/lucide-icons-full.ts`);
} catch (e) {
  console.error('✗ Lucide failed:', e.message);
}

try {
  const tablerCount = generateTabler();
  console.log(`✓ Tabler:   ${tablerCount} icons → src/data/tabler-icons-full.ts`);
} catch (e) {
  console.error('✗ Tabler failed:', e.message);
}

try {
  const phosphorCount = generatePhosphor();
  console.log(`✓ Phosphor: ${phosphorCount} icons → src/data/phosphor-icons-full.ts`);
} catch (e) {
  console.error('✗ Phosphor failed:', e.message);
}

console.log('\nDone.');
