import React from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useChartTheme } from './useChartTheme';
import { CtpChartTooltip } from './CtpChartTooltip';

export interface RadarChartSeries {
  key: string;
  label: string;
  colorIndex?: number;
}

export interface CtpRadarChartProps {
  data: Record<string, any>[];
  series: RadarChartSeries[];
  angleKey: string;
  title?: string;
  height?: number;
  showLegend?: boolean;
  fillOpacity?: number;
}

export const CtpRadarChart: React.FC<CtpRadarChartProps> = ({
  data,
  series,
  angleKey,
  title,
  height = 300,
  showLegend = true,
  fillOpacity = 0.2,
}) => {
  const theme = useChartTheme();

  return (
    <div className="chart">
      {title && <div className="chart__title">{title}</div>}
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} margin={{ top: 16, right: 32, left: 32, bottom: 16 }}>
          <PolarGrid stroke={theme.gridColor} strokeOpacity={0.6} />
          <PolarAngleAxis
            dataKey={angleKey}
            tick={{ fill: theme.labelColor, fontFamily: theme.fontFamily, fontSize: 12 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            tick={{ fill: theme.axisColor, fontFamily: theme.fontFamily, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
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
              <Radar
                key={s.key}
                name={s.label}
                dataKey={s.key}
                stroke={color}
                fill={color}
                fillOpacity={fillOpacity}
                strokeWidth={2}
                dot={{ r: 4, fill: color, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: theme.base, fill: color }}
                animationDuration={800}
                animationEasing="ease-out"
              />
            );
          })}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
