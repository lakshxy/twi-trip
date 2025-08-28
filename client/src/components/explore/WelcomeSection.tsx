
import React from 'react';

interface WelcomeSectionProps {
  welcomeMessage: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ welcomeMessage }) => {
  return (
    // Add animation and a more vibrant background
    <div className="mb-8 animate-fade-in">
      {/* Applying a primary gradient and making text white for contrast */}
      <div className="bg-gradient-primary text-white rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              {welcomeMessage} ✈️
            </h1>
            <p className="text-sm md:text-lg opacity-80">
              Ready for your next adventure? Let's explore the world together!
            </p>
          </div>
          <div className="hidden md:block">
            {/* Using a more subtle animation */}
            <div className="text-5xl md:text-6xl transform transition-transform duration-500 hover:scale-110">🌍</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
