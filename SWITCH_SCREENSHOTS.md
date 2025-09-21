# 📸 Nintendo Switch Screenshot Integration

## 🎯 Overview

WhisperingOrchids now includes a powerful **Live Preview System** that uses real Nintendo Switch interface screenshots to show exactly how your themes will appear on the actual console.

## ✨ Features

### **🔄 Dual Preview Modes**
- **Canvas Mode**: Traditional element-based preview
- **Live Preview Mode**: Real Switch interface with theme overlay

### **🎮 Interactive Element Selection**
- Click on screenshot elements to select them in the editor
- Visual highlighting of selected elements
- Accurate element mapping from screenshots

### **🎨 Advanced Overlay System**
- Background image overlay with transparency control
- Element visibility toggles
- Real-time theme updates
- Export preview as image

## 📁 File Structure

```
public/screenshots/switch/
├── home-menu/          # Home Menu interface screenshots
├── lockscreen/         # Lock screen screenshots
├── all-software/       # All Software menu screenshots
├── system-settings/    # System Settings screenshots
├── user-page/          # User profile page screenshots
├── news/               # News app screenshots
└── player-select/      # Player selection screenshots
```

## 📋 Screenshot Requirements

### **Technical Specifications**
- **Resolution**: 1280x720 pixels (Switch native)
- **Format**: PNG or JPG
- **Background**: White background preferred for element extraction
- **Quality**: High quality, uncompressed

### **Content Guidelines**
- **Clean interface**: Default Switch UI without custom themes
- **No personal data**: Remove any personal information
- **Multiple variants**: Different states (empty, populated, etc.)
- **Element visibility**: All UI elements clearly visible

### **Naming Convention**
```
[variant].png

Examples:
- default.png (standard interface)
- populated.png (with content)
- empty.png (minimal content)
```

## 🚀 How to Add Screenshots

### **1. Capture Screenshots**
1. Take screenshots on your Nintendo Switch
2. Transfer to computer via SD card or capture device
3. Ensure 1280x720 resolution
4. Save as PNG or JPG format

### **2. Upload to Project**
1. Place screenshots in appropriate target folder:
   ```
   public/screenshots/switch/[target]/[variant].png
   ```
2. Use descriptive filenames following the naming convention
3. Ensure files are accessible via web server

### **3. Update Registry (Optional)**
For advanced element mapping, update the screenshot registry in:
```typescript
// src/utils/screenshotManager.ts
export const SCREENSHOT_REGISTRY = {
  'Home Menu': [
    {
      id: 'home-menu-default',
      target: 'Home Menu',
      variant: 'default',
      path: '/screenshots/switch/home-menu/default.png',
      width: 1280,
      height: 720,
      elements: [
        // Define clickable element regions
        {
          elementId: 'N_GameRoot',
          region: { x: 0, y: 0, width: 1280, height: 720 },
          type: 'pane'
        }
        // Add more elements...
      ]
    }
  ]
}
```

## 🎮 Using the Live Preview

### **1. Access Live Preview**
1. Navigate to the Layout Editor tab
2. Click the **"Live Preview"** button in the preview area
3. The system will automatically load the appropriate screenshot

### **2. Interactive Features**
- **Toggle Background**: Show/hide theme background overlay
- **Toggle Elements**: Show/hide theme elements
- **Click to Select**: Click on elements in screenshot to select them
- **Export Preview**: Save preview as image file

### **3. Element Selection**
- Click directly on UI elements in the screenshot
- Selected elements will highlight in blue
- Properties panel will update for selected element
- Both layout elements and screenshot regions are clickable

## 🔧 Advanced Configuration

### **Element Mapping**
Define precise clickable regions for each UI element:

```typescript
elements: [
  {
    elementId: 'N_GameRoot',
    region: { x: 0, y: 0, width: 1280, height: 720 },
    type: 'pane'
  },
  {
    elementId: 'SystemSettingsButton',
    region: { x: 1000, y: 600, width: 80, height: 80 },
    type: 'pic1'
  }
]
```

### **White Background Processing**
The system automatically:
- Detects white background pixels
- Creates element masks for precise overlay
- Extracts UI elements from screenshots
- Generates interactive click maps

## 🎯 Best Practices

### **Screenshot Capture**
1. **Use clean, default interfaces** without modifications
2. **Capture at native 1280x720 resolution**
3. **Ensure good lighting and contrast**
4. **Include multiple interface states** (empty, populated)

### **File Organization**
1. **Use consistent naming** across all targets
2. **Group by interface type** in appropriate folders
3. **Include descriptive variants** (default, populated, etc.)
4. **Keep file sizes reasonable** for web delivery

### **Element Mapping**
1. **Map key interactive elements** users will want to modify
2. **Use accurate pixel coordinates** for precise selection
3. **Test click regions** to ensure proper selection
4. **Update registry** when adding new screenshots

## 🔄 Live Update Process

1. **Upload screenshots** to appropriate folders
2. **System auto-detects** new screenshot files
3. **Live preview updates** automatically
4. **Element mapping** becomes available
5. **Users can immediately** use new screenshots

## 📊 Current Status

### **Implemented Features** ✅
- Dual preview mode system
- Screenshot loading and management
- Interactive element selection
- Background/element overlay toggles
- Export functionality
- Error handling for missing screenshots

### **Ready for Screenshots** ✅
- Folder structure created
- Registry system in place
- Processing pipeline ready
- UI integration complete

---

**🎮 Upload your Switch screenshots to bring the preview system to life!**

The Live Preview system is fully functional and waiting for your Nintendo Switch interface screenshots to provide users with the most accurate theme preview experience possible.