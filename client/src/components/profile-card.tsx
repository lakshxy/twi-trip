import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Users, MessageCircle, Star, Calendar, Bed } from "lucide-react";
import type { Profile, User } from "@shared/schema";

interface ProfileCardProps {
  profile: Profile & { user: User };
  isOfferingStay?: boolean;
  stayType?: "free" | "paid";
  roomType?: "private" | "shared" | "couch";
  pricePerNight?: number;
  onViewProfile: (profile: Profile & { user: User }) => void;
}

export default function ProfileCard({ 
  profile, 
  isOfferingStay = false, 
  stayType = "free",
  roomType = "private",
  pricePerNight,
  onViewProfile 
}: ProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const placeholderImages = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
  ];

  const profileImage = profile.profileImage || placeholderImages[profile.userId % placeholderImages.length];

  const getStayBadge = () => {
    if (!isOfferingStay) {
      return (
        <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200">
          <Users className="w-3 h-3 mr-1" />
          Traveler Only
        </Badge>
      );
    }

    if (stayType === "free") {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200">
          <Home className="w-3 h-3 mr-1" />
          Free Stay
        </Badge>
      );
    }

    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">
        <Home className="w-3 h-3 mr-1" />
        Paid Stay
        {pricePerNight && (
          <span className="ml-1 font-semibold">₹{pricePerNight}</span>
        )}
      </Badge>
    );
  };

  const getRoomTypeIcon = () => {
    switch (roomType) {
      case "private":
        return <Home className="w-3 h-3" />;
      case "shared":
        return <Users className="w-3 h-3" />;
      case "couch":
        return <Bed className="w-3 h-3" />;
      default:
        return <Home className="w-3 h-3" />;
    }
  };

  return (
    <Card 
      className={`modern-card border-0 cursor-pointer transition-all duration-300 overflow-hidden ${
        isHovered ? 'shadow-xl scale-[1.02]' : 'shadow-lg hover:shadow-xl'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewProfile(profile)}
    >
      <div className="relative">
        {/* Profile Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={profileImage}
            alt={`${profile.user.name}'s profile`}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Stay Badge - Top Right */}
          <div className="absolute top-3 right-3">
            {getStayBadge()}
          </div>

          {/* Rating - Top Left */}
          {profile.rating && Number(profile.rating) > 0 && (
            <div className="absolute top-3 left-3 flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs font-semibold text-gray-700 ml-1">
                {Number(profile.rating).toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Name and Age */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-travel-navy">
                {profile.user.name}
                {profile.age && (
                  <span className="text-gray-500 font-normal ml-2">
                    {profile.age}
                  </span>
                )}
              </h3>
            </div>
          </div>

          {/* Location */}
          {(profile.city || profile.state) && (
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-2 text-travel-lavender" />
              <span className="text-sm font-medium">
                {[profile.city, profile.state].filter(Boolean).join(", ")}
              </span>
            </div>
          )}

          {/* Bio Preview */}
          {profile.bio && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Stay Details (if offering stay) */}
          {isOfferingStay && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              {getRoomTypeIcon()}
              <span className="ml-2 capitalize">
                {roomType} room
              </span>
            </div>
          )}

          {/* Interests Preview */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {profile.interests.slice(0, 2).map((interest, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="text-xs bg-travel-mint/20 text-travel-mint hover:bg-travel-mint/30 border-0"
                >
                  {interest}
                </Badge>
              ))}
              {profile.interests.length > 2 && (
                <Badge 
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-600 border-0"
                >
                  +{profile.interests.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Trip Count */}
          {profile.tripCount && profile.tripCount > 0 && (
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{profile.tripCount} trip{profile.tripCount !== 1 ? 's' : ''} completed</span>
            </div>
          )}

          {/* Action Button */}
          <Button 
            className="w-full bg-gradient-primary text-white py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {isOfferingStay ? 'Request Stay' : 'Connect'}
          </Button>
        </CardContent>
      </div>
    </Card>
  );
} 