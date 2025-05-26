import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { MathSubjectProps } from "../../types/navigation";
import { mathTopics } from "../../constants/math";
import { useTheme } from "../../contexts/ThemeContext";

const MathSubjectScreen: React.FC<MathSubjectProps> = ({ navigation }) => {
  const { colors } = useTheme();

  const handleTopicPress = (topic: { name: string; emoji: string }) => {
    navigation.navigate("MathTopic", {
      topic: topic.name,
      topicEmoji: topic.emoji,
    });
  };

  return (
    <SafeAreaView className={`flex-1 ${colors.background}`}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View
          className={`${colors.card} rounded-b-3xl shadow-lg px-6 py-8 mb-6`}
        >
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              className={`w-10 h-10 rounded-full ${colors.secondary} items-center justify-center mr-4`}
              onPress={() => navigation.goBack()}
            >
              <Text className={`text-xl ${colors.text}`}>←</Text>
            </TouchableOpacity>
            <View className="flex-1">
              <Text className={`text-3xl font-bold ${colors.text}`}>
                🔢 Math Fun!
              </Text>
              <Text className={`${colors.textSecondary} mt-1`}>
                Choose what you want to practice
              </Text>
            </View>
          </View>

          {/* Progress indicator could go here */}
          <View className={`${colors.primary} bg-opacity-10 rounded-2xl p-4`}>
            <Text className={`${colors.primary} font-medium text-center`}>
              🌟 Let's make math exciting! Pick a topic below 🌟
            </Text>
          </View>
        </View>

        {/* Math Topics Grid */}
        <View className="px-6">
          <View className="flex-row flex-wrap justify-between">
            {mathTopics.map((topic, index) => (
              <TouchableOpacity
                key={topic.id}
                className={`w-[49%] ${colors.card} rounded-2xl p-6 mb-4 shadow-md ${colors.border} border-2`}
                onPress={() => handleTopicPress(topic)}
              >
                <View className="items-center">
                  <Text className="text-4xl mb-3">{topic.emoji}</Text>
                  <Text className={`text-xl font-bold ${colors.text} mb-2`}>
                    {topic.name}
                  </Text>
                  <Text
                    className={`${colors.textSecondary} text-sm text-center`}
                  >
                    {topic.description}
                  </Text>
                </View>

                {/* Difficulty Preview */}
                <View className={`mt-4 pt-4 ${colors.divider} border-t`}>
                  <View className="flex-row justify-center space-x-2">
                    <View className="w-2 h-2 rounded-full bg-green-400"></View>
                    <View className="w-2 h-2 rounded-full bg-yellow-400"></View>
                    <View className="w-2 h-2 rounded-full bg-red-400"></View>
                  </View>
                  <Text
                    className={`text-xs ${colors.textTertiary} text-center mt-1`}
                  >
                    Easy • Medium • Hard
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Coming Soon Section */}
          <View
            className={`${colors.card} rounded-2xl p-6 mt-4 mb-6 shadow-md ${colors.border} border`}
          >
            <Text
              className={`text-center ${colors.textSecondary} font-medium mb-2`}
            >
              🚀 Coming Soon
            </Text>
            <View className="flex-row justify-center space-x-4">
              <View className="items-center">
                <Text className="text-2xl mb-1">📊</Text>
                <Text className={`text-xs ${colors.textTertiary}`}>
                  Fractions
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl mb-1">📐</Text>
                <Text className={`text-xs ${colors.textTertiary}`}>
                  Geometry
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl mb-1">⏰</Text>
                <Text className={`text-xs ${colors.textTertiary}`}>Time</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MathSubjectScreen;
