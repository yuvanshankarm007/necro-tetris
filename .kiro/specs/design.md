# Defrag84: Architecture & Technical Design

## 1. System Architecture Diagram

```
+-----------------------------------------------------------------------------------------+
|                                    Defrag84 Frontend                                    |
|  +-----------------------+  +---------------------------------+  +--------------------+ |
|  |     Heap Profiler     |  |       CRT Memory Renderer       |  |  Ingress Pipeline  | |
|  | - Swap Slot (Hold)    |  | - 10x20 Container Page Matrix   |  | - Next 5 Pages     | |
|  | - Heap Pressure Gauge |  | - Hex Address Rail (0x0000-2600)|  | - Ingress Rate     | |
|  | - RAM Reclaimed (MB)  |  | - Scanlines & CRT Barrel Curv.  |  | - Reclaimed KB     | |
|  | - Fragmentation Ratio |  | - Predictive Landing Footprint  |  | - Compaction Count | |
|  +-----------------------+  +---------------------------------+  +--------------------+ |
+-----------------------------------------------------------------------------------------+
|                               Web Audio Procedural Synthesizer                          |
|  - Zero-Dependency Web Audio API Synth (8-bit D-Minor Crypt Dirge, ADSR envelopes)     |
|  - Custom Kernel SFX: Allocation Click, Compaction Bell, OOM Panic Siren               |
+-----------------------------------------------------------------------------------------+
|                          Defrag84 Deterministic Engine Core                             |
|  - 10x20 Physical Memory Allocation State Machine                                       |
|  - Super Rotation System (SRS) 5-Test Wall-Kick Matrix                                   |
|  - Dynamic Memory Tagging: BUF_POOL, STK_FRM, HEAP_OBJ, WRK_MEM, KV_CACHE, etc.         |
|  - Real-Time Heap Pressure & Fragmentation Ratio Evaluator                              |
|  - Fault Injection State Machine: Memory Leak, Context Switch, Invert Ptr, ECC Bit Rot  |
+-----------------------------------------------------------------------------------------+
|                       Kiro Crew Multi-Agent Protocol Stack                              |
|  - Layer 1: MCP (Model Context Protocol) -> .kiro/mcp.json tool interfaces              |
|  - Layer 2: A2A (Agent2Agent Protocol) -> Event bus coordinating GC, Chaos & Profiler   |
|  - Layer 3: AG-UI (Agent-User Interaction) -> Live reactive HUD & AI Daemon Autopilot    |
+-----------------------------------------------------------------------------------------+
|                       Mathematical Heuristic Solver Daemon                              |
|  - Pierre Dellacherie Multi-Variable Bin-Packing Algorithm                              |
|  - Evaluates Landing Height, Contiguous Rows, Hole Penalties & Surface Roughness         |
+-----------------------------------------------------------------------------------------+
|                       Property-Based Test Suites (PBT)                                  |
|  - fast-check Mathematical Invariant Verification (Bounds, 7-Bag Fairness, Conservation)|
+-----------------------------------------------------------------------------------------+
```

## 2. Data Models & Kernel Data Structures

### 2.1 Heap Block & Page Allocation Model
```typescript
export type AllocationType = 
  | 'BUF_POOL'   // I-Piece: 256 KB contiguous I/O buffer pool
  | 'STK_FRM'    // J-Piece: 192 KB thread execution stack frame
  | 'HEAP_OBJ'   // L-Piece: 192 KB dynamic object allocation
  | 'WRK_MEM'    // O-Piece: 256 KB worker daemon memory
  | 'KV_CACHE'   // S-Piece: 160 KB LLM KV-cache context slice
  | 'SOCK_FD'    // T-Piece: 192 KB socket descriptor table
  | 'DOM_NODE';  // Z-Piece: 160 KB DOM tree node

export interface HeapCell {
  filled: boolean;
  color: string;
  type?: TetrominoType;
  allocType?: AllocationType;
  pid?: number;
  sizeKb?: number;
  anomalyState?: 'normal' | 'leaked' | 'corrupted' | 'pinned';
}

export interface HeapTelemetry {
  reclaimedKb: number;
  fragmentationRatio: number; // 0.00 to 1.00
  heapUsedKb: number;
  heapMaxKb: number;          // 25,600 KB default
  compactionCycles: number;
  oomAlert: boolean;
}
```

### 2.2 Pierre Dellacherie Heuristic Placement Function
The GC Optimizer daemon scores all valid rotations and column translations using:
$$\text{Score} = w_1 \cdot \text{LandingHeight} + w_2 \cdot \text{ClearedLines} + w_3 \cdot \text{RowTransitions} + w_4 \cdot \text{ColTransitions} + w_5 \cdot \text{BuriedHoles} + w_6 \cdot \text{WellDepth}$$

Optimal placement minimizes buried memory holes and row transitions while maximizing immediate line compactions.

---

## 3. The 3-Tier Agent Protocol Stack (MCP vs A2A vs AG-UI)

1. **MCP (Model Context Protocol)**:
   - Exposes tools to agent runtimes: `get_heap_telemetry`, `suggest_move`, `inject_chaos_load`, `get_board_state`.
   - Documented in `.kiro/mcp.json`.
2. **A2A (Agent2Agent Protocol)**:
   - Signed Agent Cards establishing identity:
     - `gc-optimizer` -> Autonomous Compaction Engine.
     - `chaos-monkey` -> Resilient Fault Injector.
     - `memory-profiler` -> eBPF Observability Sentinel.
   - Event-driven orchestration triggers compactions upon fragmentation thresholds.
3. **AG-UI (Agent-User Interaction Protocol)**:
   - Real-time reactive stream rendering daemon reasoning directly in the UI.
   - User can toggle autonomous mode, trigger chaos load injections, or inspect heap dumps live.
