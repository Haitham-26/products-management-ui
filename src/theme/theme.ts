export const theme = {
  colors: {
    background: "#f9fbfd",
    surface: "#ffffff",

    primary: "#4da3ff",
    primaryHover: "#2f8cff",
    onPrimary: "#f3f3f3",

    textPrimary: "#0f172a",
    textSecondary: "#64748b",

    border: "#e5e7eb",

    info: "#3b82f6",
    error: "#ef4444",
    warning: "#fbbf24",
    success: "#22c55e",

    pending: "#fbbf24",
    delivered: "#22c55e",
    canceled: "#ef4444",

    glassBackground: "rgba(255, 255, 255, 0.6)",
    glassBorder: "rgba(255, 255, 255, 0.4)",
  },
  glass: {
    blur: "12px",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },

  radius: {
    sm: "0.375rem",
    md: "0.625rem",
    lg: "1rem",
    full: "50rem",
  },
  typography: {
    title: "clamp(1.375rem, 1.25rem + 0.6vw, 1.75rem)",
    subtitle: "clamp(1.125rem, 1.05rem + 0.4vw, 1.25rem)",
    body: "clamp(0.875rem, 0.84rem + 0.25vw, 1rem)",
    small: "clamp(0.75rem, 0.72rem + 0.2vw, 0.875rem)",
  },
  shadow: {
    sm: "0 4px 12px rgba(0,0,0,0.05)",
    md: "0 8px 24px rgba(0,0,0,0.08)",
  },
} as const;

export type ThemeType = typeof theme;
