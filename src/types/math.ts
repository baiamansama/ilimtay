export interface ExerciseResult {
  id?: string;
  userId: string;
  subject: string;
  topic: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: Date;
}

export interface Question {
  id: number;
  question: string;
  answer: number;
  options: number[];
}
