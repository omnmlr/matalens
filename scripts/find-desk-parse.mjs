import fs from 'node:fs';

const content = fs.readFileSync('data/votersdesk-dump/chunks/1f6opdm4p_-vy.js', 'utf-8');

// Look for DESK_STORAGE_KEY declaration
const matches = [...content.matchAll(/DESK_STORAGE_KEY\s*=\s*["']([^"']+)["']/g)];
console.log('Matches:', matches.map(m => m[0]));

// Let's search all occurrences of parseDesk
const parseMatches = [...content.matchAll(/parseDesk\s*=\s*function[^{]*\{[\s\S]*?\}/g)];
if (parseMatches.length) {
  console.log('parseDesk:', parseMatches[0][0]);
}

// Or find the definition in other chunks
const allChunkFiles = fs.readdirSync('data/votersdesk-dump/chunks');
for (const f of allChunkFiles) {
  const c = fs.readFileSync('data/votersdesk-dump/chunks/' + f, 'utf-8');
  if (c.includes('DESK_STORAGE_KEY=')) {
    const idx = c.indexOf('DESK_STORAGE_KEY=');
    console.log(`In ${f}:`, c.slice(idx - 50, idx + 800));
  }
}
