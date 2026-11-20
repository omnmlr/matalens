import fs from 'node:fs';

const files = fs.readdirSync('data/votersdesk-dump/chunks');
for (const f of files) {
  const content = fs.readFileSync('data/votersdesk-dump/chunks/' + f, 'utf-8');
  if (content.includes('Pick a race, then two candidates') || content.includes('Candidates can only be compared within the same race')) {
    console.log(`Found compare UI in ${f}`);
    const idx = content.indexOf('Pick a race, then two candidates');
    console.log(content.slice(idx - 100, idx + 1200));
  }
}
