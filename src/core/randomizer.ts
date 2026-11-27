import { TetrominoType } from './types';

const TETROMINOES: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

export class SevenBagRandomizer {
  private bag: TetrominoType[] = [];
  private history: TetrominoType[] = [];

  constructor() {
    this.refill();
  }

  /**
   * Refills the bag by generating a Fisher-Yates shuffled permutation of all 7 tetrominoes.
   */
  private refill(): void {
    const newBag: TetrominoType[] = [...TETROMINOES];
    for (let i = newBag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newBag[i], newBag[j]] = [newBag[j], newBag[i]];
    }
    this.bag.push(...newBag);
  }

  /**
   * Pulls the next tetromino from the bag.
   */
  public next(): TetrominoType {
    if (this.bag.length <= 7) {
      this.refill();
    }
    const piece = this.bag.shift()!;
    this.history.push(piece);
    if (this.history.length > 100) {
      this.history.shift();
    }
    return piece;
  }

  /**
   * Peeks ahead `count` pieces without consuming them.
   */
  public peek(count: number = 5): TetrominoType[] {
    while (this.bag.length < count) {
      this.refill();
    }
    return this.bag.slice(0, count);
  }

  /**
   * Resets the bag for a new game.
   */
  public reset(): void {
    this.bag = [];
    this.history = [];
    this.refill();
    this.refill(); // keep 14 pieces buffered
  }
}
