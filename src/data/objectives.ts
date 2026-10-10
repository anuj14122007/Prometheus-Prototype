/**
 * Preconfigured scientific research objectives for PROMETHEUS investigations.
 */

import { ResearchObjective } from '../types/scientific';

export const RESEARCH_OBJECTIVES: ResearchObjective[] = [
  {
    id: 'obj_carbonate_tpsa',
    title: 'Screening Carbonate Electrolyte Solvents: Polar Surface Area & Topological Density',
    domain: 'Computational Physical Chemistry / Energy Storage',
    question: 'How does cyclic ring confinement versus linear alkyl chain extension alter Topological Polar Surface Area (TPSA) and molecular compactness in battery electrolyte candidates?',
    rationale: 'High dielectric permittivity in battery electrolytes is driven by concentrated polar oxygen dipoles. Cyclic carbonates constrain the carbonyl dipole, whereas linear carbonates trade dipole alignment for lower viscosity. Computational screening identifies scaffolds with TPSA ≥ 38.0 Å² while maintaining low molecular weight (<110 g/mol).',
    targetProperty: 'Topological Polar Surface Area (TPSA)',
    propertyKey: 'tpsa',
    targetUnit: 'Å²',
    targetThreshold: 38.0,
    comparator: 'gte',
    defaultMaxBudget: 5,
    calculationMethod: 'Cheminformatics Polar Fragment Contribution (Ertl-Rohde Algorithm)',
    executionMode: 'REAL_COMPUTATION',
    candidatePoolIds: ['EC', 'FEC', 'DFEC', 'VC', 'PC', 'DMC', 'EMC', 'DEC'],
    stoppingExplanation: 'Terminates when a candidate achieves TPSA ≥ 38.0 Å² with compact molecular mass, or when the maximum experiment budget (5 experiments) is exhausted.',
  },
  {
    id: 'obj_solvation_simulated',
    title: 'Simulated Continuum Solvation Free Energy (ΔG_solv) across Fluorinated Solvents',
    domain: 'Molecular Solvation Modeling (Demonstration Simulator)',
    question: 'What is the simulated electrostatic contribution to lithium-ion solvation free energy (ΔG_solv) as progressive fluorine substituents are introduced onto the carbonate scaffold?',
    rationale: 'Demonstration simulation module illustrating how PROMETHEUS handles parameterized quantum/continuum models when full ab-initio quantum chemistry clusters are offline.',
    targetProperty: 'Simulated Solvation Free Energy (ΔG_solv)',
    propertyKey: 'simulatedSolvationFreeEnergy',
    targetUnit: 'kcal/mol',
    targetThreshold: -14.0,
    comparator: 'lte', // more negative = stronger solvation
    defaultMaxBudget: 5,
    calculationMethod: 'Parameterized Polarizable Continuum Approximation (Simulator Mode)',
    executionMode: 'DEMONSTRATION_SIMULATION',
    candidatePoolIds: ['EC', 'PC', 'FEC', 'DFEC', 'VC', 'DMC'],
    stoppingExplanation: 'Terminates when simulated ΔG_solv ≤ -14.0 kcal/mol or budget of 5 experiments is reached. Explicitly labeled as simulated.',
  },
  {
    id: 'obj_wiener_branching',
    title: 'Topological Graph Complexity & Molecular Branching (Wiener Index)',
    domain: 'Chemical Graph Theory / Molecular Topology',
    question: 'How does structural branching and cyclic topology affect graph vertex distance metrics (Wiener Index W) across battery solvent scaffolds?',
    rationale: 'The Wiener topological index measures the sum of all pairwise graph geodesic distances. It correlates inversely with molecular compactness and directly with solvent diffusion coefficients.',
    targetProperty: 'Wiener Topological Index (W)',
    propertyKey: 'wienerIndex',
    targetUnit: 'index (dimensionless)',
    targetThreshold: 35.0,
    comparator: 'lte',
    defaultMaxBudget: 5,
    calculationMethod: 'Floyd-Warshall Topological All-Pairs Shortest Path Matrix',
    executionMode: 'REAL_COMPUTATION',
    candidatePoolIds: ['EC', 'VC', 'PC', 'DMC', 'EMC', 'DEC', 'FEC'],
    stoppingExplanation: 'Terminates when a candidate exhibits high compactness (Wiener Index ≤ 35.0) or budget is exhausted.',
  },
];
