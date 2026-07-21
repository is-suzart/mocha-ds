import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useChartTheme } from './useChartTheme';
import { CtpChartTooltip } from './CtpChartTooltip';

export interface AreaChartSeries {
  key: string;
  label: string;
  colorIndex?: number;
  stackId?: string;
}

export interface CtpAreaChartProps {
  data: Record<string, any>[];
  series: AreaChartSeries[];
  xAxisKey: string;
  title?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  fillOpacity?: number;
}

export const CtpAreaChart: React.FC<CtpAreaChartProps> = ({
  data,
  series,
  xAxisKey,
  title,
  height = 280,
  showGrid = true,
  showLegend = true,
}) => {
  const theme = useChartTheme();

  return (
    <div className="chart">
      {title && <div className="chart__title">{title}</div>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
          <defs>
            {series.map((s, i) => {
              const color = theme.seriesColors[s.colorIndex ?? i % theme.seriesColors.length];
              return (
                <linearGradient key={`grad-${s.key}`} id={`area-grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.6} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              );
            })}
          </defs>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={theme.gridColor}
              strokeOpacity={0.5}
              vertical={false}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: theme.labelColor, fontFamily: theme.fontFamily, fontSize: 12 }}
            axisLine={{ stroke: theme.gridColor }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: theme.labelColor, fontFamily: theme.fontFamily, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CtpChartTooltip theme={theme} />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontFamily: theme.fontFamily, fontSize: 13, color: theme.labelColor }}
            />
          )}
          {series.map((s, i) => {
            const color = theme.seriesColors[s.colorIndex ?? i % theme.seriesColors.length];
            return (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={color}
                strokeWidth={2.5}
                fill={`url(#area-grad-${s.key})`}
                stackId={s.stackId}
                activeDot={{ r: 6, strokeWidth: 2, stroke: theme.base, fill: color }}
                animationDuration={800}
                animationEasing="ease-out"
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
