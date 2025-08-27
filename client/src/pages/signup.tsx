import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/twi logo.png";

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { signUp, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      setLocation('/explore');
    }
  }, [user, authLoading, setLocation]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (formData.password.length < 8) {
      toast({ title: "Password is too weak", description: "Password must be at least 8 characters.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    try {
      await signUp(formData.email, formData.password, formData.name);
      toast({ title: "Welcome to TwiTrip!", description: "You've successfully signed up." });
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = "Signup failed. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email already registered. Please login instead.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      }
      toast({
        title: "Signup Failed",
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background" style={{ minHeight: '100vh' }}>
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl shadow-xl overflow-hidden bg-white/90 modern-card m-4 md:m-0">
        {/* Form Section */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 py-12 md:py-16 bg-white">
          <div className="w-full max-w-xs text-center">
            <img src={logo} alt="TwiTrip Logo" className="w-14 h-14 mx-auto mb-5" />
            <h2 className="text-2xl sm:text-3xl font-bold text-travel-navy mb-6">Create your TwiTrip account</h2>
            <form onSubmit={handleSignup} className="space-y-4">
              <Input name="name" type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
              <Input name="email" type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
              <Input name="password" type="password" placeholder="Password (min. 8 characters)" required value={formData.password} onChange={e => setFormData(f => ({ ...f, password: e.target.value }))} />
              <Button type="submit" className="w-full bg-gradient-primary text-white font-semibold py-3 rounded-xl" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Sign up'}
              </Button>
            </form>
            <p className="text-sm text-gray-600 pt-4">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-travel-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
        {/* Info Section */}
        <div className="flex flex-1 flex-col justify-center items-center px-6 sm:px-10 py-12 md:py-16 bg-gradient-primary text-white transition-all duration-500">
          <h2 className="text-3xl font-bold mb-4 text-center">Already on TwiTrip?</h2>
          <p className="mb-8 text-lg opacity-90 text-center max-w-md">
            Log in to access your profile, trips, and messages.
          </p>
          <Button
            className="bg-white text-travel-navy font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-travel-mint hover:text-white transition"
            onClick={() => setLocation('/login')}
          >
            Log in
          </Button>
        </div>
      </div>
    </div>
  );
}
