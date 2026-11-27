# NecroBlocks: The 1984 Reanimation — Requirements Specification

## 1. Overview & Hackathon Problem Statement
**Hackathon Category**: Resurrection (Kiroween 2026)  
**Target Solution**: Resurrect the 1984 monochrome computer terminal environment and the forgotten 1990s competitive puzzle spellcasting mechanics, reimagining them as an atmospheric, haunted competitive and co-operative falling-block puzzle game steered by a crew of autonomous AI agents (**Kiro Crew**).

---

## 2. Functional Requirements

### 2.1 Authentic Falling-Polyomino Guideline Engine
- **Matrix Dimension**: Standard 10 columns × 20 visible rows (plus 2 buffer hidden rows 21–22).
- **The 7 Standard Polyominoes**: I, J, L, O, S, T, Z with standard color mappings and gothic/phosphor skin adaptations.
- **Super Rotation System (SRS)**: Complete rotation states (0, R, 2, L) with standard 5-test wall-kick matrices for standard pieces and dedicated I-piece kicks.
- **Randomizer**: Fair 7-Bag generation (Bag of all 7 pieces shuffled, guaranteeing no drought exceeding 12 turns).
- **Gravity & Speeds**: Base gravity with logarithmic speed curve per level (Levels 1 to 15+).
- **Lock Delay**: 500ms lock delay with reset limit on movement/rotation to allow tactical sliding.
- **Ghost Piece**: Visual projection indicating where the active piece will land upon Hard Drop.
- **Hold Queue**: Dedicated hold slot with 1-swap-per-turn limit.
- **Line Clears & Scoring**: Single, Double, Triple, and 4-line Exorcism (Back-to-Back bonuses), plus tactical spin detection.

### 2.2 Resurrection & Spooky Mechanics ("The Kiroween Twist")
- **Dual Display Modes**:
  1. *1984 Monochrome CRT Phosphor Terminal*: Authentic ASCII character blocks (`[ ]`), scanlines, phosphor persistence ghosting, amber/green glow, and curvature.
  2. *Gothic Mausoleum (Blood/Spectral)*: High-res dark fantasy crypt aesthetic with floating runes, stone-etched blocks, and particle exorcisms.
- **Cursed Spellcasting Mechanics**:
  - *Fog of War*: Eerie graveyard mist obscures lower rows.
  - *Poltergeist Shift*: Telekinetic disturbance nudges active blocks sideways.
  - *Soul Inversion*: Temporary inverted gravity pulling blocks to the ceiling.
  - *Tombstone Crumble*: Fragile blocks that shatter into debris under hard drop impact.
  - *Banish Curse*: Clearing a 4-line Exorcism purges active curses and grants spell shields.

### 2.3 Audio Synthesizer (100% Web Native)
- Zero external `.mp3`/`.wav` dependencies (prevents broken assets or CORS failures in judging demos).
- Built-in Web Audio API 8-bit synthesizer playing an original haunting minor-key arrangement with pipe organ harmonics.
- Procedural sound effects: piece rotate clicks, hard drop thuds, line clear exorcism bells, level-up chimes, and game-over tolling.

### 2.4 Kiro Crew Multi-Agent Co-Pilot & Adversary
- **Agent 1: The Architect's Ghost (Tactical Co-Pilot)**: Real-time board evaluator calculating optimal placement, spin setups, and automated autonomous play mode ("Summon Ghost to Play").
- **Agent 2: The Poltergeist (Chaos Adversary)**: Spawns curses, alters game speed dynamically, and taunts the player.
- **Agent 3: The Gravedigger (Crypt Narrator)**: Live atmospheric narrative feed commenting on close calls, misdrops, and high scores.
- **Interactive Séance Terminal**: Live communication window displaying real-time reasoning and banter between agents.

---

## 3. Non-Functional & Verification Requirements
- **60 FPS Performance**: RequestAnimationFrame Canvas renderer optimized with zero memory leaks.
- **Property-Based Testing (PBT)**: Comprehensive invariant verification using `fast-check` to prove that:
  1. SRS rotation never permits pieces to clip out-of-bounds or overlap fixed blocks.
  2. 7-Bag randomizer maintains uniform piece distribution without starvation.
  3. Gravity collapse preserves line count and non-cleared cell states.
- **Zero-Crash Resilience**: Full offline fallback and self-contained state machine.
