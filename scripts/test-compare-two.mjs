async function testCompareTwo() {
  const url = 'https://votersdesk.ng/compare?a=bola-ahmed-tinubu&b=peter-obi';
  const res = await fetch(url);
  console.log('Status:', res.status);
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
  console.log(clean.slice(0, 3500));
}

testCompareTwo();
