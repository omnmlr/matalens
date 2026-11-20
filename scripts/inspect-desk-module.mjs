import fs from 'node:fs';

async function inspectDeskModule() {
  const url = 'https://votersdesk.ng/_next/static/immutable/chunks/3uhilpmgavfxd.js';
  const res = await fetch(url);
  const text = await res.text();
  fs.writeFileSync('temp_chunk_desk.js', text);

  // Let's also fetch other chunks like 37g0muij06vzg.js or find module definitions
  console.log('Desk chunk length:', text.length);

  // Look for DESK_STORAGE_KEY definition
  const matches = [...text.matchAll(/([a-zA-Z0-9_$]+)\s*=\s*\{[^}]*DESK_STORAGE_KEY[^}]*\}/g)];
  console.log('Matches:', matches.map(m => m[0]));

  // Search for the word DESK_STORAGE_KEY and surroundings
  const idx = text.indexOf('DESK_STORAGE_KEY');
  if (idx !== -1) {
    console.log('Around DESK_STORAGE_KEY:', text.slice(Math.max(0, idx - 200), idx + 500));
  }

  // Also look for DATA_SAVER_KEY
  const dIdx = text.indexOf('DATA_SAVER_KEY');
  if (dIdx !== -1) {
    console.log('Around DATA_SAVER_KEY:', text.slice(Math.max(0, dIdx - 200), dIdx + 500));
  }
}

inspectDeskModule();
