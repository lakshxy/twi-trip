import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Camera, Star, User, Home, Car } from "lucide-react";
import type { Profile, User as UserType } from "@shared/schema";
import { BackButton } from "@/components/back-button";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profileRaw, isLoading } = useQuery<Profile & { user: UserType }>({
    queryKey: ["/api/profile"],
  });

  const profile = profileRaw;

  const [formData, setFormData] = useState({
    name: "", bio: "", city: "", state: "", age: "",
    interests: "", languages: "", travelGoals: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: user?.name || "",
        bio: profile.bio || "",
        city: profile.city || "",
        state: profile.state || "",
        age: profile.age?.toString() || "",
        interests: profile.interests?.join(", ") || "",
        languages: profile.languages?.join(", ") || "",
        travelGoals: profile.travelGoals?.join(", ") || "",
      });
    }
  }, [profile, user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
  });

  const handleEdit = () => setIsEditing(true);
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
      <div className="p-4 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-5">
          <div className="h-36 bg-gray-200 rounded-2xl"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const profileImages = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
  ];

  const coverImage = profileImages[(user?.id || 0) % profileImages.length];
  const avatarImage = (profile?.profileImage) ? profile.profileImage : coverImage;

  if (!profile) {
    return (
      <div className="p-4 max-w-2xl mx-auto text-center text-gray-500">
        <h2 className="text-xl font-bold mb-3">No profile found</h2>
        <p>You haven't set up your profile yet. Click <b>Edit Profile</b> to get started!</p>
        <Button onClick={handleEdit} className="mt-4 bg-travel-navy text-white">Edit Profile</Button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="w-full flex justify-start mt-2 mb-4">
        <BackButton />
      </div>
      <Card className="overflow-hidden modern-card">
        <div className="relative">
          <div className="h-36 sm:h-48 bg-cover bg-center" style={{ backgroundImage: `url('${coverImage}')` }} />
          <Button variant="secondary" size="sm" className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white">
            <Camera className="w-4 h-4" />
          </Button>
        </div>

        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start justify-between mb-5">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="relative">
                <img src={avatarImage} alt="Profile" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg" />
                <Button variant="secondary" size="icon" className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-lg">
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-travel-dark">{user?.name}</h2>
                {(profile.city || profile.state) && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{[profile.city, profile.state].filter(Boolean).join(", ")}</span>
                  </div>
                )}
                 <div className="flex items-center space-x-3 mt-1">
                  {profile.rating && Number(profile.rating) > 0 && (
                    <div className="flex items-center text-travel-accent text-sm">
                      <Star className="w-4 h-4 mr-1" />
                      <span>{Number(profile.rating).toFixed(1)} rating</span>
                    </div>
                  )}
                  <span className="text-sm text-gray-600">{profile.tripCount || 0} trip{profile.tripCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            <Button onClick={isEditing ? handleSave : handleEdit} disabled={updateProfileMutation.isPending} className="w-full sm:w-auto bg-travel-navy hover:bg-travel-primary text-white">
              {isEditing ? "Save Profile" : "Edit Profile"}
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <FormField label="Full Name" id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <FormField label="About Me" id="bio" as="textarea" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="City" id="city" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                <FormField label="State" id="state" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
              </div>
              <FormField label="Age" id="age" type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
              <FormField label="Travel Interests" id="interests" placeholder="Adventure, Food... (comma separated)" value={formData.interests} onChange={e => setFormData({ ...formData, interests: e.target.value })} />
              <FormField label="Languages" id="languages" placeholder="English, Hindi... (comma separated)" value={formData.languages} onChange={e => setFormData({ ...formData, languages: e.target.value })} />
              <FormField label="Travel Goals" id="travelGoals" placeholder="Visit all states... (comma separated)" value={formData.travelGoals} onChange={e => setFormData({ ...formData, travelGoals: e.target.value })} />

              <div className="flex space-x-3 pt-2">
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleSave} disabled={updateProfileMutation.isPending} className="flex-1 bg-travel-navy text-white">
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {profile.bio && <InfoSection title="About Me" content={profile.bio} />}
              {profile.roles?.length > 0 && <InfoSection title="Roles" badges={profile.roles} />}
              {profile.purposes?.length > 0 && <InfoSection title="Purposes" badges={profile.purposes} />}
              {profile.frequency && <InfoSection title="Travel Frequency" badges={[profile.frequency]} />}
              {profile.hosting && <InfoSection title="Hosting Availability" badges={[profile.hosting]} />}
              {profile.interests?.length > 0 && <InfoSection title="Travel Interests" badges={profile.interests} />}
              {profile.languages?.length > 0 && <InfoSection title="Languages" badges={profile.languages} variant="outline" />}
              {profile.travelGoals?.length > 0 && <InfoSection title="Current Travel Goals" list={profile.travelGoals} />}
              {profile.connectWith?.length > 0 && <InfoSection title="Who I Want to Connect With" badges={profile.connectWith} />}
              {profile.comms?.length > 0 && <InfoSection title="Preferred Communication" badges={profile.comms} />}
              
              {(!profile.bio && !profile.interests?.length) && (
                <div className="text-center py-6">
                  <User className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">Your profile is looking a bit empty!</p>
                  <Button onClick={handleEdit} className="bg-travel-navy text-white">Complete Your Profile</Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
        <Button variant="outline" className="py-3 border-travel-navy text-travel-navy hover:bg-travel-navy hover:text-white" onClick={() => window.location.href = "/properties"}>
          <Home className="w-4 h-4 mr-2" /> Browse Homestays
        </Button>
        <Button variant="outline" className="py-3 border-travel-navy text-travel-navy hover:bg-travel-navy hover:text-white" onClick={() => window.location.href = "/rides"}>
          <Car className="w-4 h-4 mr-2" /> Find Rides
        </Button>
      </div>
    </div>
  );
}

// Helper component for form fields
const FormField = ({ id, label, as, ...props }: { id: string, label: string, as?: string, [key: string]: any }) => (
  <div>
    <Label htmlFor={id} className="text-sm font-semibold text-travel-dark">{label}</Label>
    {as === 'textarea' ? (
      <Textarea id={id} className="mt-2" rows={4} {...props} />
    ) : (
      <Input id={id} className="mt-2" {...props} />
    )}
  </div>
);

// Helper component for displaying profile info sections
const InfoSection = ({ title, content, badges, list, variant }: { title: string, content?: string, badges?: string[], list?: string[], variant?: "default" | "outline" }) => (
  <div>
    <h3 className="font-semibold text-travel-dark mb-2">{title}</h3>
    {content && <p className="text-gray-600 leading-relaxed">{content}</p>}
    {badges && (
      <div className="flex flex-wrap gap-2">
        {badges.map((item, index) => (
          <Badge key={index} className={variant === 'outline' ? "" : "bg-travel-primary/10 text-travel-primary border-0"} variant={variant}>{item}</Badge>
        ))}
      </div>
    )}
    {list && (
      <ul className="space-y-1">
        {list.map((item, index) => (
          <li key={index} className="flex items-center text-gray-600 text-sm">
            <span className="text-travel-accent mr-2">✓</span> {item}
          </li>
        ))}
      </ul>
    )}
  </div>
);
