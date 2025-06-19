import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";

interface DemoAuthWrapperProps {
  children: React.ReactNode;
}

export function DemoAuthWrapper({ children }: DemoAuthWrapperProps) {
  const { user, isLoading, demoLogin } = useAuth();
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  const attemptLogin = useCallback(async () => {
    if (!hasAttemptedLogin && !isLoading && !user) {
      setHasAttemptedLogin(true);
      try {
        await demoLogin();
      } catch (error) {
        console.error('Demo login failed:', error);
        // Reset the flag to allow retry
        setHasAttemptedLogin(false);
      }
    }
  }, [hasAttemptedLogin, isLoading, user, demoLogin]);

  useEffect(() => {
    attemptLogin();
  }, [attemptLogin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Setting up your experience...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}