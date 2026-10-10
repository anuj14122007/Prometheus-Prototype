/**
 * PROMETHEUS Application Header
 * Clean, restrained navigation with experiment count badge,
 * about modal toggle, reset action, and guided demo trigger.
 */

import React from 'react';
import {
  Flame,
  Info,
  RefreshCw,
  Sparkles,
  Database,
  ArrowRight,
} from 'lucide-react';

interface Props {
  completedCount: number;
  onOpenMemory: () => void;
  onOpenAbout: () => void;
  onResetSession: () => void;
  onRunGuidedDemo: () => void;
  isLoopRunning: boolean;
}

export const Header: React.FC<Props> = ({
  completedCount,
  onOpenMemory,
  onOpenAbout,
  onResetSession,
  onRunGuidedDemo,
  isLoopRunning,
}) => {
  return (
    <header className="bg-slate-950/80 border-b border-slate-800/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/10 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-4 h-4 text-cyan-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-extrabold tracking-wider text-slate-100 font-mono">
                  PROMETHEUS
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 font-semibold tracking-wider">
                  DISCOVERY ENGINE
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2.5">
            {/* Small status indicator */}
            <button
              onClick={onOpenMemory}
              className="px-2.5 py-1.5 text-xs font-mono rounded-lg bg-slate-900 hover:bg-slate-800/90 text-slate-300 border border-slate-800 flex items-center gap-1.5 transition-colors"
              title="Open Research Memory Ledger"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {completedCount} {completedCount === 1 ? 'experiment' : 'experiments'}
              </span>
            </button>

            {/* About Modal */}
            <button
              onClick={onOpenAbout}
              className="p-2 sm:px-2.5 sm:py-1.5 text-xs font-mono rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 flex items-center gap-1.5 transition-colors"
              title="About PROMETHEUS"
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">About</span>
            </button>

            {/* Reset */}
            <button
              onClick={onResetSession}
              disabled={isLoopRunning}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors disabled:opacity-40"
              title="Reset session"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Guided Demo Button */}
            <button
              onClick={onRunGuidedDemo}
              disabled={isLoopRunning}
              className="px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-60"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
              <span className="hidden sm:inline">Guided Demo</span>
              <span className="sm:hidden">Demo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
