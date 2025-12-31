# Segment Options Automation Scripts

These scripts automate the process of fetching and applying segment options from the Oh My Posh documentation.

## Scripts

### 1. `fetch-segment-options.mjs`
Fetches options from Oh My Posh documentation pages and saves them to `fetched-options.json`.

**Usage:**
```bash
node scripts/fetch-segment-options.mjs
```

**What it does:**
- Visits each segment's documentation page on ohmyposh.dev
- Parses the "Options" table from the HTML
- Extracts option name, type, default value, and description
- Saves all options to `fetched-options.json` for review

**Output:**
- Creates `scripts/fetched-options.json` with all discovered options
- Displays a summary of how many options were found for each segment

### 2. `apply-fetched-options.mjs`
Applies the fetched options to the segment metadata JSON files.

**Usage:**
```bash
node scripts/apply-fetched-options.mjs
```

**What it does:**
- Reads `scripts/fetched-options.json`
- Updates segment files in `public/segments/`
- Merges new options with existing ones (doesn't overwrite)
- Preserves any manually added options

## Workflow

1. **Fetch options from documentation:**
   ```bash
   node scripts/fetch-segment-options.mjs
   ```

2. **Review the fetched options:**
   ```bash
   # Open and review scripts/fetched-options.json
   code scripts/fetched-options.json
   ```

3. **Apply options to segment files:**
   ```bash
   node scripts/apply-fetched-options.mjs
   ```

4. **Verify the changes:**
   ```bash
   # Check the updated files
   git diff public/segments/
   ```

## Manual Option Entry

If you need to manually add options for a segment, use the `add-segment-options.cjs` script:

```javascript
// Edit the SEGMENT_OPTIONS object in scripts/add-segment-options.cjs
const SEGMENT_OPTIONS = {
  mySegment: [
    { 
      name: 'option_name', 
      type: 'string', 
      default: 'value', 
      description: 'What this option does' 
    },
  ],
};
```

Then run:
```bash
node scripts/add-segment-options.cjs
```

## Option Format

Each option should have:
- `name` (required): The option name as used in Oh My Posh config
- `type` (required): string, number, boolean, enum, array, object
- `default` (optional): The default value if not specified
- `description` (required): What the option does
- `values` (optional): For enum types, array of possible values

Example:
```json
{
  "name": "style",
  "type": "enum",
  "default": "folder",
  "description": "How to display the current path",
  "values": ["folder", "full", "agnoster", "mixed"]
}
```

## Notes

- The fetch script includes a 100ms delay between requests to be respectful to the server
- Options are merged intelligently - existing manually-added options won't be overwritten
- The scripts handle different default value types (boolean, number, string, JSON)
- Enum values are automatically extracted from descriptions when possible
