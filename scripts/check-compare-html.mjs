import fs from 'node:fs';

const html = fs.readFileSync('data/votersdesk-dump/_compare.html', 'utf-8');
const idx = html.indexOf('Pick a race');
console.log('In _compare.html:', html.slice(idx - 200, idx + 800));
