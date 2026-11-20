import fs from 'node:fs';

async function testCompareQueries() {
  const urls = [
    'https://votersdesk.ng/compare?race=presidential',
    'https://votersdesk.ng/compare?race=governor&state=lagos',
    'https://votersdesk.ng/compare/presidential',
    'https://votersdesk.ng/compare/lagos'
  ];

  for (const u of urls) {
    const res = await fetch(u);
    console.log(u, res.status);
    const text = await res.text();
    const clean = text.replace(/<script[\s\S]*?<\/script>/gi, '')
                      .replace(/<style[\s\S]*?<\/style>/gi, '')
                      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
                      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
                      .replace(/<[^>]+>/g, '\n')
                      .split('\n')
                      .map(l => l.trim())
                      .filter(l => l.length > 0)
                      .join('\n');
    console.log('Text preview:', clean.slice(0, 400));
  }
}

testCompareQueries();
