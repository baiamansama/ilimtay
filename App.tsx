import React, { useEffect } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  Theme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { I18nextProvider } from "react-i18next";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

// Import providers
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { UserProvider, useUser } from "./src/contexts/UserContext";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";
import { LanguageProvider } from "./src/contexts/LanguageContext";

// Import i18n configuration
import i18n from "./src/config/i18n";

// Import screens
import LoginScreen from "./src/screens/auth/LoginScreen";
import SignupScreen from "./src/screens/auth/SignupScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ProfileScreen from "./src/screens/profile/ProfileScreen";
import ProfileEditScreen from "./src/screens/profile/ProfileEditScreen";

// Onboarding Screens
import LanguageSelectionScreen from "./src/screens/onboarding/LanguageSelectionScreen";
import GenderSelectionScreen from "./src/screens/onboarding/GenderSelectionScreen";
import GradeSelectionScreen from "./src/screens/onboarding/GradeSelectionScreen";

// Math Screens
import MathSubjectScreen from "./src/screens/math/MathSubjectScreen";
import MathTopicScreen from "./src/screens/math/MathTopicScreen";
import MathExerciseScreen from "./src/screens/math/MathExerciseScreen";

// Vocabulary Screens
import VocabularySubjectScreen from "./src/screens/vocabulary/VocabularySubjectScreen";
import VocabularyLevelScreen from "./src/screens/vocabulary/VocabularyLevelScreen";
import VocabularyExerciseScreen from "./src/screens/vocabulary/VocabularyExerciseScreen";

// Navigation Types
import {
  AuthStackParamList,
  AppStackParamList,
  OnboardingStackParamList,
} from "./src/types/navigation";

// Prevent auto-hiding the splash screen
SplashScreen.preventAutoHideAsync();

// Create Stack Navigators
const AuthStack = createStackNavigator<AuthStackParamList>();
const OnboardingStack = createStackNavigator<OnboardingStackParamList>();
const AppStack = createStackNavigator<AppStackParamList>();

// Custom fonts for better kid-friendly UI
const customFonts = {
  "Quicksand-Regular": require("./assets/fonts/Quicksand-Regular.ttf"),
  "Quicksand-Medium": require("./assets/fonts/Quicksand-Medium.ttf"),
  "Quicksand-SemiBold": require("./assets/fonts/Quicksand-SemiBold.ttf"),
  "Quicksand-Bold": require("./assets/fonts/Quicksand-Bold.ttf"),
  "ComicNeue-Regular": require("./assets/fonts/ComicNeue-Regular.ttf"),
  "ComicNeue-Bold": require("./assets/fonts/ComicNeue-Bold.ttf"),
};

// Stack Navigator Components
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
            opacity: current.progress.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.5, 1],
            }),
          },
        }),
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function OnboardingStackNavigator() {
  return (
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, next, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
              {
                scale: next
                  ? next.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.9],
                    })
                  : 1,
              },
            ],
          },
        }),
      }}
    >
      <OnboardingStack.Screen
        name="Language"
        component={LanguageSelectionScreen}
      />
      <OnboardingStack.Screen name="Gender" component={GenderSelectionScreen} />
      <OnboardingStack.Screen name="Grade" component={GradeSelectionScreen} />
    </OnboardingStack.Navigator>
  );
}

function AppStackNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateY: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.height * 0.3, 0],
                }),
              },
            ],
            opacity: current.progress.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.5, 1],
            }),
          },
        }),
      }}
    >
      <AppStack.Screen name="Dashboard" component={DashboardScreen} />
      <AppStack.Screen name="Profile" component={ProfileScreen} />
      <AppStack.Screen name="ProfileEdit" component={ProfileEditScreen} />

      {/* Math Screens */}
      <AppStack.Screen name="MathSubject" component={MathSubjectScreen} />
      <AppStack.Screen name="MathTopic" component={MathTopicScreen} />
      <AppStack.Screen name="MathExercise" component={MathExerciseScreen} />

      {/* Vocabulary Screens */}
      <AppStack.Screen
        name="VocabularySubject"
        component={VocabularySubjectScreen}
      />
      <AppStack.Screen
        name="VocabularyLevel"
        component={VocabularyLevelScreen}
      />
      <AppStack.Screen
        name="VocabularyExercise"
        component={VocabularyExerciseScreen}
      />
    </AppStack.Navigator>
  );
}

// App Content with Navigation
function AppContent() {
  const { currentUser, loading: authLoading } = useAuth();
  const { isProfileComplete, loading: userLoading } = useUser();
  const { colors, isDarkMode } = useTheme();

  // Create custom navigation themes
  const lightTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };

  const darkTheme: Theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };

  // Hide splash screen when ready
  useEffect(() => {
    if (!authLoading && (!currentUser || !userLoading)) {
      SplashScreen.hideAsync();
    }
  }, [authLoading, currentUser, userLoading]);

  if (authLoading || (currentUser && userLoading)) {
    return null; // Splash screen is still visible
  }

  return (
    <NavigationContainer theme={isDarkMode ? darkTheme : lightTheme}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      {!currentUser ? (
        <AuthStackNavigator />
      ) : !isProfileComplete ? (
        <OnboardingStackNavigator />
      ) : (
        <AppStackNavigator />
      )}
    </NavigationContainer>
  );
}

// Main App Component
export default function App() {
  const [fontsLoaded] = useFonts(customFonts);

  // Don't render anything until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <UserProvider>
                <AppContent />
              </UserProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}
