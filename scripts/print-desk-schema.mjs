import fs from 'node:fs';

const content = fs.readFileSync('data/votersdesk-dump/chunks/1f6opdm4p_-vy.js', 'utf-8');
const idx = content.indexOf('MAX_DESK_POLITICIANS');
console.log(content.slice(idx - 1000, idx + 1500));
