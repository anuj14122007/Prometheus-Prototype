/**
 * PROMETHEUS Active Experiment View
 * Displays current candidate under investigation, proposed hypothesis,
 * parameters, 3D structure, execution trigger, and deduplication alerts.
 */

import React from 'react';
import {
  MolecularCandidate,
  ExperimentPlan,
  ExecutionResult,
  PipelineStage,
} from '../types/scientific';
import { MolecularViewer3D } from './MolecularViewer3D';
import {
  Lightbulb,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Cpu,
  Info,
  Clock,
  FlaskConical,
  Database,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  candidate: MolecularCandidate | null;
  plan: ExperimentPlan | null;
  currentStage: PipelineStage;
  isExecuting: boolean;
  onRunExperiment: () => void;
  equivalentRecordFound?: boolean;
  equivalentFromId?: string;
  isAutoRunning: boolean;
  onStopLoop: () => void;
}

export const ActiveExperimentView: React.FC<Props> = ({
  candidate,
  plan,
  currentStage,
  isExecuting,
  onRunExperiment,
  equivalentRecordFound,
  equivalentFromId,
  isAutoRunning,
  onStopLoop,
}) => {
  if (!candidate || !plan) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 text-center text-slate-400 space-y-3">
        <FlaskConical className="w-8 h-8 text-slate-600 mx-auto" />
        <div className="text-sm font-semibold text-slate-300">No active experiment in queue</div>
        <div className="text-xs text-slate-500 max-w-md mx-auto">
          Start the guided demo or select an investigation objective to formulate the first hypothesis.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left: Molecular Structure & Identity (5 cols) */}
      <div className="lg:col-span-5 space-y-3">
        <MolecularViewer3D candidate={candidate} />
      </div>

      {/* Right: Hypothesis & Experiment Formulation (7 cols) */}
      <div className="lg:col-span-7 space-y-4 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header & Badges */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-cyan-400">
                {plan.experimentId}
              </span>
              <span className="text-slate-600 font-mono">•</span>
              <span className="text-xs font-semibold text-slate-200">
                Candidate: {candidate.name} ({candidate.id})
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {plan.executionMode === 'REAL_COMPUTATION' ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-700/50">
                  REAL COMPUTATION
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-700/50">
                  DEMO SIMULATION
                </span>
              )}
            </div>
          </div>

          {/* Equivalence / Duplicate Result Alert */}
          {equivalentRecordFound && (
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-lg flex items-start gap-2.5 text-xs text-cyan-200">
              <Database className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-cyan-300">
                  Previous equivalent result found in research memory.
                </span>{' '}
                Reusing recorded evidence from <span className="font-mono font-bold text-cyan-200">#{equivalentFromId}</span> rather than repeating identical computation.
              </div>
            </div>
          )}

          {/* Hypothesis Card */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-amber-300">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>SCIENTIFIC HYPOTHESIS</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-800/40">
                Proposal (Not a verified fact)
              </span>
            </div>

            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              "{plan.hypothesis}"
            </p>

            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/60 flex items-start gap-1.5">
              <span className="text-slate-500 font-mono font-semibold shrink-0">Rationale:</span>
              <span>{plan.whySelected}</span>
            </div>
          </div>

          {/* Experiment Specs & Expected Observation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/60 space-y-1">
              <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
                Property Measured
              </div>
              <div className="font-semibold text-slate-200">{plan.propertyMeasured}</div>
              <div className="text-[10px] font-mono text-cyan-400/90 pt-1">
                Method: {plan.calculationMethod}
              </div>
            </div>

            <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/60 space-y-1">
              <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
                Expected Observation
              </div>
              <div className="text-slate-300 text-[11px] leading-snug">
                {plan.expectedObservation}
              </div>
            </div>
          </div>

          {/* Assumptions & Limitations Note */}
          <div className="p-2.5 bg-slate-950/40 rounded-lg border border-slate-800/50 text-[11px] text-slate-400 space-y-1">
            <div className="text-[10px] font-mono font-semibold text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-500" />
              Assumptions & Theoretical Boundaries:
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400/90 text-[10px]">
              {plan.assumptionsAndLimitations.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-500">
            Pipeline Stage: <span className="text-cyan-400">{currentStage}</span>
          </div>

          <div className="flex items-center space-x-2">
            {isAutoRunning && (
              <button
                onClick={onStopLoop}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-rose-950/60 text-rose-300 border border-rose-700/60 hover:bg-rose-900/60 transition-colors"
              >
                Stop Autonomous Loop
              </button>
            )}

            <button
              onClick={onRunExperiment}
              disabled={isExecuting}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all shadow-md flex items-center gap-2 ${
                isExecuting
                  ? 'bg-cyan-700 text-white cursor-wait opacity-80'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20 active:scale-95'
              }`}
            >
              {isExecuting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Computing Evidence...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-slate-950 fill-current" />
                  <span>
                    {equivalentRecordFound ? 'Reuse Cached Result' : 'Execute Scientific Calculation'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
