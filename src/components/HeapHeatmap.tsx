import React, { useState, useEffect } from 'react';
import { GameState, DisplayTheme, MatrixCell } from '../core/types';
import { THEME_CONFIG } from '../core/constants';
import { liveMemoryBridge, ContainerProfile, LiveV8Stats } from '../core/liveMemoryBridge';
import { CoreDumpExporter } from '../core/coreDumpExporter';
import { Server, Activity, Download, Cpu, HardDrive, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

interface HeapHeatmapProps {
  state: GameState;
  theme: DisplayTheme;
  selectedProfile: ContainerProfile;
  onSelectProfile: (profile: ContainerProfile) => void;
}

export const HeapHeatmap: React.FC<HeapHeatmapProps> = ({
  state,
  theme,
  selectedProfile,
  onSelectProfile,
}) => {
  const [v8Stats, setV8Stats] = useState<LiveV8Stats>(liveMemoryBridge.sampleRealV8Heap());
  const [isExporting, setIsExporting] = useState(false);
  const config = THEME_CONFIG[theme];
  const profiles = liveMemoryBridge.getProfiles();

  // Poll live V8 stats
  useEffect(() => {
    const interval = setInterval(() => {
      setV8Stats(liveMemoryBridge.sampleRealV8Heap());
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadJson = () => {
    setIsExporting(true);
    CoreDumpExporter.downloadAsJson(state, selectedProfile.id);
    setTimeout(() => setIsExporting(false), 800);
  };

  const handleDownloadLog = () => {
    setIsExporting(true);
    CoreDumpExporter.downloadAsTextReport(state, selectedProfile.id);
    setTimeout(() => setIsExporting(false), 800);
  };

  return (
    <div
      className="p-3.5 rounded-xl border bg-black/85 backdrop-blur-md shadow-2xl flex flex-col gap-3 w-full font-mono text-xs"
      style={{ borderColor: config.gridLine }}
    >
      {/* Header & Container Target Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2" style={{ borderColor: config.gridLine }}>
        <div className="flex items-center gap-2" style={{ color: config.primaryText }}>
          <Server className="w-4 h-4" />
          <span className="font-bold uppercase tracking-wider text-[11px]">
            eBPF Heap Observability & Address Heatmap
          </span>
        </div>

        {/* Container Profile Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-zinc-500 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            Target:
          </label>
          <select
            value={selectedProfile.id}
            onChange={(e) => {
              const p = liveMemoryBridge.setProfile(e.target.value);
              onSelectProfile(p);
            }}
            className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[11px] text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.namespace})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Profile Details Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded bg-zinc-950/70 border border-zinc-800/80 text-[10px]">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
            Pod: {selectedProfile.podName}
          </span>
          <span className="text-zinc-500">Allocation:</span>
          <span className="text-cyan-400 font-bold">{selectedProfile.primaryAllocation}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-zinc-400">Velocity:</span>
            <span className="text-emerald-300 font-bold">{v8Stats.allocationVelocityMbSec} MB/s</span>
          </div>

          <div className="flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-purple-400" />
            <span className="text-zinc-400">Host V8 Heap:</span>
            <span className="text-purple-300 font-bold">{v8Stats.usedHeapMb} MB</span>
          </div>
        </div>
      </div>

      {/* Address Space Heatmap Grid (Compact 20 Rows) */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-[10px] text-zinc-500">
          <span>Physical Address Space (0x0000 - 0x2600)</span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-xs bg-emerald-500/80" /> Allocated
            <span className="inline-block w-2 h-2 rounded-xs bg-red-500/80" /> Leak Hole
            <span className="inline-block w-2 h-2 rounded-xs bg-zinc-900 border border-zinc-800" /> Free
          </span>
        </div>

        <div className="grid grid-cols-10 gap-0.5 p-1.5 rounded bg-zinc-950 border border-zinc-900 overflow-hidden">
          {state.matrix.map((row: MatrixCell[], rowIdx: number) =>
            row.map((cell: MatrixCell, colIdx: number) => {
              const isHole = !cell.filled && rowIdx > 5 && state.matrix.slice(0, rowIdx).some((r: MatrixCell[]) => r[colIdx].filled);
              let cellBg = 'bg-zinc-900/60 border-zinc-900';
              if (cell.filled) {
                cellBg = 'bg-emerald-500/80 border-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.3)]';
              } else if (isHole) {
                cellBg = 'bg-red-500/70 border-red-400 animate-pulse';
              }

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={`h-2.5 rounded-xs border text-[7px] flex items-center justify-center font-mono ${cellBg}`}
                  title={`Addr: 0x${((rowIdx * 16) + colIdx).toString(16).toUpperCase().padStart(4, '0')} | ${cell.filled ? `PID ${cell.pid || 1042}` : isHole ? 'LEAK HOLE' : 'FREE'}`}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Forensic Export & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-900">
        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
          {state.stats.oomAlert ? (
            <span className="flex items-center gap-1 text-red-400 font-bold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              CRITICAL: Heap pressure &gt; 80% — OOM Panic Imminent
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              eBPF Watchdog: Compaction active • Zero leaks pinned
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadJson}
            disabled={isExporting}
            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            title="Export complete Linux kernel memory forensic crash dump (.json)"
          >
            <Download className="w-3 h-3 text-cyan-400" />
            <span>Dump JSON</span>
          </button>

          <button
            onClick={handleDownloadLog}
            disabled={isExporting}
            className="px-2.5 py-1 rounded bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            title="Export eBPF diagnostic log report (.log)"
          >
            <Download className="w-3 h-3 text-emerald-400" />
            <span>Dump .LOG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
