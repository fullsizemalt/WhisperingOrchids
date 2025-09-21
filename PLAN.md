# Nintendo Switch Custom Theme Builder - Version 1.0 MVP Technical Plan

## 1. Architecture Overview

The application is primarily a client-side web application, leveraging modern JavaScript frameworks and browser APIs to provide a rich, interactive user experience. All core logic, including UI rendering, state management, image manipulation, and theme packaging, is performed directly in the user's browser. A backend is not required for the core MVP functionality, simplifying deployment and reducing operational costs.

## 2. Key Technologies

*   **Frontend Framework:** [React](https://react.dev/) (with TypeScript)
    *   Chosen for its component-based architecture, strong community support, and efficient UI rendering.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
    *   A utility-first CSS framework enabling rapid UI development and responsive design.
*   **ZIP Archiving:** [JSZip](https://stuk.github.io/jszip/) & [file-saver](https://github.com/eligrey/FileSaver.js/)
    *   `JSZip` is used for creating the `.nxtheme` (which is a `.zip` archive) directly in the browser.
    *   `file-saver` facilitates triggering file downloads from the browser.
*   **Color Picker:** [react-colorful](https://react-colorful.js.org/)
    *   A lightweight and performant color picker component for React, used for intuitive color selection.
*   **Image Manipulation:** HTML5 [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
    *   Used for client-side resizing and cropping of background images to meet the 1280x720 JPG requirement.
*   **State Management (Undo/Redo):** Custom `useHistory` React Hook
    *   Manages the application's state history for undo/redo functionality, encapsulating the logic for state snapshots and navigation.

## 3. Component Breakdown

The application is structured into several key React components, each with distinct responsibilities:

*   **`App.tsx` (Root Component):**
    *   Manages the top-level application state (`themeConfig`, `layoutElements`).
    *   Integrates `ThemeConfig`, `LayoutEditor`, and `About` components.
    *   Handles global actions: theme generation, project saving/loading, undo/redo.
    *   Orchestrates data flow between major sections.
*   **`ThemeConfig.tsx`:**
    *   Handles theme metadata input (Name, Author, Target).
    *   Manages background image upload, preview, validation, and client-side manipulation (resize/crop).
    *   Communicates theme configuration changes up to `App.tsx`.
*   **`LayoutEditor.tsx`:**
    *   The core visual editing interface.
    *   Displays the 1280x720 Switch screen preview.
    *   Manages `LayoutElement` state (position, size, rotation, color, visibility, etc.).
    *   Provides element selection, property editing inputs, custom element addition, and deletion.
    *   Implements drag-and-drop and resizing functionality for elements on the canvas.
    *   Communicates layout element changes up to `App.tsx`.
*   **`About.tsx`:**
    *   A modal component displaying information about the tool, disclaimers, and ethical guidelines.

## 4. Data Flow

*   **`App.tsx`** holds the primary state for `themeConfig` and `layoutElements`.
*   **`ThemeConfig.tsx`** updates `themeConfig` via an `onConfigChange` callback passed from `App.tsx`.
*   **`LayoutEditor.tsx`** updates `layoutElements` via an `onElementsChange` callback passed from `App.tsx`. This callback is wrapped by the `useHistory` hook in `App.tsx` to enable undo/redo.
*   Project saving and loading functions in `App.tsx` directly interact with `themeConfig` and `layoutElements` to serialize/deserialize the entire project state.
*   Theme generation in `App.tsx` uses the current `themeConfig` and `layoutElements` to construct the `.nxtheme` file.

## 5. Core Logic Highlights

*   **Image Processing:** The `ThemeConfig` component utilizes the HTML5 Canvas API to perform client-side resizing and center-cropping of uploaded background images to the required 1280x720 JPG format. This ensures compatibility without server-side processing.
*   **JSON Generation:** A dedicated utility function (`convertLayoutElementsToJson` in `src/utils/jsonConverter.ts`) is responsible for transforming the internal `LayoutElement` data structure into the precise JSON format required by the `.nxtheme` specification (`CustomLayouts.md`). This includes handling nested properties and conditional attributes (e.g., color properties for `pic1`/`txt1` types).
*   **Project Persistence:** Project state (including Base64 encoded background image) can be saved to and loaded from the browser's `localStorage` for quick access, or downloaded/uploaded as a `.json` file for portability. This is managed by helper functions (`fileToBase64`, `base64ToFile`) in `App.tsx`.
*   **Undo/Redo Mechanism:** The `useHistory` custom hook (`src/hooks/useHistory.ts`) provides a robust, encapsulated solution for managing the history of `layoutElements` changes, allowing users to undo and redo modifications.

## 6. Future Considerations (Brief)

*   **Backend Integration:** While not required for MVP, a backend could be introduced for more complex tasks like advanced image processing (e.g., filters, effects), or integration with AI-powered text generation/content moderation APIs.
*   **Advanced UI/UX:** Further refinements to the visual editor, including snapping guides, more sophisticated element types, and a richer library of default elements.
