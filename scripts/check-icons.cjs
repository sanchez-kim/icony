const icons = require('@fortawesome/free-solid-svg-icons');
const allIcons = Object.keys(icons).filter(k =>
  k.startsWith('fa') &&
  k !== 'fas' &&
  k !== 'far' &&
  k !== 'fab' &&
  k !== 'prefix' &&
  k !== 'faRankingStar'
);

console.log('Total available icons:', allIcons.length);
console.log('\nFirst 50 icons:');
allIcons.slice(0, 50).forEach((icon, i) => {
  console.log(`${i+1}. ${icon}`);
});

// Check for specific icons
const needed = ['faBalanceScale', 'faFlask', 'faFileContract'];
console.log('\nChecking needed icons:');
needed.forEach(icon => {
  console.log(`${icon}: ${allIcons.includes(icon) ? '✓ Available' : '✗ Missing'}`);
});

console.log('\nAll icon names written to all-icons.txt');
require('fs').writeFileSync('all-icons.txt', allIcons.join('\n'));
