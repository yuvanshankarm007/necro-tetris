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
      'Séance Terminal',
      '🔮 The Séance has begun. Three spirits inhabit the Elektronika 60 silicon.',
      'lore'
    );
    setTimeout(() => {
      this.broadcast(
        'pajitnov',
        "The Architect's Ghost",
        'Greetings, comrade. In 1984 we had only ASCII brackets on monochrome phosphor. Stack true, keep column 9 open, and prepare for line exorcisms.',
        'strategic'
      );
    }, 800);
    setTimeout(() => {
      this.broadcast(
        'gravedigger',
        'The Gravedigger',
        'The ground is fresh. Every tetromino locked is a tombstone placed in this eternal crypt.',
        'lore'
      );
    }, 1800);
  }

  public notifyLineClear(lines: number, score: number, combo: number): void {
    if (lines === 4) {
      // Tetris / Exorcism
      this.broadcast(
        'pajitnov',
        "The Architect's Ghost",
        `MAGNIFICENT! 4-line Exorcism executed! Active curses banished and souls set free. Score: +${score}.`,
        'strategic'
      );
      this.broadcast(
        'gravedigger',
        'The Gravedigger',
        'Four graves purified in one thunderous stroke! The crypt bell tolls in reverence.',
        'lore'
      );
      this.broadcast(
        'poltergeist',
        'The Poltergeist',
        'Curses! My dark fog was banished! Do not get comfortable, mortal...',
        'taunt'
      );
    } else if (combo >= 3) {
      this.broadcast(
        'pajitnov',
        "The Architect's Ghost",
        `Combo x${combo}! Outstanding cadence. Maintain flat surface transitions.`,
        'strategic'
      );

      // Chance for Poltergeist retaliation on high combo!
      const now = Date.now();
      if (now - this.lastPoltergeistCurseTime > 15000) {
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
      fog_of_war: 'Hehehe! Let thick graveyard fog swallow your vision! See if you can stack blind!',
      poltergeist_shift: 'A telekinetic gust shoves your piece! Oops, did your hand slip?',
      soul_inversion: 'Down is up! The vortex flips gravity itself! Cling to the ceiling!',
      tombstone_crumble: 'Brittle bones! Your next pieces shall rot into dusty tombstone debris!',
    };

    if (curse !== 'none') {
      this.broadcast('poltergeist', 'The Poltergeist', curseTaunts[curse], 'taunt');
      this.curseListeners.forEach((fn) => fn(curse));
    }
  }

  public notifyNearDeath(highestRow: number): void {
    if (highestRow <= 4) {
      this.broadcast(
        'pajitnov',
        "The Architect's Ghost",
        'CRITICAL WARNING! The stack is approaching the Elektronika buffer ceiling! Look for urgent clears!',
        'urgent'
      );
      this.broadcast(
        'gravedigger',
        'The Gravedigger',
        'I am measuring your final plot. One misdrop and the crypt closes forever.',
        'urgent'
      );
    }
  }

  public notifyGameOver(stats: { score: number; lines: number; exorcisms: number }): void {
    this.broadcast(
      'system',
      'Séance Terminal',
      `💀 SÉANCE CONCLUDED. Final Score: ${stats.score} | Lines: ${stats.lines} | Exorcisms: ${stats.exorcisms}`,
      'urgent'
    );
    this.broadcast(
      'gravedigger',
      'The Gravedigger',
      `Here lies the player. ${stats.lines} stones laid, ${stats.exorcisms} souls purified. May their high score rest in peace.`,
      'lore'
    );
    this.broadcast(
      'pajitnov',
      "Dr. Alexey's Ghost",
      'A valiant effort. In 1984, every game ended in defeat; it is the symmetry of the struggle that endures. Revive to try again.',
      'strategic'
    );
  }
}

export const kiroCrew = new KiroCrewOrchestrator();
