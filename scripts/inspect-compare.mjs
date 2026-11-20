import fs from 'node:fs';

const html = fs.readFileSync('data/votersdesk-dump/_compare.html', 'utf-8');
console.log('Compare HTML length:', html.length);
const clean = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                  .replace(/<style[\s\S]*?<\/style>/gi, '')
                  .replace(/<nav[\s\S]*?<\/nav>/gi, '')
                  .replace(/<footer[\s\S]*?<\/footer>/gi, '')
                  .replace(/<[^>]+>/g, '\n')
                  .split('\n')
                  .map(l => l.trim())
                  .filter(l => l.length > 0)
                  .join('\n');
console.log('Clean text:');
console.log(clean);

// Check scripts in chunks for compare
const files = fs.readdirSync('data/votersdesk-dump/chunks');
for (const f of files) {
  const content = fs.readFileSync('data/votersdesk-dump/chunks/' + f, 'utf-8');
  if (content.includes('compare') && content.includes('candidate')) {
    const idx = content.indexOf('Compare candidates');
    if (idx !== -1) {
      console.log(`Found "Compare candidates" in ${f}:`, content.slice(idx - 100, idx + 400));
    }
  }
}
