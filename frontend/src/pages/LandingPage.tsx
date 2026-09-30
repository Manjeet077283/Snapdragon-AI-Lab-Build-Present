import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  BarChart2, 
  Upload, 
  ArrowRight, 
  Layers, 
  FileSpreadsheet, 
  Code2, 
  Zap,
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  onOpenUpload: () => void;
  onTryDemo: () => void;
  onGoToDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenUpload,
  onTryDemo,
  onGoToDashboard
}) => {
  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Snapdragon® AI Lab Build & Present Challenge</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          SnapInsight
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 text-3xl sm:text-5xl mt-2 font-bold">
            Private On-Device AI Data Analyst
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
          "Turn your business data into actionable insights with AI accelerated for Snapdragon-powered PCs."
        </p>

        <p className="text-sm text-slate-400 max-w-3xl mx-auto">
          Combines deterministic Python/Pandas calculation accuracy with on-device AI natural language understanding. Sensitive business data stays strictly on your PC without cloud dependency.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onOpenUpload}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Business Data</span>
          </button>

          <button
            onClick={onTryDemo}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <span>Try Synthetic Demo Dataset</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-slate-700 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center border border-blue-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Private On-Device Processing</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Designed for privacy-conscious workflows. Data is validated, cleaned, and computed locally on your PC. No mandatory cloud transfers.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-slate-700 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center border border-indigo-800">
            <Code2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Deterministic + AI Architecture</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI interprets natural language questions into structured intents; Python & Pandas compute verified numbers. Zero numerical hallucinations.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-slate-700 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-teal-950 text-teal-400 flex items-center justify-center border border-teal-800">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Snapdragon PC Optimization</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Engineered for Snapdragon-powered HP PCs. Hardware-aware detection displays real-time execution across CPU, GPU, and Qualcomm Hexagon NPU.
          </p>
        </div>

      </div>

      {/* System Flow Banner */}
      <div className="max-w-5xl mx-auto px-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider text-center mb-6">
          End-to-End Privacy-Conscious Workflow
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="font-semibold text-blue-400">1. Upload</div>
            <div className="text-[10px] text-slate-500 mt-1">CSV/XLSX/PDF</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="font-semibold text-blue-400">2. Validate</div>
            <div className="text-[10px] text-slate-500 mt-1">Quality Check</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="font-semibold text-blue-400">3. Clean</div>
            <div className="text-[10px] text-slate-500 mt-1">Non-Destructive</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="font-semibold text-purple-400">4. AI Intent</div>
            <div className="text-[10px] text-slate-500 mt-1">Structured Spec</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="font-semibold text-amber-400">5. Pandas</div>
            <div className="text-[10px] text-slate-500 mt-1">Exact Math</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="font-semibold text-emerald-400">6. Insights</div>
            <div className="text-[10px] text-slate-500 mt-1">Recharts KPIs</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
            <div className="font-semibold text-teal-400">7. Report</div>
            <div className="text-[10px] text-slate-500 mt-1">PDF & Excel</div>
          </div>
        </div>
      </div>

    </div>
  );
};
