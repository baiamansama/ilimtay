import React, { createContext, useState, useContext, useEffect } from "react";
import { UserProfile } from "../types/user";
import { useAuth } from "./AuthContext";
import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

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

  // Fetch user profile from Firestore when currentUser changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          } else {
            // If no profile exists, set to null (onboarding will handle creating it)
            setUserProfile(null);
          }
        } catch (error) {
          console.error("Error fetching user profile from Firestore:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
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

      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        await setDoc(userDocRef, updatedProfile, { merge: true });
        setUserProfile(updatedProfile);
      } catch (error) {
        console.error("Error saving user profile to Firestore:", error);
      }
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
