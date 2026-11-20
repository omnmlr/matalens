import fs from 'node:fs';
import path from 'node:path';

const TARGET_PAGES = [
  '/',
  '/my-desk',
  '/ballot',
  '/vote-ready',
  '/president',
  '/politicians/bola-ahmed-tinubu',
  '/politicians/peter-obi',
  '/politicians/funso-doherty-lagos',
  '/promises',
  '/stories',
  '/this-week',
  '/editorial-code',
  '/discussions',
  '/compare',
  '/quiz',
  '/about',
  '/parties',
  '/search',
  '/states/lagos'
];

fs.mkdirSync('data/votersdesk-dump', { recursive: true });

async function fetchPage(p) {
  const url = 'https://votersdesk.ng' + p;
  const fileName = p === '/' ? 'home' : p.replace(/[\/\?#=&]/g, '_');
  const filePath = path.join('data/votersdesk-dump', `${fileName}.html`);

  try {
    console.log(`Fetching: ${url}`);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const text = await res.text();
    fs.writeFileSync(filePath, text);
    console.log(`Saved ${filePath} (status: ${res.status}, size: ${text.length})`);
    return { path: p, status: res.status, size: text.length, error: null };
  } catch (err) {
    console.error(`Failed ${url}: ${err.message}`);
    return { path: p, status: 0, size: 0, error: err.message };
  }
}

async function run() {
  const results = [];
  for (const p of TARGET_PAGES) {
    const res = await fetchPage(p);
    results.push(res);
  }
  fs.writeFileSync('data/votersdesk-dump/summary.json', JSON.stringify(results, null, 2));
  console.log('All done!');
}

run();
