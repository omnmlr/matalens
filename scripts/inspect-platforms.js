// Fetch and extract data from gaski.ng and elect.ng
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, '../docs/design-planning/fetched');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function fetchAndSave(url, filename) {
  try {
    console.log(`Fetching ${url}...`);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    console.log(`${url} -> status ${res.status}`);
    const text = await res.text();
    const filePath = path.join(outDir, filename);
    fs.writeFileSync(filePath, text, 'utf8');
    console.log(`Saved ${filePath} (${text.length} bytes)`);
    return text;
  } catch (err) {
    console.error(`Error fetching ${url}:`, err.message);
    return null;
  }
}

async function run() {
  const urls = [
    // elect.ng
    { url: 'https://elect.ng/', file: 'elect-ng-home-full.html' },
    { url: 'https://elect.ng/news', file: 'elect-ng-news.html' },
    { url: 'https://elect.ng/candidates', file: 'elect-ng-candidates.html' },
    { url: 'https://elect.ng/parties', file: 'elect-ng-parties.html' },
    { url: 'https://elect.ng/leaders', file: 'elect-ng-leaders.html' },
    { url: 'https://elect.ng/results', file: 'elect-ng-results.html' },
    { url: 'https://elect.ng/incidents', file: 'elect-ng-incidents.html' },
    { url: 'https://elect.ng/find-my-polling-unit', file: 'elect-ng-polling-unit.html' },
    { url: 'https://elect.ng/news/feed.xml', file: 'elect-ng-feed.xml' },

    // gaski.ng
    { url: 'https://www.gaski.ng/manifest.webmanifest', file: 'gaski-manifest.json' },
    { url: 'https://www.gaski.ng/assets/index-dHWOURqj.js', file: 'gaski-index.js' },
    { url: 'https://www.gaski.ng/assets/app-shared-BuMyHUEv.js', file: 'gaski-app-shared.js' },
  ];

  for (const item of urls) {
    await fetchAndSave(item.url, item.file);
  }
}

run();
