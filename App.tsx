import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { UserProvider, useUser } from "./src/contexts/UserContext";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";

// Screen Imports
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

// Create Stack Navigators
const AuthStack = createStackNavigator<AuthStackParamList>();
const OnboardingStack = createStackNavigator<OnboardingStackParamList>();
const AppStack = createStackNavigator<AppStackParamList>();

// Navigators
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function OnboardingStackNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
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
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
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

// App Content Logic (with Theme)
function AppContent() {
  const { currentUser, loading: authLoading } = useAuth();
  const { isProfileComplete, loading: userLoading } = useUser();
  const { theme } = useTheme(); // light | dark

  // Optional: Add a loading indicator while auth and user profile are being checked
  if (authLoading || (currentUser && userLoading)) {
    // You can add a custom loading indicator here
    return null;
  }

  // Choose navigation theme based on current theme
  const navigationTheme = theme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
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

// Main App Component (with Providers)
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <AppContent />
          {/* StatusBar color will auto-adjust if you set it to "auto" */}
          <StatusBar style="auto" />
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
