import type { LayoutElement } from '../types.js';

export interface ScreenshotData {
  id: string;
  target: string;
  variant: string;
  path: string;
  width: number;
  height: number;
  elements?: ElementMap[];
}

export interface ElementMap {
  elementId: string;
  region: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  type: 'pane' | 'pic1' | 'txt1';
}

// Screenshot registry for different Switch interface targets
export const SCREENSHOT_REGISTRY: Record<string, ScreenshotData[]> = {
  'Home Menu': [
    {
      id: 'home-menu-default',
      target: 'Home Menu',
      variant: 'default',
      path: '/screenshots/switch/home-menu/default.png',
      width: 1280,
      height: 720,
      elements: [
        {
          elementId: 'N_GameRoot',
          region: { x: 0, y: 0, width: 1280, height: 720 },
          type: 'pane'
        },
        {
          elementId: 'N_ScrollWindow',
          region: { x: 0, y: 100, width: 1280, height: 500 },
          type: 'pane'
        },
        {
          elementId: 'N_Game',
          region: { x: 50, y: 150, width: 200, height: 200 },
          type: 'pane'
        },
        {
          elementId: 'N_Icon_00',
          region: { x: 60, y: 160, width: 180, height: 180 },
          type: 'pic1'
        },
        {
          elementId: 'SystemSettingsButton',
          region: { x: 1000, y: 600, width: 80, height: 80 },
          type: 'pic1'
        }
      ]
    }
  ],
  'Lockscreen': [
    {
      id: 'lockscreen-default',
      target: 'Lockscreen',
      variant: 'default',
      path: '/screenshots/switch/lockscreen/default.png',
      width: 1280,
      height: 720,
      elements: [
        {
          elementId: 'RootPane',
          region: { x: 0, y: 0, width: 1280, height: 720 },
          type: 'pane'
        },
        {
          elementId: 'N_DateTime',
          region: { x: 640, y: 360, width: 400, height: 100 },
          type: 'txt1'
        },
        {
          elementId: 'N_BatteryIcon',
          region: { x: 1200, y: 50, width: 50, height: 25 },
          type: 'pic1'
        }
      ]
    }
  ],
  'All Software': [
    {
      id: 'all-software-default',
      target: 'All Software',
      variant: 'default',
      path: '/screenshots/switch/all-software/default.png',
      width: 1280,
      height: 720
    }
  ],
  'System Settings': [
    {
      id: 'system-settings-default',
      target: 'System Settings',
      variant: 'default',
      path: '/screenshots/switch/system-settings/default.png',
      width: 1280,
      height: 720
    }
  ],
  'User Page': [
    {
      id: 'user-page-default',
      target: 'User Page',
      variant: 'default',
      path: '/screenshots/switch/user-page/default.png',
      width: 1280,
      height: 720
    }
  ],
  'News': [
    {
      id: 'news-default',
      target: 'News',
      variant: 'default',
      path: '/screenshots/switch/news/default.png',
      width: 1280,
      height: 720
    }
  ],
  'Player select applet': [
    {
      id: 'player-select-default',
      target: 'Player select applet',
      variant: 'default',
      path: '/screenshots/switch/player-select/default.png',
      width: 1280,
      height: 720
    }
  ]
};

/**
 * Get available screenshots for a specific theme target
 */
export const getScreenshotsForTarget = (target: string): ScreenshotData[] => {
  return SCREENSHOT_REGISTRY[target] || [];
};

/**
 * Get the default screenshot for a theme target
 */
export const getDefaultScreenshot = (target: string): ScreenshotData | null => {
  const screenshots = getScreenshotsForTarget(target);
  return screenshots.find(s => s.variant === 'default') || screenshots[0] || null;
};

/**
 * Check if a screenshot image exists
 */
export const checkScreenshotExists = async (screenshot: ScreenshotData): Promise<boolean> => {
  try {
    const response = await fetch(screenshot.path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Load screenshot image with proper error handling
 */
export const loadScreenshotImage = (screenshot: ScreenshotData): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load screenshot: ${screenshot.path}`));

    img.src = screenshot.path;
  });
};

/**
 * Extract element from screenshot using white background
 */
export const extractElementFromScreenshot = async (
  screenshot: ScreenshotData,
  elementMap: ElementMap
): Promise<ImageData | null> => {
  try {
    const img = await loadScreenshotImage(screenshot);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = elementMap.region.width;
    canvas.height = elementMap.region.height;

    // Draw the cropped region
    ctx.drawImage(
      img,
      elementMap.region.x,
      elementMap.region.y,
      elementMap.region.width,
      elementMap.region.height,
      0,
      0,
      elementMap.region.width,
      elementMap.region.height
    );

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  } catch {
    return null;
  }
};

/**
 * Get element at specific coordinates in screenshot
 */
export const getElementAtPosition = (
  screenshot: ScreenshotData,
  x: number,
  y: number
): ElementMap | null => {
  if (!screenshot.elements) return null;

  return screenshot.elements.find(element => {
    const { region } = element;
    return x >= region.x &&
           x <= region.x + region.width &&
           y >= region.y &&
           y <= region.y + region.height;
  }) || null;
};

/**
 * Convert layout elements to overlay positions
 */
export const layoutToOverlay = (
  elements: LayoutElement[],
  screenshot: ScreenshotData,
  scale: number = 1
): Array<LayoutElement & { overlayPosition: { x: number; y: number } }> => {
  return elements.map(element => {
    const overlayPosition = {
      x: element.position.x * scale,
      y: element.position.y * scale
    };

    return {
      ...element,
      overlayPosition
    };
  });
};

/**
 * Validate screenshot dimensions
 */
export const validateScreenshot = (img: HTMLImageElement): boolean => {
  return img.width === 1280 && img.height === 720;
};

/**
 * Create element mask for precise overlay
 */
export const createElementMask = async (
  screenshot: ScreenshotData,
  elementMap: ElementMap,
  threshold: number = 250
): Promise<HTMLCanvasElement | null> => {
  try {
    const imageData = await extractElementFromScreenshot(screenshot, elementMap);
    if (!imageData) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = elementMap.region.width;
    canvas.height = elementMap.region.height;

    const data = imageData.data;
    const maskData = new ImageData(imageData.width, imageData.height);

    // Create mask based on white background detection
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Check if pixel is close to white
      const isWhite = r > threshold && g > threshold && b > threshold;

      if (isWhite) {
        // Make transparent
        maskData.data[i] = 0;
        maskData.data[i + 1] = 0;
        maskData.data[i + 2] = 0;
        maskData.data[i + 3] = 0;
      } else {
        // Keep original pixel
        maskData.data[i] = r;
        maskData.data[i + 1] = g;
        maskData.data[i + 2] = b;
        maskData.data[i + 3] = a;
      }
    }

    ctx.putImageData(maskData, 0, 0);
    return canvas;
  } catch {
    return null;
  }
};