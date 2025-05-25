import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../../types/navigation";

const ProfileScreen: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { userProfile } = useUser();
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error: any) {
      Alert.alert("Error", "Failed to log out");
    }
  };

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
      {/* Header with back button */}
      <View className="bg-white pt-12 pb-6 px-6 rounded-b-3xl shadow-lg mb-6">
        <TouchableOpacity className="mb-4" onPress={() => navigation.goBack()}>
          <Text className="text-blue-600 text-lg">← Back</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
          Profile
        </Text>

        {/* Profile Display */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-yellow-200 items-center justify-center mb-3 shadow-md">
            <Text className="text-4xl">{displayProfile.emoji}</Text>
          </View>
          <Text className="text-lg font-semibold text-gray-800">
            Grade {displayProfile.grade} Student
          </Text>
          {currentUser?.email && (
            <Text className="text-gray-600 text-sm mt-1">
              {currentUser.email}
            </Text>
          )}
          {userProfile && (
            <Text className="text-gray-500 text-xs mt-1">
              Member since {userProfile.createdAt.toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Main Action Buttons */}
        <View className="space-y-4 mb-8">
          <TouchableOpacity
            className="bg-white rounded-2xl p-4 shadow-md border border-blue-100"
            onPress={() => navigation.navigate("ProfileEdit")}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">✏️</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  Edit Profile
                </Text>
                <Text className="text-gray-600 text-sm">
                  Change language, grade, and avatar
                </Text>
              </View>
              <Text className="text-gray-400 text-xl">›</Text>
            </View>
          </TouchableOpacity>

          {!displayProfile.isPremium && (
            <TouchableOpacity
              className="bg-white rounded-2xl p-4 shadow-md border border-yellow-100"
              onPress={() => navigation.navigate("Premium")}
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-yellow-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-2xl">⭐</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    Go Premium
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Unlock all features and content
                  </Text>
                </View>
                (
                <View className="bg-yellow-400 px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-bold">NEW</Text>
                </View>
                )<Text className="text-gray-400 text-xl ml-2">›</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Info Card */}
        <View className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Current Settings
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-600">Language</Text>
              <Text className="text-gray-800 font-medium">
                {displayProfile.language}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-600">Grade</Text>
              <Text className="text-gray-800 font-medium">
                Grade {displayProfile.grade}
              </Text>
            </View>

            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-600">Account Type</Text>
              <View className="flex-row items-center">
                <Text className="text-gray-800 font-medium mr-2">
                  {displayProfile.isPremium ? "Premium" : "Free"}
                </Text>
                {displayProfile.isPremium && (
                  <Text className="text-yellow-500">⭐</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3 mb-8">
          <TouchableOpacity
            className="bg-red-500 py-4 rounded-2xl shadow-md"
            onPress={handleLogout}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
