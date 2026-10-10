/**
 * PROMETHEUS Technical Transparency & Architecture Modal
 * Explains system architecture, agent components, real vs simulated boundaries,
 * and clear limitations.
 */

import React from 'react';
import {
  X,
  FileCode,
  ShieldAlert,
  Cpu,
  Database,
  Brain,
  Scale,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span className="text-cyan-400 font-mono">PROMETHEUS</span> Architecture & Technical Transparency
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous Scientific Discovery Engine — Web Demonstration Prototype
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Core Principle */}
        <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-lg space-y-2 text-xs">
          <div className="font-mono font-bold text-cyan-300 uppercase tracking-wide">
            Core Operating Principle
          </div>
          <p className="text-slate-300 leading-relaxed">
            <span className="font-semibold text-cyan-200">AI PROPOSES</span> →{' '}
            <span className="font-semibold text-emerald-200">SCIENTIFIC TOOL TESTS</span> →{' '}
            <span className="font-semibold text-cyan-200">EVIDENCE IS ANALYZED</span> →{' '}
            <span className="font-semibold text-indigo-200">MEMORY IS UPDATED</span> →{' '}
            <span className="font-semibold text-cyan-200">NEXT EXPERIMENT IS SELECTED</span>.
          </p>
          <p className="text-[11px] text-slate-400">
            PROMETHEUS removes hallucination from scientific discovery by enforcing that AI models
            only formulate testable hypotheses and parameter spaces, while deterministic scientific
            software or calibrated simulators execute the ground-truth calculations.
          </p>
        </div>

        {/* 2. System Subsystems Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1.5">
            <div className="font-mono font-semibold text-cyan-400 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              1. Hypothesis & Agent Planner
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Formulates bounded scientific hypotheses connecting molecular structure to expected
              properties. In this demonstration, a transparent deterministic policy executes property-guided
              gradient search (unsubstituted → halogenated → linear control).
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1.5">
            <div className="font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              2. Scientific Computation Engine
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Executes exact deterministic cheminformatics algorithms in TypeScript: IUPAC standard
              molecular weights, Floyd-Warshall topological Wiener index, Randic branching connectivity,
              and Ertl-Rohde Topological Polar Surface Area (TPSA).
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1.5">
            <div className="font-mono font-semibold text-indigo-400 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              3. Evidence Critic & Analysis
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Validates numerical return against pre-defined target criteria. Explicitly classifies
              evidence into categories (<code className="text-emerald-300">COMPUTATIONALLY DERIVED</code> vs{' '}
              <code className="text-amber-300">SIMULATED</code>) and records boundaries.
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1.5">
            <div className="font-mono font-semibold text-purple-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              4. Research Memory Ledger & Deduplication
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Maintains an immutable session ledger. Computes a multi-parameter equivalence key
              (candidate + SMILES + calculation method + parameters) to detect duplicates and reuse
              prior calculations without wasting compute cycles.
            </p>
          </div>
        </div>

        {/* 3. Real vs Simulated Boundary */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2 text-xs">
          <div className="font-mono font-bold text-slate-300 uppercase">
            Real Computation vs. Demonstration Simulation
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-800/40 text-slate-300">
              <span className="font-bold text-emerald-400 block mb-0.5">Mode A: Real Computation</span>
              Runs actual graph-theoretic and cheminformatics algorithms on validated chemical structures.
              Calculations are reproducible, mathematically exact, and cross-referenced with PubChem standards.
            </div>
            <div className="p-2.5 rounded bg-amber-950/30 border border-amber-800/40 text-slate-300">
              <span className="font-bold text-amber-400 block mb-0.5">Mode B: Demonstration Simulator</span>
              Illustrative deterministic model used when heavy quantum chemistry packages (PySCF, ASE, Gaussian)
              are not installed in the browser runtime. Always explicitly labeled.
            </div>
          </div>
        </div>

        {/* 4. Limitations & Scope */}
        <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-lg space-y-1.5 text-xs text-rose-200">
          <div className="font-mono font-bold uppercase flex items-center gap-1.5 text-rose-300">
            <ShieldAlert className="w-4 h-4" />
            Prototype Scope & Honest Scientific Disclosures
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
            <li>
              This prototype is a compact demonstration of the autonomous loop designed for hackathon judges.
              It does not run full high-performance computing clusters with PySCF or ASE DFT engines.
            </li>
            <li>
              The results demonstrate workflow mechanics and do not claim to discover a novel drug, battery, or physical material.
            </li>
            <li>
              No claims of clinical efficacy, global novelty, or peer-reviewed publication are made.
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Close Architecture Guide
          </button>
        </div>
      </div>
    </div>
  );
};
