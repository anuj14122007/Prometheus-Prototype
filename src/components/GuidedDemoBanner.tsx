/**
 * PROMETHEUS Guided Demo Banner & Narration Controller
 * Guides non-technical judges through the autonomous research loop in 90 seconds,
 * with live step narration, speed controls, and pause/resume capabilities.
 */

import React from 'react';
import { Play, Pause, Square, Sparkles, FastForward, CheckCircle2 } from 'lucide-react';

interface Props {
  isActive: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  currentNarration: string;
  speedMode: 'normal' | 'fast';
  onStartDemo: () => void;
  onPauseResume: () => void;
  onStopDemo: () => void;
  onToggleSpeed: () => void;
}

export const GuidedDemoBanner: React.FC<Props> = ({
  isActive,
  isPaused,
  currentStep,
  totalSteps,
  currentNarration,
  speedMode,
  onStartDemo,
  onPauseResume,
  onStopDemo,
  onToggleSpeed,
}) => {
  if (!isActive) {
    return (
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-indigo-950/40 border border-cyan-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
              90-Second Hackathon Judge Demonstration
            </div>
            <p className="text-xs text-slate-300">
              Watch PROMETHEUS autonomously propose hypotheses, compute scientific evidence, record results, and select next experiments.
            </p>
          </div>
        </div>

        <button
          onClick={onStartDemo}
          className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-95 shrink-0"
        >
          <Play className="w-4 h-4 fill-current text-slate-950" />
          <span>Run Guided Demo</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900/95 to-indigo-950/60 border border-cyan-500/50 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
      <div className="flex items-center space-x-3 w-full md:w-auto">
        <div className="relative">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping absolute"></div>
          <div className="w-3 h-3 rounded-full bg-cyan-400 relative"></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase">
              Guided Discovery Loop in Progress
            </span>
            <span className="text-slate-600 font-mono">•</span>
            <span className="text-[11px] font-mono text-slate-300">
              Iteration {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="text-xs text-slate-100 font-medium mt-0.5 line-clamp-1">
            {currentNarration}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <button
          onClick={onToggleSpeed}
          className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors"
          title="Toggle playback speed"
        >
          <FastForward className="w-3.5 h-3.5 text-cyan-400" />
          <span>{speedMode === 'fast' ? '2x Fast' : '1x Normal'}</span>
        </button>

        <button
          onClick={onPauseResume}
          className="px-3 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
        >
          {isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-cyan-400" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400" />
              <span>Pause</span>
            </>
          )}
        </button>

        <button
          onClick={onStopDemo}
          className="px-3 py-1 text-xs font-mono rounded bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 flex items-center gap-1.5 transition-colors"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>Stop</span>
        </button>
      </div>
    </div>
  );
};
