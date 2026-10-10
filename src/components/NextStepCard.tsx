/**
 * PROMETHEUS Next Decision Reasoning Card
 * Displays the autonomous agent's transparent decision logic:
 * what was reviewed, why the next candidate was chosen, and stopping status.
 */

import React from 'react';
import { AgentDecision } from '../types/scientific';
import {
  ArrowRightCircle,
  Brain,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  RefreshCw,
  Play,
} from 'lucide-react';

interface Props {
  decision: AgentDecision;
  onProceed: () => void;
  onReset: () => void;
  isAutoRunning: boolean;
}

export const NextStepCard: React.FC<Props> = ({
  decision,
  onProceed,
  onReset,
  isAutoRunning,
}) => {
  const { stoppingCondition } = decision;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
            <Brain className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
            Autonomous Decision Reasoning
          </span>
        </div>

        <div className="text-[10px] font-mono text-slate-400">
          Transparent Rule-Based Search Policy
        </div>
      </div>

      {/* Stopping Condition State or Next Action */}
      {decision.shouldStop && stoppingCondition ? (
        <div className="p-4 bg-slate-950/80 border border-amber-600/40 rounded-lg space-y-2.5">
          <div className="flex items-center space-x-2 text-amber-400 text-sm font-bold">
            <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Search Loop Terminated: {stoppingCondition.title}</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {stoppingCondition.explanation}
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              Termination Code: <code className="text-amber-300 font-semibold">{stoppingCondition.code}</code>
            </span>

            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-md text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Investigation
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Prior Evidence Review */}
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs space-y-1">
            <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
              1. Historical Memory Synthesis
            </div>
            <div className="text-slate-300 font-mono text-[11px]">
              {decision.previousEvidenceReviewed}
            </div>
          </div>

          {/* Candidate Selection Rationale */}
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs space-y-1">
            <div className="text-[10px] font-mono font-semibold text-cyan-400 uppercase flex items-center justify-between">
              <span>2. Next Candidate Selection & Scientific Rationale</span>
              {decision.nextCandidate && (
                <span className="text-slate-200 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                  Target: {decision.nextCandidate.name} ({decision.nextCandidate.id})
                </span>
              )}
            </div>
            <p className="text-slate-200 leading-relaxed font-medium">
              "{decision.rationale}"
            </p>
            <div className="pt-1.5 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
              <span className="text-slate-500 font-semibold">Active Policy:</span>
              <span className="text-cyan-300/90">{decision.decisionRule}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end pt-2">
            {!isAutoRunning && (
              <button
                onClick={onProceed}
                className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <span>Formulate Next Experiment</span>
                <ArrowRightCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
