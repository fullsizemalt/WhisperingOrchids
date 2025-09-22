import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Save, Download, Upload } from 'lucide-react';
import ThemeBuilder from './components/ThemeBuilder';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import About from './components/About';
import { ToastProvider } from './components/ToastContainer';
import { useToast } from './hooks/useToast';
import ErrorBoundary from './components/ErrorBoundary';
import { handleFileError, validateFile } from './utils/errorHandling';

// Define the structure of the saved project state
interface ProjectState {
  themeConfig: {
    name: string;
    author: string;
    target: string;
    backgroundImageBase64: string | null;
  };
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

function AppContent() {
  const toast = useToast();
  const [themeConfig, setThemeConfig] = useState({
    name: '',
    author: '',
    target: 'Home Menu',
    backgroundImage: null as File | null,
  });
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Effect to load project from local storage on initial mount
  useEffect(() => {
    loadProjectFromLocalStorage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfigChange = (newConfig: {
    name: string;
    author: string;
    target: string;
    backgroundImage: File | null;
  }) => {
    setThemeConfig(newConfig);
  };

  const generateNxtheme = async () => {
    try {
      // Comprehensive validation before export
      if (!themeConfig.backgroundImage) {
        toast.showError('Missing background image', 'Please upload a background image before generating theme');
        return;
      }

      if (!themeConfig.name.trim()) {
        toast.showError('Missing theme name', 'Please enter a theme name before generating');
        return;
      }

      if (!themeConfig.author.trim()) {
        toast.showError('Missing author name', 'Please enter an author name before generating');
        return;
      }

      // Validate background image
      try {
        validateFile(themeConfig.backgroundImage);
      } catch (fileError) {
        const themeError = handleFileError(fileError);
        toast.showError('Background image validation failed', themeError.message);
        return;
      }

      toast.showInfo('Generating theme...', 'Creating .nxtheme file...');

      const zip = new JSZip();

      // Add background image with error handling
      try {
        const backgroundImageBlob = new Blob([await themeConfig.backgroundImage.arrayBuffer()], {
          type: themeConfig.backgroundImage.type
        });
        zip.file('Body_NXTheme.jpg', backgroundImageBlob);
      } catch (error) {
        throw new Error(`Failed to process background image: ${error}`);
      }

      // Create a minimal info.json for theme identification
      const themeInfo = {
        Version: 16,
        ThemeName: themeConfig.name,
        Author: themeConfig.author,
        Target: themeConfig.target
      };

      zip.file('info.json', JSON.stringify(themeInfo, null, 2));

      // Generate and download the .nxtheme file
      try {
        const content = await zip.generateAsync({ type: 'blob' });
        const filename = `${themeConfig.name.replace(/[^\w\s-]/g, '_')}.nxtheme`;
        saveAs(content, filename);
        toast.showSuccess('Theme exported successfully', `Saved as ${filename}`);
      } catch (error) {
        throw new Error(`Failed to generate .nxtheme file: ${error}`);
      }

    } catch (error) {
      console.error('Theme export failed:', error);
      const themeError = handleFileError(error, 'theme export');
      toast.showError('Export failed', themeError.message);

      // Offer recovery options
      if (themeError.recovery) {
        toast.showInfo('Recovery suggestion', themeError.recovery);
      }
    }
  };

  const saveProject = async (toFile: boolean = false) => {
    try {
      // Validate background image if present
      if (themeConfig.backgroundImage) {
        try {
          validateFile(themeConfig.backgroundImage);
        } catch (fileError) {
          const themeError = handleFileError(fileError);
          toast.showError('Background image validation failed', themeError.message);
          return;
        }
      }

      toast.showInfo('Saving project...', toFile ? 'Preparing download...' : 'Saving to browser storage...');

      const backgroundImageBase64 = themeConfig.backgroundImage
        ? await fileToBase64(themeConfig.backgroundImage)
        : null;

      const projectState: ProjectState = {
        themeConfig: {
          ...themeConfig,
          backgroundImageBase64: backgroundImageBase64,
        },
      };

      // Validate project state structure
      if (!projectState.themeConfig) {
        throw new Error('Invalid project state structure');
      }

      const projectJson = JSON.stringify(projectState);

      // Check project size
      const projectSizeKB = new Blob([projectJson]).size / 1024;
      if (projectSizeKB > 50 * 1024) { // 50MB limit
        throw new Error(`Project is too large (${projectSizeKB.toFixed(1)}KB). Try reducing background image size.`);
      }

      if (toFile) {
        const filename = `${(themeConfig.name || 'untitled_project').replace(/[^\w\s-]/g, '_')}.json`;
        const blob = new Blob([projectJson], { type: 'application/json' });
        saveAs(blob, filename);
        toast.showSuccess('Project downloaded', `Saved as ${filename}`);
      } else {
        // Check localStorage quota
        try {
          localStorage.setItem('switchThemeProject', projectJson);
          toast.showSuccess('Project saved', 'Saved to browser storage');
        } catch (quotaError) {
          if (quotaError instanceof Error && (quotaError.name === 'QuotaExceededError' || quotaError.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
            throw new Error('Browser storage is full. Please download the project as a file instead.');
          }
          throw quotaError;
        }
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      const themeError = handleFileError(error, toFile ? 'project download' : 'project save');
      toast.showError('Save failed', themeError.message);

      // Offer recovery options
      if (themeError.recovery) {
        toast.showInfo('Recovery suggestion', themeError.recovery);
      }
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

        toast.showSuccess('Project loaded', 'Restored from browser storage');
      }
    } catch (error) {
      console.error('Failed to load project from localStorage:', error);
      const themeError = handleFileError(error);
      toast.showError('Load failed', themeError.message);
    }
  };

  const loadProjectFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const projectJson = e.target?.result as string;
        const projectState: ProjectState = JSON.parse(projectJson);

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

        toast.showSuccess('Project loaded', `Loaded ${file.name}`);
      } catch (error) {
        console.error('Failed to load project file:', error);
        const themeError = handleFileError(error, file.name);
        toast.showError('Load failed', themeError.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* About Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <About onClose={() => setShowAboutModal(false)} />
        )}
      </AnimatePresence>

      {/* Main Theme Builder */}
      <ThemeBuilder
        themeConfig={themeConfig}
        onConfigChange={handleConfigChange}
        onGenerateTheme={generateNxtheme}
      />

      {/* Footer with actions */}
      <div className="fixed bottom-6 right-6 flex items-center space-x-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => saveProject(false)}
          className="p-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 transition-all duration-200"
          title="Save Project"
        >
          <Save className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => saveProject(true)}
          className="p-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 transition-all duration-200"
          title="Download Project"
        >
          <Download className="w-5 h-5" />
        </motion.button>

        <motion.label
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 transition-all duration-200 cursor-pointer"
          title="Upload Project"
        >
          <Upload className="w-5 h-5" />
          <input type="file" accept=".json" className="hidden" onChange={loadProjectFromFile} />
        </motion.label>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAboutModal(true)}
          className="p-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 transition-all duration-200"
          title="About"
        >
          <Info className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;