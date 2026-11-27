# Defrag84: The Autonomous Cloud Memory Garbage Collector — Requirements Specification

## 1. Overview & Hackathon Problem Statement
**Hackathon Category**: Resurrection (Kiroween 2026)  
**Target Solution**: Resurrect the 1984 academic foundation of 2D bin-packing (Alexey Pajitnov's original research at the Soviet Academy of Sciences Dorodnitsyn Computing Centre) and the tactile visual memory defragmentation tools of the 1980s/1990s (MS-DOS DEFRAG, Norton SpeedDisk). Reimagine them to solve tomorrow's cloud infrastructure bottleneck: **Kubernetes container memory bloat, uncollected heap leaks, and LLM KV-cache context fragmentation**.

Steered by an autonomous multi-agent daemon crew (**Kiro Crew: Defrag84 System Daemons**), Defrag84 visualizes physical heap memory as a 10x20 container page frame matrix, tracks real-time heap pressure and fragmentation ratios, and performs autonomous or human-guided zero-latency compaction before Linux kernel Out-Of-Memory (OOM) killer panics trigger.

---

## 2. Functional Requirements

### 2.1 Authentic 2D Bin-Packing Heap Compactor Engine
- **Memory Buffer Dimensions**: 10 columns × 20 rows of physical page frames (25.6 MB virtual heap address space, indexed from `0x0000` to `0x2600`).
- **Real-Time Memory Ingress (7 Polyomino Allocation Types)**:
  - `BUF_POOL` (4-block long bar): Contiguous I/O buffer pool (256 KB).
  - `STK_FRM` (J-block): Thread execution stack frame (192 KB).
  - `HEAP_OBJ` (L-block): Dynamic application heap allocation (192 KB).
  - `WRK_MEM` (O-block): Worker daemon memory segment (256 KB).
  - `KV_CACHE` (S-block): LLM attention KV-cache context slice (160 KB).
  - `SOCK_FD` (T-block): Network socket descriptor table (192 KB).
  - `DOM_NODE` (Z-block): DOM/JSON document tree node (160 KB).
- **Compaction Mechanics & Super Rotation System (SRS)**:
  - Full 4-state rotation with 5-test wall kicks for optimal packing into fragmented memory pockets.
  - 500ms sliding lock delay with 15-step reset ceiling for surgical placement into tight memory crevices.
  - Instant Hard Drop compaction with projected ghost footprint for predictive memory alignment.
  - Dedicated Swap Slot (Hold Queue) for deferring unaligned memory pages during high ingress spikes.
- **Garbage Collection Line Clears**:
  - Reclaiming complete 10-column memory rows executes an atomic Major Garbage Collection cycle.
  - Updates total Reclaimed RAM counter, lowers Fragmentation Ratio, and cools Heap Pressure.
  - Spin insertions (`T-Spin Compaction`) yield double garbage collection efficiency multipliers.

### 2.2 Heap Observability & Kernel Telemetry
- **Live Memory Profiler**:
  - `Heap Pressure Gauge`: Real-time percentage meter (`heapUsedKb / 25,600 KB`).
  - `Fragmentation Ratio`: Real-time ratio of inaccessible holes / total heap height.
  - `Bandwidth Reclaimed`: Lifetime throughput counter in Megabytes.
  - `OOM Kernel Panic Watchdog`: Triggers kernel core dump alert when allocations breach the memory ceiling (`0x2600`).
- **Multiple Visual Telemetry Engines**:
  - `1984 RAM Hex Terminal`: Monochromatic Elektronika-60 phosphor green terminal with raw hex address rail.
  - `MS-DOS DEFRAG`: Classic 1990s Norton SpeedDisk blue/white block matrix highlighting memory leaks in red.
  - `K8s Chaos Engine`: Dark amber production container cluster telemetry with pulsing error gradients.
  - `LLM KV-Cache Monitor`: Cyan/magenta neural transformer KV-cache context block allocator.
- **CRT Simulation**: Hardware scanline overlay, barrel distortion curvature, and phosphor persistence flicker.

### 2.3 Resilient Native Audio Synthesizer
- 100% web-native Web Audio API synthesizer — zero external `.mp3` or `.wav` dependencies for guaranteed zero-crash judge demonstrations.
- Custom procedural 8-bit minor-key crypt dirge with mechanical relay clicks, hard drop compaction thuds, and line-clear garbage collection bells.

### 2.4 Autonomous Kiro Crew Daemons
- **Daemon 1: The GC Optimizer (`gc-optimizer`)**: Autonomous 2D bin-packing compaction daemon powered by a multi-variable Pierre Dellacherie heuristic solver. Auto-plays memory defragmentation in real time with continuous explanatory telemetry.
- **Daemon 2: The Chaos Monkey (`chaos-monkey`)**: Production fault injector simulating container failure modes:
  - *Memory Leak*: Injects uncollectible garbage blocks into the heap bottom.
  - *Context Switch*: High-priority interrupt shifts pending allocations unexpectedly.
  - *Invert Pointer*: Temporarily pulls memory allocations toward the top boundary.
  - *ECC Bit Rot*: Corrupts locked blocks into fragile decaying cells.
- **Daemon 3: The Memory Profiler (`memory-profiler`)**: Real-time eBPF observability daemon computing live fragmentation metrics, tracking compaction throughput, and logging post-mortem core dumps.

---

## 3. Non-Functional & Verification Requirements
- **60 FPS Deterministic Game Loop**: Timestamp-delta RequestAnimationFrame engine with zero frame drops or memory leaks.
- **Tournament-Grade Input Handling**: Delayed Auto-Shift (DAS = 135ms), Auto-Repeat Rate (ARR = 25ms), and Soft Drop Factor (SDF = 30ms) eliminating operating system key repeat latency.
- **Property-Based Testing (PBT)**: Comprehensive invariant verification via `fast-check` and `vitest` proving:
  1. SRS rotations never breach physical heap bounds or overwrite occupied memory blocks.
  2. 7-Bag allocation ingress prevents starvation of critical buffer types.
  3. Row compaction strictly preserves uncollected cells and lowers heap pressure monotonically.
- **Standardized Multi-Agent Protocols**:
  - Model Context Protocol (MCP) tool exposure via `.kiro/mcp.json`.
  - Agent2Agent (A2A) event streaming between system daemons.
  - Agent-User Interaction (AG-UI) live reactive HUD.
