# Contributing to Oh My Posh Configurator

Thank you for your interest in contributing to the Oh My Posh Configurator! We welcome contributions from the community, especially sharing your custom Oh My Posh configurations.

## Ways to Contribute

### 1. Share Your Configuration Theme

The easiest way to contribute is by sharing your Oh My Posh configuration with the community! If you've created a beautiful or useful prompt theme, we'd love to include it in our Community Collection.

#### How to Submit Your Configuration

**Using the Built-in Tool (Recommended):**

1. Open the Oh My Posh Configurator at https://jamesmontemagno.github.io/ohmyposh-configurator/
2. Design your configuration using the visual editor
3. Click the "Share" button in the header
4. Fill in the required information:
   - Configuration Name
   - Description
   - Your Name/Username
   - Tags (optional, but helpful)
5. Click "Copy Configuration" to copy your theme JSON
6. Follow the submission steps provided in the dialog

**Manual Submission:**

1. Fork this repository
2. Create a new JSON file in `public/configs/community/` named `your-theme-name.json`
3. Follow the structure below for your configuration file
4. Update `public/configs/community/manifest.json` to include your configuration
5. Submit a pull request

#### Configuration File Structure

Your configuration file should follow this structure:

```json
{
  "id": "my-awesome-theme",
  "name": "My Awesome Theme",
  "description": "A brief description of what makes your theme special",
  "icon": "Star",
  "author": "Your Name or @username",
  "tags": ["minimal", "developer", "colorful"],
  "config": {
    "$schema": "https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/main/themes/schema.json",
    "version": 2,
    "final_space": true,
    "blocks": [
      // Your Oh My Posh configuration blocks
    ]
  }
}
```

**Field Requirements:**

- `id`: Lowercase, hyphenated unique identifier (e.g., `my-theme-name`)
- `name`: Display name for your theme
- `description`: Brief description (1-2 sentences recommended)
- `icon`: [Lucide icon name](https://lucide.dev/icons/) (e.g., `Star`, `Code2`, `Rocket`)
- `author`: Your name or GitHub username
- `tags`: Array of relevant tags (e.g., `["minimal", "developer", "python"]`)
- `config`: Your Oh My Posh configuration (without internal IDs)

#### Updating the Manifest

Add your configuration to `public/configs/community/manifest.json`:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-12-29",
  "configs": [
    {
      "id": "my-awesome-theme",
      "name": "My Awesome Theme",
      "description": "A brief description of what makes your theme special",
      "icon": "Star",
      "author": "Your Name",
      "tags": ["minimal", "developer", "colorful"],
      "file": "my-awesome-theme.json"
    }
  ]
}
```

### 2. Report Bugs

Found a bug? Please open an issue on GitHub with:

- A clear description of the problem
- Steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots if applicable
- Browser and OS information

### 3. Suggest Features

Have an idea for a new feature? Open an issue with:

- A clear description of the feature
- Use cases and benefits
- Any relevant examples or mockups

### 4. Code Contributions

Want to contribute code? Great!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a pull request

#### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ohmyposh-configurator.git
cd ohmyposh-configurator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Validate configuration files
npm run validate
```

#### Testing Your Configuration

Before submitting your PR, validate your configuration files:

```bash
npm run validate
```

This script will check:
- ✅ Valid JSON syntax
- ✅ Required fields present
- ✅ No duplicate IDs
- ✅ Files referenced in manifest exist
- ✅ Oh My Posh config schema compliance

The validation script automatically runs on all pull requests via GitHub Actions.

## Code Style Guidelines

- Use TypeScript for all new code
- Follow the existing code style (Prettier/ESLint)
- Write meaningful commit messages
- Add comments for complex logic
- Keep components focused and reusable

## Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help others when you can
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

## Review Process

1. All contributions will be reviewed by maintainers
2. We may request changes or improvements
3. Once approved, your contribution will be merged
4. Community configurations will be visible immediately after the next deployment

## Questions?

If you have questions about contributing, feel free to:

- Open a [Discussion](https://github.com/jamesmontemagno/ohmyposh-configurator/discussions)
- Comment on an existing issue
- Reach out to the maintainers

## License

By contributing to this project, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.

---

Thank you for helping make Oh My Posh Configurator better! 🎨✨
