# ⚡ Defrag84: The Autonomous Cloud Memory Garbage Collector

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Kiroween 2026](https://img.shields.io/badge/Hackathon-Kiroween%202026-orange.svg)](https://kiroween.devpost.com/)
[![Category: Resurrection](https://img.shields.io/badge/Category-Resurrection-purple.svg)](https://kiroween.devpost.com/)
[![Kiro Crew](https://img.shields.io/badge/Kiro%20Crew-Multi--Agent-green.svg)](https://kiro.dev/)
[![PBT Verified](https://img.shields.io/badge/PBT-fast--check%20100%25-brightgreen.svg)](https://github.com/dubzzz/fast-check)

> *"In 1984, Alexey Pajitnov pioneered 2D bin-packing algorithms at the Soviet Academy of Sciences Dorodnitsyn Computing Centre. In the 1990s, MS-DOS DEFRAG and Norton SpeedDisk turned memory compaction into a mesmerizing visual experience. In 2026, Defrag84 resurrects both dead technologies to solve cloud computing's most expensive modern bottleneck: Kubernetes container memory bloat, uncollected memory leaks, and LLM KV-cache context fragmentation."*

---

## 💡 The Resurrection Innovation: Why Defrag84?

Most retro clones simply reskin a 1980s falling-block game with Halloween graphics. **Defrag84 reimagines the core mathematical roots of 1984 polyomino bin-packing to solve a critical 2026 cloud infrastructure crisis.**

### The Modern Cloud Problem
1. **Container Memory Bloat & OOM Kills**: Cloud containers frequently crash due to Linux Kernel Out-Of-Memory (`OOMKilled`) panics caused by uncollected heap leaks and internal memory fragmentation.
2. **LLM KV-Cache Fragmentation**: Large Language Model attention caches (vLLM / PagedAttention) fragment GPU/CPU RAM across varying request context lengths.
3. **The Loss of Tactile Memory Observability**: Developers today rely on opaque black-box dashboards rather than tactile, real-time spatial memory visualization.

### The Resurrection Solution
Defrag84 projects physical heap memory directly into an interactive 10x20 container page frame matrix (`0x0000` to `0x2600`, 25.6 MB virtual heap space):
- Every falling polyomino represents a real system memory allocation tagged with an active `PID`, allocation type, and size in KB.
- Completing a 10-column memory row triggers an atomic **Major Garbage Collection Compaction Cycle**, physically defragmenting the heap, lowering the Fragmentation Ratio, and cooling Heap Pressure.
- Autonomous multi-agent system daemons (**Kiro Crew**) monitor heap telemetry, inject chaos engineering load, and execute zero-latency autonomous compaction in real time.

---

## 🚀 Key Features

### 1. Authentic 2D Bin-Packing Heap Model (7 Allocation Types)
- `BUF_POOL` (4-block cyan bar): Contiguous I/O buffer pool (256 KB).
- `STK_FRM` (J-piece blue): Thread execution stack frame (192 KB).
- `HEAP_OBJ` (L-piece orange): Dynamic runtime object allocation (192 KB).
- `WRK_MEM` (O-piece yellow): Background worker memory segment (256 KB).
- `KV_CACHE` (S-piece green): LLM attention KV-cache context block (160 KB).
- `SOCK_FD` (T-piece purple): Network socket descriptor table (192 KB).
- `DOM_NODE` (Z-piece red): DOM / JSON document tree node (160 KB).

### 2. Multi-Engine CRT Observability
- **1984 RAM Hex Terminal (Elektronika 60)**: Pure monochromatic phosphor green terminal with raw hex address rail (`0x0000`–`0x2600`), scanlines, and phosphor decay persistence.
- **MS-DOS DEFRAG (Norton SpeedDisk)**: Classic 1990s blue/white block matrix highlighting fragmented memory holes and leaked blocks in bright red.
- **K8s Chaos Engine**: High-contrast production container monitoring dashboard with pulsating error thresholds.
- **LLM KV-Cache Monitor**: Cyan/magenta neural transformer KV-cache context block allocator.

### 3. Kiro Crew Multi-Agent Daemon System (MCP + A2A + AG-UI)
Defrag84 implements the complete 2026 3-Tier Agent Protocol Stack:
- **Daemon 1: The GC Optimizer (`gc-optimizer`)**: Autonomous 2D bin-packing compaction daemon powered by a multi-variable Pierre Dellacherie heuristic solver. Features an autonomous **"Engage AI Compactor"** auto-play mode with live explanatory telemetry.
- **Daemon 2: The Chaos Monkey (`chaos-monkey`)**: Production fault injector simulating container failure modes:
  - *Memory Leak*: Spawns uncollectible garbage blocks into the heap bottom.
  - *Context Switch*: High-priority interrupt shifts pending allocations unexpectedly.
  - *Invert Pointer*: Temporarily pulls memory allocations toward the top boundary.
  - *ECC Bit Rot*: Corrupts locked blocks into fragile decaying cells.
- **Daemon 3: The Memory Profiler (`memory-profiler`)**: Real-time eBPF observability daemon computing live fragmentation metrics, tracking compaction throughput in MB/s, and generating kernel core dumps on OOM crashes.
- **Protocol 1 — MCP (Model Context Protocol)**: Exposes tool interfaces (`get_heap_telemetry`, `suggest_move`, `inject_chaos_load`, `get_board_state`) via `.kiro/mcp.json`.
- **Protocol 2 — A2A (Agent2Agent Protocol)**: Inter-daemon communication protocol coordinating autonomous compaction triggers upon fragmentation threshold spikes.
- **Protocol 3 — AG-UI (Agent-User Interaction Protocol)**: Streams agent reasoning, live memory allocations, and tactile placement telemetry directly to the operator's HUD.

### 4. 100% Procedural Web Audio API Synthesizer
- **Zero External Audio Assets**: Contains zero `.mp3` or `.wav` files, guaranteeing zero asset drops or network failures in judge sandboxes.
- **8-Bit Minor-Key Crypt Dirge**: Real-time synthesized dual pulse wave oscillators (lead + sub-octave organ) with dynamic lowpass filter modulation.
- **Kernel Sound Effects**: Tactile mechanical relay clicks, rotational chirps, hard drop compaction thuds, and line-clear garbage collection chime chords.

### 5. Tournament-Grade Responsive Controls
- Custom high-speed input loop featuring Delayed Auto-Shift (**DAS = 135ms**), Auto-Repeat Rate (**ARR = 25ms**), and Soft Drop Factor (**SDF = 30ms**), completely bypassing Windows OS key repeat lag.

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
│   │   ├── architect-ghost.json  # The GC Optimizer daemon spec
│   │   ├── poltergeist.json      # The Chaos Monkey fault injector spec
│   │   └── gravedigger.json      # The Memory Profiler observability daemon spec
│   ├── hooks/
│   │   ├── pre-commit.js         # Automated pre-commit invariant audit hook
│   │   └── audit-invariants.js   # Mathematical guideline audit script
│   └── mcp.json                  # Model Context Protocol server definition
├── src/
│   ├── ai/                       # Kiro Crew orchestrator & heuristic solver
│   ├── audio/                    # Procedural Web Audio API synthesizer
│   ├── components/               # React UI, CRT monitors, and Séance terminal
│   ├── core/                     # Pure grid engine, 7-bag randomizer, SRS, heap metrics
│   └── renderer/                 # 60 FPS HTML5 Canvas CRT renderer
├── .github/workflows/deploy.yml  # GitHub Actions CI/CD for auto-deployment
├── LICENSE                       # GNU General Public License v3.0 (GPLv3)
└── package.json
```

---

## 🧪 Property-Based Testing (PBT)

We utilize `fast-check` and `vitest` to mathematically prove core memory invariants:
- **7-Bag Permutation Fairness**: Proves that every 7-piece bag slice contains all 7 distinct memory allocation types without starvation.
- **SRS Wall-Kick Safety**: Proves across thousands of random configurations that rotating near boundaries never clips out-of-bounds or overwrites occupied memory cells.
- **Row Compaction Conservation**: Verifies row compaction mechanics strictly preserve uncollected cells and decrement heap pressure.
- **Ghost Projection Invariant**: Proves ghost coordinates always target the lowest valid placement.

Run the test suite:
```bash
npm test
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yuvanshankarm007/necro-tetris.git
cd necro-tetris

# Install dependencies
npm install

# Run test suite
npm test

# Start the local development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

---

## 📜 License
Licensed under the **GNU General Public License v3.0 (GPLv3)**. See [LICENSE](file:///c:/Users/yuvan/OneDrive/Desktop/necro-tetris/LICENSE) for details.
