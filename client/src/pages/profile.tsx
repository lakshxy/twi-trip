import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Camera, Star, User, Home, Car } from "lucide-react";
import type { Profile, User as UserType } from "@shared/schema";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery<Profile & { user: UserType }>({
    queryKey: ["/api/profile"],
  });

  const [formData, setFormData] = useState({
    bio: "",
    city: "",
    state: "",
    age: "",
    interests: "",
    languages: "",
    travelGoals: "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
  });

  const handleEdit = () => {
    if (profile) {
      setFormData({
        bio: profile.bio || "",
        city: profile.city || "",
        state: profile.state || "",
        age: profile.age?.toString() || "",
        interests: profile.interests?.join(", ") || "",
        languages: profile.languages?.join(", ") || "",
        travelGoals: profile.travelGoals?.join(", ") || "",
      });
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    const profileData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
      interests: formData.interests.split(",").map(s => s.trim()).filter(Boolean),
      languages: formData.languages.split(",").map(s => s.trim()).filter(Boolean),
      travelGoals: formData.travelGoals.split(",").map(s => s.trim()).filter(Boolean),
    };
    
    updateProfileMutation.mutate(profileData);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const placeholderImages = [
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
    "https://images.unsplash.com/photo-1583395865554-58296a044a3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
  ];

  const profileImages = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
  ];

  const coverImage = placeholderImages[user?.id % placeholderImages.length];
  const avatarImage = profile?.profileImage || profileImages[user?.id % profileImages.length];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="overflow-hidden">
        {/* Profile Header */}
        <div className="relative">
          <div 
            className="h-48 bg-cover bg-center"
            style={{ backgroundImage: `url('${coverImage}')` }}
          />
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>

        <CardContent className="p-6">
          {/* Profile Avatar and Basic Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={avatarImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-lg"
                >
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-travel-dark">
                  {user?.name}
                </h2>
                {(profile?.city || profile?.state) && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{[profile.city, profile.state].filter(Boolean).join(", ")}</span>
                  </div>
                )}
                <div className="flex items-center space-x-4 mt-1">
                  {profile?.rating && Number(profile.rating) > 0 && (
                    <div className="flex items-center text-travel-accent">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="text-sm">{Number(profile.rating).toFixed(1)} rating</span>
                    </div>
                  )}
                  <span className="text-sm text-gray-600">
                    {profile?.tripCount || 0} trip{profile?.tripCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={isEditing ? handleSave : handleEdit}
              disabled={updateProfileMutation.isPending}
              className="bg-travel-primary hover:bg-red-500"
            >
              {isEditing ? "Save Profile" : "Edit Profile"}
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-6">
              {/* Bio Section */}
              <div>
                <Label htmlFor="bio" className="text-sm font-semibold text-travel-dark">
                  About Me
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell others about your travel style and interests..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="mt-2"
                  rows={4}
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-semibold text-travel-dark">
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="e.g., Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm font-semibold text-travel-dark">
                    State
                  </Label>
                  <Input
                    id="state"
                    placeholder="e.g., Maharashtra"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <Label htmlFor="age" className="text-sm font-semibold text-travel-dark">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="mt-2"
                />
              </div>

              {/* Interests */}
              <div>
                <Label htmlFor="interests" className="text-sm font-semibold text-travel-dark">
                  Travel Interests
                </Label>
                <Input
                  id="interests"
                  placeholder="Adventure, Photography, Food, Culture (comma separated)"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  className="mt-2"
                />
              </div>

              {/* Languages */}
              <div>
                <Label htmlFor="languages" className="text-sm font-semibold text-travel-dark">
                  Languages
                </Label>
                <Input
                  id="languages"
                  placeholder="English, Hindi, Marathi (comma separated)"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="mt-2"
                />
              </div>

              {/* Travel Goals */}
              <div>
                <Label htmlFor="travelGoals" className="text-sm font-semibold text-travel-dark">
                  Travel Goals
                </Label>
                <Input
                  id="travelGoals"
                  placeholder="Visit all Indian states, Learn photography, Try local cuisines"
                  value={formData.travelGoals}
                  onChange={(e) => setFormData({ ...formData, travelGoals: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 bg-travel-primary hover:bg-red-500"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Bio Section */}
              {profile?.bio && (
                <div>
                  <h3 className="font-semibold text-travel-dark mb-3">About Me</h3>
                  <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Interests */}
              {profile?.interests && profile.interests.length > 0 && (
                <div>
                  <h3 className="font-semibold text-travel-dark mb-3">Travel Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <Badge 
                        key={index}
                        className="bg-travel-primary/10 text-travel-primary hover:bg-travel-primary/20"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {profile?.languages && profile.languages.length > 0 && (
                <div>
                  <h3 className="font-semibold text-travel-dark mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((language, index) => (
                      <Badge key={index} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Travel Goals */}
              {profile?.travelGoals && profile.travelGoals.length > 0 && (
                <div>
                  <h3 className="font-semibold text-travel-dark mb-3">Current Travel Goals</h3>
                  <ul className="space-y-2">
                    {profile.travelGoals.map((goal, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <span className="text-travel-accent mr-2">✓</span>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(!profile?.bio && (!profile?.interests || profile.interests.length === 0)) && (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Your profile is looking a bit empty!</p>
                  <Button onClick={handleEdit} className="bg-travel-primary hover:bg-red-500">
                    Complete Your Profile
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Button
          variant="outline"
          className="py-3 border-travel-secondary text-travel-secondary hover:bg-travel-secondary hover:text-white"
          onClick={() => window.location.href = "/properties"}
        >
          <Home className="w-4 h-4 mr-2" />
          Browse Homestays
        </Button>
        <Button
          variant="outline"
          className="py-3 border-travel-accent text-travel-accent hover:bg-travel-accent hover:text-white"
          onClick={() => window.location.href = "/rides"}
        >
          <Car className="w-4 h-4 mr-2" />
          Find Rides
        </Button>
      </div>
    </div>
  );
}
