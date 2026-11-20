import fs from 'fs';

const gaskiIndex = fs.readFileSync('docs/design-planning/fetched/gaski-index.js', 'utf8');
const gaskiShared = fs.readFileSync('docs/design-planning/fetched/gaski-app-shared.js', 'utf8');
const manifest = fs.readFileSync('docs/design-planning/fetched/gaski-manifest.json', 'utf8');

console.log('=== GASKI MANIFEST ===');
console.log(manifest);

console.log('\n=== GASKI SCRIPT SCAN ===');
const allText = gaskiIndex + '\n' + gaskiShared;

// Find dynamic imports / routes
const lazyImports = [...allText.matchAll(/import\([\"'](\.\/[^\"']+)[\"']\)/g)].map(m => m[1]);
console.log('Lazy imports:', lazyImports);

// Find string literals that look like paths or routes
const routeMatches = [...allText.matchAll(/[\"'](\/[a-zA-Z0-9_\-\/:]+)[\"']/g)].map(m => m[1]);
const uniqueRoutes = [...new Set(routeMatches)].filter(r => !r.startsWith('/assets') && !r.startsWith('/api') && r.length > 1);
console.log('Potential routes:', uniqueRoutes);

// Find API endpoints
const apiMatches = [...allText.matchAll(/[\"'](\/api\/[a-zA-Z0-9_\-\/:]+)[\"']/g)].map(m => m[1]);
console.log('API endpoints:', [...new Set(apiMatches)]);

// Find Supabase or Firebase or backend service URLs
const urls = [...allText.matchAll(/https?:\/\/[a-zA-Z0-9_\.\-\/:]+/g)].map(m => m[0]);
console.log('URLs:', [...new Set(urls)]);

// Search for key terms: candidate, fact, verify, news, irev, polling, reward, task, leaderboard, sentiment
const keywords = ['candidate', 'fact', 'verify', 'news', 'irev', 'polling', 'reward', 'task', 'leaderboard', 'sentiment', 'deepfake', 'manifesto', 'promise'];
console.log('\n=== KEYWORD COUNTS ===');
for (const kw of keywords) {
  const count = (allText.match(new RegExp(kw, 'gi')) || []).length;
  console.log(`${kw}: ${count}`);
}
