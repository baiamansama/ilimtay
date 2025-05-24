import { StackNavigationProp } from "@react-navigation/stack";

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type AppStackParamList = {
  Dashboard: undefined;
};

export type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Login"
>;
export type SignupScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Signup"
>;

export interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}
