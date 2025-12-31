#!/usr/bin/env node

/**
 * Script to apply fetched options to segment metadata files
 * Reads from fetched-options.json and updates the segment files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEGMENTS_DIR = path.join(__dirname, '../public/segments');
const FETCHED_OPTIONS_PATH = path.join(__dirname, 'fetched-options.json');

function applyOptionsToSegments() {
  console.log('🔧 Applying fetched options to segment metadata files...\n');
  
  // Load fetched options
  if (!fs.existsSync(FETCHED_OPTIONS_PATH)) {
    console.error('✗ fetched-options.json not found. Run fetch-segment-options.mjs first.');
    process.exit(1);
  }
  
  const fetchedOptions = JSON.parse(fs.readFileSync(FETCHED_OPTIONS_PATH, 'utf8'));
  console.log(`📄 Loaded options for ${Object.keys(fetchedOptions).length} segments\n`);
  
  // Get all segment files
  const segmentFiles = fs.readdirSync(SEGMENTS_DIR).filter(f => f.endsWith('.json'));
  
  let updatedCount = 0;
  let newOptionsCount = 0;
  
  for (const file of segmentFiles) {
    const filePath = path.join(SEGMENTS_DIR, file);
    console.log(`Processing ${file}...`);
    
    try {
      const segments = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      let fileModified = false;
      
      for (const segment of segments) {
        const segmentType = segment.type;
        
        // Check if we have fetched options for this segment
        if (fetchedOptions[segmentType]) {
          const fetchedOpts = fetchedOptions[segmentType];
          
          // Merge with existing options (don't overwrite manually added ones)
          if (!segment.options) {
            segment.options = fetchedOpts;
            console.log(`  ✓ Added ${fetchedOpts.length} options to ${segmentType}`);
            fileModified = true;
            updatedCount++;
            newOptionsCount += fetchedOpts.length;
          } else {
            // Merge: add new options, keep existing ones
            const existingNames = new Set(segment.options.map(o => o.name));
            const newOpts = fetchedOpts.filter(o => !existingNames.has(o.name));
            
            if (newOpts.length > 0) {
              segment.options.push(...newOpts);
              console.log(`  ✓ Added ${newOpts.length} new options to ${segmentType} (${segment.options.length} total)`);
              fileModified = true;
              updatedCount++;
              newOptionsCount += newOpts.length;
            } else {
              console.log(`  ⏭ ${segmentType} already has all fetched options`);
            }
          }
        }
      }
      
      if (fileModified) {
        fs.writeFileSync(filePath, JSON.stringify(segments, null, 2) + '\n');
        console.log(`  💾 Saved ${file}`);
      }
    } catch (error) {
      console.error(`  ✗ Error processing ${file}:`, error.message);
    }
    
    console.log('');
  }
  
  console.log('='.repeat(50));
  console.log(`\n📊 Summary:`);
  console.log(`  ✓ Updated: ${updatedCount} segments`);
  console.log(`  ✓ Added: ${newOptionsCount} new options`);
  console.log(`\n✅ Done! 🎉\n`);
}

applyOptionsToSegments();
