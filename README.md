# 🌺 WhisperingOrchids

*A modern, web-based Nintendo Switch theme builder*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)

## ✨ Overview

WhisperingOrchids is a simple, intuitive web application for creating Nintendo Switch themes. Upload a background image, set your preferences, and generate ready-to-use `.nxtheme` files for your modded Nintendo Switch.

### 🎯 Key Features

- **🖥️ Browser-Based**: No downloads required - create themes directly in your web browser
- **🎨 Simple Interface**: Clean, modern UI focused on ease of use
- **📱 Responsive Design**: Beautiful interface with smooth animations
- **💾 Project Management**: Save/load theme projects locally or as files
- **📤 Export Ready**: Generate `.nxtheme` files ready for modded Switch consoles
- **🌈 Multiple Targets**: Support for Home Menu, Lockscreen, System Settings, and more
- **⚡ Performance Optimized**: Fast, responsive interface with error handling

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/WhisperingOrchids.git
   cd WhisperingOrchids
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5179` (or the port shown in your terminal)

## 🐳 Docker Deployment

### Quick Start with Docker

**Production Deployment:**
```bash
# Using Docker Compose (recommended)
docker-compose up --build

# Access the app at http://localhost:3000
```

**Development with Docker:**
```bash
# Run development environment with hot reload
docker-compose --profile dev up --build

# Access the dev server at http://localhost:5179
```

**Manual Docker Build:**
```bash
# Production build
docker build -t whispering-orchids .
docker run -p 3000:3000 whispering-orchids

# Development build
docker build -f Dockerfile.dev -t whispering-orchids-dev .
docker run -p 5179:5179 -v $(pwd):/app whispering-orchids-dev
```

### Docker Benefits
- ✅ **Zero Setup**: No Node.js installation required
- ✅ **Consistent Environment**: Same setup across all systems
- ✅ **Easy Deployment**: One-command production deployment
- ✅ **Development Ready**: Hot reload and file watching included

## 📖 Usage Guide

### Creating Your First Theme

1. **Configure Theme Settings**
   - Enter a theme name and author
   - Select your target (Home Menu, Lockscreen, etc.)
   - Upload a background image (1280x720 recommended)

2. **Generate Your Theme**
   - Click "Generate Theme File" to create your .nxtheme
   - The file will be automatically downloaded
   - Install on your modded Nintendo Switch using your preferred method

### Need Layouts?

This tool creates **theme files** (backgrounds and colors) only. For **layout modifications** (moving UI elements, changing positions), get layouts from the community:

**[Browse Layouts on Themezer](https://themezer.net/switch/layouts)**

### Project Management

- **Save**: Use the save button to store your project in browser storage
- **Download**: Export your project as a JSON file for backup
- **Upload**: Load a previously saved project JSON file

## 🛠️ Development

### Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Build Tool**: Vite
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **File Processing**: JSZip for theme generation

### Project Structure

```
src/
├── components/           # React components
│   ├── ThemeBuilder.tsx  # Main theme creation interface
│   ├── About.tsx         # About modal
│   ├── ErrorBoundary.tsx # Error handling
│   └── ToastContainer.tsx # Notifications
├── hooks/                # Custom React hooks
│   ├── useDebounce.ts    # Input debouncing
│   └── usePerformance.ts # Performance monitoring
├── utils/                # Utility functions
│   └── errorHandling.ts  # Error handling and validation
└── App.tsx               # Main application component
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Theme Development

### Supported Theme Targets

- **Home Menu**: Main Switch interface with game icons
- **Lockscreen**: Lock screen interface
- **All Software**: Software library screen
- **System Settings**: Settings menu interface
- **User Page**: User profile interface
- **News**: News app interface
- **Player Select**: Player selection screen

### Element Types

- **Panes**: Container elements that can hold other elements
- **Pictures**: Image elements for icons and graphics
- **Text**: Text overlays (planned for future release)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m 'feat: add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📋 Roadmap

- [ ] Live Switch screenshot overlay system
- [ ] Dynamic text overlays with content moderation
- [ ] Custom applet icon support
- [ ] Performance optimizations
- [ ] Guided tour/onboarding
- [ ] Theme sharing community features

## ⚖️ Legal & Ethics

This project is developed for educational and personal use. Users are responsible for:
- Ensuring themes comply with community standards
- Respecting Nintendo's intellectual property
- Using themes only on legally modded consoles

**We strongly denounce any use of this tool for hate speech, discrimination, or harmful content.**

## 🔒 Security

Please report security vulnerabilities by emailing [security@example.com] or see our [Security Policy](SECURITY.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Development Attribution

**Primary Development**: Developed collaboratively by AI assistants:
- **Gemini (Google)**: Initial architecture, core functionality, and MVP implementation
- **Claude (Anthropic)**: Modern UI/UX redesign, GitHub compliance, and enhanced features

## 🙏 Acknowledgments

- Nintendo Switch homebrew community
- Switch Layout Editor developers
- All contributors and theme creators
- Google's Gemini for foundational development
- Anthropic's Claude for modernization and enhancement

## 📞 Support

- 🐛 [Report a Bug](https://github.com/yourusername/WhisperingOrchids/issues/new?template=bug_report.md)
- 💡 [Request a Feature](https://github.com/yourusername/WhisperingOrchids/issues/new?template=feature_request.md)
- 💬 [Discussions](https://github.com/yourusername/WhisperingOrchids/discussions)

---

<div align="center">
Made with ❤️ by Gemini (Google) & Claude (Anthropic)

**⭐ Star this project if you find it useful! ⭐**
</div>