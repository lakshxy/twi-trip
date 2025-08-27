import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Heart, Sparkles, X } from "lucide-react";
import type { Profile, User } from "@shared/schema";

interface MatchCelebrationProps {
  matchedProfile: Profile & { user: User };
  onClose: () => void;
  onSendMessage: () => void;
  onContinueSwiping: () => void;
}

export default function MatchCelebration({ 
  matchedProfile, 
  onClose, 
  onSendMessage, 
  onContinueSwiping 
}: MatchCelebrationProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const placeholderImages = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
  ];

  const profileImage = matchedProfile.profileImage || placeholderImages[matchedProfile.userId % placeholderImages.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`relative w-full max-w-md transform transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <Card className="modern-card border-0 shadow-2xl bg-gradient-to-br from-white via-travel-beige to-travel-light overflow-hidden">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>

          <CardContent className="p-0">
            {/* Celebration Header */}
            <div className="relative bg-gradient-to-br from-travel-navy via-travel-lavender to-travel-mint p-8 text-center">
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10">
                {/* Animated sparkles */}
                <div className="flex justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                  <Heart className="w-8 h-8 text-red-400 animate-bounce mx-2" />
                  <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-2">It's a Match! 🎉</h2>
                <p className="text-white/90 text-lg">You and {matchedProfile.user.name} liked each other!</p>
              </div>
            </div>

            {/* Profile Images */}
            <div className="p-8 text-center">
              <div className="flex justify-center items-center mb-6">
                {/* Your profile image placeholder */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-travel-mint to-travel-lavender flex items-center justify-center text-white font-bold text-xl mr-4">
                  You
                </div>
                
                {/* Heart icon */}
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white animate-pulse">
                  <Heart className="w-6 h-6" />
                </div>
                
                {/* Matched profile image */}
                <div className="w-20 h-20 rounded-full overflow-hidden ml-4 border-4 border-travel-mint">
                  <img 
                    src={profileImage}
                    alt={`${matchedProfile.user.name}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Match details */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-travel-navy mb-2">
                  {matchedProfile.user.name}
                  {matchedProfile.age && `, ${matchedProfile.age}`}
                </h3>
                {matchedProfile.bio && (
                  <p className="text-travel-navy/70 text-sm mb-3 line-clamp-2">
                    {matchedProfile.bio}
                  </p>
                )}
                {matchedProfile.city && matchedProfile.state && (
                  <p className="text-travel-navy/60 text-xs">
                    📍 {matchedProfile.city}, {matchedProfile.state}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button
                  onClick={onSendMessage}
                  className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
                
                <Button
                  onClick={onContinueSwiping}
                  variant="outline"
                  className="w-full border-travel-navy/20 text-travel-navy py-3 rounded-xl font-medium hover:bg-travel-lavender/10 transition-all duration-300"
                >
                  Continue Swiping
                </Button>
              </div>

              {/* Fun message */}
              <p className="text-travel-navy/50 text-xs mt-4 italic">
                Start a conversation and plan your next adventure together! 🌟
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 