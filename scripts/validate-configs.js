#!/usr/bin/env node

/**
 * Validation script for Oh My Posh Configurator config files
 * Validates manifest.json and individual config files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIGS_DIR = path.join(__dirname, '../public/configs');
const CATEGORIES = ['samples', 'community'];

// Required fields for manifest entries
const MANIFEST_REQUIRED_FIELDS = ['id', 'name', 'description', 'icon', 'author', 'tags', 'file'];

// Required fields for Oh My Posh config files (no metadata wrapper)
const OMP_CONFIG_REQUIRED_FIELDS = ['$schema', 'blocks'];

let errors = [];
let warnings = [];

function log(message, type = 'info') {
  const prefix = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✗'
  }[type];
  console.log(`${prefix} ${message}`);
}

function addError(message) {
  errors.push(message);
  log(message, 'error');
}

function addWarning(message) {
  warnings.push(message);
  log(message, 'warning');
}

function validateJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    addError(`Invalid JSON in ${filePath}: ${error.message}`);
    return null;
  }
}

function validateManifest(category, manifestPath) {
  log(`Validating ${category}/manifest.json...`);
  
  const manifest = validateJSON(manifestPath);
  if (!manifest) return [];

  // Check required manifest structure
  if (!manifest.version) {
    addError(`${category}/manifest.json missing 'version' field`);
  }
  
  if (!manifest.configs || !Array.isArray(manifest.configs)) {
    addError(`${category}/manifest.json missing or invalid 'configs' array`);
    return [];
  }

  const configIds = new Set();
  const configFiles = new Set();

  // Validate each config entry
  manifest.configs.forEach((config, index) => {
    const prefix = `${category}/manifest.json entry ${index}`;

    // Check required fields
    MANIFEST_REQUIRED_FIELDS.forEach(field => {
      if (!config[field]) {
        addError(`${prefix}: missing required field '${field}'`);
      }
    });

    // Check for duplicate IDs
    if (config.id) {
      if (configIds.has(config.id)) {
        addError(`${prefix}: duplicate ID '${config.id}'`);
      }
      configIds.add(config.id);
    }

    // Check tags is an array
    if (config.tags && !Array.isArray(config.tags)) {
      addError(`${prefix}: 'tags' must be an array`);
    }

    // Track files to validate
    if (config.file) {
      configFiles.add(config.file);
    }
  });

  log(`Found ${manifest.configs.length} configs in ${category}/manifest.json`, 'success');
  return Array.from(configFiles);
}

function validateConfigFile(category, fileName) {
  const filePath = path.join(CONFIGS_DIR, category, fileName);
  log(`Validating ${category}/${fileName}...`);

  if (!fs.existsSync(filePath)) {
    addError(`${category}/${fileName}: file referenced in manifest but not found`);
    return;
  }

  const config = validateJSON(filePath);
  if (!config) return;

  const prefix = `${category}/${fileName}`;

  // Config files now contain only the Oh My Posh configuration (no metadata wrapper)
  // Validate required Oh My Posh config fields
  OMP_CONFIG_REQUIRED_FIELDS.forEach(field => {
    if (!config[field]) {
      addError(`${prefix}: missing required Oh My Posh config field '${field}'`);
    }
  });

  // Validate $schema
  if (config.$schema && !config.$schema.includes('oh-my-posh')) {
    addWarning(`${prefix}: $schema doesn't appear to be for Oh My Posh`);
  }

  // Validate blocks structure
  if (config.blocks) {
    if (!Array.isArray(config.blocks)) {
      addError(`${prefix}: blocks must be an array`);
    } else {
      config.blocks.forEach((block, blockIndex) => {
        if (!block.type) {
          addError(`${prefix}: block ${blockIndex} missing 'type' field`);
        }
        if (!block.segments || !Array.isArray(block.segments)) {
          addError(`${prefix}: block ${blockIndex} missing or invalid 'segments' array`);
        } else if (block.segments.length === 0) {
          addWarning(`${prefix}: block ${blockIndex} has no segments`);
        } else {
          // Validate each segment has required fields
          block.segments.forEach((segment, segmentIndex) => {
            if (!segment.type) {
              addError(`${prefix}: block ${blockIndex}, segment ${segmentIndex} missing 'type' field`);
            }
          });
        }
      });
    }
  }

  log(`${category}/${fileName} validated`, 'success');
}

function validateCategory(category) {
  log(`\n📁 Validating ${category} category...`, 'info');
  
  const categoryPath = path.join(CONFIGS_DIR, category);
  const manifestPath = path.join(categoryPath, 'manifest.json');

  if (!fs.existsSync(manifestPath)) {
    addError(`${category}/manifest.json not found`);
    return;
  }

  // Validate manifest and get list of config files
  const configFiles = validateManifest(category, manifestPath);

  // Validate each config file
  configFiles.forEach(fileName => {
    validateConfigFile(category, fileName);
  });

  // Check for orphaned files (files not in manifest)
  const actualFiles = fs.readdirSync(categoryPath)
    .filter(f => f.endsWith('.json') && f !== 'manifest.json');
  
  actualFiles.forEach(file => {
    if (!configFiles.includes(file)) {
      addWarning(`${category}/${file}: file exists but not referenced in manifest`);
    }
  });
}

function main() {
  console.log('\n🔍 Oh My Posh Configurator - Config Validation\n');
  console.log('='.repeat(50));

  // Check configs directory exists
  if (!fs.existsSync(CONFIGS_DIR)) {
    addError(`Configs directory not found: ${CONFIGS_DIR}`);
    process.exit(1);
  }

  // Validate each category
  CATEGORIES.forEach(category => {
    const categoryPath = path.join(CONFIGS_DIR, category);
    if (fs.existsSync(categoryPath)) {
      validateCategory(category);
    } else {
      addError(`Category directory not found: ${category}`);
    }
  });

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Validation Summary:\n');
  
  if (errors.length === 0 && warnings.length === 0) {
    log('All validations passed! ✨', 'success');
    process.exit(0);
  } else {
    if (warnings.length > 0) {
      console.log(`⚠️  ${warnings.length} warning(s)`);
    }
    if (errors.length > 0) {
      console.log(`✗ ${errors.length} error(s)`);
      console.log('\nValidation failed. Please fix the errors above.');
      process.exit(1);
    } else {
      log('Validation passed with warnings', 'success');
      process.exit(0);
    }
  }
}

main();
