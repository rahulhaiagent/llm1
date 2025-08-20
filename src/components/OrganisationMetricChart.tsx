'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

// These functions are now imported from chart-helpers.ts

// Helper functions are now imported from chart-helpers.ts

interface OrganisationMetricChartProps {
  title: string;
  data: Array<{
    name: string;
    displayName: string;
    value: number;
    formattedValue?: string;
  }>;
  metric: 'safety' | 'inputCost' | 'outputCost' | 'latency';
  organizationColor?: string;
}

export default function OrganisationMetricChart({ 
  title, 
  data, 
  metric 
}: OrganisationMetricChartProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Calculate dynamic bar size based on number of models
  const calculateBarSize = (dataLength: number) => {
    const minBarWidth = 40;
    const maxBarWidth = 120;
    const gap = 8;
    const calculatedWidth = Math.max(minBarWidth, Math.min(maxBarWidth, (800 / dataLength) - gap));
    return calculatedWidth;
  };

  const barSize = calculateBarSize(data.length);

  // Custom formatter for values
  const formatValue = (value: number) => {
    switch (metric) {
      case 'safety':
        return `${value.toFixed(1)}%`;
      case 'inputCost':
      case 'outputCost':
        // For very small values, use scientific notation
        if (value < 0.01) {
          return `$${value.toExponential(2)}`;
        }
        return `$${value.toFixed(value < 0.1 ? 3 : 2)}`;
      case 'latency':
        return `${value.toFixed(1)}ms`;
      default:
        return value.toFixed(2);
    }
  };

  // Custom X-axis tick formatter for model names
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const modelName = payload.value;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={16} 
          textAnchor="end" 
          fill="#6b7280" 
          fontSize={12.5}
          transform="rotate(-45)"
          width={200}
          style={{ fontWeight: 500 }}
        >
          {modelName}
        </text>
      </g>
    );
  };

  // Generate alternating colors for bars
  const getBarColor = (index: number) => {
    // Create an array of pastel colors
    const colors = [
      '#6EE7B7', // Light Green
      '#93C5FD', // Light Blue
      '#C4B5FD', // Light Purple
      '#FCD34D', // Light Amber
      '#67E8F9', // Light Cyan
      '#FCA5A5', // Light Red
      '#A5B4FC', // Light Indigo
      '#F9A8D4', // Light Pink
    ];
    
    return colors[index % colors.length];
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            {metric === 'safety' && 'Safety Score: '}
            {metric === 'inputCost' && 'Input Cost: '}
            {metric === 'outputCost' && 'Output Cost: '}
            {metric === 'latency' && 'Latency: '}
            {formatValue(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="my-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      <ResponsiveContainer width="100%" height={470}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 90 }}
                      barCategoryGap="10px"
        >
          <defs>
            {data.map((entry, index) => (
              <linearGradient 
                key={`gradient-${index}`} 
                id={`colorBar${index}`} 
                x1="0" y1="0" 
                x2="0" y2="1"
              >
                <stop offset="0%" stopColor={getBarColor(index)} stopOpacity={0.9} />
                <stop offset="95%" stopColor={getBarColor(index)} stopOpacity={0.6} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="displayName" 
            interval={0}
            height={110}
            tick={<CustomXAxisTick />}
            tickMargin={12}
          />
          <YAxis 
            width={70}
            tickFormatter={(value) => formatValue(value)}
            fontSize={11}
            tick={{ fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
            tickCount={5}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            barSize={barSize}
            radius={[4, 4, 0, 0]}
            minPointSize={8} // Ensures small values are still visible
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#colorBar${index})`} 
                stroke={getBarColor(index)} 
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

 