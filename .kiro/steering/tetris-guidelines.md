# Steering: Tetris Guideline Invariants & Physics

These steering rules govern the mathematical and behavioral precision of the game engine:

1. **SRS Rotation Fidelity**:
   - Every rotation must check initial rotation first, then sequentially test the 4 wall-kick offsets if blocked.
   - If all 5 tests fail, rotation is cancelled cleanly with no state mutation.
   - The I-piece uses dedicated 4x4 bounding box wall-kick tables distinct from JLSTZ.

2. **7-Bag Randomizer Invariant**:
   - Pieces must be drawn from a pseudorandom permutation of `[I, J, L, O, S, T, Z]`.
   - Never generate pieces using naive independent uniform sampling (`Math.floor(Math.random() * 7)`), which causes severe piece droughts.

3. **Lock Delay Protocol**:
   - When a piece touches the floor, a 500ms lock countdown starts.
   - Moving or rotating resets this timer, up to a maximum of 15 resets to prevent infinite stall.

4. **Matrix Bound Safety**:
   - Matrix is strictly 10 columns by 22 rows (20 visible rows, 2 hidden spawn rows).
   - Coordinates out of `[0..9]` (X) or `< 0` or `>= 22` (Y) are hard illegal states.
