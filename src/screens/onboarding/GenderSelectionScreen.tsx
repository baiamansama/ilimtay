import React, { useState } from "react";
import { View, StyleSheet, Animated, Dimensions, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { OnboardingGenderProps } from "../../types/navigation";
import { AVAILABLE_GENDERS } from "../../constants/user";
import { useUser } from "../../contexts/UserContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Button,
  Card,
  H1,
  Body,
  Caption,
  ProgressBar,
  EmojiBadge,
} from "../../components/ui/StyledComponents";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

const GenderSelectionScreen: React.FC<OnboardingGenderProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const { colors, spacing, borderRadius, isDarkMode, animation } = useTheme();
  const { setOnboardingData, onboardingData } = useUser();

  const [selectedGender, setSelectedGender] = useState<"boy" | "girl" | "">(
    onboardingData.gender || ""
  );

  // Animation values
  const [scaleAnimations] = useState(() =>
    AVAILABLE_GENDERS.map(() => new Animated.Value(1))
  );
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // Animate in on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animation.normal,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: animation.normal,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGenderSelect = (gender: "boy" | "girl", index: number) => {
    // Animate the selection
    Animated.sequence([
      Animated.timing(scaleAnimations[index], {
        toValue: 0.95,
        duration: animation.fast / 2,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimations[index], {
        toValue: 1,
        duration: animation.fast / 2,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedGender(gender);
    setOnboardingData({ ...onboardingData, gender });
  };

  const handleContinue = () => {
    if (selectedGender) {
      navigation.navigate("Grade");
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={
        isDarkMode
          ? [colors.background, colors.surface]
          : [colors.playful2, colors.playful3]
      }
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header with back button */}
          <View style={styles.header}>
            <Button
              variant="ghost"
              size="sm"
              onPress={handleBack}
              leftIcon={
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              }
              style={styles.backButton} // e.g. alignSelf
              accessibilityLabel={t("common.back")}
            >
              {t("common.back")}
            </Button>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Caption>
                {t("onboarding.gender.step", { current: 2, total: 3 })}
              </Caption>
              <Caption color={colors.primary} weight="semibold">
                {t("onboarding.gender.progress", { percent: 67 })}
              </Caption>
            </View>
            <ProgressBar progress={0.67} color={colors.primary} />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <H1 align="center" style={styles.title}>
              {t("onboarding.gender.title")}
            </H1>
            <Body
              align="center"
              color={colors.textSecondary}
              style={styles.subtitle}
            >
              {t("onboarding.gender.subtitle")}
            </Body>
          </View>

          {/* Gender Options */}
          <View style={styles.optionsContainer}>
            {AVAILABLE_GENDERS.map((gender, index) => {
              const isSelected = selectedGender === gender.value;

              return (
                <Animated.View
                  key={gender.value}
                  style={[
                    styles.optionWrapper,
                    {
                      transform: [{ scale: scaleAnimations[index] }],
                    },
                  ]}
                >
                  <Card variant={isSelected ? "elevated" : "default"}>
                    <Button
                      variant="ghost"
                      onPress={() => handleGenderSelect(gender.value, index)}
                      style={styles.optionButton}
                    >
                      <View style={styles.optionContent}>
                        <EmojiBadge
                          emoji={gender.emoji}
                          size="lg"
                          backgroundColor={
                            isSelected
                              ? isDarkMode
                                ? colors.primaryLight
                                : colors.primary
                              : colors.surfaceVariant
                          }
                        />
                        <Body
                          weight="semibold"
                          color={isSelected ? colors.primary : colors.text}
                          style={styles.optionLabel}
                        >
                          {t(`onboarding.gender.${gender.value}`)}
                        </Body>
                      </View>
                    </Button>

                    {isSelected && (
                      <View
                        style={[
                          styles.checkmark,
                          { backgroundColor: colors.success },
                        ]}
                      >
                        <Ionicons name="checkmark" size={16} color="white" />
                      </View>
                    )}
                  </Card>
                </Animated.View>
              );
            })}
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              gradient
              disabled={!selectedGender}
              onPress={handleContinue}
              rightIcon={
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={colors.textOnPrimary}
                />
              }
            >
              {t("common.continue")} 🎯
            </Button>
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  progressSection: {
    marginBottom: 32,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleSection: {
    marginBottom: 48,
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
  },
  optionsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  optionWrapper: {
    position: "relative",
  },
  optionCard: {
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  optionButton: {
    padding: 0,
    backgroundColor: "transparent",
  },
  optionContent: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 32,
  },
  optionLabel: {
    marginTop: 16,
    fontSize: 20,
  },
  checkmark: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
});

export default GenderSelectionScreen;
