// Santander brand theme — basta trocar a seed pra outra marca
import { ThemeData } from "@mocha/tokens";

export const santanderDark = ThemeData.brand("#ee0000", true, {
  typography: {
    family: "Inter",
  },
});

export const santanderLight = santanderDark.copyWith({
  colorScheme: {
    background: "#ffffff",
    surface: "#f5f5f5",
    onSurface: "#1a1a1a",
    onBackground: "#1a1a1a",
    primary: "#ee0000",
    onPrimary: "#ffffff",
    outline: "#e0e0e0",
    outlineVariant: "#f0f0f0",
    surfaceVariant: "#eeeeee",
    onSurfaceVariant: "#666666",
  },
});
