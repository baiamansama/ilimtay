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
import { SignupScreenProps } from "../types/navigation";

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { signup } = useAuth();

  const handleSubmit = async (): Promise<void> => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await signup(email, password);
      // Navigation will be handled by the auth state change
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gradient-to-br from-green-100 to-blue-100"
    >
      <View className="flex-1 justify-center px-6">
        <View className="bg-white rounded-2xl p-8 shadow-lg">
          <Text className="text-3xl font-bold text-center text-gray-800 mb-2">
            Join the Fun! 🎉
          </Text>
          <Text className="text-center text-gray-600 mb-8">
            Create your learning adventure account
          </Text>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Email</Text>
            <TextInput
              className="border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-green-400"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <TextInput
              className="border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-green-400"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password-new"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">
              Confirm Password
            </Text>
            <TextInput
              className="border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-green-400"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="password-new"
            />
          </View>

          <TouchableOpacity
            className={`py-4 rounded-xl mb-4 ${
              loading ? "bg-gray-400" : "bg-green-500"
            }`}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? "Creating Account..." : "Sign Up 🌟"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-2"
            onPress={() => navigation.navigate("Login")}
          >
            <Text className="text-blue-500 text-center">
              Already have an account? Sign In 👈
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
