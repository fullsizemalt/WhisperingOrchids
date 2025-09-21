# Nintendo Switch Screenshots

This directory contains Nintendo Switch interface screenshots for live preview functionality.

## 📁 Folder Structure

```
screenshots/
└── switch/
    ├── home-menu/          # Home Menu interface screenshots
    ├── lockscreen/         # Lock screen screenshots
    ├── all-software/       # All Software menu screenshots
    ├── system-settings/    # System Settings screenshots
    ├── user-page/          # User profile page screenshots
    ├── news/               # News app screenshots
    └── player-select/      # Player selection screenshots
```

## 📸 Screenshot Requirements

### **Format Specifications**
- **Resolution**: 1280x720 (Nintendo Switch native)
- **Format**: PNG or JPG
- **Background**: White or transparent
- **Quality**: High quality, no compression artifacts

### **Naming Convention**
```
[target]-[variant]-[state].png

Examples:
- home-menu-default.png
- home-menu-with-games.png
- lockscreen-default.png
- system-settings-main.png
```

### **Content Guidelines**
- **Clean interfaces**: No personal data or custom themes
- **Default state**: Capture vanilla Switch interface
- **Multiple variants**: Different states (empty, populated, etc.)
- **Element visibility**: All UI elements clearly visible

## 🔄 Processing Pipeline

The screenshots will be processed to:

1. **Extract UI elements** from white backgrounds
2. **Create element masks** for precise overlay positioning
3. **Generate interactive maps** for click-to-select functionality
4. **Optimize for web display** with proper sizing and compression

## 🎯 Usage in Application

Screenshots are used for:
- **Live preview overlay** - Show real Switch interface with user themes
- **Element identification** - Click on screenshot elements to select in editor
- **Accurate representation** - Exact visual preview of final result
- **Multiple target support** - Different screenshots for each theme target

## 📤 Upload Instructions

1. Place screenshots in appropriate target folder
2. Follow naming convention
3. Ensure 1280x720 resolution
4. White background preferred for element extraction
5. High quality, uncompressed images

The system will automatically detect and integrate new screenshots into the preview system.