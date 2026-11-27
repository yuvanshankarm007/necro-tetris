# Devpost Submission Write-Up: GraveStack (Kiroween 2026)

## 📌 Project Overview
- **Project Name**: GraveStack: The 1984 Silicon Séance
- **Tagline**: Bringing 1984 monochrome terminal graphics and competitive puzzle spellcasting back to life with an autonomous Kiro Crew.
- **Category**: Resurrection
- **Bonus Prizes Considered**:
  - Best Kiro Crew App
  - Best Demo
  - Social Blitz Prize (`#KiroweenHackathon26`)
  - Bonus Blog Prize

---

## 💡 Inspiration
In 1984, before colorful home consoles or graphical windowing systems, computer scientists compiled mathematical block-fitting puzzles onto monochrome Soviet phosphor screens (Elektronika 60) using raw ASCII text bracket characters (`[ ]`). In the 1990s, competitive puzzle games introduced mystical spellcasting mechanics that forced opponents to battle through dense fog, inverted gravity, and cursed blocks—a brilliant mechanic lost to time.

For **Kiroween 2026**, we wanted to bring both dead technologies back to life. But instead of a simple emulator, we asked: **What if the vintage silicon itself was haunted? What if modern autonomous AI agents (Kiro Crew) inhabited the terminal alongside the player?**

---

## 👻 What It Does
**GraveStack** is an atmospheric falling-block puzzle game that bridges 1980s retro computing with modern agentic AI:

1. **Dual Display Reanimation**:
   - **1984 Elektronika 60 Terminal**: Authentic ASCII characters `[ ]`, scanlines, green/amber phosphor decay, and CRT curvature.
   - **Gothic Crypt**: Stone-etched blocks, runic borders, and glowing exorcism particle bursts.

2. **Cursed Spellcasting Mechanics**:
   - *Graveyard Fog*: Dense mist obscures the bottom matrix.
   - *Poltergeist Shove*: Sudden telekinetic lateral displacements.
   - *Soul Inversion*: Gravity vortex pulls falling blocks upward.
   - *Tombstone Crumble*: Hard-dropped blocks rot into brittle bone debris.
   - *Exorcism Purge*: Clearing 4 lines simultaneously purges active curses.

3. **100% Procedural Web Audio API Synthesizer**:
   - Zero external audio files or network dependencies.
   - Generates an original haunting 8-bit gothic dirge in D minor with dual square/sawtooth oscillators and dynamic lowpass resonance, alongside tactile procedural sound effects.

4. **Kiro Crew Multi-Agent Séance**:
   - **The Architect's Ghost**: Tactical grandmaster co-pilot calculating optimal placements using Pierre Dellacherie heuristics. Features an autonomous **"Summon Ghost to Play"** mode.
   - **The Poltergeist**: Chaos adversary unleashing curses when combo streaks climb.
   - **The Gravedigger**: Crypt narrator recording statistics and reading epitaphs upon game over.
   - **Interactive Séance Terminal**: Live in-game communication window allowing players to converse with the spirits.

---

## 🤖 Detailed Write-Up: How Kiro Was Used

### 1. Kiro IDE, CLI, Web, and Kiro Crew
We leveraged Kiro's end-to-end toolchain throughout the build:
- **Kiro Crew** was the centerpiece: enabling three distinct custom agents (`architect-ghost`, `poltergeist`, `gravedigger`) to collaborate asynchronously using event-driven state hooks.
- **Kiro CLI** automated our property-based testing pipelines via background hooks.
- **Kiro IDE** enabled seamless editing across our Canvas renderer, Web Audio synthesizer, and grid state machine.

### 2. Custom Agents
We created three specialized custom agents in `.kiro/crew/`:
- `architect-ghost.json`: Analyzes the matrix, spots spin setups, and drives autonomous auto-play.
- `poltergeist.json`: Monitors player combos and triggers dynamic environmental curses.
- `gravedigger.json`: Preserves graveyard lore, tracks score milestones, and rings funeral bells.

### 3. Agent Hooks (`.kiro/hooks/`)
We implemented automated agent hooks:
- `pre-commit.js`: Automatically triggers `vitest` Property-Based Tests before code changes are committed, failing closed if mathematical invariants are breached.
- `audit-invariants.js`: Audits rotational wall-kicks, 7-bag permutation distributions, and matrix boundaries.

### 4. Spec-Driven Development (`.kiro/specs/`)
We structured the development using Kiro's formal specifications:
- `requirements.md`: Outlined functional physics, audio synthesis constraints, and multi-agent roles.
- `design.md`: Defined the architecture diagram, state transitions, and heuristic evaluation weights.
- `tasks.md`: Provided a phased, trackable roadmap.
Compared to "vibe coding", spec-driven development ensured mathematical rigor: rotational matrices and randomizer distributions were formally verified before UI assembly began.

### 5. Steering Docs (`.kiro/steering/`)
We used three explicit steering files:
- `tetris-guidelines.md`: Mandated 5-test wall-kicks and 7-bag shuffle fairness.
- `spooky-design-tokens.md`: Locked in exact phosphor green/amber CRT hex values, scanline opacities, and audio volume safety ceilings.
- `zero-crash-rules.md`: Enforced self-contained offline execution with zero external asset dependencies so judges' live demos never crash.

### 6. Model Context Protocol (MCP) (`.kiro/mcp.json`)
We designed an MCP bridge exposing four core game tools:
- `get_board_state`: Exposes the 10x20 matrix and active piece to external agents.
- `suggest_move`: Runs heuristic evaluations to return recommended placement coordinates.
- `cast_curse`: Enables autonomous agents to inject curses into the active game loop.
- `get_graveyard_stats`: Reports lifetime survival statistics.

### 7. Property-Based Testing (PBT)
Using `fast-check` and `vitest`, PBT verified:
- **Permutation Fairness**: Proved that every 7-piece bag slice contains all 7 distinct shapes without starvation.
- **Rotational Wall-Kick Bounds**: Proved across thousands of random configurations that rotating near walls never clips out-of-bounds or overlaps locked cells.
- **Row Drop Preservation**: Proved that line clears preserve cell integrity and drop non-cleared rows accurately.

### 8. Full-Stack Agent Protocol Architecture: MCP + A2A + AG-UI
Rather than treating agent protocols in isolation, GraveStack implements the modern **3-Tier Agent Protocol Stack**:
- **Layer 1: MCP (Model Context Protocol)**: Connects agents to tools and game data. Through `.kiro/mcp.json` and our local server bridge, external and local agents access universal endpoints (`get_board_state`, `suggest_move`, `cast_curse`).
- **Layer 2: A2A (Agent2Agent Protocol)**: Coordinates agent-to-agent collaboration across Kiro Crew. *The Architect's Ghost*, *The Poltergeist*, and *The Gravedigger* communicate via typed event contracts, delegating board analysis, hazard injections, and historical metrics without centralized bottlenecking.
- **Layer 3: AG-UI (Agent-User Interaction Protocol)**: Streams agent reasoning directly into the human player's interface. The live **Séance Terminal** provides real-time streaming thought telemetry, tactile placement advice, and human-in-the-loop curse triggers.

---

## 🎬 3-Minute Video Demo Script

### [0:00 - 0:35] The Hook & Resurrection Story
- *Visual*: Close-up on the green phosphor CRT terminal flickering to life with scanlines.
- *Voiceover*: "In 1984, the first falling-block puzzles were compiled on Soviet monochrome phosphor screens using raw text brackets. Today, for Kiroween 2026, we resurrect the 1984 terminal and forgotten 1990s competitive puzzle spellcasting in **GraveStack: The 1984 Silicon Séance**."

### [0:35 - 1:25] Core Gameplay & Spooky Curses
- *Visual*: Show fluid gameplay with tactile mechanical sound effects and original 8-bit crypt music.
- *Action*: Trigger a 3-combo streak. Show The Poltergeist casting **Graveyard Fog** (mist obscures the bottom 8 rows) and **Poltergeist Shove**.
- *Action*: Perform a 4-line **Exorcism**. Show spectral particle burst and audio chime banishing the active curse.

### [1:25 - 2:15] Kiro Crew Multi-Agent Co-Pilot & Auto-Play
- *Visual*: Zoom into the **Séance Terminal**. Show live banter between The Architect's Ghost, The Poltergeist, and The Gravedigger.
- *Action*: Click **"Summon Ghost to Play"**. Show The Architect's Ghost playing high-speed, superhuman placements using real-time Dellacherie heuristics.
- *Voiceover*: "Notice how our Kiro Crew collaborates in real time: The Architect guides moves, the Poltergeist introduces chaos, and the Gravedigger chronicles your score."

### [2:15 - 2:50] The `.kiro` Architecture & Property-Based Tests
- *Visual*: Open terminal, display the `/.kiro` tree (specs, steering, hooks, crew JSONs, MCP).
- *Action*: Run `npm test` showing 4/4 passing Fast-Check property-based tests in 140ms.
- *Voiceover*: "Built with strict spec-driven development and mathematically verified through property-based testing. 100% web-native, zero external assets, and licensed under GPLv3."

### [2:50 - 3:00] Outro & Call to Action
- *Visual*: Display title card, GitHub URL, and Kiroween badge.
- *Voiceover*: "GraveStack is public and open source. Happy hacking, and Happy Kiroween 2026!"
