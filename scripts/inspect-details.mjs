import fs from 'node:fs';
import path from 'node:path';

function inspectMyDesk() {
  const html = fs.readFileSync('data/votersdesk-dump/_my-desk.html', 'utf-8');
  console.log('=== MY DESK HTML ANALYSIS ===');
  // Check scripts or client components
  const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/gi)].map(m => m[1]);
  console.log('Scripts:', scripts);
  // Find flight data or payload
  const flight = [...html.matchAll(/self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g)].map(m => m[1]);
  console.log('Flight segments count:', flight.length);
  flight.forEach((f, i) => {
    // unescape
    const clean = f.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    if (clean.includes('watchlist') || clean.includes('desk') || clean.includes('saved') || clean.includes('storage')) {
      console.log(`Flight snippet [${i}] related to my-desk:`, clean.slice(0, 500));
    }
  });
}

function inspectEditorialCode() {
  const html = fs.readFileSync('data/votersdesk-dump/_editorial-code.html', 'utf-8');
  console.log('\n=== EDITORIAL CODE TEXT ===');
  // strip tags
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                   .replace(/<style[\s\S]*?<\/style>/gi, '')
                   .replace(/<nav[\s\S]*?<\/nav>/gi, '')
                   .replace(/<footer[\s\S]*?<\/footer>/gi, '')
                   .replace(/<[^>]+>/g, '\n')
                   .split('\n')
                   .map(l => l.trim())
                   .filter(l => l.length > 0)
                   .join('\n');
  console.log(text.slice(0, 3000));
}

inspectMyDesk();
inspectEditorialCode();
