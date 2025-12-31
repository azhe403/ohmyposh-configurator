#!/usr/bin/env node

/**
 * Script to add options to segment metadata files
 * This adds the "options" array alongside the existing "properties" array
 */

const fs = require('fs');
const path = require('path');

const SEGMENTS_DIR = path.join(__dirname, '../public/segments');

// Options data for each segment (gathered from Oh My Posh documentation)
// Format: segment type -> options array
const SEGMENT_OPTIONS = {
  // === SYSTEM SEGMENTS ===
  
  // Path segment
  path: [
    { name: 'style', type: 'enum', default: 'folder', description: 'How to display the current path', values: ['folder', 'full', 'agnoster', 'agnoster_full', 'agnoster_short', 'agnoster_left', 'mixed', 'letter', 'unique', 'powerlevel', 'fish'] },
    { name: 'folder_separator_icon', type: 'string', default: '/', description: 'The symbol to use as a separator between folders' },
    { name: 'folder_separator_template', type: 'string', default: '', description: 'The template to use as a separator between folders' },
    { name: 'home_icon', type: 'string', default: '~', description: 'The icon to display when at $HOME' },
    { name: 'folder_icon', type: 'string', default: '..', description: 'The icon to use as a folder indication' },
    { name: 'windows_registry_icon', type: 'string', default: '', description: 'The icon to display when in the Windows registry' },
    { name: 'mixed_threshold', type: 'number', default: 4, description: 'Maximum length of a path segment for Mixed style' },
    { name: 'max_depth', type: 'number', default: 1, description: 'Maximum path depth to display before shortening (agnoster_short)' },
    { name: 'max_width', type: 'number', default: 0, description: 'Maximum path length to display (powerlevel/agnoster)' },
    { name: 'hide_root_location', type: 'boolean', default: false, description: 'Hides the root location if it doesn\'t fit (agnoster_short)' },
    { name: 'cycle', type: 'array', default: [], description: 'List of color overrides to cycle through for path folders' },
    { name: 'cycle_folder_separator', type: 'boolean', default: false, description: 'Colorize the folder_separator_icon when using cycle' },
    { name: 'folder_format', type: 'string', default: '%s', description: 'Format to use on individual path folders' },
    { name: 'edge_format', type: 'string', default: '%s', description: 'Format for first and last folder' },
    { name: 'left_format', type: 'string', default: '%s', description: 'Format for first folder (defaults to edge_format)' },
    { name: 'right_format', type: 'string', default: '%s', description: 'Format for last folder (defaults to edge_format)' },
    { name: 'gitdir_format', type: 'string', default: '', description: 'Format for git root directory' },
    { name: 'display_cygpath', type: 'boolean', default: false, description: 'Display Cygwin style path' },
    { name: 'display_root', type: 'boolean', default: false, description: 'Display the root / on Unix systems' },
    { name: 'dir_length', type: 'number', default: 1, description: 'Length of directory name to display (fish style)' },
    { name: 'full_length_dirs', type: 'number', default: 1, description: 'Number of full length directory names (fish style)' },
    { name: 'mapped_locations', type: 'object', default: {}, description: 'Custom glyphs/text for specific paths' },
    { name: 'mapped_locations_enabled', type: 'boolean', default: true, description: 'Replace known locations in the path' }
  ],
  
  // Git segment
  git: [
    { name: 'fetch_status', type: 'boolean', default: false, description: 'Fetch the local changes' },
    { name: 'fetch_push_status', type: 'boolean', default: false, description: 'Fetch push-remote ahead/behind information (requires fetch_status)' },
    { name: 'fetch_upstream_icon', type: 'boolean', default: false, description: 'Fetch upstream icon' },
    { name: 'fetch_bare_info', type: 'boolean', default: false, description: 'Fetch bare repository info' },
    { name: 'fetch_worktree_count', type: 'boolean', default: false, description: 'Fetch worktree count' },
    { name: 'fetch_user', type: 'boolean', default: false, description: 'Fetch the current configured user for the repository' },
    { name: 'untracked_modes', type: 'object', default: {}, description: 'Map of repo paths to untracked file modes (no, normal, all)' },
    { name: 'ignore_submodules', type: 'object', default: {}, description: 'Map of repo paths to ignore submodules settings' },
    { name: 'ignore_status', type: 'array', default: [], description: 'Do not fetch status for these repos' },
    { name: 'native_fallback', type: 'boolean', default: false, description: 'Use native git when libgit2 fails (WSL2)' },
    { name: 'source', type: 'enum', default: 'cli', description: 'How to fetch git information', values: ['cli', 'pwsh'] },
    { name: 'branch_max_length', type: 'number', default: 0, description: 'Maximum length of branch name' },
    { name: 'branch_icon', type: 'string', default: '', description: 'Icon to use in front of git branch name' },
    { name: 'branch_identical_icon', type: 'string', default: '≡', description: 'Icon when local and remote are identical' },
    { name: 'branch_ahead_icon', type: 'string', default: '↑', description: 'Icon when local is ahead of remote' },
    { name: 'branch_behind_icon', type: 'string', default: '↓', description: 'Icon when local is behind remote' },
    { name: 'branch_gone_icon', type: 'string', default: '≢', description: 'Icon when there\'s no remote branch' },
    { name: 'commit_icon', type: 'string', default: '', description: 'Icon for commit reference (detached HEAD)' },
    { name: 'tag_icon', type: 'string', default: '笠', description: 'Icon for tag reference' },
    { name: 'rebase_icon', type: 'string', default: '', description: 'Icon for rebase state' },
    { name: 'cherry_pick_icon', type: 'string', default: '', description: 'Icon for cherry-pick state' },
    { name: 'revert_icon', type: 'string', default: '', description: 'Icon for revert state' },
    { name: 'merge_icon', type: 'string', default: '', description: 'Icon for merge state' },
    { name: 'no_commits_icon', type: 'string', default: '', description: 'Icon when repository has no commits' },
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
  
  // Battery segment
  battery: [
    { name: 'display_error', type: 'boolean', default: false, description: 'Show error when failing to retrieve battery information' },
    { name: 'charging_icon', type: 'string', default: '', description: 'Icon to display when charging' },
    { name: 'discharging_icon', type: 'string', default: '', description: 'Icon to display when discharging' },
    { name: 'charged_icon', type: 'string', default: '', description: 'Icon to display when fully charged' },
    { name: 'not_charging_icon', type: 'string', default: '', description: 'Icon to display when not charging' }
  ],
  
  // Execution time segment
  executiontime: [
    { name: 'threshold', type: 'number', default: 500, description: 'Minimum duration (milliseconds) to enable this segment' },
    { name: 'style', type: 'enum', default: 'austin', description: 'Format style for time display', values: ['austin', 'roundrock', 'dallas', 'galveston', 'galvestonms', 'houston', 'amarillo', 'round', 'lucky7'] },
    { name: 'always_enabled', type: 'boolean', default: false, description: 'Always show the duration' }
  ],
  
  // Time segment
  time: [
    { name: 'time_format', type: 'string', default: '15:04:05', description: 'Format string for time display (Go time format)' }
  ],
  
  // Session segment
  session: [
    { name: 'ssh_icon', type: 'string', default: '📡', description: 'Icon for SSH connections' },
    { name: 'user_info_separator', type: 'string', default: '@', description: 'Separator between user and host' },
    { name: 'display_host', type: 'boolean', default: true, description: 'Display hostname' },
    { name: 'display_user', type: 'boolean', default: true, description: 'Display username' },
    { name: 'display_default', type: 'boolean', default: true, description: 'Display segment even with default user' }
  ],
  
  // Copilot segment
  copilot: [
    { name: 'http_timeout', type: 'number', default: 20, description: 'HTTP request timeout in milliseconds' }
  ],
  
  // === LANGUAGE SEGMENTS ===
  
  // Python segment
  python: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_virtual_env', type: 'boolean', default: true, description: 'Fetch virtualenv name' },
    { name: 'display_default', type: 'boolean', default: true, description: 'Show virtualenv when default (system, base)' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Python version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'environment', description: 'When to display segment', values: ['always', 'files', 'environment', 'context'] }
  ],
  
  // Node segment
  node: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Node.js version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Go segment
  go: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Go version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Rust segment
  rust: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Rust version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Ruby segment
  ruby: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Ruby version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Java segment
  java: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Java version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // PHP segment
  php: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch PHP version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Dotnet segment
  dotnet: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch .NET version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Julia segment
  julia: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Julia version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Perl segment
  perl: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Perl version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Lua segment
  lua: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Lua version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Swift segment
  swift: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Swift version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Kotlin segment
  kotlin: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Kotlin version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Haskell segment
  haskell: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch GHC version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Elixir segment
  elixir: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Elixir version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Dart segment
  dart: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Dart version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Crystal segment
  crystal: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Crystal version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Nim segment
  nim: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Nim version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // R segment
  r: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch R version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Zig segment
  zig: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Zig version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // V segment
  v: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch V version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Vala segment
  vala: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Vala version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Ocaml segment
  ocaml: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch OCaml version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Clojure segment
  clojure: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Clojure version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Fortran segment
  fortran: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch gfortran version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Mojo segment
  mojo: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_virtual_env', type: 'boolean', default: true, description: 'Fetch virtualenv name' },
    { name: 'display_default', type: 'boolean', default: true, description: 'Show virtualenv when default' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Mojo version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'environment', description: 'When to display segment', values: ['always', 'files', 'environment', 'context'] }
  ],
  
  // === CLI TOOL SEGMENTS ===
  
  // NPM segment
  npm: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch NPM version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Yarn segment
  yarn: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Yarn version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // PNPM segment
  pnpm: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch PNPM version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Bun segment
  bun: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Bun version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Deno segment
  deno: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Deno version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Cmake segment
  cmake: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch CMake version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Flutter segment
  flutter: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Flutter version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' }
  ],
  
  // Angular segment
  angular: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Angular CLI version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' }
  ],
  
  // React segment
  react: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch React version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' }
  ],
  
  // Svelte segment
  svelte: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Svelte version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' }
  ],
  
  // Aurelia segment
  aurelia: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Aurelia version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' }
  ],
  
  // Quasar segment
  quasar: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Quasar version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' }
  ],
  
  // Maven segment
  mvn: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Maven version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' },
    { name: 'display_mode', type: 'enum', default: 'context', description: 'When to display segment', values: ['always', 'files', 'context'] },
    { name: 'version_url_template', type: 'string', default: '', description: 'Template for version URL' }
  ],
  
  // Bazel segment
  bazel: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Bazel version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' }
  ],
  
  // Buf segment
  buf: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Buf version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' }
  ],
  
  // NX segment
  nx: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch NX version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' }
  ],
  
  // Xmake segment
  xmake: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch xmake version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' }
  ],
  
  // Tauri segment
  tauri: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Tauri version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' }
  ],
  
  // UI5Tooling segment
  ui5tooling: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch UI5 Tooling version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' }
  ],
  
  // === CLOUD SEGMENTS ===
  
  // Azure Functions segment
  azfunc: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Azure Functions CLI version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' }
  ],
  
  // Cloud Foundry segment
  cf: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch Cloud Foundry CLI version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' }
  ],
  
  // CDS segment
  cds: [
    { name: 'home_enabled', type: 'boolean', default: false, description: 'Display in HOME folder' },
    { name: 'fetch_version', type: 'boolean', default: true, description: 'Fetch CDS version' },
    { name: 'cache_duration', type: 'string', default: 'none', description: 'Cache duration (e.g., "5m", "1h")' },
    { name: 'missing_command_text', type: 'string', default: '', description: 'Text when command is missing' }
  ]
};

function addOptionsToSegments() {
  console.log('🔧 Adding options to segment metadata files...\n');
  
  const files = fs.readdirSync(SEGMENTS_DIR).filter(f => f.endsWith('.json'));
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(SEGMENTS_DIR, file);
    console.log(`Processing ${file}...`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const segments = JSON.parse(content);
      
      let fileModified = false;
      
      for (const segment of segments) {
        // Check if this segment type has options defined
        if (SEGMENT_OPTIONS[segment.type]) {
          // Only add if not already present
          if (!segment.options) {
            segment.options = SEGMENT_OPTIONS[segment.type];
            console.log(`  ✓ Added ${SEGMENT_OPTIONS[segment.type].length} options to ${segment.type}`);
            fileModified = true;
            updatedCount++;
          } else {
            console.log(`  ⏭ ${segment.type} already has options`);
            skippedCount++;
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
  console.log(`  ⏭ Skipped: ${skippedCount} segments (already had options)`);
  console.log(`\nDone! 🎉\n`);
}

addOptionsToSegments();
