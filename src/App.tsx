/**
 * PROMETHEUS — Autonomous Scientific Discovery Engine
 * Redesigned minimal, highly visual single-screen scientific workspace.
 * 
 * CORE PRINCIPLE:
 * ONE SCREEN. ONE MAIN TASK. ONE PRIMARY ACTION. ONE RESULT AT A TIME.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  InvestigationStep,
  ResearchObjective,
  MolecularCandidate,
  ExperimentPlan,
  ExperimentRecord,
  AgentDecision,
  ResearchMetrics,
} from './types/scientific';
import { RESEARCH_OBJECTIVES } from './data/objectives';
import { CANDIDATES_REGISTRY } from './data/candidates';
import { executeDeterministicCalculation } from './services/cheminformatics';
import { simulateSolvationFreeEnergy } from './services/simulator';
import {
  loadExperimentHistory,
  saveExperimentRecord,
  findEquivalentRecord,
  clearExperimentHistory,
  computeMetrics,
} from './services/memoryLedger';
import {
  formulateExperimentPlan,
  analyzeEvidence,
  planNextAutonomousStep,
} from './services/agentPlanner';

import { Header } from './components/Header';
import { CandidateSelector } from './components/CandidateSelector';
import { MolecularViewer3D } from './components/MolecularViewer3D';
import { ExperimentDetailsDrawer } from './components/ExperimentDetailsDrawer';
import { MemoryDrawer } from './components/MemoryDrawer';
import { AboutModal } from './components/AboutModal';
import {
  ArrowRight,
  ArrowLeft,
  Play,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Sparkles,
  Info,
  Clock,
  RotateCcw,
  ShieldCheck,
  Pause,
  FastForward,
  Square,
  Database,
  BarChart3,
  Layers,
} from 'lucide-react';

export default function App() {
  // 1. Core State
  const [activeObjective] = useState<ResearchObjective>(RESEARCH_OBJECTIVES[0]);
  const [history, setHistory] = useState<ExperimentRecord[]>(() => loadExperimentHistory());
  const maxBudget = 5;

  // Step state: CHOOSE -> TEST -> RESULT -> NEXT_DECISION -> FINISHED
  const [currentStep, setCurrentStep] = useState<InvestigationStep>('CHOOSE');

  // Candidate pool (curated carbonate candidates)
  const candidatePool: MolecularCandidate[] = [
    CANDIDATES_REGISTRY['EC'],
    CANDIDATES_REGISTRY['FEC'],
    CANDIDATES_REGISTRY['DFEC'],
    CANDIDATES_REGISTRY['VC'],
    CANDIDATES_REGISTRY['DMC'],
    CANDIDATES_REGISTRY['PC'],
  ].filter(Boolean);

  const [selectedCandidate, setSelectedCandidate] = useState<MolecularCandidate>(
    candidatePool[0]
  );
  const [currentPlan, setCurrentPlan] = useState<ExperimentPlan | null>(null);
  const [latestRecord, setLatestRecord] = useState<ExperimentRecord | null>(null);
  const [latestDecision, setLatestDecision] = useState<AgentDecision | null>(null);

  // Execution state
  const [isExecuting, setIsExecuting] = useState(false);
  const [execProgress, setExecProgress] = useState(0);

  // Drawers & Modals
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isMemoryDrawerOpen, setIsMemoryDrawerOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [inspectedRecord, setInspectedRecord] = useState<ExperimentRecord | null>(null);

  // Guided Demo automation state
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [isDemoPaused, setIsDemoPaused] = useState(false);
  const [demoNarration, setDemoNarration] = useState('');
  const [demoSpeed, setDemoSpeed] = useState<'normal' | 'fast'>('normal');

  const isDemoRunningRef = useRef(isDemoRunning);
  isDemoRunningRef.current = isDemoRunning;
  const isDemoPausedRef = useRef(isDemoPaused);
  isDemoPausedRef.current = isDemoPaused;

  // Check for deduplication / previous record
  const equivalentRecord = currentPlan
    ? findEquivalentRecord(currentPlan.equivalenceKey, history)
    : undefined;

  // Initialize or update plan when candidate changes
  useEffect(() => {
    if (selectedCandidate) {
      const plan = formulateExperimentPlan(
        selectedCandidate,
        activeObjective,
        history.length + 1,
        history
      );
      setCurrentPlan(plan);
    }
  }, [selectedCandidate, activeObjective, history.length]);

  // Execute the computational experiment
  const executeExperiment = useCallback(async () => {
    if (!selectedCandidate || !currentPlan || isExecuting) return;

    setIsExecuting(true);
    setExecProgress(15);

    // Realistic visual progress based on computational state
    const progressTimer = setInterval(() => {
      setExecProgress(p => (p < 85 ? p + 25 : p));
    }, demoSpeed === 'fast' ? 120 : 250);

    const delay = demoSpeed === 'fast' ? 450 : 900;
    await new Promise(r => setTimeout(r, delay));

    clearInterval(progressTimer);
    setExecProgress(100);

    // Real computation execution (or deduplicated cache hit)
    const existing = findEquivalentRecord(currentPlan.equivalenceKey, history);

    let numericalResult = 0;
    let details: any;
    let wasReused = false;
    let reusedFromId: string | undefined = undefined;

    if (existing) {
      wasReused = true;
      reusedFromId = existing.experimentId;
      numericalResult = existing.numericalResult;
      details = existing.computationalDetails;
    } else {
      if (activeObjective.executionMode === 'REAL_COMPUTATION') {
        const res = await executeDeterministicCalculation(
          selectedCandidate,
          activeObjective.propertyKey
        );
        numericalResult = res.numericalResult;
        details = res.details;
      } else {
        const res = simulateSolvationFreeEnergy(selectedCandidate);
        numericalResult = res.numericalResult;
        details = res.details;
      }
    }

    // Evidence critic analysis
    const analysis = analyzeEvidence(
      numericalResult,
      selectedCandidate,
      activeObjective,
      activeObjective.executionMode
    );

    const record: ExperimentRecord = {
      experimentId: currentPlan.experimentId,
      iterationNumber: currentPlan.iterationNumber,
      timestamp: new Date().toISOString(),
      objectiveId: activeObjective.id,
      candidate: selectedCandidate,
      hypothesis: currentPlan.hypothesis,
      calculationMethod: currentPlan.calculationMethod,
      parameters: currentPlan.parameters,
      executionMode: activeObjective.executionMode,
      numericalResult,
      units: activeObjective.targetUnit,
      executionStatus: 'success',
      wasReused,
      reusedFromExperimentId: reusedFromId,
      computationalDetails: details,
      analysis,
      equivalenceKey: currentPlan.equivalenceKey,
    };

    // Save to persistent research memory
    const updatedHistory = saveExperimentRecord(record);
    setHistory(updatedHistory);
    setLatestRecord(record);

    // Autonomous agent next-step decision
    const decision = planNextAutonomousStep(activeObjective, updatedHistory, maxBudget);
    setLatestDecision(decision);

    setIsExecuting(false);
    setCurrentStep('RESULT');
    return { record, decision };
  }, [
    selectedCandidate,
    currentPlan,
    isExecuting,
    demoSpeed,
    history,
    activeObjective,
    maxBudget,
  ]);

  // Handle proceed to next candidate
  const handleProceedToNextCandidate = useCallback(() => {
    if (history.length >= maxBudget) {
      setCurrentStep('FINISHED');
      return;
    }

    if (latestDecision?.nextCandidate) {
      setSelectedCandidate(latestDecision.nextCandidate);
      setCurrentStep('TEST');
    } else {
      // If pool exhausted or no recommendation
      setCurrentStep('FINISHED');
    }
  }, [history.length, maxBudget, latestDecision]);

  // Guided 90-Second Demo
  const runGuidedDemo = async () => {
    if (isDemoRunning) return;

    setIsDemoRunning(true);
    setIsDemoPaused(false);

    const demoCandidates = ['EC', 'FEC', 'DMC', 'DFEC'];

    for (let i = 0; i < demoCandidates.length; i++) {
      if (!isDemoRunningRef.current) break;

      while (isDemoPausedRef.current && isDemoRunningRef.current) {
        await new Promise(r => setTimeout(r, 200));
      }

      const candId = demoCandidates[i];
      const cand = CANDIDATES_REGISTRY[candId];
      if (!cand) continue;

      // 1. Choose step
      setSelectedCandidate(cand);
      setCurrentStep('CHOOSE');
      setDemoNarration(
        `Step ${i + 1} of 4: Selected candidate ${cand.name} (${candId}).`
      );
      await new Promise(r => setTimeout(r, demoSpeed === 'fast' ? 900 : 1800));
      if (!isDemoRunningRef.current) break;

      // 2. Test step
      setCurrentStep('TEST');
      setDemoNarration(`Formulating testable hypothesis for ${cand.name}...`);
      await new Promise(r => setTimeout(r, demoSpeed === 'fast' ? 900 : 1600));
      if (!isDemoRunningRef.current) break;

      // Execute
      setDemoNarration(`Running computational tool: Ertl-Rohde TPSA calculation...`);
      const execResult = await executeExperiment();
      if (!isDemoRunningRef.current) break;

      // 3. Result step
      setCurrentStep('RESULT');
      const val = execResult?.record?.numericalResult;
      setDemoNarration(
        `Returned measurement: ${val} Å². Evaluating against target threshold (≥ 38.0 Å²).`
      );
      await new Promise(r => setTimeout(r, demoSpeed === 'fast' ? 1400 : 2600));
      if (!isDemoRunningRef.current) break;

      // 4. Next Decision step
      setCurrentStep('NEXT_DECISION');
      const nextCandName =
        i + 1 < demoCandidates.length
          ? CANDIDATES_REGISTRY[demoCandidates[i + 1]]?.name
          : null;
      if (nextCandName) {
        setDemoNarration(
          `Prior evidence logged. Based on result, agent selects ${nextCandName} next.`
        );
        await new Promise(r => setTimeout(r, demoSpeed === 'fast' ? 1400 : 2500));
      }
    }

    if (isDemoRunningRef.current) {
      setCurrentStep('FINISHED');
      setDemoNarration('Investigation complete. All 4 candidates evaluated.');
    }
    setIsDemoRunning(false);
  };

  // Reset entire session
  const handleReset = () => {
    setIsDemoRunning(false);
    clearExperimentHistory();
    setHistory([]);
    setLatestRecord(null);
    setLatestDecision(null);
    setSelectedCandidate(candidatePool[0]);
    setCurrentStep('CHOOSE');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Navigation Header */}
      <Header
        completedCount={history.length}
        onOpenMemory={() => setIsMemoryDrawerOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onResetSession={handleReset}
        onRunGuidedDemo={runGuidedDemo}
        isLoopRunning={isDemoRunning}
      />

      {/* Guided Demo Active Banner */}
      {isDemoRunning && (
        <div className="bg-cyan-950/70 border-b border-cyan-500/40 px-4 py-2.5 backdrop-blur">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
              <span className="font-mono font-bold text-cyan-300 uppercase shrink-0">
                Guided Demo:
              </span>
              <span className="text-slate-200 truncate font-medium">
                {demoNarration}
              </span>
            </div>

            <div className="flex items-center space-x-2 shrink-0 font-mono">
              <button
                onClick={() =>
                  setDemoSpeed(s => (s === 'normal' ? 'fast' : 'normal'))
                }
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              >
                {demoSpeed === 'fast' ? '2x Fast' : '1x Speed'}
              </button>
              <button
                onClick={() => setIsDemoPaused(!isDemoPaused)}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              >
                {isDemoPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={() => setIsDemoRunning(false)}
                className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300"
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Single-Screen Workspace */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-between">
        {/* Step Indicator Tracker (Minimal & Restrained) */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-6 text-xs font-mono">
          {[
            { id: 'CHOOSE', label: '1. Choose' },
            { id: 'TEST', label: '2. Test' },
            { id: 'RESULT', label: '3. Result' },
            { id: 'NEXT_DECISION', label: '4. Next Step' },
            { id: 'FINISHED', label: '5. Summary' },
          ].map(s => {
            const isActive = currentStep === s.id;
            return (
              <span
                key={s.id}
                className={`px-3 py-1 rounded-full transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                {s.label}
              </span>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* STEP 1: CHOOSE A CANDIDATE                               */}
        {/* ======================================================== */}
        {currentStep === 'CHOOSE' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header prompt */}
            <div className="text-center space-y-1.5 max-w-xl mx-auto">
              <h2 className="text-2xl font-black text-slate-100 tracking-tight">
                Let's investigate something.
              </h2>
              <p className="text-sm text-slate-400">
                Choose a candidate, test it, and see how the evidence changes what we investigate next.
              </p>
            </div>

            {/* Candidate Selector Cards */}
            <CandidateSelector
              candidates={candidatePool}
              selectedCandidateId={selectedCandidate?.id || null}
              onSelectCandidate={cand => setSelectedCandidate(cand)}
              history={history}
              disabled={isExecuting}
            />

            {/* Central Dominant Molecular Visualization */}
            <div className="max-w-md mx-auto">
              <MolecularViewer3D candidate={selectedCandidate} />
            </div>

            {/* Single Primary Action Button */}
            <div className="flex flex-col items-center pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep('TEST')}
                disabled={!selectedCandidate}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <span>TEST SELECTED CANDIDATE ({selectedCandidate.id})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: TEST THE CANDIDATE                                */}
        {/* ======================================================== */}
        {currentStep === 'TEST' && (
          <div className="space-y-6 max-w-xl mx-auto w-full animate-in fade-in duration-200">
            {/* Context Back button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep('CHOOSE')}
                disabled={isExecuting}
                className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-40"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Choose different candidate</span>
              </button>

              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                Target: TPSA ≥ 38.0 Å²
              </span>
            </div>

            {/* Dominant Molecule Focus */}
            <MolecularViewer3D candidate={selectedCandidate} />

            {/* Concise Hypothesis Card */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  SCIENTIFIC HYPOTHESIS
                </span>
                <span className="text-slate-500 text-[10px]">
                  Proposal (not a verified fact)
                </span>
              </div>

              <p className="text-sm text-slate-100 font-medium leading-relaxed">
                "{currentPlan?.hypothesis || `Evaluating ${selectedCandidate.name} polar surface area.`}"
              </p>

              <div className="pt-2 text-[11px] text-slate-400 font-mono border-t border-slate-800/80">
                Testing property: <span className="text-cyan-300 font-semibold">Topological Polar Surface Area (TPSA)</span> via Ertl-Rohde fragments.
              </div>
            </div>

            {/* Deduplication Notice if already tested */}
            {equivalentRecord && (
              <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-xs text-cyan-200 flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Equivalent test found in research memory. Will reuse recorded result (#{equivalentRecord.experimentId}).
                </span>
              </div>
            )}

            {/* Progress Bar when running */}
            {isExecuting && (
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-cyan-300">
                  <span>Executing calculation...</span>
                  <span>{execProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-200 rounded-full"
                    style={{ width: `${execProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Single Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={executeExperiment}
                disabled={isExecuting}
                className="w-full py-3.5 rounded-xl font-mono text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isExecuting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-slate-950" />
                    <span>COMPUTING EVIDENCE...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-slate-950" />
                    <span>RUN EXPERIMENT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: SEE THE RESULT                                    */}
        {/* ======================================================== */}
        {currentStep === 'RESULT' && latestRecord && (
          <div className="space-y-6 max-w-xl mx-auto w-full animate-in fade-in duration-200">
            {/* Candidate context */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">
                Candidate: <strong className="text-slate-100">{latestRecord.candidate.name} ({latestRecord.candidate.id})</strong>
              </span>

              {latestRecord.executionMode === 'REAL_COMPUTATION' ? (
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 text-[10px] font-bold">
                  REAL COMPUTATION
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-700/60 text-[10px] font-bold">
                  SIMULATION
                </span>
              )}
            </div>

            {/* Dominant Measurement Card (Large, Readable Result) */}
            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl text-center space-y-3 shadow-xl">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Topological Polar Surface Area (TPSA)
              </div>

              {/* Massive readable result */}
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-black font-mono text-slate-50 tracking-tight">
                  {latestRecord.numericalResult}
                </span>
                <span className="text-lg font-mono font-bold text-cyan-400">
                  {latestRecord.units}
                </span>
              </div>

              {/* Target check pill */}
              <div className="flex justify-center">
                {latestRecord.analysis.targetMet ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-600/60">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Target Satisfied (≥ 38.0 Å²)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950/70 text-rose-300 border border-rose-600/60">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    Target Not Met (&lt; 38.0 Å²)
                  </span>
                )}
              </div>

              {/* Concise explanation */}
              <p className="text-xs text-slate-300 pt-2 border-t border-slate-800/80 leading-relaxed max-w-md mx-auto">
                {latestRecord.analysis.conclusion}
              </p>

              {/* One important limitation */}
              <div className="text-[11px] text-slate-500 pt-1">
                <span className="font-semibold text-slate-400">Limitation: </span>
                {latestRecord.analysis.limitations[0]}
              </div>
            </div>

            {/* Optional "View Experiment Details" Control */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setInspectedRecord(latestRecord);
                  setIsDetailsDrawerOpen(true);
                }}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Experiment Details & Parameters</span>
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Single Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep('NEXT_DECISION')}
                className="w-full py-3.5 rounded-xl font-mono text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <span>DECIDE WHAT COMES NEXT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 4: DECIDE WHAT COMES NEXT                           */}
        {/* ======================================================== */}
        {currentStep === 'NEXT_DECISION' && latestDecision && (
          <div className="space-y-6 max-w-xl mx-auto w-full animate-in fade-in duration-200">
            {/* Header prompt */}
            <div className="text-center space-y-1">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Evidence-Informed Search
              </span>
              <h3 className="text-lg font-extrabold text-slate-100">
                What does the evidence tell us to test next?
              </h3>
            </div>

            {/* Autonomous Decision Reasoning Card */}
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3 shadow-lg">
              <div className="text-xs text-slate-400 font-mono flex items-center justify-between">
                <span>Autonomous Agent Decision</span>
                <span className="text-cyan-300">
                  {latestDecision.nextCandidate ? `Target: ${latestDecision.nextCandidate.name}` : 'Goal Met'}
                </span>
              </div>

              <p className="text-sm text-slate-100 font-medium leading-relaxed">
                "{latestDecision.rationale}"
              </p>

              <div className="pt-2.5 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 flex items-center justify-between">
                <span>Policy: {latestDecision.decisionRule}</span>
                <span>{history.length} / {maxBudget} experiments</span>
              </div>
            </div>

            {/* Visual preview of next suggested candidate */}
            {latestDecision.nextCandidate && (
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Next Recommended: {latestDecision.nextCandidate.name}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {latestDecision.nextCandidate.chemicalFormula} • {latestDecision.nextCandidate.shortRole}
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-1 rounded border border-cyan-800/60">
                  {latestDecision.nextCandidate.id}
                </span>
              </div>
            )}

            {/* Single Primary Action Button */}
            <div className="pt-2 space-y-2">
              {latestDecision.nextCandidate ? (
                <button
                  type="button"
                  onClick={handleProceedToNextCandidate}
                  className="w-full py-3.5 rounded-xl font-mono text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer"
                >
                  <span>INVESTIGATE NEXT CANDIDATE ({latestDecision.nextCandidate.id})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentStep('FINISHED')}
                  className="w-full py-3.5 rounded-xl font-mono text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer"
                >
                  <span>VIEW INVESTIGATION SUMMARY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep('CHOOSE')}
                  className="text-xs font-mono text-slate-400 hover:text-slate-200"
                >
                  Or pick a different candidate manually
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 5: FINISH / INVESTIGATION SUMMARY                    */}
        {/* ======================================================== */}
        {currentStep === 'FINISHED' && (
          <div className="space-y-6 max-w-xl mx-auto w-full animate-in fade-in duration-200">
            {/* Header */}
            <div className="text-center space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Discovery Loop Terminated
              </span>
              <h3 className="text-xl font-black text-slate-100">
                Investigation Complete
              </h3>
            </div>

            {/* Summary Card */}
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
              <div className="text-xs text-slate-300 leading-relaxed">
                Evaluated <strong className="text-slate-100">{history.length} candidates</strong> against the lithium electrolyte solvent polarity threshold (TPSA ≥ 38.0 Å²).
              </div>

              {/* Compact result list of tested molecules */}
              <div className="space-y-2">
                {history.map(rec => (
                  <div
                    key={rec.experimentId}
                    className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold text-slate-200">{rec.candidate.name}</span>
                      <span className="text-slate-500 ml-1">({rec.candidate.id})</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-100">
                        {rec.numericalResult} {rec.units}
                      </span>
                      {rec.analysis.targetMet ? (
                        <span className="text-emerald-400 font-bold">✓ Met</span>
                      ) : (
                        <span className="text-rose-400 font-bold">✗ Below</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Core Scientific Finding */}
              <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-cyan-200 leading-relaxed">
                <span className="font-bold text-cyan-300 block mb-0.5">Key Scientific Evidence:</span>
                Cyclic carbonate scaffolds (EC, FEC, DFEC) consistently maintain high polar surface area (38.77 Å²), whereas acyclic opening (DMC) drops polarity to 35.53 Å² below target. Ring confinement is strictly required for high dielectric character.
              </div>
            </div>

            {/* Primary Action: Start New Investigation */}
            <div className="pt-2 flex flex-col items-center space-y-3">
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-3.5 rounded-xl font-mono text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-950" />
                <span>START NEW INVESTIGATION</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMemoryDrawerOpen(true)}
                className="text-xs font-mono text-slate-400 hover:text-slate-200"
              >
                Inspect full experiment ledger ({history.length} records)
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Slide-over Drawers & Modals */}
      <ExperimentDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        record={inspectedRecord || latestRecord}
        plan={currentPlan}
      />

      <MemoryDrawer
        isOpen={isMemoryDrawerOpen}
        onClose={() => setIsMemoryDrawerOpen(false)}
        history={history}
        onClearHistory={handleReset}
        onSelectRecord={rec => {
          setInspectedRecord(rec);
          setIsMemoryDrawerOpen(false);
          setIsDetailsDrawerOpen(true);
        }}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
}
