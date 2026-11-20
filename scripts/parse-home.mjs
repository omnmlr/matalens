import fs from 'node:fs';

const html = fs.readFileSync('temp_home.html', 'utf-8');

console.log('--- HEAD & META ---');
const title = html.match(/<title>(.*?)<\/title>/i)?.[1];
console.log('Title:', title);

const metaTags = [...html.matchAll(/<meta\s+([^>]+)>/gi)].map(m => m[1]);
console.log('Meta tags count:', metaTags.length);
metaTags.filter(m => m.includes('description') || m.includes('og:') || m.includes('twitter:')).forEach(m => console.log('Meta:', m));

console.log('--- HEADINGS ---');
const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map(m => ({
  level: m[1],
  text: m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ')
}));
console.log(headings);

console.log('--- NAV & BUTTONS ---');
const links = [...html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
  .map(m => ({ href: m[1], text: m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ') }))
  .filter(l => l.text.length > 0 && l.text.length < 50);
console.log('Unique sample links:');
const seen = new Set();
const uniqueLinks = links.filter(l => {
  const key = l.href + '|' + l.text;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
console.log(uniqueLinks.slice(0, 40));

console.log('--- CHECK FOR NEXT_DATA OR FLIGHT DATA ---');
const hasNextData = html.includes('__NEXT_DATA__');
console.log('Has __NEXT_DATA__:', hasNextData);
const flightPushes = [...html.matchAll(/self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g)];
console.log('Flight pushes count:', flightPushes.length);
