/**
 * PROMETHEUS Demonstration Simulator (Mode B)
 * Deterministic illustrative computational modeling for workflow verification.
 * 
 * CRITICAL TRANSPARENCY NOTICE:
 * This module is a deterministic demonstration simulator for prototyping.
 * Results from this module are NOT ab-initio quantum chemistry or DFT results,
 * and must NEVER be presented as real experimental discoveries.
 */

import { MolecularCandidate, ComputationalDetails } from '../types/scientific';
import { calculateMasses, calculateTPSA } from './cheminformatics';

/**
 * Deterministically simulates lithium-ion continuum solvation free energy (ΔG_solv) in kcal/mol.
 * Formula is parameterized deterministically based on cyclic ring constraint and electronegative fluorine count.
 */
export function simulateSolvationFreeEnergy(candidate: MolecularCandidate): {
  numericalResult: number;
  details: ComputationalDetails;
} {
  const masses = calculateMasses(candidate);
  const tpsa = calculateTPSA(candidate);

  // Count fluorine atoms
  const fluorineCount = candidate.atoms.filter(a => a.element === 'F').length;
  const isCyclic = candidate.structuralClass.toLowerCase().includes('cyclic');

  // Baseline simulated solvation energy
  // Cyclic carbonates provide tighter dielectric dipole alignment (~ -13.5 kcal/mol)
  // Linear carbonates suffer rotational entropic penalties (~ -10.2 kcal/mol)
  // Fluorine addition introduces strong inductive local dipoles (~ -1.2 kcal/mol per F)
  let baseEnergy = isCyclic ? -13.5 : -10.2;
  baseEnergy -= fluorineCount * 1.45;

  if (candidate.id === 'PC') {
    // Bulky methyl steric shielding slightly reduces ion approach
    baseEnergy += 0.6;
  } else if (candidate.id === 'VC') {
    // Planar unsaturated ring
    baseEnergy -= 0.3;
  }

  const numericalResult = parseFloat(baseEnergy.toFixed(2));

  const details: ComputationalDetails = {
    monoisotopicMass: masses.monoisotopicMass,
    molecularWeight: masses.molecularWeight,
    tpsa,
    wienerIndex: isCyclic ? 24 : 38,
    randicIndex: 2.15,
    rotatableBonds: isCyclic ? 0 : 2,
    hBondDonors: 0,
    hBondAcceptors: 3 + fluorineCount,
    estimatedLogP: -0.3,
    atomCount: candidate.atoms.length,
    bondCount: candidate.bonds.length,
    formula: masses.formula,
    calculationSource: 'simulation_parameterized',
    methodSignature: 'DEMO-SIM: Parameterized Continuum Solvation Model v0.8.2 [EXPLICITLY SIMULATED]',
    warnings: [
      'DEMONSTRATION SIMULATION — NOT A REAL SCIENTIFIC DISCOVERY',
      'Parameterized continuum model for workflow verification only; not evaluated via quantum DFT/PySCF.',
    ],
  };

  return { numericalResult, details };
}

/**
 * Deterministically simulates frontier orbital HOMO-LUMO gap in electron-volts (eV).
 */
export function simulateHomoLumoGap(candidate: MolecularCandidate): {
  numericalResult: number;
  details: ComputationalDetails;
} {
  const masses = calculateMasses(candidate);
  const tpsa = calculateTPSA(candidate);
  const fluorineCount = candidate.atoms.filter(a => a.element === 'F').length;
  const isUnsaturated = candidate.id === 'VC';

  // Saturated cyclic carbonate bandgap ~ 7.2 eV; unsaturation lowers gap to ~ 5.4 eV
  let gap = isUnsaturated ? 5.35 : 7.15;
  gap += fluorineCount * 0.35; // Fluorine widens bandgap due to deep HOMO stabilization

  const numericalResult = parseFloat(gap.toFixed(2));

  const details: ComputationalDetails = {
    monoisotopicMass: masses.monoisotopicMass,
    molecularWeight: masses.molecularWeight,
    tpsa,
    wienerIndex: 24,
    randicIndex: 2.1,
    rotatableBonds: 0,
    hBondDonors: 0,
    hBondAcceptors: 3,
    estimatedLogP: 0.1,
    atomCount: candidate.atoms.length,
    bondCount: candidate.bonds.length,
    formula: masses.formula,
    calculationSource: 'simulation_parameterized',
    methodSignature: 'DEMO-SIM: Parameterized Frontier Orbital Bandgap Model [EXPLICITLY SIMULATED]',
    warnings: [
      'DEMONSTRATION SIMULATION — NOT A REAL SCIENTIFIC DISCOVERY',
      'Simulated surrogate proxy; does not run B3LYP/6-31G* quantum self-consistent field iterations.',
    ],
  };

  return { numericalResult, details };
}
