import fs from 'node:fs';

// Let's inspect the scripts referenced in my-desk
const myDeskHtml = fs.readFileSync('data/votersdesk-dump/_my-desk.html', 'utf-8');
const scriptUrls = [...myDeskHtml.matchAll(/src="(\/_next\/static\/immutable\/chunks\/[^"]+)"/g)].map(m => m[1]);

async function fetchAndAnalyzeChunks() {
  for (const sUrl of scriptUrls) {
    const fullUrl = 'https://votersdesk.ng' + sUrl;
    try {
      const res = await fetch(fullUrl);
      const text = await res.text();
      console.log(`Chunk: ${sUrl} (${text.length} bytes)`);
      if (text.includes('localStorage') || text.includes('watchlist') || text.includes('my-desk') || text.includes('desk') || text.includes('pin') || text.includes('follow')) {
        console.log(` -> matched keywords in ${sUrl}!`);
        // let's see snippets
        const matches = text.match(/.{0,100}(?:localStorage|watchlist|my-desk|followCandidate|savedCandidates).{0,100}/gi);
        if (matches) {
          matches.slice(0, 10).forEach(m => console.log('   snippet:', m));
        }
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}

fetchAndAnalyzeChunks();
