import fs from 'node:fs';

const html = fs.readFileSync('data/votersdesk-dump/_politicians_funso-doherty-lagos.html', 'utf-8');
const text = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                 .replace(/<style[\s\S]*?<\/style>/gi, '')
                 .replace(/<nav[\s\S]*?<\/nav>/gi, '')
                 .replace(/<footer[\s\S]*?<\/footer>/gi, '')
                 .replace(/<[^>]+>/g, '\n')
                 .split('\n')
                 .map(l => l.trim())
                 .filter(l => l.length > 0)
                 .join('\n');
console.log(text.slice(0, 2500));
