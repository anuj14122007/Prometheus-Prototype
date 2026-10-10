/**
 * PROMETHEUS — Autonomous Scientific Discovery Engine
 * Core TypeScript definitions for the scientific research loop.
 */

export type ExecutionMode = 'REAL_COMPUTATION' | 'DEMONSTRATION_SIMULATION';

export type EvidenceCategory =
  | 'HYPOTHESIS'
  | 'COMPUTATIONALLY_DERIVED'
  | 'SIMULATED'
  | 'UNVERIFIED'
  | 'EXPERIMENTALLY_VALIDATED';

export type PipelineStage =
  | 'IDLE'
  | 'RESEARCH_QUESTION'
  | 'HYPOTHESIS'
  | 'EXPERIMENT_PLAN'
  | 'SCIENTIFIC_COMPUTATION'
  | 'EVIDENCE_ANALYSIS'
  | 'RESEARCH_MEMORY'
  | 'NEXT_DECISION'
  | 'STOPPED';

export type InvestigationStep = 'CHOOSE' | 'TEST' | 'RESULT' | 'NEXT_DECISION' | 'FINISHED';

export interface Atom3D {
  element: string; // 'C', 'H', 'O', 'N', 'F', 'S', etc.
  x: number;
  y: number;
  z: number;
  label?: string;
}

export interface Bond3D {
  atom1: number;
  atom2: number;
  order: 1 | 2 | 3;
}

export interface MolecularCandidate {
  id: string;
  name: string;
  commonName: string;
  chemicalFormula: string;
  iupacName: string;
  smiles: string;
  pubchemCid: number;
  structuralClass: string;
  shortRole?: string;
  description: string;
  atoms: Atom3D[];
  bonds: Bond3D[];
  canonicalWeight: number; // g/mol
  benchmarkTpsa: number;   // Å²
}

export interface ResearchObjective {
  id: string;
  title: string;
  domain: string;
  question: string;
  rationale: string;
  targetProperty: string;
  propertyKey: 'tpsa' | 'wienerIndex' | 'randicIndex' | 'molecularWeight' | 'simulatedSolvationFreeEnergy' | 'simulatedHomoLumoGap';
  targetUnit: string;
  targetThreshold: number;
  comparator: 'gte' | 'lte' | 'target_range';
  targetRange?: [number, number];
  defaultMaxBudget: number;
  calculationMethod: string;
  executionMode: ExecutionMode;
  candidatePoolIds: string[];
  stoppingExplanation: string;
}

export interface ComputationalDetails {
  monoisotopicMass: number;
  molecularWeight: number;
  tpsa: number;
  wienerIndex: number;
  randicIndex: number;
  rotatableBonds: number;
  hBondDonors: number;
  hBondAcceptors: number;
  estimatedLogP: number;
  atomCount: number;
  bondCount: number;
  formula: string;
  calculationSource: 'cheminformatics_graph_engine' | 'pubchem_live_api' | 'simulation_parameterized';
  methodSignature: string;
  warnings?: string[];
}

export interface ExperimentPlan {
  experimentId: string;
  iterationNumber: number;
  candidateId: string;
  candidateName: string;
  smiles: string;
  hypothesis: string;
  whySelected: string;
  propertyMeasured: string;
  calculationMethod: string;
  executionMode: ExecutionMode;
  expectedObservation: string;
  assumptionsAndLimitations: string[];
  parameters: Record<string, any>;
  equivalenceKey: string;
}

export interface ExecutionResult {
  rawOutput: number;
  units: string;
  executionStatus: 'success' | 'failed' | 'reused';
  executionMode: ExecutionMode;
  calculationMethod: string;
  executionDurationMs: number;
  computationalDetails: ComputationalDetails;
  wasReused: boolean;
  reusedFromId?: string;
  failureReason?: string;
}

export interface EvidenceAnalysis {
  conclusion: string;
  evidenceCategory: EvidenceCategory;
  targetMet: boolean;
  limitations: string[];
  unknownFactors: string[];
  impactOnNextDecision: string;
}

export interface ExperimentRecord {
  experimentId: string;
  iterationNumber: number;
  timestamp: string;
  objectiveId: string;
  candidate: MolecularCandidate;
  hypothesis: string;
  calculationMethod: string;
  parameters: Record<string, any>;
  executionMode: ExecutionMode;
  numericalResult: number;
  units: string;
  executionStatus: 'success' | 'failed' | 'reused';
  wasReused: boolean;
  reusedFromExperimentId?: string;
  computationalDetails: ComputationalDetails;
  analysis: EvidenceAnalysis;
  equivalenceKey: string;
}

export type StoppingReasonCode =
  | 'SUCCESS_CRITERION_REACHED'
  | 'BUDGET_EXHAUSTED'
  | 'NO_VIABLE_CANDIDATES'
  | 'USER_TERMINATED'
  | 'CRITICAL_ERROR';

export interface StoppingCondition {
  code: StoppingReasonCode;
  title: string;
  explanation: string;
}

export interface AgentDecision {
  nextCandidate: MolecularCandidate | null;
  rationale: string;
  previousEvidenceReviewed: string;
  decisionRule: string;
  shouldStop: boolean;
  stoppingCondition?: StoppingCondition;
}

export interface ResearchMetrics {
  totalAttempts: number;
  successfulCalculations: number;
  failedCalculations: number;
  uniqueCandidatesEvaluated: number;
  equivalentResultsReused: number;
  totalElapsedSeconds: number;
  currentBudgetRemaining: number;
  maxBudget: number;
  executionMode: ExecutionMode;
}
