# Devpost Submission: Defrag84 — The Autonomous Cloud Memory Garbage Collector

## 📌 Project Overview
- **Project Name**: Defrag84: Autonomous Cloud Memory Garbage Collector
- **Tagline**: What if Tetris defragmented real cloud memory? Resurrecting 1984 2D bin-packing & MS-DOS DEFRAG to solve Kubernetes and LLM KV-cache memory bloat with an AI Kiro Crew.
- **Hackathon**: Kiroween 2026
- **Category**: Resurrection ("Bring your favorite dead technology back to life. Reimagine obsolete tech with today’s innovations or solving tomorrow’s problems.")
- **Target Bonus Prizes**:
  - Best Kiro Crew App ($50,000 Tier: Autonomous system daemons coordinating over MCP, A2A, and AG-UI with live consensus debates and heuristic auto-play)
  - Best Demo (100% web-native, zero-crash procedural Web Audio synth, interactive eBPF address heatmap, and CRT renderer with floating hex particles)
  - Social Blitz Prize (`#KiroweenHackathon26`)
  - Bonus Blog Prize

---

## 💡 Inspiration: The Resurrection Innovation

In 1984, computer scientist **Alexey Pajitnov** was conducting academic research on combinatorial geometry and 2D bin-packing algorithms at the Soviet Academy of Sciences Dorodnitsyn Computing Centre, testing placements on an Elektronika 60 monochrome terminal. In the 1990s, utilities like **MS-DOS DEFRAG** and **Norton SpeedDisk** turned disk and memory compaction into an iconic, tactile visual experience. Over the decades, these spatial roots were forgotten, reduced to simple casual video games while enterprise systems moved to opaque black-box cloud dashboards.

Meanwhile, in 2026, modern cloud infrastructure faces a multi-billion dollar crisis:
1. **Container Memory Bloat & OOM Kills**: Microservices running in Kubernetes clusters frequently crash due to Linux Kernel Out-Of-Memory (`OOMKilled`) panics caused by uncollected heap allocations and internal memory fragmentation.
2. **LLM KV-Cache Context Fragmentation**: Large Language Model inference engines (such as vLLM and PagedAttention) suffer severe GPU/CPU RAM fragmentation across irregular prompt lengths.
3. **The Loss of Tactile Memory Observability**: DevOps engineers have lost tactile visual awareness of where memory fragmentation actually occurs in physical address space.

**We asked**: *What if we resurrected 1984 2D bin-packing and 1980s visual defragmentation not as a toy, but as an autonomous cloud memory management engine? What if an autonomous crew of AI daemons (Kiro Crew) collaborated to optimize memory compaction in real time before kernel panics strike?*

That is **Defrag84**.

---

## ⚡ What It Does

**Defrag84** maps physical container heap memory directly into an interactive 10x20 page frame matrix (`0x0000` to `0x2600`, 25.6 MB virtual heap space):

1. **Physical Memory Ingress (7 Polyomino Allocation Types)**:
   - Each falling page block represents an active system memory allocation tagged with an active `PID`, allocation type, and size in KB:
     - `BUF_POOL` (4-block cyan bar): Contiguous I/O buffer pool (256 KB).
     - `STK_FRM` (J-piece blue): Thread execution stack frame (192 KB).
     - `HEAP_OBJ` (L-piece orange): Dynamic runtime object allocation (192 KB).
     - `WRK_MEM` (O-piece yellow): Background worker memory segment (256 KB).
     - `KV_CACHE` (S-piece green): LLM attention KV-cache context slice (160 KB).
     - `SOCK_FD` (T-piece purple): Network socket descriptor table (192 KB).
     - `DOM_NODE` (Z-piece red): DOM / JSON document tree node (160 KB).

2. **Atomic Major Garbage Collection Compactions**:
   - Completing a full 10-column memory row executes an atomic **Major Garbage Collection Cycle**, physically compacting the heap, freeing RAM, lowering the live Fragmentation Ratio, and cooling Heap Pressure.
   - Cleared rows trigger floating hexadecimal deallocation tokens (`0x00`, `FREE`, `DEALLOC`, `+256KB`).
   - Tactical spin insertions (`T-Spin Compaction`) trigger high-efficiency compaction multipliers.

3. **eBPF Virtual Address Space Heatmap & Live Memory Bridge**:
   - Real-time address matrix (`0x0000`–`0x2600`) showing allocated pages, free blocks, and uncollected leak holes.
   - Live Memory Bridge connecting to the host browser's actual V8 heap statistics (`performance.memory`) or simulated Kubernetes workloads (`vLLM Neural Inference`, `Envoy Ingress Gateway`, `Redis In-Memory Buffer`).

4. **Forensic Linux Kernel OOM Core Dump Exporter**:
   - One-click export of authentic Linux kernel memory crash dumps (`.json` and `.log`) with ELF architecture headers, eBPF stack traces, and physical memory allocation tables.

5. **Kiro Crew Multi-Agent Daemon System (MCP + A2A + AG-UI)**:
   - **The GC Optimizer (`gc-optimizer`)**: Autonomous 2D bin-packing compaction daemon powered by a multi-variable Pierre Dellacherie heuristic solver. Features an autonomous **"Engage AI Compactor"** auto-play mode with live holographic target projections (`[AI-PLAN]`).
   - **The Chaos Monkey (`chaos-monkey`)**: Production fault injector simulating container failure modes: Memory Leak injection, noisy-neighbor Context Switches, Inverted Pointer gravity, and ECC Bit Rot memory corruption.
   - **The Memory Profiler (`memory-profiler`)**: Real-time eBPF observability daemon computing live fragmentation ratios, tracking compaction throughput in MB/s, and generating kernel core dumps on OOM crashes.
   - **Live A2A Consensus Debates**: Operators can trigger autonomous inter-daemon debates where agents negotiate compaction vs fault-injection trade-offs.

6. **Interactive Benchmark Challenge & Judge Quick Tour**:
   - **Judge Quick Tour**: 3-step interactive architecture tour guiding evaluators through the 1984 resurrection, the 3-Tier agent protocol stack, and technical highlights.
   - **60-Second Compaction Benchmark**: Real-time Human vs AI Autopilot challenge measuring RAM Reclaimed (MB), Major Compactions, and GC Throughput (KB/s), issuing an official verified certificate.

7. **100% Procedural Web Audio API Synthesizer**:
   - Zero external audio files or network dependencies (guaranteed zero asset drops or CORS errors during live demos).
   - Generates an original haunting 8-bit minor-key crypt dirge with dual pulse wave oscillators and lowpass filter resonance, alongside tactile mechanical relay clicks and compaction chime chords.

8. **Tournament-Grade Responsive Controls**:
   - Built-in Delayed Auto-Shift (**DAS = 135ms**), Auto-Repeat Rate (**ARR = 25ms**), and Soft Drop Factor (**SDF = 30ms**) for instant, ultra-responsive tactile memory compaction.

---

## 🤖 Detailed Write-Up: How Kiro Was Used

### 1. Kiro Tooling (IDE, CLI, Web, and Kiro Crew)
We utilized Kiro's unified ecosystem across the entire engineering lifecycle:
- **Kiro Crew** served as the orchestration backbone: coordinating our three autonomous system daemons (`gc-optimizer`, `chaos-monkey`, `memory-profiler`) through asynchronous event hooks.
- **Kiro CLI** automated our property-based testing pipelines via background hooks.
- **Kiro IDE** enabled rapid iterations across our pure mathematical game engine, Canvas CRT renderer, and Web Audio procedural synthesizer.

### 2. Custom Agents (`.kiro/crew/`)
We architected three specialized system daemons defined in `.kiro/crew/`:
- `architect-ghost.json` (**The GC Optimizer**): A mathematical compaction daemon calculating optimal page frame placements via Pierre Dellacherie 2D bin-packing heuristics. Minimizes fragmentation holes, projects holographic targets, and drives the autonomous auto-compactor mode.
- `poltergeist.json` (**The Chaos Monkey**): A resilience engineering daemon inspired by Netflix Chaos Monkey. Injects uncollectible memory leaks, context switches, pointer inversions, and ECC bit-rot anomalies to test garbage collector robustness under pressure.
- `gravedigger.json` (**The Memory Profiler**): An eBPF-grade observability sentinel that continuously monitors real-time heap pressure (`heapUsedKb / heapMaxKb`), computes live fragmentation ratios, and logs post-mortem kernel core dumps when Out-Of-Memory limits are breached.

### 3. Agent Hooks (`.kiro/hooks/`)
We configured automated agent hooks to enforce engineering guardrails:
- `pre-commit.js`: Automatically triggers `vitest` Property-Based Tests before any code changes can be committed to Git, failing closed if mathematical invariants are violated.
- `audit-invariants.js`: Audits rotational wall-kicks, 7-bag permutation distributions, and memory buffer boundaries.

### 4. Spec-Driven Development (`.kiro/specs/`)
We structured the development using Kiro's formal specifications:
- `requirements.md`: Formulated the exact memory allocation types, heap pressure formulas, CRT display specifications, and multi-agent roles.
- `design.md`: Defined the system architecture diagram, the Pierre Dellacherie heuristic evaluation equation, the 3-Tier Agent Protocol Stack, and data structures.
- `tasks.md`: Provided a phased, trackable roadmap from mathematical foundation to production deployment.
*Spec-driven development prevented scope creep and ensured mathematical rigor was verified before any UI rendering was built.*

### 5. Steering Documents (`.kiro/steering/`)
We established three explicit steering files:
- `tetris-guidelines.md`: Mandated 5-test wall-kicks, 7-bag permutation fairness, and 500ms sliding lock delays.
- `spooky-design-tokens.md`: Locked in exact phosphor green/amber CRT hex values, scanline opacities, and audio volume safety ceilings.
- `zero-crash-rules.md`: Enforced self-contained offline execution with zero external asset dependencies so judges' live demos never crash.

### 6. Model Context Protocol (MCP) (`.kiro/mcp.json`)
We built a first-class MCP server exposing four core kernel tools to any MCP-compliant agent:
- `get_heap_telemetry`: Returns real-time heap pressure, reclaimed KB, fragmentation ratio, and compaction cycle count.
- `suggest_move`: Runs heuristic 2D bin-packing evaluations to return recommended placement coordinates and compaction reasoning.
- `inject_chaos_load`: Allows external agents or chaos engineers to programmatically inject memory leaks, context switches, pointer inversions, or bit rot.
- `get_board_state`: Exposes the raw 10x20 physical page matrix with allocation metadata.

### 7. Property-Based Testing (PBT)
Using `fast-check` and `vitest`, we mathematically verified core invariants:
- **7-Bag Permutation Fairness**: Proved across 100+ random generations that every 7-piece allocation window contains all 7 distinct memory types without starvation.
- **Rotational Wall-Kick Safety**: Proved across thousands of random configurations that rotating near boundaries or locked blocks never clips out-of-bounds or overwrites occupied memory cells.
- **Row Compaction Conservation**: Proved that row compactions strictly preserve uncollected cells and decrement heap pressure monotonically.
- **Ghost Projection Invariant**: Proved ghost coordinates always target the lowest valid placement.

### 8. Full-Stack Agent Protocol Architecture: MCP + A2A + AG-UI
Rather than treating agent protocols in isolation, Defrag84 implements the cutting-edge **3-Tier AI Agent Protocol Stack**:
- **Layer 1: MCP (Model Context Protocol)**: Connects agents to tools and data. Through `.kiro/mcp.json` and our local server bridge, agents access universal endpoints (`get_heap_telemetry`, `suggest_move`, `inject_chaos_load`, `get_board_state`).
- **Layer 2: A2A (Agent2Agent Protocol)**: Enables autonomous daemon-to-daemon collaboration. The *GC Optimizer*, *Chaos Monkey*, and *Memory Profiler* communicate via signed Agent Cards and typed event contracts, negotiating compaction triggers and chaos fault injections without human intervention.
- **Layer 3: AG-UI (Agent-User Interaction Protocol)**: Streams agent reasoning directly into the human operator's interface. The live **Séance / Kernel Terminal** renders real-time streaming thought telemetry, tactile placement advice, and human-in-the-loop chaos triggers.

---

## 🏆 What We Learned & What's Next
- **Resurrecting 1984 algorithms solves 2026 problems**: The spatial intuition of 2D bin-packing is directly applicable to modern cloud memory fragmentation and LLM KV-cache management.
- **Zero-Dependency Resilience is King**: Eliminating external asset fetches ensures that hackathon demos run smoothly offline without broken audio or missing textures.
- **Next Steps**: We plan to connect Defrag84 directly to live Kubernetes Prometheus / eBPF memory metrics, allowing operators to visualize their actual production cluster memory in real-time CRT phosphor glory!
