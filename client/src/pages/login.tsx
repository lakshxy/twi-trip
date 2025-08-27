import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from "@/lib/auth";
import type { ConfirmationResult } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/twi logo.png";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { signIn, user, isLoading: authLoading, startPhoneAuth, confirmPhoneAuth, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      setLocation('/explore');
    }
  }, [user, authLoading, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (loginMethod === 'email') {
        await signIn(formData.email, formData.password);
        toast({ title: "Welcome to TwiTrip!", description: "You've successfully signed in." });
        setLocation('/explore');
      } else {
        if (!otpSent) {
          const conf = await startPhoneAuth(phone, 'recaptcha-container-login');
          setConfirmation(conf);
          setOtpSent(true);
          toast({ title: "OTP sent", description: "Please check your phone for the verification code." });
          return;
        }
        if (!confirmation) throw new Error('No confirmation session. Please resend OTP.');
        await confirmPhoneAuth(confirmation, otp);
        toast({ title: "Welcome to TwiTrip!", description: "Phone verified successfully." });
        setLocation('/explore');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = "Login failed. Please try again.";
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email. Please sign up first.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
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

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If already authenticated, show redirect message
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-xl">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background" style={{ minHeight: '100vh' }}>
      <div className="w-full max-w-5xl flex rounded-2xl shadow-xl overflow-hidden bg-white/90 modern-card">
        {/* Left: Login Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-10 py-16 bg-white">
          <img src={logo} alt="TwiTrip Logo" className="w-16 h-16 mb-6" />
          <h2 className="text-3xl font-bold text-travel-navy mb-8 text-center">Sign in to TwiTrip</h2>
          <div className="w-full max-w-xs space-y-4">
            <Button type="button" variant="outline" className="w-full" onClick={async () => {
              setIsSubmitting(true);
              try {
                await signInWithGoogle();
                toast({ title: 'Signed in with Google' });
                setLocation('/explore');
              } catch (e: any) {
                toast({ title: 'Google sign-in failed', description: e.message || 'Try again', variant: 'destructive' });
              } finally { setIsSubmitting(false); }
            }}>Continue with Google</Button>
            <div className="flex gap-2">
              <Button type="button" variant={loginMethod === 'email' ? 'default' : 'outline'} onClick={() => setLoginMethod('email')}>Email</Button>
              <Button type="button" variant={loginMethod === 'phone' ? 'default' : 'outline'} onClick={() => setLoginMethod('phone')}>Phone</Button>
            </div>
            {loginMethod === 'email' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <Input name="email" type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
                <Input name="password" type="password" placeholder="Password" required value={formData.password} onChange={e => setFormData(f => ({ ...f, password: e.target.value }))} />
                <Button type="submit" className="w-full bg-gradient-primary text-white font-semibold py-3 rounded-xl" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <Input name="phone" placeholder="Phone Number" required value={phone} onChange={e => setPhone(e.target.value)} />
                <div id="recaptcha-container-login"></div>
                {otpSent && (
                  <Input name="otp" placeholder="Enter OTP" required value={otp} onChange={e => setOtp(e.target.value)} />
                )}
                <Button type="submit" className="w-full bg-gradient-primary text-white font-semibold py-3 rounded-xl" disabled={isSubmitting}>
                  {isSubmitting ? 'Verifying...' : otpSent ? 'Verify OTP' : 'Send OTP'}
                </Button>
              </form>
            )}
          </div>
        </div>
        {/* Right: Welcome/Signup */}
        <div className="flex-1 flex flex-col justify-center items-center px-10 py-16 bg-gradient-primary text-white transition-all duration-500">
          <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
          <p className="mb-8 text-lg opacity-90 text-center max-w-md">
            Welcome back! We are so happy to have you here. It's great to see you again. We hope you had a safe and enjoyable time away.
          </p>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <Button
              className="bg-white text-travel-navy font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-travel-mint hover:text-white transition"
              onClick={() => setLocation('/signup')}
            >
              No account yet? Sign up
            </Button>
            <Button
              variant="outline"
              className="border-white text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-white/10 transition"
              onClick={() => setLocation('/profile-create')}
            >
              Create Profile
            </Button>
            // Add this button to your login form
            <Button 
              onClick={() => navigate('/email-link-signup')}
              className="mt-4"
            >
              Sign in with Email Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
