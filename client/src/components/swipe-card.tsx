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
    <Card className="swipe-card absolute inset-0 overflow-hidden cursor-pointer modern-card border-0 shadow-2xl">
      <div className="relative h-80">
        <img 
          src={profileImage}
          alt={`${profile.user.name}'s profile`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold">
              {profile.user.name}{profile.age && `, ${profile.age}`}
            </h3>
            {profile.rating && Number(profile.rating) > 0 && (
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-yellow-400 text-lg">⭐</span>
                <span className="text-white text-sm font-semibold ml-1">
                  {Number(profile.rating).toFixed(1)}
                </span>
              </div>
            )}
          </div>
          
          {(profile.city || profile.state) && (
            <div className="flex items-center text-white/90 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                {[profile.city, profile.state].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-6 bg-white">
        {profile.bio && (
          <p className="text-travel-navy/80 mb-4 line-clamp-3 text-base leading-relaxed">
            {profile.bio}
          </p>
        )}
        
        {profile.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.interests.slice(0, 3).map((interest, index) => (
              <Badge 
                key={index}
                className="text-xs bg-travel-mint/20 text-travel-mint hover:bg-travel-mint/30 border-0 rounded-xl px-3 py-1 font-medium"
              >
                {interest}
              </Badge>
            ))}
            {profile.interests.length > 3 && (
              <Badge className="text-xs bg-travel-lavender/20 text-travel-lavender border-0 rounded-xl px-3 py-1 font-medium">
                +{profile.interests.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        {profile.tripCount && profile.tripCount > 0 && (
          <p className="text-xs text-travel-navy/60 font-medium">
            {profile.tripCount} trip{profile.tripCount !== 1 ? 's' : ''} completed
          </p>
        )}
      </CardContent>
    </Card>
  );
}
