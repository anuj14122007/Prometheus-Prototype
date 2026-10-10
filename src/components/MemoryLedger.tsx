/**
 * PROMETHEUS Persistent Research Memory Ledger
 * Structured experiment history, equivalence tracking, detailed inspector, and JSON export.
 */

import React, { useState } from 'react';
import { ExperimentRecord } from '../types/scientific';
import { exportLedgerToJson } from '../services/memoryLedger';
import {
  Database,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Layers,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  history: ExperimentRecord[];
  onClearHistory: () => void;
  onSelectRecordForInspection?: (record: ExperimentRecord) => void;
}

export const MemoryLedger: React.FC<Props> = ({
  history,
  onClearHistory,
  onSelectRecordForInspection,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  const filteredHistory = history.filter(rec => {
    const q = searchQuery.toLowerCase();
    return (
      rec.experimentId.toLowerCase().includes(q) ||
      rec.candidate.name.toLowerCase().includes(q) ||
      rec.candidate.id.toLowerCase().includes(q) ||
      rec.hypothesis.toLowerCase().includes(q) ||
      rec.calculationMethod.toLowerCase().includes(q)
    );
  });

  const handleDownload = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(exportLedgerToJson(history));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `prometheus_research_ledger_${Date.now()}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportLedgerToJson(history));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              Research Memory Ledger
            </h3>
            <div className="text-[11px] text-slate-400">
              Persistent record of all formulated hypotheses and computational results
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            disabled={history.length === 0}
            className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors disabled:opacity-40"
            title="Copy JSON to clipboard"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>JSON</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={history.length === 0}
            className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors disabled:opacity-40"
            title="Export Ledger JSON file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="px-2.5 py-1 text-xs font-mono rounded bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 flex items-center gap-1 transition-colors disabled:opacity-40"
            title="Wipe research memory"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search experiments by ID, candidate, hypothesis, or method..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono"
          />
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Showing <span className="text-slate-200 font-bold">{filteredHistory.length}</span> of {history.length}
        </div>
      </div>

      {/* Table of Experiments */}
      {history.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Exp ID</th>
                <th className="py-2.5 px-3">Candidate</th>
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3">Measured Result</th>
                <th className="py-2.5 px-3">Target Check</th>
                <th className="py-2.5 px-3">Provenance</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredHistory.map(rec => {
                const isExpanded = selectedRecordId === rec.experimentId;
                const isTargetMet = rec.analysis.targetMet;

                return (
                  <React.Fragment key={rec.experimentId}>
                    <tr
                      onClick={() =>
                        setSelectedRecordId(isExpanded ? null : rec.experimentId)
                      }
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-3 font-bold text-cyan-400">
                        {rec.experimentId}
                      </td>
                      <td className="py-2.5 px-3 text-slate-200">
                        <span className="font-semibold">{rec.candidate.name}</span>
                        <span className="text-slate-500 ml-1 text-[10px]">
                          ({rec.candidate.id})
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            rec.executionMode === 'REAL_COMPUTATION'
                              ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50'
                              : 'bg-amber-950/50 text-amber-300 border border-amber-800/50'
                          }`}
                        >
                          {rec.executionMode === 'REAL_COMPUTATION' ? 'Real Lib' : 'Simulated'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-100">
                        {rec.numericalResult} {rec.units}
                      </td>
                      <td className="py-2.5 px-3">
                        {isTargetMet ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                            <CheckCircle className="w-3 h-3" /> Met
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 text-[10px] font-bold">
                            <AlertCircle className="w-3 h-3" /> Not Met
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[10px]">
                        {rec.wasReused ? (
                          <span className="text-cyan-400 font-semibold">
                            Reused (#{rec.reusedFromExperimentId})
                          </span>
                        ) : (
                          <span className="text-slate-300">Computed</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[10px]">
                        {new Date(rec.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-400">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 ml-auto" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-auto" />
                        )}
                      </td>
                    </tr>

                    {/* Expanded Detail Drawer */}
                    {isExpanded && (
                      <tr className="bg-slate-950/70 border-b border-slate-800/80">
                        <td colSpan={8} className="p-4 space-y-3 font-sans text-xs">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
                                Proposed Hypothesis:
                              </span>
                              <p className="text-slate-200 text-xs italic bg-slate-900/80 p-2.5 rounded border border-slate-800">
                                "{rec.hypothesis}"
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
                                Supported Conclusion:
                              </span>
                              <p className="text-slate-200 text-xs bg-slate-900/80 p-2.5 rounded border border-slate-800">
                                {rec.analysis.conclusion}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 pt-1">
                            <div>
                              <span className="text-slate-500">Method: </span>
                              <span className="text-slate-300">{rec.calculationMethod}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">SMILES: </span>
                              <span className="text-cyan-300">{rec.candidate.smiles}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Equivalence Hash: </span>
                              <span className="text-slate-400 truncate inline-block max-w-[180px]" title={rec.equivalenceKey}>
                                {rec.equivalenceKey.slice(0, 24)}...
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
          No experiments logged in research memory yet. The memory ledger will persist all subsequent iterations.
        </div>
      )}
    </div>
  );
};
