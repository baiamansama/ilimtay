import React, { createContext, useState, useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthContextType, AuthProviderProps } from "../types/auth";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = (): Promise<void> => {
    return signOut(auth);
  };

  const resetPassword = (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email);
  };

  const deleteAccount = async (password: string): Promise<void> => {
    if (!currentUser) {
      throw new Error("No user is currently signed in");
    }

    try {
      // Re-authenticate the user before deletion
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        password
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Delete the user account
      await deleteUser(currentUser);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
