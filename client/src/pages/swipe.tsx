import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, X, Star, MapPin, Filter } from "lucide-react";
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
    <div className="p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-travel-dark mb-2">Discover Travelers</h2>
        <p className="text-gray-600">Swipe right to connect, left to pass</p>
      </div>

      {/* Swipe Card */}
      <div className="relative h-96 mb-8">
        <SwipeCard
          profile={currentProfile}
          onSwipe={handleSwipe}
        />
      </div>

      {/* Swipe Actions */}
      <div className="flex justify-center space-x-8 mb-8">
        <Button
          onClick={() => handleSwipe("pass")}
          variant="outline"
          size="icon"
          className="w-16 h-16 rounded-full border-2 hover:bg-gray-100 hover:scale-110 transition-all duration-300"
          disabled={swipeMutation.isPending}
        >
          <X className="w-6 h-6 text-gray-600" />
        </Button>
        
        <Button
          onClick={() => handleSwipe("super")}
          variant="outline"
          size="icon"
          className="w-16 h-16 rounded-full border-2 border-travel-accent text-travel-accent hover:bg-travel-accent hover:text-white hover:scale-110 transition-all duration-300"
          disabled={swipeMutation.isPending}
        >
          <Star className="w-6 h-6" />
        </Button>
        
        <Button
          onClick={() => handleSwipe("like")}
          size="icon"
          className="w-16 h-16 rounded-full bg-travel-primary hover:bg-red-500 hover:scale-110 transition-all duration-300"
          disabled={swipeMutation.isPending}
        >
          <Heart className="w-6 h-6" />
        </Button>
      </div>

      {/* Quick Filters */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-travel-dark mb-3 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Quick Filters
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="justify-start">
              <MapPin className="w-4 h-4 mr-2" />
              Nearby
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Heart className="w-4 h-4 mr-2" />
              Homestays
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Car className="w-4 h-4 mr-2" />
              Rides
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              📅 This Week
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
