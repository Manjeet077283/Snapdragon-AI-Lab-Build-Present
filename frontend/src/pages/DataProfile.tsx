import React from 'react';
import { DataProfile as DataProfileType } from '../types';
import { FileText, CheckCircle2, AlertTriangle, Table, ShieldCheck, ListChecks } from 'lucide-react';

interface DataProfileProps {
  profile: DataProfileType | null;
  cleaningLog: string[];
}

export const DataProfilePage: React.FC<DataProfileProps> = ({ profile, cleaningLog }) => {
  if (!profile) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
        No dataset loaded for profiling.
      </div>
    );
  }

  const columnStatsList = Object.values(profile.column_stats || {});

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Data Profiling & Quality Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Statistical validation across {profile.total_rows.toLocaleString()} rows and {profile.total_cols} columns.
          </p>
        </div>

        {/* Data Quality Score Badge */}
        <div className="flex items-center space-x-3 bg-slate-950 px-5 py-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Data Quality Score</span>
            <span className="text-2xl font-extrabold text-emerald-400">{profile.quality_score}/100</span>
          </div>
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      {/* Quality Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">Total Rows</span>
          <div className="text-xl font-bold text-white">{profile.total_rows.toLocaleString()}</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">Total Columns</span>
          <div className="text-xl font-bold text-white">{profile.total_cols}</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">Missing Values</span>
          <div className="text-xl font-bold text-amber-400">{profile.missing_values_count}</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-400">Duplicate Rows</span>
          <div className="text-xl font-bold text-rose-400">{profile.duplicate_rows_count}</div>
        </div>

      </div>

      {/* Cleaning Log Display */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <ListChecks className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-white">Non-Destructive Data Cleaning Log</h3>
        </div>

        <div className="space-y-2">
          {cleaningLog.map((logItem, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{logItem}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Column Statistics Table */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Table className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Column Schema & Statistical Distributions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Column Name</th>
                <th className="p-3">Data Type</th>
                <th className="p-3">Null %</th>
                <th className="p-3">Unique Values</th>
                <th className="p-3">Min</th>
                <th className="p-3">Max</th>
                <th className="p-3">Mean</th>
                <th className="p-3">Median</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {columnStatsList.map((col, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{col.name}</td>
                  <td className="p-3 font-mono text-slate-400">{col.type}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${col.null_percentage > 0 ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'}`}>
                      {col.null_percentage}%
                    </span>
                  </td>
                  <td className="p-3 font-mono">{col.unique_count}</td>
                  <td className="p-3 font-mono">{col.min !== undefined ? col.min : '-'}</td>
                  <td className="p-3 font-mono">{col.max !== undefined ? col.max : '-'}</td>
                  <td className="p-3 font-mono">{col.mean !== undefined ? col.mean : '-'}</td>
                  <td className="p-3 font-mono">{col.median !== undefined ? col.median : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
