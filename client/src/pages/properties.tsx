import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Filter, Map, Star, MapPin, Calendar, Users, CreditCard } from "lucide-react";
import PropertyCard from "@/components/property-card";
import type { Property, User } from "@shared/schema";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DialogDescription } from "@/components/ui/dialog";
import { BackButton } from "@/components/back-button";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useBookings } from "@/lib/booking";
import { Label } from "@/components/ui/label";

export default function PropertiesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [view, setView] = useState<'browse' | 'my'>('browse');
  const [search, setSearch] = useState("");
  const [listDialogOpen, setListDialogOpen] = useState(false);
  // Host Identity
  const [hostName, setHostName] = useState("");
  const [hostMobile, setHostMobile] = useState("");
  const [hostMobileVerified, setHostMobileVerified] = useState(false);
  const [hostCity, setHostCity] = useState("");
  // Type of Listing
  const [listingType, setListingType] = useState("free");
  const [rentalPrice, setRentalPrice] = useState("");
  const [openToDiscuss, setOpenToDiscuss] = useState(false);
  const [guestContributions, setGuestContributions] = useState<string[]>([]);
  const [customContribution, setCustomContribution] = useState("");
  // Property Info
  const [propertyType, setPropertyType] = useState("Private Room");
  const [maxGuests, setMaxGuests] = useState(1);
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  // Amenities
  const [amenities, setAmenities] = useState<string[]>([]);
  // Photos
  const [photos, setPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Hosting Preferences
  const [localId, setLocalId] = useState(false);
  const [femaleOnly, setFemaleOnly] = useState(false);
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [noSmoking, setNoSmoking] = useState(false);
  // Trust & Consent
  const [agreeGuidelines, setAgreeGuidelines] = useState(false);
  const [askVerify, setAskVerify] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState([0, 5000]);
  const [pendingStayRequests, setPendingStayRequests] = useState<any[]>([]);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestingProperty, setRequestingProperty] = useState<any>(null);
  const [requestNote, setRequestNote] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);
  
  // Booking state
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingProperty, setBookingProperty] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    message: "",
  });
  const [creatingBooking, setCreatingBooking] = useState(false);
  
  const { user } = useAuth();
  const { createBooking } = useBookings();
  const [location, setLocation] = useLocation();

  const { data: propertiesRaw = [], isLoading } = useQuery<(Property & { host: User })[]>({
    queryKey: ["/api/properties"],
  });

  const properties = propertiesRaw.length > 0 ? propertiesRaw : [];

  const showInterestMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      const response = await apiRequest("POST", `/api/properties/${propertyId}/interest`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Interest Sent!",
        description: "The host will be notified of your interest.",
      });
    },
  });

  const handleShowInterest = (propertyId: number) => {
    const property = properties.find(p => p.id === propertyId);
    setRequestingProperty(property);
    setRequestDialogOpen(true);
    setRequestNote("");
  };

  const handleBookStay = (property: any) => {
    setBookingProperty(property);
    setBookingDialogOpen(true);
    setBookingData({
      checkIn: "",
      checkOut: "",
      guests: 1,
      message: "",
    });
  };

  const handleCreateBooking = async () => {
    if (!bookingProperty || !user) return;
    
    setCreatingBooking(true);
    try {
      const nights = Math.ceil(
        (new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      const totalPrice = nights * (bookingProperty.pricePerNight || 0);
      
      await createBooking({
        userId: user.id,
        ownerId: bookingProperty.hostId || bookingProperty.host.id,
        serviceId: bookingProperty.id.toString(),
        serviceType: 'stay',
        status: 'pending',
        serviceTitle: bookingProperty.title,
        serviceLocation: bookingProperty.city,
        startDate: bookingData.checkIn,
        endDate: bookingData.checkOut,
        quantity: bookingData.guests,
        totalPrice,
        message: bookingData.message,
      });
      
      toast({
        title: "Booking Request Sent!",
        description: "The host will review your request and get back to you soon.",
      });
      
      setBookingDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking request",
        variant: "destructive",
      });
    } finally {
      setCreatingBooking(false);
    }
  };

  const handleSendRequest = () => {
    if (!requestingProperty || !requestNote.trim()) return;
    setSendingRequest(true);
    if (requestingProperty.host && requestingProperty.host.id) {
      const messagesKey = `demo-messages-user-${requestingProperty.host.id}`;
      const prev = JSON.parse(localStorage.getItem(messagesKey) || "[]");
      const newMessage = {
        id: Date.now(),
        senderId: user?.id || "demo-user",
        receiverId: requestingProperty.host.id,
        content: requestNote,
        timestamp: new Date().toISOString(),
        read: false,
      };
      localStorage.setItem(messagesKey, JSON.stringify([...prev, newMessage]));
      setPendingStayRequests(prev => [...prev, {
        id: Date.now(),
        property: requestingProperty,
        message: requestNote,
        status: "pending"
      }]);
      toast({
        title: "Request Sent!",
        description: "Your stay request has been sent to the host.",
      });
    }
    setRequestDialogOpen(false);
    setSendingRequest(false);
  };

  const handleAcceptStayRequest = (requestId: number) => {
    setPendingStayRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status: "accepted" } : req)
    );
    toast({
      title: "Request Accepted!",
      description: "The stay request has been accepted.",
    });
  };

  const handleDeclineStayRequest = (requestId: number) => {
    setPendingStayRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status: "declined" } : req)
    );
    toast({
      title: "Request Declined",
      description: "The stay request has been declined.",
    });
  };

  const toggleInArray = (arr: string[], value: string) => arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];

  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    const location = property.city?.toLowerCase?.() || "";
    const title = property.title?.toLowerCase?.() || "";
    const price = Number(property.pricePerNight) || 0;
    const matchesSearch = !search || location.includes(search.toLowerCase()) || title.includes(search.toLowerCase());
    const matchesPrice = price >= filterPrice[0] && price <= filterPrice[1];
    return matchesSearch && matchesPrice;
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-48 bg-gray-200 rounded-2xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f5f5fa] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Top Bar */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4">
            <BackButton />
            <h2 className="text-2xl font-bold text-travel-dark">Homestays</h2>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex bg-white rounded-lg shadow-sm p-1 gap-1">
                <Button
                  variant={view === 'browse' ? 'default' : 'ghost'}
                  className={cn(
                    'rounded-md px-4 py-2 flex items-center gap-2 text-travel-dark font-medium',
                    view === 'browse' ? 'bg-travel-dark text-white' : 'bg-white text-travel-dark hover:bg-gray-100'
                  )}
                  onClick={() => setView('browse')}
                >
                  <span className="mr-1">👁️</span> Browse
                </Button>
                <Button
                  variant={view === 'my' ? 'default' : 'ghost'}
                  className={cn(
                    'rounded-md px-4 py-2 flex items-center gap-2 text-travel-dark font-medium',
                    view === 'my' ? 'bg-travel-dark text-white' : 'bg-white text-travel-dark hover:bg-gray-100'
                  )}
                  onClick={() => setView('my')}
                >
                  <span className="mr-1">🏠</span> My Properties
                </Button>
              </div>
              <Dialog open={listDialogOpen} onOpenChange={setListDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-travel-dark text-white rounded-md px-6 py-2 ml-2 hover:bg-travel-primary font-semibold text-base">
                    + List Property
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl p-0">
                  <div className="w-full flex flex-col">
                    <form className="space-y-8 max-h-[70vh] overflow-y-auto px-6 pb-6 pt-2"
                      onSubmit={e => { e.preventDefault(); setListDialogOpen(false); toast({ title: "Property Listed!", description: "Your property has been submitted." }); }}>
                      {/* Host Identity */}
                      <div className="rounded-2xl bg-travel-mint/10 p-6 mb-2 shadow-sm">
                        <h3 className="text-lg font-bold text-travel-navy mb-4">Host Identity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block font-semibold mb-2">Name</label>
                            <Input value={hostName} onChange={e => setHostName(e.target.value)} placeholder="Your name" required className="h-12 text-base" />
                          </div>
                          <div>
                            <label className="block font-semibold mb-2">Mobile (OTP Verified)</label>
                            <div className="flex gap-2">
                              <Input value={hostMobile} onChange={e => setHostMobile(e.target.value)} placeholder="Mobile number" required className="h-12 text-base" />
                              <Button type="button" size="sm" className="bg-travel-mint text-white h-12 px-4" disabled={hostMobileVerified}>{hostMobileVerified ? "Verified" : "Send OTP"}</Button>
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block font-semibold mb-2">City / Town / State</label>
                            <Input value={hostCity} onChange={e => setHostCity(e.target.value)} placeholder="City, Town, State" required className="h-12 text-base" />
                          </div>
                        </div>
                      </div>
                      {/* Details / About Your Hosting */}
                      <div className="rounded-2xl bg-travel-lavender/10 p-6 mb-2 shadow-sm">
                        <h3 className="text-lg font-bold text-travel-navy mb-4">Details / About Your Hosting</h3>
                        <Textarea
                          placeholder="Share your story, what makes your place special, your hosting style, or anything guests should know. (e.g. 'I love meeting new people and sharing local food experiences!')"
                          className="bg-white h-24 text-base"
                          rows={3}
                        />
                      </div>
                      {/* Type of Listing */}
                      <div className="rounded-2xl bg-travel-mint/10 p-6 mb-2 shadow-sm">
                        <h3 className="text-lg font-bold text-travel-navy mb-4">Type of Listing</h3>
                        <div className="flex flex-wrap gap-6 mb-4">
                          <label className="flex items-center gap-2 cursor-pointer text-base">
                            <input type="radio" name="listingType" value="free" checked={listingType === "free"} onChange={() => setListingType("free")}/>
                            Free Stay
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-base">
                            <input type="radio" name="listingType" value="paid" checked={listingType === "paid"} onChange={() => setListingType("paid")}/>
                            Paid Stay
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-base">
                            <input type="radio" name="listingType" value="open" checked={listingType === "open"} onChange={() => setListingType("open")}/>
                            Open to Discuss
                          </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block font-semibold mb-2">Rental Price per Night ($)</label>
                            <Input value={rentalPrice} onChange={e => setRentalPrice(e.target.value)} placeholder="e.g. 50" type="number" min={0} disabled={listingType === "free"} className={`h-12 text-base ${listingType === "free" ? "bg-gray-100" : ""}`}/>
                          </div>
                          {listingType === "free" && (
                            <div>
                              <label className="block font-semibold mb-1">Optional Ask from Guest (Contribute Instead)</label>
                              <div className="mb-2 text-travel-navy/70 text-sm">Pick up to 5 ways guests can contribute instead of payment.</div>
                              <div className="mb-4">
                                <div className="font-semibold text-travel-navy mb-2">Ways to Contribute</div>
                                <div className="flex flex-wrap gap-3">
                                  {["Help with daily chores","Cook one meal together","Share travel stories or local culture","Teach something (language, art, etc.)","Just come with good vibes"].map(opt => (
                                    <button
                                      key={opt}
                                      type="button"
                                      disabled={guestContributions.length >= 5 && !guestContributions.includes(opt)}
                                      className={`px-5 py-2 rounded-full border font-medium text-base transition-all duration-200 focus:outline-none min-w-[120px] flex items-center justify-center shadow-sm
                                        ${guestContributions.includes(opt)
                                          ? 'bg-gradient-primary text-white border-travel-mint scale-105'
                                          : 'bg-white text-travel-navy border-travel-mint/30 hover:bg-travel-mint/10'}
                                        ${guestContributions.length >= 5 && !guestContributions.includes(opt) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                      onClick={() => setGuestContributions(toggleInArray(guestContributions, opt))}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      className={`px-5 py-2 rounded-full border font-medium text-base transition-all duration-200 focus:outline-none min-w-[120px] flex items-center justify-center shadow-sm
                                        ${customContribution
                                          ? 'bg-gradient-primary text-white border-travel-mint scale-105'
                                          : 'bg-white text-travel-navy border-travel-mint/30 hover:bg-travel-mint/10'}`}
                                      onClick={() => setCustomContribution(customContribution ? '' : ' ')}
                                    >
                                      Custom
                                    </button>
                                    {customContribution && (
                                      <Input
                                        value={customContribution}
                                        onChange={e => setCustomContribution(e.target.value)}
                                        placeholder="Your own idea"
                                        className="ml-2 w-40 h-12 text-base"
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="mt-3 text-right text-travel-navy/70 text-sm font-medium">{guestContributions.length + (customContribution ? 1 : 0)}/5 selected</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Property Info */}
                      <div className="rounded-2xl bg-travel-lavender/10 p-6 mb-2 shadow-sm">
                        <h3 className="text-lg font-bold text-travel-navy mb-4">Property Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block font-semibold mb-2">Type</label>
                            <select value={propertyType} onChange={e => setPropertyType(e.target.value)} className="w-full rounded-md border border-gray-300 p-3 h-12 text-base">
                              <option>Private Room</option>
                              <option>Shared Room</option>
                              <option>Couch</option>
                              <option>Floor</option>
                              <option>Tent</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-semibold mb-2">Max Guests</label>
                            <Input type="number" min={1} value={maxGuests} onChange={e => setMaxGuests(Number(e.target.value))} className="h-12 text-base" />
                          </div>
                        </div>
                        <div className="mt-6">
                          <label className="block font-semibold mb-2">Available Dates</label>
                          <div className="flex gap-2">
                            <Input type="date" value={availableFrom} onChange={e => setAvailableFrom(e.target.value)} className="h-12 text-base" />
                            <span className="self-center">to</span>
                            <Input type="date" value={availableTo} onChange={e => setAvailableTo(e.target.value)} className="h-12 text-base" />
                          </div>
                        </div>
                        <div className="mt-6">
                          <label className="block font-semibold mb-2">Location Details</label>
                          <Input value={locationDetails} onChange={e => setLocationDetails(e.target.value)} placeholder="City, Area, Landmark (optional)" className="h-12 text-base" />
                        </div>
                      </div>
                      {/* Amenities */}
                      <div className="rounded-2xl bg-travel-mint/10 p-6 mb-2 shadow-sm">
                        <h3 className="text-lg font-bold text-travel-navy mb-4">Amenities (Optional)</h3>
                        <div className="flex flex-wrap gap-3">
                          {["WiFi","Shared Bathroom","Meals Provided","Pickup Support","Pet Friendly"].map(opt => (
                            <button
                              key={opt}
                              type="button"
                              className={`px-5 py-2 rounded-full border font-medium text-base transition-all duration-200 focus:outline-none min-w-[120px] flex items-center justify-center shadow-sm
                                ${amenities.includes(opt)
                                  ? 'bg-gradient-primary text-white border-travel-mint scale-105'
                                  : 'bg-white text-travel-navy border-travel-mint/30 hover:bg-travel-mint/10'}`}
                              onClick={() => setAmenities(toggleInArray(amenities, opt))}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Photos Upload */}
                      <div className="rounded-2xl bg-travel-lavender/10 p-6 mb-2 shadow-sm">
                        <h3 className="text-lg font-bold text-travel-navy mb-4">Photos (up to 4)</h3>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={e => {
                            const files = Array.from(e.target.files || []);
                            if (files.length + photos.length > 4) {
                              setPhotos([...photos, ...files.slice(0, 4 - photos.length)]);
                            } else {
                              setPhotos([...photos, ...files].slice(0, 4));
                            }
                            // Reset input value to allow re-uploading the same file if removed
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="block w-full"
                          disabled={photos.length >= 4}
                        />
                        <div className="flex gap-2 mt-2">
                          {photos.map((file, idx) => (
                            <div key={idx} className="relative">
                              <img src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-cover rounded-lg border" />
                              <button
                                type="button"
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                                onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        {photos.length >= 4 && (
                          <div className="text-sm text-red-500 mt-2">You can upload up to 4 photos only.</div>
                        )}
                      </div>
                      {/* Hosting Preferences */}
                      <div className="rounded-2xl bg-travel-mint/10 p-6 mb-2 shadow-sm">
                        <h3 className="text-lg font-bold text-travel-navy mb-4">Hosting Preferences</h3>
                        <div className="flex flex-wrap gap-3">
                          {[{label: 'Local ID Required', value: 'localId'}, {label: 'Female Travelers Only', value: 'femaleOnly'}, {label: 'Vegetarian Only', value: 'vegetarianOnly'}, {label: 'No Smoking / Drinking', value: 'noSmoking'}].map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              className={`px-5 py-2 rounded-full border font-medium text-base transition-all duration-200 focus:outline-none min-w-[160px] flex items-center justify-center shadow-sm
                                ${(opt.value === 'localId' && localId) || (opt.value === 'femaleOnly' && femaleOnly) || (opt.value === 'vegetarianOnly' && vegetarianOnly) || (opt.value === 'noSmoking' && noSmoking)
                                  ? 'bg-gradient-primary text-white border-travel-mint scale-105'
                                  : 'bg-white text-travel-navy border-travel-mint/30 hover:bg-travel-mint/10'}`}
                              onClick={() => {
                                if (opt.value === 'localId') setLocalId(v => !v);
                                if (opt.value === 'femaleOnly') setFemaleOnly(v => !v);
                                if (opt.value === 'vegetarianOnly') setVegetarianOnly(v => !v);
                                if (opt.value === 'noSmoking') setNoSmoking(v => !v);
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Trust & Consent */}
                      <div className="rounded-2xl bg-travel-lavender/10 p-6 mb-2 shadow-sm">
                        <h3 className="text-lg font-bold text-travel-navy mb-4">Trust & Consent</h3>
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 cursor-pointer text-base">
                            <input type="checkbox" checked={agreeGuidelines} onChange={() => setAgreeGuidelines(v => !v)} required />
                            I agree to TravelSwipe's trust guidelines
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-base">
                            <input type="checkbox" checked={askVerify} onChange={() => setAskVerify(v => !v)} />
                            I'll ask guests to verify identity before stay
                          </label>
                        </div>
                      </div>
                      <DialogFooter className="mt-4 flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className="bg-travel-dark text-white hover:bg-travel-primary">List Property</Button>
                      </DialogFooter>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {/* Search Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
              <span className="text-gray-400 mr-2">🔍</span>
              <Input
                className="border-none shadow-none focus:ring-0 focus-visible:ring-0 text-base bg-transparent"
                placeholder="Search by location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 rounded-lg px-4 py-2 bg-white border border-gray-200 shadow-sm text-travel-dark font-medium" onClick={() => setFilterDialogOpen(true)}>
              <span className="text-lg">⏳</span> Filters
            </Button>
            <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Filter Properties</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-2">Property Type</label>
                    <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full rounded-md border border-gray-300 p-3 h-12 text-base">
                      <option value="">All</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Homestay">Homestay</option>
                      <option value="Private Room">Private Room</option>
                      <option value="Shared Room">Shared Room</option>
                      <option value="Couch">Couch</option>
                      <option value="Floor">Floor</option>
                      <option value="Tent">Tent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Price Range (₹)</label>
                    <Slider min={0} max={5000} step={100} value={filterPrice} onValueChange={setFilterPrice} />
                    <div className="flex justify-between text-sm mt-2">
                      <span>₹{filterPrice[0]}</span>
                      <span>₹{filterPrice[1]}</span>
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => { setFilterType(""); setFilterPrice([0, 5000]); setFilterDialogOpen(false); }}>Clear</Button>
                  <Button type="button" className="bg-travel-dark text-white" onClick={() => setFilterDialogOpen(false)}>Apply</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Property Cards Section (existing) */}
        {view === 'my' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {properties.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard 
                  property={property} 
                  onShowInterest={() => {}} 
                  isLoading={false}
                  messageHost={() => property.host && setLocation(`/messages?userId=${property.host.id}`)}
                />
                {/* Pending Stay Requests */}
                <div className="mt-4 bg-white rounded-xl shadow p-4 border border-travel-mint/20">
                  <h4 className="font-semibold text-travel-navy mb-2 text-base">Pending Stay Requests</h4>
                  {pendingStayRequests.filter(r => r.propertyId === property.id).length === 0 ? (
                    <div className="text-travel-navy/60 text-sm">No pending requests</div>
                  ) : (
                    pendingStayRequests.filter(r => r.propertyId === property.id).map(req => (
                      <div key={req.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <span className="font-medium text-travel-navy">{req.name}</span>
                          <span className="ml-2 text-travel-navy/70 text-xs">{req.message}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-travel-mint text-white" onClick={() => handleAcceptStayRequest(req.id)}>Accept</Button>
                          <Button size="sm" variant="outline" className="border-travel-lavender text-travel-navy" onClick={() => handleDeclineStayRequest(req.id)}>Decline</Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {view === 'browse' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredProperties.map((property) => {
              // Only render PropertyCard if required fields exist
              if (!(property as any).title || !((property as any).location || (property as any).city)) return null;
              return (
                <div key={property.id} className="relative">
                  <PropertyCard 
                    property={property as any} 
                    onShowInterest={handleShowInterest} 
                    onBookStay={handleBookStay}
                    isLoading={sendingRequest}
                    messageHost={() => property.host && setLocation(`/messages?userId=${property.host.id}`)}
                  />
                </div>
              );
            })}
          </div>
        )}
        <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request to Join Stay</DialogTitle>
            </DialogHeader>
            <Textarea
              className="w-full min-h-[80px] border rounded-md p-2 mt-2"
              placeholder="Write a note to the host..."
              value={requestNote}
              onChange={e => setRequestNote(e.target.value)}
              disabled={sendingRequest}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSendRequest} disabled={sendingRequest || !requestNote.trim()} className="bg-travel-mint text-white">
                {sendingRequest ? "Sending..." : "Send Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="max-w-2xl p-0">
            <DialogHeader>
              <DialogTitle>Book Stay at {bookingProperty?.title}</DialogTitle>
            </DialogHeader>
            <div className="w-full flex flex-col px-6 pb-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="checkIn" className="block font-semibold mb-2">Check-in Date</Label>
                  <Input type="date" value={bookingData.checkIn} onChange={e => setBookingData(prev => ({ ...prev, checkIn: e.target.value }))} className="h-12 text-base" />
                </div>
                <div>
                  <Label htmlFor="checkOut" className="block font-semibold mb-2">Check-out Date</Label>
                  <Input type="date" value={bookingData.checkOut} onChange={e => setBookingData(prev => ({ ...prev, checkOut: e.target.value }))} className="h-12 text-base" />
                </div>
                <div>
                  <Label htmlFor="guests" className="block font-semibold mb-2">Number of Guests</Label>
                  <Input type="number" min={1} value={bookingData.guests} onChange={e => setBookingData(prev => ({ ...prev, guests: Number(e.target.value) }))} className="h-12 text-base" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="message" className="block font-semibold mb-2">Message to Host (Optional)</Label>
                  <Textarea
                    value={bookingData.message}
                    onChange={e => setBookingData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="e.g., 'Looking for a comfortable stay for 2 nights. I'm a solo traveler."
                    className="h-24 text-base"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateBooking} disabled={creatingBooking || !bookingData.checkIn || !bookingData.checkOut || !bookingData.guests} className="bg-travel-dark text-white">
                  {creatingBooking ? "Sending..." : "Send Booking Request"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
