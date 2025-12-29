# Segments Structure

This directory contains segment metadata organized by category for the Oh My Posh configurator.

## Organization

Segments are split into separate JSON files by category:

- `system.json` - System-related segments (path, os, battery, etc.)
- `scm.json` - Source control management (git, svn, etc.)
- `languages.json` - Programming language segments (node, python, go, etc.)
- `cloud.json` - Cloud provider and infrastructure segments (aws, azure, gcp, etc.)
- `cli.json` - CLI tool segments (kubectl, docker, terraform, etc.)
- `web.json` - Web-related segments (spotify, wakatime, etc.)
- `music.json` - Music player segments
- `health.json` - Health and fitness tracker segments

## JSON Structure

Each segment in the JSON files has the following structure:

```json
{
  "type": "segment-type",
  "name": "Display Name",
  "description": "Brief description of what this segment does",
  "icon": "LucideIconName",
  "defaultTemplate": " {{ .TemplateProperty }} "
}
```

## Adding New Segments

To add a new segment:

1. Determine which category it belongs to
2. Open the appropriate JSON file (e.g., `languages.json`)
3. Add your segment object to the array
4. Keep segments alphabetized by name within each file
5. Use a Lucide React icon name for the `icon` field

### Example

```json
{
  "type": "rust",
  "name": "Rust",
  "description": "Displays the current Rust version",
  "icon": "Box",
  "defaultTemplate": " {{ .Full }} "
}
```

## Dynamic Loading

Segments are loaded on-demand using the `segmentLoader.ts` utility. This:

- Reduces initial bundle size
- Improves maintainability
- Makes it easier to add/modify segments
- Allows for category-based lazy loading

## Color Schemes

Default colors are applied automatically based on the segment type and category using the `colorSchemes.ts` file. You don't need to specify colors in the JSON files.

## Validation

Before adding or modifying segments, ensure they match the Oh My Posh segment schema. The segments should be valid according to the [Oh My Posh documentation](https://ohmyposh.dev/docs/segments).
