# Nintendo Switch Custom Theme Builder - Version 1.0 MVP Specification

## 1. Problem Statement

Existing tools for creating custom Nintendo Switch themes are predominantly Windows-based, limiting accessibility for users on other operating systems and requiring specific software installations. Users desire a web-based, intuitive, and dynamic solution to design and generate custom themes without platform restrictions.

## 2. Goals

The primary goals for this Minimum Viable Product (MVP) are to:
*   Provide a fully web-based application for creating custom Nintendo Switch themes.
*   Enable dynamic and visual editing of theme elements (position, size, rotation, color, visibility).
*   Ensure compatibility of generated themes with the Nintendo Switch's `.nxtheme` format.
*   Offer robust image handling for background images, including validation and manipulation.
*   Allow users to save and load their project progress.
*   Include essential editing functionalities like undo/redo and element deletion.
*   Promote responsible use through clear disclaimers within the application and exported files.

## 3. Key Features (Implemented in MVP)

The following features have been implemented and constitute the Version 1.0 MVP:

*   **Project Setup:**
    *   React with TypeScript for robust development.
    *   Tailwind CSS for efficient and responsive styling.
*   **Theme Configuration:**
    *   Input fields for Theme Name and Author.
    *   Selection of Theme Target (Home Menu, Lockscreen, All Software, System Settings, User Page, News).
    *   Background Image Upload:
        *   Accepts JPG format.
        *   Client-side validation for 1280x720 dimensions.
        *   Options to "Auto-Resize" (scale to fit) or "Center-Crop" if dimensions are incorrect, using Canvas API.
        *   Image preview.
*   **Layout Editor:**
    *   Interactive visual canvas representing the 1280x720 Switch screen.
    *   Element Selection: Clickable elements on the canvas and a list for selection.
    *   Property Editing: Comprehensive controls for selected elements:
        *   Position (X, Y coordinates).
        *   Size (Width, Height).
        *   Scale (X, Y factors).
        *   Rotation (X, Y, Z degrees).
        *   Visibility (toggle).
        *   Color (RGBA Hex input with integrated `react-colorful` color picker for visual selection).
    *   Custom Element Addition: Ability to add new elements by specifying an `elementId` with default properties.
    *   Dynamic Default Layouts: Predefined sets of placeholder elements loaded based on the selected Theme Target.
    *   Refined Drag-and-Drop: Intuitive dragging of elements on the canvas with boundary checks.
    *   Resizing Handles: Draggable handles on selected elements for visual resizing with boundary checks.
    *   Delete Element: Ability to remove selected elements with confirmation.
*   **Theme Generation:**
    *   "Generate .nxtheme" button.
    *   Packages the background image (`Body_NXTheme.jpg`) and the generated `layout.json` into a `.zip` file (renamed to `.nxtheme`).
    *   `layout.json` is precisely formatted according to `CustomLayouts.md` specification using a dedicated converter utility.
*   **Project Persistence:**
    *   "Save Project (Browser)": Saves current project state to browser's local storage.
    *   "Load Project (Browser)": Loads project state from browser's local storage.
    *   "Download Project (File)": Downloads project state as a `.json` file for portability.
    *   "Upload Project (File)": Loads project state from a user-selected `.json` file.
*   **Undo/Redo Functionality:**
    *   "Undo" and "Redo" buttons to revert/reapply changes to layout elements.
    *   Managed by a custom `useHistory` hook.
*   **About Section & Disclaimers:**
    *   "About" modal accessible from the header.
    *   Contains a clear disclaimer: "We do not endorse, support, or condone the creation or distribution of themes that promote hate speech, discrimination, violence, or any illegal or unethical content."
    *   Includes a positive message: "Be excellent to each other."
    *   Similar verbiage embedded in the metadata of the exported `layout.json` file.

## 4. Non-Goals for MVP

The following features are explicitly out of scope for this Version 1.0 MVP but are considered for future iterations:

*   Advanced text generation (e.g., AI-powered text).
*   Robust, real-time language filtering (requires backend integration with external APIs).
*   More precise `elementId` research (requires deeper reverse-engineering or community data compilation).
*   Custom applet icon management.
*   Advanced UI/UX polish (e.g., complex animations, guided tours).
*   Performance optimizations for extremely complex layouts.
