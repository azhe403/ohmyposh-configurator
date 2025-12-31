#!/usr/bin/env node

/**
 * FINAL script to add remaining options discovered from documentation
 */

const fs = require('fs');
const path = require('path');

const SEGMENTS_DIR = path.join(__dirname, '../public/segments');

const FINAL_OPTIONS = {
  // CLI segments
  docker: [
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['files', 'context'] },
    { name: 'fetch_context', type: 'boolean', default: true, description: 'Fetch current active Docker context in files mode' },
    { name: 'extensions', type: 'array', default: ['compose.yml', 'compose.yaml', 'docker-compose.yml', 'docker-compose.yaml', 'Dockerfile'], description: 'File extensions to validate' }
  ],
  
  // System segments
  project: [
    { name: 'always_enabled', type: 'boolean', default: false, description: 'Always show the segment' },
    { name: 'node_files', type: 'array', default: [], description: 'Override Node.js project files to validate' },
    { name: 'deno_files', type: 'array', default: [], description: 'Override Deno project files to validate' },
    { name: 'cargo_files', type: 'array', default: [], description: 'Override Cargo project files to validate' },
    { name: 'python_files', type: 'array', default: [], description: 'Override Python project files to validate' },
    { name: 'dotnet_files', type: 'array', default: [], description: 'Override .NET project files to validate' }
  ],
  
  connection: [
    { name: 'type', type: 'enum', default: 'wifi', description: 'Connection type to display', values: ['wifi', 'ethernet', 'bluetooth', 'cellular', 'wifi|ethernet'] }
  ],
  
  upgrade: [
    { name: 'cache_duration', type: 'string', default: '168h', description: 'Cache duration for update check (e.g., "24h", "7d")' }
  ],
  
  root: [], // No options - simple check
  text: [] // No options - just template
};

function addFinalOptions() {
  console.log('🔧 Adding final discovered options...\n');
  
  const files = ['cli.json', 'system.json'];
  let totalUpdated = 0;
  let totalAdded = 0;
  
  for (const file of files) {
    const filePath = path.join(SEGMENTS_DIR, file);
    console.log(`Processing ${file}...`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const segments = JSON.parse(content);
      
      let fileModified = false;
      
      for (const segment of segments) {
        if (FINAL_OPTIONS[segment.type]) {
          const newOptions = FINAL_OPTIONS[segment.type];
          
          if (newOptions.length === 0) {
            console.log(`  ℹ ${segment.type}: No options needed`);
            continue;
          }
          
          if (!segment.options) {
            segment.options = newOptions;
            console.log(`  ✓ ${segment.type}: Added ${newOptions.length} options`);
            fileModified = true;
            totalUpdated++;
            totalAdded += newOptions.length;
          } else {
            const existingNames = new Set(segment.options.map(o => o.name));
            const missingOptions = newOptions.filter(o => !existingNames.has(o.name));
            
            if (missingOptions.length > 0) {
              segment.options.push(...missingOptions);
              console.log(`  ✓ ${segment.type}: Added ${missingOptions.length} missing options`);
              fileModified = true;
              totalUpdated++;
              totalAdded += missingOptions.length;
            }
          }
        }
      }
      
      if (fileModified) {
        fs.writeFileSync(filePath, JSON.stringify(segments, null, 2) + '\n');
        console.log(`  💾 Saved ${file}\n`);
      }
    } catch (error) {
      console.error(`  ✗ Error processing ${file}:`, error.message);
    }
  }
  
  console.log('='.repeat(50));
  console.log(`\n📊 Summary:`);
  console.log(`  ✓ Updated: ${totalUpdated} segments`);
  console.log(`  ✓ Added: ${totalAdded} options\n`);
  console.log('✅ COMPLETE! 🎉\n');
}

addFinalOptions();
