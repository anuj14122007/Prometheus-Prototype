/**
 * PROMETHEUS Research Memory Ledger Service
 * Persistent storage of all hypothesis tests, calculation parameters, evidence analyses,
 * and equivalence caching.
 */

import {
  ExperimentRecord,
  ResearchMetrics,
  ExecutionMode,
  ResearchObjective,
} from '../types/scientific';

const STORAGE_KEY = 'prometheus_research_memory_v1';
const METRICS_KEY = 'prometheus_research_metrics_v1';

/**
 * Builds a deterministic equivalence key.
 * Candidate identity alone is NOT sufficient: includes chemical structure (SMILES),
 * exact computational method, execution mode, and parameter fingerprint.
 */
export function buildEquivalenceKey(
  candidateId: string,
  smiles: string,
  calculationMethod: string,
  executionMode: ExecutionMode,
  parameters: Record<string, any> = {}
): string {
  const paramStr = Object.keys(parameters)
    .sort()
    .map(k => `${k}=${JSON.stringify(parameters[k])}`)
    .join('&');
  return `${candidateId}::${smiles.trim()}::${calculationMethod.trim()}::${executionMode}::${paramStr}`;
}

export function loadExperimentHistory(): ExperimentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load experiment history from localStorage:', err);
    return [];
  }
}

export function saveExperimentRecord(record: ExperimentRecord): ExperimentRecord[] {
  try {
    const current = loadExperimentHistory();
    // Prepend new record so latest appears first
    const updated = [record, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save experiment record to localStorage:', err);
    return [];
  }
}

/**
 * Checks if an equivalent experiment has already been recorded in research memory.
 * Returns the recorded experiment if found, or undefined.
 */
export function findEquivalentRecord(
  equivalenceKey: string,
  history?: ExperimentRecord[]
): ExperimentRecord | undefined {
  const records = history || loadExperimentHistory();
  return records.find(r => r.equivalenceKey === equivalenceKey && r.executionStatus !== 'failed');
}

export function clearExperimentHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(METRICS_KEY);
  } catch (err) {
    console.error('Failed to clear experiment memory:', err);
  }
}

/**
 * Computes live metrics from the ledger.
 */
export function computeMetrics(
  history: ExperimentRecord[],
  objective: ResearchObjective,
  elapsedSeconds: number
): ResearchMetrics {
  const totalAttempts = history.length;
  const successfulCalculations = history.filter(h => h.executionStatus === 'success' && !h.wasReused).length;
  const failedCalculations = history.filter(h => h.executionStatus === 'failed').length;
  const equivalentResultsReused = history.filter(h => h.wasReused).length;

  const uniqueCandidates = new Set(history.map(h => h.candidate.id)).size;

  const budgetRemaining = Math.max(0, objective.defaultMaxBudget - totalAttempts);

  return {
    totalAttempts,
    successfulCalculations,
    failedCalculations,
    uniqueCandidatesEvaluated: uniqueCandidates,
    equivalentResultsReused,
    totalElapsedSeconds: elapsedSeconds,
    currentBudgetRemaining: budgetRemaining,
    maxBudget: objective.defaultMaxBudget,
    executionMode: objective.executionMode,
  };
}

/**
 * Generates formatted JSON ledger for export.
 */
export function exportLedgerToJson(history: ExperimentRecord[]): string {
  return JSON.stringify(
    {
      engine: 'PROMETHEUS Autonomous Scientific Discovery Engine',
      exportedAt: new Date().toISOString(),
      experimentCount: history.length,
      records: history,
    },
    null,
    2
  );
}
