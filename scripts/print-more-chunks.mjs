import fs from 'node:fs';

const content = fs.readFileSync('data/votersdesk-dump/chunks/1f6opdm4p_-vy.js', 'utf-8');
const idx = content.indexOf('lagosDay');
console.log(content.slice(idx, idx + 2500));
