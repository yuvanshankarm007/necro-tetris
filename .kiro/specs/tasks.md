# NecroTetris: Spec-Driven Task Breakdown

## Phase 1: Core Engine & Math Foundation
- [x] Task 1.1: Define tetromino shapes, spawn coordinates, and color schemes.
- [x] Task 1.2: Implement 7-Bag randomizer generator.
- [x] Task 1.3: Implement SRS (Super Rotation System) with full 5-test wall-kick matrices.
- [x] Task 1.4: Implement line-clear detection, scoring, level progression, and lock delay.
- [x] Task 1.5: Write `fast-check` Property-Based Tests (PBT) verifying rotational boundary invariants.

## Phase 2: Haunted Audio-Visual Experience
- [x] Task 2.1: Implement Web Audio API procedural synthesizer for 8-bit minor *Korobeiniki* BGM.
- [x] Task 2.2: Implement procedural SFX (rotations, drops, line-clear bell, game over toll).
- [x] Task 2.3: Build dual CRT Canvas renderer:
  - 1984 Soviet Elektronika 60 terminal (ASCII `[ ]` phosphor green/amber).
  - Gothic Crypt (blood amber / spectral violet with glowing particle bursts).
- [x] Task 2.4: Implement screen shake, ghost piece projection, and particle effects.

## Phase 3: Battle Gaiden Curses & Mechanics
- [x] Task 3.1: Implement curse state machine (Fog of War, Poltergeist Shift, Soul Inversion, Tombstone Crumble).
- [x] Task 3.2: Implement curse triggers and exorcism line clears.
- [x] Task 3.3: Visual and audio representations of active curses.

## Phase 4: Kiro Crew Multi-Agent Integration
- [x] Task 4.1: Configure Kiro Crew agent specs (`pajitnov-ghost`, `poltergeist`, `gravedigger`).
- [x] Task 4.2: Build Dellacherie heuristic solver for Dr. Pajitnov's tactical co-pilot and Auto-Play mode.
- [x] Task 4.3: Implement interactive Séance Terminal showing real-time agent dialogue, advice, and taunts.
- [x] Task 4.4: Add Model Context Protocol (`mcp.json`) descriptor for external agent control.

## Phase 5: Verification, Zero-Crash Resilience & Pitch Pack
- [x] Task 5.1: Verify end-to-end build with zero runtime errors.
- [x] Task 5.2: Create `.kiro/hooks/` for automated pre-commit and invariant audits.
- [x] Task 5.3: Generate open-source MIT LICENSE file.
- [x] Task 5.4: Assemble comprehensive `DEVPOST.md` with demo scripts, Kiro writeup, and architecture diagrams.
