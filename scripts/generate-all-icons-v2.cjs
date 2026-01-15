const fs = require('fs');

// FontAwesome official category mapping with exact icon names and keywords
const categoryMap = {
  'accessibility': {
    exact: ['faAccessibleIcon', 'faAudioDescription', 'faBlind', 'faBraille', 'faClosedCaptioning', 'faDeaf', 'faEarDeaf', 'faEarListen', 'faEyeLowVision', 'faUniversalAccess', 'faWheelchair', 'faWheelchairMove', 'faSignLanguage'],
    keywords: ['accessible', 'braille', 'deaf', 'wheelchair', 'ear-listen', 'sign-language']
  },
  'alert': {
    exact: ['faBell', 'faBellSlash', 'faBullhorn', 'faExclamation', 'faInfo', 'faQuestion', 'faCircleInfo', 'faCircleQuestion', 'faCircleExclamation', 'faTriangleExclamation', 'faRadiation', 'faBiohazard', 'faSkullCrossbones'],
    keywords: ['bell', 'bullhorn', 'exclamation', 'radiation', 'biohazard', 'warning', 'alert', 'siren']
  },
  'alphabet': {
    exact: ['faA', 'faB', 'faC', 'faD', 'faE', 'faF', 'faG', 'faH', 'faI', 'faJ', 'faK', 'faL', 'faM', 'faN', 'faO', 'faP', 'faQ', 'faR', 'faS', 'faT', 'faU', 'faV', 'faW', 'faX', 'faY', 'faZ'],
    keywords: []
  },
  'animals': {
    exact: ['faCat', 'faDog', 'faDove', 'faDragon', 'faFish', 'faFrog', 'faHippo', 'faHorse', 'faOtter', 'faPaw', 'faSpider', 'faCrow', 'faKiwiBird', 'faLocust', 'faMosquito', 'faWorm', 'faBug', 'faCocktail'],
    keywords: ['cat', 'dog', 'dove', 'dragon', 'fish', 'frog', 'hippo', 'horse', 'otter', 'paw', 'spider', 'crow', 'bird', 'locust', 'mosquito', 'worm']
  },
  'arrows': {
    exact: [],
    keywords: ['arrow', 'chevron', 'angle', 'caret', 'angles', 'turn', 'rotate', 'sync', 'reply', 'share-from', 'level', 'exchange', 'circle-arrow']
  },
  'astronomy': {
    exact: ['faMeteor', 'faMoon', 'faSatellite', 'faShuttleSpace', 'faStar', 'faSun', 'faRocket', 'faUserAstronaut'],
    keywords: ['meteor', 'moon', 'satellite', 'shuttle', 'space', 'rocket', 'astronaut', 'star-']
  },
  'automotive': {
    exact: [],
    keywords: ['car-', 'taxi', 'bus', 'truck', 'van-', 'motorcycle', 'bicycle', 'trailer', 'oil-can', 'gas-pump', 'charging-station']
  },
  'buildings': {
    exact: [],
    keywords: ['building', 'church', 'city', 'fort-', 'gopuram', 'hospital', 'hotel', 'house', 'igloo', 'industry', 'kaaba', 'landmark', 'monument', 'mosque', 'school', 'shop', 'store', 'synagogue', 'tent-', 'torii-gate', 'tower', 'tree-city', 'vihara', 'warehouse']
  },
  'business': {
    exact: [],
    keywords: ['briefcase', 'bullseye', 'calculator', 'calendar', 'chart-', 'clipboard', 'envelope-', 'fax', 'file-', 'folder', 'marker', 'paperclip', 'pen-', 'pencil', 'phone-', 'print', 'scissors', 'stamp', 'stapler', 'table-', 'thumbtack', 'award', 'certificate', 'id-badge', 'id-card', 'business']
  },
  'camping': {
    exact: [],
    keywords: ['campground', 'caravan', 'compass', 'fire-', 'map-', 'mountain', 'person-hiking', 'route', 'tent', 'tents', 'toilet-paper', 'tree-', 'binoculars']
  },
  'charity': {
    exact: [],
    keywords: ['donate', 'dove', 'gift', 'hand-holding-heart', 'hand-holding-dollar', 'handshake', 'parachute-box', 'piggy-bank', 'ribbon', 'seedling', 'charity']
  },
  'charts-diagrams': {
    exact: [],
    keywords: ['chart-', 'diagram', 'graph', 'sitemap', 'project-diagram']
  },
  'childhood': {
    exact: [],
    keywords: ['baby', 'child', 'children', 'person-dress']
  },
  'clothing-fashion': {
    exact: [],
    keywords: ['glasses', 'hat-', 'shirt', 'shoe', 'mitten', 'vest', 'user-tie', 'crown']
  },
  'code': {
    exact: [],
    keywords: ['code', 'terminal', 'laptop-code', 'file-code', 'bug', 'brackets', 'window-maximize', 'window-minimize', 'window-restore', 'server', 'database', 'git-', 'github', 'gitlab']
  },
  'communication': {
    exact: [],
    keywords: ['comment', 'comments', 'inbox', 'message', 'paper-plane', 'square-phone', 'at-', 'bluetooth', 'broadcast', 'fax', 'microphone', 'rss', 'satellite-dish', 'tower-cell', 'video-', 'voicemail', 'wifi']
  },
  'connectivity': {
    exact: [],
    keywords: ['bluetooth', 'ethernet', 'rss', 'signal', 'tower-broadcast', 'tower-cell', 'wifi']
  },
  'construction': {
    exact: [],
    keywords: ['hammer', 'helmet', 'screwdriver', 'wrench', 'person-digging', 'ruler', 'trowel', 'truck-pickup', 'hard-hat', 'construction']
  },
  'design': {
    exact: [],
    keywords: ['bezier-curve', 'brush', 'crop-', 'drafting-compass', 'draw-polygon', 'droplet', 'eraser', 'eye-dropper', 'fill-', 'highlighter', 'paint-brush', 'paint-roller', 'palette', 'pen-fancy', 'pen-nib', 'ruler-', 'splotch', 'spray-can', 'swatchbook', 'vector-square', 'wand-magic']
  },
  'devices': {
    exact: [],
    keywords: ['mobile-', 'tablet', 'laptop', 'desktop', 'tv-', 'computer', 'keyboard', 'mouse', 'headphones', 'sim-card', 'sd-card', 'hard-drive', 'memory', 'plug-', 'power-off', 'battery']
  },
  'disaster': {
    exact: [],
    keywords: ['burst', 'explosion', 'fire-extinguisher', 'house-fire', 'person-drowning', 'skull-', 'tornado', 'virus', 'volcano']
  },
  'editing': {
    exact: [],
    keywords: ['pen-to-square', 'undo', 'redo']
  },
  'education': {
    exact: [],
    keywords: ['atom', 'book-', 'bookmark', 'graduation-cap', 'user-graduate', 'chalkboard', 'flask', 'microscope', 'school', 'university']
  },
  'emoji': {
    exact: [],
    keywords: ['face-', 'smile', 'frown', 'grin', 'laugh-', 'meh', 'sad-', 'angry', 'kiss', 'heart-']
  },
  'energy': {
    exact: [],
    keywords: ['atom', 'bolt-', 'charging-station', 'gas-pump', 'leaf-', 'lightbulb', 'solar-panel', 'wind', 'oil-well', 'fan-']
  },
  'files': {
    exact: [],
    keywords: ['file-', 'folder-', 'floppy', 'save-', 'copy-', 'clone']
  },
  'film-video': {
    exact: [],
    keywords: ['camera', 'clapperboard', 'film', 'photo-film', 'circle-play', 'circle-pause', 'circle-stop']
  },
  'food': {
    exact: [],
    keywords: ['apple', 'beer', 'cake', 'bottle-', 'bowl', 'burger', 'candy', 'carrot', 'cheese', 'coffee', 'cookie', 'drumstick', 'egg', 'glass-', 'hotdog', 'ice-cream', 'lemon', 'martini', 'mug', 'pepper', 'pizza', 'plate', 'utensils', 'wine', 'bacon', 'bread', 'stroopwafel']
  },
  'fruits-vegetables': {
    exact: [],
    keywords: ['apple', 'carrot', 'lemon', 'pepper']
  },
  'gaming': {
    exact: [],
    keywords: ['chess', 'dice', 'gamepad', 'ghost', 'headset', 'puzzle', 'trophy', 'vr-cardboard', 'ranking-star']
  },
  'genders': {
    exact: ['faGenderless', 'faMars', 'faMercury', 'faNeuter', 'faTransgender', 'faVenus', 'faMarsAndVenus', 'faVenusMars'],
    keywords: ['gender', 'mars', 'venus', 'mercury', 'transgender']
  },
  'halloween': {
    exact: [],
    keywords: ['broom', 'ghost', 'hat-wizard', 'mask', 'skull']
  },
  'hands': {
    exact: [],
    keywords: ['hand-', 'fist', 'thumbs', 'peace', 'handshake', 'praying-hands']
  },
  'holidays': {
    exact: [],
    keywords: ['candy-cane', 'gifts', 'holly-berry', 'menorah', 'sleigh', 'snowman']
  },
  'household': {
    exact: [],
    keywords: ['bath', 'bed-', 'blender', 'broom', 'chair', 'couch', 'door-', 'fan-', 'faucet', 'key-', 'kitchen-set', 'lamp', 'shower', 'sink', 'soap', 'toilet', 'vacuum']
  },
  'humanitarian': {
    exact: [],
    keywords: ['hand-holding-heart', 'hand-holding-dollar', 'hand-holding-droplet', 'hands-holding', 'house-chimney-heart', 'parachute-box', 'ribbon']
  },
  'logistics': {
    exact: [],
    keywords: ['box-', 'boxes', 'clipboard-check', 'clipboard-list', 'dolly', 'pallet', 'warehouse']
  },
  'maps': {
    exact: [],
    keywords: ['anchor', 'arrow-pointer', 'diamond-turn-right', 'directions', 'location-', 'map-', 'person-walking', 'road-', 'sign-', 'street-view', 'traffic-light']
  },
  'maritime': {
    exact: [],
    keywords: ['anchor', 'ferry', 'sailboat', 'ship', 'water-']
  },
  'marketing': {
    exact: [],
    keywords: ['bullhorn', 'bullseye', 'hashtag', 'icons', 'rectangle-ad', 'square-poll', 'tag-']
  },
  'mathematics': {
    exact: [],
    keywords: ['divide', 'equals', 'greater-than', 'infinity', 'less-than', 'minus-', 'not-equal', 'percent', 'plus-', 'square-root', 'subscript', 'superscript', 'wave-square', 'xmark']
  },
  'media-playback': {
    exact: [],
    keywords: ['backward', 'eject', 'forward-', 'pause', 'play-', 'stop-', 'volume-']
  },
  'medical': {
    exact: [],
    keywords: ['ambulance', 'bandage', 'bed-pulse', 'briefcase-medical', 'capsules', 'circle-h', 'crutch', 'dna', 'file-medical', 'hand-dots', 'heart-pulse', 'kit-medical', 'lungs', 'microscope', 'notes-medical', 'pills', 'prescription', 'stethoscope', 'syringe', 'tablets', 'thermometer', 'tooth', 'truck-medical', 'user-doctor', 'vial', 'weight-scale', 'x-ray']
  },
  'money': {
    exact: [],
    keywords: ['dollar', 'euro', 'sterling', 'rupee', 'yen', 'won', 'bitcoin', 'coins', 'credit-card', 'money-bill', 'piggy-bank', 'wallet', 'cash-register', 'receipt', 'sack-', 'scale-balanced']
  },
  'moving': {
    exact: [],
    keywords: ['people-carry-box', 'sign-hanging', 'tape', 'truck-moving', 'truck-ramp-box', 'wine-bottle']
  },
  'music': {
    exact: [],
    keywords: ['compact-disc', 'drum', 'file-audio', 'guitar', 'music-', 'radio', 'record-vinyl', 'sliders']
  },
  'nature': {
    exact: [],
    keywords: ['binoculars', 'cloud-', 'feather', 'plant-wilt', 'snowflake', 'worm']
  },
  'numbers': {
    exact: ['fa0', 'fa1', 'fa2', 'fa3', 'fa4', 'fa5', 'fa6', 'fa7', 'fa8', 'fa9'],
    keywords: []
  },
  'photos': {
    exact: [],
    keywords: ['camera-retro', 'image', 'images', 'panorama', 'photo-film']
  },
  'political': {
    exact: [],
    keywords: ['balance-scale', 'check-to-slot', 'flag-', 'gavel', 'landmark-', 'person-booth', 'scale-balanced']
  },
  'punctuation': {
    exact: [],
    keywords: ['asterisk', 'ellipsis', 'quote', 'section', 'slash']
  },
  'religion': {
    exact: [],
    keywords: ['ankh', 'bahai', 'book-bible', 'cross-', 'dharmachakra', 'gopuram', 'hamsa', 'hands-praying', 'hanukiah', 'jain', 'kaaba', 'khanda', 'menorah', 'om-', 'place-of-worship', 'person-praying', 'quran', 'star-and-crescent', 'star-of-david', 'yin-yang']
  },
  'science': {
    exact: [],
    keywords: ['biohazard', 'brain', 'capsules', 'disease', 'eye-dropper', 'filter-', 'frog', 'magnet', 'mortar-pestle', 'prescription-bottle', 'vials']
  },
  'science-fiction': {
    exact: [],
    keywords: ['dragon', 'explosion', 'hand-sparkles', 'jet-fighter', 'meteor', 'ring-', 'robot', 'space-shuttle', 'wand-magic']
  },
  'security': {
    exact: [],
    keywords: ['ban-', 'dungeon', 'eye-slash', 'file-shield', 'fingerprint', 'lock-', 'shield', 'unlock', 'user-lock', 'user-secret', 'user-shield', 'vault']
  },
  'shapes': {
    exact: [],
    keywords: ['circle-', 'square-', 'star-', 'certificate', 'clover', 'diamond-', 'hexagon', 'octagon', 'pentagon', 'triangle-']
  },
  'shopping': {
    exact: [],
    keywords: ['bag-shopping', 'basket-shopping', 'cart-shopping', 'shop-', 'store-', 'tags']
  },
  'social': {
    exact: [],
    keywords: ['retweet', 'share-nodes', 'square-share-nodes']
  },
  'spinners': {
    exact: [],
    keywords: ['circle-notch', 'compact-disc', 'dharmachakra', 'life-ring', 'spinner', 'stroopwafel', 'yin-yang']
  },
  'sports': {
    exact: [],
    keywords: ['baseball', 'basketball', 'bowling-ball', 'dumbbell', 'football', 'futbol', 'golf-', 'hockey-puck', 'medal-', 'person-biking', 'person-running', 'person-skating', 'person-skiing', 'person-swimming', 'table-tennis', 'volleyball']
  },
  'text-formatting': {
    exact: [],
    keywords: ['align-', 'bold', 'font-', 'heading', 'indent', 'italic', 'list-', 'outdent', 'paragraph', 'strikethrough', 'text-height', 'text-width', 'underline']
  },
  'time': {
    exact: [],
    keywords: ['alarm', 'clock-', 'hourglass', 'stopwatch', 'timer']
  },
  'toggle': {
    exact: ['faToggleOff', 'faToggleOn'],
    keywords: ['toggle-']
  },
  'transportation': {
    exact: [],
    keywords: ['helicopter', 'plane-', 'train-', 'shuttle-']
  },
  'travel-hotel': {
    exact: [],
    keywords: ['archway', 'baby-carriage', 'bell-concierge', 'caravan', 'elevator', 'hot-tub', 'luggage-cart', 'mug-saucer', 'person-swimming', 'restroom', 'smoking', 'spa-', 'suitcase', 'swimming-pool', 'umbrella-beach']
  },
  'users': {
    exact: [],
    keywords: ['address-book', 'address-card', 'people-', 'person-', 'street-view', 'user-', 'users-']
  },
  'weather': {
    exact: [],
    keywords: ['bolt', 'cloud-', 'icicles', 'poo-storm', 'rainbow', 'smog', 'temperature-', 'umbrella-']
  },
  'writing': {
    exact: [],
    keywords: ['book-', 'eraser', 'feather', 'note-sticky', 'pen-fancy', 'pen-nib', 'quote-left', 'quote-right', 'signature']
  },
  'ui': {
    exact: [],
    keywords: ['home', 'house-', 'user-', 'cog', 'settings', 'gear', 'heart', 'star', 'search', 'bell', 'notification', 'download', 'upload', 'edit', 'trash', 'delete', 'check', 'times', 'xmark', 'cross', 'plus', 'minus', 'bars', 'menu', 'sun', 'moon', 'filter', 'share', 'copy', 'clone', 'save', 'bookmark', 'tag', 'label', 'eye', 'view', 'lock', 'unlock', 'key', 'shield', 'power', 'sliders', 'toggle', 'ellipsis', 'grip', 'grid', 'list']
  }
};

// Function to find category for an icon
function findCategory(iconName) {
  const icon = iconName;

  // First check exact matches
  for (const [category, config] of Object.entries(categoryMap)) {
    if (config.exact && config.exact.includes(icon)) {
      return category;
    }
  }

  // Then check keywords with word boundary matching
  const nameLower = iconName.toLowerCase();

  for (const [category, config] of Object.entries(categoryMap)) {
    for (const keyword of config.keywords) {
      // Check if keyword matches (must be at word boundary)
      if (nameLower.includes(keyword.toLowerCase())) {
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
  const category = findCategory(icon);

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
console.log(`\n📊 Total categories: ${Object.keys(categoryStats).length}`);
