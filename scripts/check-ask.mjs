async function checkAsk() {
  const res = await fetch('https://votersdesk.ng/ask');
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
  console.log(clean.slice(0, 1500));
}

checkAsk();
