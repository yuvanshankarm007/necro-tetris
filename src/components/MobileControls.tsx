import React from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, RotateCw, RotateCcw, ArrowDownToLine, Ghost } from 'lucide-react';

interface MobileControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onRotateCW: () => void;
  onRotateCCW: () => void;
  onHold: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onSoftDrop,
  onHardDrop,
  onRotateCW,
  onRotateCCW,
  onHold,
}) => {
  return (
    <div className="flex md:hidden items-center justify-between w-full max-w-md mx-auto p-2 bg-black/70 rounded-xl border border-zinc-800 backdrop-blur-md select-none touch-none mt-2">
      {/* Directional Pad */}
      <div className="grid grid-cols-3 gap-1">
        <div />
        <button
          onClick={onHardDrop}
          className="w-11 h-11 bg-zinc-900 active:bg-zinc-700 border border-zinc-700 rounded-lg flex items-center justify-center text-cyan-400"
          title="Hard Drop"
        >
          <ArrowDownToLine className="w-5 h-5" />
        </button>
        <div />

        <button
          onClick={onMoveLeft}
          className="w-11 h-11 bg-zinc-900 active:bg-zinc-700 border border-zinc-700 rounded-lg flex items-center justify-center text-zinc-200"
          title="Move Left"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onSoftDrop}
          className="w-11 h-11 bg-zinc-900 active:bg-zinc-700 border border-zinc-700 rounded-lg flex items-center justify-center text-zinc-200"
          title="Soft Drop"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
        <button
          onClick={onMoveRight}
          className="w-11 h-11 bg-zinc-900 active:bg-zinc-700 border border-zinc-700 rounded-lg flex items-center justify-center text-zinc-200"
          title="Move Right"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onHold}
          className="w-11 h-11 bg-purple-950/60 active:bg-purple-900 border border-purple-800 rounded-lg flex items-center justify-center text-purple-300"
          title="Hold Piece"
        >
          <Ghost className="w-5 h-5" />
        </button>
        <button
          onClick={onRotateCCW}
          className="w-11 h-11 bg-zinc-900 active:bg-zinc-700 border border-zinc-700 rounded-lg flex items-center justify-center text-zinc-300"
          title="Rotate Counter-Clockwise"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={onRotateCW}
          className="w-12 h-12 bg-emerald-950/60 active:bg-emerald-900 border border-emerald-700 rounded-lg flex items-center justify-center text-emerald-300 font-bold"
          title="Rotate Clockwise"
        >
          <RotateCw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
