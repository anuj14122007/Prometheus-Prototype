/**
 * PROMETHEUS Autonomous Agent Planner & Evidence Critic
 * Formulates testable hypotheses, analyzes computational evidence,
 * and executes transparent rule-based candidate selection.
 */

import { CANDIDATES_REGISTRY } from '../data/candidates';
import {
  MolecularCandidate,
  ResearchObjective,
  ExperimentRecord,
  ExperimentPlan,
  EvidenceAnalysis,
  AgentDecision,
  EvidenceCategory,
  StoppingCondition,
} from '../types/scientific';
import { buildEquivalenceKey } from './memoryLedger';

/**
 * Generates an experiment plan and hypothesis for a chosen candidate and objective.
 */
export function formulateExperimentPlan(
  candidate: MolecularCandidate,
  objective: ResearchObjective,
  iterationNumber: number,
  history: ExperimentRecord[]
): ExperimentPlan {
  const experimentId = `EXP-${String(iterationNumber).padStart(3, '0')}`;
  const isSimulated = objective.executionMode === 'DEMONSTRATION_SIMULATION';

  let hypothesis = '';
  let whySelected = '';
  let expectedObservation = '';
  const assumptionsAndLimitations: string[] = [];

  const testedCount = history.length;
  const isCyclic = candidate.structuralClass.toLowerCase().includes('cyclic');
  const isFluorinated = candidate.atoms.some(a => a.element === 'F');

  if (objective.propertyKey === 'tpsa') {
    if (testedCount === 0) {
      hypothesis = `Baseline cyclic carbonate ${candidate.name} exhibits concentrated dipole density, yielding TPSA ≥ ${objective.targetThreshold} Å² due to rigid dioxolane ring geometry.`;
      whySelected = 'Selected as the foundational cyclic reference benchmark against which functionalized and linear variants will be compared.';
      expectedObservation = `Calculated TPSA expected to meet or exceed ${objective.targetThreshold} Å² based on two cyclic ester oxygens and one carbonyl group.`;
    } else if (isFluorinated) {
      hypothesis = `Electronegative fluorine substitution on the dioxolane scaffold in ${candidate.name} preserves the high polar surface area (≥ 38.0 Å²) while withdrawing electron density from adjacent carbons.`;
      whySelected = `Selected following previous benchmark results to test whether fluorine addition perturbs topological polar surface area while enhancing oxidative stability.`;
      expectedObservation = `TPSA should remain at 38.77 Å² because fluorine does not contribute directly to Ertl TPSA, while molecular weight increases to ${candidate.canonicalWeight} g/mol.`;
    } else if (!isCyclic) {
      hypothesis = `Acyclic linear carbonate ${candidate.name} will exhibit lower TPSA (< 38.0 Å²) compared to cyclic analogues due to less constrained ester oxygen conformers.`;
      whySelected = `Selected as a structural negative comparator to verify whether cyclic ring constraint is strictly required to achieve the threshold TPSA of ≥ 38.0 Å².`;
      expectedObservation = `Calculated TPSA expected to drop to ~ 35.53 Å², falling below the target threshold of ${objective.targetThreshold} Å².`;
    } else {
      hypothesis = `Structural modification in ${candidate.name} alters molecular volume without decreasing the core carbonate polar surface area.`;
      whySelected = `Selected to investigate how alkyl branch substitution modulates the mass-to-polar-surface ratio.`;
      expectedObservation = `TPSA expected to meet ${objective.targetThreshold} Å² with increased molecular weight of ${candidate.canonicalWeight} g/mol.`;
    }

    assumptionsAndLimitations.push(
      'TPSA is a 2D topological descriptor and does not model 3D conformational dynamics or solvent-shell dielectric reorganization.',
      'Electrochemical stability and physical SEI formation require experimental or quantum kinetic verification.'
    );
  } else if (objective.propertyKey === 'simulatedSolvationFreeEnergy') {
    hypothesis = `[SIMULATED PROPOSAL] Fluorination in ${candidate.name} increases local electrostatic attraction toward Li⁺, driving simulated ΔG_solv below ${objective.targetThreshold} kcal/mol.`;
    whySelected = `Selected to evaluate the simulated continuum electrostatic profile across the ${candidate.name} scaffold.`;
    expectedObservation = `Simulated ΔG_solv predicted to fall between -12.0 and -17.0 kcal/mol depending on fluorine count.`;
    assumptionsAndLimitations.push(
      'DEMONSTRATION SIMULATION: Uses a parameterized continuum approximation, NOT full ab-initio quantum chemistry.',
      'Calculated solvation values are illustrative and must not be treated as physical experimental values.'
    );
  } else {
    hypothesis = `Topological graph complexity in ${candidate.name} correlates with chain branch length and ring presence.`;
    whySelected = `Selected to evaluate graph geodesic distance metrics across candidate chemical topologies.`;
    expectedObservation = `Wiener index expected to increase with heavy atom count and acyclic bond distance.`;
    assumptionsAndLimitations.push(
      'Wiener index considers topology only and treats all heavy atom vertices equally without heteroatom electronegativity weighting.'
    );
  }

  const parameters = {
    method: objective.calculationMethod,
    candidateSmiles: candidate.smiles,
    propertyKey: objective.propertyKey,
  };

  const equivalenceKey = buildEquivalenceKey(
    candidate.id,
    candidate.smiles,
    objective.calculationMethod,
    objective.executionMode,
    parameters
  );

  return {
    experimentId,
    iterationNumber,
    candidateId: candidate.id,
    candidateName: candidate.name,
    smiles: candidate.smiles,
    hypothesis,
    whySelected,
    propertyMeasured: `${objective.targetProperty} (${objective.targetUnit})`,
    calculationMethod: objective.calculationMethod,
    executionMode: objective.executionMode,
    expectedObservation,
    assumptionsAndLimitations,
    parameters,
    equivalenceKey,
  };
}

/**
 * Critically evaluates computational evidence against the hypothesis and objective.
 */
export function analyzeEvidence(
  numericalResult: number,
  candidate: MolecularCandidate,
  objective: ResearchObjective,
  executionMode: 'REAL_COMPUTATION' | 'DEMONSTRATION_SIMULATION'
): EvidenceAnalysis {
  let targetMet = false;
  if (objective.comparator === 'gte') {
    targetMet = numericalResult >= objective.targetThreshold;
  } else if (objective.comparator === 'lte') {
    targetMet = numericalResult <= objective.targetThreshold;
  }

  const evidenceCategory: EvidenceCategory =
    executionMode === 'REAL_COMPUTATION' ? 'COMPUTATIONALLY_DERIVED' : 'SIMULATED';

  let conclusion = '';
  let impactOnNextDecision = '';
  const limitations: string[] = [];
  const unknownFactors: string[] = [];

  const isCyclic = candidate.structuralClass.toLowerCase().includes('cyclic');
  const isFluorinated = candidate.atoms.some(a => a.element === 'F');

  if (objective.propertyKey === 'tpsa') {
    if (targetMet) {
      conclusion = `Calculated TPSA of ${numericalResult} ${objective.targetUnit} for ${candidate.name} successfully meets the target threshold (≥ ${objective.targetThreshold} Å²). Cyclic ring conformation maintains maximal polar ester oxygen exposure.`;
      impactOnNextDecision = isFluorinated
        ? `Hypothesis supported: Fluorinated cyclic scaffold retains high TPSA. Next, test higher fluorination (DFEC) or explore acyclic contrast (DMC).`
        : `Target threshold achieved for unsubstituted cyclic scaffold. Next decision should test if electronegative functionalization or acyclic opening alters this metric.`;
    } else {
      conclusion = `Calculated TPSA of ${numericalResult} ${objective.targetUnit} for ${candidate.name} falls below the target threshold of ${objective.targetThreshold} Å². Linear conformational freedom reduces effective polar surface contribution.`;
      impactOnNextDecision = `Confirms that linear acyclic carbonates fail the high-polar-density criterion. Search should prioritize cyclic scaffolds.`;
    }

    limitations.push(
      'Calculation is based on 2D topological fragment summation (Ertl-Rohde). It does not reflect 3D electrostatic potential surfaces.',
      'Does not measure liquid viscosity, flash point, or thermal decomposition kinetics.'
    );
    unknownFactors.push(
      'Actual lithium-ion desolvation activation barrier at the solid-electrolyte interphase.',
      'Electrochemical oxidative stability beyond 4.5V vs Li/Li⁺.'
    );
  } else if (objective.propertyKey === 'simulatedSolvationFreeEnergy') {
    conclusion = `[SIMULATED] Returned simulated ΔG_solv = ${numericalResult} kcal/mol. Illustrates progressive dipole enhancement from fluorine substitution.`;
    impactOnNextDecision = `Simulated parameter indicates favorable electrostatic binding. Next, evaluate whether additional fluorination yields diminishing returns.`;
    limitations.push(
      'DEMONSTRATION SIMULATION ONLY: Model does not solve the quantum Kohn-Sham DFT equations.',
      'Not calibrated against experimental calorimetric or electrochemical titration measurements.'
    );
    unknownFactors.push('Real quantum electron correlation and solvent shell polarization.');
  } else {
    conclusion = `Wiener Index computed at ${numericalResult}. Reflects topological compactess across ${candidate.name}.`;
    impactOnNextDecision = `Candidate exhibits ${targetMet ? 'compact' : 'extended'} topological structure. Informs subsequent candidate selection.`;
    limitations.push('Graph metric is purely geometric-topological; does not account for chemical bond polarities.');
    unknownFactors.push('Conformational isomer populations in fluid phase.');
  }

  return {
    conclusion,
    evidenceCategory,
    targetMet,
    limitations,
    unknownFactors,
    impactOnNextDecision,
  };
}

/**
 * Transparent, deterministic rule-based candidate selector.
 * Analyzes prior records, reviews evidence, respects budget, and chooses the next scientific action.
 */
export function planNextAutonomousStep(
  objective: ResearchObjective,
  history: ExperimentRecord[],
  maxBudget: number
): AgentDecision {
  // 1. Check budget stopping condition
  if (history.length >= maxBudget) {
    const stoppingCondition: StoppingCondition = {
      code: 'BUDGET_EXHAUSTED',
      title: 'Experiment Budget Reached',
      explanation: `Allocated research budget of ${maxBudget} experiments has been fully utilized. The autonomous search loop stops to prevent unbounded computation.`,
    };
    return {
      nextCandidate: null,
      rationale: `Maximum budget of ${maxBudget} iterations reached. Summarizing recorded evidence.`,
      previousEvidenceReviewed: `Evaluated ${history.length} experiments across ${new Set(history.map(h => h.candidate.id)).size} unique candidates.`,
      decisionRule: 'Budget Enforcement Rule: Terminate when total_experiments >= max_budget.',
      shouldStop: true,
      stoppingCondition,
    };
  }

  // 2. Identify candidates already tested
  const testedCandidateIds = new Set(history.map(h => h.candidate.id));
  const poolIds = objective.candidatePoolIds;

  // Check if all candidates in pool have been tested
  const remainingIds = poolIds.filter(id => !testedCandidateIds.has(id));
  if (remainingIds.length === 0) {
    const stoppingCondition: StoppingCondition = {
      code: 'NO_VIABLE_CANDIDATES',
      title: 'Candidate Pool Exhausted',
      explanation: 'All pre-defined candidates in the specified research domain pool have been systematically evaluated.',
    };
    return {
      nextCandidate: null,
      rationale: 'No remaining untested candidates available in the specified library.',
      previousEvidenceReviewed: `All ${poolIds.length} candidate scaffolds have been tested and recorded in research memory.`,
      decisionRule: 'Exhaustion Rule: Terminate when pool.untested == 0.',
      shouldStop: true,
      stoppingCondition,
    };
  }

  // 3. Evidence-informed selection logic
  // Strategy:
  // - Start with foundational baseline (EC)
  // - If baseline meets threshold, proceed to test chemical substitution (FEC, then DFEC)
  // - Then test a negative control/comparator (DMC or PC) to verify hypothesis boundaries
  // - Then test alternative cyclic variant (VC)
  let chosenCandidateId: string | null = null;
  let rationale = '';
  let rule = '';

  const successfulExperiments = history.filter(h => h.executionStatus === 'success');
  const lastRecord = successfulExperiments[0]; // most recent

  if (history.length === 0) {
    // Initial experiment: select foundational baseline
    chosenCandidateId = remainingIds.includes('EC') ? 'EC' : remainingIds[0];
    rationale = 'Initiating autonomous discovery loop with baseline unsubstituted cyclic carbonate (EC) to establish the experimental reference point.';
    rule = 'Policy Rule 1 [Bootstrap]: Select reference standard scaffold to establish property baseline.';
  } else if (lastRecord && lastRecord.candidate.id === 'EC') {
    // Previous was EC: Next test mono-fluorinated derivative to see effect of halogenation
    if (remainingIds.includes('FEC')) {
      chosenCandidateId = 'FEC';
      rationale = `Previous experiment #EXP-001 on EC confirmed high TPSA (${lastRecord.numericalResult} Å²). Now selecting mono-fluoro derivative (FEC) to evaluate whether fluorine substitution preserves polar area while increasing electrochemical passivation capability.`;
      rule = 'Policy Rule 2 [Functionalization]: Test mono-heteroatom substitution to observe incremental property perturbation.';
    } else {
      chosenCandidateId = remainingIds[0];
      rationale = `Moving to next candidate following EC baseline evaluation.`;
      rule = 'Policy Rule 2.1 [Fallback]: Select next available candidate in search queue.';
    }
  } else if (lastRecord && lastRecord.candidate.id === 'FEC') {
    // Next test di-fluoro derivative (DFEC) or acyclic contrast
    if (remainingIds.includes('DFEC')) {
      chosenCandidateId = 'DFEC';
      rationale = `Previous experiment #EXP-002 on FEC showed TPSA of ${lastRecord.numericalResult} Å². Selecting di-fluorinated DFEC to determine if second fluorine atom introduces steric or polar trade-offs.`;
      rule = 'Policy Rule 3 [Gradient Scaling]: Increase substituent density along the fluorination axis.';
    } else if (remainingIds.includes('DMC')) {
      chosenCandidateId = 'DMC';
      rationale = `Fluorinated cyclic series tested. Now selecting linear symmetrical carbonate (DMC) as a negative structural comparator to test whether cyclic ring confinement is necessary for high TPSA.`;
      rule = 'Policy Rule 4 [Structural Contrast]: Test acyclic isomer to evaluate ring-confinement requirement.';
    } else {
      chosenCandidateId = remainingIds[0];
      rationale = `Selecting next candidate in sequence.`;
      rule = 'Policy Rule 3.1 [Sequential Next].';
    }
  } else if (lastRecord && (lastRecord.candidate.id === 'DFEC' || lastRecord.candidate.id === 'PC')) {
    // Select linear comparator if not yet tested
    if (remainingIds.includes('DMC')) {
      chosenCandidateId = 'DMC';
      rationale = `Cyclic candidates evaluated. Introducing linear acyclic carbonate (DMC) as a negative structural control to empirically verify that acyclic geometry lowers polar surface area below the target threshold.`;
      rule = 'Policy Rule 4 [Structural Contrast]: Test acyclic isomer to evaluate ring-confinement requirement.';
    } else if (remainingIds.includes('VC')) {
      chosenCandidateId = 'VC';
      rationale = `Selecting vinylene carbonate (VC) to investigate whether an endocyclic double bond alters ring planarity and polar properties.`;
      rule = 'Policy Rule 5 [Unsaturation Variant]: Test unsaturated ring scaffold.';
    } else {
      chosenCandidateId = remainingIds[0];
      rationale = `Continuing candidate evaluation with next unmeasured molecule.`;
      rule = 'Policy Rule 5.1 [Queue Next].';
    }
  } else {
    // Default next candidate
    chosenCandidateId = remainingIds[0];
    rationale = `Selecting candidate ${chosenCandidateId} to systematically map remaining structural space within the allocated experiment budget.`;
    rule = 'Policy Rule 6 [Systematic Screening]: Progressively evaluate untested pool members.';
  }

  const nextCandidate = chosenCandidateId ? CANDIDATES_REGISTRY[chosenCandidateId] : null;

  return {
    nextCandidate,
    rationale,
    previousEvidenceReviewed: `Reviewed ${history.length} prior experiments (Latest: #${history[0]?.experimentId} ${history[0]?.candidate.name} → ${history[0]?.numericalResult} ${history[0]?.units}).`,
    decisionRule: rule,
    shouldStop: false,
  };
}
