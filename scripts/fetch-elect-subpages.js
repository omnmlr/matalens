import fs from 'fs';

async function fetchSubpages() {
  const urls = [
    { url: 'https://elect.ng/news/tinubu-campaign-flag-off-kaduna-october-24', file: 'elect-article-tinubu.html' },
    { url: 'https://elect.ng/candidates/compare', file: 'elect-cand-compare.html' },
    { url: 'https://elect.ng/leaders', file: 'elect-leaders.html' },
  ];

  for (const item of urls) {
    try {
      console.log(`Fetching ${item.url}...`);
      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const text = await res.text();
      fs.writeFileSync(`docs/design-planning/fetched/${item.file}`, text, 'utf8');
      console.log(`Saved ${item.file} (${text.length} bytes)`);
    } catch (e) {
      console.error(e.message);
    }
  }
}

fetchSubpages();
