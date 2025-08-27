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
  sendSignInLinkToEmail, 
  isSignInWithEmailLink,
  signInWithEmailLink,
  getAdditionalUserInfo
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
  verifyEmailSignInLink: (email: string) => Promise<{ isNewUser: boolean } | undefined>;
  redirectAfterLogin: (path: string) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user profile from Firestore
  const { data: user, isLoading: isUserLoading } = useQuery<User | null>({
    queryKey: ["user", firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser?.uid) return null;
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      return userDoc.exists() ? (userDoc.data() as User) : null;
    },
    enabled: !!firebaseUser?.uid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const signUpMutation = useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      await sendEmailVerification(user);
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
      // Automatically sign in the user after successful sign up
      await signInWithEmailAndPassword(auth, email, password);
      return userData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return await signInWithEmailAndPassword(auth, email, password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const signOutMutation = useMutation({
    mutationFn: () => signOut(auth),
    onSuccess: () => queryClient.clear(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      if (!firebaseUser?.uid) throw new Error("No user logged in");
      const userRef = doc(db, "users", firebaseUser.uid);
      await updateDoc(userRef, { ...data, updatedAt: new Date().toISOString() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
  
  const redirectAfterLogin = (path: string) => {
    setRedirectPath(path);
  };

  return (
    <AuthContext.Provider value={{ 
      user: user ?? null, 
      firebaseUser,
      isLoading: isLoading || isUserLoading,
      signUp: async (email, password, name) => {
        await signUpMutation.mutateAsync({ email, password, name });
      },
      signIn: async (email, password) => {
        await signInMutation.mutateAsync({ email, password });
      },
      signOut: () => signOutMutation.mutateAsync(),
      resetPassword: (email) => sendPasswordResetEmail(auth, email),
      sendVerificationEmail: () => {
        if (!firebaseUser) throw new Error("No user to verify");
        return sendEmailVerification(firebaseUser);
      },
      updateUserProfile: (data) => updateProfileMutation.mutateAsync(data),
      startPhoneAuth: (phoneNumber, recaptchaContainerId) => {
        const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, { size: 'invisible' });
        return signInWithPhoneNumber(auth, phoneNumber, verifier);
      },
      confirmPhoneAuth: async (confirmation, code) => {
        const result = await confirmation.confirm(code);
        if (result.user && !(await getDoc(doc(db, "users", result.user.uid))).exists()) {
          const { uid, email, displayName, phoneNumber } = result.user;
          const newUser: User = {
            id: uid,
            email: email || "",
            name: displayName || phoneNumber || "User",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            emailVerified: !!email,
            profileComplete: false,
          };
          await setDoc(doc(db, "users", uid), newUser);
        }
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },
      signInWithGoogle: async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        if (result.user && !(await getDoc(doc(db, "users", result.user.uid))).exists()) {
            const { uid, email, displayName } = result.user;
            const newUser: User = {
              id: uid,
              email: email || "",
              name: displayName || "Google User",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              emailVerified: true,
              profileComplete: false,
            };
            await setDoc(doc(db, "users", uid), newUser);
        }
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },
      sendEmailSignInLink: async (email) => {
        await sendSignInLinkToEmail(auth, email, { 
          url: `${window.location.origin}/verify-email-link`,
          handleCodeInApp: true 
        });
        window.localStorage.setItem('emailForSignIn', email);
      },
      verifyEmailSignInLink: async (email) => {
        if (!isSignInWithEmailLink(auth, window.location.href)) return;
        const result = await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
        if (getAdditionalUserInfo(result)?.isNewUser) {
          const { uid, email, displayName } = result.user;
          const newUser: User = {
            id: uid, email: email!, name: displayName || "",
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
            emailVerified: true, profileComplete: false
          };
          await setDoc(doc(db, "users", uid), newUser);
          return { isNewUser: true };
        }
        return { isNewUser: false };
      },
      redirectAfterLogin
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
