/**
 * Professional Tetris Input Handler (DAS, ARR & SDF)
 * Replicates the snappy, high-performance feel of Tetrio, Jstris, and Guideline Tetris.
 */

export interface InputCallbacks {
  onMoveLeft: () => boolean;
  onMoveRight: () => boolean;
  onSoftDrop: () => boolean;
  onHardDrop: () => void;
  onRotateCW: () => void;
  onRotateCCW: () => void;
  onHold: () => void;
  onPause: () => void;
}

export class TetrisInputHandler {
  // Timing constants (in ms)
  private readonly DAS = 135; // Delayed Auto Shift (initial delay before auto-repeat)
  private readonly ARR = 25;  // Auto Repeat Rate (frequency of lateral repeat)
  private readonly SDF_INTERVAL = 30; // Soft Drop repeat interval

  private callbacks: InputCallbacks;

  // Active key state
  private isLeftHeld = false;
  private isRightHeld = false;
  private isDownHeld = false;

  // Direction priority (last pressed direction takes priority)
  private activeDirection: 'left' | 'right' | null = null;
  private dasTimer: number | null = null;
  private arrTimer: number | null = null;
  private softDropTimer: number | null = null;

  constructor(callbacks: InputCallbacks) {
    this.callbacks = callbacks;
  }

  public handleKeyDown(e: KeyboardEvent): boolean {
    if (e.repeat) return false;

    // Prevent default scrolling on arrow keys and space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }

    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.isLeftHeld = true;
        this.activeDirection = 'left';
        this.callbacks.onMoveLeft();
        this.startDAS('left');
        return true;

      case 'ArrowRight':
      case 'KeyD':
        this.isRightHeld = true;
        this.activeDirection = 'right';
        this.callbacks.onMoveRight();
        this.startDAS('right');
        return true;

      case 'ArrowDown':
      case 'KeyS':
        if (!this.isDownHeld) {
          this.isDownHeld = true;
          this.callbacks.onSoftDrop();
          this.startSoftDrop();
        }
        return true;

      case 'ArrowUp':
      case 'KeyW':
      case 'KeyX':
        this.callbacks.onRotateCW();
        return true;

      case 'KeyZ':
      case 'ControlLeft':
      case 'ControlRight':
        this.callbacks.onRotateCCW();
        return true;

      case 'Space':
        this.callbacks.onHardDrop();
        return true;

      case 'KeyC':
      case 'ShiftLeft':
      case 'ShiftRight':
        this.callbacks.onHold();
        return true;

      case 'Escape':
      case 'KeyP':
        this.callbacks.onPause();
        return true;
    }

    return false;
  }

  public handleKeyUp(e: KeyboardEvent): void {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.isLeftHeld = false;
        if (this.activeDirection === 'left') {
          if (this.isRightHeld) {
            this.activeDirection = 'right';
            this.callbacks.onMoveRight();
            this.startDAS('right');
          } else {
            this.clearHorizontalTimers();
            this.activeDirection = null;
          }
        }
        break;

      case 'ArrowRight':
      case 'KeyD':
        this.isRightHeld = false;
        if (this.activeDirection === 'right') {
          if (this.isLeftHeld) {
            this.activeDirection = 'left';
            this.callbacks.onMoveLeft();
            this.startDAS('left');
          } else {
            this.clearHorizontalTimers();
            this.activeDirection = null;
          }
        }
        break;

      case 'ArrowDown':
      case 'KeyS':
        this.isDownHeld = false;
        this.stopSoftDrop();
        break;
    }
  }

  private startDAS(direction: 'left' | 'right'): void {
    this.clearHorizontalTimers();
    this.dasTimer = window.setTimeout(() => {
      this.startARR(direction);
    }, this.DAS);
  }

  private startARR(direction: 'left' | 'right'): void {
    this.clearARR();
    this.arrTimer = window.setInterval(() => {
      if (direction === 'left' && this.isLeftHeld) {
        this.callbacks.onMoveLeft();
      } else if (direction === 'right' && this.isRightHeld) {
        this.callbacks.onMoveRight();
      } else {
        this.clearARR();
      }
    }, this.ARR);
  }

  private startSoftDrop(): void {
    this.stopSoftDrop();
    this.softDropTimer = window.setInterval(() => {
      if (this.isDownHeld) {
        this.callbacks.onSoftDrop();
      } else {
        this.stopSoftDrop();
      }
    }, this.SDF_INTERVAL);
  }

  private stopSoftDrop(): void {
    if (this.softDropTimer !== null) {
      clearInterval(this.softDropTimer);
      this.softDropTimer = null;
    }
  }

  private clearHorizontalTimers(): void {
    if (this.dasTimer !== null) {
      clearTimeout(this.dasTimer);
      this.dasTimer = null;
    }
    this.clearARR();
  }

  private clearARR(): void {
    if (this.arrTimer !== null) {
      clearInterval(this.arrTimer);
      this.arrTimer = null;
    }
  }

  public reset(): void {
    this.isLeftHeld = false;
    this.isRightHeld = false;
    this.isDownHeld = false;
    this.activeDirection = null;
    this.clearHorizontalTimers();
    this.stopSoftDrop();
  }
}
