import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, firebaseUser, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!firebaseUser) {
    return <Redirect to="/login" />;
  }

  if (!firebaseUser.emailVerified) {
    return <Redirect to="/verify-email" />;
  }

  if (!user?.profileComplete) {
    return <Redirect to="/create-profile" />;
  }

  return <>{children}</>;
}
