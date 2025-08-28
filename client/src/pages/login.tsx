import { useState, useEffect } from "react";
import { Link, useLocation, Redirect } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/twi logo.png";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { signIn, user, isLoading: authLoading, firebaseUser } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      toast({ title: "Login Successful", description: "Welcome back!" });
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email. Please sign up.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        default:
          break;
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (user) {
    if (!firebaseUser?.emailVerified) return <Redirect to="/verify-email" />;
    if (!user.profileComplete) return <Redirect to="/create-profile" />;
    return <Redirect to="/explore" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background" style={{ minHeight: '100vh' }}>
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl shadow-xl overflow-hidden bg-white/90 modern-card m-4 md:m-0">
        {/* Form Section */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 py-12 md:py-16 bg-white">
          <div className="w-full max-w-xs">
            <div className="text-center mb-8">
              <img src={logo} alt="TwiTrip Logo" className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-travel-navy">Welcome Back!</h2>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input name="email" type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
              <Input name="password" type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
              <Button type="submit" className="w-full bg-gradient-primary text-white font-semibold py-3 rounded-xl" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
            <p className="text-center text-sm text-gray-600 pt-4">
              New to TwiTrip?{' '}
              <Link href="/signup" className="font-semibold text-travel-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
        {/* Info Section */}
        <div className="flex flex-1 flex-col justify-center items-center px-6 sm:px-10 py-12 md:py-16 bg-gradient-primary text-white transition-all duration-500">
          <h2 className="text-3xl font-bold mb-4 text-center">New to TwiTrip?</h2>
          <p className="mb-8 text-lg opacity-90 text-center max-w-md">
            Create an account to start your journey with fellow travelers.
          </p>
          <Button
            className="bg-white text-travel-navy font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-travel-mint hover:text-white transition"
            onClick={() => setLocation('/signup')}
          >
            Create an account
          </Button>
        </div>
      </div>
    </div>
  );
}
