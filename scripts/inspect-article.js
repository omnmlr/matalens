import fs from 'fs';

const article = fs.readFileSync('docs/design-planning/fetched/elect-article-tinubu.html', 'utf8');

console.log('=== ARTICLE INSPECTION ===');
// Find article body text
const bodyMatch = article.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || article.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
if (bodyMatch) {
  const cleanBody = bodyMatch[0].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  console.log('Body snippet (first 1000 chars):');
  console.log(cleanBody.slice(0, 1000));
}

// Check for ads, social share, related posts, comments, author info, citations
console.log('\nHas adsbygoogle:', article.includes('adsbygoogle'));
console.log('Has social share:', article.includes('Share') || article.includes('twitter'));
console.log('Has sources / citations block:');
const sourceMatches = [...article.matchAll(/(source|reference|citation|read more|credit)/gi)].length;
console.log('Source mentions:', sourceMatches);

// Check candidate comparison
const compare = fs.readFileSync('docs/design-planning/fetched/elect-cand-compare.html', 'utf8');
console.log('\n=== CANDIDATE COMPARE INSPECTION ===');
const compMain = compare.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (compMain) {
  console.log('Compare snippet:', compMain[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 800));
}
