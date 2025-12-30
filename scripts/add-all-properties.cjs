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

// All segment properties mapped by segment type
const allProperties = {
  // CLI Segments
  angular: standardVersionProps,
  argocd: [
    { name: ".Name", type: "string", description: "the current context name" },
    { name: ".Server", type: "string", description: "the server of the current context" },
    { name: ".User", type: "string", description: "the user of the current context" }
  ],
  aurelia: standardVersionProps,
  bazel: [...standardVersionProps, { name: ".Icon", type: "string", description: "the icon representing Bazel's logo" }],
  buf: standardVersionProps,
  bun: standardVersionProps,
  claude: [
    { name: ".SessionID", type: "string", description: "Unique identifier for the Claude session" },
    { name: ".Model.ID", type: "string", description: "Technical model identifier" },
    { name: ".Model.DisplayName", type: "string", description: "Human-readable model name" },
    { name: ".TokenUsagePercent", type: "Percentage", description: "Percentage of context window used (0-100)" },
    { name: ".FormattedCost", type: "string", description: "Formatted cost string" }
  ],
  cmake: standardVersionProps,
  deno: standardVersionProps,
  docker: [{ name: ".Context", type: "string", description: "the current active context" }],
  firebase: [{ name: ".Project", type: "string", description: "the currently active project" }],
  flutter: standardVersionProps,
  copilot: [
    { name: ".Premium.Percent", type: "Percentage", description: "Percentage of premium quota used" },
    { name: ".Inline.Percent", type: "Percentage", description: "Percentage of inline quota used" },
    { name: ".Chat.Percent", type: "Percentage", description: "Percentage of chat quota used" }
  ],
  helm: [{ name: ".Version", type: "string", description: "Helm cli version" }],
  mvn: standardVersionProps,
  nbgv: [
    { name: ".Version", type: "string", description: "the current version" },
    { name: ".AssemblyVersion", type: "string", description: "the current assembly version" }
  ],
  'nix-shell': [{ name: ".Type", type: "string", description: "the type of nix shell" }],
  npm: standardVersionProps,
  nx: standardVersionProps,
  pnpm: standardVersionProps,
  quasar: standardVersionProps,
  react: standardVersionProps,
  svelte: standardVersionProps,
  talosctl: [{ name: ".Context", type: "string", description: "the current talosctl context" }],
  tauri: standardVersionProps,
  ui5tooling: standardVersionProps,
  umbraco: [
    { name: ".Modern", type: "boolean", description: "modern Umbraco V9+ or legacy" },
    { name: ".Version", type: "string", description: "the version of umbraco found" }
  ],
  unity: [
    { name: ".UnityVersion", type: "string", description: "the Unity version" },
    { name: ".CSharpVersion", type: "string", description: "the C# version" }
  ],
  winget: [{ name: ".UpdateCount", type: "int", description: "the number of packages with available updates" }],
  xmake: standardVersionProps.filter(p => p.name !== '.URL'),
  yarn: standardVersionProps,

  // Language Segments
  dotnet: [
    { name: ".Full", type: "string", description: "the full version" },
    { name: ".Unsupported", type: "boolean", description: "true when the version is not supported" },
    { name: ".Error", type: "string", description: "error encountered when fetching the version string" }
  ],
  clojure: standardVersionProps,
  crystal: standardVersionProps,
  dart: standardVersionProps,
  elixir: standardVersionProps,
  fortran: standardVersionProps,
  go: standardVersionProps,
  haskell: standardVersionProps,
  java: standardVersionProps,
  julia: standardVersionProps,
  kotlin: standardVersionProps,
  lua: standardVersionProps,
  mojo: standardVersionProps,
  nim: standardVersionProps,
  node: [
    ...standardVersionProps,
    { name: ".PackageManagerIcon", type: "string", description: "the package manager icon" },
    { name: ".PackageManagerName", type: "string", description: "the package manager name" }
  ],
  ocaml: standardVersionProps,
  perl: standardVersionProps,
  php: standardVersionProps,
  python: [
    { name: ".Venv", type: "string", description: "the virtual environment name (if present)" },
    ...standardVersionProps
  ],
  r: standardVersionProps,
  ruby: [
    { name: ".Full", type: "string", description: "the full version" },
    { name: ".Error", type: "string", description: "error encountered when fetching the version string" }
  ],
  rust: [
    { name: ".Full", type: "string", description: "the full version" },
    { name: ".Prerelease", type: "string", description: "channel name" },
    { name: ".Error", type: "string", description: "error encountered when fetching the version string" }
  ],
  swift: standardVersionProps,
  v: standardVersionProps,
  vala: standardVersionProps,
  zig: standardVersionProps,

  // Cloud Segments
  aws: [
    { name: ".Profile", type: "string", description: "the currently active profile" },
    { name: ".Region", type: "string", description: "the currently active region" }
  ],
  az: [
    { name: ".Name", type: "string", description: "subscription name" },
    { name: ".ID", type: "string", description: "subscription id" },
    { name: ".User.Name", type: "string", description: "user name" }
  ],
  azd: [
    { name: ".DefaultEnvironment", type: "string", description: "Azure Developer CLI environment name" }
  ],
  azfunc: standardVersionProps.filter(p => p.name !== '.URL'),
  cf: standardVersionProps,
  cftarget: [
    { name: ".Org", type: "string", description: "Cloud Foundry organization" },
    { name: ".Space", type: "string", description: "Cloud Foundry space" }
  ],
  gcp: [
    { name: ".Project", type: "string", description: "the currently active project" },
    { name: ".Error", type: "string", description: "error when loading the GCP config" }
  ],
  kubectl: [
    { name: ".Context", type: "string", description: "the current kubectl context" },
    { name: ".Namespace", type: "string", description: "the current kubectl context namespace" }
  ],
  pulumi: [
    { name: ".Stack", type: "string", description: "the current stack name" },
    { name: ".User", type: "string", description: "the current logged in user" }
  ],
  cds: [
    ...standardVersionProps,
    { name: ".HasDependency", type: "bool", description: "if @sap/cds was found in package.json" }
  ],
  sitecore: [
    { name: ".EndpointName", type: "string", description: "name of the current Sitecore environment" }
  ],
  terraform: [
    { name: ".WorkspaceName", type: "string", description: "the current workspace name" }
  ],

  // SCM Segments
  git: [
    { name: ".RepoName", type: "string", description: "the repo folder name" },
    { name: ".HEAD", type: "string", description: "the current HEAD context" },
    { name: ".Working.Changed", type: "boolean", description: "if the worktree has changes" },
    { name: ".Staging.Changed", type: "boolean", description: "if the staging area has changes" },
    { name: ".BranchStatus", type: "string", description: "the current branch context" }
  ],
  fossil: [
    { name: ".Branch", type: "string", description: "current branch" },
    { name: ".Status.Changed", type: "boolean", description: "if the status contains changes" }
  ],
  gitversion: [
    { name: ".Major", type: "string", description: "major number" },
    { name: ".Minor", type: "string", description: "minor number" },
    { name: ".Patch", type: "string", description: "patch number" }
  ],
  jujutsu: [
    { name: ".ChangeId", type: "string", description: "the current change id" }
  ],
  mercurial: [
    { name: ".Branch", type: "string", description: "current branch" }
  ],
  plastic: [
    { name: ".Selector", type: "string", description: "the current selector context" },
    { name: ".Behind", type: "bool", description: "workspace is behind and changes are incoming" }
  ],
  sapling: [
    { name: ".Bookmark", type: "string", description: "the commit's bookmark" },
    { name: ".Hash", type: "string", description: "the commit hash" }
  ],
  svn: [
    { name: ".Branch", type: "string", description: "current branch" },
    { name: ".BaseRev", type: "int", description: "the currently checked out revision number" }
  ],

  // System Segments
  battery: [
    { name: ".Percentage", type: "float64", description: "the current battery percentage" },
    { name: ".Icon", type: "string", description: "the icon based on battery state" },
    { name: ".Error", type: "string", description: "error fetching battery information" }
  ],
  connection: [
    { name: ".Type", type: "string", description: "the connection type" },
    { name: ".Name", type: "string", description: "the name of the connection" }
  ],
  executiontime: [
    { name: ".Ms", type: "number", description: "the execution time in milliseconds" },
    { name: ".FormattedMs", type: "string", description: "the formatted value" }
  ],
  os: [
    { name: ".Icon", type: "string", description: "the OS icon" }
  ],
  path: [
    { name: ".Path", type: "string", description: "the current directory" },
    { name: ".Parent", type: "string", description: "the current directory's parent folder" },
    { name: ".Writable", type: "boolean", description: "is the directory writable" }
  ],
  project: [
    { name: ".Name", type: "string", description: "The name of your project" },
    { name: ".Version", type: "string", description: "The version of your project" },
    { name: ".Type", type: "string", description: "The type of project" }
  ],
  root: [],
  session: [
    { name: ".UserName", type: "string", description: "the current user's name" },
    { name: ".HostName", type: "string", description: "the current computer's name" },
    { name: ".SSHSession", type: "boolean", description: "active SSH session or not" }
  ],
  shell: [
    { name: ".Name", type: "string", description: "the shell name" },
    { name: ".Version", type: "string", description: "the shell version" }
  ],
  status: [
    { name: ".Code", type: "number", description: "the last known exit code" },
    { name: ".String", type: "string", description: "the formatted status codes" },
    { name: ".Error", type: "boolean", description: "true if command has an error" }
  ],
  sysinfo: [
    { name: ".PhysicalPercentUsed", type: "float64", description: "percentage of physical memory in usage" },
    { name: ".SwapPercentUsed", type: "float64", description: "percentage of swap memory in usage" }
  ],
  text: [],
  time: [
    { name: ".CurrentDate", type: "time", description: "The time to display" },
    { name: ".Format", type: "string", description: "The time format" }
  ],
  upgrade: [
    { name: ".Current", type: "string", description: "the current version number" },
    { name: ".Latest", type: "string", description: "the latest available version number" }
  ],

  // Music Segments
  lastfm: [
    { name: ".Status", type: "string", description: "player status" },
    { name: ".Artist", type: "string", description: "current artist" },
    { name: ".Track", type: "string", description: "current track" },
    { name: ".Icon", type: "string", description: "icon (based on status)" }
  ],
  spotify: [
    { name: ".Status", type: "string", description: "player status" },
    { name: ".Artist", type: "string", description: "current artist" },
    { name: ".Track", type: "string", description: "current track" },
    { name: ".Icon", type: "string", description: "icon (based on status)" }
  ],
  ytm: [
    { name: ".Status", type: "string", description: "player status" },
    { name: ".Artist", type: "string", description: "current artist" },
    { name: ".Track", type: "string", description: "current track" },
    { name: ".Icon", type: "string", description: "icon (based on status)" }
  ],

  // Health Segments
  nightscout: [
    { name: ".Sgv", type: "int", description: "Your Serum Glucose Value" },
    { name: ".TrendIcon", type: "string", description: "icon representation of trend" }
  ],
  strava: [
    { name: ".Ago", type: "string", description: "time since last activity" },
    { name: ".Icon", type: "string", description: "Activity based icon" }
  ],
  withings: [
    { name: ".Weight", type: "float", description: "your last measured weight" },
    { name: ".Steps", type: "int", description: "your last measured steps" }
  ],

  // Web Segments
  brewfather: [
    { name: ".Status", type: "string", description: "batch status" },
    { name: ".StatusIcon", type: "string", description: "Icon representing status" },
    { name: ".Recipe.Name", type: "string", description: "The recipe being brewed" }
  ],
  carbonintensity: [
    { name: ".Actual.Index", type: "string", description: "carbon intensity rating" },
    { name: ".TrendIcon", type: "string", description: "icon representation of trend" }
  ],
  http: [
    { name: ".Body", type: "object", description: "the JSON response body" }
  ],
  ipify: [
    { name: ".IP", type: "string", description: "Your external IP address" }
  ],
  wakatime: [
    { name: ".CumulativeTotal.Seconds", type: "float64", description: "total tracked time in seconds" },
    { name: ".CumulativeTotal.Text", type: "string", description: "human readable tracked time" }
  ],
  owm: [
    { name: ".Weather", type: "string", description: "the current weather icon" },
    { name: ".Temperature", type: "int", description: "the current temperature" },
    { name: ".UnitIcon", type: "string", description: "the current unit icon" }
  ],
  winreg: [
    { name: ".Value", type: "string", description: "the registry value" }
  ]
};

// Function to add properties to segments in a JSON file
function addPropertiesToFile(filePath) {
  console.log(`\nProcessing: ${filePath}`);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;
    
    data.forEach(segment => {
      const props = allProperties[segment.type];
      if (props && !segment.properties) {
        segment.properties = props;
        modified = true;
        console.log(`  ✓ Added properties to ${segment.type}`);
      } else if (segment.properties) {
        console.log(`  - ${segment.type} already has properties`);
      } else {
        console.log(`  ⚠ No properties defined for ${segment.type}`);
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
      console.log(`✅ Updated ${filePath}`);
    } else {
      console.log(`ℹ️  No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process all segment files
const segmentFiles = [
  path.join(__dirname, '../public/segments/cli.json'),
  path.join(__dirname, '../public/segments/languages.json'),
  path.join(__dirname, '../public/segments/cloud.json'),
  path.join(__dirname, '../public/segments/scm.json'),
  path.join(__dirname, '../public/segments/system.json'),
  path.join(__dirname, '../public/segments/music.json'),
  path.join(__dirname, '../public/segments/health.json'),
  path.join(__dirname, '../public/segments/web.json')
];

console.log('=== Adding Properties to Segment Files ===\n');
segmentFiles.forEach(addPropertiesToFile);
console.log('\n=== Done ===');
