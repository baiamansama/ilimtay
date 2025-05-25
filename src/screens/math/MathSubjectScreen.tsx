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
const MathSubjectScreen: React.FC<MathSubjectProps> = ({ navigation }) => {
  const handleTopicPress = (topic: { name: string; emoji: string }) => {
    navigation.navigate("MathTopic", {
      topic: topic.name,
      topicEmoji: topic.emoji,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-100 to-purple-100">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white rounded-b-3xl shadow-lg px-6 py-8 mb-6">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center mr-4"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-xl">←</Text>
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-3xl font-bold text-gray-800">
                🔢 Math Fun!
              </Text>
              <Text className="text-gray-600 mt-1">
                Choose what you want to practice
              </Text>
            </View>
          </View>

          {/* Progress indicator could go here */}
          <View className="bg-blue-50 rounded-2xl p-4">
            <Text className="text-blue-800 font-medium text-center">
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
                className={`w-[49%] ${topic.bgColor} rounded-2xl p-6 mb-4 shadow-md border-2 ${topic.borderColor}`}
                onPress={() => handleTopicPress(topic)}
              >
                <View className="items-center">
                  <Text className="text-4xl mb-3">{topic.emoji}</Text>
                  <Text className="text-xl font-bold text-gray-800 mb-2">
                    {topic.name}
                  </Text>
                  <Text className="text-gray-600 text-sm text-center">
                    {topic.description}
                  </Text>
                </View>

                {/* Difficulty Preview */}
                <View className="mt-4 pt-4 border-t border-gray-200">
                  <View className="flex-row justify-center space-x-2">
                    <View className="w-2 h-2 rounded-full bg-green-400"></View>
                    <View className="w-2 h-2 rounded-full bg-yellow-400"></View>
                    <View className="w-2 h-2 rounded-full bg-red-400"></View>
                  </View>
                  <Text className="text-xs text-gray-500 text-center mt-1">
                    Easy • Medium • Hard
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Coming Soon Section */}
          <View className="bg-white rounded-2xl p-6 mt-4 mb-6 shadow-md border border-gray-200">
            <Text className="text-center text-gray-500 font-medium mb-2">
              🚀 Coming Soon
            </Text>
            <View className="flex-row justify-center space-x-4">
              <View className="items-center">
                <Text className="text-2xl mb-1">📊</Text>
                <Text className="text-xs text-gray-600">Fractions</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl mb-1">📐</Text>
                <Text className="text-xs text-gray-600">Geometry</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl mb-1">⏰</Text>
                <Text className="text-xs text-gray-600">Time</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MathSubjectScreen;
