import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, ColorSchemeName } from "react-native";

export type ThemeType = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeType;
  isDarkMode: boolean;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  colors: {
    // Background colors
    background: string;
    surface: string;
    surfaceVariant: string;

    // Text colors
    text: string;
    textSecondary: string;
    textTertiary: string;

    // Interactive colors
    primary: string;
    primaryVariant: string;
    secondary: string;

    // Status colors
    success: string;
    warning: string;
    error: string;

    // Border and divider
    border: string;
    divider: string;

    // Card colors
    card: string;
    cardHeader: string;

    // Navigation
    tabBarBackground: string;
    tabBarActive: string;
    tabBarInactive: string;
  };
}

const lightColors = {
  background: "bg-gray-50",
  surface: "bg-white",
  surfaceVariant: "bg-gray-100",

  text: "text-gray-800",
  textSecondary: "text-gray-600",
  textTertiary: "text-gray-500",

  primary: "bg-blue-500",
  primaryVariant: "bg-blue-600",
  secondary: "bg-gray-200",

  success: "text-green-600",
  warning: "text-yellow-600",
  error: "text-red-600",

  border: "border-gray-200",
  divider: "bg-gray-200",

  card: "bg-white",
  cardHeader: "bg-white",

  tabBarBackground: "bg-white",
  tabBarActive: "text-blue-600",
  tabBarInactive: "text-gray-400",
};

const darkColors = {
  background: "bg-gray-900",
  surface: "bg-gray-800",
  surfaceVariant: "bg-gray-700",

  text: "text-gray-100",
  textSecondary: "text-gray-300",
  textTertiary: "text-gray-400",

  primary: "bg-blue-600",
  primaryVariant: "bg-blue-700",
  secondary: "bg-gray-700",

  success: "text-green-400",
  warning: "text-yellow-400",
  error: "text-red-400",

  border: "border-gray-600",
  divider: "bg-gray-600",

  card: "bg-gray-800",
  cardHeader: "bg-gray-750",

  tabBarBackground: "bg-gray-800",
  tabBarActive: "text-blue-400",
  tabBarInactive: "text-gray-500",
};

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

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>("system");
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // Load saved theme on startup
  useEffect(() => {
    loadSavedTheme();
  }, []);

  // Listen to system color scheme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("app_theme");
      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        setThemeState(savedTheme as ThemeType);
      }
    } catch (error) {
      console.error("Error loading saved theme:", error);
    }
  };

  const setTheme = async (newTheme: ThemeType) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem("app_theme", newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setTheme(newTheme);
  };

  // Determine if dark mode should be active
  const isDarkMode =
    theme === "dark" || (theme === "system" && systemColorScheme === "dark");

  // Get current colors based on theme
  const colors = isDarkMode ? darkColors : lightColors;

  const value: ThemeContextType = {
    theme,
    isDarkMode,
    setTheme,
    toggleTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
