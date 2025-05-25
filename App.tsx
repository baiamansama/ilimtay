import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { UserProvider, useUser } from "./src/contexts/UserContext";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import LanguageSelectionScreen from "./src/screens/onboarding/LanguageSelectionScreen";
import GenderSelectionScreen from "./src/screens/onboarding/GenderSelectionScreen";
import GradeSelectionScreen from "./src/screens/onboarding/GradeSelectionScreen";
import {
  AuthStackParamList,
  AppStackParamList,
  OnboardingStackParamList,
} from "./src/types/navigation";

const AuthStack = createStackNavigator<AuthStackParamList>();
const OnboardingStack = createStackNavigator<OnboardingStackParamList>();
const AppStack = createStackNavigator<AppStackParamList>();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
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
      }}
    >
      <AppStack.Screen name="Dashboard" component={DashboardScreen} />
    </AppStack.Navigator>
  );
}

function AppContent() {
  const { currentUser } = useAuth();
  const { isProfileComplete } = useUser();

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
