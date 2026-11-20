import fs from 'node:fs';

const myDeskHtml = fs.readFileSync('data/votersdesk-dump/_my-desk.html', 'utf-8');
const scriptUrls = [...myDeskHtml.matchAll(/src="(\/_next\/static\/immutable\/chunks\/[^"]+)"/g)].map(m => m[1]);

async function searchModule() {
  for (const sUrl of scriptUrls) {
    const res = await fetch('https://votersdesk.ng' + sUrl);
    const text = await res.text();
    if (text.includes('DESK_STORAGE_KEY =') || text.includes('DESK_STORAGE_KEY:') || text.includes('DESK_STORAGE_KEY"')) {
      console.log(`Found DESK_STORAGE_KEY in ${sUrl}`);
      const idx = text.indexOf('DESK_STORAGE_KEY');
      console.log(text.slice(Math.max(0, idx - 100), idx + 600));
    }
  }
}

searchModule();
