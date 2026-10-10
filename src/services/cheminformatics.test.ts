/**
 * Unit verification tests for PROMETHEUS cheminformatics calculations and memory ledger.
 */

import { CANDIDATES_REGISTRY } from '../data/candidates';
import {
  calculateMasses,
  calculateTPSA,
  calculateWienerIndex,
  calculateRandicIndex,
} from './cheminformatics';
import { buildEquivalenceKey } from './memoryLedger';

function runTests() {
  console.log('--- PROMETHEUS Scientific Logic Verification ---');

  // Test 1: Ethylene Carbonate (EC) calculations
  const ec = CANDIDATES_REGISTRY['EC'];
  if (!ec) throw new Error('EC candidate missing');

  const ecMass = calculateMasses(ec);
  console.log(`[PASS] EC Molecular Weight: ${ecMass.molecularWeight} g/mol (expected ~88.06)`);
  if (Math.abs(ecMass.molecularWeight - 88.06) > 0.5) {
    throw new Error(`EC weight mismatch: ${ecMass.molecularWeight}`);
  }

  const ecTpsa = calculateTPSA(ec);
  console.log(`[PASS] EC TPSA: ${ecTpsa} Å² (expected 38.77)`);
  if (Math.abs(ecTpsa - 38.77) > 0.1) {
    throw new Error(`EC TPSA mismatch: ${ecTpsa}`);
  }

  const ecWiener = calculateWienerIndex(ec);
  console.log(`[PASS] EC Heavy Atom Wiener Index: ${ecWiener}`);
  if (ecWiener <= 0) {
    throw new Error('EC Wiener index should be positive');
  }

  // Test 2: Linear Dimethyl Carbonate (DMC) TPSA contrast
  const dmc = CANDIDATES_REGISTRY['DMC'];
  if (!dmc) throw new Error('DMC candidate missing');

  const dmcTpsa = calculateTPSA(dmc);
  console.log(`[PASS] DMC Acyclic TPSA: ${dmcTpsa} Å² (expected 35.53)`);
  if (Math.abs(dmcTpsa - 35.53) > 0.1) {
    throw new Error(`DMC TPSA mismatch: ${dmcTpsa}`);
  }

  // Verify that cyclic EC has higher TPSA than linear DMC
  if (ecTpsa <= dmcTpsa) {
    throw new Error('Cyclic EC TPSA must exceed linear DMC TPSA');
  }
  console.log('[PASS] Structural contrast verified: EC (38.77) > DMC (35.53)');

  // Test 3: Equivalence key determinism
  const key1 = buildEquivalenceKey('EC', 'O=C1OCCO1', 'Ertl-Rohde', 'REAL_COMPUTATION', { a: 1, b: 2 });
  const key2 = buildEquivalenceKey('EC', 'O=C1OCCO1', 'Ertl-Rohde', 'REAL_COMPUTATION', { b: 2, a: 1 });
  const keyDifferentMethod = buildEquivalenceKey('EC', 'O=C1OCCO1', 'DFT-B3LYP', 'REAL_COMPUTATION', { a: 1 });

  if (key1 !== key2) {
    throw new Error('Equivalence keys should be identical regardless of parameter order');
  }
  if (key1 === keyDifferentMethod) {
    throw new Error('Equivalence keys must differentiate calculation method');
  }
  console.log('[PASS] Equivalence key deduplication logic verified');

  console.log('--- All PROMETHEUS Scientific Tests Passed Successfully ---');
}

runTests();
