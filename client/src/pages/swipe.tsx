import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        // Find the matched profile
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

    // Regular swipe logic
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
      <div className="p-6 max-w-md mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-96 bg-gray-200 rounded-3xl"></div>
          <div className="flex justify-center space-x-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-travel-light via-white to-travel-beige">
        <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center max-w-lg w-full border border-travel-lavender/30">
          <h2 className="text-3xl font-bold text-travel-navy mb-4">No More Profiles</h2>
          <p className="text-travel-navy/70 text-lg mb-6">You've seen all available travelers in your area. Check back later for new profiles!</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/swipe/profiles"] })} className="bg-gradient-primary text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-travel-navy/90 transition-all duration-300">
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="w-full flex justify-start mt-2 mb-4 px-4">
        <BackButton />
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Swipe Card Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 text-center mb-8 animate-slide-up">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-travel-navy mb-3">Discover Travelers</h2>
              <p className="text-travel-navy/70 text-lg font-medium">Swipe right to connect, left to pass</p>
            </div>
          </div>
          {/* Swipe Card */}
          <div className="relative h-[500px] mb-10 animate-scale-in">
            <SwipeCard
              profile={currentProfile}
              onSwipe={handleSwipe}
              onClick={handleOpenProfileModal}
            />
          </div>
          {/* Swipe Actions */}
          <div className="flex justify-center space-x-8 mb-10 animate-slide-up">
            <Button
              onClick={() => handleSwipe("pass")}
              variant="outline"
              size="icon"
              className="w-20 h-20 rounded-full border-2 border-travel-lavender text-travel-lavender hover:bg-travel-lavender/10 hover:border-travel-lavender hover:scale-110 transition-all duration-500 shadow-lg glass-card"
              disabled={swipeMutation.isPending}
            >
              <X className="w-8 h-8" />
            </Button>
            <Button
              onClick={() => handleSwipe("super")}
              variant="outline"
              size="icon"
              className="w-20 h-20 rounded-full border-2 border-travel-mint bg-gradient-to-br from-travel-mint to-travel-lavender text-white hover:scale-110 transition-all duration-500 shadow-lg"
              disabled={swipeMutation.isPending}
            >
              <Star className="w-8 h-8" />
            </Button>
            <Button
              onClick={() => handleSwipe("like")}
              size="icon"
              className="w-20 h-20 rounded-full bg-gradient-primary hover:scale-110 transition-all duration-500 shadow-lg"
              disabled={swipeMutation.isPending}
            >
              <Heart className="w-8 h-8" />
            </Button>
          </div>
        </div>
        {/* Quick Filters Section */}
        <div className="w-full md:w-[320px] flex-shrink-0 md:mt-32">
          <Card className="modern-card border-0 animate-slide-up bg-white/90">
            <CardContent className="p-6">
              <h4 className="font-bold text-travel-navy mb-4 flex items-center text-lg">
                <Filter className="w-5 h-5 mr-3 text-travel-lavender" />
                Quick Filters
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" size="sm" className="justify-start py-3 px-4 rounded-xl border-travel-navy/20 text-travel-navy font-medium">
                  <MapPin className="w-4 h-4 mr-2" />
                  Nearby
                </Button>
                <Button variant="outline" size="sm" className="justify-start py-3 px-4 rounded-xl border-travel-navy/20 text-travel-navy font-medium">
                  <Heart className="w-4 h-4 mr-2" />
                  Homestays
                </Button>
                <Button variant="outline" size="sm" className="justify-start py-3 px-4 rounded-xl border-travel-navy/20 text-travel-navy font-medium">
                  <Car className="w-4 h-4 mr-2" />
                  Rides
                </Button>
                <Button variant="outline" size="sm" className="justify-start py-3 px-4 rounded-xl border-travel-navy/20 text-travel-navy font-medium">
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
