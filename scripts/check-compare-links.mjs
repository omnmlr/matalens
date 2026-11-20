async function test() {
  const res = await fetch('https://votersdesk.ng/compare?race=president');
  const text = await res.text();
  const links = [...text.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map(m => ({ href: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() }))
    .filter(l => l.href.includes('compare'));
  console.log(links);
}
test();
