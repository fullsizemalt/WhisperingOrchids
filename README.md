# 🌺 WhisperingOrchids

*A modern, web-based Nintendo Switch custom theme builder*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)](https://www.typescriptlang.org/)

## ✨ Overview

WhisperingOrchids is a powerful, user-friendly web application that empowers Nintendo Switch users to create stunning custom themes directly in their browser. Built with modern web technologies, it offers an intuitive visual editor for designing themes without requiring complex Windows-only tools.

### 🎯 Key Features

- **🖥️ Browser-Based**: No downloads required - design themes directly in your web browser
- **🎨 Visual Editor**: Intuitive drag-and-drop interface with real-time preview
- **📱 Responsive Design**: Modern, sleek UI with glass-morphism effects
- **🔧 Element Customization**: Precise control over position, size, scale, rotation, and colors
- **💾 Project Management**: Save/load projects locally or export as JSON files
- **↩️ Undo/Redo**: Full history support for all changes
- **📤 Export Ready**: Generate `.nxtheme` files ready for modded Switch consoles
- **🌈 Multiple Targets**: Support for Home Menu, Lockscreen, System Settings, and more

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
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📖 Usage Guide

### Creating Your First Theme

1. **Configure Theme Settings**
   - Enter a theme name and author
   - Select your target (Home Menu, Lockscreen, etc.)
   - Upload a background image (1280x720 recommended)

2. **Design Your Layout**
   - Switch to the Layout Editor tab
   - Select elements from the sidebar
   - Drag and resize elements in the preview
   - Customize colors and properties

3. **Export Your Theme**
   - Use the floating action bar at the bottom
   - Click "Generate .nxtheme" to download your theme
   - Install on your modded Nintendo Switch

### Fullscreen Preview

Click the maximize button in the header to enter fullscreen preview mode for better visibility while designing.

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
├── components/          # React components
│   ├── ThemeConfig.tsx  # Theme configuration form
│   ├── LayoutEditor.tsx # Visual layout editor
│   └── About.tsx        # About modal
├── hooks/               # Custom React hooks
│   └── useHistory.ts    # Undo/redo functionality
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
│   └── jsonConverter.ts # Theme export logic
└── assets/              # Static assets
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