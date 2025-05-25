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
import { useTheme } from "../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { AppStackParamList } from "../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { AVAILABLE_SUBJECTS } from "../constants/dashboard";
import ThemeToggleButton from "../components/ui/ThemeToggleButton";

// Helper to extract subject stats with proper defaults
const getSubjectStat = (userStats: any, key: string) => {
  const stats = userStats?.[key] ?? {};
  return {
    totalCompleted: Math.max(0, stats.totalCompleted || 0),
    averageScore: Math.max(0, Math.min(100, stats.averageScore || 0)),
  };
};

// Helper to get score color based on percentage (now theme-aware)
const getScoreColor = (score: number, isDarkMode: boolean): string => {
  if (score >= 80) return isDarkMode ? "text-green-400" : "text-green-600";
  if (score >= 60) return isDarkMode ? "text-yellow-400" : "text-yellow-600";
  return isDarkMode ? "text-red-400" : "text-red-600";
};

// Helper to get performance emoji
const getPerformanceEmoji = (percentage: number): string => {
  if (percentage >= 90) return "🎉";
  if (percentage >= 80) return "🔥";
  if (percentage >= 70) return "👍";
  if (percentage >= 60) return "💪";
  return "📈";
};

const DashboardScreen: React.FC = () => {
  const { currentUser, deleteAccount } = useAuth();
  const {
    userProfile,
    userStats,
    recentResults,
    loading: userLoading,
    fetchUserStats,
    fetchRecentResults,
  } = useUser();
  const { colors, isDarkMode } = useTheme();
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser && userProfile) {
      fetchUserStats();
      fetchRecentResults();
    }
  }, [currentUser, userProfile, fetchUserStats, fetchRecentResults]);

  const closeModal = (): void => {
    setShowDeleteModal(false);
    setPassword("");
    setLoading(false);
  };

  if (userLoading) {
    return (
      <View
        className={`flex-1 ${colors.background} justify-center items-center`}
      >
        <ActivityIndicator
          size="large"
          color={isDarkMode ? "#60A5FA" : "#3B82F6"}
        />
        <Text className={`${colors.textSecondary} mt-4 text-base`}>
          Loading your dashboard...
        </Text>
      </View>
    );
  }

  // Safe profile display with fallbacks
  const displayProfile = {
    emoji: userProfile?.emoji || "🧑🏻‍🦱",
    language: userProfile?.language || "English",
    grade: Math.max(1, userProfile?.grade || 1),
    isPremium: Boolean(userProfile?.isPremium),
  };

  // Categorize subjects based on completion
  const attemptedSubjects = AVAILABLE_SUBJECTS.filter((subject) => {
    const stats = getSubjectStat(userStats, subject.key);
    return stats.totalCompleted > 0;
  });

  const unexploredSubjects = AVAILABLE_SUBJECTS.filter((subject) => {
    const stats = getSubjectStat(userStats, subject.key);
    return stats.totalCompleted === 0;
  });

  // Latest Activity Component
  const LatestActivityCard = () => {
    if (!recentResults?.length) return null;

    const latest = recentResults[0];
    const percentage = Math.round((latest.score / latest.totalQuestions) * 100);

    return (
      <View className="mb-6">
        <Text className={`text-2xl font-bold ${colors.text} mb-4 px-6`}>
          Latest Activity
        </Text>
        <View className="mx-6">
          <View
            className={`${
              isDarkMode ? "bg-blue-600" : "bg-blue-500"
            } rounded-2xl p-0 relative overflow-hidden`}
          >
            {/* Performance emoji notification badge */}
            <View className="absolute top-3 right-3 z-10">
              <View className="bg-white/20 rounded-full w-10 h-10 items-center justify-center">
                <Text className="text-xl">
                  {getPerformanceEmoji(percentage)}
                </Text>
              </View>
            </View>

            {/* Content */}
            <View className="p-6">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-white/80 text-sm font-medium mb-1">
                    {latest.subject}
                  </Text>
                  <Text className="text-white text-xl font-bold mb-3">
                    {latest.topic}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-white/90 text-base">
                      Score:{" "}
                      <Text className="font-bold text-white">
                        {latest.score}
                      </Text>
                      <Text className="text-white/70">
                        /{latest.totalQuestions}
                      </Text>
                    </Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className={`text-3xl font-extrabold text-white`}>
                    {percentage}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Attempted Subject Card Component
  const AttemptedSubjectCard = ({
    subject,
  }: {
    subject: (typeof AVAILABLE_SUBJECTS)[0];
  }) => {
    const stats = getSubjectStat(userStats, subject.key);

    return (
      <TouchableOpacity
        className={`${subject.color} rounded-3xl p-6 mb-4 shadow-lg ${
          colors.border
        } ${isDarkMode ? "border border-gray-600" : "border border-white/20"}`}
        onPress={() => navigation.navigate(subject.nav as any)}
        activeOpacity={0.9}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center flex-1">
            <Text className="text-3xl mr-3">{subject.emoji}</Text>
            <Text className={`text-xl font-bold ${subject.textColor}`}>
              {subject.label}
            </Text>
          </View>
          <View className={`${subject.accentColor} px-3 py-1 rounded-full`}>
            <Text className="text-white font-bold text-xs">ACTIVE</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text
              className={`text-sm font-medium ${subject.textColor} opacity-70 mb-1`}
            >
              Attempts
            </Text>
            <Text className={`text-2xl font-bold ${subject.textColor}`}>
              {stats.totalCompleted}
            </Text>
          </View>

          <View className="items-end">
            <Text
              className={`text-sm font-medium ${subject.textColor} opacity-70 mb-1`}
            >
              Average Score
            </Text>
            <Text
              className={`text-2xl font-bold ${getScoreColor(
                stats.averageScore,
                isDarkMode
              )}`}
            >
              {Math.round(stats.averageScore)}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Unexplored Subject Card Component
  const UnexploredSubjectCard = ({
    subject,
  }: {
    subject: (typeof AVAILABLE_SUBJECTS)[0];
  }) => (
    <TouchableOpacity
      className={`w-[48%] aspect-square ${colors.card} rounded-2xl shadow-md items-center justify-center ${colors.border} border mb-4`}
      onPress={() => navigation.navigate(subject.nav as any)}
      activeOpacity={0.8}
    >
      <Text className="text-4xl mb-3">{subject.emoji}</Text>
      <Text
        className={`text-center font-bold text-lg ${colors.text} mb-2 px-2`}
      >
        {subject.label}
      </Text>
      <View
        className={`${
          isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
        } px-3 py-1 rounded-full`}
      >
        <Text
          className={`${
            isDarkMode ? "text-blue-400" : "text-blue-600"
          } text-xs font-medium`}
        >
          Start Learning
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Handle account deletion
  const handleDeleteAccount = async (): Promise<void> => {
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    setLoading(true);
    try {
      await deleteAccount(password);
    } catch (error) {
      Alert.alert("Error", "Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <View className={`flex-1 ${colors.background}`}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className={`${colors.surface} pt-12 pb-6 shadow-sm`}>
          <View className="px-6">
            <View className="flex-row items-center">
              <TouchableOpacity
                className={`w-20 h-20 rounded-full ${
                  isDarkMode
                    ? "bg-gradient-to-br from-yellow-600 to-orange-600"
                    : "bg-gradient-to-br from-yellow-200 to-orange-200"
                } items-center justify-center mr-4 shadow-lg`}
                onPress={() => navigation.navigate("Profile")}
                activeOpacity={0.8}
              >
                <Text className="text-4xl">{displayProfile.emoji}</Text>
              </TouchableOpacity>

              <View className="flex-1">
                <Text className={`text-2xl font-bold ${colors.text} mb-1`}>
                  Hello there! 👋
                </Text>
                <Text className={`${colors.textSecondary} text-base mb-1`}>
                  Grade {displayProfile.grade} • {displayProfile.language}
                </Text>
                {currentUser?.email && (
                  <Text className={`${colors.textTertiary} text-sm`}>
                    {currentUser.email}
                  </Text>
                )}
              </View>

              {/* Theme Toggle Button */}
              <View className="mr-3">
                <ThemeToggleButton size="medium" />
              </View>

              {!displayProfile.isPremium && (
                <TouchableOpacity
                  className={`${
                    isDarkMode
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gradient-to-r from-yellow-400 to-orange-400"
                  } px-4 py-2 rounded-full shadow-lg`}
                  onPress={() => navigation.navigate("Premium")}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-bold text-sm">
                    ✨ Premium
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Latest Activity */}
        <View className="py-6">
          <LatestActivityCard />
        </View>

        {/* Content Sections */}
        <View className="px-6 pb-6">
          {/* Your Progress Section */}
          {attemptedSubjects.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <Text className="text-2xl mr-2">🏆</Text>
                <Text className={`text-2xl font-bold ${colors.text}`}>
                  Your Progress
                </Text>
              </View>
              {attemptedSubjects.map((subject) => (
                <AttemptedSubjectCard key={subject.key} subject={subject} />
              ))}
            </View>
          )}

          {/* Explore New Subjects */}
          {unexploredSubjects.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <Text className="text-2xl mr-2">🚀</Text>
                <Text className={`text-2xl font-bold ${colors.text}`}>
                  Explore New Subjects
                </Text>
              </View>
              <View className="flex-row flex-wrap justify-between">
                {unexploredSubjects.map((subject) => (
                  <UnexploredSubjectCard key={subject.key} subject={subject} />
                ))}
              </View>
            </View>
          )}

          {/* Premium Banner */}
          {!displayProfile.isPremium && (
            <TouchableOpacity
              className={`${
                isDarkMode
                  ? "bg-gradient-to-r from-purple-600 to-pink-600"
                  : "bg-gradient-to-r from-purple-500 to-pink-500"
              } rounded-3xl p-6 shadow-xl`}
              onPress={() => navigation.navigate("Premium" as any)}
              activeOpacity={0.9}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-white font-bold text-xl mb-2">
                    🚀 Go Premium!
                  </Text>
                  <Text className="text-white/90 text-sm leading-5">
                    • Unlock all subjects & advanced topics{"\n"}• Get detailed
                    progress reports{"\n"}• Ad-free experience & offline mode
                    {"\n"}• Access to exclusive games & stories
                  </Text>
                </View>
                <View className="bg-white/20 rounded-full p-4 ml-4">
                  <Text className="text-3xl">⭐</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
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
          <View className={`${colors.surface} rounded-2xl p-6`}>
            <Text
              className={`text-xl font-bold text-center ${colors.error} mb-4`}
            >
              Delete Account
            </Text>
            <Text className={`${colors.textSecondary} text-center mb-6`}>
              This action is permanent and cannot be undone. Please enter your
              password to confirm.
            </Text>
            <View className="mb-6">
              <Text className={`${colors.text} mb-2 font-medium`}>
                Password
              </Text>
              <TextInput
                className={`${colors.border} border rounded-lg px-4 py-3 ${colors.text} ${colors.surfaceVariant}`}
                placeholder="Enter your password"
                placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                editable={!loading}
              />
            </View>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className={`flex-1 ${colors.secondary} py-3 rounded-lg mr-2`}
                onPress={closeModal}
                disabled={loading}
              >
                <Text className={`${colors.text} text-center font-medium`}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-lg ml-2 ${
                  loading
                    ? isDarkMode
                      ? "bg-gray-600"
                      : "bg-gray-400"
                    : isDarkMode
                    ? "bg-red-600"
                    : "bg-red-500"
                }`}
                onPress={handleDeleteAccount}
                disabled={loading || !password.trim()}
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
