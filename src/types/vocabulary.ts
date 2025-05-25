export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface VocabularyLevel {
  id: string;
  name: string;
  emoji: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  words: VocabularyWord[];
}

export interface VocabularyLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  levels: VocabularyLevel[];
}

export type VocabularyExerciseType = "flashcards" | "quiz" | "matching";

export interface VocabularyExerciseResult {
  levelId: string;
  exerciseType: VocabularyExerciseType;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  completedAt: Date;
}

export interface VocabularyExercise {
  type: VocabularyExerciseType;
  title: string;
  description: string;
  color: string[];
  icon: string;
}
