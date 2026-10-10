/**
 * PROMETHEUS Visual Pipeline Tracker
 * Displays the 7-stage autonomous scientific cycle:
 * RESEARCH QUESTION -> HYPOTHESIS -> EXPERIMENT PLAN -> SCIENTIFIC COMPUTATION -> EVIDENCE ANALYSIS -> RESEARCH MEMORY -> NEXT DECISION
 * Highlights each stage as it actually runs, confirming success before marking complete.
 */

import React from 'react';
import { PipelineStage } from '../types/scientific';
import {
  HelpCircle,
  Lightbulb,
  FileCode,
  Cpu,
  BarChart2,
  Database,
  ArrowRightCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface Props {
  currentStage: PipelineStage;
  iterationNumber: number;
  completedStages: PipelineStage[];
  statusMessage?: string;
}

interface StageMeta {
  id: PipelineStage;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const STAGES: StageMeta[] = [
  {
    id: 'RESEARCH_QUESTION',
    label: 'Research Question',
    shortLabel: 'Question',
    icon: HelpCircle,
    description: 'Defined objective & target threshold',
  },
  {
    id: 'HYPOTHESIS',
    label: 'Hypothesis',
    shortLabel: 'Hypothesis',
    icon: Lightbulb,
    description: 'Proposed scientific claim (unverified)',
  },
  {
    id: 'EXPERIMENT_PLAN',
    label: 'Experiment Plan',
    shortLabel: 'Plan',
    icon: FileCode,
    description: 'Candidate validation & parameters',
  },
  {
    id: 'SCIENTIFIC_COMPUTATION',
    label: 'Scientific Computation',
    shortLabel: 'Compute',
    icon: Cpu,
    description: 'Deterministic tool or labeled simulator',
  },
  {
    id: 'EVIDENCE_ANALYSIS',
    label: 'Evidence Analysis',
    shortLabel: 'Analysis',
    icon: BarChart2,
    description: 'Critic evaluates returned measurement',
  },
  {
    id: 'RESEARCH_MEMORY',
    label: 'Research Memory',
    shortLabel: 'Memory',
    icon: Database,
    description: 'Ledger update & equivalence caching',
  },
  {
    id: 'NEXT_DECISION',
    label: 'Next Decision',
    shortLabel: 'Decision',
    icon: ArrowRightCircle,
    description: 'Prior evidence guides next step',
  },
];

export const PipelineTracker: React.FC<Props> = ({
  currentStage,
  iterationNumber,
  completedStages,
  statusMessage,
}) => {
  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-800/80 gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
            Scientific Discovery Pipeline
          </span>
          <span className="text-slate-600 font-mono text-xs">•</span>
          <span className="text-xs font-mono text-slate-400">
            Iteration <span className="text-slate-100 font-bold">#{iterationNumber}</span>
          </span>
        </div>
        {statusMessage && (
          <div className="text-xs font-mono text-cyan-300/90 flex items-center gap-1.5 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="truncate max-w-[320px] sm:max-w-md">{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Pipeline Steps Grid / Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = currentStage === stage.id;
          const isCompleted = completedStages.includes(stage.id);

          let containerStyle = 'bg-slate-950/60 border-slate-800/80 text-slate-400';
          let iconColor = 'text-slate-500';

          if (isActive) {
            containerStyle =
              'bg-cyan-950/50 border-cyan-500/80 text-cyan-200 ring-1 ring-cyan-500/40 shadow-sm shadow-cyan-500/10';
            iconColor = 'text-cyan-400';
          } else if (isCompleted) {
            containerStyle =
              'bg-emerald-950/20 border-emerald-700/50 text-slate-300';
            iconColor = 'text-emerald-400';
          }

          return (
            <div
              key={stage.id}
              className={`relative flex flex-col p-2.5 rounded-lg border transition-all duration-200 ${containerStyle}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-semibold text-slate-500">
                  0{idx + 1}
                </span>
                {isActive ? (
                  <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                ) : isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                )}
              </div>

              <div className="text-xs font-semibold tracking-tight truncate mb-0.5">
                {stage.shortLabel}
              </div>

              <div className="text-[10px] text-slate-400/80 leading-tight line-clamp-2">
                {stage.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
