import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface ScatterPlotProps {
  data: Array<{ x: number; y: number; label: string }>;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
        No correlation scatter data available.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 15, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis
            type="number"
            dataKey="x"
            name="Quantity"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Revenue"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
            formatter={(value: any, name: any) => [
              name === 'Revenue' ? `₹${Number(value).toLocaleString()}` : value,
              name
            ]}
          />
          <Scatter name="Order Item" data={data} fill="#6366f1" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
