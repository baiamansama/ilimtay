import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../../types/navigation";
import { VOCABULARY_LANGUAGES } from "../../constants/vocabulary";
import { useUser } from "../../contexts/UserContext";

const { width } = Dimensions.get("window");

type VocabularySubjectNavigationProp = StackNavigationProp<
  AppStackParamList,
  "VocabularySubject"
>;

interface VocabularySubjectScreenProps {
  navigation: VocabularySubjectNavigationProp;
}

const VocabularySubjectScreen: React.FC<VocabularySubjectScreenProps> = ({
  navigation,
}) => {
  const { userProfile } = useUser();

  // Find current user's language configuration
  const currentLanguageConfig = VOCABULARY_LANGUAGES.find(
    (lang) => lang.code === userProfile?.languageCode || lang.code === "en"
  );

  const handleLevelPress = (
    levelId: string,
    levelName: string,
    levelEmoji: string
  ) => {
    navigation.navigate("VocabularyLevel", {
      levelId,
      levelName,
      levelEmoji,
      languageCode: currentLanguageConfig?.code || "en",
      languageName: currentLanguageConfig?.name || "English",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Vocabulary</Text>
            <Text style={styles.headerSubtitle}>
              {currentLanguageConfig?.flag} {currentLanguageConfig?.nativeName}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.levelsContainer}>
          <Text style={styles.sectionTitle}>Choose Your Level</Text>
          <Text style={styles.sectionDescription}>
            Start with the level that matches your current vocabulary knowledge
          </Text>

          {currentLanguageConfig?.levels.map((level, index) => (
            <TouchableOpacity
              key={level.id}
              style={[styles.levelCard, { marginTop: index === 0 ? 20 : 15 }]}
              onPress={() =>
                handleLevelPress(level.id, level.name, level.emoji)
              }
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  level.difficulty === "beginner"
                    ? ["#56ab2f", "#a8e6cf"]
                    : level.difficulty === "intermediate"
                    ? ["#f093fb", "#f5576c"]
                    : ["#4facfe", "#00f2fe"]
                }
                style={styles.levelGradient}
              >
                <View style={styles.levelContent}>
                  <View style={styles.levelLeft}>
                    <Text style={styles.levelEmoji}>{level.emoji}</Text>
                    <View style={styles.levelTextContainer}>
                      <Text style={styles.levelName}>{level.name}</Text>
                      <Text style={styles.levelDescription}>
                        {level.description}
                      </Text>
                      <Text style={styles.wordCount}>
                        {level.words.length} words
                      </Text>
                    </View>
                  </View>
                  <View style={styles.levelRight}>
                    <Ionicons name="chevron-forward" size={24} color="white" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>📚 Learning Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Practice a little bit every day for best results
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Try to use new words in sentences to remember them better
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Don't worry about mistakes - they help you learn!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  header: {
    paddingTop: 10,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  levelsContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3748",
    textAlign: "center",
  },
  sectionDescription: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  levelCard: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  levelGradient: {
    padding: 20,
  },
  levelContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levelLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  levelEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  levelTextContainer: {
    flex: 1,
  },
  levelName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  levelDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
  },
  wordCount: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
    fontWeight: "600",
  },
  levelRight: {
    padding: 5,
  },
  tipsContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginTop: 30,
    marginBottom: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 15,
  },
  tipsList: {
    marginTop: 5,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  tipBullet: {
    fontSize: 16,
    color: "#667eea",
    marginRight: 10,
    marginTop: 2,
    fontWeight: "bold",
  },
  tipText: {
    fontSize: 14,
    color: "#4a5568",
    lineHeight: 20,
    flex: 1,
  },
});

export default VocabularySubjectScreen;
