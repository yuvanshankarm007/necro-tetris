import React, { useState, useRef, useEffect } from 'react';
import { X, Video, StopCircle, Download, ExternalLink, Play, CheckCircle, Sparkles, Mic, Monitor } from 'lucide-react';
import { DisplayTheme } from '../core/types';
import { THEME_CONFIG } from '../core/constants';

interface VideoRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: DisplayTheme;
  onAutoPlayEnable: () => void;
  onBgmEnable: () => void;
}

export const VideoRecorderModal: React.FC<VideoRecorderModalProps> = ({
  isOpen,
  onClose,
  theme,
  onAutoPlayEnable,
  onBgmEnable,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingMode, setRecordingMode] = useState<'screen' | 'canvas'>('screen');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  const config = THEME_CONFIG[theme];

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleStartRecording = async () => {
    setErrorMsg(null);
    setRecordedBlobUrl(null);
    recordedChunksRef.current = [];

    try {
      let stream: MediaStream;

      if (recordingMode === 'screen' && navigator.mediaDevices?.getDisplayMedia) {
        // Record entire tab or screen with audio
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 60 },
          audio: true,
        });
      } else {
        // Fallback: capture main game canvas
        const canvas = document.querySelector('canvas');
        if (!canvas) throw new Error('Game canvas not found.');
        stream = (canvas as any).captureStream ? (canvas as any).captureStream(60) : null;
        if (!stream) throw new Error('Canvas capture not supported in this browser.');
      }

      // Automatically engage AI Compactor and 8-bit Synth for an awesome demo!
      onAutoPlayEnable();
      onBgmEnable();

      const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? { mimeType: 'video/webm;codecs=vp9,opus' }
        : MediaRecorder.isTypeSupported('video/webm')
        ? { mimeType: 'video/webm' }
        : {};

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
        setIsRecording(false);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        // Stop all media tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      // Handle stream user cancellation (e.g. user clicks "Stop sharing")
      stream.getVideoTracks()[0].onended = () => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      };

      recorder.start(500); // 500ms time slice
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Failed to start recording:', err);
      setErrorMsg(err.message || 'Could not start screen capture.');
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDownload = () => {
    if (!recordedBlobUrl) return;
    const a = document.createElement('a');
    a.href = recordedBlobUrl;
    a.download = `defrag84_demo_recording_${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl bg-zinc-950 border-2 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-mono animate-in fade-in zoom-in-95 duration-200"
        style={{ borderColor: config.gridLine }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: config.gridLine }}>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-red-500 animate-pulse" />
            <div>
              <span className="text-[10px] uppercase tracking-widest text-red-400 font-bold block">
                ONE-CLICK SCREEN RECORDER
              </span>
              <h2 className="text-base font-bold text-white tracking-wide">
                Record Demo Video for Devpost
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

        {/* Body */}
        <div className="space-y-4 text-xs text-zinc-300">
          <p className="text-zinc-400">
            This tool records your screen and audio directly from the browser, runs the autonomous AI compactor, and gives you a video file ready to upload to YouTube!
          </p>

          {/* Mode Selector */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <span className="text-zinc-300 font-bold">Capture Source:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRecordingMode('screen')}
                disabled={isRecording}
                className={`px-3 py-1 rounded text-xs cursor-pointer transition-colors flex items-center gap-1.5 ${
                  recordingMode === 'screen'
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Entire Tab (Recommended)
              </button>
              <button
                onClick={() => setRecordingMode('canvas')}
                disabled={isRecording}
                className={`px-3 py-1 rounded text-xs cursor-pointer transition-colors flex items-center gap-1.5 ${
                  recordingMode === 'canvas'
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Canvas Matrix Only
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-700 text-red-300 text-xs">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Recording Controls & Timer */}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-center">
            <div className="text-3xl font-bold font-mono text-white flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-zinc-600'}`} />
              <span>{formatTime(recordingSeconds)}</span>
              {isRecording && <span className="text-xs text-red-400 uppercase tracking-widest ml-2">REC</span>}
            </div>

            <p className="text-[11px] text-zinc-500">
              {isRecording
                ? 'Recording in progress! The AI is playing automatically. Switch to the game tab and let it record for ~60 seconds.'
                : 'Click Start Recording. A browser prompt will ask you to select the tab or screen.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                >
                  <Video className="w-4 h-4" />
                  <span>Start Recording Tab</span>
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="px-6 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-black font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-lg animate-pulse"
                >
                  <StopCircle className="w-4 h-4 text-red-600" />
                  <span>Stop & Finish Recording</span>
                </button>
              )}
            </div>
          </div>

          {/* Output Video & Download Actions */}
          {recordedBlobUrl && (
            <div className="p-4 rounded-xl bg-zinc-950 border-2 border-emerald-500/80 space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Recording Completed ({formatTime(recordingSeconds)})
                </span>
              </div>

              <div className="aspect-video w-full rounded bg-black overflow-hidden border border-zinc-800">
                <video src={recordedBlobUrl} controls className="w-full h-full object-contain" />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Video (.webm)</span>
                </button>

                <a
                  href="https://youtube.com/upload"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Upload to YouTube</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Teleprompter / Talking Points */}
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] space-y-1.5">
            <span className="text-emerald-400 font-bold block flex items-center gap-1">
              <Mic className="w-3.5 h-3.5" />
              60-Second Video Cheat Sheet (What to Say/Show):
            </span>
            <ol className="list-decimal pl-4 space-y-1 text-zinc-400">
              <li><strong>0:00 - 0:20:</strong> Point to CRT terminal: <em>"Resurrecting 1984 2D bin-packing & MS-DOS DEFRAG to solve Kubernetes container memory bloat and LLM KV-cache fragmentation."</em></li>
              <li><strong>0:20 - 0:40:</strong> Show falling blocks & row sweeps: <em>"25.6 MB virtual heap. Autonomous Pierre Dellacherie GC daemon reclaims RAM with zero leaks."</em></li>
              <li><strong>0:40 - 1:00:</strong> Scroll to eBPF Heatmap: <em>"Live V8 memory bridge, 3-Tier Multi-Agent Stack (MCP + A2A + AG-UI), and forensic Linux kernel core dump exporter."</em></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
