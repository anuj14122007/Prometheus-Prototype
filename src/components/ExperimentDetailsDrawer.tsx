/**
 * PROMETHEUS Experiment Details Drawer
 * Slide-over drawer providing full technical transparency,
 * parameters, and descriptor breakdowns upon request.
 */

import React from 'react';
import { ExperimentRecord, ExperimentPlan } from '../types/scientific';
import { X, ExternalLink, Cpu, Hash, Database, Clock, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  record: ExperimentRecord | null;
  plan: ExperimentPlan | null;
}

export const ExperimentDetailsDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  record,
  plan,
}) => {
  if (!isOpen) return null;

  const candidate = record?.candidate || plan?.candidateId ? (record?.candidate) : null;
  const details = record?.computationalDetails;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Experiment Technical Ledger
              </div>
              <h3 className="text-base font-bold text-slate-100">
                {record ? `Details for #${record.experimentId}` : 'Planned Experiment Specs'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Candidate Metadata */}
          {candidate && (
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-400">Chemical Candidate:</span>
                <span className="text-slate-100 font-bold">
                  {candidate.name} ({candidate.id})
                </span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-400">Formula & Mass:</span>
                <span className="text-slate-200">
                  {candidate.chemicalFormula} • {candidate.canonicalWeight} g/mol
                </span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-400">SMILES String:</span>
                <span className="text-cyan-300 truncate max-w-[200px]" title={candidate.smiles}>
                  {candidate.smiles}
                </span>
              </div>
              <div className="flex items-center justify-between font-mono pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">PubChem CID:</span>
                <a
                  href={`https://pubchem.ncbi.nlm.nih.gov/compound/${candidate.pubchemCid}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                >
                  #{candidate.pubchemCid}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Calculation Methodology */}
          <div className="space-y-2 text-xs">
            <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase">
              Computational Method & Environment
            </div>
            <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div>
                <span className="text-slate-500">Method: </span>
                <span className="text-slate-200">
                  {record?.calculationMethod || plan?.calculationMethod}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Execution Mode: </span>
                <span
                  className={
                    record?.executionMode === 'REAL_COMPUTATION'
                      ? 'text-emerald-400 font-semibold'
                      : 'text-amber-400 font-semibold'
                  }
                >
                  {record?.executionMode || plan?.executionMode}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Source: </span>
                <span className="text-slate-300">
                  {details?.calculationSource || 'Deterministic Cheminformatics Engine'}
                </span>
              </div>
              {record?.wasReused && (
                <div className="text-cyan-300 bg-cyan-950/40 p-2 rounded border border-cyan-800/40 mt-1">
                  Reused from prior experiment #{record.reusedFromExperimentId} via equivalence hash check.
                </div>
              )}
            </div>
          </div>

          {/* Computed Physical Descriptors Matrix */}
          {details && (
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase">
                Deterministic Descriptors Matrix
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Exact Mol. Weight</div>
                  <div className="font-bold text-slate-100">{details.molecularWeight} g/mol</div>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Monoisotopic Mass</div>
                  <div className="font-bold text-slate-100">{details.monoisotopicMass} Da</div>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Wiener Graph Index</div>
                  <div className="font-bold text-slate-100">{details.wienerIndex}</div>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Rotatable Bonds</div>
                  <div className="font-bold text-slate-100">{details.rotatableBonds}</div>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-slate-500 text-[10px]">H-Bond Acceptors</div>
                  <div className="font-bold text-slate-100">{details.hBondAcceptors}</div>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Heavy Atom Count</div>
                  <div className="font-bold text-slate-100">
                    {candidate?.atoms.filter(a => a.element !== 'H').length || 6}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Equivalence Hash Signature */}
          {(record?.equivalenceKey || plan?.equivalenceKey) && (
            <div className="space-y-1.5 text-xs">
              <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-500" />
                <span>Equivalence Signature Key</span>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400 break-all">
                {record?.equivalenceKey || plan?.equivalenceKey}
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
