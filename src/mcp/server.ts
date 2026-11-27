/**
 * Model Context Protocol (MCP) Server Bridge for NecroTetris
 * Connects Kiro Agents to the live running game state.
 */

import { aiSolver } from '../ai/heuristicSolver';
import { GameEngine } from '../core/gameEngine';
import { TetrominoType, CurseType } from '../core/types';

export class NecroTetrisMCPBridge {
  private engine: GameEngine;

  constructor(engine: GameEngine) {
    this.engine = engine;
  }

  public handleToolCall(toolName: string, args: Record<string, unknown>): unknown {
    switch (toolName) {
      case 'get_board_state':
        return {
          matrix: this.engine.state.matrix.map((row) =>
            row.map((cell) => (cell.filled ? cell.type || '1' : '.'))
          ),
          activePiece: this.engine.state.activePiece,
          holdPiece: this.engine.state.holdPiece,
          nextQueue: this.engine.state.nextPieces,
          activeCurse: this.engine.state.activeCurse,
          score: this.engine.state.stats.score,
          level: this.engine.state.stats.level,
        };

      case 'suggest_move': {
        const pieceType =
          (args.type as TetrominoType) ||
          this.engine.state.activePiece?.type ||
          'T';
        const recommendation = aiSolver.findBestMove(
          this.engine.state.matrix,
          pieceType
        );
        return recommendation;
      }

      case 'cast_curse': {
        const curse = (args.curse as CurseType) || 'fog_of_war';
        this.engine.applyCurse(curse);
        return { success: true, activeCurse: this.engine.state.activeCurse };
      }

      case 'get_graveyard_stats':
        return {
          stats: this.engine.state.stats,
          highestRow: this.engine.getHighestFilledRow(),
          gameOver: this.engine.state.gameOver,
        };

      default:
        throw new Error(`Unknown MCP Tool: ${toolName}`);
    }
  }
}
