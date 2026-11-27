#!/usr/bin/env node
/**
 * .kiro/hooks/pre-commit.js
 * Automated Kiro Agent Hook: Enforces SRS and PBT invariants before commits.
 */

import { execSync } from 'child_process';

console.log('👻 [Kiro Hook: Pre-Commit] Summoning spirits to audit code invariants...');

try {
  // Run property-based tests
  console.log('🔮 Running Fast-Check Property-Based Tests (PBT)...');
  execSync('npx vitest run', { stdio: 'inherit' });
  console.log('✅ [Kiro Hook] All mathematical invariants verified by the Ghostly Council.');
  process.exit(0);
} catch (error) {
  console.error('❌ [Kiro Hook] PBT verification failed! Commit banished by the Poltergeist.');
  process.exit(1);
}
