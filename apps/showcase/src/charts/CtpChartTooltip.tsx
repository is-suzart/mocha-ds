import React from 'react';
import { ChartTheme } from './useChartTheme';

interface CtpChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  theme: ChartTheme;
  isPercent?: boolean;
}

export const CtpChartTooltip: React.FC<CtpChartTooltipProps> = ({
  active,
  payload,
  label,
  theme,
  isPercent = false,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      style={{
        background: theme.tooltipBg,
        border: `1px solid ${theme.tooltipBorder}`,
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        backdropFilter: 'blur(8px)',
        fontFamily: theme.fontFamily,
        minWidth: 140,
      }}
    >
      {label && (
        <div
          style={{
            color: theme.labelColor,
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
            paddingBottom: '6px',
            borderBottom: `1px solid ${theme.tooltipBorder}`,
          }}
        >
          {label}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {payload.map((entry, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: entry.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: theme.labelColor, fontSize: '12px' }}>{entry.name}</span>
            </div>
            <span
              style={{
                color: theme.tooltipText,
                fontSize: '13px',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {isPercent
                ? `${(entry.value * 100).toFixed(1)}%`
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
