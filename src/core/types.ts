export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type RotationState = 0 | 1 | 2 | 3;

export interface Coordinate {
  x: number;
  y: number;
}

export type CellMemoryState = 'normal' | 'leaked' | 'fragmented' | 'compacted' | 'rotting';

export interface MatrixCell {
  filled: boolean;
  color: string;
  type?: TetrominoType;
  state?: CellMemoryState;
  memoryAddress?: string;
  pid?: number;
}

export interface ActivePiece {
  type: TetrominoType;
  x: number;
  y: number;
  rotation: RotationState;
  allocationTag?: string;
  sizeKb?: number;
  pid?: number;
}

export type CurseType =
  | 'none'
  | 'fog_of_war'         // Memory Leak: uncollected pages blinding heap inspection
  | 'poltergeist_shift'  // Thread Interrupt: sudden CPU preemption displacing active pointer
  | 'soul_inversion'     // Heap Inversion: reversed memory growth (stack vs heap collision)
  | 'tombstone_crumble'; // Bit Rot: hardware ECC error crumbling memory pages

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
  exorcisms: number; // Major GC Compactions (4-line sweeps)
  tSpins: number;    // Precision Spin Insertions
  combos: number;
  maxCombo: number;
  backToBack: boolean;
  reclaimedKb: number;       // Total RAM reclaimed by GC sweeps
  fragmentationRatio: number;// % of allocated heap volume wasted in holes
  heapUsedKb: number;        // Current memory pressure
  heapMaxKb: number;         // OOM Kernel Panic threshold
  oomAlert: boolean;         // High memory pressure alert
  lastAction?: string;
}

export type DisplayTheme =
  | 'soviet_green'  // 1984 Elektronika-60 RAM Matrix
  | 'soviet_amber'  // 1989 MS-DOS DEFRAG Cluster Map (Norton SpeedDisk)
  | 'gothic_blood'  // Kubernetes Pod Chaos Stress Test
  | 'spectral_cyan';// AI Agent KV-Cache Defragmenter

export interface AgentChatMessage {
  id: string;
  sender: 'pajitnov' | 'poltergeist' | 'gravedigger' | 'system';
  name: string;
  text: string;
  timestamp: string;
  sentiment?: 'strategic' | 'taunt' | 'lore' | 'urgent';
}
