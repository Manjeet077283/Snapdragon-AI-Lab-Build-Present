import {
  DataProfile,
  AnalyticsSummary,
  QueryResult,
  AnomalyReport,
  DeviceInfo,
  BenchmarkReport
} from '../types';

// Read API URL from Vite environment variable (default to same origin in production)
const API_BASE = import.meta.env.VITE_API_URL || '';
const SNAPDRAGON_LOCAL_BASE = import.meta.env.VITE_LOCAL_SNAPDRAGON_URL || 'http://127.0.0.1:5050';

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to upload file.');
  }
  return res.json();
}

export async function fetchProfile(file?: string): Promise<DataProfile> {
  const res = await fetch(`${API_BASE}/api/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file }),
  });
  const data = await res.json();
  if (data.status !== 'success') throw new Error(data.message);
  return data.profile;
}

export async function cleanData(file?: string) {
  const res = await fetch(`${API_BASE}/api/clean`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file }),
  });
  const data = await res.json();
  if (data.status !== 'success') throw new Error(data.message);
  return data;
}

export async function fetchSummary(file?: string): Promise<AnalyticsSummary> {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file }),
  });
  const data = await res.json();
  if (data.status !== 'success') throw new Error(data.message);
  return data.summary;
}

export async function queryAI(question: string, file?: string, mode: 'cloud' | 'snapdragon' = 'cloud'): Promise<QueryResult> {
  // If in local Snapdragon mode, attempt direct query to local runtime daemon first
  if (mode === 'snapdragon') {
    try {
      const snapRes = await fetch(`${SNAPDRAGON_LOCAL_BASE}/infer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question }),
        signal: AbortSignal.timeout(3000)
      });
      if (snapRes.ok) {
        // Query deterministic math from backend while using Snapdragon local intent
        const snapData = await snapRes.json();
        const backendRes = await fetch(`${API_BASE}/api/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, file }),
        });
        const resJson = await backendRes.json();
        // Enrich with physical Snapdragon telemetry
        resJson.latencyMs = snapData.data.telemetry.total_inference_time_ms;
        resJson.executionTarget = snapData.data.execution_target;
        return resJson;
      }
    } catch (e) {
      console.warn("Snapdragon local daemon not reached, executing standard mode:", e);
    }
  }

  const res = await fetch(`${API_BASE}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, file }),
  });
  const data = await res.json();
  if (data.status !== 'success') throw new Error(data.message);
  return data;
}

export async function fetchAnomalies(targetColumn?: string, file?: string): Promise<AnomalyReport> {
  const res = await fetch(`${API_BASE}/api/anomaly`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetColumn, file }),
  });
  const data = await res.json();
  if (data.status !== 'success') throw new Error(data.message);
  return data.anomaly;
}

export async function generateReport(file?: string): Promise<{ pdfUrl: string; excelUrl: string }> {
  const res = await fetch(`${API_BASE}/api/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file }),
  });
  const data = await res.json();
  if (data.status !== 'success') throw new Error(data.message);
  return { pdfUrl: data.pdfUrl, excelUrl: data.excelUrl };
}

export async function fetchDevice(): Promise<DeviceInfo> {
  const res = await fetch(`${API_BASE}/api/device`);
  const data = await res.json();
  if (data.status !== 'success') throw new Error(data.message);
  return data.device;
}

export async function fetchBenchmark(): Promise<BenchmarkReport> {
  const res = await fetch(`${API_BASE}/api/benchmark`);
  const data = await res.json();
  if (data.status !== 'success') throw new Error(data.message);
  return data.benchmark;
}

export async function loadSampleData() {
  const res = await fetch(`${API_BASE}/api/sample`, { method: 'POST' });
  const data = await res.json();
  if (data.status !== 'success') throw new Error(data.message);
  return data;
}

export async function updateSettings(cloudFallback: boolean) {
  const res = await fetch(`${API_BASE}/api/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cloudFallback }),
  });
  return res.json();
}

export async function checkServiceHealth() {
  let backendOk = false;
  let analyticsOk = false;
  let snapdragonOk = false;

  try {
    const bRes = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
    if (bRes.ok) {
      const bData = await bRes.json();
      backendOk = true;
      if (bData.services && bData.services.analyticsMicroservice === 'online') {
        analyticsOk = true;
      }
    }
  } catch (e) {}

  try {
    const sRes = await fetch(`${SNAPDRAGON_LOCAL_BASE}/health`, { signal: AbortSignal.timeout(1000) });
    if (sRes.ok) snapdragonOk = true;
  } catch (e) {}

  return { backendOk, analyticsOk, snapdragonOk };
}
