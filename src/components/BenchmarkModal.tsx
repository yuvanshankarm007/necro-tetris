import React, { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, Award, CheckCircle, Copy, Share2, Timer, Zap, BarChart2 } from 'lucide-react';
import { GameStats, DisplayTheme } from '../core/types';
import { THEME_CONFIG } from '../core/constants';

interface BenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  theme: DisplayTheme;
  isAutoPlay: boolean;
  onToggleAutoPlay: () => void;
}

export const BenchmarkModal: React.FC<BenchmarkModalProps> = ({
  isOpen,
  onClose,
  stats,
  theme,
  isAutoPlay,
  onToggleAutoPlay,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [startStats, setStartStats] = useState<GameStats | null>(null);
  const [completedReport, setCompletedReport] = useState<{
    reclaimedMb: number;
    compactions: number;
    tSpins: number;
    scoreDelta: number;
    throughputKbSec: number;
    grade: string;
    mode: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const config = THEME_CONFIG[theme];
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0 && startStats) {
      // Benchmark finished! Compute report
      const deltaReclaimedKb = Math.max(0, stats.reclaimedKb - startStats.reclaimedKb);
      const deltaCompactions = Math.max(0, stats.exorcisms - startStats.exorcisms);
      const deltaSpins = Math.max(0, stats.tSpins - startStats.tSpins);
      const deltaScore = Math.max(0, stats.score - startStats.score);
      const throughputKbSec = Math.round(deltaReclaimedKb / 60);
      const reclaimedMb = Number((deltaReclaimedKb / 1024).toFixed(2));

      let grade = 'C';
      if (reclaimedMb >= 3.0 || deltaCompactions >= 3) grade = 'S-TIER (KERNEL SAVIOR)';
      else if (reclaimedMb >= 1.5 || deltaCompactions >= 2) grade = 'A-TIER (PRODUCTION READY)';
      else if (reclaimedMb >= 0.8) grade = 'B-TIER (ACCEPTABLE GC)';

      setCompletedReport({
        reclaimedMb,
        compactions: deltaCompactions,
        tSpins: deltaSpins,
        scoreDelta: deltaScore,
        throughputKbSec,
        grade,
        mode: isAutoPlay ? 'Autonomous GC Daemon (AI Auto-Pilot)' : 'Human Operator',
      });
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, startStats, stats, isAutoPlay]);

  if (!isOpen) return null;

  const handleStartBenchmark = () => {
    setStartStats({ ...stats });
    setTimeLeft(60);
    setCompletedReport(null);
    setIsActive(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(60);
    setStartStats(null);
    setCompletedReport(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleCopyReport = () => {
    if (!completedReport) return;
    const text = `🏆 Defrag84 60-Second Compaction Benchmark 🏆
Mode: ${completedReport.mode}
Grade: ${completedReport.grade}
RAM Reclaimed: ${completedReport.reclaimedMb} MB
Major Compactions (4-line): ${completedReport.compactions}
Spin-Inserts: ${completedReport.tSpins}
GC Throughput: ${completedReport.throughputKbSec} KB/s
Score: ${completedReport.scoreDelta} pts
Verified on Defrag84 - Kiroween 2026 Hackathon`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="w-full max-w-lg bg-zinc-950 border-2 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-mono animate-in fade-in zoom-in-95 duration-200"
        style={{ borderColor: config.gridLine }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: config.gridLine }}>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block">
                COMPACTION BENCHMARK CHALLENGE
              </span>
              <h2 className="text-base font-bold text-white tracking-wide">
                60-Second Garbage Collection Trial
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

        {/* Benchmark Body */}
        <div className="space-y-4 text-xs text-zinc-300">
          <p className="text-zinc-400">
            Measure how much RAM you (or the autonomous AI compactor) can reclaim in 60 seconds of heavy allocation pressure!
          </p>

          {/* Mode Selector Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
            <span className="text-zinc-300 font-bold">Execution Mode:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isAutoPlay) onToggleAutoPlay();
                }}
                className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-colors ${
                  !isAutoPlay ? 'bg-emerald-600 text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Human Operator
              </button>
              <button
                onClick={() => {
                  if (!isAutoPlay) onToggleAutoPlay();
                }}
                className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-colors ${
                  isAutoPlay ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                AI Daemon Autopilot
              </button>
            </div>
          </div>

          {/* Active Timer or Results */}
          {!completedReport ? (
            <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-center">
              <div className="flex items-center gap-2 text-3xl font-bold font-mono text-white">
                <Timer className={`w-8 h-8 ${isActive ? 'text-amber-400 animate-spin' : 'text-zinc-500'}`} />
                <span>{timeLeft}s</span>
              </div>

              <p className="text-[11px] text-zinc-500">
                {isActive
                  ? 'Compacting heap memory in real-time... Play actively or watch the AI compact!'
                  : 'Ready to start. Click Start Benchmark to run the 60s trial.'}
              </p>

              <div className="flex items-center gap-2 pt-2">
                {!isActive ? (
                  <button
                    onClick={handleStartBenchmark}
                    className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Start 60s Trial</span>
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Cancel Benchmark</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Completed Report Card */
            <div className="p-4 rounded-xl bg-zinc-950 border-2 border-emerald-500/80 space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest">
                  BENCHMARK RESULTS
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/40">
                  {completedReport.grade}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">RAM Reclaimed</span>
                  <span className="text-emerald-400 font-bold text-base">{completedReport.reclaimedMb} MB</span>
                </div>
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">Major Compactions</span>
                  <span className="text-cyan-400 font-bold text-base">{completedReport.compactions} sweeps</span>
                </div>
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">GC Throughput</span>
                  <span className="text-purple-400 font-bold text-base">{completedReport.throughputKbSec} KB/s</span>
                </div>
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">Score Gained</span>
                  <span className="text-zinc-200 font-bold text-base">{completedReport.scoreDelta.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleStartBenchmark}
                  className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try Again
                </button>

                <button
                  onClick={handleCopyReport}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-xs text-black font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied Certificate!' : 'Copy Certificate'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
