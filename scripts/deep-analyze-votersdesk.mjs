import fs from 'node:fs';
import path from 'node:path';

function analyzeCandidatePage(fileName) {
  const html = fs.readFileSync(path.join('data/votersdesk-dump', fileName), 'utf-8');
  console.log(`\n=================== CANDIDATE: ${fileName} ===================`);
  
  // Headings
  const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map(m => ({
    level: m[1],
    text: m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ')
  }));
  console.log('Headings:', headings);

  // Sections / Badges / Tabs / Action Buttons
  const buttons = [...html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi)].map(m =>
    m[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ')
  ).filter(b => b.length > 0 && b.length < 40);
  console.log('Buttons:', Array.from(new Set(buttons)));

  // Manifestos / promises / source citations
  const hasSources = html.toLowerCase().includes('source') || html.toLowerCase().includes('citation');
  const hasManifesto = html.toLowerCase().includes('manifesto');
  const hasPromises = html.toLowerCase().includes('promise');
  const hasWatchlist = html.toLowerCase().includes('watchlist') || html.toLowerCase().includes('follow');
  console.log({ hasSources, hasManifesto, hasPromises, hasWatchlist });

  // Look for specific section titles or keywords
  const cardTitles = [...html.matchAll(/<div[^>]*class="[^"]*(?:font-semibold|font-bold|text-lg|text-xl)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' '))
    .filter(t => t.length > 3 && t.length < 60);
  console.log('Card titles / labels (sample):', Array.from(new Set(cardTitles)).slice(0, 20));
}

function analyzePageContent(fileName, title) {
  const html = fs.readFileSync(path.join('data/votersdesk-dump', fileName), 'utf-8');
  console.log(`\n=================== PAGE: ${title} (${fileName}) ===================`);
  
  const headings = [...html.matchAll(/<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi)].map(m => ({
    level: m[1],
    text: m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ')
  }));
  console.log('Headings:', headings.slice(0, 15));

  const buttons = [...html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi)].map(m =>
    m[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ')
  ).filter(b => b.length > 0 && b.length < 50);
  console.log('Buttons (sample):', Array.from(new Set(buttons)).slice(0, 10));

  // Extract snippet of main body
  const bodyText = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                       .replace(/<style[\s\S]*?<\/style>/gi, '')
                       .replace(/<[^>]+>/g, ' ')
                       .replace(/\s+/g, ' ')
                       .trim();
  console.log('Text snippet (first 600 chars):', bodyText.slice(0, 600));
}

analyzeCandidatePage('_politicians_bola-ahmed-tinubu.html');
analyzeCandidatePage('_politicians_peter-obi.html');
analyzePageContent('_my-desk.html', 'My Desk');
analyzePageContent('_promises.html', 'Promises');
analyzePageContent('_vote-ready.html', 'Vote Ready');
analyzePageContent('_ballot.html', 'Ballot');
analyzePageContent('_this-week.html', 'This Week');
analyzePageContent('_stories.html', 'Stories');
analyzePageContent('_editorial-code.html', 'Editorial Code');
analyzePageContent('_compare.html', 'Compare');
analyzePageContent('_quiz.html', 'Quiz');
