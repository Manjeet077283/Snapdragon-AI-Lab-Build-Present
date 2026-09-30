export interface ColumnStat {
  name: string;
  type: string;
  null_count: number;
  null_percentage: number;
  unique_count: number;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  std?: number;
}

export interface DataProfile {
  total_rows: number;
  total_cols: number;
  missing_values_count: number;
  duplicate_rows_count: number;
  quality_score: number;
  numeric_columns: string[];
  categorical_columns: string[];
  date_columns: string[];
  column_stats: Record<string, ColumnStat>;
}

export interface KPIs {
  total_revenue: number;
  average_order_value: number;
  total_orders: number;
  growth_rate_pct: number;
  top_product: string;
}

export interface ChartCollection {
  monthly_trend: Array<{ period: string; revenue: number; orders: number }>;
  top_products: Array<{ product: string; revenue: number }>;
  category_distribution: Array<{ category: string; value: number }>;
  regional_performance: Array<{ region: string; revenue: number }>;
  scatter_price_revenue: Array<{ x: number; y: number; label: string }>;
}

export interface AnalyticsSummary {
  kpis: KPIs;
  charts: ChartCollection;
}

export interface ExplainabilityDetails {
  question: string;
  detected_intent: string;
  group_by: string;
  metric: string;
  formula: string;
  filter_applied: string;
  source_rows_processed: number;
  verified_result_summary: Array<{ group: string; value: number }>;
}

export interface AIResponse {
  summary: string;
  key_findings: string[];
  recommendations: string[];
  explainability: ExplainabilityDetails;
}

export interface QueryResult {
  question: string;
  intentSpec: Record<string, any>;
  verifiedResults: Array<{ group: string; value: number }>;
  calculationDetails: Record<string, any>;
  aiResponse: AIResponse;
  latencyMs: number;
  rowsProcessed: number;
}

export interface AnomalyRecord {
  row_index: number;
  target_column: string;
  value: number;
  anomaly_type: string;
  lower_bound: number;
  upper_bound: number;
  row_data: Record<string, any>;
}

export interface AnomalyReport {
  target_column: string;
  iqr_multiplier: number;
  q1: number;
  q3: number;
  iqr: number;
  lower_bound: number;
  upper_bound: number;
  total_records: number;
  anomalies_count: number;
  anomalies_percentage: number;
  anomalies: AnomalyRecord[];
}

export interface DeviceInfo {
  device: string;
  processor: string;
  cores: number;
  architecture: string;
  totalMemoryGB: string;
  freeMemoryGB: string;
  isSnapdragon: boolean;
  npuDetected: boolean;
  aiAccelerator: string;
  runtime: string;
  model: string;
  execution: string;
  privacyGuarantee: string;
  cloudFallbackEnabled?: boolean;
}

export interface BenchmarkMetrics {
  modelLoadTimeMs: number;
  firstTokenLatencyMs: number;
  totalInferenceTimeMs: number;
  tokensPerSec: number;
  memoryUsageMB: number;
  cpuUtilizationPct: number;
  npuUtilizationPct: number | null;
}

export interface BenchmarkComparison {
  mode: string;
  modelLoad: string;
  latency: string;
  memory: string;
  tokensPerSec: string;
  status: string;
}

export interface BenchmarkReport {
  timestamp: string;
  activeDevice: string;
  processor: string;
  activeExecution: string;
  metrics: BenchmarkMetrics;
  comparison: BenchmarkComparison[];
}
