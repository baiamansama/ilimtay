import { StackNavigationProp } from "@react-navigation/stack";

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type AppStackParamList = {
  Dashboard: undefined;
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
