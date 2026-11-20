import fs from 'node:fs';

const files = fs.readdirSync('data/votersdesk-dump/chunks');
for (const f of files) {
  const content = fs.readFileSync('data/votersdesk-dump/chunks/' + f, 'utf-8');
  const matches = [...content.matchAll(/.{0,50}DESK_STORAGE_KEY.{0,100}/g)];
  if (matches.length > 0) {
    console.log(`=== In ${f} (${matches.length} matches) ===`);
    matches.forEach(m => console.log('  ', m[0]));
  }
}
