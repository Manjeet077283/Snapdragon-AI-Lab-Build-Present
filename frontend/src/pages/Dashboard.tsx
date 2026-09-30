import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Download, 
  AlertCircle, 
  FileCheck2,
  PieChart as PieIcon,
  BarChart2,
  TrendingDown
} from 'lucide-react';
import { AnalyticsSummary, DeviceInfo } from '../types';
import { LineTrendChart } from '../charts/LineTrendChart';
import { BarPerformanceChart } from '../charts/BarPerformanceChart';
import { CategoryDonutChart } from '../charts/CategoryDonutChart';
import { ScatterPlot } from '../charts/ScatterPlot';

interface DashboardProps {
  summary: AnalyticsSummary | null;
  onOpenUpload: () => void;
  onGoToQuery: () => void;
  onGenerateReport: () => void;
  deviceInfo: DeviceInfo | null;
  loading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  summary,
  onOpenUpload,
  onGoToQuery,
  onGenerateReport,
  deviceInfo,
  loading
}) => {
  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-300">Computing deterministic analytics & profile...</p>
      </div>
    );
  }

  const kpis = summary?.kpis || {
    total_revenue: 0,
    average_order_value: 0,
    total_orders: 0,
    growth_rate_pct: 0,
    top_product: 'N/A'
  };

  const charts = summary?.charts || {
    monthly_trend: [],
    top_products: [],
    category_distribution: [],
    regional_performance: [],
    scatter_price_revenue: []
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Executive Analytics Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
              Verified Deterministic Data
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time calculations powered by Python & Pandas on {deviceInfo?.device || 'Snapdragon PC Host'}.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onGoToQuery}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-md active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask Natural Language AI</span>
          </button>

          <button
            onClick={onGenerateReport}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-md active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export Executive PDF/Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Total Revenue */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Total Revenue</span>
            <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/80">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            ₹{kpis.total_revenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400">Sum of verified revenue records</p>
        </div>

        {/* KPI 2: Average Order Value */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Avg Order Value</span>
            <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/80">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            ₹{kpis.average_order_value.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400">Mean revenue per transaction</p>
        </div>

        {/* KPI 3: Total Orders */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Total Orders</span>
            <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-800/80">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {kpis.total_orders.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400">Validated dataset rows</p>
        </div>

        {/* KPI 4: Growth Rate % */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Period Growth</span>
            <div className={`p-2 rounded-lg ${kpis.growth_rate_pct >= 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
              {kpis.growth_rate_pct >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
          </div>
          <div className={`text-2xl font-extrabold ${kpis.growth_rate_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {kpis.growth_rate_pct >= 0 ? `+${kpis.growth_rate_pct}%` : `${kpis.growth_rate_pct}%`}
          </div>
          <p className="text-[10px] text-slate-400">Month-over-month trend</p>
        </div>

        {/* KPI 5: Top Product */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Top Performer</span>
            <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/80">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-white truncate" title={kpis.top_product}>
            {kpis.top_product}
          </div>
          <p className="text-[10px] text-slate-400">Highest grossing product</p>
        </div>

      </div>

      {/* Dynamic Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Monthly Sales Trend Line Chart */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Revenue & Order Growth Trend</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Monthly Line Chart</span>
          </div>
          <LineTrendChart data={charts.monthly_trend} />
        </div>

        {/* Chart 2: Top Products Revenue Bar Chart */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              <span>Top Product Grossing Ranking</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Bar Chart</span>
          </div>
          <BarPerformanceChart data={charts.top_products} dataKeyName="product" valueKeyName="revenue" />
        </div>

        {/* Chart 3: Category Distribution Donut Chart */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-pink-400" />
              <span>Category Revenue Share</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Donut Chart</span>
          </div>
          <CategoryDonutChart data={charts.category_distribution} />
        </div>

        {/* Chart 4: Price vs Revenue Scatter Plot */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Quantity vs Revenue Correlation</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Scatter Plot</span>
          </div>
          <ScatterPlot data={charts.scatter_price_revenue} />
        </div>

      </div>

      {/* AI Insights & Executive Recommendations Section */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Grounded AI Insight Engine</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Performance Insight</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              Product <b>{kpis.top_product}</b> generated the highest gross revenue of <b>₹{kpis.total_revenue.toLocaleString()}</b> across the dataset.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Growth Trend Insight</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              Period-over-period revenue changed by <b>{kpis.growth_rate_pct}%</b> based on month-over-month date aggregation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Strategic Recommendation</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              Optimize inventory allocation for high-margin categories and review low-volume products to maximize overall gross revenue.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
