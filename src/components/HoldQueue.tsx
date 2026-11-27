import React from 'react';
import { TetrominoType, GameStats, ActiveCurse, DisplayTheme } from '../core/types';
import { TETROMINO_SHAPES, THEME_CONFIG } from '../core/constants';
import { Ghost, ShieldAlert, Sparkles, Skull, Flame, Wand2 } from 'lucide-react';

interface HoldQueueProps {
  holdPiece: TetrominoType | null;
  canHold: boolean;
  stats: GameStats;
  activeCurse: ActiveCurse | null;
  theme: DisplayTheme;
  isSovietMode: boolean;
}

export const HoldQueue: React.FC<HoldQueueProps> = ({
  holdPiece,
  canHold,
  stats,
  activeCurse,
  theme,
  isSovietMode,
}) => {
  const config = THEME_CONFIG[theme];

  return (
    <div className="flex flex-col gap-4 w-56 shrink-0">
      {/* Hold Piece Box */}
      <div
        className="p-3 rounded border bg-black/60 backdrop-blur-sm shadow-lg flex flex-col items-center"
        style={{ borderColor: config.gridLine }}
      >
        <div
          className="text-xs uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5"
          style={{ color: config.primaryText }}
        >
          <Ghost className="w-3.5 h-3.5" />
          <span>Hold Chamber [C]</span>
        </div>

        <div
          className="w-24 h-24 flex items-center justify-center border border-dashed rounded bg-black/40"
          style={{ borderColor: canHold ? config.gridLine : 'rgba(239, 68, 68, 0.4)' }}
        >
          {holdPiece ? (
            <div className="flex flex-col items-center justify-center">
              {TETROMINO_SHAPES[holdPiece][0].map((row, r) => (
                <div key={r} className="flex">
                  {row.map((cell, c) => (
                    <div
                      key={c}
                      className="w-4 h-4 m-0.5 rounded-xs flex items-center justify-center text-[10px]"
                      style={{
                        backgroundColor: cell
                          ? isSovietMode
                            ? 'transparent'
                            : config.colors[holdPiece]
                          : 'transparent',
                        color: config.colors[holdPiece],
                        boxShadow:
                          cell && !isSovietMode
                            ? `0 0 4px ${config.colors[holdPiece]}`
                            : 'none',
                      }}
                    >
                      {cell && isSovietMode ? config.asciiBlock[0] : ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-zinc-600 italic">Empty</span>
          )}
        </div>
        {!canHold && (
          <span className="text-[10px] text-red-400 mt-1 uppercase tracking-wider">
            Locked this turn
          </span>
        )}
      </div>

      {/* Crypt Statistics Panel */}
      <div
        className="p-3 rounded border bg-black/60 backdrop-blur-sm shadow-lg flex flex-col gap-3"
        style={{ borderColor: config.gridLine }}
      >
        <div
          className="text-xs uppercase tracking-widest font-bold border-b pb-1 flex items-center gap-1.5"
          style={{ borderColor: config.gridLine, color: config.primaryText }}
        >
          <Skull className="w-3.5 h-3.5" />
          <span>Crypt Metrics</span>
        </div>

        <div>
          <span className="text-[10px] uppercase text-zinc-400 tracking-wider">Score</span>
          <div
            className="text-2xl font-bold tracking-wider font-mono"
            style={{ color: config.primaryText, textShadow: `0 0 8px ${config.accentGlow}` }}
          >
            {stats.score.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] uppercase text-zinc-400 tracking-wider">Level</span>
            <div className="text-lg font-bold font-mono" style={{ color: config.primaryText }}>
              {stats.level}
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase text-zinc-400 tracking-wider">Lines</span>
            <div className="text-lg font-bold font-mono text-zinc-200">
              {stats.lines}
            </div>
          </div>
        </div>

        <div className="border-t pt-2" style={{ borderColor: config.gridLine }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-zinc-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Exorcisms
            </span>
            <span className="text-sm font-bold font-mono text-cyan-300">
              {stats.exorcisms}
            </span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] uppercase text-zinc-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" />
              Combo
            </span>
            <span className="text-sm font-bold font-mono text-amber-400">
              x{stats.combos}
            </span>
          </div>

          {stats.tSpins > 0 && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] uppercase text-zinc-400 flex items-center gap-1">
                <Wand2 className="w-3 h-3 text-purple-400" />
                T-Spins
              </span>
              <span className="text-sm font-bold font-mono text-purple-300">
                {stats.tSpins}
              </span>
            </div>
          )}

          {stats.lastAction && (
            <div className="mt-2 pt-1 border-t border-dashed border-zinc-800 text-center">
              <span className="text-[10px] font-bold font-mono text-emerald-400 tracking-wide animate-pulse">
                ★ {stats.lastAction}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Active Curse Display */}
      {activeCurse && (
        <div className="p-3 rounded border border-red-500/60 bg-red-950/30 backdrop-blur-sm animate-pulse flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Active Curse!</span>
          </div>
          <div className="text-sm font-bold text-red-200">{activeCurse.name}</div>
          <div className="text-[11px] text-red-300/80 leading-tight">
            {activeCurse.description}
          </div>
          <div className="text-[10px] text-yellow-300 font-mono mt-1">
            ⚡ Clear 4 lines (Exorcism) to banish!
          </div>
        </div>
      )}
    </div>
  );
};
