# Steering: Zero-Crash Live Demo Guardrails

1. **Self-Contained Offline Operation**:
   - The application must function 100% locally in any browser with zero network calls required for core gameplay, audio synthesis, and AI agent logic.
   - If an external LLM endpoint or agent network fails or rate-limits, fall back seamlessly to the built-in Dellacherie heuristic engine and procedural dialogue generator without displaying unhandled error dialogs.

2. **Web Audio Safety**:
   - Handle browser autoplay policies gracefully (`AudioContext.state === 'suspended'`).
   - Automatically resume `AudioContext` on the first user interaction (button press or keydown).

3. **Window & Keyboard Focus**:
   - Prevent default scroll behavior for arrow keys (`Space`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`) when the game is active.
