import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { ColorValue } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../../types/navigation";
import {
  VOCABULARY_LANGUAGES,
  exerciseTypes,
} from "../../constants/vocabulary";
import { VocabularyWord } from "../../types/vocabulary";

const { width } = Dimensions.get("window");

type VocabularyLevelNavigationProp = StackNavigationProp<
  AppStackParamList,
  "VocabularyLevel"
>;

type VocabularyLevelRouteProp = RouteProp<AppStackParamList, "VocabularyLevel">;

interface VocabularyLevelScreenProps {
  navigation: VocabularyLevelNavigationProp;
  route: VocabularyLevelRouteProp;
}

const VocabularyLevelScreen: React.FC<VocabularyLevelScreenProps> = ({
  navigation,
  route,
}) => {
  const { levelId, levelName, levelEmoji, languageCode, languageName } =
    route.params;
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWords();
  }, [levelId, languageCode]);

  const loadWords = () => {
    try {
      const languageConfig = VOCABULARY_LANGUAGES.find(
        (lang) => lang.code === languageCode
      );

      if (languageConfig) {
        const level = languageConfig.levels.find((l) => l.id === levelId);
        if (level) {
          setWords(level.words);
        }
      }
    } catch (error) {
      console.error("Error loading vocabulary words:", error);
      Alert.alert("Error", "Failed to load vocabulary words");
    } finally {
      setLoading(false);
    }
  };

  const handleStartExercise = (
    exerciseType: "flashcards" | "quiz" | "matching"
  ) => {
    if (words.length === 0) {
      Alert.alert("No Words", "No vocabulary words available for this level");
      return;
    }

    navigation.navigate("VocabularyExercise", {
      levelId,
      levelName,
      levelEmoji,
      languageCode,
      languageName,
      words,
      exerciseType,
    });
  };

  const getDifficultyColor = (difficulty: string): [ColorValue, ColorValue] => {
    switch (difficulty) {
      case "beginner":
        return ["#56ab2f", "#a8e6cf"];
      case "intermediate":
        return ["#f093fb", "#f5576c"];
      case "advanced":
        return ["#4facfe", "#00f2fe"];
      default:
        return ["#667eea", "#764ba2"];
    }
  };

  const getExerciseIcon = (type: string) => {
    switch (type) {
      case "flashcards":
        return "layers-outline";
      case "quiz":
        return "help-circle-outline";
      case "matching":
        return "git-merge-outline";
      default:
        return "book-outline";
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={getDifficultyColor(words[0]?.difficulty || "beginner")}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Loading...</Text>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={getDifficultyColor(words[0]?.difficulty || "beginner")}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {levelEmoji} {levelName}
            </Text>
            <Text style={styles.headerSubtitle}>
              {languageName} • {words.length} words
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.exercisesContainer}>
          <Text style={styles.sectionTitle}>Choose Exercise Type</Text>
          <Text style={styles.sectionDescription}>
            Different ways to learn and practice your vocabulary
          </Text>

          {exerciseTypes.map((exercise, index) => (
            <TouchableOpacity
              key={exercise.type}
              style={[
                styles.exerciseCard,
                { marginTop: index === 0 ? 20 : 15 },
              ]}
              onPress={() => handleStartExercise(exercise.type as any)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={exercise.color}
                style={styles.exerciseGradient}
              >
                <View style={styles.exerciseContent}>
                  <View style={styles.exerciseLeft}>
                    <View style={styles.exerciseIconContainer}>
                      <Ionicons
                        name={exercise.icon as any}
                        size={28}
                        color="white"
                      />
                    </View>
                    <View style={styles.exerciseTextContainer}>
                      <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                      <Text style={styles.exerciseDescription}>
                        {exercise.description}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.exerciseRight}>
                    <Ionicons name="chevron-forward" size={24} color="white" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.wordsPreviewContainer}>
          <Text style={styles.previewTitle}>📖 Word Preview</Text>
          <Text style={styles.previewDescription}>
            Here are some words you'll learn:
          </Text>

          <View style={styles.wordsGrid}>
            {words.slice(0, 6).map((word, index) => (
              <View key={word.id} style={styles.wordPreviewCard}>
                <Text style={styles.wordPreviewText}>{word.word}</Text>
                <Text style={styles.wordPreviewTranslation}>
                  {word.translation}
                </Text>
              </View>
            ))}
          </View>

          {words.length > 6 && (
            <Text style={styles.moreWordsText}>
              +{words.length - 6} more words to discover!
            </Text>
          )}
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
  exercisesContainer: {
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
  exerciseCard: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  exerciseGradient: {
    padding: 20,
  },
  exerciseContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exerciseLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  exerciseIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  exerciseTextContainer: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  exerciseDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
    lineHeight: 18,
  },
  exerciseRight: {
    padding: 5,
  },
  wordsPreviewContainer: {
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
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 15,
  },
  wordsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  wordPreviewCard: {
    width: (width - 80) / 2,
    backgroundColor: "#f7fafc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#667eea",
  },
  wordPreviewText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2d3748",
  },
  wordPreviewTranslation: {
    fontSize: 14,
    color: "#718096",
    marginTop: 2,
  },
  moreWordsText: {
    fontSize: 14,
    color: "#667eea",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },
});

export default VocabularyLevelScreen;
