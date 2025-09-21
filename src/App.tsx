import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, Download, Upload, Save, Undo2, Redo2, Info, Palette, Eye, PanelRightOpen, PanelRightClose } from 'lucide-react';
import ThemeConfig from './components/ThemeConfig';
import LayoutEditor from './components/LayoutEditor';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { LayoutElement } from './types.js';
import { convertLayoutElementsToJson } from './utils/jsonConverter';
import { BflytParser } from './utils/bflytParser';
import About from './components/About';
import useHistory from './hooks/useHistory';

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
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'editor'>('config');
  const [sidebarVisible, setSidebarVisible] = useState(true);

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

  const handleBflytUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buffer = Buffer.from(e.target?.result as ArrayBuffer);
        const parser = new BflytParser();
        const parsedBflyt = parser.parse(buffer);

        const newLayoutElements: LayoutElement[] = parsedBflyt.sections
          .filter(section => section.name === 'pan1' || section.name === 'pic1' || section.name === 'txt1')
          .map(section => ({
            id: section.content.paneName,
            type: section.name,
            position: { x: section.content.positionX, y: section.content.positionY },
            size: { width: section.content.width, height: section.content.height },
            scale: { x: section.content.scaleX, y: section.content.scaleY },
            rotation: { x: section.content.rotationX, y: section.content.rotationY, z: section.content.rotationZ },
            visible: (section.content.flags & 1) === 1,
          }));

        setLayoutElementsHistory(newLayoutElements);
        alert('BFLYT file loaded!');
      } catch (error) {
        console.error('Failed to load BFLYT file:', error);
        alert('Failed to load BFLYT file. Invalid file format.');
      }
    };
    reader.readAsArrayBuffer(file);
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
        // Project loaded silently
      } else {
        // No saved project - silent
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Modern Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  WhisperingOrchids
                </h1>
                <p className="text-sm text-gray-400">Nintendo Switch Theme Builder</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullscreenPreview(!isFullscreenPreview)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                {isFullscreenPreview ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAboutModal(true)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                <Info className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Fullscreen Preview Mode */}
      <AnimatePresence>
        {isFullscreenPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
            onClick={() => setIsFullscreenPreview(false)}
          >
            <div className="h-full flex items-center justify-center p-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="w-full max-w-6xl aspect-video bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <LayoutEditor
                  onElementsChange={handleLayoutElementsChange}
                  themeTarget={themeConfig.target}
                  fullscreen={true}
                  backgroundImage={themeConfig.backgroundImage}
                />
              </motion.div>
              <button
                onClick={() => setIsFullscreenPreview(false)}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
              >
                <Minimize2 className="w-6 h-6 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-1">
            {[{id: 'config', label: 'Theme Config', icon: Palette}, {id: 'editor', label: 'Layout Editor', icon: Eye}].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as 'config' | 'editor')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-white/15 text-white border border-white/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Sidebar Toggle - only show on editor tab */}
          {activeTab === 'editor' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarVisible(!sidebarVisible)}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200"
              title={sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
            >
              {sidebarVisible ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
            </motion.button>
          )}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'config' && (
            <motion.div
              key="config"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ThemeConfig
                onConfigChange={handleConfigChange}
                currentConfig={themeConfig}
              />
            </motion.div>
          )}

          {activeTab === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex gap-6 h-[calc(100vh-280px)]"
            >
              {/* Main Preview Area - Responsive width */}
              <motion.div
                className={`${sidebarVisible ? 'flex-1' : 'w-full'} min-w-0 transition-all duration-300`}
                layout
              >
                <LayoutEditor
                  onElementsChange={handleLayoutElementsChange}
                  themeTarget={themeConfig.target}
                  backgroundImage={themeConfig.backgroundImage}
                  layoutElements={layoutElements}
                  mode="preview"
                />
              </motion.div>

              {/* Sidebar - Toggleable */}
              <AnimatePresence>
                {sidebarVisible && (
                  <motion.div
                    initial={{ opacity: 0, x: 300, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: 320 }}
                    exit={{ opacity: 0, x: 300, width: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-shrink-0 space-y-6 overflow-hidden"
                  >
                    {/* Elements & Add Custom Element */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                      <h3 className="text-lg font-bold mb-4 text-white">Elements</h3>
                      <LayoutEditor
                        onElementsChange={handleLayoutElementsChange}
                        themeTarget={themeConfig.target}
                        backgroundImage={themeConfig.backgroundImage}
                        layoutElements={layoutElements}
                        mode="elements"
                      />
                    </motion.div>

                    {/* Properties Panel */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                      <h3 className="text-lg font-bold mb-4 text-white">Properties</h3>
                      <LayoutEditor
                        onElementsChange={handleLayoutElementsChange}
                        themeTarget={themeConfig.target}
                        backgroundImage={themeConfig.backgroundImage}
                        layoutElements={layoutElements}
                        mode="properties"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Bar */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-4">
            <div className="flex items-center space-x-3">
              {/* Undo/Redo */}
              <div className="flex space-x-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={undo}
                  disabled={!canUndo}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Undo"
                >
                  <Undo2 className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={redo}
                  disabled={!canRedo}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Redo"
                >
                  <Redo2 className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="w-px h-8 bg-white/20"></div>

              {/* Save/Load */}
              <div className="flex space-x-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => saveProject(false)}
                  className="p-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 transition-all duration-200"
                  title="Save to Browser"
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
              </div>

              <div className="w-px h-8 bg-white/20"></div>

              {/* Generate */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={generateNxtheme}
                disabled={!themeConfig.backgroundImage}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                Generate .nxtheme
              </motion.button>

              {/* Upload BFLYT */}
              <motion.label
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium cursor-pointer"
              >
                Upload BFLYT
                <input type="file" accept=".bflyt" className="hidden" onChange={handleBflytUpload} />
              </motion.label>
            </div>
          </div>
        </motion.div>
      </main>

      {/* About Modal */}
      <AnimatePresence>
        {showAboutModal && <About onClose={() => setShowAboutModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;