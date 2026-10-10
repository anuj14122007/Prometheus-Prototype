/**
 * PROMETHEUS Candidate Selector Component
 * Clean, visually appealing candidate cards with clear selection state,
 * formula, and tested badges.
 */

import React from 'react';
import { MolecularCandidate, ExperimentRecord } from '../types/scientific';
import { CheckCircle2, Sparkles, Atom } from 'lucide-react';

interface Props {
  candidates: MolecularCandidate[];
  selectedCandidateId: string | null;
  onSelectCandidate: (candidate: MolecularCandidate) => void;
  history: ExperimentRecord[];
  disabled?: boolean;
}

export const CandidateSelector: React.FC<Props> = ({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
  history,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {candidates.map(cand => {
          const isSelected = cand.id === selectedCandidateId;
          const pastRecord = history.find(h => h.candidate.id === cand.id);

          return (
            <button
              key={cand.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectCandidate(cand)}
              className={`relative text-left p-3 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-400 text-slate-100 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-950/50 scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-mono text-sm font-extrabold tracking-tight ${
                      isSelected ? 'text-cyan-300' : 'text-slate-100'
                    }`}
                  >
                    {cand.id}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-800">
                    {cand.chemicalFormula}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                  {cand.name}
                </div>

                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {cand.shortRole || cand.structuralClass}
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                {pastRecord ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Tested ({pastRecord.numericalResult})</span>
                  </span>
                ) : (
                  <span className="text-slate-500">Untested</span>
                )}

                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
