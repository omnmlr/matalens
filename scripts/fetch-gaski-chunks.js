import fs from 'fs';
import path from 'path';

const outDir = 'docs/design-planning/fetched/gaski-chunks';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const chunks = [
  'TruthTrack-BcxqEsCJ.js',
  'YouthTruthTrack-COGKcHC2.js',
  'ExploreFeed-C_dnMSsQ.js',
  'ExploreHub-Dql1gxBI.js',
  'ExploreDatabase-BggvWQ4_.js',
  'PoliticianProfile-DCnMfbdK.js',
  'PoliticianManifesto-DleLtQTq.js',
  'PoliticianSentiment-DZsQN_nU.js',
  'PoliticianComparison-hD_nHdrN.js',
  'ScorecardShare-Dh8b3AoA.js',
  'MyPollingUnit-CQRQwu-U.js',
  'WorkspaceResults-DKWmQQRC.js',
  'NationalMediaDesk-i1braa3x.js',
  'CampaignHome-YceM5KrY.js',
  'Index-Cc4zqJiU.js',
];

async function fetchChunks() {
  for (const chunk of chunks) {
    const url = `https://www.gaski.ng/assets/${chunk}`;
    try {
      console.log(`Fetching Gaski chunk ${chunk}...`);
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        fs.writeFileSync(path.join(outDir, chunk), text, 'utf8');
        console.log(`Saved ${chunk} (${text.length} bytes)`);
      } else {
        console.log(`Failed ${chunk}: status ${res.status}`);
      }
    } catch (e) {
      console.error(`Error ${chunk}:`, e.message);
    }
  }
}

fetchChunks();
