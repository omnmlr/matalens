import fs from 'node:fs';

async function fetchPage(path) {
  const url = 'https://votersdesk.ng' + path;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const status = res.status;
    const text = await res.text();
    return { status, text };
  } catch (err) {
    return { status: 0, error: err.message };
  }
}

async function main() {
  const home = await fetchPage('/');
  console.log('Homepage status:', home.status, 'Length:', home.text?.length);
  if (home.text) {
    fs.writeFileSync('temp_home.html', home.text);
    console.log('Saved temp_home.html');
  }
}

main();
