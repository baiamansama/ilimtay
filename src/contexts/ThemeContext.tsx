import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, useColorScheme } from "react-native";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Background colors
  background: string;
  surface: string;
  surfaceVariant: string;
  elevated: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textOnPrimary: string;
  textOnSecondary: string;

  // Accent colors
  accent: string;
  accentLight: string;
  accentDark: string;

  // Status colors
  success: string;
  successLight: string;
  successDark: string;

  warning: string;
  warningLight: string;
  warningDark: string;

  error: string;
  errorLight: string;
  errorDark: string;

  info: string;
  infoLight: string;
  infoDark: string;

  // UI elements
  border: string;
  borderLight: string;
  divider: string;

  // Interactive states
  disabled: string;
  disabledText: string;
  placeholder: string;

  // Shadows
  shadow: string;
  shadowLight: string;

  // Special colors for kids
  playful1: string;
  playful2: string;
  playful3: string;
  playful4: string;
  playful5: string;
}

interface ThemeContextType {
  theme: ThemeMode;
  isDarkMode: boolean;
  colors: ThemeColors;
  setTheme: (theme: ThemeMode) => Promise<void>;
  toggleTheme: () => void;
  spacing: typeof spacing;
  typography: typeof typography;
  borderRadius: typeof borderRadius;
  animation: typeof animation;
}

// Kid-friendly color palettes
const lightColors: ThemeColors = {
  // Primary colors
  primary: "#4F46E5",
  primaryLight: "#818CF8",
  primaryDark: "#3730A3",

  // Secondary colors
  secondary: "#06B6D4",
  secondaryLight: "#67E8F9",
  secondaryDark: "#0891B2",

  // Background colors
  background: "#F9FAFB",
  surface: "#FFFFFF",
  surfaceVariant: "#F3F4F6",
  elevated: "#FFFFFF",

  // Text colors
  text: "#111827",
  textSecondary: "#4B5563",
  textTertiary: "#6B7280",
  textOnPrimary: "#FFFFFF",
  textOnSecondary: "#FFFFFF",

  // Accent colors
  accent: "#F59E0B",
  accentLight: "#FCD34D",
  accentDark: "#D97706",

  // Status colors
  success: "#10B981",
  successLight: "#34D399",
  successDark: "#059669",

  warning: "#F59E0B",
  warningLight: "#FCD34D",
  warningDark: "#D97706",

  error: "#EF4444",
  errorLight: "#F87171",
  errorDark: "#DC2626",

  info: "#3B82F6",
  infoLight: "#60A5FA",
  infoDark: "#2563EB",

  // UI elements
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  divider: "#E5E7EB",

  // Interactive states
  disabled: "#E5E7EB",
  disabledText: "#9CA3AF",
  placeholder: "#9CA3AF",

  // Shadows
  shadow: "rgba(0, 0, 0, 0.1)",
  shadowLight: "rgba(0, 0, 0, 0.05)",

  // Special colors for kids
  playful1: "#EC4899",
  playful2: "#8B5CF6",
  playful3: "#14B8A6",
  playful4: "#F97316",
  playful5: "#84CC16",
};

const darkColors: ThemeColors = {
  // Primary colors
  primary: "#818CF8",
  primaryLight: "#A5B4FC",
  primaryDark: "#6366F1",

  // Secondary colors
  secondary: "#22D3EE",
  secondaryLight: "#67E8F9",
  secondaryDark: "#06B6D4",

  // Background colors
  background: "#111827",
  surface: "#1F2937",
  surfaceVariant: "#374151",
  elevated: "#374151",

  // Text colors
  text: "#F9FAFB",
  textSecondary: "#D1D5DB",
  textTertiary: "#9CA3AF",
  textOnPrimary: "#111827",
  textOnSecondary: "#111827",

  // Accent colors
  accent: "#FCD34D",
  accentLight: "#FDE68A",
  accentDark: "#F59E0B",

  // Status colors
  success: "#34D399",
  successLight: "#6EE7B7",
  successDark: "#10B981",

  warning: "#FCD34D",
  warningLight: "#FDE68A",
  warningDark: "#F59E0B",

  error: "#F87171",
  errorLight: "#FCA5A5",
  errorDark: "#EF4444",

  info: "#60A5FA",
  infoLight: "#93BBFC",
  infoDark: "#3B82F6",

  // UI elements
  border: "#374151",
  borderLight: "#4B5563",
  divider: "#374151",

  // Interactive states
  disabled: "#4B5563",
  disabledText: "#6B7280",
  placeholder: "#6B7280",

  // Shadows
  shadow: "rgba(0, 0, 0, 0.3)",
  shadowLight: "rgba(0, 0, 0, 0.2)",

  // Special colors for kids
  playful1: "#F472B6",
  playful2: "#A78BFA",
  playful3: "#2DD4BF",
  playful4: "#FB923C",
  playful5: "#A3E635",
};

// Spacing system
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Typography system
const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
  },

  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Border radius system
const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  full: 9999,
} as const;

// Animation durations
const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
} as const;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = "@app_theme_mode";

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadSavedTheme();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(() => {
      if (theme === "system") {
        setThemeState("system");
      }
    });

    return () => subscription?.remove();
  }, [theme]);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        setThemeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error("Error loading saved theme:", error);
    } finally {
      setIsReady(true);
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme(isDarkMode ? "light" : "dark");
    } else {
      setTheme(theme === "light" ? "dark" : "light");
    }
  };

  const isDarkMode = useMemo(() => {
    if (theme === "system") {
      return systemColorScheme === "dark";
    }
    return theme === "dark";
  }, [theme, systemColorScheme]);

  const colors = useMemo(() => {
    return isDarkMode ? darkColors : lightColors;
  }, [isDarkMode]);

  const value: ThemeContextType = useMemo(
    () => ({
      theme,
      isDarkMode,
      colors,
      setTheme,
      toggleTheme,
      spacing,
      typography,
      borderRadius,
      animation,
    }),
    [theme, isDarkMode, colors]
  );

  if (!isReady) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
