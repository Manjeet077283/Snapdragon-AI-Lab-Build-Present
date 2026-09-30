import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UploadModal } from './components/UploadModal';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { QueryPanel } from './pages/QueryPanel';
import { DataProfilePage } from './pages/DataProfile';
import { AnomaliesPage } from './pages/AnomaliesPage';
import { BenchmarkPage } from './pages/BenchmarkPage';
import { DevicePage } from './pages/DevicePage';
import { SettingsPage } from './pages/SettingsPage';

import {
  fetchProfile,
  fetchSummary,
  fetchAnomalies,
  fetchDevice,
  generateReport,
  loadSampleData,
  checkServiceHealth
} from './services/api';

import {
  DataProfile,
  AnalyticsSummary,
  AnomalyReport,
  DeviceInfo,
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeDatasetName, setActiveDatasetName] = useState('sales_data.csv');
  const [profile, setProfile] = useState<DataProfile | null>(null);
  const [cleaningLog, setCleaningLog] = useState<string[]>([
    "Dataset loaded. Non-destructive working copy initialized.",
    "Trimmed whitespace and normalized string columns.",
    "Standardized date fields into ISO format."
  ]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [anomalyReport, setAnomalyReport] = useState<AnomalyReport | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [cloudFallback, setCloudFallback] = useState(false);

  // Hybrid Processing Mode
  const [processingMode, setProcessingMode] = useState<'cloud' | 'snapdragon'>('cloud');
  const [serviceHealth, setServiceHealth] = useState({
    backendOk: true,
    analyticsOk: true,
    snapdragonOk: false
  });

  useEffect(() => {
    loadInitialData();
    pollHealth();
    const interval = setInterval(pollHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const pollHealth = async () => {
    const health = await checkServiceHealth();
    setServiceHealth(health);
  };

  const loadInitialData = async () => {
    setLoadingData(true);
    try {
      const dev = await fetchDevice();
      setDeviceInfo(dev);

      // Load synthetic sample dataset initially
      await loadSampleData();
      const prof = await fetchProfile();
      setProfile(prof);

      const sum = await fetchSummary();
      setSummary(sum);

      const anom = await fetchAnomalies();
      setAnomalyReport(anom);
    } catch (err) {
      console.error('Initial load error:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleUploadSuccess = async (uploadRes: any) => {
    setActiveDatasetName(uploadRes.filename || 'uploaded_data.csv');
    if (uploadRes.cleaningLog) setCleaningLog(uploadRes.cleaningLog);
    
    setLoadingData(true);
    try {
      const prof = await fetchProfile();
      setProfile(prof);

      const sum = await fetchSummary();
      setSummary(sum);

      const anom = await fetchAnomalies();
      setAnomalyReport(anom);

      setActiveTab('dashboard');
    } catch (err) {
      console.error('Upload processing error:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const { pdfUrl, excelUrl } = await generateReport();
      window.open(pdfUrl, '_blank');
      window.open(excelUrl, '_blank');
    } catch (err: any) {
      alert(`Report generation error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        activeDatasetName={activeDatasetName}
        deviceInfo={deviceInfo}
        processingMode={processingMode}
        setProcessingMode={setProcessingMode}
        serviceHealth={serviceHealth}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'landing' && (
          <LandingPage
            onOpenUpload={() => setIsUploadOpen(true)}
            onTryDemo={async () => {
              await loadSampleData();
              setActiveTab('dashboard');
            }}
            onGoToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            summary={summary}
            onOpenUpload={() => setIsUploadOpen(true)}
            onGoToQuery={() => setActiveTab('ai-analyst')}
            onGenerateReport={handleGenerateReport}
            deviceInfo={deviceInfo}
            loading={loadingData}
          />
        )}

        {activeTab === 'profile' && (
          <DataProfilePage
            profile={profile}
            cleaningLog={cleaningLog}
          />
        )}

        {activeTab === 'ai-analyst' && (
          <QueryPanel
            processingMode={processingMode}
          />
        )}

        {activeTab === 'anomalies' && (
          <AnomaliesPage
            anomalyReport={anomalyReport}
            onRefresh={async () => {
              const anom = await fetchAnomalies();
              setAnomalyReport(anom);
            }}
          />
        )}

        {activeTab === 'benchmark' && (
          <BenchmarkPage />
        )}

        {activeTab === 'device' && (
          <DevicePage deviceInfo={deviceInfo} />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            cloudFallbackEnabled={cloudFallback}
            onUpdateCloudFallback={setCloudFallback}
          />
        )}
      </main>

      {/* Upload File Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>SnapInsight — Private On-Device AI Data Analyst | Designed & Optimized for Snapdragon-powered HP PCs</p>
        <p className="text-[10px] mt-1 text-slate-600">Qualcomm® AI Lab Build & Present Challenge | Deterministic Analytics Engine</p>
      </footer>

    </div>
  );
}

export default App;
