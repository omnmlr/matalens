import fs from 'node:fs';

async function fetchCss() {
  const url = 'https://votersdesk.ng/_next/static/immutable/chunks/3-wxpf6w9jpsb.css';
  const res = await fetch(url);
  const text = await res.text();
  fs.writeFileSync('data/votersdesk-dump/style.css', text);
  console.log('CSS length:', text.length);

  // Search for root variables / color definitions
  const rootMatches = [...text.matchAll(/:root\s*\{([^}]+)\}/g)];
  console.log('Root declarations count:', rootMatches.length);
  rootMatches.forEach((m, i) => {
    console.log(`:root [${i}]:\n`, m[1].slice(0, 500));
  });

  // Check for font-family
  const fontMatches = [...text.matchAll(/font-family:[^;]+;/gi)];
  console.log('Font families (sample):', [...new Set(fontMatches.map(m => m[0]))]);

  // Check media queries
  const mediaMatches = [...text.matchAll(/@media[^{]+(?=\{)/gi)];
  console.log('Media queries (sample):', [...new Set(mediaMatches.map(m => m[0].trim()))]);
}

fetchCss();
