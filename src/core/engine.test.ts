import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { SevenBagRandomizer } from './randomizer';
import { GameEngine } from './gameEngine';
import { isColliding, tryRotateSRS, calculateGhostY } from './srs';
import { BOARD_WIDTH, BOARD_TOTAL_HEIGHT, TETROMINO_SHAPES } from './constants';
import { TetrominoType, RotationState, MatrixCell, ActivePiece } from './types';

describe('NecroTetris Mathematical Invariants & Property-Based Tests', () => {
  it('Property: 7-Bag randomizer guarantees exact permutation distribution per bag', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 20 }), (bagsToGenerate) => {
        const randomizer = new SevenBagRandomizer();
        randomizer.reset();

        for (let b = 0; b < bagsToGenerate; b++) {
          const bagSlice: TetrominoType[] = [];
          for (let p = 0; p < 7; p++) {
            bagSlice.push(randomizer.next());
          }

          // Invariant: every 7 pieces must contain exactly all 7 distinct tetrominoes
          const uniqueSet = new Set(bagSlice);
          expect(uniqueSet.size).toBe(7);
          expect(uniqueSet.has('I')).toBe(true);
          expect(uniqueSet.has('J')).toBe(true);
          expect(uniqueSet.has('L')).toBe(true);
          expect(uniqueSet.has('O')).toBe(true);
          expect(uniqueSet.has('S')).toBe(true);
          expect(uniqueSet.has('T')).toBe(true);
          expect(uniqueSet.has('Z')).toBe(true);
        }
      })
    );
  });

  it('Property: SRS rotation never permits an active piece to clip outside board bounds', () => {
    const pieces: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    fc.assert(
      fc.property(
        fc.constantFrom(...pieces),
        fc.integer({ min: -2, max: BOARD_WIDTH }),
        fc.integer({ min: 0, max: BOARD_TOTAL_HEIGHT - 3 }),
        fc.constantFrom(0, 1, 2, 3 as RotationState),
        fc.constantFrom('clockwise', 'counterclockwise' as const),
        (type, x, y, rotation, direction) => {
          const engine = new GameEngine();
          const matrix = engine.createEmptyMatrix();

          const activePiece: ActivePiece = { type, x, y, rotation };

          // If current piece is valid, attempting SRS rotation should either succeed
          // into a legally bounded non-colliding position or fail closed safely.
          if (!isColliding(matrix, type, rotation, x, y)) {
            const result = tryRotateSRS(matrix, activePiece, direction);
            if (result.success) {
              const rotated = result.piece;
              const shape = TETROMINO_SHAPES[rotated.type][rotated.rotation];
              const size = shape.length;

              for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                  if (shape[r][c] !== 0) {
                    const blockX = rotated.x + c;
                    const blockY = rotated.y + r;
                    // Invariant: rotated piece MUST be within horizontal walls and above the floor
                    expect(blockX).toBeGreaterThanOrEqual(0);
                    expect(blockX).toBeLessThan(BOARD_WIDTH);
                    expect(blockY).toBeLessThan(BOARD_TOTAL_HEIGHT);
                  }
                }
              }
            }
          }
        }
      )
    );
  });

  it('Property: Line clear invariant removes exactly full rows and preserves non-full rows', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 4 }), // number of full rows to simulate
        (fullRowsCount) => {
          const engine = new GameEngine();
          const matrix = engine.createEmptyMatrix();

          // Fill the bottom `fullRowsCount` rows completely
          for (let y = BOARD_TOTAL_HEIGHT - 1; y >= BOARD_TOTAL_HEIGHT - fullRowsCount; y--) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
              matrix[y][x] = { filled: true, color: 'I', state: 'normal' };
            }
          }

          // Place one single orphan test block in the row above the cleared rows
          const orphanRow = BOARD_TOTAL_HEIGHT - fullRowsCount - 1;
          matrix[orphanRow][3] = { filled: true, color: 'T', state: 'normal' };

          engine.state.matrix = matrix;
          const cleared = engine.clearLines();

          expect(cleared).toBe(fullRowsCount);

          // Invariant: the orphan block has now dropped down by exactly `fullRowsCount` rows
          const newOrphanRow = orphanRow + fullRowsCount;
          expect(engine.state.matrix[newOrphanRow][3].filled).toBe(true);

          // Invariant: top rows must be empty
          for (let y = 0; y < fullRowsCount; y++) {
            expect(engine.state.matrix[y].every((cell) => !cell.filled)).toBe(true);
          }
        }
      )
    );
  });

  it('Property: calculateGhostY destination is always the lowest non-colliding drop point', () => {
    const pieces: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    fc.assert(
      fc.property(
        fc.constantFrom(...pieces),
        fc.integer({ min: 0, max: 6 }),
        (type, x) => {
          const engine = new GameEngine();
          const matrix = engine.createEmptyMatrix();
          const piece: ActivePiece = { type, x, y: 0, rotation: 0 };

          const ghostY = calculateGhostY(matrix, piece);

          // Invariant 1: Placing piece at ghostY must not collide
          expect(isColliding(matrix, type, 0, x, ghostY)).toBe(false);

          // Invariant 2: Placing piece at ghostY + 1 MUST collide (with floor or bottom)
          expect(isColliding(matrix, type, 0, x, ghostY + 1)).toBe(true);
        }
      )
    );
  });
});
