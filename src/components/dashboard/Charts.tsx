import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartProps {
  title: string;
  data: any[];
  height?: number;
  type: 'line' | 'bar' | 'pie';
  colors?: string[];
}

const defaultColors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const LineChartComponent: React.FC<ChartProps> = ({
  title,
  data,
  height = 300,
  colors = defaultColors,
}) => (
  <div className="bg-white border border-neutral-300 rounded-lg p-4 lg:p-6">
    <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="name" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
          }}
        />
        <Legend />
        {Object.keys(data[0] || {}).map(
          (key, index) =>
            key !== 'name' && (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )
        )}
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export const BarChartComponent: React.FC<ChartProps> = ({
  title,
  data,
  height = 300,
  colors = defaultColors,
}) => (
  <div className="bg-white border border-neutral-300 rounded-lg p-4 lg:p-6">
    <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="name" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
          }}
        />
        <Legend />
        {Object.keys(data[0] || {}).map(
          (key, index) =>
            key !== 'name' && (
              <Bar key={key} dataKey={key} fill={colors[index % colors.length]} radius={[8, 8, 0, 0]} />
            )
        )}
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const PieChartComponent: React.FC<ChartProps> = ({
  title,
  data,
  colors = defaultColors,
}) => (
  <div className="bg-white border border-neutral-300 rounded-lg p-4 lg:p-6">
    <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default { LineChartComponent, BarChartComponent, PieChartComponent };