import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Plus, Clock, MapPin, Flag, Star, Upload, Car, Eye, ArrowLeftRight, Calendar as CalendarIcon } from "lucide-react";
import RideCard from "@/components/ride-card";
import type { Ride, User } from "@shared/schema";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { BackButton } from "@/components/back-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import logo from "@/assets/twi logo.png";

export default function RidesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [view, setView] = useState<'find' | 'my'>('find');
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departure, setDeparture] = useState("");
  const [seats, setSeats] = useState(1);
  const [fare, setFare] = useState(25); // placeholder fare
  const [vehicle, setVehicle] = useState("Honda Civic, Blue, License: ABC-123"); // placeholder, could be from profile
  const [notes, setNotes] = useState("");
  const [luggage, setLuggage] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [womenOnly, setWomenOnly] = useState(false);
  const [music, setMusic] = useState(false);
  const [chat, setChat] = useState(false);
  const [stops, setStops] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [requestingRideId, setRequestingRideId] = useState<number | null>(null);
  const [location, setLocation] = useLocation();
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchDate, setSearchDate] = useState<Date | undefined>(undefined);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [acceptingRequest, setAcceptingRequest] = useState<any>(null);
  const [acceptNote, setAcceptNote] = useState("");
  const [sendingNote, setSendingNote] = useState(false);

  const form = useForm({
    defaultValues: {
      fromCity: "",
      toCity: "",
      departureDate: undefined,
      departureTime: "",
      seats: 1,
      fare: "",
      carDetails: "",
      luggage: false,
      petFriendly: false,
      womenOnly: false,
      music: false,
      chat: false,
      stops: "",
      notes: "",
      isFree: false,
    },
  });

  const { data: ridesRaw = [], isLoading } = useQuery<(Ride & { driver: User })[]>({
    queryKey: ["/api/rides"],
  });

  // Filter rides for 'My Rides' view
  let myRides = user
    ? ridesRaw.filter(r => (r.driver && (r.driver.id === user.id || r.driver.name === user.name)))
    : ridesRaw;

  // Filter rides based on search/filter state
  const filteredRides = ridesRaw.filter(ride => {
    const fromValue = (ride as any).from || (ride as any).fromCity || "";
    const toValue = (ride as any).to || (ride as any).toCity || "";
    const departureValue = (ride as any).departureTime || (ride as any).departureDate;
    const matchesFrom = !searchFrom || fromValue.toLowerCase().includes(searchFrom.toLowerCase());
    const matchesTo = !searchTo || toValue.toLowerCase().includes(searchTo.toLowerCase());
    const matchesDate = !searchDate || (
      new Date(departureValue).toDateString() === searchDate.toDateString()
    );
    return matchesFrom && matchesTo && matchesDate;
  });

  const handleOfferRide = (data: any) => {
    // TODO: Implement API call to offer ride
    setOfferDialogOpen(false);
    toast({ title: "Ride Offered!", description: "Your ride has been posted." });
  };

  // Placeholder autocomplete handler
  const handleLocationAutocomplete = (value: string, setter: (v: string) => void) => {
    setter(value); // In real app, integrate Google Places or similar
  };

  // Placeholder fare suggestion logic
  const handleAutoSuggestFare = () => {
    // In real app, calculate based on distance
    setFare(25); // static for now
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5fa]">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 mb-6 px-4 pt-6 max-w-6xl mx-auto">
        <div className="w-full flex justify-start mt-2 mb-4 px-4">
          <BackButton />
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-travel-dark flex items-center gap-2">
              <img src={logo} alt="TwiTrip Logo" className="h-8 w-auto inline-block align-middle" />
              TwiTrip
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-white rounded-lg shadow-sm p-1 gap-1">
              <Button
                variant={view === 'find' ? 'default' : 'ghost'}
                className={cn(
                  'rounded-md px-4 py-2 flex items-center gap-2 text-travel-dark font-medium',
                  view === 'find' ? 'bg-travel-dark text-white' : 'bg-white text-travel-dark hover:bg-gray-100'
                )}
                onClick={() => setView('find')}
              >
                <Eye className="w-4 h-4 mr-1" /> Find Rides
              </Button>
              <Button
                variant={view === 'my' ? 'default' : 'ghost'}
                className={cn(
                  'rounded-md px-4 py-2 flex items-center gap-2 text-travel-dark font-medium',
                  view === 'my' ? 'bg-travel-dark text-white' : 'bg-white text-travel-dark hover:bg-gray-100'
                )}
                onClick={() => setView('my')}
              >
                <Car className="w-4 h-4 mr-1" /> My Rides
              </Button>
            </div>
            <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-travel-dark text-white rounded-md px-6 py-2 ml-2 hover:bg-travel-primary font-semibold text-base">
                  <Plus className="w-4 h-4 mr-2" /> Offer Ride
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Offer a Ride</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setOfferDialogOpen(false);
                    toast({ title: "Ride Offered!", description: "Your ride has been posted." });
                  }}
                  className="space-y-4"
                >
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold mb-1">From</label>
                      <Input
                        placeholder="Enter departure location"
                        value={from}
                        onChange={e => handleLocationAutocomplete(e.target.value, setFrom)}
                        autoComplete="off"
                        className="bg-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold mb-1">To</label>
                      <Input
                        placeholder="Enter destination location"
                        value={to}
                        onChange={e => handleLocationAutocomplete(e.target.value, setTo)}
                        autoComplete="off"
                        className="bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Departure Date & Time</label>
                    <Input
                      type="datetime-local"
                      value={departure}
                      onChange={e => setDeparture(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold mb-1">Max Passengers</label>
                      <Input
                        type="number"
                        min={1}
                        value={seats}
                        onChange={e => setSeats(Number(e.target.value))}
                        className="bg-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold mb-1">Price per Person ($)</label>
                      <Input
                        type="number"
                        min={0}
                        value={fare}
                        onChange={e => setFare(Number(e.target.value))}
                        className="bg-white"
                        onFocus={handleAutoSuggestFare}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Vehicle Information</label>
                    <Input
                      placeholder="Honda Civic, Blue, License: ABC-123"
                      value={vehicle}
                      onChange={e => setVehicle(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 flex items-center gap-2">
                      <Switch checked={luggage} onCheckedChange={setLuggage} />
                      <span className="text-sm">Luggage Allowed</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <Switch checked={petFriendly} onCheckedChange={setPetFriendly} />
                      <span className="text-sm">Pet Friendly</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 flex items-center gap-2">
                      <Switch checked={womenOnly} onCheckedChange={setWomenOnly} />
                      <span className="text-sm">Women Only</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <Switch checked={music} onCheckedChange={setMusic} />
                      <span className="text-sm">Music</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <Switch checked={chat} onCheckedChange={setChat} />
                      <span className="text-sm">Chat</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Intermediate Stops / Pickup Points</label>
                    <Input
                      placeholder="Add stops or pickup points (optional)"
                      value={stops}
                      onChange={e => setStops(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Additional Notes</label>
                    <Textarea
                      placeholder="Any additional information about the trip, meeting point, etc."
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-travel-dark text-white hover:bg-travel-primary">Offer Ride</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Search Filters Row */}
        <div className="flex flex-row gap-4 w-full">
          <Input placeholder="From location..." className="flex-1" value={searchFrom} onChange={e => setSearchFrom(e.target.value)} />
          <Input placeholder="To location..." className="flex-1" value={searchTo} onChange={e => setSearchTo(e.target.value)} />
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex-1 flex items-center bg-white rounded-lg px-3 py-2 border border-gray-200 shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-travel-mint"
              >
                <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                <span className={searchDate ? "text-travel-dark" : "text-gray-400"}>
                  {searchDate ? format(searchDate, "PPP") : "Date"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={searchDate}
                onSelect={setSearchDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Rides List */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="space-y-4">
          {view === 'find' && (
            <div className="flex flex-col gap-6 mt-8">
              {filteredRides.map((ride) => (
                <div key={ride.id} className="relative">
                  <RideCard 
                    ride={ride} 
                    // onRequestJoin={handleRequestJoin} // Implement real join logic if needed
                    // isLoading={requestingRideId === ride.id && requestJoinMutation.isPending}
                  />
                </div>
              ))}
            </div>
          )}
          {view === 'my' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {myRides.map((ride) => (
                <div key={ride.id} className="relative">
                  <RideCard 
                    ride={ride} 
                    // onRequestJoin={handleRequestJoin} // Implement real join logic if needed
                    // isLoading={requestingRideId === ride.id && requestJoinMutation.isPending}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
