import fs from 'node:fs';

const css = fs.readFileSync('data/votersdesk-dump/style.css', 'utf-8');

// Find all css custom property declarations
const vars = [...css.matchAll(/--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g)].map(m => ({
  name: m[1],
  value: m[2].trim()
}));

console.log('Total CSS variables found:', vars.length);
const uniqueVars = {};
for (const v of vars) {
  if (!uniqueVars[v.name]) uniqueVars[v.name] = [];
  if (!uniqueVars[v.name].includes(v.value)) uniqueVars[v.name].push(v.value);
}

for (const [k, vals] of Object.entries(uniqueVars)) {
  if (k.startsWith('font-') || k.startsWith('surface') || k.startsWith('on-') || k.startsWith('primary') || k.startsWith('outline') || k.startsWith('secondary') || k.startsWith('error')) {
    console.log(`--${k}:`, vals);
  }
}
