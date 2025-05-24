import { User } from "firebase/auth";

export interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
