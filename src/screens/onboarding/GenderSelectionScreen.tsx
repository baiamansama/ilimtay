import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { OnboardingGenderProps } from "../../types/navigation";
import { AVAILABLE_GENDERS } from "../../types/user";
import { useUser } from "../../contexts/UserContext";

const GenderSelectionScreen: React.FC<OnboardingGenderProps> = ({
  navigation,
}) => {
  const { setOnboardingData, onboardingData } = useUser();
  const [selectedGender, setSelectedGender] = useState<"boy" | "girl" | "">(
    onboardingData.gender || ""
  );

  const handleGenderSelect = (gender: "boy" | "girl") => {
    setSelectedGender(gender);
    setOnboardingData({ ...onboardingData, gender });
  };

  const handleContinue = () => {
    if (selectedGender) {
      navigation.navigate("Grade");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-100 to-green-100">
      <View className="flex-1 px-6 py-8">
        {/* Progress bar */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-600">Step 2 of 3</Text>
            <Text className="text-sm text-blue-600 font-semibold">67%</Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full">
            <View
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: "67%" }}
            />
          </View>
        </View>

        {/* Title */}
        <View className="mb-12">
          <Text className="text-3xl font-bold text-center text-gray-800 mb-2">
            Tell us about yourself! 😊
          </Text>
          <Text className="text-center text-gray-600 text-lg">
            Are you a boy or a girl?
          </Text>
        </View>

        {/* Gender Options */}
        <View className="flex-1 justify-center">
          <View className="flex-row justify-center space-x-8">
            {AVAILABLE_GENDERS.map((gender) => (
              <TouchableOpacity
                key={gender.value}
                className={`items-center p-6 rounded-3xl ${
                  selectedGender === gender.value
                    ? "bg-blue-500 shadow-lg"
                    : "bg-white shadow-md"
                }`}
                onPress={() => handleGenderSelect(gender.value)}
                style={{ width: 120, height: 140 }}
              >
                <Text className="text-6xl mb-2">{gender.emoji}</Text>
                <Text
                  className={`text-lg font-semibold ${
                    selectedGender === gender.value
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {gender.label}
                </Text>
                {selectedGender === gender.value && (
                  <View className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full items-center justify-center">
                    <Text className="text-white text-sm">✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          className={`py-4 rounded-2xl mt-8 ${
            selectedGender ? "bg-blue-500" : "bg-gray-300"
          }`}
          onPress={handleContinue}
          disabled={!selectedGender}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Continue 🎯
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GenderSelectionScreen;
