import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  X, 
  MapPin, 
  Home, 
  Users, 
  MessageCircle, 
  Star, 
  Calendar, 
  Globe, 
  Heart,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  DollarSign,
  Bed,
  UserCheck
} from "lucide-react";
import type { Profile, User } from "@shared/schema";

interface ProfileModalProps {
  profile: Profile & { user: User };
  isOfferingStay?: boolean;
  stayType?: "free" | "paid";
  roomType?: "private" | "shared" | "couch";
  pricePerNight?: number;
  stayRules?: string[];
  guestPreferences?: string[];
  availability?: {
    from: string;
    to: string;
  };
  photos?: string[];
  onClose: () => void;
  onRequestStay?: () => void;
  onConnect?: () => void;
  onMessage?: () => void;
  isMatchView?: boolean;
}

export default function ProfileModal({
  profile,
  isOfferingStay = false,
  stayType = "free",
  roomType = "private",
  pricePerNight,
  stayRules = [],
  guestPreferences = [],
  availability,
  photos = [],
  onClose,
  onRequestStay,
  onConnect,
  onMessage,
  isMatchView = false
}: ProfileModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const placeholderImages = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
  ];

  const profileImage = profile.profileImage || placeholderImages[profile.userId % placeholderImages.length];
  const allPhotos = photos.length > 0 ? photos : [profileImage];

  // Support per-photo details for demo
  const currentPhotoObj = Array.isArray((profile as any).photos) && (profile as any).photos[currentPhotoIndex] && typeof (profile as any).photos[currentPhotoIndex] === 'object'
    ? (profile as any).photos[currentPhotoIndex]
    : null;

  // Use per-photo details if available, else fallback to profile
  const details = currentPhotoObj || profile;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getStayBadge = () => {
    if (!isOfferingStay) {
      return (
        <Badge className="bg-gray-100 text-gray-600 border-gray-200 px-3 py-1">
          <Users className="w-4 h-4 mr-2" />
          Traveler Only
        </Badge>
      );
    }

    if (stayType === "free") {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
          <Home className="w-4 h-4 mr-2" />
          Free Stay
        </Badge>
      );
    }

    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
        <Home className="w-4 h-4 mr-2" />
        Paid Stay
        {pricePerNight && (
          <span className="ml-2 font-semibold">₹{pricePerNight}/night</span>
        )}
      </Badge>
    );
  };

  const getRoomTypeIcon = () => {
    switch (roomType) {
      case "private":
        return <Home className="w-5 h-5" />;
      case "shared":
        return <Users className="w-5 h-5" />;
      case "couch":
        return <Bed className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`relative w-full max-w-4xl transform transition-all duration-300 ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        <Card className="modern-card border-0 shadow-2xl bg-white overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-800 transition-all duration-200 shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col lg:flex-row max-h-[90vh]">
            {/* Left Side - Photos */}
            <div className="lg:w-1/2 relative">
              {/* Main Photo */}
              <div className="relative h-64 lg:h-full">
                <img 
                  src={allPhotos[currentPhotoIndex]}
                  alt={`${profile.user.name}'s photo ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                
                {/* Photo Navigation */}
                {allPhotos.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentPhotoIndex(prev => prev > 0 ? prev - 1 : allPhotos.length - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:bg-white transition-all duration-200"
                    >
                      <span className="text-xl">‹</span>
                    </button>
                    <button
                      onClick={() => setCurrentPhotoIndex(prev => prev < allPhotos.length - 1 ? prev + 1 : 0)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:bg-white transition-all duration-200"
                    >
                      <span className="text-xl">›</span>
                    </button>
                    
                    {/* Photo Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {allPhotos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {/* Horizontal Thumbnail Strip */}
              {allPhotos.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto mt-2 px-2 pb-1">
                  {allPhotos.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition-all duration-200 ${idx === currentPhotoIndex ? 'border-travel-mint ring-2 ring-travel-mint' : 'border-transparent'}`}
                      onClick={() => setCurrentPhotoIndex(idx)}
                      alt={`Thumbnail ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Content */}
            <div className="lg:w-1/2 p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-2xl font-bold text-travel-navy mb-1">
                      {profile.user.name}
                      {profile.age && (
                        <span className="text-gray-500 font-normal ml-3">
                          {profile.age} years old
                        </span>
                      )}
                      {details.tagline && (
                        <span className="block text-travel-mint text-lg font-medium mt-1">{details.tagline}</span>
                      )}
                    </h2>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2 text-travel-lavender" />
                      <span className="font-medium">
                        {[profile.city, profile.state].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStayBadge()}
                    {profile.rating && Number(profile.rating) > 0 && (
                      <div className="flex items-center bg-yellow-50 rounded-full px-3 py-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-700 ml-1">
                          {Number(profile.rating).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="flex items-center text-sm text-green-600 mb-4">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Verified Profile</span>
                </div>
              </div>

              {/* About Me */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-travel-navy mb-3">About Me</h3>
                {details.bio && (
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {details.bio}
                  </p>
                )}

                {/* Languages */}
                {profile.languages && profile.languages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.map((language, index) => (
                        <Badge key={index} variant="secondary" className="bg-travel-lavender/20 text-travel-lavender border-0">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interests */}
                {details.interests && details.interests.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(details.interests as string[]).map((interest: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-travel-mint/20 text-travel-mint border-0">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Travel Goals */}
                {profile.travelGoals && profile.travelGoals.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Travel Goals
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.travelGoals.map((goal, index) => (
                        <Badge key={index} variant="outline" className="border-travel-navy/20 text-travel-navy">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stay Information */}
              {isOfferingStay && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-travel-navy mb-3">Stay Information</h3>
                  <Card className="bg-travel-light/50 border-travel-lavender/20">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getRoomTypeIcon()}
                            <span className="ml-2 font-medium capitalize">{roomType} room</span>
                          </div>
                          {pricePerNight && (
                            <div className="flex items-center text-green-600 font-semibold">
                              <DollarSign className="w-4 h-4 mr-1" />
                              ₹{pricePerNight}/night
                            </div>
                          )}
                        </div>

                        {stayRules.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">House Rules</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {stayRules.map((rule, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-travel-mint mr-2">•</span>
                                  {rule}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {guestPreferences.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Guest Preferences</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {guestPreferences.map((pref, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-travel-lavender mr-2">•</span>
                                  {pref}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {availability && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Available from {availability.from} to {availability.to}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Trip Count */}
              {profile.tripCount && profile.tripCount > 0 && (
                <div className="mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium">{profile.tripCount} trip{profile.tripCount !== 1 ? 's' : ''} completed</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {isOfferingStay ? (
                  <Button
                    onClick={onRequestStay}
                    className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Request Stay
                  </Button>
                ) : (
                  !isMatchView && (
                    <Button
                      onClick={onConnect}
                      className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <UserCheck className="w-5 h-5 mr-2" />
                      Connect
                    </Button>
                  )
                )}
                
                <Button
                  onClick={onMessage}
                  variant="outline"
                  className="w-full border-travel-navy/20 text-travel-navy py-3 rounded-xl font-medium hover:bg-travel-lavender/10 transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 