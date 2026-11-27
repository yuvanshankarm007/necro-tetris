import React from 'react';
import { TetrominoType, DisplayTheme, CurseType } from '../core/types';
import { TETROMINO_SHAPES, THEME_CONFIG } from '../core/constants';
import { Layers, Bot, Wand2, Eye } from 'lucide-react';

interface NextQueueProps {
  nextPieces: TetrominoType[];
  theme: DisplayTheme;
  isSovietMode: boolean;
  isAutoPlay: boolean;
  onToggleAutoPlay: () => void;
  onTriggerCurse: (curse: CurseType) => void;
}

export const NextQueue: React.FC<NextQueueProps> = ({
  nextPieces,
  theme,
  isSovietMode,
  isAutoPlay,
  onToggleAutoPlay,
  onTriggerCurse,
}) => {
  const config = THEME_CONFIG[theme];

  return (
    <div className="flex flex-col gap-4 w-56 shrink-0">
      {/* Next Pieces Queue */}
      <div
        className="p-3 rounded border bg-black/60 backdrop-blur-sm shadow-lg flex flex-col items-center"
        style={{ borderColor: config.gridLine }}
      >
        <div
          className="text-xs uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5"
          style={{ color: config.primaryText }}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Next Relics</span>
        </div>

        <div className="flex flex-col gap-2 w-full items-center">
          {nextPieces.slice(0, 4).map((type, idx) => (
            <div
              key={idx}
              className="w-20 h-14 flex items-center justify-center border border-dashed rounded bg-black/40"
              style={{ borderColor: config.gridLine }}
            >
              <div className="flex flex-col items-center justify-center">
                {TETROMINO_SHAPES[type][0].map((row, r) => (
                  <div key={r} className="flex">
                    {row.map((cell, c) => (
                      <div
                        key={c}
                        className="w-3.5 h-3.5 m-0.5 rounded-xs flex items-center justify-center text-[9px]"
                        style={{
                          backgroundColor: cell
                            ? isSovietMode
                              ? 'transparent'
                              : config.colors[type]
                            : 'transparent',
                          color: config.colors[type],
                          boxShadow:
                            cell && !isSovietMode
                              ? `0 0 3px ${config.colors[type]}`
                              : 'none',
                        }}
                      >
                        {cell && isSovietMode ? config.asciiBlock[0] : ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-Play Mode Trigger */}
      <div
        className="p-3 rounded border bg-black/60 backdrop-blur-sm shadow-lg flex flex-col gap-2"
        style={{ borderColor: config.gridLine }}
      >
        <div
          className="text-xs uppercase tracking-widest font-bold flex items-center gap-1.5"
          style={{ color: config.primaryText }}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Ghost Co-Pilot</span>
        </div>

        <button
          onClick={onToggleAutoPlay}
          className={`w-full py-2 px-3 rounded font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            isAutoPlay
              ? 'bg-purple-900/60 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300'
          }`}
        >
          <Wand2 className={`w-3.5 h-3.5 ${isAutoPlay ? 'animate-spin' : ''}`} />
          <span>{isAutoPlay ? 'Ghost Playing...' : 'Summon Ghost to Play'}</span>
        </button>
        <span className="text-[10px] text-zinc-400 leading-tight">
          Uses Dellacherie AI heuristics to calculate optimal placements in real-time.
        </span>
      </div>

      {/* Battle Gaiden Spellcaster (Judge Demo Sandbox) */}
      <div
        className="p-3 rounded border bg-black/60 backdrop-blur-sm shadow-lg flex flex-col gap-2"
        style={{ borderColor: config.gridLine }}
      >
        <div className="text-xs uppercase tracking-widest font-bold text-red-400 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" />
          <span>Curse Sandbox</span>
        </div>
        <span className="text-[10px] text-zinc-400 leading-tight">
          Simulate Battle Gaiden spells manually:
        </span>
        <div className="grid grid-cols-2 gap-1.5 mt-1">
          <button
            onClick={() => onTriggerCurse('fog_of_war')}
            className="px-2 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-300 cursor-pointer"
          >
            🌫️ Fog
          </button>
          <button
            onClick={() => onTriggerCurse('poltergeist_shift')}
            className="px-2 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-800 rounded text-[10px] font-mono text-amber-300 cursor-pointer"
          >
            👻 Shove
          </button>
          <button
            onClick={() => onTriggerCurse('soul_inversion')}
            className="px-2 py-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-800 rounded text-[10px] font-mono text-purple-300 cursor-pointer"
          >
            ⚡ Invert
          </button>
          <button
            onClick={() => onTriggerCurse('tombstone_crumble')}
            className="px-2 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-800 rounded text-[10px] font-mono text-red-300 cursor-pointer"
          >
            🦴 Rot
          </button>
        </div>
      </div>
    </div>
  );
};
