export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type RotationState = 0 | 1 | 2 | 3; // 0 = 0 deg, 1 = 90 deg (R), 2 = 180 deg (2), 3 = 270 deg (L)

export interface Coordinate {
  x: number;
  y: number;
}

export type CellCurseState = 'normal' | 'tombstone' | 'haunted' | 'rotting';

export interface MatrixCell {
  filled: boolean;
  color: string;
  type?: TetrominoType;
  state?: CellCurseState;
}

export interface ActivePiece {
  type: TetrominoType;
  x: number;
  y: number;
  rotation: RotationState;
}

export type CurseType = 'none' | 'fog_of_war' | 'poltergeist_shift' | 'soul_inversion' | 'tombstone_crumble';

export interface ActiveCurse {
  type: CurseType;
  durationMs: number;
  name: string;
  description: string;
}

export interface GameStats {
  score: number;
  lines: number;
  level: number;
  exorcisms: number; // 4-line clears
  tSpins: number;
  combos: number;
  maxCombo: number;
  backToBack: boolean;
  lastAction?: string;
}

export type DisplayTheme = 'soviet_green' | 'soviet_amber' | 'gothic_blood' | 'spectral_cyan';

export interface AgentChatMessage {
  id: string;
  sender: 'pajitnov' | 'poltergeist' | 'gravedigger' | 'system';
  name: string;
  text: string;
  timestamp: string;
  sentiment?: 'strategic' | 'taunt' | 'lore' | 'urgent';
}
