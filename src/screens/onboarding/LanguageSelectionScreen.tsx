import React, { useState } from "react";
import { View, StyleSheet, Animated, Dimensions, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { OnboardingLanguageProps } from "../../types/navigation";
import { AVAILABLE_LANGUAGES } from "../../constants/user";
import { Language } from "../../types/user";
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

const LanguageSelectionScreen: React.FC<OnboardingLanguageProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const { colors, spacing, borderRadius, isDarkMode, animation } = useTheme();
  const { setOnboardingData, onboardingData } = useUser();

  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    onboardingData.language || ""
  );

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnimations] = useState(() =>
    AVAILABLE_LANGUAGES.map(() => new Animated.Value(1))
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

  const handleLanguageSelect = (language: Language, index: number) => {
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

    setSelectedLanguage(language.code);
    setOnboardingData({ ...onboardingData, language: language.code });
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      navigation.navigate("Gender");
    }
  };

  return (
    <LinearGradient
      colors={
        isDarkMode
          ? [colors.background, colors.surface]
          : [colors.playful2, colors.playful1]
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
          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Caption>
                {t("onboarding.language.step", { current: 1, total: 3 })}
              </Caption>
              <Caption color={colors.primary} weight="semibold">
                {t("onboarding.language.progress", { percent: 33 })}
              </Caption>
            </View>
            <ProgressBar progress={0.33} color={colors.primary} />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <H1 align="center" style={styles.title}>
              {t("onboarding.language.title")} 🌍
            </H1>
            <Body
              align="center"
              color={colors.textSecondary}
              style={styles.subtitle}
            >
              {t("onboarding.language.subtitle")}
            </Body>
          </View>

          {/* Language Options */}
          <View style={styles.optionsContainer}>
            {AVAILABLE_LANGUAGES.map((language, index) => {
              const isSelected = selectedLanguage === language.code;

              return (
                <Animated.View
                  key={language.code}
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
                      onPress={() => handleLanguageSelect(language, index)}
                      style={styles.optionButton}
                    >
                      <View style={styles.optionContent}>
                        <View style={styles.flagContainer}>
                          <Body style={styles.flag}>{language.flag}</Body>
                        </View>
                        <View style={styles.languageInfo}>
                          <Body
                            weight="semibold"
                            color={isSelected ? colors.primary : colors.text}
                            style={styles.nativeName}
                          >
                            {language.nativeName}
                          </Body>
                          <Caption
                            color={colors.textSecondary}
                            style={styles.englishName}
                          >
                            {language.name}
                          </Caption>
                        </View>
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

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              gradient
              disabled={!selectedLanguage}
              onPress={handleContinue}
              rightIcon={
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={colors.textOnPrimary}
                />
              }
            >
              {t("common.continue")} 🚀
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
    paddingTop: 16,
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
    paddingBottom: 16,
  },
  optionWrapper: {
    marginBottom: 16,
  },
  optionCard: {
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  optionButton: {
    padding: 0,
    backgroundColor: "transparent",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  flagContainer: {
    marginRight: 16,
  },
  flag: {
    fontSize: 32,
  },
  languageInfo: {
    flex: 1,
  },
  nativeName: {
    fontSize: 18,
    marginBottom: 2,
  },
  englishName: {
    fontSize: 14,
  },
  checkmark: {
    position: "absolute",
    top: -6,
    right: -6,
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
    marginTop: 24,
    marginBottom: 24,
  },
});

export default LanguageSelectionScreen;
