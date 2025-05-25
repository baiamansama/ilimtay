import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { LoginScreenProps } from "../types/navigation";

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const { login, resetPassword } = useAuth();

  const handleSubmit = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      // Navigation will be handled by the auth state change
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (): Promise<void> => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address first");
      return;
    }

    try {
      setResetLoading(true);
      await resetPassword(email);
      Alert.alert(
        "Password Reset",
        "Password reset email sent! Check your email inbox."
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gradient-to-br from-blue-100 to-purple-100"
    >
      <View className="flex-1 justify-center px-6">
        <View className="bg-white rounded-2xl p-8 shadow-lg">
          <Text className="text-3xl font-bold text-center text-gray-800 mb-2">
            Welcome Back! 👋
          </Text>
          <Text className="text-center text-gray-600 mb-8">
            Ready to learn and have fun?
          </Text>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Email</Text>
            <TextInput
              className="border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-blue-400"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <TextInput
              className="border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-blue-400"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            className={`py-4 rounded-xl mb-4 ${
              loading ? "bg-gray-400" : "bg-blue-500"
            }`}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? "Signing In..." : "Sign In 🚀"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-2 mb-4"
            onPress={handleResetPassword}
            disabled={resetLoading}
          >
            <Text className="text-blue-500 text-center">
              {resetLoading ? "Sending..." : "Forgot Password? 🤔"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-2"
            onPress={() => navigation.navigate("Signup")}
          >
            <Text className="text-purple-500 text-center">
              Don't have an account? Sign Up ✨
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
