import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from "../lib/auth";

export default function VerifyEmailLink() {
  const { verifyEmailSignInLink } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    const email = window.localStorage.getItem('emailForSignIn');
    if (email) {
      verifyEmailSignInLink(email)
        .then(() => navigate('/'))
        .catch(() => navigate('/login'));
    } else {
      navigate('/login');
    }
  }, []);

  return <div>Verifying your email link...</div>;
}