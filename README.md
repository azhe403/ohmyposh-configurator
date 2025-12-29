# Oh My Posh Visual Configuration Builder

A web-based visual configuration tool for creating [Oh My Posh](https://ohmyposh.dev/) shell prompt themes.

![Oh My Posh Configurator](https://img.shields.io/badge/Oh%20My%20Posh-Configurator-e94560)

## Features

- 🎨 **Visual Segment Picker**: Browse and select from 80+ available segments organized by category
- 🖱️ **Drag-and-Drop**: Easily reorder segments within blocks
- 🎛️ **Properties Panel**: Configure segment styles, colors, and templates
- 👁️ **Live Preview**: See your prompt changes in real-time with dark/light background toggle
- 📦 **Multi-format Export**: Export your configuration as JSON, YAML, or TOML
- 💾 **Auto-save**: Your work is automatically saved to browser local storage

## Segment Categories

- **System**: Path, OS, Shell, Session, Battery, Time, Execution Time, Status, and more
- **Version Control**: Git, Mercurial, SVN, Fossil, Plastic SCM, Sapling, Jujutsu
- **Languages**: Node.js, Python, Go, Rust, Java, .NET, PHP, Ruby, Swift, and 20+ more
- **Cloud & Infrastructure**: AWS, Azure, GCP, Kubernetes, Terraform, Docker, Pulumi
- **CLI Tools**: NPM, Yarn, PNPM, Angular, React, Flutter, and many more
- **Web**: IP Address, Weather, HTTP requests
- **Music**: Spotify, YouTube Music, Last.fm
- **Health**: Nightscout, Strava, Withings

## Getting Started

### Online

Visit the hosted version at: [https://jamesmontemagno.github.io/ohmyposh-configurator/](https://jamesmontemagno.github.io/ohmyposh-configurator/)

### Local Development

```bash
# Clone the repository
git clone https://github.com/jamesmontemagno/ohmyposh-configurator.git
cd ohmyposh-configurator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. **Add Segments**: Click on segments in the left sidebar or drag them to a block
2. **Configure**: Click on a segment to edit its properties (style, colors, template)
3. **Preview**: See your changes reflected instantly in the preview panel
4. **Export**: Choose your format (JSON, YAML, TOML) and download your configuration

## Using Your Configuration

After downloading your configuration file, follow the [Oh My Posh installation guide](https://ohmyposh.dev/docs/installation/customize) to use it with your shell:

```bash
# PowerShell
oh-my-posh init pwsh --config ~/your-theme.json | Invoke-Expression

# Bash
eval "$(oh-my-posh init bash --config ~/your-theme.json)"

# Zsh
eval "$(oh-my-posh init zsh --config ~/your-theme.json)"
```

## Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **State Management**: Zustand
- **Icons**: Lucide React

## Documentation

- [Oh My Posh Documentation](https://ohmyposh.dev/docs/)
- [Configuration Overview](https://ohmyposh.dev/docs/configuration/overview)
- [Segment Reference](https://ohmyposh.dev/docs/configuration/segment)
- [Template Syntax](https://ohmyposh.dev/docs/configuration/templates)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Oh My Posh](https://github.com/JanDeDobbeleer/oh-my-posh) by Jan De Dobbeleer
- All the Oh My Posh contributors and community
