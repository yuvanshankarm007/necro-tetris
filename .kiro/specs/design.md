# NecroBlocks: Architecture & Technical Design

## 1. System Architecture Diagram

```
+---------------------------------------------------------------------------------+
|                                 NecroBlocks UI                                  |
|  +--------------------+  +----------------------------+  +--------------------+  |
|  |    Hold & Stats    |  |     Canvas 2D Renderer     |  |    Upcoming Queue  |  |
|  | - Hold Polyomino   |  | - Dual CRT Phosphor Engine |  | - Next 5 Pieces    |  |
|  | - Score & Souls    |  | - Screen Shake & Particles |  | - Level & Speed    |  |
|  | - Active Curses    |  | - Ghost Piece Projection   |  | - Exorcisms Count  |  |
|  +--------------------+  +----------------------------+  +--------------------+  |
+---------------------------------------------------------------------------------+
|                           Haunted Web Audio Synth Engine                         |
|  - 8-bit Original Crypt Hymn (Web Audio API Synthesizer)                        |
|  - Custom SFX: Rotation, Hard Drop Thud, Exorcism Bell, Game Over Dirge         |
+---------------------------------------------------------------------------------+
|                            Core Puzzle Logic Engine                             |
|  - SRS Rotation & Wall-Kick Matrix                                               |
|  - 7-Bag Randomizer & Lock-Delay State Machine                                   |
|  - Cursed Spell Engine (Fog, Poltergeist Shift, Inversion, Crumble)             |
+---------------------------------------------------------------------------------+
|                         Kiro Crew Multi-Agent Bridge (A2A)                      |
|  - The Architect's Ghost (Heuristic Evaluator + Auto-Play Solver)               |
|  - The Poltergeist (Chaos Adversary & Dynamic Event Trigger)                    |
|  - The Gravedigger (Procedural Crypt Lore & Event Commentary)                   |
|  - AG-UI Protocol: Live streaming Séance Terminal & Human-in-the-Loop Feedback |
+---------------------------------------------------------------------------------+
|                         Model Context Protocol (MCP) Bridge                     |
|  - get_board_state, suggest_move, cast_curse, get_graveyard_stats               |
+---------------------------------------------------------------------------------+
|                         Verification & PBT Guardrails                            |
|  - fast-check Property-Based Test Suites (SRS bounds, 7-bag fairness)           |
|  - .kiro Automated Pre-Commit & Invariant Audit Hooks                            |
+---------------------------------------------------------------------------------+
```

## 2. Core Modules & Data Structures

### 2.1 State Representation
```typescript
export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface MatrixCell {
  filled: boolean;
  color: string;
  type?: TetrominoType;
  curseState?: 'normal' | 'tombstone' | 'haunted' | 'rotting';
  glow?: number;
}

export interface ActivePiece {
  type: TetrominoType;
  x: number;
  y: number;
  rotation: 0 | 1 | 2 | 3; // 0: Spawn, 1: R, 2: 2, 3: L
}

export type CurseType = 'fog_of_war' | 'poltergeist_shift' | 'soul_inversion' | 'tombstone_crumble' | 'none';
```

### 2.2 Audio Synthesis Pipeline
Uses native Web Audio API `AudioContext` with `OscillatorNode` (square, saw, triangle waves) and `BiquadFilterNode` (lowpass for crypt dampening and resonance) + `GainNode` envelope ADSR (Attack, Decay, Sustain, Release).

### 2.4 Three-Tier Agent Protocol Stack (MCP + A2A + AG-UI)
1. **MCP (Model Context Protocol)**: Exposes tool execution interfaces to both internal and external agents via `.kiro/mcp.json`.
2. **A2A (Agent2Agent Protocol)**: Enables asynchronous, contract-driven delegation between *The Architect*, *The Poltergeist*, and *The Gravedigger*.
3. **AG-UI (Agent-User Interaction Protocol)**: Streams agent thoughts, tactical placement recommendations, and curse warnings directly into the React user interface.

### 2.5 Kiro Crew Heuristic Solver
The Architect's Ghost calculates placement scores using the weighted Pierre Dellacherie evaluation algorithm:
- Aggregate Height (penalty)
- Complete Lines (huge reward)
- Holes / Buried Emptiness (severe penalty)
- Bumpiness / Surface Roughness (penalty)
- Well Depth / Readiness (reward)
