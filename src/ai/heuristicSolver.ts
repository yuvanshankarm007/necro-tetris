/**
 * Pierre Dellacherie Heuristic Tetris Solver
 * Enables Dr. Alexey's Ghost to evaluate optimal board placements in real-time,
 * provide tactical advice, or play autonomously in Auto-Play mode.
 */

import {
  BOARD_WIDTH,
  BOARD_TOTAL_HEIGHT,
  TETROMINO_SHAPES,
} from '../core/constants';
import { TetrominoType, RotationState, MatrixCell, ActivePiece } from '../core/types';
import { isColliding, calculateGhostY } from '../core/srs';

export interface MoveRecommendation {
  rotation: RotationState;
  targetX: number;
  score: number;
  explanation: string;
}

export class HeuristicSolver {
  // Pierre Dellacherie evaluation weights
  private weightLandingHeight = -4.5;
  private weightCompletedLines = 34.0;
  private weightRowTransitions = -3.2;
  private weightColTransitions = -9.3;
  private weightHoles = -79.0;
  private weightWellSums = -3.4;

  public findBestMove(
    matrix: MatrixCell[][],
    type: TetrominoType
  ): MoveRecommendation | null {
    let bestMove: MoveRecommendation | null = null;
    let highestScore = -Infinity;

    const rotations: RotationState[] = type === 'O' ? [0] : [0, 1, 2, 3];

    for (const rot of rotations) {
      const shape = TETROMINO_SHAPES[type][rot];
      const shapeWidth = shape[0].length;

      // Scan horizontal columns
      for (let testX = -2; testX < BOARD_WIDTH; testX++) {
        // Check if spawn/rotation is initially valid at top
        if (!isColliding(matrix, type, rot, testX, 0)) {
          const testPiece: ActivePiece = {
            type,
            rotation: rot,
            x: testX,
            y: 0,
          };

          const landingY = calculateGhostY(matrix, testPiece);
          const simulated = this.simulatePlacement(matrix, testPiece, landingY);

          if (simulated) {
            const score = this.evaluateBoard(simulated.matrix, simulated.linesCleared, landingY);
            if (score > highestScore) {
              highestScore = score;
              bestMove = {
                rotation: rot,
                targetX: testX,
                score,
                explanation: this.generateExplanation(simulated.linesCleared, type, testX),
              };
            }
          }
        }
      }
    }

    return bestMove;
  }

  private simulatePlacement(
    matrix: MatrixCell[][],
    piece: ActivePiece,
    landingY: number
  ): { matrix: boolean[][]; linesCleared: number } | null {
    const shape = TETROMINO_SHAPES[piece.type][piece.rotation];
    const size = shape.length;

    // Clone simple boolean matrix
    const grid: boolean[][] = matrix.map((row) => row.map((cell) => cell.filled));

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (shape[r][c] !== 0) {
          const x = piece.x + c;
          const y = landingY + r;
          if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_TOTAL_HEIGHT) {
            return null; // Illegal
          }
          if (y >= 0) {
            grid[y][x] = true;
          }
        }
      }
    }

    // Check full rows
    let linesCleared = 0;
    const finalGrid: boolean[][] = [];
    for (let y = BOARD_TOTAL_HEIGHT - 1; y >= 0; y--) {
      if (grid[y].every((cell) => cell)) {
        linesCleared++;
      } else {
        finalGrid.unshift([...grid[y]]);
      }
    }

    while (finalGrid.length < BOARD_TOTAL_HEIGHT) {
      finalGrid.unshift(new Array(BOARD_WIDTH).fill(false));
    }

    return { matrix: finalGrid, linesCleared };
  }

  private evaluateBoard(grid: boolean[][], linesCleared: number, landingHeight: number): number {
    let rowTransitions = 0;
    let colTransitions = 0;
    let holes = 0;
    let wellSums = 0;

    // Row transitions
    for (let y = 0; y < BOARD_TOTAL_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH - 1; x++) {
        if (grid[y][x] !== grid[y][x + 1]) {
          rowTransitions++;
        }
      }
      if (!grid[y][0]) rowTransitions++;
      if (!grid[y][BOARD_WIDTH - 1]) rowTransitions++;
    }

    // Column transitions & Holes
    for (let x = 0; x < BOARD_WIDTH; x++) {
      let blockSeen = false;
      for (let y = 0; y < BOARD_TOTAL_HEIGHT - 1; y++) {
        if (grid[y][x] !== grid[y + 1][x]) {
          colTransitions++;
        }
      }
      if (!grid[BOARD_TOTAL_HEIGHT - 1][x]) colTransitions++;

      // Count buried holes
      for (let y = 0; y < BOARD_TOTAL_HEIGHT; y++) {
        if (grid[y][x]) {
          blockSeen = true;
        } else if (blockSeen) {
          holes++;
        }
      }
    }

    // Wells calculation
    for (let x = 0; x < BOARD_WIDTH; x++) {
      let wellDepth = 0;
      for (let y = 0; y < BOARD_TOTAL_HEIGHT; y++) {
        const leftOccupied = x === 0 || grid[y][x - 1];
        const rightOccupied = x === BOARD_WIDTH - 1 || grid[y][x + 1];
        if (!grid[y][x] && leftOccupied && rightOccupied) {
          wellDepth++;
          wellSums += wellDepth;
        } else {
          wellDepth = 0;
        }
      }
    }

    return (
      landingHeight * this.weightLandingHeight +
      linesCleared * this.weightCompletedLines +
      rowTransitions * this.weightRowTransitions +
      colTransitions * this.weightColTransitions +
      holes * this.weightHoles +
      wellSums * this.weightWellSums
    );
  }

  private generateExplanation(lines: number, type: TetrominoType, col: number): string {
    if (lines === 4) return `Major GC Compaction primed! Compact ${type} into column ${col} for a 5.12 MB heap reclamation sweep.`;
    if (lines > 0) return `Linear page compaction detected. Compacting ${type} in column ${col}.`;
    return `Optimizing 2D bin-packing density to eliminate fragmentation holes. Target column: ${col}.`;
  }
}

export const aiSolver = new HeuristicSolver();
