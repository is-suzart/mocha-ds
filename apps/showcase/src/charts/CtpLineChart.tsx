import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Dot,
} from 'recharts';
import { useChartTheme } from './useChartTheme';
import { CtpChartTooltip } from './CtpChartTooltip';

export interface LineChartSeries {
  key: string;
  label: string;
  colorIndex?: number;
}

export interface CtpLineChartProps {
  data: Record<string, any>[];
  series: LineChartSeries[];
  xAxisKey: string;
  title?: string;
  height?: number;
  curved?: boolean;
  showDots?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
}

export const CtpLineChart: React.FC<CtpLineChartProps> = ({
  data,
  series,
  xAxisKey,
  title,
  height = 280,
  curved = true,
  showDots = true,
  showGrid = true,
  showLegend = true,
}) => {
  const theme = useChartTheme();

  return (
    <div className="chart">
      {title && <div className="chart__title">{title}</div>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
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
              <Line
                key={s.key}
                type={curved ? 'monotone' : 'linear'}
                dataKey={s.key}
                name={s.label}
                stroke={color}
                strokeWidth={2.5}
                dot={showDots ? <Dot r={4} fill={color} strokeWidth={0} /> : false}
                activeDot={{ r: 6, strokeWidth: 2, stroke: theme.base, fill: color }}
                animationDuration={800}
                animationEasing="ease-out"
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
