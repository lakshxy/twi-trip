import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function SignupRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate('/profile-create');
  }, [navigate]);
  return null;
}