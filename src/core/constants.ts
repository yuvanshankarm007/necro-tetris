import { TetrominoType, RotationState, DisplayTheme } from './types';

export const BOARD_WIDTH = 10;
export const BOARD_VISIBLE_HEIGHT = 20;
export const BOARD_BUFFER_HEIGHT = 2;
export const BOARD_TOTAL_HEIGHT = BOARD_VISIBLE_HEIGHT + BOARD_BUFFER_HEIGHT; // 22

export const LOCK_DELAY_MS = 500;
export const MAX_LOCK_RESETS = 15;

// Tetromino 4x4 or 3x3 matrices for all 4 rotation states (0, 1, 2, 3)
export const TETROMINO_SHAPES: Record<TetrominoType, number[][][]> = {
  I: [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
  J: [
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],
  L: [
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
  O: [
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
  ],
  S: [
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  T: [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  Z: [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],
};

// Spawn offsets (X, Y) so pieces enter visibly at the top of the playfield
export const SPAWN_COORDINATES: Record<TetrominoType, { x: number; y: number }> = {
  I: { x: 3, y: 1 },
  J: { x: 3, y: 1 },
  L: { x: 3, y: 1 },
  O: { x: 4, y: 2 },
  S: { x: 3, y: 1 },
  T: { x: 3, y: 1 },
  Z: { x: 3, y: 1 },
};

// SRS Wall-Kick Offsets [dx, dy] where +y is UP in Tetris guideline math.
// When applying to board, board_y = current_y - kick_dy
export const WALL_KICK_DATA_JLSTZ: Record<string, [number, number][]> = {
  '0->1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '1->0': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  '1->2': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  '2->1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '2->3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '3->2': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '3->0': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '0->3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
};

export const WALL_KICK_DATA_I: Record<string, [number, number][]> = {
  '0->1': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
  '1->0': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
  '1->2': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
  '2->1': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
  '2->3': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
  '3->2': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
  '3->0': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
  '0->3': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
};

// Theme Color Palettes
export const THEME_CONFIG: Record<
  DisplayTheme,
  {
    name: string;
    bg: string;
    gridLine: string;
    primaryText: string;
    accentGlow: string;
    colors: Record<TetrominoType, string>;
    asciiBlock: string;
  }
> = {
  soviet_green: {
    name: '1984 Soviet Green (Elektronika 60)',
    bg: '#040b05',
    gridLine: 'rgba(51, 255, 102, 0.12)',
    primaryText: '#33ff66',
    accentGlow: 'rgba(51, 255, 102, 0.4)',
    asciiBlock: '[ ]',
    colors: {
      I: '#33ff66',
      J: '#27cc52',
      L: '#27cc52',
      O: '#44ff77',
      S: '#33ff66',
      T: '#20aa44',
      Z: '#33ff66',
    },
  },
  soviet_amber: {
    name: '1984 Soviet Amber (Elektronika 60)',
    bg: '#0e0802',
    gridLine: 'rgba(255, 170, 0, 0.12)',
    primaryText: '#ffaa00',
    accentGlow: 'rgba(255, 170, 0, 0.4)',
    asciiBlock: '[#]',
    colors: {
      I: '#ffaa00',
      J: '#e69900',
      L: '#e69900',
      O: '#ffbb22',
      S: '#ffaa00',
      T: '#cc8800',
      Z: '#ffaa00',
    },
  },
  gothic_blood: {
    name: 'Gothic Crypt (Blood & Tombstone)',
    bg: '#0a0305',
    gridLine: 'rgba(255, 42, 75, 0.12)',
    primaryText: '#ff2a4b',
    accentGlow: 'rgba(255, 42, 75, 0.45)',
    asciiBlock: '░▓',
    colors: {
      I: '#ff2a4b', // Crimson
      J: '#3b82f6', // Cobalt
      L: '#f97316', // Tomb Ember
      O: '#eab308', // Cursed Gold
      S: '#22c55e', // Venom
      T: '#a855f7', // Necro Purple
      Z: '#ef4444', // Blood Rune
    },
  },
  spectral_cyan: {
    name: 'Séance Ectoplasm (Spectral Ghost)',
    bg: '#02090d',
    gridLine: 'rgba(0, 240, 255, 0.12)',
    primaryText: '#00f0ff',
    accentGlow: 'rgba(0, 240, 255, 0.45)',
    asciiBlock: '◊♦',
    colors: {
      I: '#00f0ff',
      J: '#38bdf8',
      L: '#67e8f9',
      O: '#a5f3fc',
      S: '#2dd4bf',
      T: '#c084fc',
      Z: '#f43f5e',
    },
  },
};
