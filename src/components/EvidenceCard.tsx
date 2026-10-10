/**
 * PROMETHEUS Evidence Analysis Card
 * Displays computational output, category classification badge,
 * supported scientific conclusion, explicit boundaries, and what remains unknown.
 */

import React from 'react';
import {
  ExperimentRecord,
  EvidenceCategory,
} from '../types/scientific';
import {
  CheckCircle,
  AlertCircle,
  BarChart3,
  HelpCircle,
  FileCheck2,
  Atom,
  Clock,
  Sparkles,
} from 'lucide-react';

interface Props {
  record: ExperimentRecord;
}

const CATEGORY_BADGES: Record<
  EvidenceCategory,
  { label: string; bg: string; text: string; border: string; desc: string }
> = {
  COMPUTATIONALLY_DERIVED: {
    label: 'COMPUTATIONALLY DERIVED',
    bg: 'bg-emerald-950/70',
    text: 'text-emerald-300',
    border: 'border-emerald-600/70',
    desc: 'Result derived via actual deterministic scientific software library algorithms.',
  },
  SIMULATED: {
    label: 'SIMULATED (DEMO ONLY)',
    bg: 'bg-amber-950/70',
    text: 'text-amber-300',
    border: 'border-amber-600/70',
    desc: 'Illustrative result produced by demonstration simulator; NOT ab-initio DFT.',
  },
  HYPOTHESIS: {
    label: 'HYPOTHESIS',
    bg: 'bg-indigo-950/70',
    text: 'text-indigo-300',
    border: 'border-indigo-600/70',
    desc: 'A proposed claim, not a verified scientific fact.',
  },
  UNVERIFIED: {
    label: 'UNVERIFIED',
    bg: 'bg-slate-800',
    text: 'text-slate-300',
    border: 'border-slate-700',
    desc: 'A claim not adequately established by available evidence.',
  },
  EXPERIMENTALLY_VALIDATED: {
    label: 'EXPERIMENTALLY VALIDATED',
    bg: 'bg-blue-950/70',
    text: 'text-blue-300',
    border: 'border-blue-600/70',
    desc: 'Supported by physical wet-lab experimental evidence (not tested in vitro).',
  },
};

export const EvidenceCard: React.FC<Props> = ({ record }) => {
  const badge = CATEGORY_BADGES[record.analysis.evidenceCategory];
  const { details } = { details: record.computationalDetails };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
            Evidence Analysis
          </span>
          <span className="text-slate-600 font-mono text-xs">•</span>
          <span className="text-xs font-mono text-slate-300">
            Experiment #{record.experimentId}
          </span>
        </div>

        {/* Evidence Category Badge */}
        <div className="flex items-center space-x-2">
          <span
            title={badge.desc}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold ${badge.bg} ${badge.text} border ${badge.border}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Main Numerical Output Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 bg-slate-950/70 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Measured Value
          </div>
          <div className="my-1">
            <span className="text-2xl font-black font-mono text-slate-100">
              {record.numericalResult}
            </span>
            <span className="text-xs font-mono text-cyan-400 font-semibold ml-1.5">
              {record.units}
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 truncate" title={record.calculationMethod}>
            Method: {record.calculationMethod}
          </div>
        </div>

        <div className="p-4 bg-slate-950/70 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Objective Target Check
          </div>
          <div className="my-1 flex items-center space-x-2">
            {record.analysis.targetMet ? (
              <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-400">
                <CheckCircle className="w-4 h-4" /> Target Satisfied
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm font-bold text-rose-400">
                <AlertCircle className="w-4 h-4" /> Target Not Met
              </span>
            )}
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Candidate: {record.candidate.name} ({record.candidate.id})
          </div>
        </div>

        <div className="p-4 bg-slate-950/70 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Provenance & Execution
          </div>
          <div className="my-1 text-xs font-mono text-slate-200">
            {record.wasReused ? (
              <span className="text-cyan-300 font-semibold">
                Reused from #{record.reusedFromExperimentId} (Memory Hit)
              </span>
            ) : (
              <span className="text-emerald-300 font-semibold">
                Freshly Computed ({record.computationalDetails?.calculationSource})
              </span>
            )}
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Timestamp: {new Date(record.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Calculated Physicochemical Descriptor Breakdown */}
      {details && (
        <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/80">
          <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase mb-2 flex items-center justify-between">
            <span>Cheminformatics Descriptor Matrix (Exact Computed Properties)</span>
            <span className="text-slate-500">IUPAC & Ertl-Rohde Standard</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-[11px] font-mono">
            <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
              <div className="text-slate-500 text-[10px]">Mol. Weight</div>
              <div className="font-bold text-slate-200">{details.molecularWeight} g/mol</div>
            </div>
            <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
              <div className="text-slate-500 text-[10px]">TPSA</div>
              <div className="font-bold text-cyan-300">{details.tpsa} Å²</div>
            </div>
            <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
              <div className="text-slate-500 text-[10px]">Wiener Index</div>
              <div className="font-bold text-slate-200">{details.wienerIndex}</div>
            </div>
            <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
              <div className="text-slate-500 text-[10px]">Rotatable Bonds</div>
              <div className="font-bold text-slate-200">{details.rotatableBonds}</div>
            </div>
            <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
              <div className="text-slate-500 text-[10px]">H-Bond Acc.</div>
              <div className="font-bold text-slate-200">{details.hBondAcceptors}</div>
            </div>
            <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
              <div className="text-slate-500 text-[10px]">Est. LogP</div>
              <div className="font-bold text-slate-200">{details.estimatedLogP}</div>
            </div>
          </div>
        </div>
      )}

      {/* Scientific Conclusion & Next Impact */}
      <div className="space-y-2 text-xs">
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-1">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Supported Scientific Conclusion:</span>
          </div>
          <p className="text-slate-200 leading-relaxed">
            {record.analysis.conclusion}
          </p>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-1">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Impact on Subsequent Search:</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
            {record.analysis.impactOnNextDecision}
          </p>
        </div>
      </div>

      {/* Explicit Scientific Boundaries & What Remains Unknown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
        <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 space-y-1">
          <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
            Explicit Limitations
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-400">
            {record.analysis.limitations.map((lim, idx) => (
              <li key={idx}>{lim}</li>
            ))}
          </ul>
        </div>

        <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 space-y-1">
          <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
            What Remains Unknown
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-400">
            {record.analysis.unknownFactors.map((unk, idx) => (
              <li key={idx}>{unk}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
