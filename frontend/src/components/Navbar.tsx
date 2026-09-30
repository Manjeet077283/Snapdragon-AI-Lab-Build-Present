import React from 'react';
import { 
  BarChart3, 
  Bot, 
  FileText, 
  Cpu, 
  Zap, 
  Upload, 
  Settings, 
  Activity,
  AlertCircle,
  Cloud,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { DeviceInfo } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUpload: () => void;
  activeDatasetName: string;
  deviceInfo: DeviceInfo | null;
  processingMode: 'cloud' | 'snapdragon';
  setProcessingMode: (mode: 'cloud' | 'snapdragon') => void;
  serviceHealth: { backendOk: boolean; analyticsOk: boolean; snapdragonOk: boolean };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  activeDatasetName,
  deviceInfo,
  processingMode,
  setProcessingMode,
  serviceHealth
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'profile', label: 'Data Profile', icon: FileText },
    { id: 'ai-analyst', label: 'AI Analyst', icon: Bot },
    { id: 'anomalies', label: 'Anomalies', icon: AlertCircle },
    { id: 'benchmark', label: 'Benchmark', icon: Zap },
    { id: 'device', label: 'Device & Runtime', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40">
      
      {/* Top Bar with Live Health Badges & Mode Switch */}
      <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 py-1.5 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        
        {/* Service Health Indicators */}
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-300">Live Services:</span>
          <div className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${serviceHealth.backendOk ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
            <span>API: {serviceHealth.backendOk ? 'Online' : 'Connecting'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${serviceHealth.analyticsOk ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span>Analytics: {serviceHealth.analyticsOk ? 'Online' : 'Local Fallback'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${serviceHealth.snapdragonOk ? 'bg-blue-400' : 'bg-slate-500'}`}></span>
            <span>Snapdragon NPU: {serviceHealth.snapdragonOk ? 'Ready' : 'Standby'}</span>
          </div>
        </div>

        {/* AI Processing Mode Switch */}
        <div className="flex items-center space-x-2 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400">AI Mode:</span>
          <button
            onClick={() => setProcessingMode('cloud')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
              processingMode === 'cloud'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-3 h-3" />
            <span>Cloud Demo</span>
          </button>
          <button
            onClick={() => setProcessingMode('snapdragon')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
              processingMode === 'snapdragon'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span>Local Snapdragon</span>
          </button>
        </div>

      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-teal-400 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">SnapInsight</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                  Qualcomm AI Lab
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Private On-Device AI Data Analyst</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Dataset Status & Upload Button */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="truncate max-w-[120px]" title={activeDatasetName}>
                {activeDatasetName}
              </span>
            </div>

            <button
              onClick={onOpenUpload}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md transition-all active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Data</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav Subbar */}
      <div className="lg:hidden flex overflow-x-auto border-t border-slate-800 px-2 py-1.5 space-x-1 bg-slate-900/95 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
