import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  TextInput,
  ActivityIndicator, // Added for delete loading
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../../types/navigation";
import { UserProfile } from "../../types/user";
import {
  AVAILABLE_GENDERS,
  AVAILABLE_LANGUAGES,
  AVAILABLE_GRADES,
  AVAILABLE_AVATARS,
} from "../../constants/user";

const ProfileEditScreen: React.FC = () => {
  const { deleteAccount } = useAuth();
  const { userProfile, updateUserProfile, loading: userLoading } = useUser();
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const currentLanguage =
    AVAILABLE_LANGUAGES.find((l) => l.code === userProfile?.languageCode) ||
    AVAILABLE_LANGUAGES[0];
  const currentGrade = userProfile?.grade || 1;
  const currentGender = userProfile?.gender || "boy";
  const currentEmoji =
    userProfile?.emoji || AVAILABLE_AVATARS[currentGender]?.[0] || "🧑";

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    try {
      await updateUserProfile(updates);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile.");
    }
  };

  const handleDeleteAccount = async (): Promise<void> => {
    if (!password) {
      Alert.alert("Error", "Please enter your password to confirm deletion");
      return;
    }

    Alert.alert(
      "Delete Account",
      "Are you absolutely sure? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel", onPress: () => setPassword("") },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleteLoading(true);
              await deleteAccount(password); // Assumes deleteAccount handles navigation/logout
              Alert.alert("Success", "Your account has been deleted");
              // Navigation to auth flow or login screen should be handled by AuthContext or here
            } catch (error: any) {
              Alert.alert(
                "Error",
                error.message || "Failed to delete account."
              );
            } finally {
              setDeleteLoading(false);
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

  if (userLoading && !userProfile) {
    return (
      <View className="flex-1 bg-gradient-to-b from-blue-100 to-purple-100 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Loading profile...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-100 to-purple-100">
      {/* Header */}
      <View className="bg-white pt-12 pb-6 px-6 rounded-b-3xl shadow-lg">
        <TouchableOpacity
          className="mb-4 absolute top-12 left-6 z-10" // Position back button
          onPress={() => navigation.goBack()}
        >
          <Text className="text-blue-600 text-lg">← Back</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-center text-gray-800 mt-1">
          Edit Profile
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Current Avatar Display */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-yellow-200 items-center justify-center shadow-md mb-2">
            <Text className="text-5xl">{currentEmoji}</Text>
          </View>
          <Text className="text-gray-700 font-semibold">Your Avatar</Text>
        </View>

        {/* Avatar Picker Section */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-3 text-center">
            Choose Your Avatar
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row -mx-1"
          >
            {(AVAILABLE_AVATARS[currentGender] || AVAILABLE_AVATARS.other).map(
              (emoji, index) => (
                <TouchableOpacity
                  key={index}
                  className={`w-16 h-16 rounded-full items-center justify-center mx-1 shadow ${
                    currentEmoji === emoji
                      ? "bg-blue-200 border-2 border-blue-500"
                      : "bg-white"
                  }`}
                  onPress={() => handleUpdateProfile({ emoji })}
                >
                  <Text className="text-3xl">{emoji}</Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>

        {/* Profile Settings Section */}
        <View className="space-y-3 mb-8">
          {/* Language Setting */}
          <TouchableOpacity
            className="bg-white rounded-xl p-4 shadow-md flex-row justify-between items-center"
            onPress={() => setShowLanguageModal(true)}
          >
            <View>
              <Text className="text-gray-500 text-xs">Language</Text>
              <Text className="text-gray-800 font-semibold text-base">
                {currentLanguage.flag} {currentLanguage.name}
              </Text>
            </View>
            <Text className="text-gray-400 text-xl">›</Text>
          </TouchableOpacity>

          {/* Grade Setting */}
          <TouchableOpacity
            className="bg-white rounded-xl p-4 shadow-md flex-row justify-between items-center"
            onPress={() => setShowGradeModal(true)}
          >
            <View>
              <Text className="text-gray-500 text-xs">Grade</Text>
              <Text className="text-gray-800 font-semibold text-base">
                Grade {currentGrade}
              </Text>
            </View>
            <Text className="text-gray-400 text-xl">›</Text>
          </TouchableOpacity>

          {/* Gender Setting */}
          <TouchableOpacity
            className="bg-white rounded-xl p-4 shadow-md flex-row justify-between items-center"
            onPress={() => setShowGenderModal(true)}
          >
            <View>
              <Text className="text-gray-500 text-xs">Gender</Text>
              <Text className="text-gray-800 font-semibold text-base">
                {
                  AVAILABLE_GENDERS.find((g) => g.value === currentGender)
                    ?.emoji
                }{" "}
                {
                  AVAILABLE_GENDERS.find((g) => g.value === currentGender)
                    ?.label
                }
              </Text>
            </View>
            <Text className="text-gray-400 text-xl">›</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View className="mb-8">
          <TouchableOpacity
            className="bg-red-100 py-4 rounded-xl shadow-md border border-red-200"
            onPress={() => setShowDeleteModal(true)}
          >
            <Text className="text-red-600 text-center font-semibold text-base">
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[60vh]">
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
              Select Language
            </Text>
            <ScrollView>
              {AVAILABLE_LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  className={`py-3 px-2 my-1 rounded-lg ${
                    currentLanguage.code === lang.code
                      ? "bg-blue-100"
                      : "bg-gray-50"
                  }`}
                  onPress={() => {
                    handleUpdateProfile({
                      language: lang.name,
                      languageCode: lang.code,
                    });
                    setShowLanguageModal(false);
                  }}
                >
                  <Text
                    className={`text-center text-lg ${
                      currentLanguage.code === lang.code
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {lang.flag} {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              className="bg-gray-200 py-3 rounded-lg mt-4"
              onPress={() => setShowLanguageModal(false)}
            >
              <Text className="text-gray-700 text-center font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Grade Modal */}
      <Modal
        visible={showGradeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGradeModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[60vh]">
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
              Select Grade
            </Text>
            <ScrollView>
              {AVAILABLE_GRADES.map((grade) => (
                <TouchableOpacity
                  key={grade}
                  className={`py-3 px-2 my-1 rounded-lg ${
                    currentGrade === grade ? "bg-blue-100" : "bg-gray-50"
                  }`}
                  onPress={() => {
                    handleUpdateProfile({ grade });
                    setShowGradeModal(false);
                  }}
                >
                  <Text
                    className={`text-center text-lg ${
                      currentGrade === grade
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    Grade {grade}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              className="bg-gray-200 py-3 rounded-lg mt-4"
              onPress={() => setShowGradeModal(false)}
            >
              <Text className="text-gray-700 text-center font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Gender Modal */}
      <Modal
        visible={showGenderModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
              Select Gender
            </Text>
            {AVAILABLE_GENDERS.map((gender) => (
              <TouchableOpacity
                key={gender.value}
                className={`py-3 px-2 my-1 rounded-lg ${
                  currentGender === gender.value ? "bg-blue-100" : "bg-gray-50"
                }`}
                onPress={() => {
                  handleUpdateProfile({
                    gender: gender.value,
                    emoji: AVAILABLE_AVATARS[gender.value]?.[0],
                  });
                  setShowGenderModal(false);
                }}
              >
                <Text
                  className={`text-center text-lg ${
                    currentGender === gender.value
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {gender.emoji} {gender.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              className="bg-gray-200 py-3 rounded-lg mt-4"
              onPress={() => setShowGenderModal(false)}
            >
              <Text className="text-gray-700 text-center font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                value={password}
              />
            </View>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-gray-300 py-3 rounded-lg"
                onPress={closeModal}
                disabled={deleteLoading}
              >
                <Text className="text-gray-700 text-center font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-lg ${
                  deleteLoading ? "bg-gray-400" : "bg-red-500"
                }`}
                onPress={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-center font-medium">
                    Delete
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileEditScreen;
