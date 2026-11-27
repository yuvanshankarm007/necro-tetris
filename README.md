# 🎃 GraveStack: The 1984 Silicon Séance

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Kiroween 2026](https://img.shields.io/badge/Hackathon-Kiroween%202026-orange.svg)](https://kiroween.devpost.com/)
[![Category: Resurrection](https://img.shields.io/badge/Category-Resurrection-purple.svg)](https://kiroween.devpost.com/)
[![Kiro Crew](https://img.shields.io/badge/Kiro%20Crew-Multi--Agent-green.svg)](https://kiro.dev/)

> *"In 1984, the first falling-block mathematical puzzles were compiled on monochrome phosphor CRT terminals. In 2026, we exhume the dead silicon... and find three spirits haunting the machine."*

**GraveStack: The 1984 Silicon Séance** is an open-source, atmospheric falling-block puzzle game submitted to the **Kiroween 2026 Hackathon** under the **Resurrection Category**. It brings back 1984 monochrome green/amber phosphor terminal environments and forgotten 1990s competitive puzzle spellcasting mechanics, reimagining them as an interactive séance steered by an autonomous **Kiro Crew**.

---

## 👻 Highlights & Features

### 1. Dual Authentic Display Engines
- **1984 Soviet Monochrome CRT Phosphor Terminal (Elektronika 60)**: Authentic ASCII character brackets (`[ ]`), CRT curvature, phosphor decay ghosting, scanline rastering, and subtle CRT flicker.
- **Gothic Crypt & Spectral Mausoleum**: High-resolution dark fantasy crypt aesthetic with chiseled stone blocks, glowing runes, and particle exorcism bursts.

### 2. 100% Procedural Web Audio API Synthesizer
- **Zero External Assets**: Contains zero external `.mp3` or `.wav` dependencies, guaranteeing zero asset drops or network failures in judge sandboxes.
- **Original 8-bit Gothic Crypt Dirge**: Real-time synthesized dual pulse wave oscillators (lead + sub-octave organ) with dynamic lowpass filter modulation.
- **Procedural Sound FX**: Tactile mechanical key clicks, crisp rotational chirps, deep hard drop thuds, and minor-triad exorcism bell chords.

### 3. Cursed Spellcasting Mechanics
- 🌫️ **Graveyard Fog**: Dense supernatural fog engulfs the lower matrix rows.
- 👻 **Poltergeist Shove**: Sudden telekinetic tremors nudge falling blocks laterally.
- ⚡ **Soul Inversion**: Gravitational vortex flips gravity upwards.
- 🦴 **Tombstone Crumble**: Fragile blocks rot into brittle bone debris upon hard drop.
- 🔮 **Exorcism Purge**: Clearing 4 lines simultaneously purges active curses and grants spell shields.

### 4. Kiro Crew Multi-Agent Integration (3-Tier Agent Protocol Stack)
GraveStack implements the full 2026 agent protocol stack:
- **MCP Layer (Model Context Protocol)**: Connects agents to live tools and game memory via `.kiro/mcp.json` (`get_board_state`, `suggest_move`, `cast_curse`).
- **A2A Layer (Agent2Agent Protocol)**: Orchestrates inter-agent collaboration across Kiro Crew (*The Architect*, *The Poltergeist*, and *The Gravedigger*) with typed event dispatching.
- **AG-UI Layer (Agent-User Interaction Protocol)**: Streams agent reasoning and tactical telemetry to the human player through the interactive **Séance Terminal**. Features an autonomous **"Summon Ghost to Play"** mode.

---

## 🛠️ Project Structure & The `/.kiro` Directory

This repository strictly complies with Kiroween requirements, featuring the full `/.kiro` directory structure:

```
├── /.kiro/
│   ├── specs/
│   │   ├── requirements.md       # Functional & non-functional requirements
│   │   ├── design.md             # System architecture & state machine design
│   │   └── tasks.md              # Phased spec-driven implementation tasks
│   ├── steering/
│   │   ├── tetris-guidelines.md  # Rotational & permutation invariants
│   │   ├── spooky-design-tokens.md # CRT palettes, phosphor bloom, audio limits
│   │   └── zero-crash-rules.md   # Offline fallback & zero-crash guardrails
│   ├── crew/
│   │   ├── crew-config.json      # Kiro Crew multi-agent collaboration manifest
│   │   ├── architect-ghost.json  # Tactical grandmaster agent spec
│   │   ├── poltergeist.json      # Chaos spellcaster agent spec
│   │   └── gravedigger.json      # Crypt narrator agent spec
│   ├── hooks/
│   │   ├── pre-commit.js         # Automated pre-commit invariant audit hook
│   │   └── audit-invariants.js   # Mathematical guideline audit script
│   └── mcp.json                  # Model Context Protocol server definition
├── src/
│   ├── ai/                       # Kiro Crew orchestrator & heuristic solver
│   ├── audio/                    # Procedural Web Audio API synthesizer
│   ├── components/               # React UI, CRT monitors, and Séance terminal
│   ├── core/                     # Pure grid engine, 7-bag randomizer, SRS
│   └── renderer/                 # 60 FPS HTML5 Canvas CRT renderer
├── LICENSE                       # GNU General Public License v3.0 (GPLv3)
└── package.json
```

---

## 🧪 Property-Based Testing (PBT)

We utilize `fast-check` and `vitest` to mathematically prove core invariants:
- **7-Bag Permutation Invariant**: Guarantees no piece starvation beyond 12 turns.
- **Wall-Kick Safety**: Proves active blocks never clip out-of-bounds or overlap locked cells.
- **Line Clear Preservation**: Verifies row drop mechanics preserve board integrity.
- **Ghost Projection**: Proves ghost coordinates always target the lowest valid placement.

Run the test suite:
```bash
npm test
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/your-username/necro-tetris.git
cd necro-tetris

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🎮 Controls

| Key | Action |
| :--- | :--- |
| **← / →** or **A / D** | Move Left / Right |
| **↑** or **W** / **X** | Rotate Clockwise |
| **Z** / **Ctrl** | Rotate Counter-Clockwise |
| **↓** or **S** | Soft Drop |
| **Space** | Hard Drop (Exorcism) |
| **C** / **Shift** | Hold Piece |
| **P** / **Esc** | Pause Game |
| **1 / 2 / 3 / 4** | Quick Switch Theme |
| **M** | Toggle Sound |

*Touchscreen controls are automatically enabled on mobile and tablet devices.*

---

## 📄 License
This project is open-source software licensed under the **GNU General Public License v3.0 (GPLv3)**. See the [LICENSE](LICENSE) file for details.
