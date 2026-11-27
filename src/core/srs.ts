import {
  BOARD_WIDTH,
  BOARD_TOTAL_HEIGHT,
  TETROMINO_SHAPES,
  WALL_KICK_DATA_JLSTZ,
  WALL_KICK_DATA_I,
} from './constants';
import { TetrominoType, RotationState, MatrixCell, ActivePiece } from './types';

/**
 * Checks if a piece collides with the board boundaries or already locked cells.
 */
export function isColliding(
  matrix: MatrixCell[][],
  type: TetrominoType,
  rotation: RotationState,
  x: number,
  y: number
): boolean {
  const shape = TETROMINO_SHAPES[type][rotation];
  const size = shape.length;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (shape[r][c] !== 0) {
        const boardX = x + c;
        const boardY = y + r;

        // Wall boundary checks
        if (boardX < 0 || boardX >= BOARD_WIDTH) {
          return true;
        }

        // Floor boundary check
        if (boardY >= BOARD_TOTAL_HEIGHT) {
          return true;
        }

        // Allow spawning above ceiling (buffer rows)
        if (boardY < 0) {
          continue;
        }

        // Locked cell collision check
        if (matrix[boardY] && matrix[boardY][boardX]?.filled) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Attempts Super Rotation System (SRS) rotation with 5-test wall-kicks.
 */
export function tryRotateSRS(
  matrix: MatrixCell[][],
  piece: ActivePiece,
  direction: 'clockwise' | 'counterclockwise'
): { success: boolean; piece: ActivePiece } {
  const fromRot = piece.rotation;
  const toRot: RotationState =
    direction === 'clockwise'
      ? (((fromRot + 1) % 4) as RotationState)
      : (((fromRot + 3) % 4) as RotationState);

  // O-Piece never needs wall-kicks and rotation is invariant
  if (piece.type === 'O') {
    return { success: true, piece: { ...piece, rotation: toRot } };
  }

  const transitionKey = `${fromRot}->${toRot}`;
  const kickTable =
    piece.type === 'I' ? WALL_KICK_DATA_I : WALL_KICK_DATA_JLSTZ;
  const tests = kickTable[transitionKey] || [[0, 0]];

  for (const [kickX, kickY] of tests) {
    // Note: in Guideline math, +Y is UP, but on the board array +Y is DOWN.
    const testX = piece.x + kickX;
    const testY = piece.y - kickY;

    if (!isColliding(matrix, piece.type, toRot, testX, testY)) {
      return {
        success: true,
        piece: {
          ...piece,
          x: testX,
          y: testY,
          rotation: toRot,
        },
      };
    }
  }

  // All 5 tests failed
  return { success: false, piece };
}

/**
 * Calculates ghost piece coordinates (hard drop destination).
 */
export function calculateGhostY(
  matrix: MatrixCell[][],
  piece: ActivePiece
): number {
  let ghostY = piece.y;
  while (!isColliding(matrix, piece.type, piece.rotation, piece.x, ghostY + 1)) {
    ghostY++;
  }
  return ghostY;
}
