# Nintendo Switch Custom Theme Builder - Version 1.0 MVP Development Tasks

This document outlines the development tasks undertaken to achieve the Version 1.0 Minimum Viable Product (MVP) for the Nintendo Switch Custom Theme Builder, as well as a backlog of future tasks.

## Completed Tasks (Version 1.0 MVP)

All tasks listed below have been successfully completed, leading to the current feature-rich state of the application.

### Project Setup & Core Structure
*   [x] Scaffold a React TypeScript project using Vite.
*   [x] Install and configure Tailwind CSS.
*   [x] Configure PostCSS.
*   [x] Update `src/index.css` with Tailwind directives.
*   [x] Remove `src/App.css`.

### Theme Configuration (`ThemeConfig.tsx`)
*   [x] Implement `ThemeConfig` component.
*   [x] Add input fields for Theme Name and Author.
*   [x] Implement Theme Target selection dropdown (Home Menu, Lockscreen, All Software, System Settings, User Page, News).
*   [x] Implement background image upload functionality.
*   [x] Add client-side image validation for 1280x720 dimensions.
*   [x] Implement image manipulation (Auto-Resize and Center-Crop) using Canvas API.
*   [x] Display image preview and dimension information.

### Layout Editor (`LayoutEditor.tsx`)
*   [x] Implement `LayoutEditor` component with a 1280x720 preview canvas.
*   [x] Define `LayoutElement` interface for theme elements.
*   [x] Implement element selection functionality.
*   [x] Add property editing controls for Position, Size, Scale, Rotation, and Visibility.
*   [x] Integrate `react-colorful` for color picking with RGBA hex support.
*   [x] Implement custom element addition by ID.
*   [x] Implement dynamic `getDefaultLayout` based on `themeTarget` (Home Menu, Lockscreen, All Software, System Settings, User Page, News) with placeholder elements.
*   [x] Implement drag-and-drop functionality for elements with boundary checks.
*   [x] Implement resizing handles for elements with boundary checks.
*   [x] Implement delete element functionality with confirmation.

### Theme Generation & Export
*   [x] Install `jszip` for `.zip` archive creation.
*   [x] Install `file-saver` for triggering file downloads.
*   [x] Create `src/utils/jsonConverter.ts` to convert `LayoutElement` data to `.nxtheme`'s `layout.json` format.
*   [x] Integrate `jsonConverter.ts` into `App.tsx` for theme generation.
*   [x] Implement `generateNxtheme` function to package background image and `layout.json` into a `.nxtheme` file.

### Application Enhancements
*   [x] Implement Save/Load Project Functionality:
    *   [x] Define a project data structure.
    *   [x] Add save to local storage.
    *   [x] Add download as JSON file.
    *   [x] Add load from local storage.
    *   [x] Add upload JSON file.
    *   [x] Integrate into `App.tsx`.
*   [x] Add an "About" section:
    *   [x] Create `src/components/About.tsx` with disclaimer and positive message.
    *   [x] Integrate `About` component as a modal in `App.tsx`.
    *   [x] Include disclaimer verbiage in the metadata of exported `layout.json` files (`jsonConverter.ts`).
*   [x] Implement Undo/Redo Functionality:
    *   [x] Create `src/hooks/useHistory.ts` custom hook.
    *   [x] Integrate `useHistory` into `App.tsx` to manage `layoutElements` state.
    *   [x] Add "Undo" and "Redo" buttons to the UI.

## Future Tasks (Backlog)

These tasks are considered for future iterations beyond Version 1.0 MVP.

*   **Dynamic Text Overlay with Content Moderation:**
    *   Allow users to add custom text overlays to themes.
    *   Implement text input, font selection (family, size, color), and alignment.
    *   Integrate a robust language filter (likely requiring a backend and external API).
    *   Potentially explore AI-powered text generation.
*   **More Refined `elementId`s:**
    *   Conduct deeper research into `.szs` files or community-compiled lists to identify more accurate and comprehensive `elementId`s for all customizable screens.
*   **Custom Applet Icons:**
    *   Implement a separate section for uploading and managing custom applet icons.
    *   Research the specific format and integration method for applet icons within `.nxtheme` files.
*   **Drag-and-Drop for Image Upload:**
    *   Enhance the background image upload to support drag-and-drop functionality for image files.
*   **Performance Optimization:**
    *   Investigate and implement performance optimizations for very complex layouts or large image manipulations.
*   **User Interface Polish:**
    *   Further refine the UI/UX, including animations, improved error messages, and loading indicators.
*   **Tour/Onboarding:**
    *   Develop a guided tour or onboarding process for first-time users to introduce key features.
