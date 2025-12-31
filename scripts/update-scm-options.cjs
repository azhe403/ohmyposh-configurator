#!/usr/bin/env node

/**
 * Script to add ALL missing options to SCM segments
 */

const fs = require('fs');
const path = require('path');

const SCM_FILE = path.join(__dirname, '../public/segments/scm.json');

// Complete options for each SCM segment
const SCM_OPTIONS = {
  fossil: [
    { name: 'native_fallback', type: 'boolean', default: false, description: 'Fallback to native fossil executable in WSL2' }
  ],
  
  git: [
    // Already has many options, need to add missing ones from full docs
    { name: 'fetch_push_status', type: 'boolean', default: false, description: 'Fetch push-remote ahead/behind information (requires fetch_status)' },
    { name: 'fetch_user', type: 'boolean', default: false, description: 'Fetch the current configured user for the repository' },
    { name: 'ignore_status', type: 'array', default: [], description: 'Do not fetch status for these repos' },
    { name: 'source', type: 'enum', default: 'cli', description: 'How to fetch git information', values: ['cli', 'pwsh'] },
    { name: 'branch_icon', type: 'string', default: '', description: 'Icon to use in front of git branch name' },
    { name: 'github_icon', type: 'string', default: '', description: 'Icon when upstream is GitHub' },
    { name: 'gitlab_icon', type: 'string', default: '', description: 'Icon when upstream is GitLab' },
    { name: 'bitbucket_icon', type: 'string', default: '', description: 'Icon when upstream is Bitbucket' },
    { name: 'azure_devops_icon', type: 'string', default: '', description: 'Icon when upstream is Azure DevOps' },
    { name: 'codecommit_icon', type: 'string', default: '', description: 'Icon when upstream is AWS CodeCommit' },
    { name: 'codeberg_icon', type: 'string', default: '', description: 'Icon when upstream is Codeberg' },
    { name: 'git_icon', type: 'string', default: '', description: 'Icon when upstream is unknown' },
    { name: 'mapped_branches', type: 'object', default: {}, description: 'Custom glyphs for specific branches' },
    { name: 'branch_template', type: 'string', default: '', description: 'Template to format branch name' },
    { name: 'status_formats', type: 'object', default: {}, description: 'Override how status items are displayed' },
    { name: 'upstream_icons', type: 'object', default: {}, description: 'Map of remote URL patterns to icons' },
    { name: 'disable_with_jj', type: 'boolean', default: false, description: 'Disable in Jujutsu collocated repository' }
  ],
  
  jujutsu: [
    { name: 'change_id_min_len', type: 'number', default: 0, description: 'ChangeID minimum length, even if shorter would be unique' },
    { name: 'fetch_status', type: 'boolean', default: false, description: 'Fetch the local changes' },
    { name: 'ignore_working_copy', type: 'boolean', default: true, description: "Don't snapshot/update the working copy" },
    { name: 'fetch_ahead_counter', type: 'boolean', default: false, description: 'Fetch counter for changes between working copy and closest bookmark' },
    { name: 'ahead_icon', type: 'string', default: '⇡', description: 'Icon/character between bookmark and ahead counter' },
    { name: 'native_fallback', type: 'boolean', default: false, description: 'Fallback to native jj executable in WSL2' },
    { name: 'status_formats', type: 'object', default: {}, description: 'Override how status items are displayed' }
  ],
  
  mercurial: [
    { name: 'fetch_status', type: 'boolean', default: false, description: 'Fetch the local changes' },
    { name: 'native_fallback', type: 'boolean', default: false, description: 'Fallback to native hg executable in WSL2' },
    { name: 'status_formats', type: 'object', default: {}, description: 'Override how status items are displayed' }
  ],
  
  plastic: [
    { name: 'fetch_status', type: 'boolean', default: false, description: 'Fetch the local changes' },
    { name: 'status_formats', type: 'object', default: {}, description: 'Override how status items are displayed' },
    { name: 'branch_icon', type: 'string', default: '', description: 'Icon to use in front of branch name' },
    { name: 'mapped_branches', type: 'object', default: {}, description: 'Custom glyphs for specific branches' },
    { name: 'branch_template', type: 'string', default: '', description: 'Template to format branch name' },
    { name: 'commit_icon', type: 'string', default: '', description: 'Icon/text to display before commit context' },
    { name: 'tag_icon', type: 'string', default: '', description: 'Icon/text to display before tag context' }
  ],
  
  sapling: [
    { name: 'fetch_status', type: 'boolean', default: true, description: 'Fetch the local changes' },
    { name: 'native_fallback', type: 'boolean', default: false, description: 'Fallback to native sl executable in WSL2' },
    { name: 'status_formats', type: 'object', default: {}, description: 'Override how status items are displayed' }
  ],
  
  svn: [
    { name: 'fetch_status', type: 'boolean', default: false, description: 'Fetch the local changes' },
    { name: 'native_fallback', type: 'boolean', default: false, description: 'Fallback to native svn executable in WSL2' },
    { name: 'status_formats', type: 'object', default: {}, description: 'Override how status items are displayed' }
  ]
};

function updateSCMOptions() {
  console.log('🔧 Updating SCM segments with all options...\n');
  
  try {
    const content = fs.readFileSync(SCM_FILE, 'utf8');
    const segments = JSON.parse(content);
    
    let updatedCount = 0;
    let addedOptionsCount = 0;
    
    for (const segment of segments) {
      if (SCM_OPTIONS[segment.type]) {
        const newOptions = SCM_OPTIONS[segment.type];
        
        if (!segment.options) {
          // No options at all
          segment.options = newOptions;
          console.log(`✓ Added ${newOptions.length} options to ${segment.type}`);
          updatedCount++;
          addedOptionsCount += newOptions.length;
        } else {
          // Check for missing options
          const existingNames = new Set(segment.options.map(o => o.name));
          const missingOptions = newOptions.filter(o => !existingNames.has(o.name));
          
          if (missingOptions.length > 0) {
            segment.options.push(...missingOptions);
            console.log(`✓ Added ${missingOptions.length} missing options to ${segment.type}`);
            updatedCount++;
            addedOptionsCount += missingOptions.length;
          } else {
            console.log(`⏭ ${segment.type} already has all options`);
          }
        }
      } else {
        console.log(`⚠ No options defined for ${segment.type}`);
      }
    }
    
    // Save the file
    fs.writeFileSync(SCM_FILE, JSON.stringify(segments, null, 2) + '\n');
    console.log(`\n💾 Saved scm.json`);
    
    console.log('\n' + '='.repeat(50));
    console.log(`\n📊 Summary:`);
    console.log(`  ✓ Updated: ${updatedCount} segments`);
    console.log(`  ✓ Added: ${addedOptionsCount} options`);
    console.log(`\n✅ Done! 🎉\n`);
    
  } catch (error) {
    console.error(`✗ Error:`, error.message);
    process.exit(1);
  }
}

updateSCMOptions();
