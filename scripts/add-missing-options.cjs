#!/usr/bin/env node

/**
 * Script to add MISSING options to segments that were already updated
 * This updates segments with additional options we discovered from docs
 */

const fs = require('fs');
const path = require('path');

const SEGMENTS_DIR = path.join(__dirname, '../public/segments');

// Additional options to add to specific segments
const ADDITIONAL_OPTIONS = {
  // CLI tools that need extensions, folders, tooling
  npm: [
    { name: 'extensions', type: 'array', default: ['package.json', 'package-lock.json'], description: 'File extensions to validate' },
    { name: 'folders', type: 'array', default: [], description: 'Folder names to validate' },
    { name: 'tooling', type: 'array', default: ['npm'], description: 'Tooling to use for fetching version' }
  ],
  yarn: [
    { name: 'extensions', type: 'array', default: ['package.json', 'yarn.lock'], description: 'File extensions to validate' },
    { name: 'folders', type: 'array', default: [], description: 'Folder names to validate' },
    { name: 'tooling', type: 'array', default: ['yarn'], description: 'Tooling to use for fetching version' }
  ],
  pnpm: [
    { name: 'extensions', type: 'array', default: ['package.json', 'pnpm-lock.yaml'], description: 'File extensions to validate' },
    { name: 'folders', type: 'array', default: [], description: 'Folder names to validate' },
    { name: 'tooling', type: 'array', default: ['pnpm'], description: 'Tooling to use for fetching version' }
  ],
  bun: [
    { name: 'extensions', type: 'array', default: ['bun.lockb', 'bun.lock'], description: 'File extensions to validate' },
    { name: 'folders', type: 'array', default: [], description: 'Folder names to validate' },
    { name: 'tooling', type: 'array', default: ['bun'], description: 'Tooling to use for fetching version' }
  ],
  flutter: [
    { name: 'extensions', type: 'array', default: ['*.dart', 'pubspec.yaml', 'pubspec.yml', 'pubspec.lock'], description: 'File extensions to validate' },
    { name: 'folders', type: 'array', default: ['.dart_tool'], description: 'Folder names to validate' },
    { name: 'tooling', type: 'array', default: ['fvm', 'flutter'], description: 'Tooling to use for fetching version' }
  ],
  angular: [
    { name: 'extensions', type: 'array', default: ['angular.json'], description: 'File extensions to validate' },
    { name: 'folders', type: 'array', default: [], description: 'Folder names to validate' },
    { name: 'tooling', type: 'array', default: ['angular'], description: 'Tooling to use for fetching version' }
  ],
  cmake: [
    { name: 'extensions', type: 'array', default: ['*.cmake', 'CMakeLists.txt'], description: 'File extensions to validate' },
    { name: 'folders', type: 'array', default: [], description: 'Folder names to validate' },
    { name: 'tooling', type: 'array', default: ['cmake'], description: 'Tooling to use for fetching version' }
  ],
  mvn: [
    { name: 'extensions', type: 'array', default: ['pom.xml'], description: 'File extensions to validate' },
    { name: 'folders', type: 'array', default: [], description: 'Folder names to validate' },
    { name: 'tooling', type: 'array', default: ['mvn'], description: 'Tooling to use for fetching version' }
  ],
  
  // New system segments
  os: [
    { name: 'display_distro_name', type: 'boolean', default: false, description: 'Display distro name instead of icon for Linux/WSL' },
    { name: 'macos', type: 'string', default: '', description: 'String to use for macOS' },
    { name: 'linux', type: 'string', default: '', description: 'Icon to use for Linux' },
    { name: 'windows', type: 'string', default: '', description: 'Icon to use for Windows' },
    { name: 'alpine', type: 'string', default: '', description: 'Icon for Alpine Linux' },
    { name: 'arch', type: 'string', default: '', description: 'Icon for Arch Linux' },
    { name: 'centos', type: 'string', default: '', description: 'Icon for CentOS' },
    { name: 'debian', type: 'string', default: '', description: 'Icon for Debian' },
    { name: 'fedora', type: 'string', default: '', description: 'Icon for Fedora' },
    { name: 'ubuntu', type: 'string', default: '', description: 'Icon for Ubuntu' },
    { name: 'manjaro', type: 'string', default: '', description: 'Icon for Manjaro Linux' },
    { name: 'mint', type: 'string', default: '', description: 'Icon for Linux Mint' },
    { name: 'opensuse', type: 'string', default: '', description: 'Icon for openSUSE' },
    { name: 'raspbian', type: 'string', default: '', description: 'Icon for Raspberry Pi OS' },
    { name: 'redhat', type: 'string', default: '', description: 'Icon for Red Hat Enterprise Linux' },
    { name: 'gentoo', type: 'string', default: '', description: 'Icon for Gentoo Linux' },
    { name: 'nixos', type: 'string', default: '', description: 'Icon for NixOS' }
  ],
  
  shell: [
    { name: 'mapped_shell_names', type: 'object', default: {}, description: 'Custom glyph/text for specific shell names (case-insensitive)' }
  ],
  
  status: [
    { name: 'always_enabled', type: 'boolean', default: false, description: 'Always show the status' },
    { name: 'status_template', type: 'string', default: '{{ .Code }}', description: 'Template used to render individual status code' },
    { name: 'status_separator', type: 'string', default: '|', description: 'Used to separate multiple statuses when $PIPESTATUS is available' }
  ],
  
  sysinfo: [
    { name: 'precision', type: 'number', default: 2, description: 'Precision used for float values' }
  ],
  
  // Cloud segments
  aws: [
    { name: 'display_default', type: 'boolean', default: true, description: 'Display segment when using default profile' }
  ]
};

function addAdditionalOptions() {
  console.log('🔧 Adding missing options to segment metadata files...\n');
  
  const files = fs.readdirSync(SEGMENTS_DIR).filter(f => f.endsWith('.json'));
  
  let updatedCount = 0;
  let addedOptionsCount = 0;
  
  for (const file of files) {
    const filePath = path.join(SEGMENTS_DIR, file);
    console.log(`Processing ${file}...`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const segments = JSON.parse(content);
      
      let fileModified = false;
      
      for (const segment of segments) {
        // Check if we have additional options for this segment
        if (ADDITIONAL_OPTIONS[segment.type]) {
          const additionalOpts = ADDITIONAL_OPTIONS[segment.type];
          
          // Check if segment already has options
          if (segment.options) {
            // Get existing option names
            const existingNames = new Set(segment.options.map(o => o.name));
            
            // Filter to only new options
            const newOpts = additionalOpts.filter(o => !existingNames.has(o.name));
            
            if (newOpts.length > 0) {
              segment.options.push(...newOpts);
              console.log(`  ✓ Added ${newOpts.length} missing options to ${segment.type}`);
              fileModified = true;
              updatedCount++;
              addedOptionsCount += newOpts.length;
            } else {
              console.log(`  ⏭ ${segment.type} already has all options`);
            }
          } else {
            // No options at all, add them
            segment.options = additionalOpts;
            console.log(`  ✓ Added ${additionalOpts.length} options to ${segment.type}`);
            fileModified = true;
            updatedCount++;
            addedOptionsCount += additionalOpts.length;
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
  console.log(`  ✓ Added: ${addedOptionsCount} missing options`);
  console.log(`\n✅ Done! 🎉\n`);
}

addAdditionalOptions();
