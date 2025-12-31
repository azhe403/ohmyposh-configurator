#!/usr/bin/env node

/**
 * COMPREHENSIVE script to add ALL missing options to ALL remaining segments
 * Based on Oh My Posh documentation analysis
 */

const fs = require('fs');
const path = require('path');

const SEGMENTS_DIR = path.join(__dirname, '../public/segments');

// Complete options database for remaining segments
const ALL_SEGMENT_OPTIONS = {
  // === CLOUD SEGMENTS ===
  az: [
    { name: 'source', type: 'enum', default: 'cli', description: 'Sources to get subscription information from', values: ['cli', 'pwsh', 'cli|pwsh'] }
  ],
  
  azd: [], // No options documented
  
  cftarget: [
    { name: 'display_mode', type: 'enum', default: 'always', description: 'When to display segment', values: ['always', 'context'] }
  ],
  
  gcp: [], // No options documented
  
  kubectl: [
    { name: 'parse_kubeconfig', type: 'boolean', default: false, description: 'Parse kubeconfig files to get context' },
    { name: 'display_default', type: 'boolean', default: true, description: 'Display default context' }
  ],
  
  pulumi: [
    { name: 'fetch_stack', type: 'boolean', default: true, description: 'Fetch the current stack name' }
  ],
  
  sitecore: [
    { name: 'display_mode', type: 'enum', default: 'files', description: 'When to display segment', values: ['always', 'files'] }
  ],
  
  terraform: [
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] }
  ],
  
  // === HEALTH SEGMENTS ===
  nightscout: [
    { name: 'url', type: 'string', default: '', description: 'Nightscout URL' },
    { name: 'access_token', type: 'string', default: '', description: 'API access token' },
    { name: 'http_timeout', type: 'number', default: 20, description: 'HTTP timeout in milliseconds' },
    { name: 'cache_timeout', type: 'number', default: 5, description: 'Cache timeout in minutes' }
  ],
  
  strava: [
    { name: 'access_token', type: 'string', default: '', description: 'Strava API access token' },
    { name: 'refresh_token', type: 'string', default: '', description: 'Strava API refresh token' },
    { name: 'http_timeout', type: 'number', default: 20, description: 'HTTP timeout in milliseconds' },
    { name: 'cache_timeout', type: 'number', default: 10, description: 'Cache timeout in minutes' },
    { name: 'activity_type', type: 'string', default: 'Run', description: 'Activity type to display' }
  ],
  
  withings: [
    { name: 'access_token', type: 'string', default: '', description: 'Withings API access token' },
    { name: 'http_timeout', type: 'number', default: 20, description: 'HTTP timeout in milliseconds' },
    { name: 'cache_timeout', type: 'number', default: 10, description: 'Cache timeout in minutes' }
  ],
  
  // === MUSIC SEGMENTS ===
  lastfm: [
    { name: 'api_key', type: 'string', default: '', description: 'Last.fm API key' },
    { name: 'username', type: 'string', default: '', description: 'Last.fm username' },
    { name: 'http_timeout', type: 'number', default: 20, description: 'HTTP timeout in milliseconds' },
    { name: 'cache_timeout', type: 'number', default: 10, description: 'Cache timeout in minutes' }
  ],
  
  spotify: [
    { name: 'client_id', type: 'string', default: '', description: 'Spotify client ID' },
    { name: 'client_secret', type: 'string', default: '', description: 'Spotify client secret' },
    { name: 'refresh_token', type: 'string', default: '', description: 'Spotify refresh token' },
    { name: 'http_timeout', type: 'number', default: 20, description: 'HTTP timeout in milliseconds' },
    { name: 'cache_timeout', type: 'number', default: 10, description: 'Cache timeout in minutes' },
    { name: 'playing_icon', type: 'string', default: '', description: 'Icon when playing' },
    { name: 'paused_icon', type: 'string', default: '', description: 'Icon when paused' },
    { name: 'stopped_icon', type: 'string', default: '', description: 'Icon when stopped' }
  ],
  
  ytm: [
    { name: 'api_url', type: 'string', default: '', description: 'YouTube Music Desktop API URL' },
    { name: 'http_timeout', type: 'number', default: 20, description: 'HTTP timeout in milliseconds' },
    { name: 'playing_icon', type: 'string', default: '', description: 'Icon when playing' },
    { name: 'paused_icon', type: 'string', default: '', description: 'Icon when paused' },
    { name: 'stopped_icon', type: 'string', default: '', description: 'Icon when stopped' }
  ],
  
  // === WEB/OTHER SEGMENTS ===
  brewfather: [
    { name: 'user_id', type: 'string', default: '', description: 'Brewfather user ID' },
    { name: 'api_key', type: 'string', default: '', description: 'Brewfather API key' },
    { name: 'batch_id', type: 'string', default: '', description: 'Specific batch ID to display' },
    { name: 'http_timeout', type: 'number', default: 20, description: 'HTTP timeout in milliseconds' },
    { name: 'cache_timeout', type: 'number', default: 10, description: 'Cache timeout in minutes' }
  ],
  
  carbonintensity: [
    { name: 'url', type: 'string', default: 'https://api.carbonintensity.org.uk/regional', description: 'Carbon intensity API URL' },
    { name: 'http_timeout', type: 'number', default: 20, description: 'HTTP timeout in milliseconds' },
    { name: 'cache_timeout', type: 'number', default: 10, description: 'Cache timeout in minutes' }
  ],
  
  http: [
    { name: 'url', type: 'string', default: '', description: 'HTTP endpoint URL' },
    { name: 'headers', type: 'object', default: {}, description: 'HTTP request headers' },
    { name: 'http_timeout', type: 'number', default: 20, description: 'HTTP timeout in milliseconds' },
    { name: 'cache_timeout', type: 'number', default: 10, description: 'Cache timeout in minutes' }
  ],
  
  ipify: [
    { name: 'url', type: 'string', default: 'https://api.ipify.org', description: 'IP lookup service URL' },
    { name: 'http_timeout', type: 'number', default: 20, description: 'HTTP timeout in milliseconds' },
    { name: 'cache_timeout', type: 'number', default: 10, description: 'Cache timeout in minutes' }
  ],
  
  wakatime: [
    { name: 'url', type: 'string', default: 'https://wakatime.com/api/v1/users/current/summaries', description: 'WakaTime API URL' },
    { name: 'api_key', type: 'string', default: '', description: 'WakaTime API key' },
    { name: 'http_timeout', type: 'number', default: 20, description: 'HTTP timeout in milliseconds' },
    { name: 'cache_timeout', type: 'number', default: 10, description: 'Cache timeout in minutes' }
  ],
  
  owm: [
    { name: 'apikey', type: 'string', default: '', description: 'OpenWeatherMap API key' },
    { name: 'location', type: 'string', default: '', description: 'Location (city name or coordinates)' },
    { name: 'units', type: 'enum', default: 'standard', description: 'Temperature units', values: ['standard', 'metric', 'imperial'] },
    { name: 'http_timeout', type: 'number', default: 20, description: 'HTTP timeout in milliseconds' },
    { name: 'cache_timeout', type: 'number', default: 10, description: 'Cache timeout in minutes' }
  ],
  
  winreg: [
    { name: 'path', type: 'string', default: '', description: 'Windows registry path' },
    { name: 'key', type: 'string', default: '', description: 'Registry key name' },
    { name: 'fallback', type: 'string', default: '', description: 'Fallback value if key not found' }
  ],
  
  // GitVersion (was missing from SCM)
  gitversion: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' }
  ]
};

function updateAllSegments() {
  console.log('🔧 Adding options to ALL remaining segments...\n');
  
  const files = ['cloud.json', 'health.json', 'music.json', 'web.json', 'scm.json'];
  
  let totalUpdated = 0;
  let totalAdded = 0;
  
  for (const file of files) {
    const filePath = path.join(SEGMENTS_DIR, file);
    console.log(`\n=== Processing ${file} ===`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const segments = JSON.parse(content);
      
      let fileModified = false;
      let fileUpdatedCount = 0;
      let fileAddedCount = 0;
      
      for (const segment of segments) {
        if (ALL_SEGMENT_OPTIONS[segment.type]) {
          const newOptions = ALL_SEGMENT_OPTIONS[segment.type];
          
          // Skip if no options to add
          if (newOptions.length === 0) {
            console.log(`  ℹ ${segment.type}: No options to add`);
            continue;
          }
          
          if (!segment.options) {
            // No options at all
            segment.options = newOptions;
            console.log(`  ✓ ${segment.type}: Added ${newOptions.length} options`);
            fileModified = true;
            fileUpdatedCount++;
            fileAddedCount += newOptions.length;
          } else {
            // Check for missing options
            const existingNames = new Set(segment.options.map(o => o.name));
            const missingOptions = newOptions.filter(o => !existingNames.has(o.name));
            
            if (missingOptions.length > 0) {
              segment.options.push(...missingOptions);
              console.log(`  ✓ ${segment.type}: Added ${missingOptions.length} missing options`);
              fileModified = true;
              fileUpdatedCount++;
              fileAddedCount += missingOptions.length;
            } else {
              console.log(`  ⏭ ${segment.type}: Already has all options`);
            }
          }
        }
      }
      
      if (fileModified) {
        fs.writeFileSync(filePath, JSON.stringify(segments, null, 2) + '\n');
        console.log(`\n  💾 Saved ${file}`);
        console.log(`  📊 Updated ${fileUpdatedCount} segments, added ${fileAddedCount} options`);
        totalUpdated += fileUpdatedCount;
        totalAdded += fileAddedCount;
      } else {
        console.log(`  ⏭ No changes needed for ${file}`);
      }
    } catch (error) {
      console.error(`  ✗ Error processing ${file}:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 FINAL SUMMARY:`);
  console.log(`  ✓ Total segments updated: ${totalUpdated}`);
  console.log(`  ✓ Total options added: ${totalAdded}`);
  console.log(`\n✅ ALL SEGMENTS COMPLETE! 🎉\n`);
}

updateAllSegments();
