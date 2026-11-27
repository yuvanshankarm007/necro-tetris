import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './core/gameEngine';
import { CRTRenderer } from './renderer/crtRenderer';
import { TetrisInputHandler } from './core/inputHandler';
import { spookyAudio } from './audio/spookySynth';
import { kiroCrew } from './ai/kiroCrew';
import { aiSolver } from './ai/heuristicSolver';
import { DisplayTheme, CurseType, AgentChatMessage } from './core/types';
import { THEME_CONFIG } from './core/constants';
import { Header } from './components/Header';
import { HoldQueue } from './components/HoldQueue';
import { NextQueue } from './components/NextQueue';
import { SeanceTerminal } from './components/SeanceTerminal';
import { MobileControls } from './components/MobileControls';
import { ControlsGuide } from './components/ControlsGuide';
import { Skull, RotateCcw } from 'lucide-react';

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine>(new GameEngine());
  const rendererRef = useRef<CRTRenderer | null>(null);
  const inputHandlerRef = useRef<TetrisInputHandler | null>(null);

  // React UI States
  const [theme, setTheme] = useState<DisplayTheme>('soviet_green');
  const [isCrtEnabled, setIsCrtEnabled] = useState(true);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [actionBanner, setActionBanner] = useState<string | null>(null);
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [, setTick] = useState(0);

  const isSovietMode = theme === 'soviet_green' || theme === 'soviet_amber';
  const config = THEME_CONFIG[theme];

  const syncState = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  const triggerActionBanner = useCallback((text: string) => {
    setActionBanner(text);
    setTimeout(() => {
      setActionBanner(null);
    }, 1200);
  }, []);

  // Initialize Input Handler with DAS/ARR
  useEffect(() => {
    const engine = engineRef.current;

    const input = new TetrisInputHandler({
      onMoveLeft: () => {
        if (engine.moveLeft()) {
          spookyAudio.playMove();
          syncState();
          return true;
        }
        return false;
      },
      onMoveRight: () => {
        if (engine.moveRight()) {
          spookyAudio.playMove();
          syncState();
          return true;
        }
        return false;
      },
      onSoftDrop: () => {
        if (engine.softDrop()) {
          spookyAudio.playMove();
          syncState();
          return true;
        }
        return false;
      },
      onHardDrop: () => {
        const dropped = engine.hardDrop();
        if (dropped > 0) {
          spookyAudio.playHardDrop();
          if (engine.state.lastClearCount > 0) {
            spookyAudio.playLineClear(engine.state.lastClearCount);
            rendererRef.current?.spawnLineClearParticles(18, engine.state.lastClearCount, theme);
            kiroCrew.notifyLineClear(
              engine.state.lastClearCount,
              engine.state.stats.score,
              engine.state.stats.combos
            );
            if (engine.state.lastActionText) {
              triggerActionBanner(engine.state.lastActionText);
            }
            engine.state.lastClearCount = 0;
          }
          syncState();
        }
      },
      onRotateCW: () => {
        if (engine.rotate('clockwise')) {
          spookyAudio.playRotate();
          syncState();
        }
      },
      onRotateCCW: () => {
        if (engine.rotate('counterclockwise')) {
          spookyAudio.playRotate();
          syncState();
        }
      },
      onHold: () => {
        if (engine.hold()) {
          spookyAudio.playRotate();
          syncState();
        }
      },
      onPause: () => {
        engine.state.isPaused = !engine.state.isPaused;
        setIsPaused(engine.state.isPaused);
        syncState();
      },
    });

    inputHandlerRef.current = input;

    const onKeyDown = (e: KeyboardEvent) => {
      // Shortcuts for theme and mute
      if (e.code === 'Digit1') setTheme('soviet_green');
      else if (e.code === 'Digit2') setTheme('soviet_amber');
      else if (e.code === 'Digit3') setTheme('gothic_blood');
      else if (e.code === 'Digit4') setTheme('spectral_cyan');
      else if (e.code === 'KeyM') handleToggleMute();
      else {
        input.handleKeyDown(e);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      input.handleKeyUp(e);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      input.reset();
    };
  }, [theme, syncState, triggerActionBanner]);

  // Initialize Canvas Renderer & Audio Listeners
  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      rendererRef.current = new CRTRenderer(canvasRef.current);
    }

    const engine = engineRef.current;
    engine.start();
    kiroCrew.notifyGameStart();

    const unsubscribeCrew = kiroCrew.subscribeMessages((msg) => {
      setMessages((prev) => [...prev.slice(-30), msg]);
    });

    const unsubscribeCurses = kiroCrew.subscribeCurses((curse) => {
      engine.applyCurse(curse);
      spookyAudio.playCurseTrigger();
      syncState();
    });

    return () => {
      unsubscribeCrew();
      unsubscribeCurses();
      spookyAudio.stopBGM();
    };
  }, [syncState]);

  // Main 60 FPS Game & Render Loop
  useEffect(() => {
    let animId: number;

    const gameLoop = (time: number) => {
      const engine = engineRef.current;
      const renderer = rendererRef.current;

      if (engine && !engine.state.gameOver && !engine.state.isPaused) {
        const changed = engine.update(time);

        // Check if line clears happened during game update
        if (engine.state.lastClearCount > 0) {
          spookyAudio.playLineClear(engine.state.lastClearCount);
          renderer?.spawnLineClearParticles(18, engine.state.lastClearCount, theme);
          kiroCrew.notifyLineClear(
            engine.state.lastClearCount,
            engine.state.stats.score,
            engine.state.stats.combos
          );
          if (engine.state.lastActionText) {
            triggerActionBanner(engine.state.lastActionText);
          }
          engine.state.lastClearCount = 0;
        }

        // Check near death condition
        kiroCrew.notifyNearDeath(engine.getHighestFilledRow());

        // Check Game Over
        if (engine.state.gameOver) {
          spookyAudio.playGameOver();
          kiroCrew.notifyGameOver({
            score: engine.state.stats.score,
            lines: engine.state.stats.lines,
            exorcisms: engine.state.stats.exorcisms,
          });
          syncState();
        } else if (changed) {
          syncState();
        }
      }

      // Draw canvas
      if (renderer && engine) {
        renderer.render(
          engine.state.matrix,
          engine.state.activePiece,
          theme,
          engine.state.activeCurse,
          isSovietMode,
          actionBanner
        );
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [theme, isSovietMode, actionBanner, syncState, triggerActionBanner]);

  // Autonomous AI Auto-Play Loop
  useEffect(() => {
    let autoPlayInterval: number;

    if (isAutoPlay) {
      autoPlayInterval = window.setInterval(() => {
        const engine = engineRef.current;
        if (engine.state.activePiece && !engine.state.gameOver && !engine.state.isPaused) {
          const move = aiSolver.findBestMove(engine.state.matrix, engine.state.activePiece.type);
          if (move) {
            while (engine.state.activePiece.rotation !== move.rotation) {
              engine.rotate('clockwise');
            }
            while (engine.state.activePiece.x < move.targetX) {
              engine.moveRight();
            }
            while (engine.state.activePiece.x > move.targetX) {
              engine.moveLeft();
            }
            engine.hardDrop();
            spookyAudio.playHardDrop();
            if (engine.state.lastClearCount > 0) {
              spookyAudio.playLineClear(engine.state.lastClearCount);
              rendererRef.current?.spawnLineClearParticles(18, engine.state.lastClearCount, theme);
              kiroCrew.notifyLineClear(
                engine.state.lastClearCount,
                engine.state.stats.score,
                engine.state.stats.combos
              );
              if (engine.state.lastActionText) {
                triggerActionBanner(engine.state.lastActionText);
              }
              engine.state.lastClearCount = 0;
            }
            syncState();
          }
        }
      }, 240);
    }

    return () => {
      clearInterval(autoPlayInterval);
    };
  }, [isAutoPlay, theme, syncState, triggerActionBanner]);

  // Control Callbacks
  const handleRestart = () => {
    inputHandlerRef.current?.reset();
    engineRef.current.start();
    kiroCrew.notifyGameStart();
    setIsPaused(false);
    setActionBanner(null);
    syncState();
  };

  const handleTogglePause = () => {
    engineRef.current.state.isPaused = !engineRef.current.state.isPaused;
    setIsPaused(engineRef.current.state.isPaused);
    syncState();
  };

  const handleToggleBgm = () => {
    if (isBgmPlaying) {
      spookyAudio.stopBGM();
      setIsBgmPlaying(false);
    } else {
      spookyAudio.startBGM();
      setIsBgmPlaying(true);
    }
  };

  const handleToggleMute = () => {
    const muted = spookyAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleTriggerCurse = (curse: CurseType) => {
    kiroCrew.triggerPoltergeistCurse(curse);
  };

  const handleSendMessage = (text: string) => {
    const userMsg: AgentChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'system',
      name: 'Mortal Player',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const bestMove = aiSolver.findBestMove(
        engineRef.current.state.matrix,
        engineRef.current.state.activePiece?.type || 'T'
      );
      const reply = bestMove
        ? `Tactical telemetry: ${bestMove.explanation} (Dellacherie heuristic score: ${Math.round(bestMove.score)})`
        : 'Keep stacking flatly, comrade. Avoid creating covered holes.';

      const ghostMsg: AgentChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'pajitnov',
        name: "The Architect's Ghost",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        sentiment: 'strategic',
      };
      setMessages((prev) => [...prev, ghostMsg]);
    }, 600);
  };

  const engine = engineRef.current;

  return (
    <div
      className="min-h-screen flex flex-col bg-[#030704] text-zinc-100 selection:bg-purple-900 selection:text-white"
      style={{
        backgroundImage: `radial-gradient(ellipse at 50% 0%, ${config.accentGlow} 0%, transparent 65%)`,
      }}
    >
      <Header
        theme={theme}
        onThemeChange={setTheme}
        isCrtEnabled={isCrtEnabled}
        onToggleCrt={() => setIsCrtEnabled((v) => !v)}
        isBgmPlaying={isBgmPlaying}
        onToggleBgm={handleToggleBgm}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        onRestart={handleRestart}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 w-full">
          <HoldQueue
            holdPiece={engine.state.holdPiece}
            canHold={engine.state.canHold}
            stats={engine.state.stats}
            activeCurse={engine.state.activeCurse}
            theme={theme}
            isSovietMode={isSovietMode}
          />

          <div className="flex flex-col items-center">
            <div
              className={`relative p-3.5 md:p-5 rounded-2xl md:rounded-3xl bg-zinc-950 border-4 border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.9)] ${
                isCrtEnabled ? 'crt-screen crt-flicker' : ''
              }`}
              style={{
                boxShadow: `0 0 35px ${config.accentGlow}, inset 0 0 20px rgba(0,0,0,0.9)`,
              }}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80 text-[10px] font-mono text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  ELEKTRONIKA-60 [TERMINAL_01]
                </span>
                <span style={{ color: config.primaryText }}>60 FPS V-SYNC • DAS/ARR ACTIVE</span>
              </div>

              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={600}
                  className="rounded bg-black block border border-zinc-900"
                />

                {engine.state.isPaused && (
                  <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                    <span
                      className="text-2xl font-bold font-mono tracking-widest uppercase mb-2"
                      style={{ color: config.primaryText }}
                    >
                      SÉANCE PAUSED
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      Press P or ESC to Resume
                    </span>
                  </div>
                )}

                {engine.state.gameOver && (
                  <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center animate-in fade-in duration-300">
                    <Skull className="w-12 h-12 text-red-500 mb-2 animate-bounce" />
                    <h2 className="text-2xl font-bold font-mono text-red-500 tracking-widest uppercase mb-1">
                      ETERNAL REST
                    </h2>
                    <p className="text-xs text-zinc-400 font-mono mb-4">
                      The crypt is sealed. The Architect's ghost records your epitaph.
                    </p>

                    <div className="bg-black/60 border border-zinc-800 rounded p-3 mb-4 w-full text-xs font-mono">
                      <div className="flex justify-between py-0.5">
                        <span className="text-zinc-500">Final Score:</span>
                        <span className="font-bold text-zinc-200">
                          {engine.state.stats.score.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-zinc-500">Exorcisms:</span>
                        <span className="font-bold text-cyan-400">
                          {engine.state.stats.exorcisms}
                        </span>
                      </div>
                      {engine.state.stats.tSpins > 0 && (
                        <div className="flex justify-between py-0.5">
                          <span className="text-zinc-500">T-Spins:</span>
                          <span className="font-bold text-purple-400">
                            {engine.state.stats.tSpins}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between py-0.5">
                        <span className="text-zinc-500">Lines Cleared:</span>
                        <span className="font-bold text-zinc-200">
                          {engine.state.stats.lines}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleRestart}
                      className="px-4 py-2 bg-red-950/80 hover:bg-red-900 border border-red-700 rounded-lg text-xs font-mono font-bold text-red-200 flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reanimate Silicon (Restart)</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-zinc-800/80 flex items-center justify-between text-[9px] font-mono text-zinc-600">
                <span>SRS-5TEST: ACTIVE</span>
                <span>T-SPIN 3-CORNER: ENABLED</span>
              </div>
            </div>

            <MobileControls
              onMoveLeft={() => {
                if (engine.moveLeft()) {
                  spookyAudio.playMove();
                  syncState();
                }
              }}
              onMoveRight={() => {
                if (engine.moveRight()) {
                  spookyAudio.playMove();
                  syncState();
                }
              }}
              onSoftDrop={() => {
                if (engine.softDrop()) {
                  spookyAudio.playMove();
                  syncState();
                }
              }}
              onHardDrop={() => {
                const dropped = engine.hardDrop();
                if (dropped > 0) {
                  spookyAudio.playHardDrop();
                  if (engine.state.lastClearCount > 0) {
                    spookyAudio.playLineClear(engine.state.lastClearCount);
                    rendererRef.current?.spawnLineClearParticles(18, engine.state.lastClearCount, theme);
                    kiroCrew.notifyLineClear(
                      engine.state.lastClearCount,
                      engine.state.stats.score,
                      engine.state.stats.combos
                    );
                    if (engine.state.lastActionText) {
                      triggerActionBanner(engine.state.lastActionText);
                    }
                    engine.state.lastClearCount = 0;
                  }
                  syncState();
                }
              }}
              onRotateCW={() => {
                if (engine.rotate('clockwise')) {
                  spookyAudio.playRotate();
                  syncState();
                }
              }}
              onRotateCCW={() => {
                if (engine.rotate('counterclockwise')) {
                  spookyAudio.playRotate();
                  syncState();
                }
              }}
              onHold={() => {
                if (engine.hold()) {
                  spookyAudio.playRotate();
                  syncState();
                }
              }}
            />
          </div>

          <NextQueue
            nextPieces={engine.state.nextPieces}
            theme={theme}
            isSovietMode={isSovietMode}
            isAutoPlay={isAutoPlay}
            onToggleAutoPlay={() => setIsAutoPlay((v) => !v)}
            onTriggerCurse={handleTriggerCurse}
          />
        </div>

        <div className="flex flex-col gap-4 w-full max-w-5xl mt-6">
          <ControlsGuide />
          <SeanceTerminal
            messages={messages}
            onSendMessage={handleSendMessage}
            theme={theme}
          />
        </div>
      </main>

      <footer className="p-3 border-t border-zinc-900 bg-black/80 text-center text-xs font-mono text-zinc-600 flex flex-wrap items-center justify-center gap-4">
        <span>Kiroween 2026 Hackathon Submission</span>
        <span>•</span>
        <span>Resurrection Category</span>
        <span>•</span>
        <span className="text-zinc-400">Public Open-Source GPLv3 License</span>
      </footer>
    </div>
  );
};

export default App;
