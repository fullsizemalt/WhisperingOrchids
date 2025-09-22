import type { LayoutElement } from '../types.js';

export interface ThemeTemplate {
  id: string;
  name: string;
  description: string;
  target: string;
  author: string;
  category: 'minimal' | 'gaming' | 'artistic' | 'functional' | 'accessibility';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  elements: LayoutElement[];
  preview?: string;
  tags: string[];
}

export const THEME_TEMPLATES: ThemeTemplate[] = [
  {
    id: 'minimal-home',
    name: 'Minimal Home',
    description: 'Clean, minimal home menu with essential elements only',
    target: 'Home Menu',
    author: 'WhisperingOrchids Team',
    category: 'minimal',
    difficulty: 'beginner',
    tags: ['clean', 'simple', 'modern'],
    elements: [
      {
        id: 'N_GameRoot',
        type: 'pane',
        position: { x: 0, y: 0 },
        size: { width: 1280, height: 720 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#1a1a1a'
      },
      {
        id: 'N_ScrollWindow',
        type: 'pane',
        position: { x: 40, y: 120 },
        size: { width: 1200, height: 480 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: 'transparent'
      },
      {
        id: 'N_Game',
        type: 'pane',
        position: { x: 60, y: 160 },
        size: { width: 180, height: 180 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#333333'
      },
      {
        id: 'N_Icon_00',
        type: 'pic1',
        position: { x: 70, y: 170 },
        size: { width: 160, height: 160 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#555555'
      }
    ]
  },
  {
    id: 'gaming-focused-home',
    name: 'Gaming Hub',
    description: 'Emphasizes game icons with vibrant colors and glow effects',
    target: 'Home Menu',
    author: 'WhisperingOrchids Team',
    category: 'gaming',
    difficulty: 'intermediate',
    tags: ['gaming', 'colorful', 'neon', 'glow'],
    elements: [
      {
        id: 'N_GameRoot',
        type: 'pane',
        position: { x: 0, y: 0 },
        size: { width: 1280, height: 720 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#0a0a0a'
      },
      {
        id: 'N_ScrollWindow',
        type: 'pane',
        position: { x: 0, y: 80 },
        size: { width: 1280, height: 560 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#1a1a2e'
      },
      {
        id: 'N_Game',
        type: 'pane',
        position: { x: 50, y: 140 },
        size: { width: 220, height: 220 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#16213e'
      },
      {
        id: 'N_Icon_00',
        type: 'pic1',
        position: { x: 65, y: 155 },
        size: { width: 190, height: 190 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#0f3460'
      },
      {
        id: 'RdtBtnIconGame',
        type: 'pane',
        position: { x: 45, y: 135 },
        size: { width: 230, height: 230 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#e94560'
      }
    ]
  },
  {
    id: 'accessibility-high-contrast',
    name: 'High Contrast Accessible',
    description: 'High contrast theme optimized for accessibility and visibility',
    target: 'Home Menu',
    author: 'WhisperingOrchids Team',
    category: 'accessibility',
    difficulty: 'beginner',
    tags: ['accessibility', 'high-contrast', 'readable', 'clear'],
    elements: [
      {
        id: 'N_GameRoot',
        type: 'pane',
        position: { x: 0, y: 0 },
        size: { width: 1280, height: 720 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#000000'
      },
      {
        id: 'N_ScrollWindow',
        type: 'pane',
        position: { x: 20, y: 100 },
        size: { width: 1240, height: 520 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#ffffff'
      },
      {
        id: 'N_Game',
        type: 'pane',
        position: { x: 40, y: 140 },
        size: { width: 200, height: 200 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#000000'
      },
      {
        id: 'N_Icon_00',
        type: 'pic1',
        position: { x: 50, y: 150 },
        size: { width: 180, height: 180 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#ffff00'
      }
    ]
  },
  {
    id: 'artistic-gradient',
    name: 'Gradient Flow',
    description: 'Artistic layout with flowing gradients and creative positioning',
    target: 'Home Menu',
    author: 'WhisperingOrchids Team',
    category: 'artistic',
    difficulty: 'advanced',
    tags: ['artistic', 'gradient', 'creative', 'modern'],
    elements: [
      {
        id: 'N_GameRoot',
        type: 'pane',
        position: { x: 0, y: 0 },
        size: { width: 1280, height: 720 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#2d1b69'
      },
      {
        id: 'N_ScrollWindow',
        type: 'pane',
        position: { x: 100, y: 50 },
        size: { width: 1080, height: 620 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: -2 },
        visible: true,
        color: '#11998e'
      },
      {
        id: 'N_Game',
        type: 'pane',
        position: { x: 200, y: 200 },
        size: { width: 180, height: 180 },
        scale: { x: 1.1, y: 1.1 },
        rotation: { x: 0, y: 0, z: 5 },
        visible: true,
        color: '#38ef7d'
      },
      {
        id: 'N_Icon_00',
        type: 'pic1',
        position: { x: 210, y: 210 },
        size: { width: 160, height: 160 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: -3 },
        visible: true,
        color: '#ff6b6b'
      }
    ]
  },
  {
    id: 'functional-grid',
    name: 'Organized Grid',
    description: 'Highly functional grid layout for power users',
    target: 'Home Menu',
    author: 'WhisperingOrchids Team',
    category: 'functional',
    difficulty: 'intermediate',
    tags: ['functional', 'grid', 'organized', 'efficient'],
    elements: [
      {
        id: 'N_GameRoot',
        type: 'pane',
        position: { x: 0, y: 0 },
        size: { width: 1280, height: 720 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#2c3e50'
      },
      {
        id: 'N_ScrollWindow',
        type: 'pane',
        position: { x: 40, y: 40 },
        size: { width: 1200, height: 640 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#34495e'
      },
      // Grid of game icons
      {
        id: 'N_Game',
        type: 'pane',
        position: { x: 60, y: 80 },
        size: { width: 160, height: 160 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#3498db'
      },
      {
        id: 'N_Icon_00',
        type: 'pic1',
        position: { x: 70, y: 90 },
        size: { width: 140, height: 140 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#e74c3c'
      },
      // Additional grid items
      {
        id: 'N_Game_01',
        type: 'pane',
        position: { x: 240, y: 80 },
        size: { width: 160, height: 160 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#3498db'
      },
      {
        id: 'N_Game_02',
        type: 'pane',
        position: { x: 420, y: 80 },
        size: { width: 160, height: 160 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#3498db'
      }
    ]
  },
  {
    id: 'minimal-lockscreen',
    name: 'Clean Lockscreen',
    description: 'Minimal and elegant lockscreen design',
    target: 'Lockscreen',
    author: 'WhisperingOrchids Team',
    category: 'minimal',
    difficulty: 'beginner',
    tags: ['clean', 'minimal', 'elegant'],
    elements: [
      {
        id: 'RootPane',
        type: 'pane',
        position: { x: 0, y: 0 },
        size: { width: 1280, height: 720 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#1a1a1a'
      },
      {
        id: 'N_DateTime',
        type: 'txt1',
        position: { x: 440, y: 310 },
        size: { width: 400, height: 100 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#ffffff'
      },
      {
        id: 'N_BatteryIcon',
        type: 'pic1',
        position: { x: 1180, y: 40 },
        size: { width: 60, height: 30 },
        scale: { x: 1, y: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        visible: true,
        color: '#00ff00'
      }
    ]
  }
];

export function getTemplatesByCategory(category: ThemeTemplate['category']): ThemeTemplate[] {
  return THEME_TEMPLATES.filter(template => template.category === category);
}

export function getTemplatesByTarget(target: string): ThemeTemplate[] {
  return THEME_TEMPLATES.filter(template => template.target === target);
}

export function getTemplatesByDifficulty(difficulty: ThemeTemplate['difficulty']): ThemeTemplate[] {
  return THEME_TEMPLATES.filter(template => template.difficulty === difficulty);
}

export function searchTemplates(query: string): ThemeTemplate[] {
  const searchTerm = query.toLowerCase();
  return THEME_TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(searchTerm) ||
    template.description.toLowerCase().includes(searchTerm) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export function getPopularTemplates(): ThemeTemplate[] {
  // Return beginner-friendly and popular templates
  return THEME_TEMPLATES.filter(template =>
    template.difficulty === 'beginner' ||
    template.category === 'minimal' ||
    template.category === 'gaming'
  );
}