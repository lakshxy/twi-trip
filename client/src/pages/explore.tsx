
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
  const { user, isLoading, logout } = useAuth();
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
      setWelcomeMessage(`Welcome, ${user.displayName || user.email}!`);
      localStorage.removeItem('justSignedUp');
    } else if (user) {
      setWelcomeMessage(`Welcome back, ${user.displayName || user.email}!`);
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

  const { data: recentMatchesRaw } = useQuery({
    queryKey: ["/api/matches"],
    enabled: !!user,
  });
  const safeRecentMatches = Array.isArray(recentMatchesRaw) ? recentMatchesRaw : [];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlanTrip = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newItem = { id: Date.now(), ...form, type: form.type as any, status: 'upcoming' as any };
    setItinerary((prev) => [...prev, newItem]);
    setShowPlanTrip(false);
    setForm({ title: "", destination: "", date: "", type: "activity", reminder: "" });
    if (form.reminder) {
      const ms = new Date(form.reminder).getTime() - new Date().getTime();
      if (ms > 0) setTimeout(() => toast({ title: "Trip Reminder", description: `It's time for: ${form.title}` }), ms);
    }
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
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-warm pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection welcomeMessage={welcomeMessage} />
        <DailyTravelTip todaysTip={todaysTip} />
        <StatsGrid />

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
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
            <RecentActivity recentMatches={safeRecentMatches} handleViewProfile={handleViewProfile} handleMessageUser={handleMessageUser} />
          </div>
          
          {currentPlace && (
            <Card className="bg-white/80 backdrop-blur-sm border-travel-navy/10">
              <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-b from-travel-navy to-travel-lavender rounded-2xl flex items-center justify-center mb-3">
                  <MapPin className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-base md:text-xl font-bold text-travel-navy mb-2">Travel Itinerary Guide</h3>
                <p className="text-travel-navy/80 mb-3 text-sm md:text-base">
                  Discover popular places and daily itineraries.
                </p>
                <div className="mb-4 w-full flex flex-col items-center">
                  <img src={currentPlace.image} alt={currentPlace.name} className="rounded-lg shadow-md mb-2 w-full max-w-xs object-cover h-24 md:h-32" />
                  <h4 className="font-semibold text-travel-navy text-base md:text-lg">{currentPlace.name}</h4>
                  <div className="flex items-center text-xs md:text-sm text-travel-navy/70 mb-1">
                    <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    {currentPlace.city}
                  </div>
                  <div className="flex items-center text-xs text-travel-navy/60">
                    <Star className="w-3 h-3 text-yellow-500 mr-1" />
                    {currentPlace.rating} &bull; {currentPlace.duration} &bull; Best: {currentPlace.bestTime}
                  </div>
                </div>
                <Link href="/itinerary">
                  <Button className="bg-travel-navy bg-gradient-to-r from-travel-navy to-travel-lavender text-white px-4 py-2 rounded-xl font-semibold shadow-md text-sm">
                    Explore Itinerary
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        <LanguagePhrases />
        <FilterSection filterRoles={filterRoles} setFilterRoles={setFilterRoles} filterPurposes={filterPurposes} setFilterPurposes={setFilterPurposes} />
        <ActionCards />

        {showProfileModal && selectedProfile && (
          <ProfileModal profile={selectedProfile} isOfferingStay={false} isMatchView={true} onClose={() => setShowProfileModal(false)} onRequestStay={() => {}} onConnect={() => {}} onMessage={() => {}} />
        )}

        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle>Delete this item?</DialogTitle>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => deleteTargetId && handleDeleteItinerary(deleteTargetId)}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
