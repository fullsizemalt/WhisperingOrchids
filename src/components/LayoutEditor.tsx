import type { LayoutElement } from "../types.js";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Square,
  Image as ImageIcon,
  Settings,
  ChevronDown,
  ChevronRight,
  Camera,
  Monitor
} from 'lucide-react';
import ScreenshotPreview from './ScreenshotPreview';

interface LayoutEditorProps {
  onElementsChange: (elements: LayoutElement[]) => void;
  themeTarget: string;
  backgroundImage?: File | null;
  layoutElements?: LayoutElement[];
  mode?: 'preview' | 'elements' | 'properties';
  fullscreen?: boolean;
}

const getDefaultLayout = (target: string): LayoutElement[] => {
  // IMPORTANT NOTE ON elementId's (Pane Names):
  // elementId's are internal identifiers used by the Nintendo Switch UI (.bflyt files).
  // They are not officially documented by Nintendo and are typically discovered through
  // reverse-engineering tools like Switch Layout Editor. Comprehensive lists for all
  // applets are difficult to obtain through web research alone.
  //
  // For 'Home Menu' and 'Lockscreen', some commonly known elementId's are used.
  // For other applets ('All Software', 'System Settings', 'User Page', 'News'),
  // generic placeholder IDs are used. These placeholders allow users to visually
  // manipulate elements, but may not correspond to actual UI panes in the game.
  // Users wishing to target specific UI elements in these applets may need to
  // discover the correct elementId's themselves (e.g., by inspecting existing
  // themes with Switch Layout Editor).

  if (target === 'Home Menu') {
    return [
      {
        id: 'N_GameRoot',
        type: 'pane',
        position: { x: 0, y: 0 },
        size: { width: 1280, height: 720 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#FF00001A', // Very light red, background for game area
      },
      {
        id: 'N_ScrollWindow',
        type: 'pane',
        position: { x: 0, y: 100 },
        size: { width: 1280, height: 500 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#0000FF1A', // Very light blue, scrollable game window
      },
      {
        id: 'N_Game',
        type: 'pane',
        position: { x: 50, y: 150 },
        size: { width: 200, height: 200 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#00FF0033', // Light green, individual game container
      },
      {
        id: 'N_Icon_00',
        type: 'pic1',
        position: { x: 60, y: 160 },
        size: { width: 180, height: 180 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#FFFF0066', // Light yellow, game icon
      },
      {
        id: 'RdtBtnIconGame',
        type: 'pane',
        position: { x: 50, y: 150 },
        size: { width: 200, height: 200 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#FF00FF1A', // Light magenta, game icon button
      },
      {
        id: 'RootPane',
        type: 'pane',
        position: { x: 0, y: 0 },
        size: { width: 200, height: 200 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#00FFFF1A', // Light cyan, inner pane of game icon button
      },
      {
        id: 'B_Hit',
        type: 'pane',
        position: { x: 0, y: 0 },
        size: { width: 200, height: 200 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#8000801A', // Light purple, hitbox of game icon button
      },
      {
        id: 'SystemSettingsButton',
        type: 'pic1',
        position: { x: 1000, y: 600 },
        size: { width: 80, height: 80 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#808080FF', // Gray, system settings button
      },
    ];
  } else if (target === 'Lockscreen') {
    return [
      {
        id: 'RootPane',
        type: 'pane',
        position: { x: 0, y: 0 },
        size: { width: 1280, height: 720 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#000000FF', // Black background
      },
      {
        id: 'N_DateTime',
        type: 'txt1',
        position: { x: 640, y: 360 },
        size: { width: 400, height: 100 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#FFFFFFFF', // White text for date/time
      },
      {
        id: 'N_BatteryIcon',
        type: 'pic1',
        position: { x: 1200, y: 50 },
        size: { width: 50, height: 25 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#FFFFFFFF', // White battery icon
      },
    ];
  } else {
    // Generic placeholder layout for other applets
    return [
      {
        id: 'GenericRootPane',
        type: 'pane',
        position: { x: 0, y: 0 },
        size: { width: 1280, height: 720 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#FF000033', // Light red placeholder
      },
      {
        id: 'GenericContentPane',
        type: 'pane',
        position: { x: 100, y: 100 },
        size: { width: 1080, height: 520 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#00FF0033', // Light green placeholder
      },
      {
        id: 'GenericButton',
        type: 'pane',
        position: { x: 200, y: 200 },
        size: { width: 150, height: 50 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#0000FF33', // Light blue placeholder
      },
    ];
  }
};

// Utility to convert RGBA hex to standard hex (for color picker)
const rgbaToHex = (rgba: string): string => {
  if (!rgba.startsWith('#') || rgba.length !== 9) {
    return '#FFFFFF'; // Default to white if not a valid RGBA hex
  }
  return rgba.substring(0, 7); // Return just the RGB part
};

// Utility to convert standard hex to RGBA hex (for internal use)
const hexToRgba = (hex: string, alpha: string = 'FF'): string => {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (match) {
    return `#${match[1]}${match[2]}${match[3]}${alpha}`;
  }
  return hex; // Return as is if not a valid hex
};

const LayoutEditor: React.FC<LayoutEditorProps> = ({
  onElementsChange,
  themeTarget,
  backgroundImage,
  layoutElements: propLayoutElements,
  mode = 'preview',
}) => {
  const [elements, setElements] = useState<LayoutElement[]>(propLayoutElements || getDefaultLayout(themeTarget));
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [newElementId, setNewElementId] = useState<string>('');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [expandedProperties, setExpandedProperties] = useState<Set<string>>(new Set(['position', 'size']));
  const [previewMode, setPreviewMode] = useState<'canvas' | 'screenshot'>('canvas');

  const previewRef = useRef<HTMLDivElement>(null);

  const selectedElement = elements.find(el => el.id === selectedElementId);

  // Sync with prop elements
  useEffect(() => {
    if (propLayoutElements) {
      setElements(propLayoutElements);
    }
  }, [propLayoutElements]);

  // Notify parent component whenever elements change
  useEffect(() => {
    onElementsChange(elements);
  }, [elements, onElementsChange]);

  // Update elements when themeTarget changes
  useEffect(() => {
    if (!propLayoutElements) {
      setElements(getDefaultLayout(themeTarget));
      setSelectedElementId(null);
    }
  }, [themeTarget, propLayoutElements]);

  // Handle background image
  useEffect(() => {
    if (backgroundImage) {
      const url = URL.createObjectURL(backgroundImage);
      setBackgroundImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setBackgroundImageUrl(null);
    }
  }, [backgroundImage]);

  const handleElementClick = useCallback((id: string) => {
    setSelectedElementId(id);
  }, []);

  const handlePropertyChange = useCallback((property: string, value: any) => {
    if (!selectedElement) return;

    setElements(prevElements =>
      prevElements.map(el =>
        el.id === selectedElement.id
          ? { ...el, [property]: value }
          : el
      )
    );
  }, [selectedElement]);

  const addCustomElement = useCallback(() => {
    if (!newElementId.trim()) return;

    const newElement: LayoutElement = {
      id: newElementId.trim(),
      type: 'pane',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 200 },
      scale: { x: 1, y: 1 },
      rotation: { x: 0, y: 0, z: 0 },
      visible: true,
      color: '#FF000033',
    };

    setElements(prev => [...prev, newElement]);
    setNewElementId('');
    setSelectedElementId(newElement.id);
  }, [newElementId]);

  const deleteElement = useCallback((elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  const toggleProperty = useCallback((property: string) => {
    setExpandedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(property)) {
        newSet.delete(property);
      } else {
        newSet.add(property);
      }
      return newSet;
    });
  }, []);

  // Preview Mode Component
  const PreviewMode = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
    >
      {/* Preview Mode Toggle */}
      <div className="absolute top-4 left-4 z-20 flex space-x-1 bg-black/70 rounded-lg p-1">
        <button
          onClick={() => setPreviewMode('canvas')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
            previewMode === 'canvas'
              ? 'bg-blue-500 text-white'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span>Canvas</span>
        </button>
        <button
          onClick={() => setPreviewMode('screenshot')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
            previewMode === 'screenshot'
              ? 'bg-green-500 text-white'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Live Preview</span>
        </button>
      </div>

      {previewMode === 'screenshot' ? (
        <ScreenshotPreview
          themeTarget={themeTarget}
          layoutElements={elements}
          backgroundImage={backgroundImage}
          selectedElementId={selectedElementId}
          onElementSelect={handleElementClick}
          className="w-full h-full"
        />
      ) : (
        <div
          ref={previewRef}
          className="relative w-full h-full bg-gray-900 rounded-2xl overflow-hidden"
          style={{
            aspectRatio: '16/9',
            backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Nintendo Switch Preview Canvas */}
          <div className="absolute inset-0" style={{ width: '1280px', height: '720px', transform: 'scale(0.8)', transformOrigin: 'top left' }}>
            {elements.map((element) => (
              <motion.div
                key={element.id}
                className={`absolute border-2 cursor-pointer transition-all duration-200 ${
                  selectedElementId === element.id
                    ? 'border-blue-400 shadow-lg shadow-blue-400/50'
                    : 'border-white/30 hover:border-white/60'
                }`}
                style={{
                  left: element.position.x,
                  top: element.position.y,
                  width: element.size.width,
                  height: element.size.height,
                  backgroundColor: element.visible ? element.color : 'transparent',
                  transform: `scale(${element.scale.x}, ${element.scale.y}) rotate(${element.rotation.z}deg)`,
                  transformOrigin: 'top left',
                  opacity: element.visible ? 1 : 0.3,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleElementClick(element.id);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Element Label */}
                <div className="absolute -top-6 left-0 px-2 py-1 bg-black/70 text-white text-xs rounded truncate max-w-full">
                  {element.id}
                </div>

                {/* Element Type Icon */}
                <div className="absolute top-1 right-1 p-1 bg-black/50 rounded">
                  {element.type === 'pane' ? (
                    <Square className="w-3 h-3 text-white" />
                  ) : element.type === 'pic1' ? (
                    <ImageIcon className="w-3 h-3 text-white" />
                  ) : (
                    <span className="text-white text-xs">T</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  // Elements Mode Component
  const ElementsMode = () => (
    <div className="space-y-4">
      {/* Add Custom Element */}
      <div className="space-y-3">
        <input
          type="text"
          value={newElementId}
          onChange={(e) => setNewElementId(e.target.value)}
          placeholder="New Element ID"
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          onKeyPress={(e) => e.key === 'Enter' && addCustomElement()}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addCustomElement}
          disabled={!newElementId.trim()}
          className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Element</span>
        </motion.button>
      </div>

      {/* Elements List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {elements.map((element) => (
          <motion.div
            key={element.id}
            className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
              selectedElementId === element.id
                ? 'bg-blue-500/20 border-blue-400'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            onClick={() => handleElementClick(element.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                {element.type === 'pane' ? (
                  <Square className="w-4 h-4 text-gray-400 flex-shrink-0" />
                ) : element.type === 'pic1' ? (
                  <ImageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                ) : (
                  <span className="text-gray-400 text-xs flex-shrink-0">T</span>
                )}
                <span className="text-white text-sm font-medium truncate">{element.id}</span>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePropertyChange('visible', !element.visible);
                  }}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  {element.visible ? (
                    <Eye className="w-4 h-4 text-green-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteElement(element.id);
                  }}
                  className="p-1 rounded hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Properties Mode Component
  const PropertiesMode = () => {
    if (!selectedElement) {
      return (
        <div className="text-center text-gray-400 py-8">
          <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select an element to edit its properties</p>
        </div>
      );
    }

    const PropertySection = ({ title, property, children }: { title: string; property: string; children: React.ReactNode }) => (
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleProperty(property)}
          className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between text-left"
        >
          <span className="font-medium text-white">{title}</span>
          {expandedProperties.has(property) ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>
        <AnimatePresence>
          {expandedProperties.has(property) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-3">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );

    const NumberInput = ({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) => (
      <div>
        <label className="block text-sm text-gray-300 mb-1">{label}</label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
    );

    return (
      <div className="space-y-4">
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            {selectedElement.type === 'pane' ? (
              <Square className="w-4 h-4 text-blue-400" />
            ) : selectedElement.type === 'pic1' ? (
              <ImageIcon className="w-4 h-4 text-blue-400" />
            ) : (
              <span className="text-blue-400 text-xs">T</span>
            )}
            <span className="text-white font-medium text-sm">{selectedElement.id}</span>
          </div>
        </div>

        <PropertySection title="Position" property="position">
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="X"
              value={selectedElement.position.x}
              onChange={(value) => handlePropertyChange('position', { ...selectedElement.position, x: value })}
            />
            <NumberInput
              label="Y"
              value={selectedElement.position.y}
              onChange={(value) => handlePropertyChange('position', { ...selectedElement.position, y: value })}
            />
          </div>
        </PropertySection>

        <PropertySection title="Size" property="size">
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Width"
              value={selectedElement.size.width}
              onChange={(value) => handlePropertyChange('size', { ...selectedElement.size, width: value })}
            />
            <NumberInput
              label="Height"
              value={selectedElement.size.height}
              onChange={(value) => handlePropertyChange('size', { ...selectedElement.size, height: value })}
            />
          </div>
        </PropertySection>

        <PropertySection title="Scale" property="scale">
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="X Scale"
              value={selectedElement.scale.x}
              onChange={(value) => handlePropertyChange('scale', { ...selectedElement.scale, x: value })}
            />
            <NumberInput
              label="Y Scale"
              value={selectedElement.scale.y}
              onChange={(value) => handlePropertyChange('scale', { ...selectedElement.scale, y: value })}
            />
          </div>
        </PropertySection>

        <PropertySection title="Rotation" property="rotation">
          <NumberInput
            label="Z Rotation (degrees)"
            value={selectedElement.rotation.z}
            onChange={(value) => handlePropertyChange('rotation', { ...selectedElement.rotation, z: value })}
          />
        </PropertySection>

        <PropertySection title="Appearance" property="appearance">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Visible</label>
              <button
                onClick={() => handlePropertyChange('visible', !selectedElement.visible)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  selectedElement.visible ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    selectedElement.visible ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Color</label>
              <div className="space-y-2">
                <HexColorPicker
                  color={rgbaToHex(selectedElement.color || '#FFFFFFFF')}
                  onChange={(color) => {
                    const currentAlpha = (selectedElement.color || '#FFFFFFFF').slice(7, 9) || 'FF';
                    handlePropertyChange('color', hexToRgba(color, currentAlpha));
                  }}
                  className="w-full"
                />
                <input
                  type="text"
                  value={selectedElement.color}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                  placeholder="#RRGGBBAA"
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                />
              </div>
            </div>
          </div>
        </PropertySection>
      </div>
    );
  };

  // Render based on mode
  if (mode === 'preview') return <PreviewMode />;
  if (mode === 'elements') return <ElementsMode />;
  if (mode === 'properties') return <PropertiesMode />;

  return <PreviewMode />;
};

export default LayoutEditor;