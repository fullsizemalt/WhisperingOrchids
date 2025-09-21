import React, { useState, ChangeEvent, useEffect } from 'react';

interface ThemeConfigProps {
  onConfigChange: (config: {
    name: string;
    author: string;
    target: string;
    backgroundImage: File | null;
  }) => void;
}

const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 720;

const ThemeConfig: React.FC<ThemeConfigProps> = ({ onConfigChange }) => {
  const [name, setName] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [target, setTarget] = useState<string>('Home Menu');
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
            setBackgroundImage(null); // Clear background image if dimensions are wrong
            setImagePreviewUrl(reader.result as string); // Still show preview of original
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Theme Configuration</h2>

      <div className="mb-4">
        <label htmlFor="themeName" className="block text-sm font-medium text-gray-700">Theme Name</label>
        <input
          type="text"
          id="themeName"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome Theme"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="themeAuthor" className="block text-sm font-medium text-gray-700">Author</label>
        <input
          type="text"
          id="themeAuthor"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your Name"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="themeTarget" className="block text-sm font-medium text-gray-700">Theme Target</label>
        <select
          id="themeTarget"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
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

      <div className="mb-4">
        <label htmlFor="backgroundImage" className="block text-sm font-medium text-gray-700">Background Image (1280x720 JPG)</label>
        <input
          type="file"
          id="backgroundImage"
          accept="image/jpeg"
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          onChange={handleImageChange}
        />
        {imageDimensions && (
          <p className="text-sm text-gray-600 mt-2">Original Dimensions: {imageDimensions.width}x{imageDimensions.height}</p>
        )}
        {imageError && (
          <div className="mt-2 p-2 text-sm text-red-700 bg-red-100 rounded-md">
            {imageError}
            {imageDimensions && (imageDimensions.width !== TARGET_WIDTH || imageDimensions.height !== TARGET_HEIGHT) && (
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => handleImageManipulation('resize')}
                  className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                >
                  Auto-Resize to {TARGET_WIDTH}x{TARGET_HEIGHT}
                </button>
                <button
                  onClick={() => handleImageManipulation('crop')}
                  className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                >
                  Center-Crop to {TARGET_WIDTH}x{TARGET_HEIGHT}
                </button>
              </div>
            )}
          </div>
        )}
        {imagePreviewUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
            <img src={imagePreviewUrl} alt="Background Preview" className="max-w-full h-auto rounded-md shadow" style={{ maxWidth: '1280px', maxHeight: '720px' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeConfig;
