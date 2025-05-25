import { StackNavigationProp } from "@react-navigation/stack";

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
