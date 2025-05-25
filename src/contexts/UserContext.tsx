import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "./AuthContext";
import {
  UserProfile,
  UserStats,
  UserContextType,
  UserProviderProps,
} from "../types/user";
import { ExerciseResult } from "../types/math";

const UserContext = createContext<UserContextType>({} as UserContextType);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentResults, setRecentResults] = useState<ExerciseResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState<Partial<UserProfile>>(
    {}
  );

  const isProfileComplete =
    userProfile !== null &&
    !!userProfile.language &&
    !!userProfile.gender &&
    typeof userProfile.grade === "number" &&
    userProfile.grade > 0;

  // Load user profile when user changes
  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
    } else {
      setUserProfile(null);
      setUserStats(null);
      setRecentResults([]);
      setLoading(false);
    }
  }, [currentUser]);

  const loadUserProfile = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));

      if (userDoc.exists()) {
        const data = userDoc.data();
        const profile: UserProfile = {
          uid: currentUser.uid,
          email: currentUser.email!,
          emoji: data.emoji,
          language: data.language,
          languageCode: data.languageCode,
          gender: data.gender,
          grade: data.grade,
          isPremium: data.isPremium || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
        setUserProfile(profile);

        // Load additional data
        await Promise.all([fetchUserStats(), fetchRecentResults()]);
      } else {
        // If no profile exists, set to null (onboarding will handle creating it)
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) throw new Error("No authenticated user");

    try {
      const now = new Date();
      let updatedProfile: UserProfile;

      if (userProfile) {
        // Update existing profile
        updatedProfile = {
          ...userProfile,
          ...updates,
          updatedAt: now,
        };

        await updateDoc(doc(db, "users", currentUser.uid), {
          ...updates,
          updatedAt: now,
        });
      } else {
        // Create new profile
        updatedProfile = {
          uid: currentUser.uid,
          email: currentUser.email!,
          language: updates.language || "en",
          gender: updates.gender || "boy",
          grade: updates.grade || 1,
          isPremium: updates.isPremium || false,
          createdAt: now,
          updatedAt: now,
          ...updates,
        };

        await setDoc(doc(db, "users", currentUser.uid), updatedProfile);
      }

      setUserProfile(updatedProfile);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const clearOnboardingData = () => {
    setOnboardingData({});
  };

  const saveExerciseResult = async (
    result: Omit<ExerciseResult, "id" | "userId">
  ) => {
    if (!currentUser) throw new Error("No authenticated user");

    try {
      const exerciseResult: Omit<ExerciseResult, "id"> = {
        ...result,
        userId: currentUser.uid,
      };

      const docRef = await addDoc(
        collection(db, "exerciseResults"),
        exerciseResult
      );

      // Add to local state
      const newResult: ExerciseResult = {
        ...exerciseResult,
        id: docRef.id,
      };

      setRecentResults((prev) => [newResult, ...prev.slice(0, 9)]); // Keep last 10 results

      // Refresh stats
      await fetchUserStats();
    } catch (error) {
      console.error("Error saving exercise result:", error);
      throw error;
    }
  };

  const fetchUserStats = async () => {
    if (!currentUser) return;

    try {
      const resultsQuery = query(
        collection(db, "exerciseResults"),
        where("userId", "==", currentUser.uid),
        orderBy("completedAt", "desc")
      );

      const snapshot = await getDocs(resultsQuery);
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt?.toDate() || new Date(),
      })) as ExerciseResult[];

      if (results.length === 0) {
        setUserStats({
          totalExercises: 0,
          averageScore: 0,
          favoriteSubject: "Math",
          streak: 0,
          lastActive: new Date(),
          mathStats: {
            totalCompleted: 0,
            averageScore: 0,
            bestTopic: "Addition",
          },
          readingStats: {
            totalCompleted: 0,
            averageScore: 0,
          },
          scienceStats: {
            totalCompleted: 0,
            averageScore: 0,
          },
          writingStats: {
            totalCompleted: 0,
            averageScore: 0,
          },
          vocabularyStats: {
            totalCompleted: 0,
            averageScore: 0,
          },
        });
        return;
      }

      // Calculate stats
      const totalExercises = results.length;
      const averageScore = Math.round(
        results.reduce((sum, result) => sum + result.percentage, 0) /
          totalExercises
      );

      // Find favorite subject
      const subjectCounts = results.reduce((acc, result) => {
        acc[result.subject] = (acc[result.subject] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const favoriteSubject = Object.keys(subjectCounts).reduce((a, b) =>
        subjectCounts[a] > subjectCounts[b] ? a : b
      );

      // Calculate streak (consecutive days with exercises)
      const streak = calculateStreak(results);

      const getSubjectStats = (subject: string) => {
        const subjectResults = results.filter((r) => r.subject === subject);
        const totalCompleted = subjectResults.length;
        const averageScore =
          totalCompleted > 0
            ? Math.round(
                subjectResults.reduce(
                  (sum, result) => sum + result.percentage,
                  0
                ) / totalCompleted
              )
            : 0;
        return { totalCompleted, averageScore };
      };

      const mathResults = results.filter((r) => r.subject === "Math");
      const mathStats = {
        ...getSubjectStats("Math"),
        bestTopic:
          mathResults.length > 0 ? getBestTopic(mathResults) : "Addition",
      };

      const readingStats = getSubjectStats("Reading");
      const scienceStats = getSubjectStats("Science");
      const writingStats = getSubjectStats("Writing");
      const vocabularyStats = getSubjectStats("Vocabulary");

      setUserStats({
        totalExercises,
        averageScore,
        favoriteSubject,
        streak,
        lastActive: results[0].completedAt,
        mathStats,
        readingStats,
        scienceStats,
        writingStats,
        vocabularyStats,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const fetchRecentResults = async () => {
    if (!currentUser) return;

    try {
      const resultsQuery = query(
        collection(db, "exerciseResults"),
        where("userId", "==", currentUser.uid),
        orderBy("completedAt", "desc"),
        limit(10)
      );

      const snapshot = await getDocs(resultsQuery);
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt?.toDate() || new Date(),
      })) as ExerciseResult[];

      setRecentResults(results);
    } catch (error) {
      console.error("Error fetching recent results:", error);
    }
  };

  const calculateStreak = (results: ExerciseResult[]): number => {
    if (results.length === 0) return 0;

    const sortedResults = results.sort(
      (a, b) => b.completedAt.getTime() - a.completedAt.getTime()
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = new Date(today);

    for (const result of sortedResults) {
      const resultDate = new Date(result.completedAt);
      resultDate.setHours(0, 0, 0, 0);

      if (resultDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (resultDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    return streak;
  };

  const getBestTopic = (mathResults: ExerciseResult[]): string => {
    const topicScores = mathResults.reduce((acc, result) => {
      if (!acc[result.topic]) {
        acc[result.topic] = { total: 0, count: 0 };
      }
      acc[result.topic].total += result.percentage;
      acc[result.topic].count++;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    let bestTopic = "Addition";
    let bestAverage = 0;

    Object.entries(topicScores).forEach(([topic, data]) => {
      const average = data.total / data.count;
      if (average > bestAverage) {
        bestAverage = average;
        bestTopic = topic;
      }
    });

    return bestTopic;
  };

  const value: UserContextType = {
    userProfile,
    userStats,
    recentResults,
    isProfileComplete,
    loading,
    onboardingData,
    updateUserProfile,
    setOnboardingData,
    clearOnboardingData,
    saveExerciseResult,
    fetchUserStats,
    fetchRecentResults,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
