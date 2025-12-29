import type { SegmentCategory } from '../types/ohmyposh';

// Category-based color schemes for segments
export const categoryColors: Record<SegmentCategory, { background: string; foreground: string }> = {
  // System segments - Blue/Cyan tones (reliable, stable)
  system: {
    background: '#61AFEF',
    foreground: '#ffffff',
  },
  // SCM/Version Control - Green tones (growth, tracking)
  scm: {
    background: '#98C379',
    foreground: '#ffffff',
  },
  // Programming Languages - Purple/Magenta tones (creative, technical)
  languages: {
    background: '#C678DD',
    foreground: '#ffffff',
  },
  // Cloud & Infrastructure - Orange tones (energy, connectivity)
  cloud: {
    background: '#E5C07B',
    foreground: '#282c34',
  },
  // CLI Tools - Teal/Cyan tones (modern, efficient)
  cli: {
    background: '#56B6C2',
    foreground: '#ffffff',
  },
  // Web segments - Blue/Purple gradient
  web: {
    background: '#7C9FF5',
    foreground: '#ffffff',
  },
  // Music segments - Pink/Red tones (passion, entertainment)
  music: {
    background: '#E06C75',
    foreground: '#ffffff',
  },
  // Health segments - Green/Lime tones (wellness, vitality)
  health: {
    background: '#89CA78',
    foreground: '#282c34',
  },
};

// Specific overrides for certain segment types that need distinct colors
export const segmentColorOverrides: Record<string, { background: string; foreground: string }> = {
  // Git - Bright green to stand out
  git: {
    background: '#98C379',
    foreground: '#ffffff',
  },
  // Path - Blue
  path: {
    background: '#61AFEF',
    foreground: '#ffffff',
  },
  // Node.js - Node green
  node: {
    background: '#68A063',
    foreground: '#ffffff',
  },
  // Python - Python blue/yellow
  python: {
    background: '#4B8BBE',
    foreground: '#FFD43B',
  },
  // Go - Go cyan
  go: {
    background: '#00ADD8',
    foreground: '#ffffff',
  },
  // Rust - Rust orange
  rust: {
    background: '#CE422B',
    foreground: '#ffffff',
  },
  // Java - Java red/orange
  java: {
    background: '#E76F00',
    foreground: '#ffffff',
  },
  // .NET - Microsoft purple
  dotnet: {
    background: '#512BD4',
    foreground: '#ffffff',
  },
  // PHP - PHP purple
  php: {
    background: '#777BB3',
    foreground: '#ffffff',
  },
  // Ruby - Ruby red
  ruby: {
    background: '#CC342D',
    foreground: '#ffffff',
  },
  // Docker - Docker blue
  docker: {
    background: '#2496ED',
    foreground: '#ffffff',
  },
  // Kubernetes - K8s blue
  kubectl: {
    background: '#326CE5',
    foreground: '#ffffff',
  },
  // AWS - AWS orange
  aws: {
    background: '#FF9900',
    foreground: '#232F3E',
  },
  // Azure - Azure blue
  az: {
    background: '#0078D4',
    foreground: '#ffffff',
  },
  azd: {
    background: '#0078D4',
    foreground: '#ffffff',
  },
  // GCP - GCP multi-color (using red)
  gcp: {
    background: '#EA4335',
    foreground: '#ffffff',
  },
  // Terraform - Terraform purple
  terraform: {
    background: '#7B42BC',
    foreground: '#ffffff',
  },
  // Status - Green for success context
  status: {
    background: '#98C379',
    foreground: '#ffffff',
  },
  // Execution time - Yellow/amber for timing
  executiontime: {
    background: '#E5C07B',
    foreground: '#282c34',
  },
  // Time - Cyan
  time: {
    background: '#56B6C2',
    foreground: '#ffffff',
  },
  // Battery - Amber/yellow
  battery: {
    background: '#E5C07B',
    foreground: '#282c34',
  },
  // Root/admin - Red for warning
  root: {
    background: '#E06C75',
    foreground: '#ffffff',
  },
  // React - React blue
  react: {
    background: '#61DAFB',
    foreground: '#282c34',
  },
  // Angular - Angular red
  angular: {
    background: '#DD0031',
    foreground: '#ffffff',
  },
  // Spotify - Spotify green
  spotify: {
    background: '#1DB954',
    foreground: '#ffffff',
  },
};

export function getSegmentColors(segmentType: string, category: SegmentCategory): { background: string; foreground: string } {
  // Check for specific override first
  if (segmentColorOverrides[segmentType]) {
    return segmentColorOverrides[segmentType];
  }
  // Fall back to category color
  return categoryColors[category];
}
