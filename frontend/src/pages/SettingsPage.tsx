import React, { useState } from 'react';
import { Settings, ShieldCheck, Cloud, Cpu, Lock, CheckCircle2 } from 'lucide-react';
import { updateSettings } from '../services/api';

interface SettingsPageProps {
  cloudFallbackEnabled: boolean;
  onUpdateCloudFallback: (enabled: boolean) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  cloudFallbackEnabled,
  onUpdateCloudFallback
}) => {
  const [cloudToggle, setCloudToggle] = useState(cloudFallbackEnabled);
  const [saved, setSaved] = useState(false);

  const handleSave = async (enabled: boolean) => {
    setCloudToggle(enabled);
    onUpdateCloudFallback(enabled);
    await updateSettings(enabled);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 shadow-xl">
        <div className="p-3 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-800">
          <Settings className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Privacy & AI Model Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure local-first execution priority and cloud fallback preferences.
          </p>
        </div>
      </div>

      {/* AI Processing Mode Card */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-6 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <span>AI Processing Architecture & Privacy Mode</span>
        </h3>

        <div className="space-y-4">
          
          {/* Radio 1: Local On-Device */}
          <label className={`p-4 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
            !cloudToggle ? 'bg-blue-950/40 border-blue-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}>
            <input
              type="radio"
              name="aiMode"
              checked={!cloudToggle}
              onChange={() => handleSave(false)}
              className="mt-1 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-white">Local On-Device AI Mode (Recommended / Default)</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                All data, deterministic calculations, and AI intent parsing execute strictly on host Snapdragon PC without sending business data externally.
              </p>
            </div>
          </label>

          {/* Radio 2: Cloud Fallback */}
          <label className={`p-4 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
            cloudToggle ? 'bg-amber-950/40 border-amber-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}>
            <input
              type="radio"
              name="aiMode"
              checked={cloudToggle}
              onChange={() => handleSave(true)}
              className="mt-1 text-amber-600 focus:ring-amber-500"
            />
            <div>
              <div className="flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">Enable Optional Cloud Fallback API</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                If local AI model is unavailable, sends non-sensitive structured query intents to cloud endpoints with explicit user consent.
              </p>
            </div>
          </label>

        </div>

        {saved && (
          <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Privacy settings successfully saved.</span>
          </div>
        )}
      </div>

    </div>
  );
};
