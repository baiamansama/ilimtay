import { ExerciseResult } from "./math";
import { ReactNode } from "react";
export interface UserProfile {
  uid: string;
  email: string;
  language: string;
  gender: "boy" | "girl";
  grade: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface Gender {
  value: "boy" | "girl";
  emoji: string;
  label: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  emoji?: string;
  language: string;
  languageCode?: string;
  gender: "boy" | "girl";
  grade: number;
  isPremium?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface UserStats {
  totalExercises: number;
  averageScore: number;
  favoriteSubject: string;
  streak: number;
  lastActive: Date;
  mathStats: {
    totalCompleted: number;
    averageScore: number;
    bestTopic: string;
  };
}

export interface UserContextType {
  userProfile: UserProfile | null;
  userStats: UserStats | null;
  recentResults: ExerciseResult[];
  isProfileComplete: boolean;
  loading: boolean;
  onboardingData: Partial<UserProfile>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setOnboardingData: (data: Partial<UserProfile>) => void;
  clearOnboardingData: () => void;
  saveExerciseResult: (
    result: Omit<ExerciseResult, "id" | "userId">
  ) => Promise<void>;
  fetchUserStats: () => Promise<void>;
  fetchRecentResults: () => Promise<void>;
}
export interface UserProviderProps {
  children: ReactNode;
}
