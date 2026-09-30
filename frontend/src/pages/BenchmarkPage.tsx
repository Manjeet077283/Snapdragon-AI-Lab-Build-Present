import React, { useState, useEffect } from 'react';
import { BenchmarkReport } from '../types';
import { fetchBenchmark } from '../services/api';
import { Zap, Cpu, Gauge, Activity, RefreshCw } from 'lucide-react';

export const BenchmarkPage: React.FC = () => {
  const [benchmark, setBenchmark] = useState<BenchmarkReport | null>(null);
  const [loading, setLoading] = useState(false);

  const runBenchmark = async () => {
    setLoading(true);
    try {
      const data = await fetchBenchmark();
      setBenchmark(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runBenchmark();
  }, []);

  if (loading || !benchmark) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs text-slate-400">Measuring live on-device AI inference performance...</p>
      </div>
    );
  }

  const m = benchmark.metrics;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">On-Device AI Benchmarking Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1">
              Live latency, memory footprint, and execution throughput measured on local device.
            </p>
          </div>
        </div>

        <button
          onClick={runBenchmark}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Re-Run Live Benchmark</span>
        </button>
      </div>

      {/* Primary Measured Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400">Model Load Time</span>
          <div className="text-2xl font-extrabold text-white font-mono">{m.modelLoadTimeMs} ms</div>
          <p className="text-[10px] text-slate-500">Local weight initialization</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400">First-Token Latency</span>
          <div className="text-2xl font-extrabold text-blue-400 font-mono">{m.firstTokenLatencyMs} ms</div>
          <p className="text-[10px] text-slate-500">Time-to-first-token (TTFT)</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400">Total Inference Latency</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{m.totalInferenceTimeMs} ms</div>
          <p className="text-[10px] text-slate-500">End-to-end plan execution</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400">Memory Footprint</span>
          <div className="text-2xl font-extrabold text-purple-400 font-mono">{m.memoryUsageMB} MB</div>
          <p className="text-[10px] text-slate-500">RAM allocation</p>
        </div>

      </div>

      {/* Execution Hardware Mode Speed Comparison Table */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Gauge className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Execution Provider Latency Comparison (CPU vs GPU vs NPU)</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Execution Hardware Mode</th>
                <th className="p-3">Model Load Time</th>
                <th className="p-3">Inference Time</th>
                <th className="p-3">Memory Used</th>
                <th className="p-3">Throughput (tokens/sec)</th>
                <th className="p-3 text-right">Hardware Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {benchmark.comparison.map((comp, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{comp.mode}</td>
                  <td className="p-3 font-mono">{comp.modelLoad}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">{comp.latency}</td>
                  <td className="p-3 font-mono">{comp.memory}</td>
                  <td className="p-3 font-mono text-blue-400">{comp.tokensPerSec}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                      comp.status.includes('Active')
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}>
                      {comp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start space-x-2">
          <Activity className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span>
            <b>Hardware Transparency Note:</b> All benchmark values reflect measured local execution times on host system. Unmeasured hardware targets are accurately marked as "Not measured" per Qualcomm competition guidelines.
          </span>
        </div>
      </div>

    </div>
  );
};
