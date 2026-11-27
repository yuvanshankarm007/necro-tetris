import {
  BOARD_WIDTH,
  BOARD_VISIBLE_HEIGHT,
  BOARD_BUFFER_HEIGHT,
  TETROMINO_SHAPES,
  THEME_CONFIG,
} from '../core/constants';
import {
  TetrominoType,
  DisplayTheme,
  MatrixCell,
  ActivePiece,
  ActiveCurse,
} from '../core/types';
import { calculateGhostY } from '../core/srs';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  life: number;
  maxLife: number;
}

export class CRTRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private fogOffset: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  public render(
    matrix: MatrixCell[][],
    activePiece: ActivePiece | null,
    theme: DisplayTheme,
    activeCurse: ActiveCurse | null,
    isSovietMode: boolean,
    actionBanner: string | null = null
  ): void {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const ctx = this.ctx;
    const themeConfig = THEME_CONFIG[theme];

    // Clear background
    ctx.fillStyle = themeConfig.bg;
    ctx.fillRect(0, 0, width, height);

    const cellSize = Math.floor(height / BOARD_VISIBLE_HEIGHT);
    const offsetX = Math.floor((width - BOARD_WIDTH * cellSize) / 2);

    // 1. Draw Grid lines & Hex Memory Row Addresses
    ctx.strokeStyle = themeConfig.gridLine;
    ctx.lineWidth = 1;
    for (let c = 0; c <= BOARD_WIDTH; c++) {
      ctx.beginPath();
      ctx.moveTo(offsetX + c * cellSize, 0);
      ctx.lineTo(offsetX + c * cellSize, height);
      ctx.stroke();
    }
    for (let r = 0; r <= BOARD_VISIBLE_HEIGHT; r++) {
      ctx.beginPath();
      ctx.moveTo(offsetX, r * cellSize);
      ctx.lineTo(offsetX + BOARD_WIDTH * cellSize, r * cellSize);
      ctx.stroke();
    }

    // Hex Memory Addresses on the left rail
    ctx.save();
    ctx.font = '8px monospace';
    ctx.fillStyle = themeConfig.gridLine.replace('0.12', '0.45');
    ctx.textAlign = 'right';
    for (let r = 0; r < BOARD_VISIBLE_HEIGHT; r++) {
      const hex = `0x${(r * 0x0200).toString(16).toUpperCase().padStart(4, '0')}`;
      ctx.fillText(hex, offsetX - 4, r * cellSize + cellSize * 0.65);
    }
    ctx.restore();

    // 2. Draw Locked Matrix Cells and Highlight Memory Leaks (Holes)
    for (let x = 0; x < BOARD_WIDTH; x++) {
      let blockSeen = false;
      for (let y = BOARD_BUFFER_HEIGHT; y < BOARD_BUFFER_HEIGHT + BOARD_VISIBLE_HEIGHT; y++) {
        const displayY = y - BOARD_BUFFER_HEIGHT;
        const cell = matrix[y][x];
        const drawX = offsetX + x * cellSize;
        const drawY = displayY * cellSize;

        if (cell.filled) {
          blockSeen = true;
          this.drawBlock(
            ctx,
            drawX,
            drawY,
            cellSize,
            cell.type || 'T',
            theme,
            cell.state || 'normal',
            isSovietMode
          );
        } else if (blockSeen) {
          // Fragmentation Hole / Uncollected Memory Leak
          ctx.save();
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          ctx.strokeRect(drawX + 2, drawY + 2, cellSize - 4, cellSize - 4);
          ctx.setLineDash([]);
          ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
          ctx.fillRect(drawX + 2, drawY + 2, cellSize - 4, cellSize - 4);
          ctx.restore();
        }
      }
    }

    // 3. Draw Ghost Piece Projection
    if (activePiece) {
      const ghostY = calculateGhostY(matrix, activePiece);
      const displayGhostY = ghostY - BOARD_BUFFER_HEIGHT;
      const shape = TETROMINO_SHAPES[activePiece.type][activePiece.rotation];
      const size = shape.length;

      ctx.save();
      ctx.globalAlpha = 0.28;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (shape[r][c] !== 0) {
            const blockX = activePiece.x + c;
            const blockY = displayGhostY + r;
            if (blockY >= 0 && blockY < BOARD_VISIBLE_HEIGHT && blockX >= 0 && blockX < BOARD_WIDTH) {
              const drawX = offsetX + blockX * cellSize;
              const drawY = blockY * cellSize;
              this.drawGhostBlock(ctx, drawX, drawY, cellSize, themeConfig.primaryText);
            }
          }
        }
      }
      ctx.restore();
    }

    // 4. Draw Active Falling Piece
    if (activePiece) {
      const shape = TETROMINO_SHAPES[activePiece.type][activePiece.rotation];
      const size = shape.length;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (shape[r][c] !== 0) {
            const blockX = activePiece.x + c;
            const blockY = activePiece.y - BOARD_BUFFER_HEIGHT + r;
            if (blockY >= 0 && blockY < BOARD_VISIBLE_HEIGHT && blockX >= 0 && blockX < BOARD_WIDTH) {
              const drawX = offsetX + blockX * cellSize;
              const drawY = blockY * cellSize;
              this.drawBlock(
                ctx,
                drawX,
                drawY,
                cellSize,
                activePiece.type,
                theme,
                'normal',
                isSovietMode,
                true // isActive
              );
            }
          }
        }
      }
    }

    // 5. Render Active Curse Effects
    if (activeCurse) {
      if (activeCurse.type === 'fog_of_war') {
        this.renderFogOfWar(ctx, offsetX, height, BOARD_WIDTH * cellSize);
      } else if (activeCurse.type === 'soul_inversion') {
        this.renderSoulInversion(ctx, offsetX, height, BOARD_WIDTH * cellSize);
      }
    }

    // 6. Update and Render Particles
    this.updateAndDrawParticles(ctx);

    // 7. Render Arcade Combat Banner (T-Spins, B2B, Exorcisms)
    if (actionBanner) {
      ctx.save();
      ctx.font = '900 15px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = themeConfig.primaryText;
      ctx.shadowColor = themeConfig.accentGlow;
      ctx.shadowBlur = 14;

      // Banner background pill
      const textWidth = ctx.measureText(actionBanner).width;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.strokeStyle = themeConfig.primaryText;
      ctx.lineWidth = 1.5;
      ctx.fillRect(width / 2 - textWidth / 2 - 10, height * 0.42 - 14, textWidth + 20, 28);
      ctx.strokeRect(width / 2 - textWidth / 2 - 10, height * 0.42 - 14, textWidth + 20, 28);

      ctx.fillStyle = themeConfig.primaryText;
      ctx.fillText(actionBanner, width / 2, height * 0.42);
      ctx.restore();
    }
  }

  private drawBlock(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    type: TetrominoType,
    theme: DisplayTheme,
    state: string,
    isSovietMode: boolean,
    isActive: boolean = false
  ): void {
    const config = THEME_CONFIG[theme];
    const color = config.colors[type];

    const allocLetter: Record<TetrominoType, string> = {
      I: 'B', // Buffer
      O: 'S', // Stack
      T: 'H', // Heap
      S: 'W', // Worker
      Z: 'K', // KV-Cache
      J: 'N', // Net/Socket
      L: 'D', // DOM
    };
    const tag = allocLetter[type] || 'H';

    if (isSovietMode) {
      // 1984 Elektronika 60 Text Mode: Render as green/amber bracket characters with allocation tag "[H]"
      ctx.save();
      ctx.fillStyle = color;
      ctx.shadowColor = config.accentGlow;
      ctx.shadowBlur = isActive ? 12 : 5;
      ctx.font = `bold ${Math.floor(size * 0.65)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`[${tag}]`, x + size / 2, y + size / 2);
      ctx.restore();
    } else {
      // Defrag Cluster Mode: Render with inner bevel and memory tag
      ctx.save();
      ctx.fillStyle = color;
      ctx.shadowColor = isActive ? config.primaryText : 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = isActive ? 10 : 3;
      ctx.fillRect(x + 1, y + 1, size - 2, size - 2);

      // Chiseled inner bevel
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(x + 2, y + 2, size - 4, 3);
      ctx.fillRect(x + 2, y + 2, 3, size - 4);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(x + 2, y + size - 5, size - 4, 3);
      ctx.fillRect(x + size - 5, y + 2, 3, size - 4);

      // Allocation letter overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = `bold ${Math.floor(size * 0.45)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tag, x + size / 2, y + size / 2);

      if (state === 'rotting' || state === 'fragmented') {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x + size * 0.35, y + size * 0.35, size * 0.3, size * 0.3);
      }

      ctx.restore();
    }
  }

  private drawGhostBlock(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    borderColor: string
  ): void {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(x + 2, y + 2, size - 4, size - 4);
    ctx.setLineDash([]);
  }

  public spawnLineClearParticles(clearedRow: number, linesCount: number, theme: DisplayTheme): void {
    const config = THEME_CONFIG[theme];
    const cellSize = Math.floor(this.canvas.height / BOARD_VISIBLE_HEIGHT);
    const offsetX = Math.floor((this.canvas.width - BOARD_WIDTH * cellSize) / 2);
    const y = (clearedRow - BOARD_BUFFER_HEIGHT) * cellSize;

    const particleCount = linesCount === 4 ? 60 : 25; // Exorcism produces massive burst

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: offsetX + Math.random() * (BOARD_WIDTH * cellSize),
        y: y + (Math.random() * linesCount * cellSize),
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.7) * 7,
        color: linesCount === 4 ? config.primaryText : '#ffffff',
        alpha: 1.0,
        size: Math.random() * 3.5 + 1.5,
        life: 0,
        maxLife: Math.random() * 25 + 20,
      });
    }
  }

  private updateAndDrawParticles(ctx: CanvasRenderingContext2D): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18; // gravity
      p.life++;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  private renderFogOfWar(
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    height: number,
    width: number
  ): void {
    this.fogOffset += 0.03;
    const fogHeight = height * 0.45; // covers bottom ~9 rows
    const startY = height - fogHeight;

    ctx.save();
    const gradient = ctx.createLinearGradient(0, startY, 0, height);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0)');
    gradient.addColorStop(0.3, 'rgba(30, 41, 59, 0.75)');
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0.96)');

    ctx.fillStyle = gradient;
    ctx.fillRect(offsetX, startY, width, fogHeight);

    // Fog tendrils
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    for (let x = offsetX; x <= offsetX + width; x += 10) {
      const wave = Math.sin(x * 0.05 + this.fogOffset) * 14;
      const y = startY + 40 + wave;
      if (x === offsetX) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🌫️ GRAVEYARD FOG ENGULFS THE PIT 🌫️', offsetX + width / 2, startY + 50);

    ctx.restore();
  }

  private renderSoulInversion(
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    height: number,
    width: number
  ): void {
    ctx.save();
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
    ctx.lineWidth = 2;
    const time = Date.now() * 0.003;

    for (let y = 0; y < height; y += 40) {
      const wave = Math.sin(y * 0.02 + time) * 15;
      ctx.beginPath();
      ctx.moveTo(offsetX, y + wave);
      ctx.lineTo(offsetX + width, y + wave);
      ctx.stroke();
    }

    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ SOUL INVERSION: REVERSED GRAVITY ⚡', offsetX + width / 2, 30);
    ctx.restore();
  }
}
