import React from 'react';
import { X, Code, CheckCircle, HelpCircle, Layers, Table, Sparkles } from 'lucide-react';
import { ExplainabilityDetails } from '../types';

interface ViewCalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: ExplainabilityDetails | null;
}

export const ViewCalculationModal: React.FC<ViewCalculationModalProps> = ({
  isOpen,
  onClose,
  details
}) => {
  if (!isOpen || !details) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Calculation Transparency & Explainability</h3>
            <p className="text-xs text-slate-400">Deterministic verification pipeline for grounded AI response</p>
          </div>
        </div>

        {/* Step Flow Diagram */}
        <div className="space-y-4">
          
          {/* Step 1: NL Question */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Step 1: User Natural Language Query</span>
            </div>
            <p className="text-sm font-medium text-slate-200 pl-6">"{details.question}"</p>
          </div>

          {/* Step 2: AI Planner Intent */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 mb-1">
              <Layers className="w-4 h-4" />
              <span>Step 2: AI Planner Structured Intent Specification</span>
            </div>
            <div className="pl-6 grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 mt-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <div><span className="text-slate-500">intent:</span> {details.detected_intent}</div>
              <div><span className="text-slate-500">group_by:</span> {details.group_by}</div>
              <div><span className="text-slate-500">metric:</span> {details.metric}</div>
              <div><span className="text-slate-500">filter:</span> {details.filter_applied}</div>
            </div>
          </div>

          {/* Step 3: Python Deterministic Formula */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1">
              <Code className="w-4 h-4" />
              <span>Step 3: Python / Pandas Deterministic Calculation</span>
            </div>
            <p className="text-xs font-mono text-amber-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 mt-2 overflow-x-auto">
              {details.formula}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 pl-6">
              Processed {details.source_rows_processed.toLocaleString()} records deterministically without LLM guessing.
            </p>
          </div>

          {/* Step 4: Verified Numerical Results */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-2">
              <Table className="w-4 h-4" />
              <span>Step 4: Verified Numerical Data Output</span>
            </div>
            <div className="pl-6 space-y-1">
              {details.verified_result_summary && details.verified_result_summary.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-1 px-2.5 rounded bg-slate-900/80 border border-slate-800/80">
                  <span className="text-slate-300 font-medium">{item.group}</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {item.value >= 1000 ? `₹${item.value.toLocaleString()}` : item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Close Calculation View
          </button>
        </div>
      </div>
    </div>
  );
};
