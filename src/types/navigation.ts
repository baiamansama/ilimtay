import { StackNavigationProp } from "@react-navigation/stack";
import { VocabularyWord, VocabularyExerciseType } from "./vocabulary";

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type AppStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  ProfileEdit: undefined;
  Premium: undefined;
  MathSubject: undefined;
  MathTopic: { topic: string; topicEmoji: string };
  MathExercise: { topic: string; difficulty: string };
  ReadingSubject: undefined;
  ScienceSubject: undefined;
  WritingSubject: undefined;
  VocabularySubject: undefined;
  VocabularyLevel: {
    levelId: string;
    levelName: string;
    levelEmoji: string;
    languageCode: string;
    languageName: string;
  };
  VocabularyExercise: {
    levelId: string;
    levelName: string;
    levelEmoji: string;
    languageCode: string;
    languageName: string;
    words: VocabularyWord[];
    exerciseType: VocabularyExerciseType;
  };
};

export type OnboardingStackParamList = {
  Language: undefined;
  Gender: undefined;
  Grade: undefined;
};

export type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export type SignupScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Signup"
>;

export type OnboardingLanguageNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "Language"
>;

export type OnboardingGenderNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "Gender"
>;

export type OnboardingGradeNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "Grade"
>;

export type MathSubjectNavigationProp = StackNavigationProp<
  AppStackParamList,
  "MathSubject"
>;

export type MathTopicNavigationProp = StackNavigationProp<
  AppStackParamList,
  "MathTopic"
>;

export type MathExerciseNavigationProp = StackNavigationProp<
  AppStackParamList,
  "MathExercise"
>;

export type VocabularySubjectNavigationProp = StackNavigationProp<
  AppStackParamList,
  "VocabularySubject"
>;

export type VocabularyLevelNavigationProp = StackNavigationProp<
  AppStackParamList,
  "VocabularyLevel"
>;

export type VocabularyExerciseNavigationProp = StackNavigationProp<
  AppStackParamList,
  "VocabularyExercise"
>;

export interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

export interface OnboardingLanguageProps {
  navigation: OnboardingLanguageNavigationProp;
}

export interface OnboardingGenderProps {
  navigation: OnboardingGenderNavigationProp;
}

export interface OnboardingGradeProps {
  navigation: OnboardingGradeNavigationProp;
}

export interface MathSubjectProps {
  navigation: MathSubjectNavigationProp;
}

export interface MathTopicProps {
  navigation: MathTopicNavigationProp;
  route: {
    params: {
      topic: string;
      topicEmoji: string;
    };
  };
}

export interface MathExerciseProps {
  navigation: MathExerciseNavigationProp;
  route: {
    params: {
      topic: string;
      difficulty: string;
    };
  };
}

export interface VocabularySubjectProps {
  navigation: VocabularySubjectNavigationProp;
}

export interface VocabularyLevelProps {
  navigation: VocabularyLevelNavigationProp;
  route: {
    params: {
      levelId: string;
      levelName: string;
      levelEmoji: string;
      languageCode: string;
      languageName: string;
    };
  };
}

export interface VocabularyExerciseProps {
  navigation: VocabularyExerciseNavigationProp;
  route: {
    params: {
      levelId: string;
      levelName: string;
      levelEmoji: string;
      languageCode: string;
      languageName: string;
      words: VocabularyWord[];
      exerciseType: VocabularyExerciseType;
    };
  };
}
