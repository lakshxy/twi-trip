
import React from 'react';

interface WelcomeHeaderProps {
  email: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ email }) => {
  return (
    <div className="p-6 bg-gradient-to-r from-travel-blue to-travel-mint text-white rounded-lg shadow-md mb-8">
      <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {email}! 👋</h1>
      <p className="mt-2 text-base md:text-lg">Ready for your next adventure? Let's explore the world together!</p>
    </div>
  );
};

export default WelcomeHeader;
