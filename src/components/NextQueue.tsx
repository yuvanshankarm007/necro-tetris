import React from 'react';
import { TetrominoType, DisplayTheme, CurseType } from '../core/types';
import { TETROMINO_SHAPES, THEME_CONFIG, ALLOCATION_METADATA } from '../core/constants';
import { Layers, Bot, Play, Zap } from 'lucide-react';

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
      {/* Allocation Ingress Pipeline */}
      <div
        className="p-3 rounded border bg-black/60 backdrop-blur-sm shadow-lg flex flex-col items-center"
        style={{ borderColor: config.gridLine }}
      >
        <div
          className="text-xs uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5"
          style={{ color: config.primaryText }}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Ingress Pipeline</span>
        </div>

        <div className="flex flex-col gap-2 w-full items-center">
          {nextPieces.slice(0, 4).map((type, idx) => {
            const meta = ALLOCATION_METADATA[type];
            return (
              <div
                key={idx}
                className="w-full h-16 flex items-center justify-between px-2.5 border border-dashed rounded bg-black/40"
                style={{ borderColor: config.gridLine }}
              >
                <div className="flex flex-col items-center justify-center">
                  {TETROMINO_SHAPES[type][0].map((row, r) => (
                    <div key={r} className="flex">
                      {row.map((cell, c) => (
                        <div
                          key={c}
                          className="w-3 h-3 m-0.5 rounded-xs flex items-center justify-center text-[8px] font-bold"
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
                          {cell && isSovietMode ? `[${meta.tag[0]}]` : ''}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col text-right font-mono">
                  <span className="text-[10px] font-bold" style={{ color: config.primaryText }}>
                    {meta.tag}
                  </span>
                  <span className="text-[8px] text-zinc-400">
                    {meta.sizeKb} KB
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Autonomous GC Daemon (Kiro Crew Auto-Compactor) */}
      <div
        className="p-3 rounded border bg-black/60 backdrop-blur-sm shadow-lg flex flex-col gap-2"
        style={{ borderColor: config.gridLine }}
      >
        <div
          className="text-xs uppercase tracking-widest font-bold flex items-center gap-1.5"
          style={{ color: config.primaryText }}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Autonomous GC Daemon</span>
        </div>

        <button
          onClick={onToggleAutoPlay}
          className={`w-full py-2 px-3 rounded font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            isAutoPlay
              ? 'bg-purple-900/60 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300'
          }`}
        >
          {isAutoPlay ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Daemon Compacting...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Engage AI Compactor</span>
            </>
          )}
        </button>
        <span className="text-[9px] text-zinc-400 leading-tight font-mono">
          Kiro Crew 2D bin-packing heuristic solves memory fragmentation autonomously.
        </span>
      </div>

      {/* Chaos Monkey Stress Testing (Judge Sandbox) */}
      <div
        className="p-3 rounded border bg-black/60 backdrop-blur-sm shadow-lg flex flex-col gap-2"
        style={{ borderColor: config.gridLine }}
      >
        <div className="text-xs uppercase tracking-widest font-bold text-red-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          <span>Chaos Monkey Load</span>
        </div>
        <span className="text-[9px] text-zinc-400 leading-tight font-mono">
          Inject real-world cloud memory failures:
        </span>
        <div className="grid grid-cols-2 gap-1.5 mt-1 font-mono">
          <button
            onClick={() => onTriggerCurse('fog_of_war')}
            className="px-2 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded text-[9px] text-slate-300 cursor-pointer text-left"
            title="Uncollected pointers obscure heap inspection"
          >
            🌫️ Mem Leak
          </button>
          <button
            onClick={() => onTriggerCurse('poltergeist_shift')}
            className="px-2 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-800 rounded text-[9px] text-amber-300 cursor-pointer text-left"
            title="Sudden CPU context preemption displaces pointer"
          >
            ⚡ Context Sw
          </button>
          <button
            onClick={() => onTriggerCurse('soul_inversion')}
            className="px-2 py-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-800 rounded text-[9px] text-purple-300 cursor-pointer text-left"
            title="Stack vs heap pointer collision"
          >
            🔄 Invert Ptr
          </button>
          <button
            onClick={() => onTriggerCurse('tombstone_crumble')}
            className="px-2 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-800 rounded text-[9px] text-red-300 cursor-pointer text-left"
            title="Silent hardware bit rot"
          >
            💥 ECC Bit Rot
          </button>
        </div>
      </div>
    </div>
  );
};
