import type { SegmentMetadata } from '../types/ohmyposh';

// Segments are now loaded dynamically from JSON files
// Use segmentLoader.ts to load segments on demand

export const segmentMetadata: SegmentMetadata[] = [];

export const segmentCategories: { id: string; name: string; icon: string }[] = [
  { id: 'system', name: 'System', icon: 'Monitor' },
  { id: 'scm', name: 'Version Control', icon: 'GitMerge' },
  { id: 'languages', name: 'Languages', icon: 'Code' },
  { id: 'cloud', name: 'Cloud & Infra', icon: 'Cloud' },
  { id: 'cli', name: 'CLI Tools', icon: 'Terminal' },
  { id: 'web', name: 'Web', icon: 'Globe' },
  { id: 'music', name: 'Music', icon: 'Music' },
  { id: 'health', name: 'Health', icon: 'Heart' },
];

