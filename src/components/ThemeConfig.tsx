import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Crop, RotateCcw, Check, AlertTriangle } from 'lucide-react';

interface ThemeConfigProps {
  onConfigChange: (config: {
    name: string;
    author: string;
    target: string;
    backgroundImage: File | null;
  }) => void;
  currentConfig?: {
    name: string;
    author: string;
    target: string;
    backgroundImage: File | null;
  };
}

const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 720;

const ThemeConfig: React.FC<ThemeConfigProps> = ({ onConfigChange, currentConfig }) => {
  const [name, setName] = useState<string>(currentConfig?.name || '');
  const [author, setAuthor] = useState<string>(currentConfig?.author || '');
  const [target, setTarget] = useState<string>(currentConfig?.target || 'Home Menu');
  const [backgroundImage, setBackgroundImage] = useState<File | null>(currentConfig?.backgroundImage || null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    onConfigChange({
      name,
      author,
      target,
      backgroundImage,
    });
  }, [name, author, target, backgroundImage, onConfigChange]);

  // Effect to clean up image preview URL
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const manipulateImage = (file: File, type: 'resize' | 'crop'): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        if (type === 'resize') {
          // Simple resize, may distort aspect ratio
          ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
        } else if (type === 'crop') {
          // Center crop
          const imgAspectRatio = img.width / img.height;
          const canvasAspectRatio = TARGET_WIDTH / TARGET_HEIGHT;

          let sx, sy, sWidth, sHeight;

          if (imgAspectRatio > canvasAspectRatio) {
            // Image is wider than canvas, crop horizontally
            sHeight = img.height;
            sWidth = img.height * canvasAspectRatio;
            sx = (img.width - sWidth) / 2;
            sy = 0;
          } else {
            // Image is taller than canvas, crop vertically
            sWidth = img.width;
            sHeight = img.width / canvasAspectRatio;
            sx = 0;
            sy = (img.height - sHeight) / 2;
          }
          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
        }

        canvas.toBlob((blob) => {
          if (blob) {
            const manipulatedFile = new File([blob], file.name, { type: 'image/jpeg' });
            resolve(manipulatedFile);
          } else {
            reject(new Error('Canvas to Blob failed'));
          }
        }, 'image/jpeg', 0.9); // Quality 0.9 for JPG
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    } else {
      setBackgroundImage(null);
      setImagePreviewUrl(null);
      setImageDimensions(null);
      setImageError(null);
    }
  };

  const handleImageManipulation = async (type: 'resize' | 'crop') => {
    if (!backgroundImage || !imagePreviewUrl) return;

    try {
      const manipulatedFile = await manipulateImage(backgroundImage, type);
      setBackgroundImage(manipulatedFile);
      // Create a new object URL for the manipulated file for preview
      setImagePreviewUrl(URL.createObjectURL(manipulatedFile));
      setImageDimensions({ width: TARGET_WIDTH, height: TARGET_HEIGHT });
      setImageError(null);
    } catch (error) {
      console.error('Image manipulation failed:', error);
      setImageError('Failed to manipulate image.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleImageFile(file);
      }
    }
  };

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        if (img.width === TARGET_WIDTH && img.height === TARGET_HEIGHT) {
          setBackgroundImage(file);
          setImagePreviewUrl(reader.result as string);
          setImageError(null);
        } else {
          setImageError(`Image dimensions are ${img.width}x${img.height}. Expected ${TARGET_WIDTH}x${TARGET_HEIGHT}.`);
          setBackgroundImage(null);
          setImagePreviewUrl(reader.result as string);
        }
      };
      img.onerror = () => {
        setImageError('Could not load image.');
        setBackgroundImage(null);
        setImagePreviewUrl(null);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      {/* Basic Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Theme Configuration
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Theme Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Theme"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-300">Theme Target</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="Home Menu">Home Menu</option>
              <option value="Lockscreen">Lockscreen</option>
              <option value="All Software">All Software</option>
              <option value="System Settings">System Settings</option>
              <option value="User Page">User Page</option>
              <option value="News">News</option>
              <option value="Player select applet">Player select applet</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Background Image Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
      >
        <h3 className="text-xl font-bold mb-6 text-white">Background Image</h3>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
            isDragOver
              ? 'border-blue-400 bg-blue-500/10'
              : 'border-white/20 hover:border-white/40'
          }`}
        >
          <div className="text-center">
            {!imagePreviewUrl ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-white mb-2">Drop your image here</p>
                <p className="text-gray-400 mb-4">Supports JPG images (1280x720 recommended)</p>
                <label className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium cursor-pointer transition-all duration-200">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Browse Files
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                  />
                </label>
              </>
            ) : (
              <div className="space-y-4">
                {/* Large Image Preview */}
                <div className="relative max-w-4xl mx-auto">
                  <img
                    src={imagePreviewUrl}
                    alt="Background Preview"
                    className="w-full h-auto rounded-xl shadow-2xl"
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                  />
                  {imageDimensions && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-black/70 text-white text-sm">
                      {imageDimensions.width}x{imageDimensions.height}
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  {imageError ? (
                    <div className="flex items-center px-4 py-2 rounded-lg bg-red-500/20 text-red-300">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      <span>Needs adjustment</span>
                    </div>
                  ) : (
                    <div className="flex items-center px-4 py-2 rounded-lg bg-green-500/20 text-green-300">
                      <Check className="w-5 h-5 mr-2" />
                      <span>Perfect size!</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-center space-x-3">
                  <label className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium cursor-pointer transition-all duration-200">
                    <Upload className="w-4 h-4 inline mr-2" />
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                    />
                  </label>

                  {imageError && imageDimensions && (imageDimensions.width !== TARGET_WIDTH || imageDimensions.height !== TARGET_HEIGHT) && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleImageManipulation('resize')}
                        className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium transition-all duration-200"
                      >
                        <RotateCcw className="w-4 h-4 inline mr-2" />
                        Auto-Resize
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleImageManipulation('crop')}
                        className="px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-medium transition-all duration-200"
                      >
                        <Crop className="w-4 h-4 inline mr-2" />
                        Center-Crop
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {imageError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-300 font-medium">Image requires adjustment</p>
                <p className="text-red-400 text-sm mt-1">{imageError}</p>
                <p className="text-gray-400 text-xs mt-2">
                  Nintendo Switch themes require exactly 1280x720 pixel images for optimal display.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ThemeConfig;
