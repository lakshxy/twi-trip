import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, X, Star, MapPin, Filter, Car } from "lucide-react";
import SwipeCard from "@/components/swipe-card";
import type { Profile, User } from "@shared/schema";

export default function SwipePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: profiles = [], isLoading } = useQuery<(Profile & { user: User })[]>({
    queryKey: ["/api/swipe/profiles"],
  });

  const swipeMutation = useMutation({
    mutationFn: async ({ swipedId, action }: { swipedId: number; action: string }) => {
      const response = await apiRequest("POST", "/api/swipe", { swipedId, action });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.isMatch) {
        toast({
          title: "It's a Match! 💕",
          description: "You both liked each other!",
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

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">No More Profiles</h2>
            <p className="text-gray-500 mb-6">You've seen all available travelers in your area. Check back later for new profiles!</p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/swipe/profiles"] })}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-8 animate-slide-up">
        <h2 className="text-3xl font-bold text-travel-navy mb-3">Discover Travelers</h2>
        <p className="text-travel-navy/70 text-lg font-medium">Swipe right to connect, left to pass</p>
      </div>

      {/* Swipe Card */}
      <div className="relative h-[500px] mb-10 animate-scale-in">
        <SwipeCard
          profile={currentProfile}
          onSwipe={handleSwipe}
        />
      </div>

      {/* Swipe Actions */}
      <div className="flex justify-center space-x-8 mb-10 animate-slide-up">
        <Button
          onClick={() => handleSwipe("pass")}
          variant="outline"
          size="icon"
          className="w-20 h-20 rounded-full border-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 hover:scale-110 transition-all duration-500 shadow-lg glass-card"
          disabled={swipeMutation.isPending}
        >
          <X className="w-8 h-8" />
        </Button>
        
        <Button
          onClick={() => handleSwipe("super")}
          variant="outline"
          size="icon"
          className="w-20 h-20 rounded-full border-2 border-travel-lavender bg-gradient-accent text-white hover:scale-110 transition-all duration-500 shadow-lg"
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

      {/* Quick Filters */}
      <Card className="modern-card border-0 animate-slide-up">
        <CardContent className="p-6">
          <h4 className="font-bold text-travel-navy mb-4 flex items-center text-lg">
            <Filter className="w-5 h-5 mr-3 text-travel-lavender" />
            Quick Filters
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" size="sm" className="justify-start py-3 px-4 rounded-xl border-travel-navy/20 text-travel-navy hover:bg-travel-navy/5 font-medium">
              <MapPin className="w-4 h-4 mr-2" />
              Nearby
            </Button>
            <Button variant="outline" size="sm" className="justify-start py-3 px-4 rounded-xl border-travel-navy/20 text-travel-navy hover:bg-travel-navy/5 font-medium">
              <Heart className="w-4 h-4 mr-2" />
              Homestays
            </Button>
            <Button variant="outline" size="sm" className="justify-start py-3 px-4 rounded-xl border-travel-navy/20 text-travel-navy hover:bg-travel-navy/5 font-medium">
              <Car className="w-4 h-4 mr-2" />
              Rides
            </Button>
            <Button variant="outline" size="sm" className="justify-start py-3 px-4 rounded-xl border-travel-navy/20 text-travel-navy hover:bg-travel-navy/5 font-medium">
              📅 This Week
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
