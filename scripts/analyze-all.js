import fs from 'fs';
import path from 'path';

function inspectElectNg() {
  console.log('==================== ELECT.NG ANALYSIS ====================');

  // 1. News
  const newsHtml = fs.readFileSync('docs/design-planning/fetched/elect-ng-news.html', 'utf8');
  console.log('--- Elect.ng /news analysis ---');
  // Check for article titles, links, sources, categories, badges
  const articleMatches = [...newsHtml.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/gi)];
  console.log(`Found ${articleMatches.length} <article> elements on /news`);
  
  // Extract news titles and sources
  const newsTitles = [...newsHtml.matchAll(/<h[23][^>]*class="[^"]*"[^>]*>\s*<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map(m => ({ href: m[1], title: m[2].replace(/<[^>]+>/g, '').trim() }));
  console.log('News titles found:', newsTitles.slice(0, 10));

  // Check categories/tags in news
  const categories = [...newsHtml.matchAll(/\/news\/category\/([a-zA-Z0-9\-_]+)/g)].map(m => m[1]);
  console.log('Categories:', [...new Set(categories)]);

  // Check fact checking / credibility signals in news
  const factCheckKeywords = ['fact', 'verified', 'source', 'claim', 'disputed', 'check', 'correction', 'retraction', 'bias'];
  console.log('Fact check keywords in news:');
  for (const kw of factCheckKeywords) {
    const count = (newsHtml.match(new RegExp(kw, 'gi')) || []).length;
    console.log(`  ${kw}: ${count}`);
  }

  // 2. Feed.xml
  const feedXml = fs.readFileSync('docs/design-planning/fetched/elect-ng-feed.xml', 'utf8');
  const feedItems = [...feedXml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];
  console.log(`\n--- Elect.ng RSS Feed: ${feedItems.length} items ---`);
  for (let i = 0; i < Math.min(5, feedItems.length); i++) {
    const item = feedItems[i][1];
    const title = (item.match(/<title>([\s\S]*?)<\/title>/i) || [])[1];
    const pubDate = (item.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || [])[1];
    const source = (item.match(/<source[^>]*>([\s\S]*?)<\/source>/i) || [])[1];
    const creator = (item.match(/<dc:creator>([\s\S]*?)<\/dc:creator>/i) || [])[1];
    console.log(`  [${pubDate}] ${title} (Creator: ${creator}, Source: ${source})`);
  }

  // 3. Candidates
  const candHtml = fs.readFileSync('docs/design-planning/fetched/elect-ng-candidates.html', 'utf8');
  console.log('\n--- Elect.ng /candidates analysis ---');
  const candLinks = [...candHtml.matchAll(/href="https:\/\/elect\.ng\/candidates\/([^"]+)"/gi)].map(m => m[1]);
  console.log('Sample candidate links:', [...new Set(candLinks)].slice(0, 10));
  // Check filter controls on candidates
  const candFilters = [...candHtml.matchAll(/<select[^>]*name="([^"]+)"[^>]*>([\s\S]*?)<\/select>/gi)]
    .map(m => ({ name: m[1], options: [...m[2].matchAll(/<option[^>]*value="([^"]*)"[^>]*>([\s\S]*?)<\/option>/gi)].map(o => o[2].trim()) }));
  console.log('Candidate filter dropdowns:', candFilters.map(f => `${f.name}: [${f.options.slice(0, 5).join(', ')}...]`));

  // 4. Leaders
  const leadersHtml = fs.readFileSync('docs/design-planning/fetched/elect-ng-leaders.html', 'utf8');
  console.log('\n--- Elect.ng /leaders analysis ---');
  const leaderHeadings = [...leadersHtml.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('Leader sections/headings:', leaderHeadings.slice(0, 10));

  // 5. Results
  const resultsHtml = fs.readFileSync('docs/design-planning/fetched/elect-ng-results.html', 'utf8');
  console.log('\n--- Elect.ng /results analysis ---');
  const badges = [...resultsHtml.matchAll(/class="badge[^"]*"[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/span>/gi)]
    .map(m => ({ text: m[2].replace(/<[^>]+>/g, '').trim(), title: m[1] }));
  console.log('Verification badges found:', badges);

  // 6. Incidents
  const incHtml = fs.readFileSync('docs/design-planning/fetched/elect-ng-incidents.html', 'utf8');
  console.log('\n--- Elect.ng /incidents analysis ---');
  const incTypes = [...incHtml.matchAll(/class="[^"]*"[^>]*data-type="([^"]*)"/gi)].map(m => m[1]);
  console.log('Incident types/indicators:', incHtml.includes('Report incident') ? 'Has reporting form' : 'No direct form');
}

function inspectGaski() {
  console.log('\n==================== GASKI ANALYSIS ====================');

  // Analyze TruthTrack chunk
  const tt = fs.readFileSync('docs/design-planning/fetched/gaski-chunks/TruthTrack-BcxqEsCJ.js', 'utf8');
  console.log('--- TruthTrack-BcxqEsCJ.js Analysis ---');
  // Look for state variables, labels, claim statuses
  const strings = [...tt.matchAll(/["']([^"']{4,80})["']/g)].map(m => m[1]);
  console.log('Sample strings in TruthTrack:');
  const interesting = strings.filter(s => /fact|claim|verif|false|true|misleading|source|verdict|rating|flag/i.test(s));
  console.log([...new Set(interesting)].slice(0, 25));

  // Analyze ExploreFeed chunk
  const ef = fs.readFileSync('docs/design-planning/fetched/gaski-chunks/ExploreFeed-C_dnMSsQ.js', 'utf8');
  console.log('\n--- ExploreFeed-C_dnMSsQ.js Analysis ---');
  const efStrings = [...ef.matchAll(/["']([^"']{4,80})["']/g)].map(m => m[1]);
  const efInteresting = efStrings.filter(s => /feed|news|post|filter|poll|trending|sentiment|rumor|irev/i.test(s));
  console.log([...new Set(efInteresting)].slice(0, 20));

  // Analyze PoliticianProfile chunk
  const pp = fs.readFileSync('docs/design-planning/fetched/gaski-chunks/PoliticianProfile-DCnMfbdK.js', 'utf8');
  console.log('\n--- PoliticianProfile-DCnMfbdK.js Analysis ---');
  const ppStrings = [...pp.matchAll(/["']([^"']{4,80})["']/g)].map(m => m[1]);
  const ppInteresting = ppStrings.filter(s => /score|promise|manifesto|rating|sentiment|voter|track|bio|education|party/i.test(s));
  console.log([...new Set(ppInteresting)].slice(0, 25));

  // Analyze CampaignHome chunk
  const ch = fs.readFileSync('docs/design-planning/fetched/gaski-chunks/CampaignHome-YceM5KrY.js', 'utf8');
  console.log('\n--- CampaignHome-YceM5KrY.js Analysis ---');
  const chStrings = [...ch.matchAll(/["']([^"']{4,80})["']/g)].map(m => m[1]);
  const chInteresting = chStrings.filter(s => /campaign|pricing|tier|stipend|task|voter|agent|war room/i.test(s));
  console.log([...new Set(chInteresting)].slice(0, 25));

  // Analyze Index-Cc4zqJiU.js chunk (homepage)
  const idx = fs.readFileSync('docs/design-planning/fetched/gaski-chunks/Index-Cc4zqJiU.js', 'utf8');
  console.log('\n--- Index-Cc4zqJiU.js Analysis ---');
  const idxStrings = [...idx.matchAll(/["']([^"']{4,80})["']/g)].map(m => m[1]);
  console.log('Homepage feature claims & callouts:', idxStrings.filter(s => s.length > 20 && !s.includes('/')).slice(0, 20));
}

inspectElectNg();
inspectGaski();
