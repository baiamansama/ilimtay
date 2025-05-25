import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../../types/navigation";
import { VocabularyWord } from "../../types/vocabulary";
import { useUser } from "../../contexts/UserContext";

const { width } = Dimensions.get("window");

type VocabularyExerciseNavigationProp = StackNavigationProp<
  AppStackParamList,
  "VocabularyExercise"
>;

type VocabularyExerciseRouteProp = RouteProp<
  AppStackParamList,
  "VocabularyExercise"
>;

interface VocabularyExerciseScreenProps {
  navigation: VocabularyExerciseNavigationProp;
  route: VocabularyExerciseRouteProp;
}

interface QuizQuestion {
  word: VocabularyWord;
  options: string[];
  correctAnswer: string;
}

const VocabularyExerciseScreen: React.FC<VocabularyExerciseScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    levelId,
    levelName,
    levelEmoji,
    languageCode,
    languageName,
    words,
    exerciseType,
  } = route.params;
  const { saveExerciseResult } = useUser();

  // Common state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Flashcard specific state
  const [showTranslation, setShowTranslation] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));

  // Quiz specific state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Matching specific state
  const [matchingPairs, setMatchingPairs] = useState<
    Array<{ word: string; translation: string; matched: boolean }>
  >([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState<string | null>(
    null
  );

  useEffect(() => {
    initializeExercise();
  }, [exerciseType]);

  const initializeExercise = () => {
    switch (exerciseType) {
      case "quiz":
        generateQuizQuestions();
        break;
      case "matching":
        initializeMatching();
        break;
      case "flashcards":
      default:
        // Flashcards don't need special initialization
        break;
    }
  };

  const generateQuizQuestions = () => {
    if (!words || words.length === 0) return;

    const questions: QuizQuestion[] = words.map((word) => {
      const otherWords = words.filter((w) => w.id !== word.id);
      const wrongAnswers = otherWords
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => w.translation);

      const options = [...wrongAnswers, word.translation].sort(
        () => Math.random() - 0.5
      );

      return {
        word,
        options,
        correctAnswer: word.translation,
      };
    });

    setQuizQuestions(questions.sort(() => Math.random() - 0.5));
  };

  const initializeMatching = () => {
    if (!words || words.length === 0) return;

    const pairs = words.slice(0, 6).map((word) => ({
      word: word.word,
      translation: word.translation,
      matched: false,
    }));
    setMatchingPairs(pairs);
  };

  const handleFlashcardFlip = () => {
    setShowTranslation(!showTranslation);
    Animated.timing(flipAnimation, {
      toValue: showTranslation ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleFlashcardNext = (known: boolean) => {
    if (known) {
      setScore((prev) => prev + 1);
    }

    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowTranslation(false);
      flipAnimation.setValue(0);
    } else {
      completeExercise();
    }
  };

  const handleQuizAnswer = (answer: string) => {
    if (!quizQuestions[currentIndex]) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === quizQuestions[currentIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < quizQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        completeExercise();
      }
    }, 1500);
  };

  const handleMatchingSelect = (
    type: "word" | "translation",
    value: string
  ) => {
    if (type === "word") {
      setSelectedWord(selectedWord === value ? null : value);
    } else {
      setSelectedTranslation(selectedTranslation === value ? null : value);
    }

    // Check if both are selected
    if (
      (type === "word" && selectedTranslation) ||
      (type === "translation" && selectedWord)
    ) {
      const wordToCheck = type === "word" ? value : selectedWord;
      const translationToCheck =
        type === "translation" ? value : selectedTranslation;

      const pair = matchingPairs.find(
        (p) => p.word === wordToCheck && p.translation === translationToCheck
      );

      if (pair) {
        setScore((prev) => prev + 1);
        setMatchingPairs((prev) =>
          prev.map((p) =>
            p.word === wordToCheck ? { ...p, matched: true } : p
          )
        );
      }

      setSelectedWord(null);
      setSelectedTranslation(null);

      // Check if all matched
      setTimeout(() => {
        if (matchingPairs.filter((p) => !p.matched).length <= 1) {
          completeExercise();
        }
      }, 500);
    }
  };

  const completeExercise = async () => {
    setIsCompleted(true);

    const totalQuestions =
      exerciseType === "matching" ? matchingPairs.length : words.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    try {
      await saveExerciseResult({
        subject: "Vocabulary",
        topic: `${levelName} - ${exerciseType}`,
        difficulty: words[0]?.difficulty || "beginner",
        score,
        totalQuestions,
        percentage,
        completedAt: new Date(),
      });
    } catch (error) {
      console.error("Error saving exercise result:", error);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsCompleted(false);
    setShowTranslation(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setSelectedWord(null);
    setSelectedTranslation(null);
    flipAnimation.setValue(0);
    initializeExercise();
  };

  const renderFlashcard = () => {
    if (!words || words.length === 0 || !words[currentIndex]) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No words available</Text>
        </View>
      );
    }

    const currentWord = words[currentIndex];

    const frontAnimatedStyle = {
      transform: [
        {
          rotateY: flipAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "180deg"],
          }),
        },
      ],
    };

    const backAnimatedStyle = {
      transform: [
        {
          rotateY: flipAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ["180deg", "360deg"],
          }),
        },
      ],
    };

    return (
      <View style={styles.flashcardContainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {words.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / words.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.flashcard}
          onPress={handleFlashcardFlip}
          activeOpacity={0.9}
        >
          <Animated.View style={[styles.flashcardSide, frontAnimatedStyle]}>
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.flashcardGradient}
            >
              <Text style={styles.flashcardWord}>{currentWord.word}</Text>
              <Text style={styles.flashcardHint}>Tap to see translation</Text>
            </LinearGradient>
          </Animated.View>

          <Animated.View
            style={[
              styles.flashcardSide,
              styles.flashcardBack,
              backAnimatedStyle,
            ]}
          >
            <LinearGradient
              colors={["#56ab2f", "#a8e6cf"]}
              style={styles.flashcardGradient}
            >
              <Text style={styles.flashcardTranslation}>
                {currentWord.translation}
              </Text>
              <Text style={styles.flashcardExample}>{currentWord.example}</Text>
              <Text style={styles.flashcardExampleTranslation}>
                {currentWord.exampleTranslation}
              </Text>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        {showTranslation && (
          <View style={styles.flashcardButtons}>
            <TouchableOpacity
              style={[styles.flashcardButton, styles.wrongButton]}
              onPress={() => handleFlashcardNext(false)}
            >
              <Ionicons name="close" size={24} color="white" />
              <Text style={styles.buttonText}>Hard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.flashcardButton, styles.correctButton]}
              onPress={() => handleFlashcardNext(true)}
            >
              <Ionicons name="checkmark" size={24} color="white" />
              <Text style={styles.buttonText}>Easy</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderQuiz = () => {
    if (
      !quizQuestions ||
      quizQuestions.length === 0 ||
      !quizQuestions[currentIndex]
    ) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Loading quiz questions...</Text>
        </View>
      );
    }

    const currentQuestion = quizQuestions[currentIndex];

    return (
      <View style={styles.quizContainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {quizQuestions.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    ((currentIndex + 1) / quizQuestions.length) * 100
                  }%`,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>What does this word mean?</Text>
          <View style={styles.wordCard}>
            <Text style={styles.wordText}>{currentQuestion.word.word}</Text>
            {currentQuestion.word.example && (
              <Text style={styles.exampleText}>
                {currentQuestion.word.example}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            let buttonStyle: any[] = [styles.optionButton];
            let textStyle: any[] = [styles.optionText];

            if (showResult && selectedAnswer === option) {
              if (option === currentQuestion.correctAnswer) {
                buttonStyle.push(styles.correctOption);
                textStyle.push(styles.correctOptionText);
              } else {
                buttonStyle.push(styles.wrongOption);
                textStyle.push(styles.wrongOptionText);
              }
            } else if (showResult && option === currentQuestion.correctAnswer) {
              buttonStyle.push(styles.correctOption);
              textStyle.push(styles.correctOptionText);
            }

            return (
              <TouchableOpacity
                key={index}
                style={buttonStyle}
                onPress={() => !showResult && handleQuizAnswer(option)}
                disabled={showResult}
              >
                <Text style={textStyle}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderMatching = () => {
    if (!matchingPairs || matchingPairs.length === 0) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Loading matching pairs...</Text>
        </View>
      );
    }

    const unmatched = matchingPairs.filter((p) => !p.matched);
    const words = unmatched.map((p) => p.word);
    const translations = unmatched
      .map((p) => p.translation)
      .sort(() => Math.random() - 0.5);

    return (
      <View style={styles.matchingContainer}>
        <Text style={styles.matchingTitle}>
          Match words with their translations
        </Text>
        <Text style={styles.matchingScore}>
          Matched: {score} / {matchingPairs.length}
        </Text>

        <View style={styles.matchingGrid}>
          <View style={styles.matchingColumn}>
            <Text style={styles.columnTitle}>Words</Text>
            {words.map((word, index) => (
              <TouchableOpacity
                key={`word-${index}`}
                style={[
                  styles.matchingItem,
                  selectedWord === word && styles.selectedItem,
                ]}
                onPress={() => handleMatchingSelect("word", word)}
              >
                <Text
                  style={[
                    styles.matchingItemText,
                    selectedWord === word && styles.selectedItemText,
                  ]}
                >
                  {word}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.matchingColumn}>
            <Text style={styles.columnTitle}>Translations</Text>
            {translations.map((translation, index) => (
              <TouchableOpacity
                key={`translation-${index}`}
                style={[
                  styles.matchingItem,
                  selectedTranslation === translation && styles.selectedItem,
                ]}
                onPress={() => handleMatchingSelect("translation", translation)}
              >
                <Text
                  style={[
                    styles.matchingItemText,
                    selectedTranslation === translation &&
                      styles.selectedItemText,
                  ]}
                >
                  {translation}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderResults = () => {
    const totalQuestions =
      exerciseType === "matching" ? matchingPairs.length : words.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>🎉 Exercise Complete!</Text>

        <View style={styles.scoreCard}>
          <Text style={styles.scorePercentage}>{percentage}%</Text>
          <Text style={styles.scoreText}>
            {score} out of {totalQuestions} correct
          </Text>
        </View>

        <View style={styles.resultButtons}>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={handleRestart}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.restartButtonText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Ionicons name="home" size={20} color="white" />
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getExerciseTitle = () => {
    switch (exerciseType) {
      case "flashcards":
        return "Flashcards";
      case "quiz":
        return "Quiz";
      case "matching":
        return "Matching";
      default:
        return "Exercise";
    }
  };

  // Early return if no words
  if (!words || words.length === 0) {
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
              <Text style={styles.headerTitle}>
                {levelEmoji} {getExerciseTitle()}
              </Text>
              <Text style={styles.headerSubtitle}>
                {levelName} • {languageName}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No vocabulary words available</Text>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.headerTitle}>
              {levelEmoji} {getExerciseTitle()}
            </Text>
            <Text style={styles.headerSubtitle}>
              {levelName} • {languageName}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {isCompleted
          ? renderResults()
          : exerciseType === "flashcards"
          ? renderFlashcard()
          : exerciseType === "quiz"
          ? renderQuiz()
          : renderMatching()}
      </View>
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
    paddingBottom: 20,
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
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a5568",
    textAlign: "center",
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#667eea",
    borderRadius: 4,
  },
  // Error container styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#718096",
    textAlign: "center",
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: "#667eea",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  goBackButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  // Flashcard styles
  flashcardContainer: {
    flex: 1,
  },
  flashcard: {
    height: 300,
    marginBottom: 30,
  },
  flashcardSide: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius: 20,
    overflow: "hidden",
  },
  flashcardBack: {
    transform: [{ rotateY: "180deg" }],
  },
  flashcardGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  flashcardWord: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  flashcardTranslation: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 15,
  },
  flashcardExample: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 8,
    fontStyle: "italic",
  },
  flashcardExampleTranslation: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontStyle: "italic",
  },
  flashcardHint: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  flashcardButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  flashcardButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    justifyContent: "center",
  },
  wrongButton: {
    backgroundColor: "#e53e3e",
  },
  correctButton: {
    backgroundColor: "#38a169",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  // Quiz styles
  quizContainer: {
    flex: 1,
  },
  questionContainer: {
    marginBottom: 30,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2d3748",
    textAlign: "center",
    marginBottom: 20,
  },
  wordCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  wordText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 10,
  },
  exampleText: {
    fontSize: 16,
    color: "#718096",
    fontStyle: "italic",
    textAlign: "center",
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  optionText: {
    fontSize: 16,
    color: "#2d3748",
    textAlign: "center",
    fontWeight: "500",
  },
  correctOption: {
    backgroundColor: "#c6f6d5",
    borderColor: "#38a169",
  },
  correctOptionText: {
    color: "#22543d",
  },
  wrongOption: {
    backgroundColor: "#fed7d7",
    borderColor: "#e53e3e",
  },
  wrongOptionText: {
    color: "#742a2a",
  },
  // Matching styles
  matchingContainer: {
    flex: 1,
  },
  matchingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3748",
    textAlign: "center",
    marginBottom: 10,
  },
  matchingScore: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    marginBottom: 30,
  },
  matchingGrid: {
    flexDirection: "row",
    flex: 1,
  },
  matchingColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a5568",
    textAlign: "center",
    marginBottom: 15,
  },
  matchingItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  selectedItem: {
    backgroundColor: "#ebf8ff",
    borderColor: "#667eea",
  },
  matchingItemText: {
    fontSize: 14,
    color: "#2d3748",
    textAlign: "center",
    fontWeight: "500",
  },
  selectedItemText: {
    color: "#667eea",
    fontWeight: "600",
  },
  // Results styles
  resultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2d3748",
    textAlign: "center",
    marginBottom: 30,
  },
  scoreCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    marginBottom: 40,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minWidth: 250,
  },
  scorePercentage: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#667eea",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
  },
  resultButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  restartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#667eea",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  restartButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#38a169",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  homeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default VocabularyExerciseScreen;
