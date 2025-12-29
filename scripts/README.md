# Scripts

This directory contains utility scripts for the Oh My Posh Configurator project.

## validate-configs.js

Validates all configuration files in the `public/configs/` directory.

### What it checks:

- ✅ **JSON Syntax**: Ensures all JSON files are valid
- ✅ **Manifest Structure**: Validates `manifest.json` files in both `samples/` and `community/`
- ✅ **Required Fields**: Checks that all required fields are present
- ✅ **File References**: Ensures files listed in manifest actually exist
- ✅ **Duplicate IDs**: Detects duplicate configuration IDs
- ✅ **Oh My Posh Schema**: Validates config structure matches Oh My Posh requirements
- ✅ **Blocks & Segments**: Ensures proper block and segment structure

### Usage:

```bash
# Run validation
npm run validate

# Or directly with node
node scripts/validate-configs.js
```

### Exit Codes:

- `0`: All validations passed
- `1`: Validation errors found

### When it runs:

- **Locally**: Run manually before submitting PRs
- **GitHub Actions**: Automatically runs on PRs that modify config files
- **CI/CD**: Part of the pull request validation workflow

### Example Output:

```
🔍 Oh My Posh Configurator - Config Validation

==================================================

📁 Validating samples category...
ℹ️ Validating samples/manifest.json...
✓ Found 6 configs in samples/manifest.json
ℹ️ Validating samples/developer-pro.json...
✓ samples/developer-pro.json validated
...

==================================================

📊 Validation Summary:

✓ All validations passed! ✨
```

### For Contributors:

If you're submitting a community configuration:

1. Add your config JSON file to `public/configs/community/`
2. Update `public/configs/community/manifest.json`
3. Run `npm run validate` to check for errors
4. Fix any validation errors before submitting your PR

The validation will automatically run on your PR via GitHub Actions.

### Common Errors:

**Missing required fields:**
```
✗ community/my-config.json: missing required field 'author'
```
→ Add the missing field to your config file

**Duplicate ID:**
```
✗ community/manifest.json entry 3: duplicate ID 'my-theme'
```
→ Change the ID to be unique

**File not found:**
```
✗ community/my-config.json: file referenced in manifest but not found
```
→ Ensure the filename in manifest matches the actual file

**Invalid JSON:**
```
✗ Invalid JSON in community/my-config.json: Unexpected token } in JSON at position 42
```
→ Fix JSON syntax errors (missing comma, extra bracket, etc.)
