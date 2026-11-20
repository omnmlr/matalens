import fs from 'node:fs';
import path from 'node:path';

const files = fs.readdirSync('data/votersdesk-dump').filter(f => f.endsWith('.html'));
const allScripts = new Set();

for (const file of files) {
  const html = fs.readFileSync(path.join('data/votersdesk-dump', file), 'utf-8');
  const matches = html.matchAll(/src="(\/_next\/static\/immutable\/chunks\/[^"]+)"/g);
  for (const m of matches) {
    allScripts.add(m[1]);
  }
}

console.log('Total unique script chunks:', allScripts.size);

async function inspectAllChunks() {
  fs.mkdirSync('data/votersdesk-dump/chunks', { recursive: true });
  for (const sUrl of allScripts) {
    const fileName = path.basename(sUrl);
    const savePath = path.join('data/votersdesk-dump/chunks', fileName);
    if (!fs.existsSync(savePath)) {
      try {
        const res = await fetch('https://votersdesk.ng' + sUrl);
        const text = await res.text();
        fs.writeFileSync(savePath, text);
      } catch (e) {
        console.error('Failed to download chunk:', sUrl, e.message);
      }
    }
  }
  console.log('Downloaded all chunks.');

  // Now scan chunks for module definitions
  const chunkFiles = fs.readdirSync('data/votersdesk-dump/chunks');
  for (const cf of chunkFiles) {
    const content = fs.readFileSync(path.join('data/votersdesk-dump/chunks', cf), 'utf-8');
    if (content.includes('DESK_STORAGE_KEY') && !cf.includes('3uhilpmgavfxd')) {
      console.log(`Found DESK_STORAGE_KEY in ${cf}`);
    }
    if (content.includes('38387:')) {
      console.log(`Found module 38387 in ${cf}`);
      const idx = content.indexOf('38387:');
      console.log(content.slice(idx, idx + 800));
    }
    if (content.includes('"vd:desk"') || content.includes("'vd:desk'")) {
      console.log(`Found vd:desk event in ${cf}`);
    }
    if (content.includes('DATA_SAVER_KEY')) {
      console.log(`Found DATA_SAVER_KEY in ${cf}`);
      const idx = content.indexOf('DATA_SAVER_KEY');
      console.log(content.slice(idx, idx + 400));
    }
  }
}

inspectAllChunks();
