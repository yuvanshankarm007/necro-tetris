import React from 'react';
import { TetrominoType, GameStats, ActiveCurse, DisplayTheme } from '../core/types';
import { TETROMINO_SHAPES, THEME_CONFIG, ALLOCATION_METADATA } from '../core/constants';
import { Database, ShieldAlert, Cpu, Activity, AlertTriangle, Wand2, RefreshCw } from 'lucide-react';

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
  const holdMeta = holdPiece ? ALLOCATION_METADATA[holdPiece] : null;

  const heapPercentage = Math.min(100, Math.round((stats.heapUsedKb / stats.heapMaxKb) * 100));

  return (
    <div className="flex flex-col gap-4 w-56 shrink-0">
      {/* Hold Page Frame Box */}
      <div
        className="p-3 rounded border bg-black/60 backdrop-blur-sm shadow-lg flex flex-col items-center"
        style={{ borderColor: config.gridLine }}
      >
        <div
          className="text-xs uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5"
          style={{ color: config.primaryText }}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Page Cache [C]</span>
        </div>

        <div
          className="w-24 h-24 flex items-center justify-center border border-dashed rounded bg-black/40 relative"
          style={{ borderColor: canHold ? config.gridLine : 'rgba(239, 68, 68, 0.4)' }}
        >
          {holdPiece ? (
            <div className="flex flex-col items-center justify-center">
              {TETROMINO_SHAPES[holdPiece][0].map((row, r) => (
                <div key={r} className="flex">
                  {row.map((cell, c) => (
                    <div
                      key={c}
                      className="w-4 h-4 m-0.5 rounded-xs flex items-center justify-center text-[10px] font-bold"
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
                      {cell && isSovietMode ? `[${holdMeta?.tag[0]}]` : ''}
                    </div>
                  ))}
                </div>
              ))}
              <span className="text-[9px] font-mono text-zinc-400 mt-1 uppercase">
                {holdMeta?.tag}
              </span>
            </div>
          ) : (
            <span className="text-xs text-zinc-600 italic font-mono">No Cached Frame</span>
          )}
        </div>
        {!canHold && (
          <span className="text-[9px] text-red-400 mt-1 uppercase tracking-wider font-mono">
            Page Locked This Cycle
          </span>
        )}
      </div>

      {/* Real-time Heap & Defragmenter Telemetry */}
      <div
        className="p-3 rounded border bg-black/60 backdrop-blur-sm shadow-lg flex flex-col gap-2.5"
        style={{ borderColor: config.gridLine }}
      >
        <div
          className="text-xs uppercase tracking-widest font-bold border-b pb-1 flex items-center justify-between"
          style={{ borderColor: config.gridLine, color: config.primaryText }}
        >
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>Heap Telemetry</span>
          </div>
          <span className="text-[9px] text-zinc-500 font-mono">PID: 1984</span>
        </div>

        {/* RAM Reclaimed Metric */}
        <div>
          <span className="text-[10px] uppercase text-zinc-400 tracking-wider">RAM Reclaimed</span>
          <div
            className="text-xl font-bold tracking-wider font-mono"
            style={{ color: config.primaryText, textShadow: `0 0 8px ${config.accentGlow}` }}
          >
            {(stats.reclaimedKb / 1024).toFixed(1)} <span className="text-xs text-zinc-400">MB</span>
          </div>
        </div>

        {/* Heap Memory Pressure Gauge */}
        <div>
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className="text-zinc-400">Heap Pressure:</span>
            <span className={heapPercentage > 75 ? 'text-red-400 font-bold' : 'text-zinc-300'}>
              {(stats.heapUsedKb / 1024).toFixed(1)} / 25.6 MB ({heapPercentage}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-900 rounded overflow-hidden border border-zinc-800">
            <div
              className={`h-full transition-all duration-300 ${
                heapPercentage > 80
                  ? 'bg-red-500'
                  : heapPercentage > 50
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${heapPercentage}%` }}
            />
          </div>
        </div>

        {/* Fragmentation Ratio */}
        <div className="flex items-center justify-between border-t pt-2" style={{ borderColor: config.gridLine }}>
          <span className="text-[10px] uppercase text-zinc-400 flex items-center gap-1 font-mono">
            <Activity className="w-3 h-3 text-amber-400" />
            Fragmentation
          </span>
          <span
            className={`text-sm font-bold font-mono ${
              stats.fragmentationRatio > 30 ? 'text-red-400 animate-pulse' : 'text-amber-400'
            }`}
          >
            {stats.fragmentationRatio}%
          </span>
        </div>

        {/* GC Compactions & Spins */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[10px] uppercase text-zinc-400 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-cyan-400" />
            Major Compactions
          </span>
          <span className="text-xs font-bold text-cyan-300 font-mono">
            {stats.exorcisms}
          </span>
        </div>

        {stats.tSpins > 0 && (
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] uppercase text-zinc-400 flex items-center gap-1">
              <Wand2 className="w-3 h-3 text-purple-400" />
              Spin Inserts
            </span>
            <span className="text-xs font-bold text-purple-300 font-mono">
              {stats.tSpins}
            </span>
          </div>
        )}

        {/* OOM Kernel Panic Warning Banner */}
        {stats.oomAlert && (
          <div className="bg-red-950/80 border border-red-500 text-red-200 text-[9px] font-mono p-1.5 rounded flex items-center gap-1.5 animate-bounce">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>CRITICAL: OOM PANIC RISK! COMPACT PAGES NOW!</span>
          </div>
        )}

        {stats.lastAction && (
          <div className="pt-1 border-t border-dashed border-zinc-800 text-center">
            <span className="text-[10px] font-bold font-mono text-emerald-400 tracking-wide animate-pulse">
              ★ {stats.lastAction}
            </span>
          </div>
        )}
      </div>

      {/* Active Memory Hazard / Curse Display */}
      {activeCurse && (
        <div className="p-3 rounded border border-red-500/60 bg-red-950/30 backdrop-blur-sm animate-pulse flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Hazard Active!</span>
          </div>
          <div className="text-sm font-bold text-red-200">{activeCurse.name}</div>
          <div className="text-[11px] text-red-300/80 leading-tight">
            {activeCurse.description}
          </div>
          <div className="text-[10px] text-yellow-300 font-mono mt-1">
            ⚡ Perform 4-line GC Compaction to purge!
          </div>
        </div>
      )}
    </div>
  );
};
