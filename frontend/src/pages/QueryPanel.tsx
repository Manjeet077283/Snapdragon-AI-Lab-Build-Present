import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Code, 
  CheckCircle2, 
  RefreshCw,
  Cpu,
  Cloud
} from 'lucide-react';
import { queryAI } from '../services/api';
import { QueryResult, ExplainabilityDetails } from '../types';
import { ViewCalculationModal } from '../components/ViewCalculationModal';

interface QueryPanelProps {
  onShowExplainability?: (details: ExplainabilityDetails) => void;
  processingMode?: 'cloud' | 'snapdragon';
}

const PRELOADED_QUESTIONS = [
  "Which product generated the highest revenue?",
  "Which products are performing poorly?",
  "Show monthly sales trends.",
  "Which region performed worst?",
  "Give me the top 5 products by revenue.",
  "Compare product categories by gross income."
];

export const QueryPanel: React.FC<QueryPanelProps> = ({ processingMode = 'cloud' }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QueryResult[]>([]);
  const [activeExplainModal, setActiveExplainModal] = useState<ExplainabilityDetails | null>(null);

  const handleAsk = async (qText?: string) => {
    const queryToRun = qText || question;
    if (!queryToRun.trim() || loading) return;

    setLoading(true);
    try {
      const result = await queryAI(queryToRun, undefined, processingMode);
      setHistory((prev) => [result, ...prev]);
      setQuestion('');
    } catch (err: any) {
      alert(`Query failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Data Analyst Assistant</h1>
            <p className="text-xs text-slate-400 mt-1">
              Ask natural language questions. AI maps queries to structured intent; Python computes deterministic answers.
            </p>
          </div>
        </div>

        {/* Current Target Indicator */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          {processingMode === 'snapdragon' ? (
            <>
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">Local Snapdragon NPU Mode</span>
            </>
          ) : (
            <>
              <Cloud className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300 font-medium">Cloud Demo Mode</span>
            </>
          )}
        </div>
      </div>

      {/* Preloaded Sample Prompts */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Suggested Demo Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRELOADED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 text-xs text-slate-300 transition-all text-left flex items-center space-x-1.5"
            >
              <Sparkles className="w-3 h-3 text-blue-400 shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Query Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Type your question (e.g. 'Which region generated the highest revenue?')"
            disabled={loading}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Analyze</span>
          </button>
        </div>
      </div>

      {/* Query Results Stream */}
      <div className="space-y-6">
        {history.map((res, idx) => (
          <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl animate-fade-in">
            
            {/* User Question Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <h3 className="text-base font-bold text-white">"{res.question}"</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                Inference Latency: {res.latencyMs} ms | {res.rowsProcessed.toLocaleString()} Rows
              </span>
            </div>

            {/* AI Summary Narrative */}
            <div className="prose prose-invert max-w-none text-sm text-slate-200"
                 dangerouslySetInnerHTML={{ __html: res.aiResponse.summary }}
            />

            {/* Key Findings List */}
            {res.aiResponse.key_findings && res.aiResponse.key_findings.length > 0 && (
              <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Key Grounded Findings:</span>
                <ul className="space-y-1">
                  {res.aiResponse.key_findings.map((kf, kidx) => (
                    <li key={kidx} className="text-xs text-slate-300 flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span dangerouslySetInnerHTML={{ __html: kf }} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* View Calculation Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveExplainModal(res.aiResponse.explainability)}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/80 text-xs font-medium transition-colors"
              >
                <Code className="w-4 h-4" />
                <span>View Calculation Trace</span>
              </button>
            </div>

          </div>
        ))}

        {history.length === 0 && (
          <div className="text-center py-12 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
            Select a suggested prompt above or type your own question to start analyzing your data.
          </div>
        )}
      </div>

      {/* Explainability Modal */}
      <ViewCalculationModal
        isOpen={!!activeExplainModal}
        onClose={() => setActiveExplainModal(null)}
        details={activeExplainModal}
      />

    </div>
  );
};
