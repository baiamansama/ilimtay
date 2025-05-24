import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

const DashboardScreen: React.FC = () => {
  const { currentUser, logout, deleteAccount } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error: any) {
      Alert.alert("Error", "Failed to log out");
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

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center px-6">
        <View className="bg-white rounded-lg p-6 shadow-lg">
          <Text className="text-3xl font-bold text-center text-gray-800 mb-2">
            Welcome!
          </Text>

          <Text className="text-center text-gray-600 mb-8">
            {currentUser?.email}
          </Text>

          <View className="space-y-4">
            <TouchableOpacity
              className="bg-blue-500 py-4 rounded-lg"
              onPress={handleLogout}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Sign Out
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-500 py-4 rounded-lg mt-4"
              onPress={() => setShowDeleteModal(true)}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="bg-white rounded-lg p-6">
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
                // value={password}
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
