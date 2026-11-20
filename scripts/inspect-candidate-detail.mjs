import fs from 'node:fs';

const html = fs.readFileSync('data/votersdesk-dump/_politicians_bola-ahmed-tinubu.html', 'utf-8');

// Find all sections
const sections = [...html.matchAll(/<section[^>]*>([\s\S]*?)<\/section>/gi)].map(m => {
  const content = m[1];
  const ariaLabel = m[0].match(/aria-labelledby=["']([^"']+)["']/i)?.[1] || m[0].match(/aria-label=["']([^"']+)["']/i)?.[1];
  const h = content.match(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
  return { ariaLabel, heading: h, length: content.length };
});

console.log('Candidate Sections:', sections);

// Let's examine the "Published priorities" section
const prioIdx = html.indexOf('Published priorities');
if (prioIdx !== -1) {
  console.log('\n--- PRIORITIES / MANIFESTO SNIPPET ---');
  console.log(html.slice(prioIdx, prioIdx + 3000).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}

// Let's examine the "About" section
const aboutIdx = html.indexOf('About Bola Ahmed Tinubu');
if (aboutIdx !== -1) {
  console.log('\n--- ABOUT SNIPPET ---');
  console.log(html.slice(aboutIdx, aboutIdx + 2000).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}
