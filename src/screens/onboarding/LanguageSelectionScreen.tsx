import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { OnboardingLanguageProps } from "../../types/navigation";
import { AVAILABLE_LANGUAGES } from "../../constants/user";
import { Language } from "../../types/user";
import { useUser } from "../../contexts/UserContext";

const { width } = Dimensions.get("window");

const LanguageSelectionScreen: React.FC<OnboardingLanguageProps> = ({
  navigation,
}) => {
  const { setOnboardingData, onboardingData } = useUser();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    onboardingData.language || ""
  );

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language.code);
    setOnboardingData({ ...onboardingData, language: language.code });
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      navigation.navigate("Gender");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-purple-100 to-pink-100">
      <View className="flex-1 px-6 py-8">
        {/* Progress bar */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-600">Step 1 of 3</Text>
            <Text className="text-sm text-purple-600 font-semibold">33%</Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full">
            <View
              className="h-2 bg-purple-500 rounded-full"
              style={{ width: "33%" }}
            />
          </View>
        </View>

        {/* Title */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-gray-800 mb-2">
            Choose Your Language 🌍
          </Text>
          <Text className="text-center text-gray-600 text-lg">
            What language would you like to learn in?
          </Text>
        </View>

        {/* Language Options */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="space-y-4">
            {AVAILABLE_LANGUAGES.map((language) => (
              <TouchableOpacity
                key={language.code}
                className={`p-4 rounded-2xl border-2 ${
                  selectedLanguage === language.code
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 bg-white"
                }`}
                onPress={() => handleLanguageSelect(language)}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className="text-3xl mr-4">{language.flag}</Text>
                    <View>
                      <Text className="text-lg font-semibold text-gray-800">
                        {language.nativeName}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {language.name}
                      </Text>
                    </View>
                  </View>
                  {selectedLanguage === language.code && (
                    <View className="w-6 h-6 bg-purple-500 rounded-full items-center justify-center">
                      <Text className="text-white text-xs">✓</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Continue Button */}
        <TouchableOpacity
          className={`py-4 rounded-2xl mt-6 ${
            selectedLanguage ? "bg-purple-500" : "bg-gray-300"
          }`}
          onPress={handleContinue}
          disabled={!selectedLanguage}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Continue 🚀
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LanguageSelectionScreen;
