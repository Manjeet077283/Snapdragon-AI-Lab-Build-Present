import React, { useState, useEffect } from 'react';
import { AnomalyReport } from '../types';
import { fetchAnomalies } from '../services/api';
import { AlertCircle, Eye, ShieldAlert, Sliders, RefreshCw } from 'lucide-react';

interface AnomaliesPageProps {
  anomalyReport: AnomalyReport | null;
  onRefresh: () => void;
}

export const AnomaliesPage: React.FC<AnomaliesPageProps> = ({ anomalyReport }) => {
  const [report, setReport] = useState<AnomalyReport | null>(anomalyReport);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!report) {
      loadAnomalies();
    }
  }, []);

  const loadAnomalies = async (col?: string) => {
    setLoading(true);
    try {
      const data = await fetchAnomalies(col);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !report) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs text-slate-400">Computing IQR statistical bounds & detecting outliers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 shadow-xl">
        <div className="p-3 rounded-2xl bg-rose-950 text-rose-400 border border-rose-800">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Statistical Anomaly Engine (IQR Method)</h1>
          <p className="text-xs text-slate-400 mt-1">
            Detects numerical outliers using Interquartile Range boundaries (Q1 - 1.5×IQR to Q3 + 1.5×IQR).
          </p>
        </div>
      </div>

      {/* IQR Statistical Parameters Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-6 gap-4">
        
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400">Target Column</span>
          <div className="text-base font-bold text-blue-400 truncate">{report.target_column}</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400">Total Records</span>
          <div className="text-base font-bold text-white">{report.total_records.toLocaleString()}</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400">Flagged Anomalies</span>
          <div className="text-base font-bold text-rose-400">{report.anomalies_count} ({report.anomalies_percentage}%)</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400">Lower Bound</span>
          <div className="text-base font-mono text-slate-300">₹{report.lower_bound.toLocaleString()}</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400">Upper Bound</span>
          <div className="text-base font-mono text-slate-300">₹{report.upper_bound.toLocaleString()}</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400">IQR Spread (Q3-Q1)</span>
          <div className="text-base font-mono text-indigo-400">₹{report.iqr.toLocaleString()}</div>
        </div>

      </div>

      {/* Anomalies Table */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>Flagged Outlier Records</span>
          </h3>
          <span className="text-xs text-slate-400">Showing top 50 statistical outliers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Row Index</th>
                <th className="p-3">Target Field</th>
                <th className="p-3">Observed Value</th>
                <th className="p-3">Outlier Classification</th>
                <th className="p-3">Boundary Limits</th>
                <th className="p-3 text-right">Inspect Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {report.anomalies.map((anom, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-slate-400">#{anom.row_index}</td>
                  <td className="p-3 font-medium text-white">{anom.target_column}</td>
                  <td className="p-3 font-mono font-bold text-rose-400">
                    ₹{anom.value.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${anom.anomaly_type === 'High Outlier' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                      {anom.anomaly_type}
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-slate-400 font-mono">
                    &lt; ₹{anom.lower_bound.toLocaleString()} or &gt; ₹{anom.upper_bound.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedRecord(anom.row_data)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row Detail Drawer Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Full Record Inspection</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-xs">
              {Object.entries(selectedRecord).map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">{k}:</span>
                  <span className="text-white font-semibold">{String(v)}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedRecord(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
