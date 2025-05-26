import React, { useEffect, useRef } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  Platform,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

interface ThemeToggleButtonProps {
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  size = "medium",
  showLabel = false,
}) => {
  const { theme, isDarkMode, colors, toggleTheme, animation } = useTheme();

  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const sizeConfig = {
    small: {
      button: 40,
      icon: 20,
      padding: 8,
    },
    medium: {
      button: 48,
      icon: 24,
      padding: 12,
    },
    large: {
      button: 56,
      icon: 28,
      padding: 14,
    },
  }[size];

  const handlePress = () => {
    // Animate the toggle
    Animated.parallel([
      // Rotate animation
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: animation.normal,
        useNativeDriver: true,
      }),
      // Scale animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: animation.fast / 2,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: animation.fast / 2,
          useNativeDriver: true,
        }),
      ]),
      // Fade animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: animation.fast / 2,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animation.fast / 2,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      rotateAnim.setValue(0);
    });

    toggleTheme();
  };

  const getIconName = () => {
    if (theme === "system") {
      return isDarkMode ? "moon" : "sunny";
    }
    return theme === "dark" ? "moon" : "sunny";
  };

  const getIconColor = () => {
    if (isDarkMode) {
      return colors.accent; // Moon color (yellow/amber)
    }
    return colors.warning; // Sun color (yellow/orange)
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.button,
          {
            width: sizeConfig.button,
            height: sizeConfig.button,
            backgroundColor: colors.surfaceVariant,
            transform: [{ scale: scaleAnim }, { rotate: rotation }],
            opacity: fadeAnim,
            ...Platform.select({
              ios: {
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              },
              android: {
                elevation: 3,
              },
            }),
          },
        ]}
      >
        <Ionicons
          name={getIconName()}
          size={sizeConfig.icon}
          color={getIconColor()}
        />

        {/* System indicator */}
        {theme === "system" && (
          <View
            style={[
              styles.systemIndicator,
              {
                backgroundColor: colors.primary,
              },
            ]}
          />
        )}
      </Animated.View>

      {showLabel && (
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.label,
              {
                color: colors.textSecondary,
                fontSize: size === "small" ? 10 : 12,
              },
            ]}
          >
            {theme === "system" ? "Auto" : theme === "dark" ? "Dark" : "Light"}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  button: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  systemIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  labelContainer: {
    marginTop: 4,
  },
  label: {
    fontWeight: "500",
  },
});

export default ThemeToggleButton;
