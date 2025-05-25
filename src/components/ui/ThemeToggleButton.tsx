import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface ThemeToggleButtonProps {
  style?: string;
  showLabel?: boolean;
  size?: "small" | "medium" | "large";
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  style = "",
  showLabel = false,
  size = "medium",
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const sizeClasses = {
    small: "w-10 h-10",
    medium: "w-12 h-12",
    large: "w-14 h-14",
  };

  const iconSizes = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl",
  };

  return (
    <View className={`items-center ${style}`}>
      <TouchableOpacity
        onPress={toggleTheme}
        className={`${
          sizeClasses[size]
        } rounded-full items-center justify-center shadow-lg border-2 ${
          isDarkMode
            ? "bg-gray-800 border-gray-600"
            : "bg-white border-gray-200"
        }`}
        activeOpacity={0.7}
      >
        <View className="relative">
          {/* Sun/Moon Icon with smooth transition effect */}
          <Text
            className={`${iconSizes[size]} ${
              isDarkMode ? "opacity-0" : "opacity-100"
            } absolute`}
          >
            ☀️
          </Text>
          <Text
            className={`${iconSizes[size]} ${
              isDarkMode ? "opacity-100" : "opacity-0"
            }`}
          >
            🌙
          </Text>
        </View>
      </TouchableOpacity>

      {showLabel && (
        <Text
          className={`text-xs mt-1 font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {isDarkMode ? "Dark" : "Light"}
        </Text>
      )}
    </View>
  );
};

export default ThemeToggleButton;
