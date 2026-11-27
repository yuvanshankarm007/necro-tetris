import React from 'react';
import { DisplayTheme } from '../core/types';
import { THEME_CONFIG } from '../core/constants';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Monitor, Sparkles } from 'lucide-react';

interface HeaderProps {
  theme: DisplayTheme;
  onThemeChange: (theme: DisplayTheme) => void;
  isCrtEnabled: boolean;
  onToggleCrt: () => void;
  isBgmPlaying: boolean;
  onToggleBgm: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  isCrtEnabled,
  onToggleCrt,
  isBgmPlaying,
  onToggleBgm,
  isMuted,
  onToggleMute,
  isPaused,
  onTogglePause,
  onRestart,
}) => {
  const config = THEME_CONFIG[theme];

  return (
    <header className="w-full flex flex-wrap items-center justify-between gap-4 p-3 border-b border-zinc-800/80 bg-black/60 backdrop-blur-md">
      {/* Title & Hackathon Badge */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xl">💾</span>
            <h1
              className="text-lg md:text-xl font-bold font-mono tracking-widest uppercase transition-colors"
              style={{
                color: config.primaryText,
                textShadow: `0 0 10px ${config.accentGlow}`,
              }}
            >
              Defrag84
            </h1>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-purple-950/80 text-purple-300 border border-purple-700/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Autonomous GC
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono tracking-wide">
            Kiroween 2026 • Resurrection Category • 1984 2D Bin-Packing for Cloud & AI Memory
          </span>
        </div>
      </div>

      {/* Controls & Theme Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Theme Picker */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded border border-zinc-800 text-xs font-mono">
          <button
            onClick={() => onThemeChange('soviet_green')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer text-[11px] ${
              theme === 'soviet_green'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="1984 Elektronika-60 RAM Matrix"
          >
            🟢 '84 RAM
          </button>
          <button
            onClick={() => onThemeChange('soviet_amber')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer text-[11px] ${
              theme === 'soviet_amber'
                ? 'bg-amber-950 text-amber-300 border border-amber-700 font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="1989 MS-DOS DEFRAG (Norton SpeedDisk)"
          >
            🟠 DOS Defrag
          </button>
          <button
            onClick={() => onThemeChange('gothic_blood')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer text-[11px] ${
              theme === 'gothic_blood'
                ? 'bg-red-950 text-red-300 border border-red-700 font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Kubernetes Pod Chaos (OOM Stress Test)"
          >
            🔴 K8s Chaos
          </button>
          <button
            onClick={() => onThemeChange('spectral_cyan')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer text-[11px] ${
              theme === 'spectral_cyan'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="LLM Agent KV-Cache Defragmenter"
          >
            🔵 KV-Cache
          </button>
        </div>

        {/* CRT Scanline Toggle */}
        <button
          onClick={onToggleCrt}
          className={`p-1.5 rounded border transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono ${
            isCrtEnabled
              ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300'
              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
          title="Toggle CRT Scanline Effect"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">CRT FX</span>
        </button>

        {/* BGM Toggle */}
        <button
          onClick={onToggleBgm}
          className={`px-2 py-1.5 rounded border transition-colors cursor-pointer text-xs font-mono flex items-center gap-1.5 ${
            isBgmPlaying
              ? 'bg-purple-950/70 border-purple-600 text-purple-200'
              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
          title="Toggle Haunted 8-bit Korobeiniki Synthesizer"
        >
          <span>🎵 {isBgmPlaying ? '8-Bit Synth ON' : 'Synth OFF'}</span>
        </button>

        {/* Mute Button */}
        <button
          onClick={onToggleMute}
          className={`p-1.5 rounded border border-zinc-800 bg-zinc-900 transition-colors cursor-pointer text-zinc-400 hover:text-zinc-200`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        {/* Pause Button */}
        <button
          onClick={onTogglePause}
          className="p-1.5 rounded border border-zinc-800 bg-zinc-900 transition-colors cursor-pointer text-zinc-400 hover:text-zinc-200"
          title={isPaused ? 'Resume Game' : 'Pause Game'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="p-1.5 rounded border border-zinc-800 bg-zinc-900 transition-colors cursor-pointer text-zinc-400 hover:text-zinc-200"
          title="Restart Game"
        >
          <RotateCcw className="w-3.5 h-3.5 text-yellow-400" />
        </button>
      </div>
    </header>
  );
};
