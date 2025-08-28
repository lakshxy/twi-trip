import { useAuth } from "@/lib/auth";
import { useLocation, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmailPage() {
  const { firebaseUser, sendVerificationEmail, signOut, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!firebaseUser) {
    return <Redirect to="/login" />;
  }

  if (firebaseUser.emailVerified) {
    return <Redirect to="/create-profile" />;
  }

  const handleResend = async () => {
    try {
      await sendVerificationEmail();
      toast({ title: "Verification Email Sent", description: "Please check your inbox." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await signOut();
    setLocation("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="mb-6 text-gray-600">
          A verification link has been sent to <strong>{firebaseUser.email}</strong>. 
          Please click the link to continue.
        </p>
        <Button onClick={handleResend} className="mb-4 w-full">Resend Verification Email</Button>
        <Button variant="outline" onClick={handleLogout} className="w-full">Logout</Button>
      </div>
    </div>
  );
}
