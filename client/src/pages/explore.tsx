import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, MapPin, Star, TrendingUp, Users, Calendar, Zap, Plane, Home, Car, Compass, Clock, Globe, Camera, Lightbulb, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { destinations } from "@/lib/destinations";
import ProfileModal from "@/components/profile-modal";
import type { Profile, User as UserType } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import React from "react";
import logo from "@/assets/twi logo.png";

interface DashboardStats {
  matches: number;
  messages: number;
  properties: number;
  rides: number;
}

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

  // Filter state for roles and purposes
  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [filterPurposes, setFilterPurposes] = useState<string[]>([]);

  // Example: profiles would be fetched from backend or context
  const profiles: any[] = []; // TODO: Replace with real data

  // Filtering logic
  const filteredProfiles = profiles.filter(profile => {
    const matchesRoles = filterRoles.length === 0 || filterRoles.some(role => profile.roles?.includes(role));
    const matchesPurposes = filterPurposes.length === 0 || filterPurposes.some(purpose => profile.purposes?.includes(purpose));
    return matchesRoles && matchesPurposes;
  });

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

  // Sample travel tips data
  const travelTips: TravelTip[] = [
    {
      id: 1,
      title: "Pack Light",
      content: "Roll your clothes instead of folding to save space and reduce wrinkles. Use packing cubes to organize your belongings.",
      icon: "🧳",
      category: "Packing"
    },
    {
      id: 2,
      title: "Stay Connected",
      content: "Download offline maps and translation apps before your trip. Consider getting a local SIM card for better data rates.",
      icon: "📱",
      category: "Communication"
    },
    {
      id: 3,
      title: "Safety First",
      content: "Share your itinerary with family and friends. Keep digital copies of important documents in a secure cloud storage.",
      icon: "🔒",
      category: "Safety"
    },
    {
      id: 4,
      title: "Local Experiences",
      content: "Talk to locals for hidden gems and authentic experiences. Consider staying in local neighborhoods instead of tourist areas.",
      icon: "🌟",
      category: "Culture"
    }
  ];

  // Get random travel tip
  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * travelTips.length);
    return travelTips[randomIndex];
  };

  const todaysTip = getRandomTip();

  // Pick a random destination and a random popular place
  const destinationKeys: string[] = Object.keys(destinations);
  const randomDestinationKey: string = destinationKeys[Math.floor(Math.random() * destinationKeys.length)];
  const randomDestination = (destinations as any)[randomDestinationKey];
  const popularPlaces = randomDestination && Array.isArray(randomDestination.popularPlaces) ? randomDestination.popularPlaces : [];
  const currentPlace = popularPlaces.length > 0 ? popularPlaces[Math.floor(Math.random() * popularPlaces.length)] : null;

  // Allow access without authentication
  useEffect(() => {
    // No redirect needed - users can explore without signing up
  }, [user, isLoading, toast, setLocation]);

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
    retry: false,
  });

  const { data: recentMatchesRaw } = useQuery({
    queryKey: ["/api/matches"],
    enabled: !!user,
    retry: false,
  });

  const safeRecentMatches = Array.isArray(recentMatchesRaw) && recentMatchesRaw.length > 0 ? recentMatchesRaw : [];

  const { data: messagesRaw } = useQuery({
    queryKey: ["/api/messages"],
    enabled: !!user,
    retry: false,
  });

  const safeMessages = Array.isArray(messagesRaw) && messagesRaw.length > 0 ? messagesRaw : [];

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  // Handle form submit
  const handlePlanTrip = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      ...form,
      type: form.type as 'flight' | 'hotel' | 'activity',
      status: 'upcoming' as 'upcoming',
    };
    setItinerary((prev) => [...prev, newItem]);
    setShowPlanTrip(false);
    setForm({ title: "", destination: "", date: "", type: "activity", reminder: "" });
    // Demo reminder notification
    if (form.reminder) {
      const now = new Date();
      const reminderDate = new Date(form.reminder);
      const ms = reminderDate.getTime() - now.getTime();
      if (ms > 0) {
        setTimeout(() => {
          toast({
            title: "Trip Reminder",
            description: `It's time for: ${form.title}`
          });
        }, ms);
      }
    }
  };

  // Handle delete itinerary item
  const handleDeleteItinerary = (id: number) => {
    setItinerary((prev) => prev.filter(item => item.id !== id));
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };
  // Handle start editing
  const handleEditItinerary = (item: typeof itinerary[0]) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      destination: item.destination,
      date: item.date,
      type: item.type,
      reminder: item.reminder || ""
    });
    setShowPlanTrip(true);
  };
  // Handle save edit
  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setItinerary((prev) => prev.map(item => item.id === editingId ? {
      ...item,
      ...form,
      type: form.type as 'flight' | 'hotel' | 'activity',
      status: 'upcoming' as 'upcoming',
    } : item));
    setShowPlanTrip(false);
    setEditingId(null);
    setForm({ title: "", destination: "", date: "", type: "activity", reminder: "" });
  };

  // Show explore page content even without authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    // Use Firebase logout
    logout();
  };

  const handleViewProfile = (profile: Profile & { user: UserType }) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setSelectedProfile(null);
  };

  const handleMessageUser = (userId: number) => {
    // Redirect to messages page with the specific user
    setLocation(`/messages?user=${userId}`);
    toast({
      title: "Redirecting to Messages",
      description: "Opening your conversation with this user.",
    });
  };

  const handleRequestStay = () => {
    toast({
      title: "Stay Request Sent! 🏠",
      description: "Your request has been sent to the host. They'll respond soon!",
    });
    handleCloseProfileModal();
  };

  const handleConnect = () => {
    toast({
      title: "Connection Request Sent! 🤝",
      description: "Your connection request has been sent. They'll respond soon!",
    });
    handleCloseProfileModal();
  };

  const handleMessage = () => {
    if (selectedProfile) {
      handleMessageUser(selectedProfile.userId);
    }
    handleCloseProfileModal();
  };

  return (
    <div className="min-h-screen bg-gradient-warm pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Welcome Section */}
        <div className="mb-8 relative">
          <div className="bg-gradient-to-r from-travel-navy/10 via-travel-mint/10 to-travel-soft-lavender/10 rounded-2xl p-8 border border-travel-soft-lavender/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-travel-navy mb-3 font-poppins">
                  {welcomeMessage} ✈️
                </h1>
                <p className="text-travel-navy/70 text-lg">Ready for your next adventure? Let's explore the world together!</p>
              </div>
              <div className="hidden md:block">
                <div className="text-6xl animate-bounce">🌍</div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Travel Tip */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-travel-mint/20 to-travel-soft-lavender/20 border-travel-mint/30 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">{todaysTip.icon}</div>
                <CardTitle className="text-travel-navy">💡 Daily Travel Tip</CardTitle>
                <Badge variant="secondary" className="bg-travel-mint/20 text-travel-navy border-travel-mint/30">
                  {todaysTip.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-travel-navy mb-2">{todaysTip.title}</h3>
              <p className="text-travel-navy/80">{todaysTip.content}</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 opacity-50 pointer-events-none select-none">
            {/* 1. Nearby Travelers */}
            <Card className="card-hover bg-gradient-to-br from-white to-travel-soft-lavender/10 border-travel-soft-lavender/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nearby Travelers</p>
                    <p className="text-3xl font-bold text-travel-navy">0</p>
                  </div>
                  <div className="bg-travel-soft-lavender/20 p-3 rounded-full">
                    <Users className="h-8 w-8 text-travel-soft-lavender" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Unseen Messages */}
            <Card className="card-hover bg-gradient-to-br from-white to-travel-mint/10 border-travel-mint/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Unseen Messages</p>
                    <p className="text-3xl font-bold text-travel-navy">0</p>
                    <p className="text-xs text-travel-navy/60 mt-1">Not yet opened</p>
                  </div>
                  <div className="bg-travel-mint/20 p-3 rounded-full">
                    <MessageCircle className="h-8 w-8 text-travel-mint" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Nearby Rides */}
            <Card className="card-hover bg-gradient-to-br from-white to-travel-terracotta/10 border-travel-terracotta/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nearby Rides</p>
                    <p className="text-3xl font-bold text-travel-navy">0</p>
                    <p className="text-xs text-travel-navy/60 mt-1">Ready to join</p>
                  </div>
                  <div className="bg-travel-terracotta/20 p-3 rounded-full">
                    <Car className="h-8 w-8 text-travel-terracotta" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. Homestays Nearby */}
            <Card className="card-hover bg-gradient-to-br from-white to-travel-sage/10 border-travel-sage/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Homestays Nearby</p>
                    <p className="text-3xl font-bold text-travel-navy">0</p>
                    <p className="text-xs text-travel-navy/60 mt-1">Book your stay</p>
                  </div>
                  <div className="bg-travel-sage/20 p-3 rounded-full">
                    <Home className="h-8 w-8 text-travel-sage" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="bg-white/80 text-travel-navy text-lg font-semibold px-6 py-2 rounded-xl shadow border border-travel-navy/10 mt-4">Available soon</span>
          </div>
        </div>

        {/* Travel Itinerary Section */}
        <div className="mb-8">
          <Card className="card-hover border-travel-navy/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-travel-navy" />
                  <CardTitle className="text-travel-navy">✈️ Your Travel Itinerary</CardTitle>
                </div>
                <Dialog open={showPlanTrip} onOpenChange={setShowPlanTrip}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-travel-mint text-travel-navy hover:bg-travel-mint/10">
                      <Plane className="h-4 w-4 mr-2" />
                      Plan Trip
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Plan a New Trip</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={editingId ? handleSaveEdit : handlePlanTrip} className="space-y-4">
                      <Input name="title" placeholder="Title (e.g. Visit Eiffel Tower)" value={form.title} onChange={handleFormChange} required />
                      <Input name="destination" placeholder="Destination" value={form.destination} onChange={handleFormChange} required />
                      <Input name="date" type="date" placeholder="Date" value={form.date} onChange={handleFormChange} required />
                      <Select name="type" value={form.type} onValueChange={val => setForm(f => ({ ...f, type: val }))}>
                        <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flight">Flight</SelectItem>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="activity">Activity</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input name="reminder" type="datetime-local" placeholder="Reminder Time (optional)" value={form.reminder} onChange={handleFormChange} />
                      <DialogFooter>
                        <Button type="submit" className="bg-travel-mint text-white">Add to Itinerary</Button>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {itinerary.length > 0 ? (
                <div className="space-y-4">
                  {itinerary.map((item) => (
                    <div key={item.id} className={`flex flex-col p-4 rounded-lg bg-gradient-to-r from-travel-navy/5 to-travel-mint/5 border border-travel-soft-lavender/20 mb-2 cursor-pointer ${selectedItineraryId === item.id ? 'ring-2 ring-travel-mint' : ''}`}
                      onClick={() => setSelectedItineraryId(item.id === selectedItineraryId ? null : item.id)}>
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {item.type === 'flight' && <Plane className="h-6 w-6 text-travel-navy" />}
                          {item.type === 'hotel' && <Home className="h-6 w-6 text-travel-mint" />}
                          {item.type === 'activity' && <Camera className="h-6 w-6 text-travel-soft-lavender" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-travel-navy">{item.title}</h4>
                          <p className="text-sm text-travel-navy/70 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {item.destination} • {item.date}
                          </p>
                        </div>
                        <Badge 
                          variant={item.status === 'upcoming' ? 'default' : 'secondary'}
                          className={`${item.status === 'upcoming' ? 'bg-travel-mint text-white' : 'bg-travel-soft-lavender/20 text-travel-navy'}`}
                        >
                          {item.status}
                        </Badge>
                        {selectedItineraryId === item.id && (
                          <div className="flex gap-2 ml-2">
                            <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); handleEditItinerary(item); }}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={e => { e.stopPropagation(); setShowDeleteConfirm(true); setDeleteTargetId(item.id); }}>Delete</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-lg font-semibold text-travel-navy mb-2">No trips planned yet</h3>
                  <p className="text-travel-navy/70 mb-4">Start planning your next adventure!</p>
                  <Button className="bg-travel-mint hover:bg-travel-mint/90 text-white" onClick={() => setShowPlanTrip(true)}>
                    <Compass className="h-4 w-4 mr-2" />
                    Create Itinerary
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Useful Local Language Phrases */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-travel-navy/5 via-white to-travel-mint/5 border-travel-navy/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="h-6 w-6 text-travel-navy" />
                <CardTitle className="text-travel-navy">🌐 Useful Local Language Phrases</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Example phrases, can be expanded or made dynamic */}
                <div className="p-4 rounded-lg bg-white border border-travel-soft-lavender/20 hover:shadow-md transition-shadow">
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-travel-navy mb-1">Hello</span>
                    <span className="text-sm text-travel-navy/70 mb-1">Hindi: <span className="font-medium">नमस्ते (Namaste)</span></span>
                    <span className="text-sm text-travel-navy/70 mb-1">Spanish: <span className="font-medium">Hola</span></span>
                    <span className="text-sm text-travel-navy/70">French: <span className="font-medium">Bonjour</span></span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white border border-travel-soft-lavender/20 hover:shadow-md transition-shadow">
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-travel-navy mb-1">Thank you</span>
                    <span className="text-sm text-travel-navy/70 mb-1">Hindi: <span className="font-medium">धन्यवाद (Dhanyavaad)</span></span>
                    <span className="text-sm text-travel-navy/70 mb-1">Spanish: <span className="font-medium">Gracias</span></span>
                    <span className="text-sm text-travel-navy/70">French: <span className="font-medium">Merci</span></span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white border border-travel-soft-lavender/20 hover:shadow-md transition-shadow">
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-travel-navy mb-1">How much is this?</span>
                    <span className="text-sm text-travel-navy/70 mb-1">Hindi: <span className="font-medium">यह कितने का है? (Yeh kitne ka hai?)</span></span>
                    <span className="text-sm text-travel-navy/70 mb-1">Spanish: <span className="font-medium">¿Cuánto cuesta?</span></span>
                    <span className="text-sm text-travel-navy/70">French: <span className="font-medium">Combien ça coûte?</span></span>
                  </div>
                </div>
              </div>
              <div className="text-center mt-6">
                <Button variant="outline" className="border-travel-mint text-travel-navy hover:bg-travel-mint/10">
                  <Globe className="h-4 w-4 mr-2" />
                  View More Phrases
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <Card className="border-travel-mint/30 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-travel-navy">🔎 Filter People</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="font-semibold text-travel-navy">I want to...</label>
                <div className="flex gap-2 flex-wrap mt-2">
                  {[
                    'Explore new places',
                    'Meet new people',
                    'Offer a place to stay',
                    'Share local experiences',
                    'Organize group trips',
                    'Provide rides or transport',
                    'Help plan travel',
                    'Connect travelers with services',
                  ].map(role => (
                    <Button
                      key={role}
                      type="button"
                      variant={filterRoles.includes(role) ? 'default' : 'outline'}
                      onClick={() => setFilterRoles(f => f.includes(role) ? f.filter(r => r !== role) : [...f, role])}
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="font-semibold text-travel-navy">My main purpose</label>
                <div className="flex gap-2 flex-wrap mt-2">
                  {[
                    'Adventure & Exploration',
                    'Work & Networking',
                    'Volunteering & Giving Back',
                    'Cultural Exchange',
                    'Group Travel',
                    'Local Experiences',
                    'Travel Planning & Support',
                  ].map(purpose => (
                    <Button
                      key={purpose}
                      type="button"
                      variant={filterPurposes.includes(purpose) ? 'default' : 'outline'}
                      onClick={() => setFilterPurposes(f => f.includes(purpose) ? f.filter(p => p !== purpose) : [...f, purpose])}
                    >
                      {purpose}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/swipe">
            <Card className="card-hover transition-all duration-300 hover:scale-105 cursor-pointer group bg-gradient-to-br from-white to-travel-soft-lavender/10 border-travel-soft-lavender/30">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-travel-soft-lavender/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-travel-soft-lavender/30 transition-colors">
                    <Users className="h-10 w-10 text-travel-soft-lavender" />
                  </div>
                  <h3 className="font-bold mb-3 text-travel-navy text-lg">Discover People</h3>
                  <p className="text-sm text-travel-navy/70">Connect with fellow travelers and make lifelong friendships around the world</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/messages">
            <Card className="card-hover transition-all duration-300 hover:scale-105 cursor-pointer group bg-gradient-to-br from-white to-travel-mint/10 border-travel-mint/30">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-travel-mint/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-travel-mint/30 transition-colors">
                    <MessageCircle className="h-10 w-10 text-travel-mint" />
                  </div>
                  <h3 className="font-bold mb-3 text-travel-navy text-lg">💬 Messages</h3>
                  <p className="text-sm text-travel-navy/70">Chat with your connections and plan amazing adventures together</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/properties">
            <Card className="card-hover transition-all duration-300 hover:scale-105 cursor-pointer group bg-gradient-to-br from-white to-travel-sage/10 border-travel-sage/30">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-travel-sage/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-travel-sage/30 transition-colors">
                    <Home className="h-10 w-10 text-travel-sage" />
                  </div>
                  <h3 className="font-bold mb-3 text-travel-navy text-lg">🏠 Properties</h3>
                  <p className="text-sm text-travel-navy/70">Find unique accommodations or list your space for travelers</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/rides">
            <Card className="card-hover transition-all duration-300 hover:scale-105 cursor-pointer group bg-gradient-to-br from-white to-travel-terracotta/10 border-travel-terracotta/30">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-travel-terracotta/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-travel-terracotta/30 transition-colors">
                    <Car className="h-10 w-10 text-travel-terracotta" />
                  </div>
                  <h3 className="font-bold mb-3 text-travel-navy text-lg">🚗 Ride Sharing</h3>
                  <p className="text-sm text-travel-navy/70">Share rides, split costs, and make your journeys more fun</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/groups">
            <Card className="card-hover transition-all duration-300 hover:scale-105 cursor-pointer group bg-gradient-to-br from-white to-travel-lavender/10 border-travel-lavender/30">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-travel-lavender/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-travel-lavender/30 transition-colors">
                    <Users className="h-10 w-10 text-travel-lavender" />
                  </div>
                  <h3 className="font-bold mb-3 text-travel-navy text-lg">Group Travel Finder</h3>
                  <p className="text-sm text-travel-navy/70">Join travel groups for organized trips and adventures. Perfect for solo travelers or couples seeking group experiences.</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tour-guides">
            <Card className="card-hover transition-all duration-300 hover:scale-105 cursor-pointer group bg-gradient-to-br from-travel-mint/10 to-travel-soft-lavender/10 border-travel-mint/30">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-travel-mint/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-travel-mint/30 transition-colors">
                    <Globe className="h-10 w-10 text-travel-mint" />
                  </div>
                  <h3 className="font-bold mb-3 text-travel-navy text-lg">🌟 Tour Guides</h3>
                  <p className="text-sm text-travel-navy/70">Find local experts or become a guide yourself</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Matches */}
          <Card className="bg-white/80 backdrop-blur-sm border-travel-navy/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-travel-navy font-poppins">Recent Matches</h3>
                <Link href="/messages">
                  <Button variant="outline" size="sm" className="border-travel-navy/20 text-travel-navy hover:bg-travel-navy/5">View All</Button>
                </Link>
              </div>
              
              {safeRecentMatches.length > 0 ? (
                <div className="space-y-3">
                  {safeRecentMatches.slice(0, 3).map((match: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-travel-soft-lavender hover:bg-travel-light-mint/30 transition-colors">
                      <div 
                        className="w-12 h-12 bg-gradient-to-r from-travel-navy to-travel-mint rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => handleViewProfile(match.profile)}
                        title="View Profile"
                      >
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 cursor-pointer" onClick={() => handleViewProfile(match.profile)}>
                        <div className="font-medium text-travel-navy">{match.name}</div>
                        <div className="text-sm text-travel-navy/70">Planning trip to {match.destination}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-travel-mint hover:bg-travel-mint/10"
                        onClick={() => handleMessageUser(match.profile.userId)}
                        title="Send Message"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-travel-navy/30 mx-auto mb-4" />
                  <p className="text-travel-navy/70">No matches yet</p>
                  <p className="text-sm text-travel-navy/50">Start swiping to make connections!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Travel Insights */}
          {currentPlace && (
            <Card className="bg-white/80 backdrop-blur-sm border-travel-navy/10">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-b from-travel-navy to-travel-lavender rounded-2xl flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-travel-navy mb-3">Travel Itinerary Guide</h3>
                <p className="text-travel-navy/80 mb-4 text-base">
                  Discover popular places, activities, and efficient daily itineraries. Make the most of every travel day.
                </p>
                <div className="mb-6 w-full flex flex-col items-center">
                  <img src={currentPlace.image} alt={currentPlace.name} className="rounded-lg shadow-md mb-3 w-full max-w-xs object-cover" style={{height: 120}} />
                  <h4 className="font-semibold text-travel-navy text-lg">{currentPlace.name}</h4>
                  <div className="flex items-center text-sm text-travel-navy/70 mb-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {currentPlace.city}
                  </div>
                  <div className="flex items-center text-xs text-travel-navy/60 mb-2">
                    <Star className="w-3 h-3 text-yellow-500 mr-1" />
                    {currentPlace.rating} &bull; {currentPlace.duration} &bull; Best: {currentPlace.bestTime}
                  </div>
                  <p className="text-sm text-travel-navy/80 mb-2">{currentPlace.description}</p>
                </div>
                <Link href="/itinerary">
                  <Button className="bg-travel-navy bg-gradient-to-r from-travel-navy to-travel-lavender text-white px-6 py-2 rounded-xl font-semibold shadow-md">
                    Explore Itinerary
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Profile Modal */}
        {showProfileModal && selectedProfile && (
          <ProfileModal
            profile={selectedProfile}
            isOfferingStay={false}
            isMatchView={true}
            onClose={handleCloseProfileModal}
            onRequestStay={handleRequestStay}
            onConnect={handleConnect}
            onMessage={handleMessage}
          />
        )}

        {/* Delete confirmation dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete this itinerary item?</DialogTitle>
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