# WhisperingOrchids Integration Proposal: Switch Layout Editing

## 1. Introduction

This document outlines a proposed integration of tools and workflows to enable Switch layout editing for the WhisperingOrchids project. The goal is to provide a clear path for the development team to implement a new feature set related to custom UI layouts.

## 2. Research Summary

The following tools have been researched to determine their suitability for the project.

### 2.1. LayoutKit

*   **Description:** A meta-tool that simplifies the creation of Nintendo Switch layouts by managing the project environment and integrating other tools.
*   **Features:**
    *   Visually edit files in Switch Toolbox or SwitchLayoutEditor.
    *   Import/export layout JSON files.
    *   Wirelessly transfer files to the Switch over FTP.
    *   Automatically push files after changes were made.
    *   Reboot the Switch via the desktop application.
*   **Technology:** Vue, TypeScript, Electron.
*   **Platform:** Windows only.
*   **Note:** This seems to be the central hub for a layout editing workflow. The Windows-only limitation is a significant consideration.

### 2.2. Switch Toolbox

*   **Description:** A versatile tool for editing various file formats for Nintendo Switch, 3DS, and Wii U.
*   **Status:** **Archived and no longer in development.**
*   **Note:** While powerful, its archived status means it may have unpatched bugs and will not receive updates. This poses a risk for long-term use. It could be used for initial file extraction and inspection.

### 2.3. SwitchLayoutEditor

*   **Description:** A specialized editor for creating and modifying Switch layout files (BFLYT and BFLAN).
*   **Features:**
    *   Layout loading, editing, and saving.
    *   Rendering the bounding boxes of the components.
    *   SZS editing.
    *   Drag and drop functionality.
    *   Simultaneous file editing.
    *   Import/Export JSON patch (Compatible with Switch themes).
    *   Animations editing.
*   **Status:** Work in progress.
*   **Note:** This is the core tool for the actual layout editing. Its "work in progress" status means it may have some instability.

### 2.4. LayoutDocs

*   **Description:** The official documentation for LayoutKit.
*   **URL:** [https://layoutdocs.themezer.net/guide/](https://layoutdocs.themezer.net/guide/)

## 3. Proposed Integration Strategy (Revised)

The focus has shifted from a full layout editor to an interactive "Layout Themer". This tool will allow users to preview layouts and customize them by uploading their own images.

**The workflow is as follows:**

1.  **Layout Loading:** Load a base layout from a source like Themezer or a local file.
2.  **Interactive Preview:** Render the layout with dummy UI elements and placeholders for images.
3.  **Custom Image Upload:** Allow users to upload their own images to replace the placeholders in real-time.
4.  **Theme Export:** Export the modified layout and images as a usable theme file.

## 4. Collaboration Best Practices

To ensure smooth collaboration and maintain code quality, the following practices are recommended.

### 4.1. Version Control

*   **Feature Branch:** All work for this feature should be done in the `feature/layout-themer` branch.
*   **Atomic Commits:** Make small, focused commits with clear and descriptive messages.
*   **Pull Requests:** Use pull requests (PRs) to merge the feature branch into the main development branch.

### 4.2. Project Management

*   **Issue Tracking:** Create issues in the project's issue tracker to define the scope of work, assign tasks, and track progress.
*   **Documentation:** All findings and decisions should be documented in this file.

## 5. Technical Deep Dive: BFLYT/BFLAN File Formats

Based on initial research, here is a summary of the relevant file formats:

*   **BFLYT (Binary caFe LaYouT):** This is the core layout file. It defines the structure, positions, and properties of UI elements.
    *   It contains various sections, including `lyt1` (layout properties), `pan1` (panes), `pic1` (pictures), and `txt1` (text).
    *   **Crucially, it has a `txl1` (Texture List) section that lists external texture files (usually in BFLIM format). This is the key to our image replacement strategy.**
    *   The `pic1` panes use textures from the `txl1` list and define how they are mapped to the UI.

*   **BFLAN (Binary caFe Layout ANimation):** This file contains animations for the layouts defined in BFLYT files. While not the primary focus for image replacement, it's part of the overall layout system.

*   **SZS:** These are compressed archives that bundle BFLYT, BFLAN, and other assets like images (BFLIM) and fonts (BFFNT). We will need to be able to unpack and pack these archives.

**Implications for Image Replacement:**

The fact that BFLYT files reference external image files via the `txl1` section is very promising. It suggests that we can achieve our goal by:

1.  Parsing the BFLYT file to identify the texture list.
2.  Allowing the user to provide new image files.
3.  Creating new BFLIM texture files from the user's images.
4.  Modifying the BFLYT file to reference the new BFLIM files.
5.  Repacking the modified BFLYT and new BFLIM files into an SZS archive.

## 6. Progress Update and Challenges

### 6.1. Understanding .nxtheme Format

We have gained a deeper understanding of the `.nxtheme` file format. It is not a simple zip archive but a custom container format. It typically includes:

*   **Yaz0 compressed SARC archive:** This archive contains the core theme data, including BFLYT files, images, and other metadata.
*   **PNG image:** A background image for the theme.
*   **JSON metadata:** Contains information about the theme, such as name, author, and target.

Crucially, the layout information itself is stored in JSON format within the SARC archive, not directly as a BFLYT file in the `.nxtheme` container.

### 6.2. SARC Extraction Challenges

We have developed a custom Python script (`extract_sarc_v2.py`) to extract files from SARC archives. This script can handle Yaz0 decompression and correctly identifies files within the SARC, even when they are named by their hash.

However, we faced significant challenges in obtaining a valid `ResidentMenu.szs` file that `wszst` (Wiimms SZS Tools) could successfully extract. Multiple attempts with user-provided files resulted in `wszst` reporting the SZS files as empty or unreadable. This remains a primary blocker.

### 6.3. BFLYT File Acquisition

Our goal is to obtain a `qlaunch.bflyt` file (or any other BFLYT file) to integrate its parsing into the `WhisperingOrchids` application. Due to the issues with SZS extraction, we have not yet been able to acquire a usable BFLYT file.

### 6.4. JSON Layout Parsing

We have identified that the layout information is stored in JSON format within the SARC archive (e.g., `o.json`). We have developed a function (`convertNxthemeJsonToLayoutElements` in `src/utils/jsonConverter.ts`) to convert this JSON structure into the `LayoutElement` format used by the `WhisperingOrchids` application. This part of the implementation is ready, pending a valid JSON layout file.

## 7. Next Steps

1.  **Obtain a Valid SZS/BFLYT File:** The most critical next step is to acquire a valid `ResidentMenu.szs` (or any other SZS containing BFLYT files) that `wszst` can successfully extract. Alternatively, a direct `qlaunch.bflyt` file would allow us to proceed.
2.  **Integrate JSON Layout Loading:** Once a valid JSON layout file is available (either from a successful SZS extraction or provided directly), integrate its loading into the `App.tsx` component to display the layout in the editor.
3.  **BFLYT Parser Testing:** Test the `BflytParser` with a valid BFLYT file once obtained.
4.  **Image Replacement Implementation:** Begin implementing the image replacement functionality, allowing users to upload custom images and see them reflected in the layout preview.
