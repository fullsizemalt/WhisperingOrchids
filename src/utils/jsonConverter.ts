import type { LayoutElement } from '../types.js';

interface ThemeConfig {
  name: string;
  author: string;
  target: string;
}

interface NxthemeLayoutPatch {
  PaneName: string;
  Properties: {
    Position?: { X: number; Y: number };
    Size?: { Width: number; Height: number };
    Scale?: { X: number; Y: number };
    Rotation?: { X: number; Y: number; Z: number };
    Visible?: boolean;
    ColorTL?: string;
    ColorTR?: string;
    ColorBL?: string;
    ColorBR?: string;
    // Add other supported properties from CustomLayouts.md as needed
  };
}

interface NxthemeLayoutJson {
  FileName: string;
  Patches: NxthemeLayoutPatch[];
  _Disclaimer?: string; // Added disclaimer field
  _Message?: string; // Added message field
  // Add PushBackPanes and PullFrontPanes if implemented
}

const DISCLAIMER_MESSAGE = "This theme was created using a third-party tool. The creators of this tool do not endorse, support, or condone the creation or distribution of themes that promote hate speech, discrimination, violence, or any illegal or unethical content. Users are solely responsible for the content they create and distribute. Please be excellent to each other.";

export const convertLayoutElementsToJson = (elements: LayoutElement[], themeConfig: ThemeConfig): NxthemeLayoutJson => {
  const patches: NxthemeLayoutPatch[] = elements.map(el => {
    const properties: NxthemeLayoutPatch['Properties'] = {};

    if (el.position) {
      properties.Position = { X: el.position.x, Y: el.position.y };
    }
    if (el.size) {
      properties.Size = { Width: el.size.width, Height: el.size.height };
    }
    if (el.scale) {
      properties.Scale = { X: el.scale.x, Y: el.scale.y };
    }
    if (el.rotation) {
      properties.Rotation = { X: el.rotation.x, Y: el.rotation.y, Z: el.rotation.z };
    }
    if (el.visible !== undefined) {
      properties.Visible = el.visible;
    }

    // Apply color properties only for pic1 and txt1 types, as per CustomLayouts.md
    if ((el.type === 'pic1' || el.type === 'txt1') && el.color) {
      properties.ColorTL = el.color;
      properties.ColorTR = el.color;
      properties.ColorBL = el.color;
      properties.ColorBR = el.color;
    }

    return {
      PaneName: el.id,
      Properties: properties,
    };
  });

  // Determine FileName based on theme target
  let fileName: string;
  switch (themeConfig.target) {
    case 'Home Menu':
      fileName = 'qlaunch.bflyt';
      break;
    case 'Lockscreen':
      fileName = 'lockscreen.bflyt';
      break;
    case 'All Software':
      fileName = 'apps.bflyt';
      break;
    case 'System Settings':
      fileName = 'set.bflyt';
      break;
    case 'User Page':
      fileName = 'user.bflyt';
      break;
    case 'News':
      fileName = 'news.bflyt';
      break;
    case 'Player select applet':
      fileName = 'playerselect.bflyt'; // Educated guess for Player select applet
      break;
    default:
      fileName = 'qlaunch.bflyt'; // Default to Home Menu
  }

  return {
    FileName: fileName,
    Patches: patches,
    _Disclaimer: DISCLAIMER_MESSAGE, // Include the disclaimer in the metadata
    _Message: "Be excellent to each other.", // Include the positive message
  };
};