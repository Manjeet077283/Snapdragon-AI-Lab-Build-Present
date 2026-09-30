import React from 'react';
import { DeviceInfo } from '../types';
import { Cpu, ShieldCheck, Zap, HardDrive, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface DevicePageProps {
  deviceInfo: DeviceInfo | null;
}

export const DevicePage: React.FC<DevicePageProps> = ({ deviceInfo }) => {
  if (!deviceInfo) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
        Loading system device specs...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 shadow-xl">
        <div className="p-3 rounded-2xl bg-teal-950 text-teal-400 border border-teal-800">
          <Cpu className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Device & AI Runtime Status</h1>
          <p className="text-xs text-slate-400 mt-1">
            Hardware acceleration detection & Snapdragon PC optimization verification.
          </p>
        </div>
      </div>

      {/* Main Spec Card */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-6 shadow-xl">
        
        {/* Execution Status Badge Banner */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          deviceInfo.npuDetected
            ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200'
            : 'bg-blue-950/60 border-blue-800/80 text-blue-200'
        }`}>
          <div className="flex items-center space-x-3">
            <Zap className={`w-6 h-6 ${deviceInfo.npuDetected ? 'text-emerald-400' : 'text-blue-400'}`} />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current AI Execution Target</div>
              <div className="text-base font-bold text-white">{deviceInfo.execution}</div>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono">
            {deviceInfo.npuDetected ? 'Qualcomm QNN Native' : 'Snapdragon PC Optimized'}
          </span>
        </div>

        {/* Detailed Hardware Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block">Target Device</span>
            <span className="text-sm font-bold text-white block">{deviceInfo.device}</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block">Host Processor</span>
            <span className="text-sm font-bold text-white block">{deviceInfo.processor}</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block">CPU Cores & Arch</span>
            <span className="text-sm font-bold text-white block">{deviceInfo.cores} Cores ({deviceInfo.architecture})</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block">System RAM</span>
            <span className="text-sm font-bold text-white block">{deviceInfo.freeMemoryGB} GB Free / {deviceInfo.totalMemoryGB} GB Total</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block">AI Accelerator</span>
            <span className="text-sm font-bold text-indigo-400 block">{deviceInfo.aiAccelerator}</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block">Execution Runtime Provider</span>
            <span className="text-sm font-bold text-emerald-400 block">{deviceInfo.runtime}</span>
          </div>

        </div>

      </div>

      {/* Snapdragon Value Proposition Box */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <span>Snapdragon PC Value Proposition & Architecture</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          SnapInsight is specifically architected to leverage Snapdragon-powered PC hardware:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
          <li className="flex items-start space-x-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Dedicated NPU acceleration for local small language models (SLM).</span>
          </li>
          <li className="flex items-start space-x-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Low thermal envelope & high battery efficiency for mobile analyst workflows.</span>
          </li>
          <li className="flex items-start space-x-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Privacy-first computing keeping sensitive business files strictly on-device.</span>
          </li>
          <li className="flex items-start space-x-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Qualcomm AI Hub model compatibility for ONNX & QNN execution.</span>
          </li>
        </ul>
      </div>

    </div>
  );
};
