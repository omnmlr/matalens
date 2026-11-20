import fs from 'fs';

const pp = fs.readFileSync('docs/design-planning/fetched/gaski-chunks/PoliticianProfile-DCnMfbdK.js', 'utf8');
const tt = fs.readFileSync('docs/design-planning/fetched/gaski-chunks/TruthTrack-BcxqEsCJ.js', 'utf8');

console.log('=== GASKI POLITICIAN PROFILE DEEP DIVE ===');
// Search for sections in profile
const profileSections = [...pp.matchAll(/children:\[[^\]]*\"([A-Z][a-zA-Z\s]{2,30})\"/g)].map(m => m[1]);
console.log('Profile section titles / tabs:', [...new Set(profileSections)].slice(0, 30));

// Search for scorecard metrics
const metrics = [...pp.matchAll(/\"([a-z_]+_score|[a-z_]+_count|promises|sentiment|manifesto[a-z_]*)\"/gi)].map(m => m[1]);
console.log('Scorecard / DB fields:', [...new Set(metrics)]);

console.log('\n=== GASKI TRUTHTRACK DEEP DIVE ===');
// Find TruthTrack categories, verdicts, tags
const ttVerdicts = [...tt.matchAll(/\"([A-Z][a-zA-Z\s]{2,20})\"/g)].map(m => m[1]);
console.log('TruthTrack words/verdicts:', [...new Set(ttVerdicts)].filter(w => /verif|true|false|mislead|debunk|pend|check/i.test(w)));
