
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { destinations } from "@/lib/destinations";
import ProfileModal from "@/components/profile-modal";
import type { Profile, User as UserType } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import WelcomeSection from "@/components/explore/WelcomeSection";
import DailyTravelTip from "@/components/explore/DailyTravelTip";
import StatsGrid from "@/components/explore/StatsGrid";
import TravelItinerary from "@/components/explore/TravelItinerary";
import LanguagePhrases from "@/components/explore/LanguagePhrases";
import FilterSection from "@/components/explore/FilterSection";
import ActionCards from "@/components/explore/ActionCards";
import RecentActivity from "@/components/explore/RecentActivity";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { Link } from "wouter";

interface TravelTip {
  id: number;
  title: string;
  content: string;
  icon: string;
  category: string;
}

interface ItineraryItem {
  id: number;
  destination: string;
  date: string;
  type: 'flight' | 'hotel' | 'activity';
  status: 'upcoming' | 'completed' | 'cancelled';
  title: string;
  reminder?: string;
}

export default function HomePage() {
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedProfile, setSelectedProfile] = useState<(Profile & { user: UserType }) | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPlanTrip, setShowPlanTrip] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [form, setForm] = useState({
    title: "",
    destination: "",
    date: "",
    type: "activity",
    reminder: ""
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedItineraryId, setSelectedItineraryId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState("");

  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [filterPurposes, setFilterPurposes] = useState<string[]>([]);

  useEffect(() => {
    if (user && localStorage.getItem('justSignedUp') === 'true') {
      setWelcomeMessage(`Welcome, ${user.email}!`);
      localStorage.removeItem('justSignedUp');
    } else if (user) {
      setWelcomeMessage(`Welcome back, ${user.email}!`);
    } else {
      setWelcomeMessage("Welcome to TwiTrip! Explore our features below.");
    }
  }, [user]);

  const travelTips: TravelTip[] = [
    {
      id: 1, title: "Pack Light", content: "Roll your clothes to save space.", icon: "🧳", category: "Packing"
    },
    {
      id: 2, title: "Stay Connected", content: "Download offline maps.", icon: "📱", category: "Communication"
    },
    {
      id: 3, title: "Safety First", content: "Share your itinerary.", icon: "🔒", category: "Safety"
    },
    {
      id: 4, title: "Local Experiences", content: "Talk to locals for hidden gems.", icon: "🌟", category: "Culture"
    }
  ];

  const todaysTip = travelTips[Math.floor(Math.random() * travelTips.length)];

  const destinationKeys: string[] = Object.keys(destinations);
  const randomDestinationKey: string = destinationKeys[Math.floor(Math.random() * destinationKeys.length)];
  const randomDestination = (destinations as any)[randomDestinationKey];
  const popularPlaces = randomDestination?.popularPlaces || [];
  const currentPlace = popularPlaces.length > 0 ? popularPlaces[Math.floor(Math.random() * popularPlaces.length)] : null;

  const { data: recentMatchesRaw = [] } = useQuery<(Profile & { user: UserType })[]>({
    queryKey: ["/api/matches"],
  });

  const safeRecentMatches = recentMatchesRaw.slice(0, 3);

  const handlePlanTrip = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.title && form.destination && form.date) {
      const newItem: ItineraryItem = {
        id: Date.now(),
        destination: form.destination,
        date: form.date,
        type: form.type as any,
        status: 'upcoming',
        title: form.title,
        reminder: form.reminder || undefined,
      };
      setItinerary(prev => [...prev, newItem]);
      setForm({ title: "", destination: "", date: "", type: "activity", reminder: "" });
      setShowPlanTrip(false);
      toast({
        title: "Trip Planned! 🎉",
        description: `${form.title} has been added to your itinerary.`,
      });
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDeleteItinerary = (id: number) => {
    setItinerary((prev) => prev.filter(item => item.id !== id));
    setShowDeleteConfirm(false);
  };

  const handleEditItinerary = (item: ItineraryItem) => {
    setEditingId(item.id);
    setForm({ ...item, reminder: item.reminder || "" });
    setShowPlanTrip(true);
  };

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setItinerary((prev) => prev.map(item => item.id === editingId ? { ...item, ...form, type: form.type as any } : item));
    setShowPlanTrip(false);
    setEditingId(null);
    setForm({ title: "", destination: "", date: "", type: "activity", reminder: "" });
  };

  const handleViewProfile = (profile: Profile & { user: UserType }) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  const handleMessageUser = (userId: number) => {
    setLocation(`/messages?user=${userId}`);
    toast({ title: "Redirecting to Messages", description: "Opening your conversation." });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-travel-light via-white to-travel-beige pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <WelcomeSection welcomeMessage={welcomeMessage} />
        </div>

        {/* Daily Travel Tip */}
        <div className="mb-6 sm:mb-8">
          <DailyTravelTip todaysTip={todaysTip} />
        </div>

        {/* Stats Grid */}
        <div className="mb-6 sm:mb-8">
          <StatsGrid />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Travel Itinerary */}
            <TravelItinerary
              itinerary={itinerary}
              showPlanTrip={showPlanTrip}
              setShowPlanTrip={setShowPlanTrip}
              editingId={editingId}
              form={form}
              handleFormChange={handleFormChange}
              setForm={setForm}
              handleSaveEdit={handleSaveEdit}
              handlePlanTrip={handlePlanTrip}
              selectedItineraryId={selectedItineraryId}
              setSelectedItineraryId={setSelectedItineraryId}
              handleEditItinerary={handleEditItinerary}
              setShowDeleteConfirm={setShowDeleteConfirm}
              setDeleteTargetId={setDeleteTargetId}
            />

            {/* Recent Activity */}
            <RecentActivity 
              recentMatches={safeRecentMatches} 
              handleViewProfile={handleViewProfile} 
              handleMessageUser={handleMessageUser} 
            />
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-6 lg:space-y-8">
            {/* Current Place Card */}
            {currentPlace && (
              <Card className="glass-card animate-fade-in">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-travel-lavender/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-travel-navy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-travel-navy text-sm sm:text-base mb-1">
                        {currentPlace.name}
                      </h3>
                      <p className="text-travel-navy/70 text-xs sm:text-sm mb-2">
                        {currentPlace.description}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-travel-navy/60">
                          {currentPlace.rating || "4.5"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Language Phrases */}
            <LanguagePhrases />

            {/* Filter Section */}
            <FilterSection 
              filterRoles={filterRoles}
              setFilterRoles={setFilterRoles}
              filterPurposes={filterPurposes}
              setFilterPurposes={setFilterPurposes}
            />
          </div>
        </div>

        {/* Action Cards */}
        <div className="mb-8">
          <ActionCards />
        </div>
      </div>

             {/* Profile Modal */}
       {showProfileModal && selectedProfile && (
         <ProfileModal
           profile={selectedProfile}
           onClose={() => setShowProfileModal(false)}
           onMessage={() => handleMessageUser(selectedProfile.userId)}
         />
       )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Itinerary Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this itinerary item? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteTargetId && handleDeleteItinerary(deleteTargetId)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
