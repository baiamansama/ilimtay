import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { UserProvider, useUser } from "./src/contexts/UserContext";

// Screen Imports
import LoginScreen from "./src/screens/auth/LoginScreen";
import SignupScreen from "./src/screens/auth/SignupScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ProfileScreen from "./src/screens/profile/ProfileScreen"; // Added
import ProfileEditScreen from "./src/screens/profile/ProfileEditScreen"; // Added

// Onboarding Screens
import LanguageSelectionScreen from "./src/screens/onboarding/LanguageSelectionScreen";
import GenderSelectionScreen from "./src/screens/onboarding/GenderSelectionScreen";
import GradeSelectionScreen from "./src/screens/onboarding/GradeSelectionScreen";

// Math Screens
import MathSubjectScreen from "./src/screens/math/MathSubjectScreen";
import MathTopicScreen from "./src/screens/math/MathTopicScreen";
import MathExerciseScreen from "./src/screens/math/MathExerciseScreen";

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

      {/* Placeholder screens for other subjects - you'll need to create these and import them */}
      {/* e.g.
      <AppStack.Screen name="ReadingSubject" component={ReadingSubjectScreen} />
      <AppStack.Screen name="ScienceSubject" component={ScienceSubjectScreen} />
      <AppStack.Screen name="WritingSubject" component={WritingSubjectScreen} />
      <AppStack.Screen name="VocabularySubject" component={VocabularySubjectScreen} />
      */}
    </AppStack.Navigator>
  );
}

// App Content Logic
function AppContent() {
  const { currentUser, loading: authLoading } = useAuth(); // Added authLoading
  const { isProfileComplete, loading: userLoading } = useUser(); // Added userLoading

  // Optional: Add a loading indicator while auth and user profile are being checked
  if (authLoading || (currentUser && userLoading)) {
    // You might want a more sophisticated loading screen here
    return null; // Or <ActivityIndicator size="large" />;
  }

  return (
    <NavigationContainer>
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
  return (
    <AuthProvider>
      <UserProvider>
        <AppContent />
        <StatusBar style="auto" />
      </UserProvider>
    </AuthProvider>
  );
}
