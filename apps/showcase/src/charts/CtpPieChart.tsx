import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Sector,
} from 'recharts';
import { useChartTheme } from './useChartTheme';
import { CtpChartTooltip } from './CtpChartTooltip';

export interface PieChartData {
  name: string;
  value: number;
  colorIndex?: number;
}

export interface CtpPieChartProps {
  data: PieChartData[];
  title?: string;
  height?: number;
  donut?: boolean;
  showLegend?: boolean;
}

const renderCustomActiveShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value, fontFamily, labelColor, textColor,
  } = props;

  return (
    <g>
      {innerRadius > 0 && (
        <>
          <text
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            fill={textColor}
            fontFamily={fontFamily}
            fontSize={14}
            fontWeight={600}
          >
            {payload.name}
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            fill={labelColor}
            fontFamily={fontFamily}
            fontSize={12}
          >
            {Number(value).toLocaleString()} ({(percent * 100).toFixed(1)}%)
          </text>
        </>
      )}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 16}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export const CtpPieChart: React.FC<CtpPieChartProps> = ({
  data,
  title,
  height = 300,
  donut = true,
  showLegend = true,
}) => {
  const theme = useChartTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const innerRadius = donut ? '55%' : 0;
  const outerRadius = '78%';

  // We pass theme values through the shape prop via a closure
  const activeShape = (props: any) =>
    renderCustomActiveShape({
      ...props,
      fontFamily: theme.fontFamily,
      labelColor: theme.labelColor,
      textColor: theme.text,
    });

  return (
    <div className="chart">
      {title && <div className="chart__title">{title}</div>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Pie
            {...{
              data,
              cx: '50%',
              cy: '50%',
              innerRadius,
              outerRadius,
              dataKey: 'value',
              activeIndex,
              activeShape,
              onMouseEnter: (_: any, index: number) => setActiveIndex(index),
              animationDuration: 800,
              animationEasing: 'ease-out',
              paddingAngle: donut ? 3 : 1,
            } as any}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={theme.seriesColors[(entry.colorIndex ?? index) % theme.seriesColors.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CtpChartTooltip theme={theme} />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontFamily: theme.fontFamily, fontSize: 13, color: theme.labelColor }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
