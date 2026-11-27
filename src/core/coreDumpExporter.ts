/**
 * Defrag84 - Linux Kernel Memory Core Dump Exporter
 * Generates forensic crash dumps and eBPF diagnostics when Out-Of-Memory events occur.
 */

import { GameState, MatrixCell } from './types';
import { CONTAINER_PROFILES } from './liveMemoryBridge';

export interface CoreDumpArtifact {
  format: 'DEFRAG84_ELF_COREDUMP_V1';
  timestamp: string;
  kernelVersion: string;
  systemArchitecture: string;
  panicReason: string;
  containerTelemetry: {
    podName: string;
    namespace: string;
    profile: string;
  };
  heapForensics: {
    heapMaxKb: number;
    heapUsedKb: number;
    ramReclaimedKb: number;
    ramReclaimedMb: number;
    fragmentationRatioPercent: number;
    majorCompactionCycles: number;
    spinInsertions: number;
    score: number;
  };
  faultInjectionState: {
    activeChaosFault: string;
    isDegradedMode: boolean;
  };
  ebpfStackTrace: string[];
  memoryPageAllocationMap: Array<{
    rowAddress: string;
    pids: Array<number | null>;
    blockStates: Array<string | null>;
  }>;
}

export class CoreDumpExporter {
  public static generateCoreDump(state: GameState, selectedProfileId: string = 'k8s-vllm-inference'): CoreDumpArtifact {
    const profile = CONTAINER_PROFILES.find((p) => p.id === selectedProfileId) || CONTAINER_PROFILES[0];
    const stats = state.stats;

    // Build memory page allocation snapshot
    const memoryPageAllocationMap = state.matrix.map((row: MatrixCell[], rowIdx: number) => {
      const rowHex = `0x${((rowIdx * 16)).toString(16).toUpperCase().padStart(4, '0')}`;
      return {
        rowAddress: rowHex,
        pids: row.map((cell: MatrixCell) => (cell.filled ? cell.pid ?? 1000 + rowIdx : null)),
        blockStates: row.map((cell: MatrixCell) => (cell.filled ? cell.type ?? 'BLOCK' : null)),
      };
    });

    const ebpfStackTrace = [
      `[ 0.000104] kernel: sys_compact_heap(mode=2D_BIN_PACKING, buffer_size=25600KB)`,
      `[ 0.000342] kiro_daemon_gc: evaluated 34 candidate polyomino rotations via Dellacherie heuristic`,
      `[ 0.000781] ebpf_probe: allocation burst detected in pod/${profile.podName}`,
      `[ 0.001109] mm_fragmentation_watchdog: ratio reached ${stats.fragmentationRatio}% (threshold: 45.0%)`,
      stats.oomAlert
        ? `[ 0.001452] oom_killer: out of memory allocating contiguous page frame at 0x2400`
        : `[ 0.001452] mm_watchdog: heap snapshot captured during normal compaction operation`,
      `[ 0.001920] kiro_crew_profiler: state preserved, RAM reclaimed=${(stats.reclaimedKb / 1024).toFixed(2)}MB, compactions=${stats.exorcisms}`,
    ];

    return {
      format: 'DEFRAG84_ELF_COREDUMP_V1',
      timestamp: new Date().toISOString(),
      kernelVersion: 'Linux 6.8.0-cloud-defrag84-generic #42-Ubuntu SMP x86_64',
      systemArchitecture: 'x86_64 / WebAssembly Canvas Sandbox',
      panicReason: stats.oomAlert
        ? 'KERNEL_PANIC: OUT_OF_MEMORY (OOMKilled - Virtual Heap Buffer Exhaustion)'
        : 'MANUAL_FORENSIC_SNAPSHOT: Operator Requested Heap Telemetry Dump',
      containerTelemetry: {
        podName: profile.podName,
        namespace: profile.namespace,
        profile: profile.name,
      },
      heapForensics: {
        heapMaxKb: stats.heapMaxKb,
        heapUsedKb: stats.heapUsedKb,
        ramReclaimedKb: stats.reclaimedKb,
        ramReclaimedMb: Number((stats.reclaimedKb / 1024).toFixed(2)),
        fragmentationRatioPercent: stats.fragmentationRatio,
        majorCompactionCycles: stats.exorcisms,
        spinInsertions: stats.tSpins,
        score: stats.score,
      },
      faultInjectionState: {
        activeChaosFault: state.activeCurse?.name || 'NONE_STABLE',
        isDegradedMode: state.activeCurse?.type !== 'none',
      },
      ebpfStackTrace,
      memoryPageAllocationMap,
    };
  }

  public static formatTextReport(artifact: CoreDumpArtifact): string {
    return `
================================================================================
           DEFRAG84 KERNEL MEMORY FORENSIC CORE DUMP & EBPF AUDIT
================================================================================
Timestamp:       ${artifact.timestamp}
Kernel:          ${artifact.kernelVersion}
Architecture:    ${artifact.systemArchitecture}
Trigger Reason:  ${artifact.panicReason}
Target Pod:      ${artifact.containerTelemetry.podName} (${artifact.containerTelemetry.namespace})
Container Profile: ${artifact.containerTelemetry.profile}

--------------------------------------------------------------------------------
[1] HEAP MEMORY FORENSICS
--------------------------------------------------------------------------------
Virtual Heap Ceiling:     ${artifact.heapForensics.heapMaxKb.toLocaleString()} KB (25.6 MB)
Heap Pressure at Dump:   ${artifact.heapForensics.heapUsedKb.toLocaleString()} KB (${((artifact.heapForensics.heapUsedKb / artifact.heapForensics.heapMaxKb) * 100).toFixed(1)}%)
RAM Reclaimed by GC:     ${artifact.heapForensics.ramReclaimedMb.toFixed(2)} MB (${artifact.heapForensics.ramReclaimedKb.toLocaleString()} KB)
Memory Fragmentation:    ${artifact.heapForensics.fragmentationRatioPercent}%
Major Compaction Cycles: ${artifact.heapForensics.majorCompactionCycles} sweeps
Spin-Insert Compactions: ${artifact.heapForensics.spinInsertions} (T-Spins)
Active Fault Injection:  ${artifact.faultInjectionState.activeChaosFault}

--------------------------------------------------------------------------------
[2] EBPF KERNEL TRACE
--------------------------------------------------------------------------------
${artifact.ebpfStackTrace.join('\n')}

--------------------------------------------------------------------------------
[3] PHYSICAL ADDRESS SPACE SNAPSHOT (0x0000 -> 0x2600)
--------------------------------------------------------------------------------
${artifact.memoryPageAllocationMap
  .map((row) => `${row.rowAddress}: [${row.blockStates.map((b) => (b ? b[0] : '.')).join(' ')}]`)
  .join('\n')}

================================================================================
Generated by Kiro Crew Memory Profiler Daemon | Kiroween 2026
================================================================================
`;
  }

  public static downloadAsJson(state: GameState, profileId?: string) {
    const dump = this.generateCoreDump(state, profileId);
    const jsonStr = JSON.stringify(dump, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `defrag84_coredump_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  public static downloadAsTextReport(state: GameState, profileId?: string) {
    const dump = this.generateCoreDump(state, profileId);
    const textReport = this.formatTextReport(dump);
    const blob = new Blob([textReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `defrag84_kernel_dump_${Date.now()}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
