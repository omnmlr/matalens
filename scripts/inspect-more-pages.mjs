import fs from 'node:fs';

function extractSnippets(file, label) {
  console.log(`\n=================== ${label} ===================`);
  const html = fs.readFileSync('data/votersdesk-dump/' + file, 'utf-8');
  // strip scripts and styles
  const clean = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                    .replace(/<style[\s\S]*?<\/style>/gi, '')
                    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
                    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
                    .replace(/<[^>]+>/g, '\n')
                    .split('\n')
                    .map(l => l.trim())
                    .filter(l => l.length > 0)
                    .join('\n');
  console.log(clean.slice(0, 1800));
}

extractSnippets('_ballot.html', 'BALLOT PAGE');
extractSnippets('_vote-ready.html', 'VOTE READY PAGE');
extractSnippets('_this-week.html', 'THIS WEEK PAGE');
extractSnippets('_discussions.html', 'DISCUSSIONS PAGE');
extractSnippets('_search.html', 'SEARCH PAGE');
