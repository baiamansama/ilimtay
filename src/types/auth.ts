import { User } from "firebase/auth";

export interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<any>;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
