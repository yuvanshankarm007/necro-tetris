import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Award, Sparkles, Cpu, Layers, ShieldCheck, Terminal } from 'lucide-react';
import { DisplayTheme } from '../core/types';
import { THEME_CONFIG } from '../core/constants';

interface JudgeTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: DisplayTheme;
}

export const JudgeTourModal: React.FC<JudgeTourModalProps> = ({ isOpen, onClose, theme }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const config = THEME_CONFIG[theme];

  if (!isOpen) return null;

  const slides = [
    {
      badge: '1984 RESURRECTION CATEGORY',
      title: 'Resurrecting 1984 2D Bin-Packing for 2026 Cloud Memory',
      icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
      content: (
        <div className="space-y-3 text-xs text-zinc-300">
          <p>
            In 1984, computer scientist <strong>Alexey Pajitnov</strong> conducted combinatorial geometry and 2D bin-packing research at the Soviet Academy of Sciences Dorodnitsyn Computing Centre. In the 1990s, <strong>MS-DOS DEFRAG</strong> and <strong>Norton SpeedDisk</strong> made memory and disk compaction an iconic tactile visual experience.
          </p>
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-emerald-400 font-bold block">The 2026 Problem We Solve:</span>
            <ul className="list-disc pl-4 space-y-1 text-zinc-400">
              <li><strong>Kubernetes Container Memory Bloat</strong>: Microservices crash from Linux kernel Out-Of-Memory (<code className="text-red-400">OOMKilled</code>) panics caused by uncollected allocations and internal fragmentation.</li>
              <li><strong>LLM KV-Cache Fragmentation</strong>: Transformers running in vLLM / PagedAttention fragment memory across variable prompt context lengths.</li>
              <li><strong>Defrag84 Solution</strong>: Maps physical container heap to a 10x20 page matrix (25.6 MB), executing atomic major GC sweeps on line completion.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      badge: 'AGENT ARCHITECTURE',
      title: 'The 3-Tier Multi-Agent Protocol Stack (MCP + A2A + AG-UI)',
      icon: <Layers className="w-6 h-6 text-cyan-400" />,
      content: (
        <div className="space-y-3 text-xs text-zinc-300">
          <p>
            Defrag84 is powered by <strong>Kiro Crew</strong>, coordinating three autonomous system daemons over the standardized 2026 agent protocol stack:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2.5 rounded bg-orange-950/30 border border-orange-800/60">
              <span className="text-orange-400 font-bold block mb-1">Layer 1: MCP</span>
              <p className="text-zinc-400">Connects agents to live tools via <code className="text-orange-300">.kiro/mcp.json</code>: telemetry inspection, heuristic move scoring, and chaos injection.</p>
            </div>
            <div className="p-2.5 rounded bg-blue-950/30 border border-blue-800/60">
              <span className="text-blue-400 font-bold block mb-1">Layer 2: A2A</span>
              <p className="text-zinc-400">Autonomous inter-daemon communication between <code className="text-blue-300">gc-optimizer</code>, <code className="text-blue-300">chaos-monkey</code>, and <code className="text-blue-300">memory-profiler</code>.</p>
            </div>
            <div className="p-2.5 rounded bg-purple-950/30 border border-purple-800/60">
              <span className="text-purple-400 font-bold block mb-1">Layer 3: AG-UI</span>
              <p className="text-zinc-400">Real-time reactive HUD streaming daemon thoughts, tactical placement advice, and human-in-the-loop overrides.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: 'PRODUCTION RESILIENCE',
      title: 'Zero-Crash Guarantee & Forensic Export',
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      content: (
        <div className="space-y-3 text-xs text-zinc-300">
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
              <span className="text-emerald-400 font-bold block mb-1">100% Web Audio Synthesizer</span>
              <p className="text-zinc-400">Zero external <code className="text-zinc-300">.mp3</code> or <code className="text-zinc-300">.wav</code> files. Procedurally synthesizes 8-bit crypt dirge and mechanical relay clicks.</p>
            </div>
            <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
              <span className="text-cyan-400 font-bold block mb-1">Property-Based Testing (PBT)</span>
              <p className="text-zinc-400">Verified with <code className="text-zinc-300">fast-check</code>: proves SRS rotational bounds, 7-bag permutation fairness, and memory conservation invariants.</p>
            </div>
            <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
              <span className="text-amber-400 font-bold block mb-1">Forensic Core Dump Exporter</span>
              <p className="text-zinc-400">Download authentic Linux kernel OOM crash dumps with eBPF stack traces and memory page dumps (.json / .log).</p>
            </div>
            <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
              <span className="text-red-400 font-bold block mb-1">Netflix Chaos Monkey Mode</span>
              <p className="text-zinc-400">Inject memory leaks, thread context switches, pointer inversions, and ECC bit-rot anomalies in real time.</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl bg-zinc-950 border-2 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-mono animate-in fade-in zoom-in-95 duration-200"
        style={{ borderColor: config.gridLine }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: config.gridLine }}>
          <div className="flex items-center gap-2">
            {slides[currentSlide].icon}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold block">
                {slides[currentSlide].badge}
              </span>
              <h2 className="text-base font-bold text-white tracking-wide">
                {slides[currentSlide].title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Content */}
        <div className="py-2 min-h-[220px]">
          {slides[currentSlide].content}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: config.gridLine }}>
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'bg-emerald-400 w-6' : 'bg-zinc-700 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentSlide > 0 && (
              <button
                onClick={() => setCurrentSlide((s) => s - 1)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            )}

            {currentSlide < slides.length - 1 ? (
              <button
                onClick={() => setCurrentSlide((s) => s + 1)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-black font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs text-black font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                Explore Defrag84
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
