import React, { useState } from 'react';
import { 
  Shield, 
  Target, 
  Cpu, 
  Users, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  XLink,
  ChevronRight,
  FileSearch,
  Settings,
  Lock,
  Globe,
  Loader2,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Assessment {
  executiveDecision: { verdict: string; justification: string; riskValuePos: string; score: number; signOffRoles: string[] };
  contextSummary: { problem: string; users: string; outcome: string; gaps: string; assumptionsUsed: string[] };
  architectReview: { 
    feasibility: number; 
    architecture: string; 
    tokenDrivers: string; 
    reductionTactics: string[]; 
    failureModes: string; 
    governanceGaps: string[]; 
    stopThresholds: string[] 
  };
  productReview: { 
    userStatement: string; 
    valueProp: string; 
    kpis: { name: string; threshold: string }[]; 
    alternatives: { name: string; pros: string; cons: string; speed: string; risk: string }[]; 
    humanInTheLoop: string 
  };
  financeReview: { 
    scenarios: {
      conservative: { volume: string; cost: string; notes: string };
      likely: { volume: string; cost: string; notes: string };
      aggressive: { volume: string; cost: string; notes: string };
    };
    fteComparison: string; 
    tiers: { name: string; range: string; risk: string; governance: string }[]; 
    sensitivity: string 
  };
  privacyReview: { risk: number; gaps: string[]; minControls: string[]; verdict: string };
  crossBorder: { 
    involved: string; 
    mapping: { origin: string; destination: string }; 
    adequacy: string; 
    mechanisms: string[]; 
    tiaRequired: boolean; 
    safeguards: string[]; 
    riskLevel: string 
  };
  finalSummary: string;
}

import { PRESET_SCENARIOS } from './constants';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [formData, setFormData] = useState({
    projectBrief: '',
    codeSnippet: '',
    workflowDescription: '',
    volumeExpectations: '',
    complianceInfo: '',
    hitlExpectations: '',
    stakeholders: '',
    assumptions: ''
  });

  const loadPreset = (id: string) => {
    const preset = PRESET_SCENARIOS.find(s => s.id === id);
    if (preset) {
      setFormData(prev => ({
        ...prev,
        projectBrief: preset.project_brief,
        codeSnippet: preset.code_or_workflow_description,
        volumeExpectations: preset.usage_volume,
        complianceInfo: preset.compliance_info,
        workflowDescription: preset.code_or_workflow_description // also mapping to this for fallback
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setAssessment(data);
    } catch (err) {
      console.error(err);
      alert('Failed to generate assessment. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-900">AI Project Assessor</h1>
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Enterprise Review Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-full text-xs font-semibold text-neutral-600 border border-neutral-200">
              <Lock size={12} />
              Secured Analysis
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input Panel */}
          <div className="lg:col-span-5 border-r border-neutral-200 pr-0 lg:pr-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Project Review Lab</h2>
              <p className="text-neutral-500 leading-relaxed">
                Submit your AI project parameters to generate a 5-layer enterprise assessment.
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Load Enterprise Preset</h4>
              <div className="flex flex-wrap gap-2">
                {PRESET_SCENARIOS.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => loadPreset(preset.id)}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-[10px] font-bold hover:bg-neutral-50 hover:border-blue-300 hover:text-blue-600 transition-all cursor-pointer"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <FileSearch size={16} className="text-blue-600" />
                  Project Brief
                </label>
                <textarea
                  name="projectBrief"
                  value={formData.projectBrief}
                  onChange={handleInputChange}
                  placeholder="Problem, context, objectives, success criteria..."
                  className="w-full h-32 px-4 py-3 rounded-xl bg-white border border-neutral-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Cpu size={16} className="text-blue-600" />
                  Code or Workflow Description
                </label>
                <textarea
                  name="codeSnippet"
                  value={formData.codeSnippet}
                  onChange={handleInputChange}
                  placeholder="Logic, API definitions, or user interaction steps..."
                  className="w-full h-32 px-4 py-3 rounded-xl bg-white border border-neutral-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm font-mono resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <BarChart3 size={16} className="text-blue-600" />
                    Usage Volume
                  </label>
                  <input
                    name="volumeExpectations"
                    value={formData.volumeExpectations}
                    onChange={handleInputChange}
                    placeholder="e.g. 1k req/day"
                    className="w-full px-4 py-2 rounded-xl bg-white border border-neutral-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Globe size={16} className="text-blue-600" />
                    Compliance Info
                  </label>
                  <input
                    name="complianceInfo"
                    value={formData.complianceInfo}
                    onChange={handleInputChange}
                    placeholder="e.g. GDPR, PII status"
                    className="w-full px-4 py-2 rounded-xl bg-white border border-neutral-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Users size={16} className="text-blue-600" />
                  HITL & Stakeholders
                </label>
                <input
                  name="hitlExpectations"
                  value={formData.hitlExpectations}
                  onChange={handleInputChange}
                  placeholder="Human-in-the-loop expectations..."
                  className="w-full px-4 py-2 rounded-xl bg-white border border-neutral-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm mb-2"
                />
                <input
                  name="stakeholders"
                  value={formData.stakeholders}
                  onChange={handleInputChange}
                  placeholder="Key stakeholders (CEO, CIO, etc.)..."
                  className="w-full px-4 py-2 rounded-xl bg-white border border-neutral-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg",
                  loading ? "bg-neutral-200 text-neutral-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-blue-200"
                )}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Generate Assessment Pack"}
              </button>
            </form>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!assessment && !loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-neutral-200 rounded-3xl"
                >
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                    <Target size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-800">Awaiting Input</h3>
                  <p className="text-neutral-500 max-w-sm mt-2">
                    Enter project details on the left and submit to receive a strategic, technical, and compliance review.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-24"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-100 rounded-full border-t-blue-600 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center uppercase font-mono text-[8px] font-bold tracking-tighter text-blue-600">
                      Processing
                    </div>
                  </div>
                  <p className="mt-8 text-neutral-600 font-medium animate-pulse">Running multi-lens enterprise analysis...</p>
                  <div className="mt-4 flex gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                  </div>
                </motion.div>
              )}

              {assessment && !loading && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8 pb-24"
                >
                  {/* Executive Summary Card */}
                  <section className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xl shadow-neutral-200/50">
                    <div className="bg-neutral-900 px-8 py-6 text-white flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-1">1. Executive Decision</h3>
                        <p className="text-2xl font-bold flex items-center gap-3">
                          {assessment.executiveDecision.verdict === 'Go' && <CheckCircle2 className="text-emerald-400" />}
                          {assessment.executiveDecision.verdict === 'No-Go' && <AlertTriangle className="text-rose-400" />}
                          {assessment.executiveDecision.verdict}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-neutral-400">Governance Score</span>
                        <div className="text-3xl font-black text-blue-400">{assessment.executiveDecision.score}/100</div>
                      </div>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Justification</h4>
                          <p className="text-neutral-700 leading-relaxed font-medium">
                            {assessment.executiveDecision.justification}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Risk/Value Position</h4>
                          <p className="text-neutral-700 leading-relaxed">
                            {assessment.executiveDecision.riskValuePos}
                          </p>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-neutral-100 flex flex-wrap gap-2">
                        <span className="text-xs font-bold text-neutral-400 uppercase mr-2 mt-1">Required Sign-offs:</span>
                        {assessment.executiveDecision.signOffRoles.map(role => (
                          <span key={role} className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-bold rounded-full">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white p-6 rounded-2xl border border-neutral-200">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4 flex items-center gap-2">
                        <Cpu size={16} /> Technical Blueprint
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Feasibility</span>
                          <span className="text-sm font-bold text-blue-600">{assessment.architectReview.feasibility}/10</span>
                        </div>
                        <div className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                          <span className="font-bold text-neutral-900 block mb-1">Architecture</span>
                          {assessment.architectReview.architecture}
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Efficiency Tactics</h4>
                          <div className="flex flex-wrap gap-1">
                            {assessment.architectReview.reductionTactics.map((t, i) => (
                              <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Governance Gaps</h4>
                          <ul className="space-y-1">
                            {assessment.architectReview.governanceGaps.map((gap, i) => (
                              <li key={i} className="text-xs flex items-start gap-2 text-neutral-600">
                                <span className="mt-1 w-1 h-1 bg-rose-400 rounded-full" />
                                {gap}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </section>

                    <section className="bg-white p-6 rounded-2xl border border-neutral-200">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-4 flex items-center gap-2">
                        <Target size={16} /> User/Product Value
                      </h3>
                      <div className="space-y-4">
                        <p className="text-sm text-neutral-600 leading-relaxed italic border-l-4 border-indigo-100 pl-4 py-1">
                          {assessment.productReview.valueProp}
                        </p>
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Human-In-The-Loop</h4>
                          <p className="text-xs text-neutral-600 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/50">
                            {assessment.productReview.humanInTheLoop}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Success Metrics</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {assessment.productReview.kpis.map((kpi, i) => (
                              <div key={i} className="flex items-center justify-between text-xs p-2 bg-indigo-50 rounded-lg text-indigo-900">
                                <span className="font-medium">{kpi.name}</span>
                                <span className="font-bold opacity-60 underline decoration-indigo-200">{kpi.threshold}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Financial Section */}
                  <section className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
                    <div className="bg-emerald-600 px-8 py-4 text-white flex items-center gap-2">
                      <DollarSign size={20} />
                      <h3 className="font-bold uppercase tracking-widest text-xs">4. Financial & Ops Scenarios</h3>
                    </div>
                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {(['conservative', 'likely', 'aggressive'] as const).map(key => (
                          <div key={key} className={cn(
                            "p-4 rounded-2xl border",
                            key === 'likely' ? "bg-emerald-50 border-emerald-200 shadow-sm" : "bg-neutral-50 border-neutral-100"
                          )}>
                            <h4 className="text-[10px] font-black uppercase tracking-tighter text-emerald-700 mb-1">{key}</h4>
                            <div className="text-xl font-black text-neutral-900">{assessment.financeReview.scenarios[key].cost}</div>
                            <p className="text-[10px] font-bold text-neutral-500 uppercase mt-1">@ {assessment.financeReview.scenarios[key].volume}</p>
                            <p className="text-xs text-neutral-600 mt-3 leading-tight opacity-80">{assessment.financeReview.scenarios[key].notes}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-neutral-100">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">FTE & ROI Comparison</h4>
                          <p className="text-sm text-neutral-700 leading-relaxed font-medium">{assessment.financeReview.fteComparison}</p>
                          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                            <h5 className="text-[10px] font-bold text-emerald-700 uppercase mb-1">Sensitivity Analysis</h5>
                            <p className="text-xs text-emerald-800 leading-snug">{assessment.financeReview.sensitivity}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Product Implementation Tiers</h4>
                          {assessment.financeReview.tiers.map(tier => (
                            <div key={tier.name} className="flex items-center justify-between p-3 border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors">
                              <div className="space-y-1">
                                <span className="text-sm font-black block">{tier.name}</span>
                                <span className="text-[10px] text-neutral-500 uppercase font-bold">{tier.risk}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-mono font-bold text-emerald-600">{tier.range}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Privacy & Compliance Section */}
                  <section className="bg-white rounded-3xl border border-neutral-200 overflow-hidden">
                    <div className={cn(
                      "px-8 py-4 text-white flex items-center gap-2",
                      assessment.privacyReview.risk > 7 ? "bg-rose-600" : "bg-neutral-800"
                    )}>
                      <Shield size={20} />
                      <h3 className="font-bold uppercase tracking-widest text-xs">5. Privacy & Ethics Review</h3>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-neutral-900 uppercase">Privacy Risk Profile</h4>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-black uppercase",
                            assessment.privacyReview.risk > 7 ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                          )}>
                            RATING: {assessment.privacyReview.risk}/10
                          </span>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Required Controls</h4>
                          <ul className="space-y-2">
                            {assessment.privacyReview.minControls.map((control, i) => (
                              <li key={i} className="text-sm flex items-start gap-3 bg-neutral-50 p-2 rounded-lg">
                                <Lock size={14} className="mt-0.5 text-neutral-400 shrink-0" />
                                <span className="text-neutral-700">{control}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Cross Border Subsection */}
                      <div className="border-l border-neutral-100 pl-0 md:pl-12 space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-neutral-900 uppercase flex items-center gap-2">
                            <Globe size={16} className="text-blue-600" />
                            Cross-Border Transfers
                          </h4>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-black",
                            assessment.crossBorder.involved === 'Yes' ? "bg-rose-100 text-rose-600" : "bg-neutral-100 text-neutral-500"
                          )}>
                            {assessment.crossBorder.involved}
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Origin</p>
                              <p className="text-xs font-bold">{assessment.crossBorder.mapping.origin}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Destination</p>
                              <p className="text-xs font-bold">{assessment.crossBorder.mapping.destination}</p>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-neutral-900 rounded-xl text-white">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic">Safeguard Level</span>
                              <span className="text-[10px] font-black uppercase text-emerald-400">{assessment.crossBorder.riskLevel}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {assessment.crossBorder.mechanisms.map((m, i) => (
                                <span key={i} className="px-2 py-0.5 bg-neutral-800 text-[10px] rounded border border-neutral-700">
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Required Mitigations</h4>
                            <ul className="space-y-1">
                              {assessment.crossBorder.safeguards.map((s, i) => (
                                <li key={i} className="text-xs text-neutral-600 flex items-start gap-2">
                                  <ChevronRight size={12} className="mt-0.5 text-blue-600" /> {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Summary Footer */}
                  <section className="bg-blue-600 text-white p-12 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="relative">
                      <h3 className="text-3xl font-black mb-6 tracking-tight leading-none">Integrated Summary Verdict</h3>
                      <p className="text-lg text-blue-100 font-medium leading-relaxed max-w-2xl">
                        {assessment.finalSummary}
                      </p>
                      <button 
                        onClick={() => window.print()}
                        className="mt-8 px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-white/90 transition-all flex items-center gap-2 text-sm"
                      >
                        <Settings size={18} />
                        Export Full Assessment PDF
                      </button>
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-neutral-400 text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span>Enterprise Grade</span>
            <div className="w-1 h-1 bg-neutral-200 rounded-full" />
            <span>AI Governance Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-900 cursor-pointer">Security Protocol</span>
            <span className="hover:text-neutral-900 cursor-pointer">Compliance API</span>
            <span className="hover:text-neutral-900 cursor-pointer">Data Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
