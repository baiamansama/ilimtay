import React, { createContext, useState, useContext, useEffect } from "react";
import { UserProfile } from "../types/user";
import { useAuth } from "./AuthContext";

interface UserContextType {
  userProfile: UserProfile | null;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  isProfileComplete: boolean;
  onboardingData: Partial<UserProfile>;
  setOnboardingData: (data: Partial<UserProfile>) => void;
  clearOnboardingData: () => void;
}

interface UserProviderProps {
  children: React.ReactNode;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [onboardingData, setOnboardingData] = useState<Partial<UserProfile>>(
    {}
  );

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (currentUser) {
      const updatedProfile: UserProfile = {
        uid: currentUser.uid,
        email: currentUser.email!,
        language: profile.language || userProfile?.language || "en",
        gender: profile.gender || userProfile?.gender || "boy",
        grade: profile.grade || userProfile?.grade || 1,
        createdAt: userProfile?.createdAt || new Date(),
        updatedAt: new Date(),
        ...profile,
      };
      setUserProfile(updatedProfile);
      // In a real app save this to Firestore here
    }
  };

  const clearOnboardingData = () => {
    setOnboardingData({});
  };

  const isProfileComplete =
    !!userProfile &&
    !!userProfile.language &&
    !!userProfile.gender &&
    typeof userProfile.grade === "number" &&
    userProfile.grade > 0;

  useEffect(() => {
    if (currentUser && !userProfile) {
      // In a real app, you would fetch user profile from Firestore here
      // For now, we'll just check if we have stored data
      const hasStoredProfile = false; // This would be checked from storage
      if (!hasStoredProfile) {
        setUserProfile(null);
      }
    }
  }, [currentUser]);

  const value: UserContextType = {
    userProfile,
    updateUserProfile,
    isProfileComplete,
    onboardingData,
    setOnboardingData,
    clearOnboardingData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
