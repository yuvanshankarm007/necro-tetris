import { AgentChatMessage, CurseType } from '../core/types';

export type CrewEventListener = (message: AgentChatMessage) => void;
export type CurseTriggerListener = (curse: CurseType) => void;

export class KiroCrewOrchestrator {
  private messageListeners: CrewEventListener[] = [];
  private curseListeners: CurseTriggerListener[] = [];
  private lastPoltergeistCurseTime = 0;

  public subscribeMessages(listener: CrewEventListener): () => void {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter((l) => l !== listener);
    };
  }

  public subscribeCurses(listener: CurseTriggerListener): () => void {
    this.curseListeners.push(listener);
    return () => {
      this.curseListeners = this.curseListeners.filter((l) => l !== listener);
    };
  }

  private broadcast(
    sender: 'pajitnov' | 'poltergeist' | 'gravedigger' | 'system',
    name: string,
    text: string,
    sentiment?: 'strategic' | 'taunt' | 'lore' | 'urgent'
  ): void {
    const msg: AgentChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender,
      name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      sentiment,
    };
    this.messageListeners.forEach((fn) => fn(msg));
  }

  public notifyGameStart(): void {
    this.broadcast(
      'system',
      'System Telemetry',
      '⚡ Virtual Heap Initialized [25.6 MB Buffer]. Kiro Crew System Daemons online.',
      'lore'
    );
    setTimeout(() => {
      this.broadcast(
        'pajitnov',
        "The GC Optimizer",
        'Greetings, engineer. In 1984 we had only kilobytes of physical RAM. Compact allocations flatly, keep column 9 open for buffer flushes, and eliminate fragmentation holes.',
        'strategic'
      );
    }, 800);
    setTimeout(() => {
      this.broadcast(
        'gravedigger',
        'The Memory Profiler',
        'Heap baseline established. Every locked page frame consumes 128 KB. Monitoring fragmentation ratio and OOM threshold.',
        'lore'
      );
    }, 1800);
  }

  public notifyLineClear(lines: number, score: number, combo: number): void {
    if (lines === 4) {
      this.broadcast(
        'pajitnov',
        "The GC Optimizer",
        `MAJOR GC COMPACTION! 5.12 MB heap reclaimed across 4 page rows. Active memory hazards purged. Score: +${score}.`,
        'strategic'
      );
      this.broadcast(
        'gravedigger',
        'The Memory Profiler',
        'Heap compaction complete! Fragmentation ratio dropped to optimal levels. Excellent 2D bin-packing execution.',
        'lore'
      );
      this.broadcast(
        'poltergeist',
        'The Chaos Monkey',
        'Gah! My memory leaks were swept away! Preparing next container stress test...',
        'taunt'
      );
    } else if (combo >= 3) {
      this.broadcast(
        'pajitnov',
        "The GC Optimizer",
        `Sequential Compaction Chain x${combo}! High allocation throughput.`,
        'strategic'
      );

      const now = Date.now();
      if (now - this.lastPoltergeistCurseTime > 14000) {
        this.lastPoltergeistCurseTime = now;
        const curses: CurseType[] = ['fog_of_war', 'poltergeist_shift', 'tombstone_crumble'];
        const randomCurse = curses[Math.floor(Math.random() * curses.length)];
        setTimeout(() => {
          this.triggerPoltergeistCurse(randomCurse);
        }, 1200);
      }
    }
  }

  public triggerPoltergeistCurse(curse: CurseType): void {
    const curseTaunts: Record<Exclude<CurseType, 'none'>, string> = {
      fog_of_war: 'Memory Leak Alert! Uncollected dangling pointers blinding the GC! Can you compact blindly?',
      poltergeist_shift: 'CPU Context Switch! High-priority thread preemption displaces your active allocation pointer!',
      soul_inversion: 'Heap-Stack Collision! Pointer growth inverted upwards!',
      tombstone_crumble: 'Silent ECC Bit Rot! Allocated memory pages decaying into corrupted blocks!',
    };

    if (curse !== 'none') {
      this.broadcast('poltergeist', 'The Chaos Monkey', curseTaunts[curse], 'taunt');
      this.curseListeners.forEach((fn) => fn(curse));
    }
  }

  public notifyNearDeath(highestRow: number): void {
    if (highestRow <= 4) {
      this.broadcast(
        'pajitnov',
        "The GC Optimizer",
        'CRITICAL: Memory pressure at 92%! OOMKilled threshold imminent. Trigger urgent page compactions!',
        'urgent'
      );
      this.broadcast(
        'gravedigger',
        'The Memory Profiler',
        'WARNING: Kernel panic imminent. Allocation skyline has breached page threshold.',
        'urgent'
      );
    }
  }

  public notifyGameOver(stats: { score: number; lines: number; exorcisms: number }): void {
    this.broadcast(
      'system',
      'System Telemetry',
      `💀 KERNEL PANIC: OUT OF MEMORY (OOM). Reclaimed: ${(stats.exorcisms * 5.12).toFixed(1)} MB | Sweeps: ${stats.lines}`,
      'urgent'
    );
    this.broadcast(
      'gravedigger',
      'The Memory Profiler',
      `Core dump captured. ${stats.lines} page rows compacted before fragmentation exceeded physical limits.`,
      'lore'
    );
    this.broadcast(
      'pajitnov',
      "The GC Optimizer",
      'In 1984, memory was finite; in modern cloud containers, it still is. Reboot the kernel to initialize a fresh heap.',
      'strategic'
    );
  }
}

export const kiroCrew = new KiroCrewOrchestrator();
