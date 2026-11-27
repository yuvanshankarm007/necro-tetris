# Steering: Spooky Design Tokens & CRT Aesthetics

1. **Color Palettes**:
   - **Soviet 1984 Green Phosphor**:
     - Background: `#050d06`
     - Phosphor Primary: `#33ff66`
     - Phosphor Glow: `rgba(51, 255, 102, 0.4)`
     - CRT Scanline Tint: `rgba(10, 30, 15, 0.3)`
   - **Soviet 1984 Amber Phosphor**:
     - Background: `#0f0902`
     - Amber Primary: `#ffaa00`
     - Amber Glow: `rgba(255, 170, 0, 0.35)`
   - **Gothic Blood & Crypt**:
     - Background: `#0a0508`
     - Blood Red: `#ff2a4b`
     - Spectral Cyan / Ectoplasm: `#00f0ff`
     - Crypt Violet: `#a855f7`
     - Ghostly White: `#e2e8f0`

2. **Typography**:
   - Monospace terminal fonts (`VT323`, `Fira Code`, `monospace`, `Courier New`).
   - Text rendered with subtle text-shadows replicating CRT electron beam blooming.

3. **Audio Guidelines**:
   - Master volume capped at 0.3 to prevent ear fatigue.
   - Frequency envelopes must always taper smoothly to avoid DC-offset audio clicking.
