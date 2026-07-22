const SPACING_MAP: Record<string, string> = {
  xs: "1",
  sm: "2",
  md: "3",
  lg: "4",
  xl: "6",
  xxl: "8",
};

const COLOR_MAP: Record<string, string> = {
  rosewater: "var(--ctp-rosewater)",
  flamingo: "var(--ctp-flamingo)",
  pink: "var(--ctp-pink)",
  mauve: "var(--ctp-mauve)",
  red: "var(--ctp-red)",
  maroon: "var(--ctp-maroon)",
  peach: "var(--ctp-peach)",
  yellow: "var(--ctp-yellow)",
  green: "var(--ctp-green)",
  teal: "var(--ctp-teal)",
  sky: "var(--ctp-sky)",
  sapphire: "var(--ctp-sapphire)",
  blue: "var(--ctp-blue)",
  lavender: "var(--ctp-lavender)",
  text: "var(--ctp-text)",
  subtext0: "var(--ctp-subtext0)",
  subtext1: "var(--ctp-subtext1)",
  overlay0: "var(--ctp-overlay0)",
  overlay1: "var(--ctp-overlay1)",
  overlay2: "var(--ctp-overlay2)",
  surface0: "var(--ctp-surface0)",
  surface1: "var(--ctp-surface1)",
  surface2: "var(--ctp-surface2)",
  base: "var(--ctp-base)",
  mantle: "var(--ctp-mantle)",
  crust: "var(--ctp-crust)",
};

export function mapDesignToken(tokenExpr: string): string | null {
  const trimmed = tokenExpr.trim();

  const spacingMatch = trimmed.match(/^Theme\.spacing\.(\w+)$/);
  if (spacingMatch) {
    const key = spacingMatch[1];
    const mapped = SPACING_MAP[key];
    if (mapped) return mapped;
    return null;
  }

  const colorMatch = trimmed.match(/^Theme\.colors\.(\w+)$/);
  if (colorMatch) {
    const key = colorMatch[1];
    const mapped = COLOR_MAP[key];
    if (mapped) return mapped;
    return null;
  }

  const typographySizeMatch = trimmed.match(/^Theme\.typography\.size(\w+)$/);
  if (typographySizeMatch) {
    const key = typographySizeMatch[1];
    const sizeMap: Record<string, string> = {
      H1: "3xl",
      H2: "2xl",
      H3: "xl",
      H4: "lg",
      H5: "md",
      H6: "sm",
      Xl: "xl",
      Lg: "lg",
      Md: "base",
      Sm: "sm",
      Xs: "xs",
      Body: "base",
    };
    if (sizeMap[key]) return sizeMap[key];
    return null;
  }

  return null;
}

export function mapAllTokens(template: string): string {
  return template.replace(/Theme\.spacing\.(\w+)/g, (_match, key) => {
    const mapped = SPACING_MAP[key];
    return mapped ?? _match;
  }).replace(/Theme\.colors\.(\w+)/g, (_match, key) => {
    const mapped = COLOR_MAP[key];
    return mapped ?? _match;
  }).replace(/Theme\.typography\.size(\w+)/g, (_match, key) => {
    const sizeMap: Record<string, string> = {
      H1: "3xl", H2: "2xl", H3: "xl", H4: "lg", H5: "md", H6: "sm",
      Xl: "xl", Lg: "lg", Md: "base", Sm: "sm", Xs: "xs", Body: "base",
    };
    return sizeMap[key] ?? _match;
  });
}
