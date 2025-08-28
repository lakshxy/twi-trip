import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Heart, X, Star, MapPin, Filter, Car } from "lucide-react";
import SwipeCard from "@/components/swipe-card";
import MatchCelebration from "@/components/match-celebration";
import type { Profile, User } from "@shared/schema";
import { BackButton } from "@/components/back-button";
import ProfileModal from "@/components/profile-modal";
// @ts-ignore
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";

export default function SwipePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<(Profile & { user: User }) | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const { user } = useAuth();

  const { data: profilesRaw = [], isLoading } = useQuery<(Profile & { user: User })[]>({
    queryKey: ["/api/swipe/profiles"],
  });

  const profiles = profilesRaw.length > 0 ? profilesRaw : [];

  const swipeMutation = useMutation({
    mutationFn: async ({ swipedId, action }: { swipedId: number; action: string }) => {
      const response = await apiRequest("POST", "/api/swipe", { swipedId, action });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.isMatch) {
        const matched = profiles.find(p => p.userId === data.swipe.swipedId);
        if (matched) {
          setMatchedProfile(matched);
          setShowMatch(true);
        }
        
        toast({
          title: "It's a Match! 🎉",
          description: "You both liked each other! Send a message to start chatting.",
        });
      } else if (data.swipe.action === "super") {
        toast({
          title: "Super Like Sent! ⭐",
          description: "They'll know you're really interested!",
        });
      }
      
      setCurrentIndex(prev => prev + 1);
      queryClient.invalidateQueries({ queryKey: ["/api/swipe/profiles"] });
    },
  });

  const handleSwipe = (action: string) => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    swipeMutation.mutate({
      swipedId: currentProfile.userId,
      action,
    });
  };

  const handleCloseMatch = () => {
    setShowMatch(false);
    setMatchedProfile(null);
  };

  const handleSendMessage = () => {
    if (matchedProfile) {
      setLocation(`/messages?userId=${matchedProfile.userId}`);
    }
    handleCloseMatch();
  };

  const handleContinueSwiping = () => {
    handleCloseMatch();
  };

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
  };
  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const currentProfile = profiles[currentIndex];

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-md mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-80 sm:h-96 bg-gray-200 rounded-3xl"></div>
          <div className="flex justify-center space-x-6 sm:space-x-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full"></div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full"></div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-travel-light via-white to-travel-beige px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center max-w-lg w-full border border-travel-lavender/30">
          <h2 className="text-2xl sm:text-3xl font-bold text-travel-navy mb-3">No More Profiles</h2>
          <p className="text-travel-navy/70 text-base sm:text-lg text-center mb-6">You've seen all available travelers in your area. Check back later for new profiles!</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/swipe/profiles"] })} className="bg-gradient-primary text-white px-6 py-3 rounded-xl text-md font-semibold shadow-md hover:bg-travel-navy/90 transition-all duration-300">
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 max-w-3xl mx-auto animate-fade-in">
      <div className="w-full flex justify-start mt-2 mb-4 px-2 sm:px-4">
        <BackButton />
      </div>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Swipe Card Section */}
        <div className="flex-1 min-w-0 w-full">
          <div className="text-center mb-4 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-travel-navy mb-1">Discover Travelers</h2>
            <p className="text-travel-navy/70 text-base sm:text-lg font-medium">Swipe right to connect, left to pass</p>
          </div>
          {/* Swipe Card */}
          <div className="relative h-[400px] sm:h-[500px] mb-6 animate-scale-in">
            <SwipeCard
              profile={currentProfile}
              onSwipe={handleSwipe}
              onClick={handleOpenProfileModal}
            />
          </div>
          {/* Swipe Actions */}
          <div className="flex justify-center space-x-4 mb-6 animate-slide-up">
            <Button
              onClick={() => handleSwipe("pass")}
              variant="outline"
              size="icon"
              className="w-16 h-16 rounded-full border-2 border-travel-lavender text-travel-lavender hover:bg-travel-lavender/10 hover:border-travel-lavender hover:scale-110 transition-all duration-500 shadow-lg glass-card"
              disabled={swipeMutation.isPending}
            >
              <X className="w-7 h-7" />
            </Button>
            <Button
              onClick={() => handleSwipe("super")}
              variant="outline"
              size="icon"
              className="w-16 h-16 rounded-full border-2 border-travel-mint bg-gradient-to-br from-travel-mint to-travel-lavender text-white hover:scale-110 transition-all duration-500 shadow-lg"
              disabled={swipeMutation.isPending}
            >
              <Star className="w-7 h-7" />
            </Button>
            <Button
              onClick={() => handleSwipe("like")}
              size="icon"
              className="w-16 h-16 rounded-full bg-gradient-primary hover:scale-110 transition-all duration-500 shadow-lg"
              disabled={swipeMutation.isPending}
            >
              <Heart className="w-7 h-7" />
            </Button>
          </div>
        </div>
        {/* Quick Filters Section */}
        <div className="w-full lg:w-[300px] flex-shrink-0">
          <Card className="modern-card border-0 animate-slide-up bg-white/90">
            <CardContent className="p-4">
              <h4 className="font-bold text-travel-navy mb-3 flex items-center text-md">
                <Filter className="w-5 h-5 mr-2 text-travel-lavender" />
                Quick Filters
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="justify-start py-2 px-3 rounded-lg border-travel-navy/20 text-travel-navy font-medium text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  Nearby
                </Button>
                <Button variant="outline" size="sm" className="justify-start py-2 px-3 rounded-lg border-travel-navy/20 text-travel-navy font-medium text-sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Homestays
                </Button>
                <Button variant="outline" size="sm" className="justify-start py-2 px-3 rounded-lg border-travel-navy/20 text-travel-navy font-medium text-sm">
                  <Car className="w-4 h-4 mr-2" />
                  Rides
                </Button>
                <Button variant="outline" size="sm" className="justify-start py-2 px-3 rounded-lg border-travel-navy/20 text-travel-navy font-medium text-sm">
                  📅 This Week
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Match Celebration Modal */}
      {showMatch && matchedProfile && (
        <MatchCelebration
          matchedProfile={matchedProfile}
          onClose={handleCloseMatch}
          onSendMessage={handleSendMessage}
          onContinueSwiping={handleContinueSwiping}
        />
      )}
      {/* Profile Details Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          profile={currentProfile}
          onClose={handleCloseProfileModal}
        />
      )}
    </div>
  );
}
