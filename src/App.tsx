import React, { useState, useEffect } from 'react';
import ThemeConfig from './components/ThemeConfig';
import LayoutEditor from './components/LayoutEditor';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { LayoutElement } from './components/LayoutEditor';
import { convertLayoutElementsToJson } from './utils/jsonConverter';
import About from './components/About';
import useHistory from './hooks/useHistory'; // Import the useHistory hook

// Define the structure of the saved project state
interface ProjectState {
  themeConfig: {
    name: string;
    author: string;
    target: string;
    backgroundImageBase64: string | null;
  };
  layoutElements: LayoutElement[];
}

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Helper to convert Base64 to File
const base64ToFile = async (base64: string, filename: string, mimeType: string): Promise<File> => {
  const res = await fetch(base64);
  const blob = await res.blob();
  return new File([blob], filename, { type: mimeType });
};

function App() {
  const [themeConfig, setThemeConfig] = useState({
    name: '',
    author: '',
    target: 'Home Menu',
    backgroundImage: null as File | null,
  });
  // Use useHistory for layoutElements
  const { state: layoutElements, set: setLayoutElementsHistory, undo, redo, canUndo, canRedo } = useHistory<LayoutElement[]>([]);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Effect to load project from local storage on initial mount
  useEffect(() => {
    loadProjectFromLocalStorage();
  }, []);

  const handleConfigChange = (newConfig: {
    name: string;
    author: string;
    target: string;
    backgroundImage: File | null;
  }) => {
    setThemeConfig(newConfig);
  };

  const handleLayoutElementsChange = (elements: LayoutElement[]) => {
    setLayoutElementsHistory(elements);
  };

  const generateNxtheme = async () => {
    if (!themeConfig.backgroundImage) {
      alert('Please upload a background image first.');
      return;
    }

    const zip = new JSZip();

    // Add background image
    const backgroundImageBlob = new Blob([await themeConfig.backgroundImage.arrayBuffer()], { type: themeConfig.backgroundImage.type });
    zip.file('Body_NXTheme.jpg', backgroundImageBlob);

    // Generate layout.json using the converter utility
    const nxthemeLayoutJson = convertLayoutElementsToJson(layoutElements, themeConfig);
    const layoutJsonContent = JSON.stringify(nxthemeLayoutJson, null, 2);

    zip.file('layout.json', layoutJsonContent);

    // Generate and download the .nxtheme file
    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveAs(content, `${themeConfig.name || 'custom_theme'}.nxtheme`);
    });
  };

  const saveProject = async (toFile: boolean = false) => {
    try {
      const backgroundImageBase64 = themeConfig.backgroundImage
        ? await fileToBase64(themeConfig.backgroundImage)
        : null;

      const projectState: ProjectState = {
        themeConfig: {
          ...themeConfig,
          backgroundImageBase64: backgroundImageBase64,
        },
        layoutElements: layoutElements,
      };

      const projectJson = JSON.stringify(projectState);

      if (toFile) {
        const blob = new Blob([projectJson], { type: 'application/json' });
        saveAs(blob, `${themeConfig.name || 'untitled_project'}.json`);
      } else {
        localStorage.setItem('switchThemeProject', projectJson);
        alert('Project saved to browser storage!');
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project.');
    }
  };

  const loadProjectFromLocalStorage = async () => {
    try {
      const savedProject = localStorage.getItem('switchThemeProject');
      if (savedProject) {
        const projectState: ProjectState = JSON.parse(savedProject);

        let loadedBackgroundImage: File | null = null;
        if (projectState.themeConfig.backgroundImageBase64) {
          // Assuming original mimeType was image/jpeg for simplicity, can be stored in ProjectState if needed
          loadedBackgroundImage = await base64ToFile(
            projectState.themeConfig.backgroundImageBase64,
            projectState.themeConfig.name || 'background.jpg',
            'image/jpeg'
          );
        }

        setThemeConfig({
          name: projectState.themeConfig.name,
          author: projectState.themeConfig.author,
          target: projectState.themeConfig.target,
          backgroundImage: loadedBackgroundImage,
        });
        setLayoutElementsHistory(projectState.layoutElements); // Use setLayoutElementsHistory
        alert('Project loaded from browser storage!');
      } else {
        alert('No saved project found in browser storage.');
      }
    } catch (error) {
      console.error('Failed to load project from browser storage:', error);
      alert('Failed to load project from browser storage.');
    }
  };

  const loadProjectFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const projectState: ProjectState = JSON.parse(e.target?.result as string);

        let loadedBackgroundImage: File | null = null;
        if (projectState.themeConfig.backgroundImageBase64) {
          loadedBackgroundImage = await base64ToFile(
            projectState.themeConfig.backgroundImageBase64,
            projectState.themeConfig.name || 'background.jpg',
            'image/jpeg'
          );
        }

        setThemeConfig({
          name: projectState.themeConfig.name,
          author: projectState.themeConfig.author,
          target: projectState.themeConfig.target,
          backgroundImage: loadedBackgroundImage,
        });
        setLayoutElementsHistory(projectState.layoutElements); // Use setLayoutElementsHistory
        alert('Project loaded from file!');
      } catch (error) {
        console.error('Failed to load project from file:', error);
        alert('Failed to load project from file. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Nintendo Switch Theme Builder</h1>
        <button
          onClick={() => setShowAboutModal(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-1 px-3 rounded-lg text-sm"
        >
          About
        </button>
      </header>
      <main className="container mx-auto p-4 mt-8">
        <ThemeConfig onConfigChange={handleConfigChange} />

        {/* Display current config for debugging/verification */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Theme Configuration (for dev)</h2>
          <p><strong>Name:</strong> {themeConfig.name}</p>
          <p><strong>Author:</strong> {themeConfig.author}</p>
          <p><strong>Target:</strong> {themeConfig.target}</p>
          <p><strong>Background Image:</strong> {themeConfig.backgroundImage ? themeConfig.backgroundImage.name : 'None'}</p>
        </div>

        <LayoutEditor onElementsChange={handleLayoutElementsChange} themeTarget={themeConfig.target} />

        <div className="mt-8 text-center space-x-4">
          {/* Undo/Redo Buttons */}
          <button
            onClick={undo}
            disabled={!canUndo}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Redo
          </button>

          <button
            onClick={() => saveProject(false)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Save Project (Browser)
          </button>
          <button
            onClick={() => saveProject(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Download Project (File)
          </button>
          <button
            onClick={loadProjectFromLocalStorage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Load Project (Browser)
          </button>
          <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer">
            Upload Project (File)
            <input type="file" accept=".json" className="hidden" onChange={loadProjectFromFile} />
          </label>
          <button
            onClick={generateNxtheme}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!themeConfig.backgroundImage}
          >
            Generate .nxtheme
          </button>
        </div>

        {/* About Modal */}
        {showAboutModal && <About onClose={() => setShowAboutModal(false)} />}
      </main>
    </div>
  );
}

export default App;