import fs from 'node:fs';

const content = fs.readFileSync('data/votersdesk-dump/chunks/1f6opdm4p_-vy.js', 'utf-8');
console.log('Size:', content.length);

const idx = content.indexOf('DESK_STORAGE_KEY');
if (idx !== -1) {
  console.log('Snippet around DESK_STORAGE_KEY:');
  console.log(content.slice(Math.max(0, idx - 100), idx + 2000));
}
