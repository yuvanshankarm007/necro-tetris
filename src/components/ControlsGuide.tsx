import React from 'react';
import { Keyboard, HelpCircle } from 'lucide-react';

export const ControlsGuide: React.FC = () => {
  return (
    <div className="p-2.5 rounded border border-zinc-800 bg-black/50 backdrop-blur-sm text-[11px] font-mono text-zinc-400 flex flex-wrap items-center justify-between gap-3 w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-1.5 text-zinc-300 font-bold">
        <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
        <span>Tombstone Controls:</span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">←</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 ml-1">→</kbd> : Move
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">↑</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">X</kbd> : Rotate CW
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">Z</kbd> : Rotate CCW
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">↓</kbd> : Soft Drop
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-300 border border-emerald-700">Space</kbd> : Hard Drop
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-purple-300 border border-purple-700">C</kbd> : Hold
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">P</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">Esc</kbd> : Pause
        </span>
      </div>

      <div className="flex items-center gap-1 text-[10px] text-zinc-500">
        <HelpCircle className="w-3 h-3" />
        <span>Kiro Hackathon Edition</span>
      </div>
    </div>
  );
};
