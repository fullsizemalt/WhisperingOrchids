# Contributing to WhisperingOrchids

Thank you for your interest in contributing to WhisperingOrchids! 🌺 This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming, inclusive environment. By participating, you are expected to uphold these values:

- **Be respectful**: Treat all community members with respect
- **Be inclusive**: Welcome newcomers and help them get started
- **Be constructive**: Provide helpful feedback and suggestions
- **Be ethical**: Do not contribute content that promotes hate, discrimination, or illegal activities

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Git
- A code editor (VS Code recommended)

### First-time Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/WhisperingOrchids.git
   cd WhisperingOrchids
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/WhisperingOrchids.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🛠️ Development Setup

### Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── ThemeConfig.tsx  # Theme configuration
│   ├── LayoutEditor.tsx # Layout editor
│   └── About.tsx        # About modal
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
├── utils/               # Utility functions
└── assets/              # Static assets
```

## 🤝 Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

- 🐛 **Bug fixes**: Fix issues or improve functionality
- ✨ **Features**: Add new features or enhance existing ones
- 📚 **Documentation**: Improve docs, tutorials, or code comments
- 🎨 **UI/UX**: Improve the user interface or experience
- 🧪 **Testing**: Add or improve tests
- 🔧 **Tooling**: Improve development tools or processes

### Before You Start

1. **Check existing issues** to see if your idea is already being discussed
2. **Open an issue** for major changes to discuss the approach
3. **Keep changes focused** - one feature or fix per PR
4. **Test thoroughly** before submitting

## 📝 Pull Request Process

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style and patterns
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run the development server
npm run dev

# Build the project
npm run build

# Run linting
npm run lint
```

### 4. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add fullscreen preview mode"
git commit -m "fix: resolve image upload validation issue"
git commit -m "docs: update installation instructions"
```

**Commit Message Format:**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference any related issues
- Screenshots for UI changes
- List of changes made

### 6. Code Review Process

- Maintain discussion on the PR
- Address feedback promptly
- Update code based on review comments
- Ensure CI checks pass

## 📏 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` types when possible
- Use strict type checking

### React

- Use functional components with hooks
- Follow React best practices
- Use meaningful component and variable names
- Implement proper error boundaries

### Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Ensure responsive design
- Test on different screen sizes

### Code Quality

- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names

### Example Code Style

```typescript
// Good
interface ThemeConfig {
  name: string;
  author: string;
  target: ThemeTarget;
  backgroundImage: File | null;
}

const ThemeConfigForm: React.FC<Props> = ({ onConfigChange }) => {
  const [config, setConfig] = useState<ThemeConfig>(defaultConfig);

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
    onConfigChange(config);
  }, [config, onConfigChange]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form content */}
    </form>
  );
};
```

## 🐛 Issue Guidelines

### Reporting Bugs

Use the bug report template and include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or videos if applicable
- Browser and OS information
- Console error messages

### Feature Requests

Use the feature request template and include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Any relevant mockups or examples

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested

## 🌟 Recognition

Contributors will be recognized in:
- README acknowledgments
- Release notes for significant contributions
- Contributor spotlight in discussions

## 💬 Community

- **Discussions**: For questions and general discussion
- **Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions

## 📞 Getting Help

If you need help:
1. Check existing documentation
2. Search closed issues and discussions
3. Open a new discussion for questions
4. Mention maintainers for urgent issues

## 🎉 Thank You!

Every contribution, no matter how small, is valuable and appreciated. Thank you for helping make WhisperingOrchids better for everyone!

---

*This document is a living guide. Please suggest improvements through issues or pull requests.*