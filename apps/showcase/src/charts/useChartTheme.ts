import { useState, useEffect } from 'react';

export interface ChartTheme {
  // Series palette (Catppuccin accent colors)
  seriesColors: string[];
  // Neutral UI elements
  gridColor: string;
  axisColor: string;
  labelColor: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  // Base colors
  base: string;
  surface0: string;
  surface1: string;
  text: string;
  // Font
  fontFamily: string;
}

function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function readTheme(): ChartTheme {
  return {
    seriesColors: [
      getCSSVar('--ctp-mauve'),
      getCSSVar('--ctp-blue'),
      getCSSVar('--ctp-green'),
      getCSSVar('--ctp-peach'),
      getCSSVar('--ctp-pink'),
      getCSSVar('--ctp-teal'),
      getCSSVar('--ctp-yellow'),
      getCSSVar('--ctp-red'),
      getCSSVar('--ctp-sky'),
      getCSSVar('--ctp-lavender'),
    ],
    gridColor: getCSSVar('--ctp-surface1'),
    axisColor: getCSSVar('--ctp-overlay0'),
    labelColor: getCSSVar('--ctp-subtext0'),
    tooltipBg: getCSSVar('--ctp-surface0'),
    tooltipBorder: getCSSVar('--ctp-surface2'),
    tooltipText: getCSSVar('--ctp-text'),
    base: getCSSVar('--ctp-base'),
    surface0: getCSSVar('--ctp-surface0'),
    surface1: getCSSVar('--ctp-surface1'),
    text: getCSSVar('--ctp-text'),
    fontFamily: getCSSVar('--ctp-font-family') || "'Outfit', sans-serif",
  };
}

export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>(readTheme);

  useEffect(() => {
    // Watch for theme changes via data-theme attribute mutations
    const observer = new MutationObserver(() => {
      // Small timeout to let CSS vars settle after attribute change
      setTimeout(() => {
        setTheme(readTheme());
      }, 50);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Also listen for body theme changes (some implementations set it on body)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}
