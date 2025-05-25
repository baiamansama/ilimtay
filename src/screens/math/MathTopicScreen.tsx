import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { MathTopicProps } from "../../types/navigation";

const MathTopicScreen: React.FC<MathTopicProps> = ({ navigation, route }) => {
  const { topic, topicEmoji } = route.params;

  const difficulties = [
    {
      id: 1,
      level: "Easy",
      emoji: "🌱",
      description: "Perfect for beginners",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      examples: getExamplesByTopic(topic, "Easy"),
    },
    {
      id: 2,
      level: "Medium",
      emoji: "🌿",
      description: "Ready for a challenge?",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-300",
      examples: getExamplesByTopic(topic, "Medium"),
    },
    {
      id: 3,
      level: "Hard",
      emoji: "🌳",
      description: "For math champions!",
      color: "from-red-400 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      examples: getExamplesByTopic(topic, "Hard"),
    },
  ];

  function getExamplesByTopic(topic: string, difficulty: string): string {
    const examples: { [key: string]: { [key: string]: string } } = {
      Addition: {
        Easy: "2 + 3 = ?",
        Medium: "15 + 27 = ?",
        Hard: "148 + 267 = ?",
      },
      Subtraction: {
        Easy: "5 - 2 = ?",
        Medium: "30 - 18 = ?",
        Hard: "245 - 178 = ?",
      },
      Multiplication: {
        Easy: "3 × 2 = ?",
        Medium: "12 × 8 = ?",
        Hard: "23 × 15 = ?",
      },
      Division: {
        Easy: "8 ÷ 2 = ?",
        Medium: "48 ÷ 6 = ?",
        Hard: "144 ÷ 12 = ?",
      },
    };
    return examples[topic]?.[difficulty] || "Numbers + Fun = Learning!";
  }

  const handleDifficultyPress = (difficulty: string) => {
    navigation.navigate("MathExercise", {
      topic,
      difficulty,
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
                {topicEmoji} {topic}
              </Text>
              <Text className="text-gray-600 mt-1">
                Choose your difficulty level
              </Text>
            </View>
          </View>

          {/* Motivational Message */}
          <View className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
            <Text className="text-purple-800 font-medium text-center">
              🎯 Pick the level that feels right for you! 🎯
            </Text>
          </View>
        </View>

        {/* Difficulty Levels */}
        <View className="px-6">
          {difficulties.map((difficulty, index) => (
            <TouchableOpacity
              key={difficulty.id}
              className={`${difficulty.bgColor} rounded-2xl p-6 mb-4 shadow-lg border-2 ${difficulty.borderColor}`}
              onPress={() => handleDifficultyPress(difficulty.level)}
            >
              <View className="flex-row items-center">
                <View className="w-16 h-16 rounded-full bg-white items-center justify-center mr-4 shadow-md">
                  <Text className="text-2xl">{difficulty.emoji}</Text>
                </View>

                <View className="flex-1">
                  <Text className="text-2xl font-bold text-gray-800 mb-1">
                    {difficulty.level}
                  </Text>
                  <Text className="text-gray-600 mb-2">
                    {difficulty.description}
                  </Text>

                  {/* Example Problem */}
                  <View className="bg-white/70 rounded-lg px-3 py-2">
                    <Text className="text-gray-700 font-medium">
                      Example: {difficulty.examples}
                    </Text>
                  </View>
                </View>

                {/* Arrow */}
                <View className="w-8 h-8 rounded-full bg-white items-center justify-center shadow-sm">
                  <Text className="text-gray-600">→</Text>
                </View>
              </View>

              {/* Progress Stars */}
              <View className="flex-row justify-center mt-4 pt-4 border-t border-white/50">
                <View className="flex-row space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Text key={star} className="text-yellow-400 text-lg">
                      ⭐
                    </Text>
                  ))}
                </View>
                <Text className="text-gray-600 ml-2 text-sm self-center">
                  5 exercises
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Encouragement Card */}
          <View className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl p-6 mb-6 shadow-lg">
            <Text className="text-white text-center font-bold text-lg mb-2">
              🚀 You've Got This! 🚀
            </Text>
            <Text className="text-white/90 text-center">
              Remember: It's okay to start easy and work your way up. Every math
              champion started somewhere!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MathTopicScreen;
