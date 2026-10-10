/**
 * PROMETHEUS Results Dashboard & Property Visualizer
 * Displays real ledger counts, budget telemetry, and SVG property scatter/bar charts.
 */

import React from 'react';
import {
  ResearchMetrics,
  ExperimentRecord,
  ResearchObjective,
} from '../types/scientific';
import {
  CheckCircle2,
  XCircle,
  Database,
  Clock,
  Layers,
  Activity,
  Cpu,
  BarChart2,
  TrendingUp,
} from 'lucide-react';

interface Props {
  metrics: ResearchMetrics;
  history: ExperimentRecord[];
  objective: ResearchObjective;
}

export const MetricsDashboard: React.FC<Props> = ({
  metrics,
  history,
  objective,
}) => {
  // Chart calculation for recorded property values
  const validRecords = history.filter(h => h.executionStatus === 'success');

  // Chart bounds
  const hasData = validRecords.length > 0;
  const values = validRecords.map(r => r.numericalResult);
  const maxVal = hasData ? Math.max(...values, objective.targetThreshold * 1.25) : 50;
  const minVal = hasData ? Math.min(0, ...values) : 0;
  const range = maxVal - minVal || 1;

  const chartHeight = 160;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 25;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
            Operational Telemetry & Results
          </span>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Budget: <span className="text-cyan-300 font-bold">{metrics.currentBudgetRemaining}</span> / {metrics.maxBudget} remaining
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {/* Total Attempts */}
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Attempts</div>
          <div className="text-xl font-bold font-mono text-slate-100 mt-1">
            {metrics.totalAttempts}
          </div>
        </div>

        {/* Successful Computations */}
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Successful</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {metrics.successfulCalculations}
          </div>
        </div>

        {/* Failed Computations */}
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Failed</div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">
            {metrics.failedCalculations}
          </div>
        </div>

        {/* Unique Candidates */}
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Candidates</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
            {metrics.uniqueCandidatesEvaluated}
          </div>
        </div>

        {/* Reused / Cached */}
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Reused (Hits)</div>
          <div className="text-xl font-bold font-mono text-indigo-400 mt-1">
            {metrics.equivalentResultsReused}
          </div>
        </div>

        {/* Elapsed Time */}
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Elapsed</div>
          <div className="text-xl font-bold font-mono text-slate-200 mt-1">
            {metrics.totalElapsedSeconds}s
          </div>
        </div>

        {/* Mode */}
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Active Mode</div>
          <div className="text-xs font-bold font-mono text-slate-200 mt-1.5 truncate">
            {metrics.executionMode === 'REAL_COMPUTATION' ? 'Real Lib' : 'Simulator'}
          </div>
        </div>
      </div>

      {/* Meaningful Property Visualization (SVG Chart) */}
      <div className="p-4 bg-slate-950/70 rounded-lg border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-slate-200">
              Recorded Evidence: {objective.targetProperty} ({objective.targetUnit})
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-emerald-400 border-dashed"></span>
              <span>Target Threshold ({objective.targetThreshold} {objective.targetUnit})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Measured Candidate</span>
            </span>
          </div>
        </div>

        {hasData ? (
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 text-slate-400 font-mono text-[10px]"
            >
              {/* Background grid lines */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={chartWidth - 20}
                y2={paddingY}
                stroke="rgba(51, 65, 85, 0.4)"
                strokeDasharray="3 3"
              />
              <line
                x1={paddingX}
                y1={chartHeight / 2}
                x2={chartWidth - 20}
                y2={chartHeight / 2}
                stroke="rgba(51, 65, 85, 0.4)"
                strokeDasharray="3 3"
              />
              <line
                x1={paddingX}
                y1={chartHeight - paddingY}
                x2={chartWidth - 20}
                y2={chartHeight - paddingY}
                stroke="rgba(51, 65, 85, 0.8)"
              />

              {/* Target Threshold Line */}
              {(() => {
                const targetY =
                  chartHeight -
                  paddingY -
                  ((objective.targetThreshold - minVal) / range) * (chartHeight - paddingY * 2);
                return (
                  <g>
                    <line
                      x1={paddingX}
                      y1={targetY}
                      x2={chartWidth - 20}
                      y2={targetY}
                      stroke="#34d399"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={chartWidth - 18}
                      y={targetY - 4}
                      fill="#34d399"
                      fontSize="9"
                      textAnchor="end"
                    >
                      Threshold: {objective.targetThreshold}
                    </text>
                  </g>
                );
              })()}

              {/* Data points & Bars */}
              {validRecords.map((rec, idx) => {
                const count = validRecords.length;
                const slotWidth = (chartWidth - paddingX - 40) / (count || 1);
                const x = paddingX + idx * slotWidth + slotWidth / 2;
                const y =
                  chartHeight -
                  paddingY -
                  ((rec.numericalResult - minVal) / range) * (chartHeight - paddingY * 2);
                const isTargetMet = rec.analysis.targetMet;

                return (
                  <g key={rec.experimentId} className="group">
                    {/* Bar stem */}
                    <line
                      x1={x}
                      y1={chartHeight - paddingY}
                      x2={x}
                      y2={y}
                      stroke={isTargetMet ? 'rgba(56, 189, 248, 0.6)' : 'rgba(244, 63, 94, 0.6)'}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Node marker */}
                    <circle
                      cx={x}
                      cy={y}
                      r="5.5"
                      fill={isTargetMet ? '#38bdf8' : '#f43f5e'}
                      stroke="#0f172a"
                      strokeWidth="2"
                    />

                    {/* Value label */}
                    <text
                      x={x}
                      y={y - 9}
                      fill={isTargetMet ? '#bae6fd' : '#fecdd3'}
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {rec.numericalResult}
                    </text>

                    {/* Candidate ID X-axis label */}
                    <text
                      x={x}
                      y={chartHeight - 8}
                      fill="#94a3b8"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      {rec.candidate.id}
                    </text>
                  </g>
                );
              })}

              {/* Y Axis labels */}
              <text x={paddingX - 6} y={paddingY + 3} fill="#64748b" fontSize="9" textAnchor="end">
                {maxVal.toFixed(0)}
              </text>
              <text
                x={paddingX - 6}
                y={chartHeight - paddingY + 3}
                fill="#64748b"
                fontSize="9"
                textAnchor="end"
              >
                {minVal.toFixed(0)}
              </text>
            </svg>
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded text-slate-500 text-xs">
            <span>No experimental data recorded yet for this session.</span>
            <span className="text-[11px] text-slate-600 mt-1">
              Trigger "Run Guided Demo" to populate authentic computational records.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
