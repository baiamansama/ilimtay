import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { OnboardingGradeProps } from "../../types/navigation";
import { AVAILABLE_GRADES } from "../../types/user";
import { useUser } from "../../contexts/UserContext";

const GradeSelectionScreen: React.FC<OnboardingGradeProps> = ({
  navigation,
}) => {
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

  const handleGradeSelect = (grade: number) => {
    setSelectedGrade(grade);
    setOnboardingData({ ...onboardingData, grade });
  };

  const handleFinish = async () => {
    if (selectedGrade && onboardingData.language && onboardingData.gender) {
      try {
        setLoading(true);

        // Update user profile with all onboarding data
        updateUserProfile({
          language: onboardingData.language,
          gender: onboardingData.gender,
          grade: selectedGrade,
        });

        // Clear onboarding data
        clearOnboardingData();

        // Show success message
        Alert.alert(
          "Welcome! 🎉",
          "Your profile is ready! Let's start learning!",
          [{ text: "Let's Go! 🚀", onPress: () => {} }]
        );

        // The navigation will be handled by App.tsx based on profile completion
      } catch (error) {
        Alert.alert("Error", "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const getGradeEmoji = (grade: number) => {
    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];
    return emojis[grade - 1];
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-yellow-100 to-orange-100">
      <View className="flex-1 px-6 py-8">
        {/* Progress bar */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-600">Step 3 of 3</Text>
            <Text className="text-sm text-orange-600 font-semibold">100%</Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full">
            <View
              className="h-2 bg-orange-500 rounded-full"
              style={{ width: "100%" }}
            />
          </View>
        </View>

        {/* Title */}
        <View className="mb-12">
          <Text className="text-3xl font-bold text-center text-gray-800 mb-2">
            What grade are you in? 📚
          </Text>
          <Text className="text-center text-gray-600 text-lg">
            This helps us show you the right lessons!
          </Text>
        </View>

        {/* Grade Options */}
        <View className="flex-1 justify-center">
          <View className="flex-row flex-wrap justify-center">
            {AVAILABLE_GRADES.map((grade) => (
              <TouchableOpacity
                key={grade}
                className={`items-center justify-center m-2 p-4 rounded-2xl ${
                  selectedGrade === grade
                    ? "bg-orange-500 shadow-lg"
                    : "bg-white shadow-md"
                }`}
                onPress={() => handleGradeSelect(grade)}
                style={{ width: 80, height: 80 }}
              >
                <Text className="text-3xl mb-1">{getGradeEmoji(grade)}</Text>
                <Text
                  className={`text-sm font-semibold ${
                    selectedGrade === grade ? "text-white" : "text-gray-800"
                  }`}
                ></Text>
                {selectedGrade === grade && (
                  <View className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full items-center justify-center">
                    <Text className="text-white text-sm">✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Finish Button */}
        <TouchableOpacity
          className={`py-4 rounded-2xl mt-8 ${
            selectedGrade ? "bg-orange-500" : "bg-gray-300"
          }`}
          onPress={handleFinish}
          disabled={!selectedGrade || loading}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading
              ? "Setting up your profile..."
              : "Let's Start Learning! 🌟"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GradeSelectionScreen;
