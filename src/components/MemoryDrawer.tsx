/**
 * PROMETHEUS Secondary Research Memory Drawer
 * Clean slide-over ledger displaying historical experiment runs,
 * with export, inspection, and clear features.
 */

import React from 'react';
import { ExperimentRecord } from '../types/scientific';
import { exportLedgerToJson } from '../services/memoryLedger';
import {
  X,
  Database,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  history: ExperimentRecord[];
  onClearHistory: () => void;
  onSelectRecord: (record: ExperimentRecord) => void;
}

export const MemoryDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectRecord,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(exportLedgerToJson(history));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(exportLedgerToJson(history));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `prometheus_memory_${Date.now()}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto space-y-5 shadow-2xl flex flex-col justify-between">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-mono">
                  Research Memory Ledger
                </h3>
                <div className="text-[11px] text-slate-400">
                  {history.length} {history.length === 1 ? 'experiment' : 'experiments'} recorded in session
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

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                disabled={history.length === 0}
                className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy JSON</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={history.length === 0}
                className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger</span>
              </button>
            </div>

            <button
              onClick={onClearHistory}
              disabled={history.length === 0}
              className="px-2.5 py-1 text-xs font-mono rounded bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 flex items-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          {/* List of Experiments */}
          {history.length > 0 ? (
            <div className="space-y-2.5">
              {history.map((rec, idx) => {
                const isTargetMet = rec.analysis.targetMet;

                return (
                  <div
                    key={rec.experimentId}
                    onClick={() => onSelectRecord(rec)}
                    className="p-3.5 bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/50 rounded-xl space-y-2 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          #{rec.experimentId}
                        </span>
                        <span className="text-xs font-bold text-slate-200">
                          {rec.candidate.name} ({rec.candidate.id})
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-black text-slate-100">
                          {rec.numericalResult} {rec.units}
                        </span>
                        {isTargetMet ? (
                          <span className="text-emerald-400">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="text-rose-400">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 italic line-clamp-1">
                      "{rec.hypothesis}"
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
                      <span>{rec.executionMode === 'REAL_COMPUTATION' ? 'Real Lib' : 'Simulated'}</span>
                      <span>{new Date(rec.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
              No experiments saved in memory yet. Test a candidate to record evidence.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Memory Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
