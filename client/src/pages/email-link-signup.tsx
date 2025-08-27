import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function EmailLinkSignup() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const { sendEmailSignInLink } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendEmailSignInLink(email);
      setIsSent(true);
    } catch (err) {
      setError('Failed to send email link. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {isSent ? (
        <div>
          <h2>Check your email!</h2>
          <p>We've sent a sign-in link to {email}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" className="w-full mt-4">
            Send Sign-In Link
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full mt-2"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        </form>
      )}
    </div>
  );
}