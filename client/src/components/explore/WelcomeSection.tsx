
import React from 'react';

interface WelcomeSectionProps {
  welcomeMessage: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ welcomeMessage }) => {
  return (
    <div className="mb-8 relative">
      <div className="bg-gradient-to-r from-travel-navy/10 via-travel-mint/10 to-travel-soft-lavender/10 rounded-2xl p-6 md:p-8 border border-travel-soft-lavender/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-travel-navy mb-2 md:mb-3 font-poppins">
              {welcomeMessage} ✈️
            </h1>
            <p className="text-travel-navy/70 text-base md:text-lg">
              Ready for your next adventure? Let's explore the world together!
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-5xl md:text-6xl animate-bounce">🌍</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
