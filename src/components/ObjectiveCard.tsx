/**
 * PROMETHEUS Research Objective Component
 * Inspects and configures the active scientific research objective,
 * stopping conditions, method selection, and execution mode.
 */

import React, { useState } from 'react';
import { ResearchObjective, ExecutionMode } from '../types/scientific';
import { RESEARCH_OBJECTIVES } from '../data/objectives';
import {
  Compass,
  Sliders,
  ShieldAlert,
  Cpu,
  Target,
  FlaskConical,
  CheckCircle,
} from 'lucide-react';

interface Props {
  activeObjective: ResearchObjective;
  onSelectObjective: (obj: ResearchObjective) => void;
  maxBudget: number;
  onUpdateBudget: (budget: number) => void;
  isLoopRunning: boolean;
}

export const ObjectiveCard: React.FC<Props> = ({
  activeObjective,
  onSelectObjective,
  maxBudget,
  onUpdateBudget,
  isLoopRunning,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 mt-0.5">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
                Active Research Objective
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {activeObjective.domain}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-100 tracking-tight mt-0.5">
              {activeObjective.title}
            </h2>
          </div>
        </div>

        {/* Mode Badge & Objective Switcher */}
        <div className="flex items-center gap-2">
          {activeObjective.executionMode === 'REAL_COMPUTATION' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-950/50 text-emerald-300 border border-emerald-600/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              REAL COMPUTATION
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-amber-950/50 text-amber-300 border border-amber-600/50">
              <ShieldAlert className="w-3.5 h-3.5" />
              DEMONSTRATION SIMULATOR
            </span>
          )}

          <button
            disabled={isLoopRunning}
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1 text-xs font-mono rounded-md border transition-colors flex items-center gap-1.5 ${
              isEditing
                ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700/80'
            } ${isLoopRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {isEditing ? 'Close Config' : 'Change Objective'}
          </button>
        </div>
      </div>

      {/* Objective Drawer / Switcher */}
      {isEditing && (
        <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-3">
          <div className="text-xs font-mono font-semibold text-slate-300">
            Select Scientific Investigation:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {RESEARCH_OBJECTIVES.map(obj => {
              const isSelected = obj.id === activeObjective.id;
              return (
                <button
                  key={obj.id}
                  onClick={() => {
                    onSelectObjective(obj);
                    setIsEditing(false);
                  }}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-cyan-950/50 border-cyan-500/70 text-cyan-200 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {obj.executionMode === 'REAL_COMPUTATION' ? 'Real Lib' : 'Simulated'}
                    </span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <div className="text-xs font-bold text-slate-200 line-clamp-1 mb-1">
                    {obj.title}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">
                    {obj.question}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Budget Limit Slider */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div className="text-xs font-mono text-slate-300">
              Experiment Budget Limit: <span className="text-cyan-400 font-bold">{maxBudget} experiments</span>
            </div>
            <div className="flex items-center space-x-2">
              {[3, 5, 8].map(num => (
                <button
                  key={num}
                  disabled={isLoopRunning}
                  onClick={() => onUpdateBudget(num)}
                  className={`px-2.5 py-0.5 rounded text-xs font-mono border ${
                    maxBudget === num
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {num} Max
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Research Question & Target Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
        {/* Research Question */}
        <div className="lg:col-span-2 p-3 bg-slate-950/50 rounded-lg border border-slate-800/60 space-y-1.5">
          <div className="text-[11px] font-mono font-semibold text-slate-400 flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
            RESEARCH QUESTION
          </div>
          <div className="text-sm font-medium text-slate-200 leading-snug">
            "{activeObjective.question}"
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed pt-1">
            {activeObjective.rationale}
          </div>
        </div>

        {/* Scientific Criterion & Boundary */}
        <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/60 space-y-2">
          <div className="text-[11px] font-mono font-semibold text-slate-400 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            TARGET CRITERION & BOUNDS
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Target Property:</span>
            <span className="font-mono font-bold text-slate-200">
              {activeObjective.targetProperty}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Success Threshold:</span>
            <span className="font-mono font-bold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
              {activeObjective.comparator === 'gte' ? '≥ ' : '≤ '}
              {activeObjective.targetThreshold} {activeObjective.targetUnit}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Computational Method:</span>
            <span className="font-mono text-slate-300 truncate max-w-[130px]" title={activeObjective.calculationMethod}>
              {activeObjective.calculationMethod}
            </span>
          </div>

          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400">
            <span className="text-cyan-400 font-semibold">Stopping Condition:</span> {activeObjective.stoppingExplanation}
          </div>
        </div>
      </div>
    </div>
  );
};
