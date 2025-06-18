import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { Profile, User } from "@shared/schema";

interface SwipeCardProps {
  profile: Profile & { user: User };
  onSwipe: (action: string) => void;
}

export default function SwipeCard({ profile, onSwipe }: SwipeCardProps) {
  const placeholderImages = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
  ];

  const profileImage = profile.profileImage || placeholderImages[profile.userId % placeholderImages.length];

  return (
    <Card className="swipe-card absolute inset-0 overflow-hidden cursor-pointer">
      <div className="relative h-64">
        <img 
          src={profileImage}
          alt={`${profile.user.name}'s profile`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-travel-dark">
            {profile.user.name}{profile.age && `, ${profile.age}`}
          </h3>
          {profile.rating && Number(profile.rating) > 0 && (
            <span className="text-yellow-500 text-sm font-medium">
              ⭐ {Number(profile.rating).toFixed(1)}
            </span>
          )}
        </div>
        
        {(profile.city || profile.state) && (
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {[profile.city, profile.state].filter(Boolean).join(", ")}
            </span>
          </div>
        )}
        
        {profile.bio && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {profile.bio}
          </p>
        )}
        
        {profile.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profile.interests.slice(0, 3).map((interest, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="text-xs bg-travel-primary/10 text-travel-primary hover:bg-travel-primary/20"
              >
                {interest}
              </Badge>
            ))}
            {profile.interests.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{profile.interests.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        {profile.tripCount > 0 && (
          <p className="text-xs text-travel-accent mt-2">
            {profile.tripCount} trip{profile.tripCount !== 1 ? 's' : ''} completed
          </p>
        )}
      </CardContent>
    </Card>
  );
}
