import type { SegmentMetadata } from '../types/ohmyposh';

// Segments are now loaded dynamically from JSON files
// Use segmentLoader.ts to load segments on demand

export const segmentMetadata: SegmentMetadata[] = [];

export const segmentCategories: { id: string; name: string; icon: string }[] = [
  { id: 'system', name: 'System', icon: 'ui-monitor' },
  { id: 'scm', name: 'Version Control', icon: 'vcs-git-merge' },
  { id: 'languages', name: 'Languages', icon: 'ui-code' },
  { id: 'cloud', name: 'Cloud & Infra', icon: 'cloud-generic' },
  { id: 'cli', name: 'CLI Tools', icon: 'dev-terminal' },
  { id: 'web', name: 'Web', icon: 'ui-globe' },
  { id: 'music', name: 'Music', icon: 'symbol-music' },
  { id: 'health', name: 'Health', icon: 'symbol-heart' },
];

