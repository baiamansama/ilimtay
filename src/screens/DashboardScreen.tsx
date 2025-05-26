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
  StyleSheet,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { AppStackParamList } from "../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { AVAILABLE_SUBJECTS } from "../constants/dashboard";
import ThemeToggleButton from "../components/ui/ThemeToggleButton";

// Define types for AVAILABLE_SUBJECTS
interface Subject {
  key: string;
  label: string;
  emoji: string;
  color: string;
  accentColor: string;
  nav: keyof AppStackParamList;
}

// Helper to extract subject stats with proper defaults
const getSubjectStat = (userStats: any, key: string) => {
  const stats = userStats?.[key] ?? {};
  return {
    totalCompleted: Math.max(0, stats.totalCompleted || 0),
    averageScore: Math.max(0, Math.min(100, stats.averageScore || 0)),
  };
};

// Helper to get score color based on percentage
const getScoreColor = (score: number, colors: any) => {
  if (score >= 80) return colors.success;
  if (score >= 60) return colors.warning;
  return colors.error;
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.info} />
        <Text style={[styles.textSecondary, { color: colors.textSecondary }]}>
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
  const typedSubjects: Subject[] = AVAILABLE_SUBJECTS.map((subject) => ({
    ...subject,
    nav: subject.nav as keyof AppStackParamList,
  }));

  const attemptedSubjects = typedSubjects.filter((subject) => {
    const stats = getSubjectStat(userStats, subject.key);
    return stats.totalCompleted > 0;
  });

  const unexploredSubjects = typedSubjects.filter((subject) => {
    const stats = getSubjectStat(userStats, subject.key);
    return stats.totalCompleted === 0;
  });

  // Latest Activity Component
  const LatestActivityCard = () => {
    if (!recentResults?.length) return null;

    const latest = recentResults[0];
    const percentage = Math.round((latest.score / latest.totalQuestions) * 100);

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Latest Activity
        </Text>
        <View style={[styles.card, { backgroundColor: colors.primary }]}>
          {/* Performance emoji notification badge */}
          <View style={styles.badge}>
            <View
              style={[
                styles.badgeInner,
                { backgroundColor: colors.surfaceVariant },
              ]}
            >
              <Text style={styles.emoji}>
                {getPerformanceEmoji(percentage)}
              </Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.cardContent}>
            <View style={styles.cardRow}>
              <View style={styles.cardTextContainer}>
                <Text
                  style={[styles.cardSubtitle, { color: colors.textOnPrimary }]}
                >
                  {latest.subject}
                </Text>
                <Text
                  style={[styles.cardTitle, { color: colors.textOnPrimary }]}
                >
                  {latest.topic}
                </Text>
                <View style={styles.scoreRow}>
                  <Text
                    style={[styles.scoreText, { color: colors.textOnPrimary }]}
                  >
                    Score:{" "}
                    <Text
                      style={[
                        styles.scoreValue,
                        { color: colors.textOnPrimary },
                      ]}
                    >
                      {latest.score}
                    </Text>
                    <Text
                      style={[
                        styles.scoreTotal,
                        { color: colors.textOnPrimary },
                      ]}
                    >
                      /{latest.totalQuestions}
                    </Text>
                  </Text>
                </View>
              </View>

              <View>
                <Text
                  style={[styles.percentage, { color: colors.textOnPrimary }]}
                >
                  {percentage}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Attempted Subject Card Component
  const AttemptedSubjectCard = ({ subject }: { subject: Subject }) => {
    const stats = getSubjectStat(userStats, subject.key);

    return (
      <TouchableOpacity
        style={[
          styles.attemptedCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={() => navigation.navigate(subject.nav)}
        activeOpacity={0.9}
      >
        <View style={styles.attemptedCardHeader}>
          <View style={styles.attemptedCardTitleRow}>
            <Text style={styles.emoji}>{subject.emoji}</Text>
            <Text style={[styles.attemptedCardTitle, { color: colors.text }]}>
              {subject.label}
            </Text>
          </View>
          <View
            style={[styles.activeBadge, { backgroundColor: colors.primary }]}
          >
            <Text
              style={[styles.activeBadgeText, { color: colors.textOnPrimary }]}
            >
              ACTIVE
            </Text>
          </View>
        </View>

        <View style={styles.attemptedCardStats}>
          <View>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Attempts
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.totalCompleted}
            </Text>
          </View>

          <View style={styles.statRight}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Average Score
            </Text>
            <Text
              style={[
                styles.statValue,
                { color: getScoreColor(stats.averageScore, colors) },
              ]}
            >
              {Math.round(stats.averageScore)}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Unexplored Subject Card Component
  const UnexploredSubjectCard = ({ subject }: { subject: Subject }) => (
    <TouchableOpacity
      style={[
        styles.unexploredCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => navigation.navigate(subject.nav)}
      activeOpacity={0.8}
    >
      <Text style={styles.emoji}>{subject.emoji}</Text>
      <Text style={[styles.unexploredCardTitle, { color: colors.text }]}>
        {subject.label}
      </Text>
      <View style={[styles.startButton, { backgroundColor: colors.primary }]}>
        <Text style={[styles.startButtonText, { color: colors.textOnPrimary }]}>
          Start Learning
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Handle account deletion
  const handleDeleteAccount = async (): Promise<void> => {
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password to proceed.");
      return;
    }

    setLoading(true);
    try {
      await deleteAccount(password);
      Alert.alert("Success", "Your account has been deleted successfully.");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to delete account. Please try again."
      );
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={[
                styles.avatar,
                {
                  backgroundColor: colors.accent,
                },
              ]}
              onPress={() => navigation.navigate("Profile")}
              activeOpacity={0.8}
            >
              <Text style={styles.avatarEmoji}>{displayProfile.emoji}</Text>
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Hello there! 👋
              </Text>
              <Text
                style={[styles.headerSubtitle, { color: colors.textSecondary }]}
              >
                Grade {displayProfile.grade} • {displayProfile.language}
              </Text>
              {currentUser?.email && (
                <Text
                  style={[styles.headerEmail, { color: colors.textTertiary }]}
                >
                  {currentUser.email}
                </Text>
              )}
            </View>

            {/* Theme Toggle Button */}
            <View style={styles.themeToggle}>
              <ThemeToggleButton size="medium" />
            </View>

            {!displayProfile.isPremium && (
              <TouchableOpacity
                style={[
                  styles.premiumButton,
                  {
                    backgroundColor: colors.warning,
                  },
                ]}
                onPress={() => navigation.navigate("Premium")}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.premiumButtonText,
                    { color: colors.textOnPrimary },
                  ]}
                >
                  ✨ Premium
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Latest Activity */}
        <View style={styles.section}>
          <LatestActivityCard />
        </View>

        {/* Content Sections */}
        <View style={styles.content}>
          {/* Your Progress Section */}
          {attemptedSubjects.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>🏆</Text>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Your Progress
                </Text>
              </View>
              {attemptedSubjects.map((subject: Subject) => (
                <AttemptedSubjectCard key={subject.key} subject={subject} />
              ))}
            </View>
          )}

          {/* Explore New Subjects */}
          {unexploredSubjects.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>🚀</Text>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Explore New Subjects
                </Text>
              </View>
              <View style={styles.unexploredContainer}>
                {unexploredSubjects.map((subject: Subject) => (
                  <UnexploredSubjectCard key={subject.key} subject={subject} />
                ))}
              </View>
            </View>
          )}

          {/* Premium Banner */}
          {!displayProfile.isPremium && (
            <TouchableOpacity
              style={[
                styles.premiumBanner,
                {
                  backgroundColor: colors.accent,
                },
              ]}
              onPress={() => navigation.navigate("Premium")}
              activeOpacity={0.9}
            >
              <View style={styles.premiumBannerContent}>
                <View style={styles.premiumBannerText}>
                  <Text
                    style={[
                      styles.premiumBannerTitle,
                      { color: colors.textOnPrimary },
                    ]}
                  >
                    🚀 Go Premium!
                  </Text>
                  <Text
                    style={[
                      styles.premiumBannerSubtitle,
                      { color: colors.textOnPrimary },
                    ]}
                  >
                    • Unlock all subjects & advanced topics{"\n"}• Get detailed
                    progress reports{"\n"}• Ad-free experience & offline mode
                    {"\n"}• Access to exclusive games & stories
                  </Text>
                </View>
                <View
                  style={[
                    styles.premiumBannerIcon,
                    { backgroundColor: colors.surfaceVariant },
                  ]}
                >
                  <Text style={styles.premiumBannerIconText}>⭐</Text>
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
        <View
          style={[styles.modalOverlay, { backgroundColor: colors.background }]}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.modalTitle, { color: colors.error }]}>
              Delete Account
            </Text>
            <Text
              style={[styles.modalSubtitle, { color: colors.textSecondary }]}
            >
              This action is permanent and cannot be undone. Please enter your
              password to confirm.
            </Text>
            <View style={styles.modalInputContainer}>
              <Text style={[styles.modalLabel, { color: colors.text }]}>
                Password
              </Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.background,
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                editable={!loading}
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.secondary },
                ]}
                onPress={closeModal}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: colors.textOnSecondary },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: loading ? colors.disabled : colors.error },
                ]}
                onPress={handleDeleteAccount}
                disabled={loading || !password.trim()}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: colors.textOnPrimary },
                  ]}
                >
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textSecondary: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  headerEmail: {
    fontSize: 14,
  },
  themeToggle: {
    marginRight: 12,
  },
  premiumButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  premiumButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  section: {
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  sectionEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  badgeInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 20,
  },
  cardContent: {
    padding: 24,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "medium",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 16,
  },
  scoreValue: {
    fontWeight: "bold",
  },
  scoreTotal: {
    fontSize: 16,
  },
  percentage: {
    fontSize: 30,
    fontWeight: "800",
  },
  attemptedCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
  },
  attemptedCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  attemptedCardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  attemptedCardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  activeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  attemptedCardStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "medium",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statRight: {
    alignItems: "flex-end",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  unexploredContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  unexploredCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
  },
  unexploredCardTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  startButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  startButtonText: {
    fontSize: 12,
    fontWeight: "medium",
  },
  premiumBanner: {
    borderRadius: 24,
    padding: 24,
  },
  premiumBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  premiumBannerText: {
    flex: 1,
  },
  premiumBannerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 8,
  },
  premiumBannerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  premiumBannerIcon: {
    borderRadius: 9999,
    padding: 16,
    marginLeft: 16,
  },
  premiumBannerIconText: {
    fontSize: 30,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  modalSubtitle: {
    textAlign: "center",
    marginBottom: 24,
  },
  modalInputContainer: {
    marginBottom: 24,
  },
  modalLabel: {
    marginBottom: 8,
    fontWeight: "medium",
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    fontWeight: "medium",
    textAlign: "center",
  },
});

export default DashboardScreen;
