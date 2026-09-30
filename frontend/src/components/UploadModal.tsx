import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, CheckCircle, AlertTriangle, RefreshCw, FileText } from 'lucide-react';
import { uploadFile, loadSampleData } from '../services/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (uploadData: any) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const res = await uploadFile(file);
      onSuccess(res);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error processing file');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await loadSampleData();
      onSuccess(res);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error loading synthetic dataset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Upload Business Data</h3>
            <p className="text-xs text-slate-400">Supported formats: CSV, XLSX, XLS, PDF (Max 50MB)</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            dragOver
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-700 bg-slate-950/50 hover:border-slate-600 hover:bg-slate-900'
          }`}
        >
          <input
            type="file"
            id="fileInput"
            accept=".csv, .xlsx, .xls, .pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
            {loading ? (
              <RefreshCw className="w-10 h-10 text-blue-400 animate-spin mb-3" />
            ) : (
              <FileSpreadsheet className="w-10 h-10 text-slate-400 mb-3 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-sm font-semibold text-slate-200">
              {loading ? 'Processing & Cleaning File...' : 'Drag & drop file here or click to browse'}
            </span>
            <span className="text-xs text-slate-400 mt-1">Non-destructive local processing priority</span>
          </label>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Don't have a dataset ready?</span>
          <button
            onClick={handleSampleClick}
            disabled={loading}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline flex items-center space-x-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Try Synthetic Sales Demo Dataset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
