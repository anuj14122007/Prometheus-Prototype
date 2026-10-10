/**
 * PROMETHEUS About & Vision Modal
 * Unobtrusive, concise explanation of the autonomous scientific research vision
 * and honest prototype disclosures.
 */

import React from 'react';
import { X, Flame, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-mono">
                About PROMETHEUS
              </h2>
              <div className="text-[11px] text-slate-400">
                Autonomous Scientific Discovery Engine
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Larger Vision */}
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p className="text-sm font-medium text-slate-100">
            PROMETHEUS is being developed as an autonomous scientific research framework.
          </p>
          <p>
            Its long-term goal is to connect hypothesis generation, computational experimentation,
            evidence analysis, and research memory into a controlled, iterative workflow.
          </p>
          <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl font-mono text-[11px] text-cyan-200">
            AI PROPOSES → SCIENTIFIC TOOL TESTS → EVIDENCE IS ANALYZED → MEMORY IS UPDATED → NEXT EXPERIMENT IS SELECTED
          </div>
        </div>

        {/* Honest Prototype Scope */}
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5 text-xs text-slate-400">
          <div className="text-[11px] font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Prototype Scope & Boundary
          </div>
          <p className="text-[11px] leading-normal">
            This web application is a demonstration designed for hackathon evaluation. It runs deterministic
            in-browser cheminformatics calculations (Ertl-Rohde TPSA, IUPAC masses, Wiener indices). It does not
            connect to high-performance computing clusters or full quantum DFT software (PySCF, ASE).
          </p>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
