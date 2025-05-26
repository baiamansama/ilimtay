import React, { ReactNode } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  ActivityIndicator,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ColorValue } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

// ============ Card Component ============
interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = "default",
  padding = "md",
}) => {
  const { colors, spacing, borderRadius, isDarkMode } = useTheme();

  const paddingValue = {
    none: 0,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
  }[padding];

  const variantStyles: ViewStyle = {
    default: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    elevated: {
      backgroundColor: colors.elevated,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    outlined: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: colors.border,
    },
  }[variant];

  return (
    <View
      style={[
        {
          borderRadius: borderRadius.lg,
          padding: paddingValue,
        },
        variantStyles,
        style,
      ]}
    >
      {children}
    </View>
  );
};

// ============ Button Component ============
interface ButtonProps extends TouchableOpacityProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  gradient?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  gradient = false,
  style,
  disabled,
  ...props
}) => {
  const { colors, spacing, borderRadius, typography } = useTheme();

  const sizeStyles = {
    sm: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      fontSize: typography.fontSize.sm,
    },
    md: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      fontSize: typography.fontSize.base,
    },
    lg: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      fontSize: typography.fontSize.lg,
    },
  }[size];

  // ✅ Use proper [light, dark] arrays from your palette
  const variantColors = {
    primary: {
      background: colors.primary,
      text: colors.textOnPrimary,
      gradient: [colors.primaryLight, colors.primaryDark],
    },
    secondary: {
      background: colors.secondary,
      text: colors.textOnSecondary,
      gradient: [colors.secondaryLight, colors.secondaryDark],
    },
    accent: {
      background: colors.accent,
      text: colors.textOnPrimary,
      gradient: [colors.accentLight, colors.accentDark],
    },
    ghost: {
      background: "transparent",
      text: colors.primary,
      gradient: ["transparent", "transparent"],
    },
    danger: {
      background: colors.error,
      text: colors.textOnPrimary,
      gradient: [colors.errorLight, colors.errorDark],
    },
  }[variant];

  const isDisabled = disabled || loading;

  const buttonContent = (
    <View style={styles.buttonContent}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantColors.text}
          style={styles.loader}
        />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text
            style={[
              styles.buttonText,
              {
                color: isDisabled ? colors.disabledText : variantColors.text,
                fontSize: sizeStyles.fontSize,
                fontWeight: typography.fontWeight.semibold,
              },
            ]}
          >
            {children}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </View>
  );

  const buttonStyle: ViewStyle = {
    paddingVertical: sizeStyles.paddingVertical,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    opacity: isDisabled ? 0.6 : 1,
    ...(fullWidth && { width: "100%" }),
    ...(variant === "ghost" && {
      borderWidth: 2,
      borderColor: isDisabled ? colors.disabled : colors.primary,
    }),
  };

  if (gradient && variant !== "ghost") {
    return (
      <TouchableOpacity
        style={[buttonStyle, style]}
        disabled={isDisabled}
        activeOpacity={0.8}
        {...props}
      >
        <LinearGradient
          colors={variantColors.gradient as [ColorValue, ColorValue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            StyleSheet.absoluteFillObject,
            { borderRadius: borderRadius.lg },
          ]}
        />
        {buttonContent}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        {
          backgroundColor:
            variant === "ghost"
              ? "transparent"
              : isDisabled
              ? colors.disabled
              : variantColors.background,
        },
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {buttonContent}
    </TouchableOpacity>
  );
};

// ============ Typography Components ============
interface TypographyProps {
  children: ReactNode;
  style?: TextStyle;
  color?: string;
  align?: "left" | "center" | "right";
  weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
}

export const H1: React.FC<TypographyProps> = ({
  children,
  style,
  color,
  align = "left",
  weight = "bold",
}) => {
  const { colors, typography } = useTheme();
  return (
    <Text
      style={[
        {
          fontSize: typography.fontSize["4xl"],
          fontWeight: typography.fontWeight[weight],
          color: color || colors.text,
          textAlign: align,
          marginBottom: 8,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const H2: React.FC<TypographyProps> = ({
  children,
  style,
  color,
  align = "left",
  weight = "bold",
}) => {
  const { colors, typography } = useTheme();
  return (
    <Text
      style={[
        {
          fontSize: typography.fontSize["3xl"],
          fontWeight: typography.fontWeight[weight],
          color: color || colors.text,
          textAlign: align,
          marginBottom: 6,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const H3: React.FC<TypographyProps> = ({
  children,
  style,
  color,
  align = "left",
  weight = "semibold",
}) => {
  const { colors, typography } = useTheme();
  return (
    <Text
      style={[
        {
          fontSize: typography.fontSize["2xl"],
          fontWeight: typography.fontWeight[weight],
          color: color || colors.text,
          textAlign: align,
          marginBottom: 4,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const Body: React.FC<TypographyProps> = ({
  children,
  style,
  color,
  align = "left",
  weight = "normal",
}) => {
  const { colors, typography } = useTheme();
  return (
    <Text
      style={[
        {
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight[weight],
          color: color || colors.text,
          textAlign: align,
          lineHeight: typography.fontSize.base * typography.lineHeight.normal,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const Caption: React.FC<TypographyProps> = ({
  children,
  style,
  color,
  align = "left",
  weight = "normal",
}) => {
  const { colors, typography } = useTheme();
  return (
    <Text
      style={[
        {
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight[weight],
          color: color || colors.textSecondary,
          textAlign: align,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

// ============ Progress Bar Component ============
interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color,
  backgroundColor,
  animated = true,
  showPercentage = false,
}) => {
  const { colors, borderRadius } = useTheme();
  const percentage = Math.round(progress * 100);

  return (
    <View>
      <View
        style={{
          height,
          backgroundColor: backgroundColor || colors.disabled,
          borderRadius: borderRadius.full,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${percentage}%`,
            backgroundColor: color || colors.primary,
            borderRadius: borderRadius.full,
          }}
        />
      </View>
      {showPercentage && (
        <Caption style={{ textAlign: "center", marginTop: 4 }}>
          {percentage}%
        </Caption>
      )}
    </View>
  );
};

// ============ Divider Component ============
interface DividerProps {
  style?: ViewStyle;
  color?: string;
  thickness?: number;
  spacing?: "none" | "sm" | "md" | "lg";
}

export const Divider: React.FC<DividerProps> = ({
  style,
  color,
  thickness = 1,
  spacing = "md",
}) => {
  const { colors, spacing: themeSpacing } = useTheme();

  const marginValue = {
    none: 0,
    sm: themeSpacing.sm,
    md: themeSpacing.md,
    lg: themeSpacing.lg,
  }[spacing];

  return (
    <View
      style={[
        {
          height: thickness,
          backgroundColor: color || colors.divider,
          marginVertical: marginValue,
        },
        style,
      ]}
    />
  );
};

// ============ Emoji Badge Component ============
interface EmojiBadgeProps {
  emoji: string;
  size?: "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
  style?: ViewStyle;
}

export const EmojiBadge: React.FC<EmojiBadgeProps> = ({
  emoji,
  size = "md",
  backgroundColor,
  style,
}) => {
  const { colors, borderRadius } = useTheme();

  const sizeStyles = {
    sm: { width: 40, height: 40, fontSize: 20 },
    md: { width: 60, height: 60, fontSize: 30 },
    lg: { width: 80, height: 80, fontSize: 40 },
    xl: { width: 100, height: 100, fontSize: 50 },
  }[size];

  return (
    <View
      style={[
        {
          width: sizeStyles.width,
          height: sizeStyles.height,
          borderRadius: borderRadius.full,
          backgroundColor: backgroundColor || colors.surfaceVariant,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text style={{ fontSize: sizeStyles.fontSize }}>{emoji}</Text>
    </View>
  );
};

// ============ Styles ============
const styles = StyleSheet.create({
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  loader: {
    marginRight: 0,
  },
});
