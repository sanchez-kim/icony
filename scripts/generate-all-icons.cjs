const fs = require('fs');

// FontAwesome official category mapping
const categoryMap = {
  // Accessibility
  'accessibility': ['accessible', 'audio-description', 'blind', 'braille', 'closed-captioning', 'deaf', 'ear-deaf', 'ear-listen', 'eye', 'eye-low-vision', 'universal-access', 'wheelchair', 'sign-language'],

  // Alert
  'alert': ['bell', 'bullhorn', 'exclamation', 'info', 'question', 'circle-info', 'circle-question', 'circle-exclamation', 'triangle-exclamation', 'radiation', 'biohazard', 'skull-crossbones'],

  // Alphabet
  'alphabet': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],

  // Animals
  'animals': ['cat', 'dog', 'dove', 'dragon', 'fish', 'frog', 'hippo', 'horse', 'otter', 'paw', 'spider', 'crow', 'kiwi-bird', 'locust', 'mosquito', 'worm'],

  // Arrows
  'arrows': ['arrow', 'chevron', 'angle', 'caret', 'angles', 'circle-arrow', 'turn', 'rotate', 'sync', 'reply', 'share', 'level', 'exchange'],

  // Astronomy
  'astronomy': ['meteor', 'moon', 'satellite', 'shuttle', 'space', 'star', 'sun', 'rocket', 'user-astronaut'],

  // Automotive
  'automotive': ['car', 'taxi', 'bus', 'truck', 'van', 'motorcycle', 'bicycle', 'trailer', 'oil-can', 'gas-pump', 'charging-station'],

  // Buildings
  'buildings': ['building', 'church', 'city', 'fort', 'gopuram', 'hospital', 'hotel', 'house', 'igloo', 'industry', 'kaaba', 'landmark', 'monument', 'mosque', 'school', 'shop', 'store', 'synagogue', 'tent', 'torii-gate', 'tower', 'tree-city', 'vihara', 'warehouse'],

  // Business
  'business': ['briefcase', 'bullseye', 'calculator', 'calendar', 'chart', 'clipboard', 'copy', 'cut', 'envelope', 'fax', 'file', 'folder', 'marker', 'paperclip', 'paste', 'pen', 'pencil', 'phone', 'print', 'save', 'scissors', 'stamp', 'stapler', 'table', 'tag', 'thumbtack', 'award', 'certificate', 'id-badge', 'id-card'],

  // Camping
  'camping': ['campground', 'caravan', 'compass', 'fire', 'map', 'mountain', 'person-hiking', 'route', 'tent', 'tents', 'toilet-paper', 'tree', 'binoculars'],

  // Charity
  'charity': ['dollar', 'donate', 'dove', 'gift', 'hand-holding-heart', 'hand-holding-dollar', 'handshake', 'heart', 'leaf', 'parachute-box', 'piggy-bank', 'ribbon', 'seedling'],

  // Charts + Diagrams
  'charts-diagrams': ['chart', 'diagram', 'graph', 'sitemap', 'project-diagram'],

  // Childhood
  'childhood': ['baby', 'child', 'children', 'person-dress'],

  // Clothing + Fashion
  'clothing-fashion': ['glasses', 'hat', 'shirt', 'shoe', 'mitten', 'vest', 'user-tie'],

  // Coding
  'code': ['code', 'terminal', 'laptop-code', 'file-code', 'bug', 'brackets', 'window-maximize', 'window-minimize', 'window-restore', 'server', 'database', 'cloud', 'git'],

  // Communication
  'communication': ['comment', 'comments', 'envelope', 'inbox', 'message', 'paper-plane', 'phone', 'mobile', 'square-phone', 'at', 'bluetooth', 'broadcast-tower', 'fax', 'microphone', 'rss', 'satellite-dish', 'tower-cell', 'video', 'voicemail', 'wifi'],

  // Connectivity
  'connectivity': ['bluetooth', 'ethernet', 'rss', 'signal', 'tower-broadcast', 'tower-cell', 'wifi'],

  // Construction
  'construction': ['hammer', 'helmet', 'screwdriver', 'wrench', 'person-digging', 'ruler', 'trowel', 'truck-pickup'],

  // Design
  'design': ['bezier-curve', 'brush', 'compass', 'crop', 'drafting-compass', 'draw-polygon', 'droplet', 'eraser', 'eye-dropper', 'fill', 'highlighter', 'marker', 'paint-brush', 'paint-roller', 'palette', 'pen', 'pen-fancy', 'pen-nib', 'pencil', 'ruler', 'ruler-combined', 'ruler-horizontal', 'ruler-vertical', 'scissors', 'splotch', 'spray-can', 'stamp', 'swatchbook', 'vector-square', 'wand-magic'],

  // Devices + Hardware
  'devices': ['mobile', 'tablet', 'laptop', 'desktop', 'tv', 'computer', 'keyboard', 'mouse', 'headphones', 'microphone', 'camera', 'video', 'phone', 'fax', 'print', 'scanner', 'sim-card', 'sd-card', 'hard-drive', 'memory', 'server', 'plug', 'power-off', 'battery', 'ethernet', 'wifi', 'bluetooth'],

  // Disaster + Crisis
  'disaster': ['biohazard', 'burst', 'explosion', 'fire', 'fire-extinguisher', 'house-fire', 'person-drowning', 'radiation', 'skull', 'tornado', 'triangle-exclamation', 'virus', 'volcano', 'water'],

  // Editing
  'editing': ['check', 'pen', 'pen-to-square', 'pencil', 'eraser', 'highlighter', 'marker', 'scissors', 'paste', 'copy', 'cut', 'trash', 'undo', 'rotate-left', 'redo', 'rotate-right'],

  // Education
  'education': ['atom', 'award', 'book', 'bookmark', 'graduation-cap', 'pencil', 'school', 'user-graduate', 'chalkboard', 'flask', 'microscope', 'calculator'],

  // Emoji
  'emoji': ['face', 'smile', 'frown', 'grin', 'laugh', 'meh', 'sad', 'angry', 'kiss', 'heart', 'thumbs', 'hand'],

  // Energy
  'energy': ['atom', 'battery', 'bolt', 'charging-station', 'fire', 'gas-pump', 'leaf', 'lightbulb', 'plug', 'power-off', 'solar-panel', 'sun', 'wind', 'oil-well'],

  // Files
  'files': ['file', 'folder', 'copy', 'clone', 'floppy', 'save'],

  // Film + Video
  'film-video': ['camera', 'clapperboard', 'film', 'photo-film', 'video', 'circle', 'play', 'pause', 'stop', 'forward', 'backward'],

  // Food + Beverage
  'food': ['apple', 'beer', 'birthday-cake', 'bottle', 'bowl', 'burger', 'cake', 'candy', 'carrot', 'cheese', 'coffee', 'cookie', 'drumstick', 'egg', 'fish', 'glass', 'hotdog', 'ice-cream', 'lemon', 'martini', 'mug', 'pepper', 'pizza', 'plate', 'utensils', 'wine', 'bacon', 'bread', 'stroopwafel'],

  // Fruits + Vegetables
  'fruits-vegetables': ['apple', 'carrot', 'lemon', 'pepper'],

  // Gaming
  'gaming': ['chess', 'dice', 'gamepad', 'ghost', 'headset', 'puzzle', 'trophy', 'vr-cardboard'],

  // Genders
  'genders': ['genderless', 'mars', 'mercury', 'neuter', 'transgender', 'venus'],

  // Halloween
  'halloween': ['broom', 'cat', 'ghost', 'hat-wizard', 'mask', 'skull', 'spider'],

  // Hands
  'hands': ['hand', 'fist', 'thumbs', 'peace', 'handshake', 'praying-hands'],

  // Holidays
  'holidays': ['candy-cane', 'gifts', 'holly-berry', 'menorah', 'sleigh', 'snowman'],

  // Household
  'household': ['bath', 'bed', 'blender', 'broom', 'chair', 'couch', 'door', 'fan', 'faucet', 'house', 'key', 'kitchen-set', 'lamp', 'lightbulb', 'plug', 'shower', 'sink', 'soap', 'toilet', 'tv', 'utensils', 'vacuum'],

  // Humanitarian
  'humanitarian': ['hand-holding-heart', 'hand-holding-dollar', 'hand-holding-droplet', 'hands-holding', 'handshake', 'heart', 'house-chimney-heart', 'parachute-box', 'person', 'ribbon'],

  // Logistics
  'logistics': ['box', 'boxes', 'clipboard-check', 'clipboard-list', 'dolly', 'pallet', 'route', 'truck', 'warehouse'],

  // Maps
  'maps': ['anchor', 'arrow-pointer', 'compass', 'diamond-turn-right', 'directions', 'draw-polygon', 'location', 'map', 'map-pin', 'mountain', 'person-walking', 'road', 'route', 'sign', 'street-view', 'traffic-light', 'tree'],

  // Maritime
  'maritime': ['anchor', 'ferry', 'fish', 'sailboat', 'ship', 'water'],

  // Marketing
  'marketing': ['bullhorn', 'bullseye', 'comment', 'envelope', 'hashtag', 'icons', 'rectangle-ad', 'square-poll-horizontal', 'tag'],

  // Mathematics
  'mathematics': ['calculator', 'divide', 'equals', 'greater-than', 'infinity', 'less-than', 'minus', 'not-equal', 'percent', 'plus', 'square-root', 'subscript', 'superscript', 'wave-square', 'xmark'],

  // Media Playback
  'media-playback': ['backward', 'circle-pause', 'circle-play', 'circle-stop', 'eject', 'forward', 'pause', 'play', 'stop', 'volume'],

  // Medical + Health
  'medical': ['ambulance', 'bandage', 'bed-pulse', 'briefcase-medical', 'capsules', 'circle-h', 'crutch', 'dna', 'file-medical', 'hand-dots', 'heart', 'heart-pulse', 'hospital', 'kit-medical', 'lungs', 'microscope', 'notes-medical', 'pills', 'plus', 'prescription', 'skull', 'stethoscope', 'syringe', 'tablets', 'thermometer', 'tooth', 'truck-medical', 'user-doctor', 'vial', 'virus', 'weight-scale', 'x-ray'],

  // Money
  'money': ['dollar', 'euro', 'sterling', 'rupee', 'yen', 'won', 'bitcoin', 'coins', 'credit-card', 'money-bill', 'piggy-bank', 'wallet', 'cash-register', 'receipt', 'sack', 'scale-balanced'],

  // Moving
  'moving': ['box', 'couch', 'dolly', 'people-carry-box', 'route', 'sign-hanging', 'tape', 'truck-moving', 'truck-ramp-box', 'wine-bottle'],

  // Music + Audio
  'music': ['compact-disc', 'drum', 'file-audio', 'guitar', 'headphones', 'microphone', 'music', 'radio', 'record-vinyl', 'sliders', 'volume'],

  // Nature
  'nature': ['binoculars', 'bug', 'cloud', 'feather', 'fire', 'leaf', 'mountain', 'paw', 'plant-wilt', 'seedling', 'snowflake', 'spider', 'tree', 'water', 'wind', 'worm'],

  // Numbers
  'numbers': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],

  // Photos + Images
  'photos': ['camera', 'camera-retro', 'image', 'images', 'panorama', 'photo-film', 'sliders'],

  // Political
  'political': ['award', 'balance-scale', 'bullhorn', 'check-to-slot', 'flag', 'gavel', 'landmark', 'person-booth', 'scale-balanced'],

  // Punctuation + Symbols
  'punctuation': ['asterisk', 'at', 'check', 'circle', 'ellipsis', 'exclamation', 'hashtag', 'minus', 'percent', 'plus', 'question', 'quote', 'section', 'slash', 'xmark'],

  // Religion
  'religion': ['ankh', 'atom', 'bahai', 'book-bible', 'church', 'cross', 'dharmachakra', 'dove', 'gopuram', 'hamsa', 'hands-praying', 'hanukiah', 'jain', 'kaaba', 'khanda', 'menorah', 'mosque', 'om', 'peace', 'person-praying', 'place-of-worship', 'pray', 'praying-hands', 'quran', 'star-and-crescent', 'star-of-david', 'synagogue', 'torii-gate', 'vihara', 'yin-yang'],

  // Science
  'science': ['atom', 'biohazard', 'brain', 'capsules', 'disease', 'dna', 'eye-dropper', 'filter', 'fire', 'flask', 'frog', 'magnet', 'microscope', 'mortar-pestle', 'pills', 'prescription-bottle', 'radiation', 'seedling', 'skull', 'syringe', 'tablets', 'temperature', 'vial', 'vials'],

  // Science Fiction
  'science-fiction': ['dragon', 'explosion', 'hand-sparkles', 'hat-wizard', 'jet-fighter', 'meteor', 'radiation', 'ring', 'robot', 'rocket', 'satellite', 'space-shuttle', 'user-astronaut', 'wand-magic'],

  // Security
  'security': ['ban', 'bug', 'bullseye', 'burst', 'dungeon', 'explosion', 'eye', 'eye-slash', 'file-shield', 'fingerprint', 'key', 'lock', 'shield', 'shield-halved', 'unlock', 'user-lock', 'user-secret', 'user-shield', 'vault'],

  // Shapes
  'shapes': ['circle', 'square', 'heart', 'star', 'certificate', 'clover', 'diamond', 'hexagon', 'octagon', 'pentagon', 'play', 'shield', 'snowflake', 'square', 'triangle'],

  // Shopping
  'shopping': ['bag-shopping', 'basket-shopping', 'bell', 'bookmark', 'cart-shopping', 'credit-card', 'gift', 'gifts', 'percent', 'receipt', 'shop', 'store', 'tag', 'tags', 'wallet'],

  // Social
  'social': ['comment', 'hashtag', 'heart', 'icons', 'message', 'retweet', 'share', 'share-nodes', 'square-share-nodes', 'thumbs-up', 'thumbs-down', 'user', 'users'],

  // Spinners
  'spinners': ['atom', 'bahai', 'circle-notch', 'compact-disc', 'dharmachakra', 'fan', 'life-ring', 'ring', 'slash', 'spinner', 'stroopwafel', 'yin-yang'],

  // Sports + Fitness
  'sports': ['baseball', 'basketball', 'bowling-ball', 'dumbbell', 'football', 'futbol', 'golf', 'heart-pulse', 'hockey-puck', 'medal', 'person-biking', 'person-running', 'person-skating', 'person-skiing', 'person-swimming', 'skating', 'skiing', 'snowboarding', 'table-tennis', 'trophy', 'volleyball', 'weight-hanging'],

  // Text Formatting
  'text-formatting': ['align-center', 'align-justify', 'align-left', 'align-right', 'bold', 'font', 'heading', 'indent', 'italic', 'list', 'outdent', 'paragraph', 'quote', 'strikethrough', 'subscript', 'superscript', 'text-height', 'text-width', 'underline'],

  // Time
  'time': ['alarm', 'bell', 'calendar', 'clock', 'hourglass', 'stopwatch', 'timer'],

  // Toggle
  'toggle': ['toggle-off', 'toggle-on'],

  // Transportation
  'transportation': ['bicycle', 'bus', 'car', 'helicopter', 'motorcycle', 'plane', 'rocket', 'ship', 'shuttle', 'taxi', 'train', 'truck', 'van'],

  // Travel + Hotel
  'travel-hotel': ['archway', 'baby-carriage', 'bag-shopping', 'bath', 'bed', 'bell', 'bell-concierge', 'briefcase', 'building', 'car', 'caravan', 'door-closed', 'door-open', 'dumbbell', 'elevator', 'hotel', 'hot-tub', 'house', 'key', 'kitchen-set', 'luggage-cart', 'map', 'map-pin', 'martini-glass', 'mug-saucer', 'person-swimming', 'plane', 'restroom', 'road', 'shower', 'smoking', 'smoking-ban', 'snowflake', 'spa', 'suitcase', 'swimming-pool', 'taxi', 'toilet', 'tree', 'tv', 'umbrella-beach', 'utensils', 'wheelchair', 'wifi', 'wine-glass'],

  // Users + People
  'users': ['address-book', 'address-card', 'child', 'children', 'people', 'person', 'street-view', 'user', 'users'],

  // Weather
  'weather': ['bolt', 'cloud', 'cloud-rain', 'cloud-showers-heavy', 'cloud-sun', 'icicles', 'moon', 'poo-storm', 'rainbow', 'smog', 'snowflake', 'sun', 'temperature', 'tornado', 'umbrella', 'water', 'wind'],

  // Writing
  'writing': ['book', 'bookmark', 'envelope', 'eraser', 'feather', 'file', 'folder', 'highlighter', 'marker', 'note-sticky', 'paper-plane', 'paperclip', 'pen', 'pen-fancy', 'pen-nib', 'pencil', 'quote-left', 'quote-right', 'signature', 'stamp']
};

// Function to find category for an icon
function findCategory(iconName) {
  const nameLower = iconName.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryMap)) {
    for (const keyword of keywords) {
      if (nameLower.includes(keyword)) {
        return category;
      }
    }
  }

  return 'other';
}

// Read all available icons
const allIcons = fs.readFileSync('all-icons.txt', 'utf-8').split('\n').filter(Boolean);

console.log(`Total available icons: ${allIcons.length}`);

// Generate icon data
const iconData = allIcons.map(icon => {
  const iconName = icon.substring(2); // Remove 'fa' prefix
  const category = findCategory(iconName);

  // Convert camelCase to kebab-case for ID
  const id = 'fa-' + iconName.replace(/([A-Z])/g, '-$1').toLowerCase();

  // Convert camelCase to Title Case for name
  const name = iconName.replace(/([A-Z])/g, ' $1').trim();

  return {
    icon,
    id,
    name,
    category
  };
});

// Group by category for stats
const categoryStats = {};
iconData.forEach(({ category }) => {
  categoryStats[category] = (categoryStats[category] || 0) + 1;
});

console.log('\nIcons by category:');
Object.entries(categoryStats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });

// Generate import statement (in chunks to avoid too long lines)
const chunkSize = 10;
const iconChunks = [];
for (let i = 0; i < iconData.length; i += chunkSize) {
  iconChunks.push(iconData.slice(i, i + chunkSize).map(item => item.icon).join(', '));
}
const imports = iconChunks.join(',\n  ');

// Generate icon objects
const iconObjects = iconData.map(({ id, name, category, icon }) => {
  return `  { id: '${id}', name: '${name}', category: '${category}', tags: [], type: 'fontawesome', component: ${icon} }`;
}).join(',\n');

// Write the complete file
const output = `// FontAwesome Free Solid Icons - Complete Collection (${iconData.length} icons)
import {
  ${imports}
} from '@fortawesome/free-solid-svg-icons';
import { Icon } from '../types';

export const fontAwesomeIcons: Icon[] = [
${iconObjects}
];
`;

fs.writeFileSync('src/data/fontawesome-icons.ts', output);
console.log(`\n✅ Generated fontawesome-icons.ts with ${iconData.length} icons`);
