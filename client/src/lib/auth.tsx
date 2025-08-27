import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  GoogleAuthProvider,
  signInWithPopup,
  // Add to imports
  sendSignInLinkToEmail, 
  isSignInWithEmailLink,
  signInWithEmailLink
} from "firebase/auth";

import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// Firebase User type that includes profile data
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  profileComplete: boolean;
  // Profile fields
  bio?: string;
  city?: string;
  state?: string;
  interests?: string[];
  languages?: string[];
  travelGoals?: string[];
  profileImage?: string;
  age?: number;
  // New fields for full signup/profile
  roles?: string[];
  purposes?: string[];
  frequency?: string;
  hosting?: string;
  stayType?: string;
  stayCost?: string;
  maxGuests?: number;
  amenities?: string[];
  nextDest?: string;
  arrival?: string;
  duration?: string;
  lookingFor?: string[];
  connectWith?: string[];
  comms?: string[];
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  startPhoneAuth: (phoneNumber: string, recaptchaContainerId: string) => Promise<ConfirmationResult>;
  confirmPhoneAuth: (confirmation: ConfirmationResult, code: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendEmailSignInLink: (email: string) => Promise<void>;
  verifyEmailSignInLink: (email: string) => Promise<void>;
}

const sendEmailSignInLink = async (email: string) => {
  const actionCodeSettings = {
    url: `${window.location.origin}/verify-email-link`,
    handleCodeInApp: true
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem('emailForSignIn', email);
};

const verifyEmailSignInLink = async (email: string) => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem('emailForSignIn');
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    console.log('Setting up Firebase auth listener...');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Firebase auth state changed:', user ? `User ${user.uid} logged in` : 'No user');
      setFirebaseUser(user);
      setIsLoading(false);
    });

    return () => {
      console.log('Cleaning up Firebase auth listener...');
      unsubscribe();
    };
  }, []);

  // Fetch user profile from Firestore
  const { data: user, isLoading: isUserLoading, error: userError } = useQuery<User | null>({
    queryKey: ["user", firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser?.uid) {
        console.log('No firebase user, skipping profile fetch');
        return null;
      }
      
      console.log('Fetching user profile for:', firebaseUser.uid);
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        console.log('User profile found:', userData);
        return userData;
      }
      console.log('No user profile found in Firestore');
      return null;
    },
    enabled: !!firebaseUser?.uid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const signUpMutation = useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, { displayName: name });
      
      // Send verification email
      await sendEmailVerification(user);
      
      // Create user profile in Firestore
      const userData: User = {
        id: user.uid,
        email: user.email!,
        name: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        emailVerified: false,
        profileComplete: false,
      };
      
      await setDoc(doc(db, "users", user.uid), userData);
      
      return userData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await signOut(auth);
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      await sendPasswordResetEmail(auth, email);
    },
  });

  const sendVerificationEmailMutation = useMutation({
    mutationFn: async () => {
      if (!firebaseUser) throw new Error("No user logged in");
      await sendEmailVerification(firebaseUser);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      if (!firebaseUser?.uid) throw new Error("No user logged in");
      
      const userRef = doc(db, "users", firebaseUser.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const signUp = async (email: string, password: string, name: string) => {
    await signUpMutation.mutateAsync({ email, password, name });
  };

  const signIn = async (email: string, password: string) => {
    await signInMutation.mutateAsync({ email, password });
  };

  const signOut = async () => {
    await signOutMutation.mutateAsync();
  };

  const resetPassword = async (email: string) => {
    await resetPasswordMutation.mutateAsync(email);
  };

  const sendVerificationEmail = async () => {
    await sendVerificationEmailMutation.mutateAsync();
  };

  const updateUserProfile = async (data: Partial<User>) => {
    await updateProfileMutation.mutateAsync(data);
  };

  // Phone authentication helpers
  const startPhoneAuth = async (
    phoneNumber: string,
    recaptchaContainerId: string,
  ): Promise<ConfirmationResult> => {
    // Ensure any previous verifier is cleared by recreating the container content
    const container = document.getElementById(recaptchaContainerId);
    if (!container) throw new Error("reCAPTCHA container not found");
    container.innerHTML = "";

    const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: "invisible",
    });

    return await signInWithPhoneNumber(auth, phoneNumber, verifier);
  };

  const confirmPhoneAuth = async (
    confirmation: ConfirmationResult,
    code: string,
  ): Promise<void> => {
    const result = await confirmation.confirm(code);
    const firebaseUserConfirmed = result.user;

    // Ensure Firestore profile exists
    if (firebaseUserConfirmed?.uid) {
      const userRef = doc(db, "users", firebaseUserConfirmed.uid);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) {
        const userData: User = {
          id: firebaseUserConfirmed.uid,
          email: firebaseUserConfirmed.email || "",
          name: firebaseUserConfirmed.displayName || firebaseUserConfirmed.phoneNumber || "User",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          emailVerified: !!firebaseUserConfirmed.emailVerified,
          profileComplete: false,
        };
        await setDoc(userRef, userData);
      }
    }

    // Refresh cached queries
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUserConfirmed = result.user;

    if (firebaseUserConfirmed?.uid) {
      const userRef = doc(db, "users", firebaseUserConfirmed.uid);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) {
        const userData: User = {
          id: firebaseUserConfirmed.uid,
          email: firebaseUserConfirmed.email || "",
          name: firebaseUserConfirmed.displayName || firebaseUserConfirmed.email || "User",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          emailVerified: !!firebaseUserConfirmed.emailVerified,
          profileComplete: false,
        };
        await setDoc(userRef, userData);
      }
    }

    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    <AuthContext.Provider value={{ 
      user: user ?? null, 
      firebaseUser,
      isLoading: isLoading || isUserLoading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      sendVerificationEmail,
      updateUserProfile,
      startPhoneAuth,
      confirmPhoneAuth,
      signInWithGoogle,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export type { User };
