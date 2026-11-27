import {
  BOARD_WIDTH,
  BOARD_TOTAL_HEIGHT,
  BOARD_BUFFER_HEIGHT,
  SPAWN_COORDINATES,
  TETROMINO_SHAPES,
  LOCK_DELAY_MS,
  MAX_LOCK_RESETS,
  ALLOCATION_METADATA,
} from './constants';
import {
  TetrominoType,
  RotationState,
  MatrixCell,
  ActivePiece,
  GameStats,
  CurseType,
  ActiveCurse,
} from './types';
import { SevenBagRandomizer } from './randomizer';
import { isColliding, tryRotateSRS, calculateGhostY } from './srs';

export interface GameEngineState {
  matrix: MatrixCell[][];
  activePiece: ActivePiece | null;
  holdPiece: TetrominoType | null;
  canHold: boolean;
  nextPieces: TetrominoType[];
  stats: GameStats;
  gameOver: boolean;
  isPaused: boolean;
  activeCurse: ActiveCurse | null;
  lockTimer: number | null;
  lockResets: number;
  lastClearCount: number;
  shakeTrigger: number;
  lastActionText: string | null;
}

export class GameEngine {
  private randomizer: SevenBagRandomizer;
  public state: GameEngineState;
  private lastMoveWasRotate: boolean = false;
  private lastDropTime: number = 0;

  constructor() {
    this.randomizer = new SevenBagRandomizer();
    this.state = this.getInitialState();
  }

  public getInitialState(): GameEngineState {
    this.randomizer.reset();
    return {
      matrix: this.createEmptyMatrix(),
      activePiece: null,
      holdPiece: null,
      canHold: true,
      nextPieces: this.randomizer.peek(5),
      stats: {
        score: 0,
        lines: 0,
        level: 1,
        exorcisms: 0,
        tSpins: 0,
        combos: 0,
        maxCombo: 0,
        backToBack: false,
        reclaimedKb: 0,
        fragmentationRatio: 0,
        heapUsedKb: 0,
        heapMaxKb: 25600,
        oomAlert: false,
        lastAction: undefined,
      },
      gameOver: false,
      isPaused: false,
      activeCurse: null,
      lockTimer: null,
      lockResets: 0,
      lastClearCount: 0,
      shakeTrigger: 0,
      lastActionText: null,
    };
  }

  public createEmptyMatrix(): MatrixCell[][] {
    const matrix: MatrixCell[][] = [];
    for (let y = 0; y < BOARD_TOTAL_HEIGHT; y++) {
      const row: MatrixCell[] = [];
      for (let x = 0; x < BOARD_WIDTH; x++) {
        row.push({ filled: false, color: '', state: 'normal' });
      }
      matrix.push(row);
    }
    return matrix;
  }

  public start(): void {
    this.state = this.getInitialState();
    this.lastDropTime = performance.now();
    this.spawnNextPiece();
  }

  public isTouchingGround(): boolean {
    if (!this.state.activePiece) return false;
    const piece = this.state.activePiece;
    const stepY = this.state.activeCurse?.type === 'soul_inversion' ? -1 : 1;
    return isColliding(this.state.matrix, piece.type, piece.rotation, piece.x, piece.y + stepY);
  }

  public spawnNextPiece(): boolean {
    const type = this.randomizer.next();
    this.state.nextPieces = this.randomizer.peek(5);
    const spawnPos = SPAWN_COORDINATES[type];
    const meta = ALLOCATION_METADATA[type];
    const randomPid = 1000 + Math.floor(Math.random() * 8999);

    const piece: ActivePiece = {
      type,
      x: spawnPos.x,
      y: spawnPos.y,
      rotation: 0,
      allocationTag: meta.tag,
      sizeKb: meta.sizeKb,
      pid: randomPid,
    };

    this.lastMoveWasRotate = false;
    this.lastDropTime = performance.now();

    // If immediately blocked at spawn, game over (Block Out)
    if (isColliding(this.state.matrix, piece.type, piece.rotation, piece.x, piece.y)) {
      this.state.gameOver = true;
      this.state.activePiece = null;
      return false;
    }

    this.state.activePiece = piece;
    this.state.canHold = true;
    this.state.lockTimer = null;
    this.state.lockResets = 0;
    return true;
  }

  public moveLeft(): boolean {
    if (!this.state.activePiece || this.state.gameOver || this.state.isPaused) return false;
    const piece = this.state.activePiece;
    if (!isColliding(this.state.matrix, piece.type, piece.rotation, piece.x - 1, piece.y)) {
      piece.x--;
      this.lastMoveWasRotate = false;
      this.handleLockDelayReset();
      return true;
    }
    return false;
  }

  public moveRight(): boolean {
    if (!this.state.activePiece || this.state.gameOver || this.state.isPaused) return false;
    const piece = this.state.activePiece;
    if (!isColliding(this.state.matrix, piece.type, piece.rotation, piece.x + 1, piece.y)) {
      piece.x++;
      this.lastMoveWasRotate = false;
      this.handleLockDelayReset();
      return true;
    }
    return false;
  }

  public rotate(direction: 'clockwise' | 'counterclockwise' = 'clockwise'): boolean {
    if (!this.state.activePiece || this.state.gameOver || this.state.isPaused) return false;
    const result = tryRotateSRS(this.state.matrix, this.state.activePiece, direction);
    if (result.success) {
      this.state.activePiece = result.piece;
      this.lastMoveWasRotate = true;
      this.handleLockDelayReset();
      return true;
    }
    return false;
  }

  public softDrop(): boolean {
    if (!this.state.activePiece || this.state.gameOver || this.state.isPaused) return false;
    const piece = this.state.activePiece;

    // Check inverted gravity curse
    const stepY = this.state.activeCurse?.type === 'soul_inversion' ? -1 : 1;

    if (!isColliding(this.state.matrix, piece.type, piece.rotation, piece.x, piece.y + stepY)) {
      piece.y += stepY;
      this.state.stats.score += 1; // 1 point per soft drop cell
      this.lastMoveWasRotate = false;
      this.lastDropTime = performance.now();

      // If it now touches ground, start lock delay
      if (this.isTouchingGround() && this.state.lockTimer === null) {
        this.state.lockTimer = performance.now();
      }
      return true;
    } else {
      // Resting on ground
      if (this.state.lockTimer === null) {
        this.state.lockTimer = performance.now();
      }
      return false;
    }
  }

  public hardDrop(): number {
    if (!this.state.activePiece || this.state.gameOver || this.state.isPaused) return 0;
    const piece = this.state.activePiece;
    const ghostY = calculateGhostY(this.state.matrix, piece);
    const dropDistance = ghostY - piece.y;

    piece.y = ghostY;
    this.state.stats.score += dropDistance * 2; // 2 points per hard drop cell
    this.state.shakeTrigger = performance.now();

    this.lockActivePiece();
    return dropDistance;
  }

  public hold(): boolean {
    if (!this.state.activePiece || !this.state.canHold || this.state.gameOver || this.state.isPaused) {
      return false;
    }

    const currentType = this.state.activePiece.type;
    if (this.state.holdPiece === null) {
      this.state.holdPiece = currentType;
      this.spawnNextPiece();
    } else {
      const swappedType = this.state.holdPiece;
      this.state.holdPiece = currentType;
      const spawnPos = SPAWN_COORDINATES[swappedType];
      const meta = ALLOCATION_METADATA[swappedType];
      this.state.activePiece = {
        type: swappedType,
        x: spawnPos.x,
        y: spawnPos.y,
        rotation: 0,
        allocationTag: meta.tag,
        sizeKb: meta.sizeKb,
        pid: 1000 + Math.floor(Math.random() * 8999),
      };
      this.lastMoveWasRotate = false;
      this.lastDropTime = performance.now();
    }

    this.state.canHold = false;
    this.state.lockTimer = null;
    this.state.lockResets = 0;
    return true;
  }

  private handleLockDelayReset(): void {
    if (this.isTouchingGround()) {
      if (this.state.lockResets < MAX_LOCK_RESETS) {
        this.state.lockResets++;
        this.state.lockTimer = performance.now();
      }
    } else {
      // In air: reset lock timer until it touches ground again
      this.state.lockTimer = null;
    }
  }

  /**
   * Main game loop update called at 60 FPS.
   * Handles natural gravity drop and precise lock delay countdown.
   */
  public update(now: number): boolean {
    if (!this.state.activePiece || this.state.gameOver || this.state.isPaused) return false;

    let stateChanged = false;
    const isGround = this.isTouchingGround();

    // 1. Lock Delay Management (Guideline Extended Lock Delay)
    if (isGround) {
      if (this.state.lockTimer === null) {
        this.state.lockTimer = now;
      } else if (now - this.state.lockTimer >= LOCK_DELAY_MS) {
        this.lockActivePiece();
        return true;
      }
    } else {
      // In the air: clear lock timer
      this.state.lockTimer = null;
    }

    // 2. Natural Gravity Fall
    const dropInterval = this.getDropInterval();
    if (now - this.lastDropTime >= dropInterval) {
      this.lastDropTime = now;
      if (!isGround) {
        const stepY = this.state.activeCurse?.type === 'soul_inversion' ? -1 : 1;
        this.state.activePiece.y += stepY;
        this.lastMoveWasRotate = false;
        stateChanged = true;

        // Check if now landed
        if (this.isTouchingGround()) {
          this.state.lockTimer = now;
        }
      }
    }

    return stateChanged;
  }

  /**
   * Official Tetris Guideline 3-Corner T-Spin Detection
   */
  private checkTSpin(piece: ActivePiece): { isTSpin: boolean; isMini: boolean } {
    if (piece.type !== 'T' || !this.lastMoveWasRotate) {
      return { isTSpin: false, isMini: false };
    }

    // Center of 3x3 T-piece
    const cx = piece.x + 1;
    const cy = piece.y + 1;
    const corners = [
      { x: cx - 1, y: cy - 1 },
      { x: cx + 1, y: cy - 1 },
      { x: cx - 1, y: cy + 1 },
      { x: cx + 1, y: cy + 1 },
    ];

    let occupied = 0;
    for (const c of corners) {
      if (
        c.x < 0 ||
        c.x >= BOARD_WIDTH ||
        c.y >= BOARD_TOTAL_HEIGHT ||
        (c.y >= 0 && this.state.matrix[c.y][c.x]?.filled)
      ) {
        occupied++;
      }
    }

    if (occupied >= 3) {
      return { isTSpin: true, isMini: false };
    }
    return { isTSpin: false, isMini: false };
  }

  public lockActivePiece(): void {
    if (!this.state.activePiece) return;
    const piece = this.state.activePiece;
    const shape = TETROMINO_SHAPES[piece.type][piece.rotation];
    const size = shape.length;

    // Check T-Spin before committing to matrix
    const tspin = this.checkTSpin(piece);

    // Check if blocks should rot from tombstone curse
    const cellState =
      this.state.activeCurse?.type === 'tombstone_crumble' ? 'rotting' : 'normal';

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (shape[r][c] !== 0) {
          const boardX = piece.x + c;
          const boardY = piece.y + r;
          if (
            boardY >= 0 &&
            boardY < BOARD_TOTAL_HEIGHT &&
            boardX >= 0 &&
            boardX < BOARD_WIDTH
          ) {
            this.state.matrix[boardY][boardX] = {
              filled: true,
              color: piece.type,
              type: piece.type,
              state: cellState,
              memoryAddress: `0x${((boardY * 16) + boardX).toString(16).toUpperCase().padStart(4, '0')}`,
              pid: piece.pid,
            };
          }
        }
      }
    }

    // Check for line clears with T-Spin bonus
    this.clearLines(tspin.isTSpin);

    // Recompute real-time heap defragmentation metrics
    this.recomputeHeapMetrics();

    // Spawn next piece
    this.spawnNextPiece();
  }

  public recomputeHeapMetrics(): void {
    let occupied = 0;
    let holes = 0;

    for (let x = 0; x < BOARD_WIDTH; x++) {
      let blockSeen = false;
      for (let y = BOARD_BUFFER_HEIGHT; y < BOARD_TOTAL_HEIGHT; y++) {
        if (this.state.matrix[y][x].filled) {
          blockSeen = true;
          occupied++;
        } else if (blockSeen) {
          holes++;
        }
      }
    }

    const total = occupied + holes;
    this.state.stats.fragmentationRatio = total > 0 ? Math.round((holes / total) * 100) : 0;
    this.state.stats.heapUsedKb = occupied * 128;
    this.state.stats.oomAlert =
      (this.state.stats.heapUsedKb / this.state.stats.heapMaxKb) > 0.78 ||
      this.getHighestFilledRow() <= 5;
  }

  public clearLines(isTSpin: boolean = false): number {
    let clearedCount = 0;
    const newMatrix: MatrixCell[][] = [];

    // Scan from bottom to top
    for (let y = BOARD_TOTAL_HEIGHT - 1; y >= 0; y--) {
      const isRowFull = this.state.matrix[y].every((cell) => cell.filled);
      if (isRowFull) {
        clearedCount++;
      } else {
        newMatrix.unshift([...this.state.matrix[y]]);
      }
    }

    // Insert new empty rows at the top
    while (newMatrix.length < BOARD_TOTAL_HEIGHT) {
      const emptyRow: MatrixCell[] = [];
      for (let x = 0; x < BOARD_WIDTH; x++) {
        emptyRow.push({ filled: false, color: '', state: 'normal' });
      }
      newMatrix.unshift(emptyRow);
    }

    this.state.matrix = newMatrix;
    this.state.lastClearCount = clearedCount;

    if (clearedCount > 0 || isTSpin) {
      this.applyScoring(clearedCount, isTSpin);

      // Exorcism event: 4 lines cleared banishes active curses!
      if (clearedCount === 4) {
        this.state.stats.exorcisms++;
        if (this.state.activeCurse) {
          this.state.activeCurse = null; // Purged!
        }
      }
    } else {
      this.state.stats.combos = 0;
    }

    return clearedCount;
  }

  private applyScoring(lines: number, isTSpin: boolean): void {
    const level = this.state.stats.level;
    let baseScore = 0;
    let actionName = '';

    if (isTSpin) {
      this.state.stats.tSpins++;
      if (lines === 0) {
        baseScore = 400 * level;
        actionName = 'T-SPIN';
      } else if (lines === 1) {
        baseScore = 800 * level;
        actionName = 'T-SPIN SINGLE';
      } else if (lines === 2) {
        baseScore = 1200 * level;
        actionName = 'T-SPIN DOUBLE';
      } else if (lines === 3) {
        baseScore = 1600 * level;
        actionName = 'T-SPIN TRIPLE';
      }

      if (this.state.stats.backToBack && lines > 0) {
        baseScore = Math.floor(baseScore * 1.5);
        actionName = `B2B ${actionName}`;
      }
      if (lines > 0) this.state.stats.backToBack = true;
    } else {
      switch (lines) {
        case 1:
          baseScore = 100 * level;
          actionName = 'SINGLE';
          this.state.stats.backToBack = false;
          break;
        case 2:
          baseScore = 300 * level;
          actionName = 'DOUBLE';
          this.state.stats.backToBack = false;
          break;
        case 3:
          baseScore = 500 * level;
          actionName = 'TRIPLE';
          this.state.stats.backToBack = false;
          break;
        case 4:
          // Exorcism (Tetris 4-Line Clear)
          baseScore = 800 * level;
          actionName = 'EXORCISM 4-LINE';
          if (this.state.stats.backToBack) {
            baseScore = Math.floor(baseScore * 1.5);
            actionName = 'B2B EXORCISM';
          }
          this.state.stats.backToBack = true;
          break;
      }
    }

    if (lines > 0) {
      // Reclaim heap RAM per compacted line
      const reclaimed = lines === 4 ? 5120 : lines * 1024;
      this.state.stats.reclaimedKb += reclaimed;

      // Combo multiplier
      this.state.stats.combos++;
      if (this.state.stats.combos > this.state.stats.maxCombo) {
        this.state.stats.maxCombo = this.state.stats.combos;
      }
      const comboBonus = 50 * this.state.stats.combos * level;
      this.state.stats.score += baseScore + comboBonus;
      this.state.stats.lines += lines;
      this.state.stats.level = Math.floor(this.state.stats.lines / 10) + 1;
    } else if (baseScore > 0) {
      this.state.stats.score += baseScore;
    }

    this.state.lastActionText = actionName;
    this.state.stats.lastAction = actionName;
  }

  public applyCurse(curse: CurseType): void {
    if (curse === 'none') {
      this.state.activeCurse = null;
      return;
    }

    const curseMetadata: Record<
      Exclude<CurseType, 'none'>,
      { name: string; description: string; durationMs: number }
    > = {
      fog_of_war: {
        name: 'Graveyard Fog',
        description: 'Dense supernatural mist obscures the bottom 8 rows!',
        durationMs: 12000,
      },
      poltergeist_shift: {
        name: 'Poltergeist Shift',
        description: 'Telekinetic tremor randomly shoves active pieces!',
        durationMs: 8000,
      },
      soul_inversion: {
        name: 'Soul Inversion',
        description: 'Gravitational vortex flips pull upwards!',
        durationMs: 7000,
      },
      tombstone_crumble: {
        name: 'Tombstone Crumble',
        description: 'Placed blocks become brittle bone debris!',
        durationMs: 10000,
      },
    };

    const meta = curseMetadata[curse];
    this.state.activeCurse = {
      type: curse,
      name: meta.name,
      description: meta.description,
      durationMs: meta.durationMs,
    };

    if (curse === 'poltergeist_shift' && this.state.activePiece) {
      const dir = Math.random() > 0.5 ? 1 : -1;
      if (dir === 1) this.moveRight();
      else this.moveLeft();
    }
  }

  public getDropInterval(): number {
    const level = this.state.stats.level;
    // Authentic Guideline speed curve: starts around 800ms, drops smoothly
    const baseMs = Math.max(65, Math.pow(0.8 - (level - 1) * 0.007, level - 1) * 1000);
    return Math.floor(baseMs);
  }

  public getHighestFilledRow(): number {
    for (let y = 0; y < BOARD_TOTAL_HEIGHT; y++) {
      if (this.state.matrix[y].some((cell) => cell.filled)) {
        return y;
      }
    }
    return BOARD_TOTAL_HEIGHT;
  }
}
