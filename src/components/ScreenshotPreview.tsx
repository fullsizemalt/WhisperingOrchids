import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Layers, Eye, EyeOff, Download, AlertCircle } from 'lucide-react';
import type { LayoutElement } from '../types.js';
import {
  getDefaultScreenshot,
  getScreenshotsForTarget,
  checkScreenshotExists,
  loadScreenshotImage,
  getElementAtPosition,
  layoutToOverlay,
  type ScreenshotData,
  type ElementMap
} from '../utils/screenshotManager';

interface ScreenshotPreviewProps {
  themeTarget: string;
  layoutElements: LayoutElement[];
  backgroundImage?: File | null;
  selectedElementId?: string | null;
  onElementSelect?: (elementId: string) => void;
  className?: string;
}

const ScreenshotPreview: React.FC<ScreenshotPreviewProps> = ({
  themeTarget,
  layoutElements,
  backgroundImage,
  selectedElementId,
  onElementSelect,
  className = ''
}) => {
  const [screenshot, setScreenshot] = useState<ScreenshotData | null>(null);
  const [screenshotImage, setScreenshotImage] = useState<HTMLImageElement | null>(null);
  const [screenshotExists, setScreenshotExists] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showElements, setShowElements] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load screenshot for current theme target
  useEffect(() => {
    const loadScreenshot = async () => {
      setLoading(true);
      setError(null);

      try {
        const defaultScreenshot = getDefaultScreenshot(themeTarget);
        if (!defaultScreenshot) {
          setError(`No screenshot available for ${themeTarget}`);
          setScreenshot(null);
          setScreenshotExists(false);
          return;
        }

        setScreenshot(defaultScreenshot);

        // Check if screenshot file exists
        const exists = await checkScreenshotExists(defaultScreenshot);
        setScreenshotExists(exists);

        if (exists) {
          const img = await loadScreenshotImage(defaultScreenshot);
          setScreenshotImage(img);
        } else {
          setError(`Screenshot file not found: ${defaultScreenshot.path}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load screenshot');
      } finally {
        setLoading(false);
      }
    };

    loadScreenshot();
  }, [themeTarget]);

  // Render preview with overlays
  useEffect(() => {
    if (!canvasRef.current || !screenshot || !screenshotImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = screenshot.width;
    canvas.height = screenshot.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw screenshot as base
    if (screenshotExists && screenshotImage) {
      ctx.drawImage(screenshotImage, 0, 0);
    } else {
      // Draw placeholder
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#6b7280';
      ctx.font = '24px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Screenshot not available', canvas.width / 2, canvas.height / 2);
      ctx.fillText(`Upload to: public/screenshots/switch/${themeTarget.toLowerCase().replace(' ', '-')}/`, canvas.width / 2, canvas.height / 2 + 40);
    }

    // Draw background image if provided
    if (backgroundImage && showOverlay) {
      const img = new Image();
      img.onload = () => {
        ctx.globalAlpha = 0.8;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        // Redraw elements on top
        if (showElements) {
          drawElements();
        }
      };
      img.src = URL.createObjectURL(backgroundImage);
    } else if (showElements) {
      drawElements();
    }

    function drawElements() {
      if (!showElements) return;

      const overlayElements = layoutToOverlay(layoutElements, screenshot!);

      overlayElements.forEach((element) => {
        if (!element.visible) return;

        const { overlayPosition, size, color } = element;

        // Draw element
        if (ctx) {
          ctx.fillStyle = color || '#FF000033';
          ctx.fillRect(
            overlayPosition.x,
            overlayPosition.y,
            size.width,
            size.height
          );

          // Draw border for selected element
          if (element.id === selectedElementId) {
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3;
            ctx.strokeRect(
              overlayPosition.x - 1.5,
              overlayPosition.y - 1.5,
              size.width + 3,
              size.height + 3
            );
          }

          // Draw element label
          ctx.fillStyle = '#000000aa';
          ctx.fillRect(overlayPosition.x, overlayPosition.y - 20, 100, 20);

          ctx.fillStyle = '#ffffff';
          ctx.font = '12px system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(element.id, overlayPosition.x + 4, overlayPosition.y - 6);
        }
      });
    }
  }, [screenshot, screenshotImage, screenshotExists, layoutElements, backgroundImage, showOverlay, showElements, selectedElementId]);

  // Handle canvas click for element selection
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!screenshot || !onElementSelect) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Check if click is on a layout element
    const clickedElement = layoutElements.find(element => {
      return x >= element.position.x &&
             x <= element.position.x + element.size.width &&
             y >= element.position.y &&
             y <= element.position.y + element.size.height &&
             element.visible;
    });

    if (clickedElement) {
      onElementSelect(clickedElement.id);
      return;
    }

    // Check if click is on a mapped screenshot element
    const mappedElement = getElementAtPosition(screenshot, x, y);
    if (mappedElement) {
      onElementSelect(mappedElement.elementId);
    }
  }, [screenshot, layoutElements, onElementSelect]);

  // Export preview as image
  const exportPreview = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `${themeTarget.toLowerCase().replace(' ', '-')}-preview.png`;
    link.href = canvas.toDataURL();
    link.click();
  }, [themeTarget]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 rounded-2xl ${className}`}>
        <div className="text-center">
          <Camera className="w-8 h-8 mx-auto mb-2 text-gray-500 animate-pulse" />
          <p className="text-gray-400">Loading screenshot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-900 rounded-2xl overflow-hidden ${className}`}>
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowOverlay(!showOverlay)}
          className={`p-2 rounded-lg transition-colors ${
            showOverlay ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'
          }`}
          title="Toggle Background Overlay"
        >
          <Layers className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowElements(!showElements)}
          className={`p-2 rounded-lg transition-colors ${
            showElements ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-400'
          }`}
          title="Toggle Elements"
        >
          {showElements ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={exportPreview}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Export Preview"
        >
          <Download className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Error State */}
      {error && (
        <div className="absolute top-4 left-4 z-10 bg-red-500/20 border border-red-500/30 rounded-lg p-3 max-w-md">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-300 font-medium text-sm">Screenshot Error</p>
              <p className="text-red-400 text-xs mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas */}
      <div ref={containerRef} className="w-full h-full">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full object-contain cursor-crosshair"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3">
        <div className="flex items-center space-x-2 text-sm">
          <Camera className="w-4 h-4 text-gray-400" />
          <span className="text-white font-medium">{themeTarget}</span>
          {screenshot && (
            <span className="text-gray-400">
              • {screenshot.width}x{screenshot.height}
            </span>
          )}
          {!screenshotExists && (
            <span className="text-red-400">• No screenshot</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenshotPreview;