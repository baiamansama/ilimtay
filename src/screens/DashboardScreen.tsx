import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../types/navigation";

const DashboardScreen: React.FC = () => {
  const { currentUser, logout, deleteAccount } = useAuth();
  const {
    userProfile,
    userStats,
    recentResults,
    loading: userLoading,
    fetchUserStats,
    fetchRecentResults,
  } = useUser();
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Refresh data when component mounts
  useEffect(() => {
    if (currentUser && userProfile) {
      fetchUserStats();
      fetchRecentResults();
    }
  }, [currentUser, userProfile]);

  const handleDeleteAccount = async (): Promise<void> => {
    if (!password) {
      Alert.alert("Error", "Please enter your password to confirm deletion");
      return;
    }

    Alert.alert(
      "Delete Account",
      "Are you absolutely sure? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteAccount(password);
              Alert.alert("Success", "Your account has been deleted");
            } catch (error: any) {
              Alert.alert("Error", error.message);
            } finally {
              setLoading(false);
              setShowDeleteModal(false);
              setPassword("");
            }
          },
        },
      ]
    );
  };

  const closeModal = (): void => {
    setShowDeleteModal(false);
    setPassword("");
  };

  // Show loading indicator while user data is loading
  if (userLoading) {
    return (
      <View className="flex-1 bg-gradient-to-b from-blue-100 to-purple-100 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Loading your dashboard...</Text>
      </View>
    );
  }

  // Default values if userProfile is not available
  const displayProfile = {
    emoji: userProfile?.emoji || "🧑🏻‍🦱",
    language: userProfile?.language || "English",
    languageCode: userProfile?.languageCode || "en",
    grade: userProfile?.grade || 1,
    isPremium: userProfile?.isPremium || false,
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-100 to-purple-100">
      <ScrollView className="flex-1">
        {/* Header with Profile */}
        <View className="bg-white rounded-b-3xl shadow-lg px-6 py-8 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <TouchableOpacity
                className="w-16 h-16 rounded-full bg-yellow-200 items-center justify-center mr-4 shadow-md"
                onPress={() => navigation.navigate("Profile")}
              >
                <Text className="text-3xl">{displayProfile.emoji}</Text>
              </TouchableOpacity>
              <View>
                <Text className="text-xl font-bold text-gray-800">
                  Hello there! 👋
                </Text>
                <Text className="text-gray-600">
                  Grade {displayProfile.grade} • {displayProfile.language}
                </Text>
                {currentUser?.email && (
                  <Text className="text-gray-500 text-sm">
                    {currentUser.email}
                  </Text>
                )}
              </View>
            </View>

            {/* Premium Badge */}
            {!displayProfile.isPremium && (
              <TouchableOpacity
                className="bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 rounded-full shadow-md"
                onPress={() => navigation.navigate("Premium")}
              >
                <Text className="text-white font-bold text-sm">✨ Premium</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Stats Section */}
          {userStats && (
            <View className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                📊 Your Progress
              </Text>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-blue-600">
                    {userStats.totalExercises}
                  </Text>
                  <Text className="text-gray-600 text-xs">Exercises</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-green-600">
                    {userStats.averageScore}%
                  </Text>
                  <Text className="text-gray-600 text-xs">Avg Score</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-orange-600">
                    {userStats.streak}
                  </Text>
                  <Text className="text-gray-600 text-xs">Day Streak</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-purple-600">
                    {userStats.mathStats.totalCompleted}
                  </Text>
                  <Text className="text-gray-600 text-xs">Math Done</Text>
                </View>
              </View>
            </View>
          )}

          {/* Recent Activity */}
          {recentResults.length > 0 && (
            <View className="bg-blue-50 rounded-2xl p-4 mb-4">
              <Text className="text-lg font-bold text-gray-800 mb-2">
                🎯 Latest Activity
              </Text>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-semibold text-blue-800">
                    {recentResults[0].subject} - {recentResults[0].topic}
                  </Text>
                  <Text className="text-blue-600 text-sm">
                    Score: {recentResults[0].score}/
                    {recentResults[0].totalQuestions} (
                    {recentResults[0].percentage}%)
                  </Text>
                </View>
                <Text className="text-2xl">
                  {recentResults[0].percentage >= 80
                    ? "🎉"
                    : recentResults[0].percentage >= 60
                    ? "👍"
                    : "💪"}
                </Text>
              </View>
            </View>
          )}

          {/* Premium Card */}
          {!displayProfile.isPremium && (
            <TouchableOpacity
              className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-4 mt-4 shadow-lg"
              onPress={() => navigation.navigate("Premium")}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-white font-bold text-lg mb-1">
                    🚀 Go Premium!
                  </Text>
                  <Text className="text-white/90 text-sm">
                    • More stories & games{"\n"}• Unlock all subjects{"\n"}• No
                    ads & offline mode
                  </Text>
                </View>
                <View className="bg-white/20 rounded-full p-3">
                  <Text className="text-2xl">⭐</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Learning Sections */}
        <View className="px-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            Let's Learn! 📚
          </Text>

          {/* First Row */}
          <View className="flex-row justify-between mb-4">
            <TouchableOpacity
              className="flex-1 bg-white rounded-2xl p-4 mr-2 shadow-md"
              onPress={() => navigation.navigate("ReadingSubject")}
            >
              <Text className="text-3xl text-center mb-2">📖</Text>
              <Text className="text-center font-bold text-gray-800">
                Reading
              </Text>
              <Text className="text-center text-gray-600 text-xs mt-1">
                Stories & Books
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-white rounded-2xl p-4 ml-2 shadow-md"
              onPress={() => navigation.navigate("MathSubject")}
            >
              <Text className="text-3xl text-center mb-2">🔢</Text>
              <Text className="text-center font-bold text-gray-800">Math</Text>
              <Text className="text-center text-gray-600 text-xs mt-1">
                Numbers & Fun
              </Text>
              {userStats?.mathStats &&
                userStats.mathStats.totalCompleted > 0 && (
                  <View className="absolute top-2 right-2 bg-green-500 rounded-full w-6 h-6 items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {userStats.mathStats.totalCompleted}
                    </Text>
                  </View>
                )}
            </TouchableOpacity>
          </View>

          {/* Second Row */}
          <View className="flex-row justify-between mb-4">
            <TouchableOpacity
              className="flex-1 bg-white rounded-2xl p-4 mr-2 shadow-md"
              onPress={() => navigation.navigate("ScienceSubject")}
            >
              <Text className="text-3xl text-center mb-2">🧪</Text>
              <Text className="text-center font-bold text-gray-800">
                Science
              </Text>
              <Text className="text-center text-gray-600 text-xs mt-1">
                Explore & Discover
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-white rounded-2xl p-4 ml-2 shadow-md"
              onPress={() => navigation.navigate("WritingSubject")}
            >
              <Text className="text-3xl text-center mb-2">📝</Text>
              <Text className="text-center font-bold text-gray-800">
                Writing
              </Text>
              <Text className="text-center text-gray-600 text-xs mt-1">
                Words & Stories
              </Text>
            </TouchableOpacity>
          </View>

          {/* Third Row */}
          <View className="flex-row justify-center mb-6">
            <TouchableOpacity
              className="w-1/2 bg-white rounded-2xl p-4 shadow-md"
              onPress={() => navigation.navigate("VocabularySubject")}
            >
              <Text className="text-3xl text-center mb-2">💭</Text>
              <Text className="text-center font-bold text-gray-800">
                Vocabulary
              </Text>
              <Text className="text-center text-gray-600 text-xs mt-1">
                Learn New Words
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="bg-white rounded-2xl p-6">
            <Text className="text-xl font-bold text-center text-red-600 mb-4">
              Delete Account
            </Text>

            <Text className="text-gray-700 text-center mb-6">
              This action is permanent and cannot be undone. Please enter your
              password to confirm.
            </Text>

            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Enter your password"
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-gray-300 py-3 rounded-lg mr-2"
                onPress={closeModal}
              >
                <Text className="text-gray-700 text-center font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 py-3 rounded-lg ml-2 ${
                  loading ? "bg-gray-400" : "bg-red-500"
                }`}
                onPress={handleDeleteAccount}
                disabled={loading}
              >
                <Text className="text-white text-center font-medium">
                  {loading ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DashboardScreen;
