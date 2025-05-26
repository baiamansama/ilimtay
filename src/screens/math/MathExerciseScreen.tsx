import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Animated,
} from "react-native";
import { MathExerciseProps } from "../../types/navigation";
import { useUser } from "../../contexts/UserContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Question } from "../../types/math";

const MathExerciseScreen: React.FC<MathExerciseProps> = ({
  navigation,
  route,
}) => {
  const { topic, difficulty } = route.params;
  const { saveExerciseResult } = useUser();
  const { colors } = useTheme();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Generate random questions based on topic and difficulty
  const generateQuestions = (): Question[] => {
    const questionCount = 5;
    const generatedQuestions: Question[] = [];

    for (let i = 0; i < questionCount; i++) {
      let question: Question;

      switch (topic) {
        case "Addition":
          question = generateAdditionQuestion(difficulty, i + 1);
          break;
        case "Subtraction":
          question = generateSubtractionQuestion(difficulty, i + 1);
          break;
        case "Multiplication":
          question = generateMultiplicationQuestion(difficulty, i + 1);
          break;
        case "Division":
          question = generateDivisionQuestion(difficulty, i + 1);
          break;
        default:
          question = generateAdditionQuestion(difficulty, i + 1);
      }

      generatedQuestions.push(question);
    }

    return generatedQuestions;
  };

  const generateAdditionQuestion = (
    difficulty: string,
    id: number
  ): Question => {
    let num1: number, num2: number;

    switch (difficulty) {
      case "Easy":
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        break;
      case "Medium":
        num1 = Math.floor(Math.random() * 50) + 10;
        num2 = Math.floor(Math.random() * 50) + 10;
        break;
      case "Hard":
        num1 = Math.floor(Math.random() * 200) + 50;
        num2 = Math.floor(Math.random() * 200) + 50;
        break;
      default:
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
    }

    const answer = num1 + num2;
    const options = generateOptions(answer);

    return {
      id,
      question: `${num1} + ${num2}`,
      answer,
      options,
    };
  };

  const generateSubtractionQuestion = (
    difficulty: string,
    id: number
  ): Question => {
    let num1: number, num2: number;

    switch (difficulty) {
      case "Easy":
        num1 = Math.floor(Math.random() * 10) + 5;
        num2 = Math.floor(Math.random() * num1) + 1;
        break;
      case "Medium":
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * num1) + 1;
        break;
      case "Hard":
        num1 = Math.floor(Math.random() * 200) + 100;
        num2 = Math.floor(Math.random() * num1) + 1;
        break;
      default:
        num1 = Math.floor(Math.random() * 10) + 5;
        num2 = Math.floor(Math.random() * num1) + 1;
    }

    const answer = num1 - num2;
    const options = generateOptions(answer);

    return {
      id,
      question: `${num1} - ${num2}`,
      answer,
      options,
    };
  };

  const generateMultiplicationQuestion = (
    difficulty: string,
    id: number
  ): Question => {
    let num1: number, num2: number;

    switch (difficulty) {
      case "Easy":
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
        break;
      case "Medium":
        num1 = Math.floor(Math.random() * 10) + 2;
        num2 = Math.floor(Math.random() * 10) + 2;
        break;
      case "Hard":
        num1 = Math.floor(Math.random() * 15) + 5;
        num2 = Math.floor(Math.random() * 15) + 5;
        break;
      default:
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
    }

    const answer = num1 * num2;
    const options = generateOptions(answer);

    return {
      id,
      question: `${num1} × ${num2}`,
      answer,
      options,
    };
  };

  const generateDivisionQuestion = (
    difficulty: string,
    id: number
  ): Question => {
    let answer: number, num2: number;

    switch (difficulty) {
      case "Easy":
        answer = Math.floor(Math.random() * 8) + 1;
        num2 = Math.floor(Math.random() * 8) + 1;
        break;
      case "Medium":
        answer = Math.floor(Math.random() * 15) + 2;
        num2 = Math.floor(Math.random() * 10) + 2;
        break;
      case "Hard":
        answer = Math.floor(Math.random() * 25) + 5;
        num2 = Math.floor(Math.random() * 15) + 3;
        break;
      default:
        answer = Math.floor(Math.random() * 8) + 1;
        num2 = Math.floor(Math.random() * 8) + 1;
    }

    const num1 = answer * num2;
    const options = generateOptions(answer);

    return {
      id,
      question: `${num1} ÷ ${num2}`,
      answer,
      options,
    };
  };

  const generateOptions = (correctAnswer: number): number[] => {
    const options = [correctAnswer];
    const range = Math.max(10, Math.floor(correctAnswer * 0.5));

    while (options.length < 4) {
      const wrongAnswer =
        correctAnswer + Math.floor(Math.random() * range * 2) - range;
      if (
        wrongAnswer !== correctAnswer &&
        wrongAnswer > 0 &&
        !options.includes(wrongAnswer)
      ) {
        options.push(wrongAnswer);
      }
    }

    return options.sort(() => Math.random() - 0.5);
  };

  // Initialize questions
  useEffect(() => {
    const newQuestions = generateQuestions();
    setQuestions(newQuestions);
  }, [topic, difficulty]);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, showResult]);

  const handleTimeUp = () => {
    setTimerActive(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setShowResult(true);
  };

  const handleAnswerSelect = (answer: number) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setTimerActive(false);

    const correct = answer === questions[currentQuestionIndex].answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeLeft(30);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimerActive(true);

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      handleFinishExercise();
    }
  };

  const handleFinishExercise = async () => {
    const percentage = Math.round((score / questions.length) * 100);

    try {
      await saveExerciseResult({
        subject: "Math",
        topic,
        difficulty,
        score,
        totalQuestions: questions.length,
        percentage,
        completedAt: new Date(),
      });
    } catch (error) {
      console.error("Error saving exercise result:", error);
    }

    setShowFinalResults(true);
  };

  const getScoreEmoji = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "🏆";
    if (percentage >= 60) return "⭐";
    if (percentage >= 40) return "👍";
    return "💪";
  };

  const getEncouragementMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Amazing work! You're a math star!";
    if (percentage >= 60) return "Great job! Keep practicing!";
    if (percentage >= 40) return "Good effort! Try again to improve!";
    return "Don't give up! Practice makes perfect!";
  };

  if (questions.length === 0) {
    return (
      <SafeAreaView
        className={`flex-1 ${colors.background} justify-center items-center`}
      >
        <Text className={`text-2xl ${colors.text}`}>
          Loading questions... 🤔
        </Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView className={`flex-1 ${colors.background}`}>
      {/* Header */}
      <View className={`${colors.card} rounded-b-3xl shadow-lg px-6 py-6 mb-6`}>
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            className={`w-10 h-10 rounded-full ${colors.secondary} items-center justify-center`}
            onPress={() => navigation.goBack()}
          >
            <Text className={`text-xl ${colors.text}`}>←</Text>
          </TouchableOpacity>

          <View className="flex-1 mx-4">
            <Text className={`text-lg font-bold ${colors.text} text-center`}>
              {topic} - {difficulty}
            </Text>
            <Text className={`${colors.textSecondary} text-center`}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
          </View>

          <View className="items-center">
            <Text className={`text-2xl font-bold ${colors.primary}`}>
              {timeLeft}
            </Text>
            <Text className={`text-xs ${colors.textTertiary}`}>seconds</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className={`${colors.secondary} rounded-full h-2 mb-2`}>
          <View
            className={`${colors.primary} h-2 rounded-full`}
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          />
        </View>

        <Text className={`text-center ${colors.textSecondary} text-sm`}>
          Score: {score}/{questions.length}
        </Text>
      </View>

      {/* Question */}
      <Animated.View style={{ opacity: fadeAnim }} className="flex-1 px-6">
        <View className={`${colors.card} rounded-3xl p-8 mb-6 shadow-lg`}>
          <Text className={`text-center ${colors.textSecondary} mb-4`}>
            What is
          </Text>
          <Text
            className={`text-4xl font-bold text-center ${colors.text} mb-4`}
          >
            {currentQuestion.question}
          </Text>
          <Text className={`text-center ${colors.textSecondary}`}>?</Text>
        </View>

        {/* Answer Options */}
        <View className="flex-row flex-wrap justify-between">
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              className={`w-[48%] mb-4 p-6 rounded-2xl shadow-md border-2 ${
                showResult
                  ? option === currentQuestion.answer
                    ? "bg-green-100 border-green-400"
                    : selectedAnswer === option
                    ? "bg-red-100 border-red-400"
                    : `${colors.surfaceVariant} ${colors.border}`
                  : selectedAnswer === option
                  ? `${colors.primary} bg-opacity-20 ${colors.primary} border-opacity-60`
                  : `${colors.card} ${colors.border}`
              }`}
              onPress={() => handleAnswerSelect(option)}
              disabled={showResult}
            >
              <Text
                className={`text-2xl font-bold text-center ${
                  showResult
                    ? option === currentQuestion.answer
                      ? "text-green-800"
                      : selectedAnswer === option
                      ? "text-red-800"
                      : colors.textSecondary
                    : selectedAnswer === option
                    ? colors.primary
                    : colors.text
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Result Modal */}
      <Modal visible={showResult} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View
            className={`${colors.card} rounded-3xl p-8 items-center shadow-xl`}
          >
            <Text className="text-6xl mb-4">{isCorrect ? "🎉" : "😅"}</Text>
            <Text
              className={`text-2xl font-bold mb-2 ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect
                ? "Correct!"
                : timeLeft === 0
                ? "Time's up!"
                : "Not quite!"}
            </Text>
            {!isCorrect && (
              <Text className={`${colors.textSecondary} mb-4`}>
                The correct answer is {currentQuestion.answer}
              </Text>
            )}
            <TouchableOpacity
              className={`${colors.primary} px-8 py-3 rounded-full shadow-md`}
              onPress={handleNext}
            >
              <Text className="text-white font-bold">
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "See Results"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Final Results Modal */}
      <Modal
        visible={showFinalResults}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View
            className={`${colors.card} rounded-3xl p-8 items-center shadow-xl`}
          >
            <Text className="text-8xl mb-4">{getScoreEmoji()}</Text>
            <Text className={`text-3xl font-bold ${colors.text} mb-2`}>
              Exercise Complete!
            </Text>
            <Text className={`text-xl ${colors.textSecondary} mb-4`}>
              You scored {score} out of {questions.length}
            </Text>
            <Text className={`text-lg text-center ${colors.text} mb-6`}>
              {getEncouragementMessage()}
            </Text>

            <View className="flex-row space-x-4">
              <TouchableOpacity
                className={`${colors.primary} px-6 py-3 rounded-full shadow-md`}
                onPress={() => {
                  setShowFinalResults(false);
                  // Reset state for retry
                  setCurrentQuestionIndex(0);
                  setScore(0);
                  setSelectedAnswer(null);
                  setIsCorrect(null);
                  setTimeLeft(30);
                  setTimerActive(true);
                  setQuestions(generateQuestions());
                }}
              >
                <Text className="text-white font-bold">Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`${colors.success} px-6 py-3 rounded-full shadow-md`}
                onPress={() => {
                  setShowFinalResults(false);
                  setTimeout(() => {
                    navigation.navigate("Dashboard");
                  }, 50);
                }}
              >
                <Text className="text-white font-bold">Back Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MathExerciseScreen;
