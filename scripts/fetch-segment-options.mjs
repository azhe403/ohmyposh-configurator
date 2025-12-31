#!/usr/bin/env node

/**
 * Automated script to fetch segment options from Oh My Posh documentation
 * Parses the Options section from each segment's documentation page
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEGMENTS_DIR = path.join(__dirname, '../public/segments');
const BASE_URL = 'https://ohmyposh.dev/docs/segments';

// Map of segment types to their documentation URLs
const SEGMENT_DOCS = {
  // CLI segments
  angular: 'cli/angular',
  argocd: 'cli/argocd',
  aurelia: 'cli/aurelia',
  bazel: 'cli/bazel',
  buf: 'cli/buf',
  bun: 'cli/bun',
  cmake: 'cli/cmake',
  copilot: 'cli/copilot',
  deno: 'cli/deno',
  firebase: 'cli/firebase',
  flutter: 'cli/flutter',
  helm: 'cli/helm',
  kotlin: 'cli/kotlin',
  mvn: 'cli/mvn',
  nbgv: 'cli/nbgv',
  npm: 'cli/npm',
  nx: 'cli/nx',
  pnpm: 'cli/pnpm',
  quasar: 'cli/quasar',
  talosctl: 'cli/talosctl',
  ui5tooling: 'cli/ui5tooling',
  v: 'cli/vlang',
  winget: 'cli/winget',
  xmake: 'cli/xmake',
  yarn: 'cli/yarn',
  
  // Cloud segments
  aws: 'cloud/aws',
  az: 'cloud/azure',
  azd: 'cloud/azd',
  azfunc: 'cloud/azfunc',
  cf: 'cloud/cf',
  cftarget: 'cloud/cftarget',
  gcp: 'cloud/gcp',
  kubectl: 'cloud/kubectl',
  pulumi: 'cloud/pulumi',
  
  // Language segments
  crystal: 'language/crystal',
  dart: 'language/dart',
  dotnet: 'language/dotnet',
  elixir: 'language/elixir',
  go: 'language/go',
  haskell: 'language/haskell',
  java: 'language/java',
  julia: 'language/julia',
  lua: 'language/lua',
  nim: 'language/nim',
  node: 'language/node',
  perl: 'language/perl',
  php: 'language/php',
  python: 'language/python',
  r: 'language/r',
  ruby: 'language/ruby',
  rust: 'language/rust',
  swift: 'language/swift',
  
  // SCM segments
  git: 'scm/git',
  gitversion: 'scm/gitversion',
  fossil: 'scm/fossil',
  jujutsu: 'scm/jujutsu',
  mercurial: 'scm/mercurial',
  plastic: 'scm/plastic',
  sapling: 'scm/sapling',
  svn: 'scm/svn',
  
  // System segments
  battery: 'system/battery',
  connection: 'system/connection',
  executiontime: 'system/executiontime',
  os: 'system/os',
  path: 'system/path',
  project: 'system/project',
  root: 'system/root',
  session: 'system/session',
  shell: 'system/shell',
  status: 'system/status',
  sysinfo: 'system/sysinfo',
  terraform: 'system/terraform',
  text: 'system/text',
  time: 'system/time',
  upgrade: 'system/upgrade',
  
  // Other segments
  docker: 'system/docker',
  http: 'system/http',
};

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * Parse options table from HTML content
 * Oh My Posh docs have a consistent format with markdown tables
 */
function parseOptionsFromHtml(html, segmentType) {
  const options = [];
  
  // Look for "Options" section followed by a table
  const optionsMatch = html.match(/##\s*Options[^#]*?(\|[^|]+\|[^|]+\|[\s\S]*?)(?=##|$)/i);
  if (!optionsMatch) {
    console.log(`  ⚠ No options section found for ${segmentType}`);
    return [];
  }
  
  const tableContent = optionsMatch[1];
  
  // Parse markdown table rows (skip header and separator)
  const rows = tableContent.split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('|') && !line.includes('---'));
  
  // Skip the header row
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i]
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0);
    
    if (cells.length >= 3) {
      const [name, type, defaultValue, ...descParts] = cells;
      const description = descParts.join(' ').trim();
      
      if (name && type) {
        const option = {
          name: name.trim(),
          type: type.trim().toLowerCase(),
          description: description || `Configuration option for ${name}`
        };
        
        // Add default value if present and not empty
        if (defaultValue && defaultValue.trim() && defaultValue.trim() !== '-') {
          // Try to parse the default value appropriately
          const defVal = defaultValue.trim();
          if (option.type === 'boolean') {
            option.default = defVal.toLowerCase() === 'true';
          } else if (option.type === 'number' || option.type === 'int') {
            const num = parseInt(defVal, 10);
            if (!isNaN(num)) option.default = num;
          } else if (defVal.startsWith('{') || defVal.startsWith('[')) {
            try {
              option.default = JSON.parse(defVal);
            } catch {
              option.default = defVal;
            }
          } else {
            option.default = defVal;
          }
        }
        
        // For enum types, try to extract values from description
        if (option.type === 'enum' && description) {
          const valuesMatch = description.match(/\(([\w\s,|]+)\)/);
          if (valuesMatch) {
            option.values = valuesMatch[1].split(/[,|]/).map(v => v.trim()).filter(v => v);
          }
        }
        
        options.push(option);
      }
    }
  }
  
  return options;
}

async function fetchSegmentOptions(segmentType, docPath) {
  const url = `${BASE_URL}/${docPath}`;
  console.log(`Fetching ${segmentType} from ${url}...`);
  
  try {
    const html = await fetchUrl(url);
    const options = parseOptionsFromHtml(html, segmentType);
    
    if (options.length > 0) {
      console.log(`  ✓ Found ${options.length} options`);
    }
    
    return options;
  } catch (error) {
    console.error(`  ✗ Error fetching ${segmentType}:`, error.message);
    return [];
  }
}

async function updateSegmentFiles() {
  console.log('🔍 Fetching segment options from Oh My Posh documentation...\n');
  
  const allOptions = {};
  
  // Fetch options for each segment
  for (const [segmentType, docPath] of Object.entries(SEGMENT_DOCS)) {
    const options = await fetchSegmentOptions(segmentType, docPath);
    if (options.length > 0) {
      allOptions[segmentType] = options;
    }
    
    // Rate limit to be respectful to the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Summary: Found options for ${Object.keys(allOptions).length} segments`);
  
  // Save to a JSON file for manual review before applying
  const outputPath = path.join(__dirname, 'fetched-options.json');
  fs.writeFileSync(outputPath, JSON.stringify(allOptions, null, 2));
  console.log(`\n💾 Saved options to: ${outputPath}`);
  console.log('\n✅ Review the fetched options, then run apply-fetched-options.mjs to update segment files');
}

updateSegmentFiles().catch(console.error);
