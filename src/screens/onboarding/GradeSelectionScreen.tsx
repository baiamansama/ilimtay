import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { OnboardingGradeProps } from "../../types/navigation";
import { AVAILABLE_GRADES } from "../../constants/user";
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

const GradeSelectionScreen: React.FC<OnboardingGradeProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const { colors, spacing, borderRadius, isDarkMode, animation } = useTheme();
  const {
    setOnboardingData,
    onboardingData,
    updateUserProfile,
    clearOnboardingData,
  } = useUser();

  const [selectedGrade, setSelectedGrade] = useState<number | null>(
    onboardingData.grade || null
  );
  const [loading, setLoading] = useState(false);

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnimations] = useState(() =>
    AVAILABLE_GRADES.map(() => new Animated.Value(1))
  );

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

  const handleGradeSelect = (grade: number, index: number) => {
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

    setSelectedGrade(grade);
    setOnboardingData({ ...onboardingData, grade });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFinish = async () => {
    if (selectedGrade && onboardingData.language && onboardingData.gender) {
      try {
        setLoading(true);

        // Update user profile with all onboarding data
        await updateUserProfile({
          language: onboardingData.language,
          gender: onboardingData.gender,
          grade: selectedGrade,
        });

        // Clear onboarding data
        clearOnboardingData();

        // Show success message
        Alert.alert(
          t("onboarding.complete.title", { defaultValue: "Welcome! 🎉" }),
          t("onboarding.complete.message", {
            defaultValue: "Your profile is ready! Let's start learning!",
          }),
          [
            {
              text: t("onboarding.complete.button", {
                defaultValue: "Let's Go! 🚀",
              }),
              onPress: () => {},
            },
          ]
        );

        // The navigation will be handled by App.tsx based on profile completion
      } catch (error) {
        Alert.alert(
          t("common.error", { defaultValue: "Error" }),
          t("common.errorMessage", {
            defaultValue: "Something went wrong. Please try again.",
          })
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const getGradeEmoji = (grade: number) => {
    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];
    return emojis[grade - 1] || "📚";
  };

  return (
    <LinearGradient
      colors={
        isDarkMode
          ? [colors.background, colors.surface]
          : [colors.playful4, colors.playful5]
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
              style={styles.backButton}
            >
              {t("common.back")}
            </Button>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Caption>
                {t("onboarding.grade.step", { current: 3, total: 3 })}
              </Caption>
              <Caption color={colors.primary} weight="semibold">
                {t("onboarding.grade.progress", { percent: 100 })}
              </Caption>
            </View>
            <ProgressBar progress={1.0} color={colors.primary} />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <H1 align="center" style={styles.title}>
              {t("onboarding.grade.title")} 📚
            </H1>
            <Body
              align="center"
              color={colors.textSecondary}
              style={styles.subtitle}
            >
              {t("onboarding.grade.subtitle")}
            </Body>
          </View>

          {/* Grade Options */}
          <View style={styles.optionsContainer}>
            <View style={styles.gradeGrid}>
              {AVAILABLE_GRADES.map((grade, index) => {
                const isSelected = selectedGrade === grade;
                return (
                  <Animated.View
                    key={grade}
                    style={[
                      styles.gradeOptionWrapper,
                      {
                        transform: [{ scale: scaleAnimations[index] }],
                      },
                    ]}
                  >
                    <Card variant={isSelected ? "elevated" : "default"}>
                      <Button
                        variant="ghost"
                        onPress={() => handleGradeSelect(grade, index)}
                        style={styles.gradeOptionButton}
                      >
                        <View style={styles.gradeOptionContent}>
                          <Body style={styles.gradeEmoji}>
                            {getGradeEmoji(grade)}
                          </Body>
                          <Caption
                            weight="semibold"
                            color={isSelected ? colors.primary : colors.text}
                            style={styles.gradeLabel}
                          >
                            {t("onboarding.grade.grade", { number: grade })}
                          </Caption>
                        </View>
                      </Button>

                      {isSelected && (
                        <View
                          style={[
                            styles.checkmark,
                            { backgroundColor: colors.success },
                          ]}
                        >
                          <Ionicons name="checkmark" size={14} color="white" />
                        </View>
                      )}
                    </Card>
                  </Animated.View>
                );
              })}
            </View>
          </View>

          {/* Finish Button */}
          <View style={styles.buttonContainer}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              gradient
              disabled={!selectedGrade || loading}
              onPress={handleFinish}
              rightIcon={
                !loading ? (
                  <Ionicons
                    name="rocket"
                    size={20}
                    color={colors.textOnPrimary}
                  />
                ) : undefined
              }
            >
              {loading
                ? t("onboarding.grade.loading", {
                    defaultValue: "Setting up your profile...",
                  })
                : t("onboarding.grade.finish", {
                    defaultValue: "Let's Start Learning! 🌟",
                  })}
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
    marginBottom: 32,
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  gradeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  gradeOptionWrapper: {
    position: "relative",
  },
  gradeOptionCard: {
    position: "relative",
    width: 90,
    height: 90,
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
  gradeOptionButton: {
    padding: 0,
    backgroundColor: "transparent",
    flex: 1,
  },
  gradeOptionContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  gradeEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  gradeLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  checkmark: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
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

export default GradeSelectionScreen;
