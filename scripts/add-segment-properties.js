// Script to add properties to all segment JSON files
// This is a temporary helper script

const fs = require('fs');
const path = require('path');

// Standard version properties used by most CLI/language segments
const standardVersionProps = [
  { name: ".Full", type: "string", description: "the full version" },
  { name: ".Major", type: "string", description: "major number" },
  { name: ".Minor", type: "string", description: "minor number" },
  { name: ".Patch", type: "string", description: "patch number" },
  { name: ".URL", type: "string", description: "URL of the version info / release notes" },
  { name: ".Error", type: "string", description: "error encountered when fetching the version string" }
];

// Properties for specific segments
const segmentProperties = {
  // CLI Segments
  angular: standardVersionProps,
  argocd: [
    { name: ".Name", type: "string", description: "the current context name" },
    { name: ".Server", type: "string", description: "the server of the current context" },
    { name: ".User", type: "string", description: "the user of the current context" }
  ],
  aurelia: standardVersionProps,
  bazel: [
    ...standardVersionProps,
    { name: ".Icon", type: "string", description: "the icon representing Bazel's logo" }
  ],
  buf: standardVersionProps,
  bun: standardVersionProps,
  claude: [
    { name: ".SessionID", type: "string", description: "Unique identifier for the Claude session" },
    { name: ".Model.ID", type: "string", description: "Technical model identifier" },
    { name: ".Model.DisplayName", type: "string", description: "Human-readable model name (e.g., \"Claude 3.5 Sonnet\")" },
    { name: ".Workspace.CurrentDir", type: "string", description: "Current working directory" },
    { name: ".Workspace.ProjectDir", type: "string", description: "Root project directory" },
    { name: ".Cost.TotalCostUSD", type: "float64", description: "Total cost in USD" },
    { name: ".Cost.TotalDurationMS", type: "int64", description: "Total session duration in milliseconds" },
    { name: ".ContextWindow.TotalInputTokens", type: "int", description: "Total input tokens used in the session" },
    { name: ".ContextWindow.TotalOutputTokens", type: "int", description: "Total output tokens generated in the session" },
    { name: ".ContextWindow.ContextWindowSize", type: "int", description: "Maximum context window size for the model" },
    { name: ".ContextWindow.CurrentUsage.InputTokens", type: "int", description: "Input tokens for the current message" },
    { name: ".ContextWindow.CurrentUsage.OutputTokens", type: "int", description: "Output tokens for the current message" },
    { name: ".TokenUsagePercent", type: "Percentage", description: "Percentage of context window used (0-100)" },
    { name: ".FormattedCost", type: "string", description: "Formatted cost string (e.g., \"$0.15\" or \"$0.0012\")" },
    { name: ".FormattedTokens", type: "string", description: "Human-readable token count (e.g., \"1.2K\", \"15.3M\")" }
  ],
  cmake: standardVersionProps,
  deno: standardVersionProps,
  docker: [
    { name: ".Context", type: "string", description: "the current active context" }
  ],
  firebase: [
    { name: ".Project", type: "string", description: "the currently active project" }
  ],
  flutter: standardVersionProps,
  copilot: [
    { name: ".Premium.Used", type: "int", description: "Number of premium interactions used" },
    { name: ".Premium.Limit", type: "int", description: "Total premium interactions available" },
    { name: ".Premium.Percent", type: "Percentage", description: "Percentage of premium quota used (0-100)" },
    { name: ".Premium.Remaining", type: "Percentage", description: "Percentage of premium quota remaining (0-100)" },
    { name: ".Premium.Unlimited", type: "bool", description: "Whether premium quota is unlimited" },
    { name: ".Inline.Used", type: "int", description: "Number of inline completions used" },
    { name: ".Inline.Limit", type: "int", description: "Total inline completions available" },
    { name: ".Inline.Percent", type: "Percentage", description: "Percentage of inline quota used (0-100)" },
    { name: ".Inline.Remaining", type: "Percentage", description: "Percentage of inline quota remaining (0-100)" },
    { name: ".Inline.Unlimited", type: "bool", description: "Whether inline quota is unlimited" },
    { name: ".Chat.Used", type: "int", description: "Number of chat interactions used" },
    { name: ".Chat.Limit", type: "int", description: "Total chat interactions available" },
    { name: ".Chat.Percent", type: "Percentage", description: "Percentage of chat quota used (0-100)" },
    { name: ".Chat.Remaining", type: "Percentage", description: "Percentage of chat quota remaining (0-100)" },
    { name: ".Chat.Unlimited", type: "bool", description: "Whether chat quota is unlimited" },
    { name: ".BillingCycleEnd", type: "string", description: "End date of current billing cycle" }
  ],
  helm: [
    { name: ".Version", type: "string", description: "Helm cli version" }
  ],
  mvn: standardVersionProps,
  nbgv: [
    { name: ".Version", type: "string", description: "the current version" },
    { name: ".AssemblyVersion", type: "string", description: "the current assembly version" },
    { name: ".AssemblyInformationalVersion", type: "string", description: "the current assembly informational version" },
    { name: ".NuGetPackageVersion", type: "string", description: "the current nuget package version" },
    { name: ".ChocolateyPackageVersion", type: "string", description: "the current chocolatey package version" },
    { name: ".NpmPackageVersion", type: "string", description: "the current npm package version" },
    { name: ".SimpleVersion", type: "string", description: "the current simple version" }
  ],
  "nix-shell": [
    { name: ".Type", type: "string", description: "the type of nix shell, can be pure, impure or unknown" }
  ],
  npm: standardVersionProps,
  nx: standardVersionProps,
  pnpm: standardVersionProps,
  quasar: [
    ...standardVersionProps,
    { name: ".Vite.Version", type: "string", description: "the full version of vite dependency" },
    { name: ".Vite.Dev", type: "boolean", description: "whether vite is a development dependency" },
    { name: ".AppVite.Version", type: "string", description: "the full version of @quasar/app-vite dependency" },
    { name: ".AppVite.Dev", type: "boolean", description: "whether @quasar/app-vite is a development dependency" }
  ],
  react: standardVersionProps,
  svelte: standardVersionProps,
  talosctl: [
    { name: ".Context", type: "string", description: "the current talosctl context" }
  ],
  tauri: standardVersionProps,
  ui5tooling: standardVersionProps,
  umbraco: [
    { name: ".Modern", type: "boolean", description: "a boolean to determine if this is modern Umbraco V9+ using modern .NET or if it's legacy Umbraco using .NET Framework" },
    { name: ".Version", type: "string", description: "the version of umbraco found" }
  ],
  unity: [
    { name: ".UnityVersion", type: "string", description: "the Unity version" },
    { name: ".CSharpVersion", type: "string", description: "the C# version" }
  ],
  winget: [
    { name: ".UpdateCount", type: "int", description: "the number of packages with available updates" },
    { name: ".Updates[].Name", type: "string", description: "the package name" },
    { name: ".Updates[].ID", type: "string", description: "the package ID" },
    { name: ".Updates[].Current", type: "string", description: "the currently installed version" },
    { name: ".Updates[].Available", type: "string", description: "the available version for update" }
  ],
  xmake: standardVersionProps.filter(p => p.name !== '.URL'), // xmake doesn't have URL
  yarn: standardVersionProps
};

// Add more segment properties as needed...

console.log('Segment properties mapping created.');
console.log(`Total segments with properties defined: ${Object.keys(segmentProperties).length}`);
