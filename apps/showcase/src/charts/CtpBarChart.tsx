import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useChartTheme } from './useChartTheme';
import { CtpChartTooltip } from './CtpChartTooltip';

export interface BarChartSeries {
  key: string;
  label: string;
  colorIndex?: number;
}

export interface CtpBarChartProps {
  data: Record<string, any>[];
  series: BarChartSeries[];
  xAxisKey: string;
  title?: string;
  height?: number;
  layout?: 'vertical' | 'horizontal';
  showGrid?: boolean;
  showLegend?: boolean;
  barRadius?: number;
  /** If single series with no explicit colorIndex, use a distinct color per bar */
  rainbowMode?: boolean;
}

export const CtpBarChart: React.FC<CtpBarChartProps> = ({
  data,
  series,
  xAxisKey,
  title,
  height = 280,
  layout = 'horizontal',
  showGrid = true,
  showLegend = true,
  barRadius = 6,
  rainbowMode = false,
}) => {
  const theme = useChartTheme();
  const isVertical = layout === 'vertical';

  return (
    <div className="chart">
      {title && <div className="chart__title">{title}</div>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={isVertical ? 'vertical' : 'horizontal'}
          margin={{ top: 8, right: 24, left: isVertical ? 80 : 0, bottom: 8 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={theme.gridColor}
              strokeOpacity={0.5}
              horizontal={!isVertical}
              vertical={isVertical}
            />
          )}
          {isVertical ? (
            <>
              <YAxis
                dataKey={xAxisKey}
                type="category"
                tick={{ fill: theme.labelColor, fontFamily: theme.fontFamily, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <XAxis
                type="number"
                tick={{ fill: theme.labelColor, fontFamily: theme.fontFamily, fontSize: 12 }}
                axisLine={{ stroke: theme.gridColor }}
                tickLine={false}
              />
            </>
          ) : (
            <>
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
            </>
          )}
          <Tooltip content={<CtpChartTooltip theme={theme} />} />
          {showLegend && series.length > 1 && (
            <Legend
              wrapperStyle={{ fontFamily: theme.fontFamily, fontSize: 13, color: theme.labelColor }}
            />
          )}
          {series.map((s, seriesIdx) => {
            const color = theme.seriesColors[s.colorIndex ?? seriesIdx % theme.seriesColors.length];
            return (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={color}
                radius={isVertical ? [0, barRadius, barRadius, 0] : [barRadius, barRadius, 0, 0]}
                maxBarSize={48}
                animationDuration={600}
                animationEasing="ease-out"
              >
                {rainbowMode && series.length === 1
                  ? data.map((_, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={theme.seriesColors[idx % theme.seriesColors.length]}
                      />
                    ))
                  : null}
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
