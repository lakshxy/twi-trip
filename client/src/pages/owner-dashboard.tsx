import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useBookings } from "@/lib/booking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Home,
  Car,
  Compass,
  Building,
  DollarSign,
  TrendingUp,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  MessageSquare,
  Phone,
  Mail
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface OwnerDashboardProps {
  type: 'property' | 'ride' | 'tour' | 'agency';
}

export default function OwnerDashboard({ type }: OwnerDashboardProps) {
  const { user } = useAuth();
  const { getOwnerBookings, updateBookingStatus } = useBookings();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [editListingDialogOpen, setEditListingDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState('');
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeBookings, setRealTimeBookings] = useState<any[]>([]);

  // Real-time booking updates
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        const bookingsData = await getOwnerBookings();
        setBookings(bookingsData);
        setRealTimeBookings(bookingsData);
        
        // Mock listings data based on type
        const mockListings = getMockListings(type);
        setListings(mockListings);
      } catch (error) {
      // Error handled by toast notification
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Simulate real-time booking updates
    const interval = setInterval(() => {
      setRealTimeBookings(prev => {
        const newBookings = [...prev];
        // Simulate new booking every 30 seconds
        if (Math.random() > 0.7) {
          const newBooking = {
            id: `booking-${Date.now()}`,
            serviceTitle: getRandomServiceTitle(type),
            serviceLocation: getRandomLocation(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            startDate: new Date(Date.now() + 86400000).toISOString(),
            endDate: new Date(Date.now() + 172800000).toISOString(),
            quantity: Math.floor(Math.random() * 4) + 1,
            totalPrice: Math.floor(Math.random() * 5000) + 1000,
            message: 'New booking request received!'
          };
          newBookings.unshift(newBooking);
          toast({
            title: "New Booking!",
            description: `You have a new ${type} booking request`,
          });
        }
        return newBookings;
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user, type]);

  const getRandomServiceTitle = (dashboardType: string) => {
    const titles = {
      property: ['Cozy Mountain Cabin', 'Beachside Villa', 'City Apartment', 'Luxury Penthouse'],
      ride: ['Delhi to Jaipur', 'Mumbai to Pune', 'Bangalore to Chennai', 'Hyderabad to Goa'],
      tour: ['Golden Triangle Tour', 'Himalayan Adventure', 'Beach Paradise', 'Cultural Heritage'],
      agency: ['Himalayan Adventure Package', 'South India Discovery', 'North India Explorer', 'Coastal Journey']
    };
    const typeTitles = titles[dashboardType as keyof typeof titles] || [];
    return typeTitles[Math.floor(Math.random() * typeTitles.length)];
  };

  const getRandomLocation = () => {
    const locations = ['Mumbai, India', 'Delhi, India', 'Bangalore, India', 'Chennai, India', 'Kolkata, India'];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getMockListings = (dashboardType: string) => {
    switch (dashboardType) {
      case 'property':
        return [
          {
            id: '1',
            title: 'Cozy Mountain Cabin',
            type: 'Private Room',
            location: 'Manali, Himachal Pradesh',
            price: 2500,
            status: 'active',
            bookings: 12,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
            description: 'Beautiful mountain cabin with stunning views',
            amenities: ['WiFi', 'Kitchen', 'Parking', 'Mountain View'],
            maxGuests: 4,
            contactInfo: {
              phone: '+91 98765 43210',
              email: 'cabin@example.com'
            }
          },
          {
            id: '2',
            title: 'Beachside Villa',
            type: 'Entire Home',
            location: 'Goa, India',
            price: 4500,
            status: 'active',
            bookings: 8,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
            description: 'Luxurious beachfront villa with private access',
            amenities: ['Private Beach', 'Pool', 'WiFi', 'Kitchen'],
            maxGuests: 6,
            contactInfo: {
              phone: '+91 98765 43211',
              email: 'villa@example.com'
            }
          }
        ];
      case 'ride':
        return [
          {
            id: '1',
            title: 'Delhi to Jaipur',
            from: 'Delhi',
            to: 'Jaipur',
            date: '2024-01-15',
            time: '08:00 AM',
            seats: 4,
            price: 800,
            status: 'active',
            bookings: 3,
            image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
            description: 'Comfortable ride from Delhi to Jaipur',
            vehicleType: 'SUV',
            contactInfo: {
              phone: '+91 98765 43212',
              email: 'ride@example.com'
            }
          }
        ];
      case 'tour':
        return [
          {
            id: '1',
            title: 'Golden Triangle Tour',
            location: 'Delhi, Agra, Jaipur',
            duration: '3 days',
            price: 15000,
            status: 'active',
            bookings: 5,
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1583395865554-58296a044a3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
            description: 'Explore the famous Golden Triangle of India',
            includes: ['Transport', 'Guide', 'Hotel', 'Meals'],
            maxGroupSize: 8,
            contactInfo: {
              phone: '+91 98765 43213',
              email: 'tour@example.com'
            }
          }
        ];
      case 'agency':
        return [
          {
            id: '1',
            title: 'Himalayan Adventure Package',
            type: 'Group Tour',
            duration: '7 days',
            price: 25000,
            status: 'active',
            bookings: 15,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
            description: 'Adventure package in the Himalayas',
            includes: ['Transport', 'Guide', 'Accommodation', 'Equipment'],
            maxGroupSize: 12,
            contactInfo: {
              phone: '+91 98765 43214',
              email: 'agency@example.com'
            }
          }
        ];
      default:
        return [];
    }
  };

  const getDashboardTitle = () => {
    switch (type) {
      case 'property': return 'Property Management';
      case 'ride': return 'Ride Management';
      case 'tour': return 'Tour Guide Dashboard';
      case 'agency': return 'Travel Agency Dashboard';
      default: return 'Owner Dashboard';
    }
  };

  const getDashboardIcon = () => {
    switch (type) {
      case 'property': return <Home className="w-6 h-6" />;
      case 'ride': return <Car className="w-6 h-6" />;
      case 'tour': return <Compass className="w-6 h-6" />;
      case 'agency': return <Building className="w-6 h-6" />;
      default: return <Settings className="w-6 h-6" />;
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking || !newStatus) return;
    
    setUpdating(true);
    try {
      await updateBookingStatus(selectedBooking.id, newStatus as any, statusMessage);
      setStatusDialogOpen(false);
      setSelectedBooking(null);
      setNewStatus('');
      setStatusMessage('');
      toast({
        title: "Status Updated",
        description: "Booking status has been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to update booking status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update booking status.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleEditListing = (listing: any) => {
    setSelectedListing(listing);
    setEditListingDialogOpen(true);
  };

  const handleUpdateListing = () => {
    if (!selectedListing) return;
    
    // Update listing in state
    setListings(prev => prev.map(listing => 
      listing.id === selectedListing.id ? selectedListing : listing
    ));
    
    setEditListingDialogOpen(false);
    setSelectedListing(null);
    toast({
      title: "Listing Updated",
      description: "Your listing has been updated successfully.",
    });
  };

  const handleToggleListingStatus = (listingId: string) => {
    setListings(prev => prev.map(listing => 
      listing.id === listingId 
        ? { ...listing, status: listing.status === 'active' ? 'inactive' : 'active' }
        : listing
    ));
    toast({
      title: "Status Updated",
      description: "Listing status has been updated.",
    });
  };

  const handleDeleteListing = (listingId: string) => {
    setListings(prev => prev.filter(listing => listing.id !== listingId));
    toast({
      title: "Listing Deleted",
      description: "Your listing has been deleted.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-travel-light via-white to-travel-beige">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-travel-mint/10 rounded-xl">
              {getDashboardIcon()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-travel-navy">{getDashboardTitle()}</h1>
              <p className="text-travel-navy/70">Manage your {type} listings and bookings</p>
            </div>
          </div>
          <Button 
            onClick={() => setLocation(`/create-${type}`)}
            className="bg-gradient-primary text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        </div>

        {/* Real-time Booking Alert */}
        {realTimeBookings.length > bookings.length && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">
                New booking received! Check the Bookings tab for details.
              </span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Listings</p>
                  <p className="text-2xl font-bold text-travel-navy">{listings.length}</p>
                </div>
                <div className="p-3 bg-travel-mint/10 rounded-xl">
                  <Home className="w-6 h-6 text-travel-mint" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Bookings</p>
                  <p className="text-2xl font-bold text-travel-navy">
                    {realTimeBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-travel-navy">
                    ₹{realTimeBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-travel-navy">
                    {listings.length > 0 
                      ? (listings.reduce((sum, l) => sum + (l.rating || 0), 0) / listings.length).toFixed(1)
                      : '0.0'
                    }
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {realTimeBookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{booking.serviceTitle}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                    {realTimeBookings.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No bookings yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Listings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Top Listings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {listings.slice(0, 5).map((listing) => (
                      <div key={listing.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{listing.title}</p>
                          <p className="text-sm text-gray-600">
                            {listing.bookings} bookings • ₹{listing.price?.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm">{listing.rating}</span>
                        </div>
                      </div>
                    ))}
                    {listings.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No listings yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {realTimeBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{booking.serviceTitle}</h3>
                          <p className="text-sm text-gray-600">{booking.serviceLocation}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">Dates:</span>
                            <span>
                              {booking.startDate && format(new Date(booking.startDate), 'MMM dd, yyyy')}
                              {booking.endDate && ` - ${format(new Date(booking.endDate), 'MMM dd, yyyy')}`}
                            </span>
                          </div>
                          
                          {booking.quantity && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">Quantity:</span>
                              <span>{booking.quantity}</span>
                            </div>
                          )}
                          
                          {booking.totalPrice && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">Total:</span>
                              <span className="font-bold text-travel-dark">₹{booking.totalPrice.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">Booked:</span>
                            <span>{format(new Date(booking.createdAt), 'MMM dd, yyyy')}</span>
                          </div>
                          
                          {booking.message && (
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Message:</span>
                              <p className="mt-1">{booking.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setNewStatus('confirmed');
                              setStatusDialogOpen(true);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setNewStatus('rejected');
                              setStatusDialogOpen(true);
                            }}
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {realTimeBookings.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No bookings yet</p>
                      <p className="text-sm text-gray-400 mt-2">When users book your services, they will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={listing.image} 
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {listing.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{listing.location || `${listing.from} to ${listing.to}`}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-travel-dark">₹{listing.price?.toLocaleString()}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm">{listing.rating}</span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mb-3 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{listing.contactInfo?.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>{listing.contactInfo?.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEditListing(listing)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleToggleListingStatus(listing.id)}
                        className={listing.status === 'active' ? 'text-orange-600 border-orange-300' : 'text-green-600 border-green-300'}
                      >
                        {listing.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 border-red-300"
                        onClick={() => handleDeleteListing(listing.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder - Analytics coming soon
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder - Analytics coming soon
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === 'confirmed' ? 'Accept Booking' : 'Reject Booking'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-2">
                Message (Optional)
              </Label>
              <Textarea
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                placeholder={
                  newStatus === 'confirmed' 
                    ? "Add a welcome message for the guest..."
                    : "Provide a reason for rejection..."
                }
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updating}
              className={
                newStatus === 'confirmed' 
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {updating ? 'Updating...' : (newStatus === 'confirmed' ? 'Accept' : 'Reject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Listing Dialog */}
      <Dialog open={editListingDialogOpen} onOpenChange={setEditListingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
          </DialogHeader>
          
          {selectedListing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium mb-2">Title</Label>
                  <Input
                    value={selectedListing.title}
                    onChange={(e) => setSelectedListing({...selectedListing, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-2">Price</Label>
                  <Input
                    type="number"
                    value={selectedListing.price}
                    onChange={(e) => setSelectedListing({...selectedListing, price: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium mb-2">Description</Label>
                <Textarea
                  value={selectedListing.description}
                  onChange={(e) => setSelectedListing({...selectedListing, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium mb-2">Phone</Label>
                  <Input
                    value={selectedListing.contactInfo?.phone}
                    onChange={(e) => setSelectedListing({
                      ...selectedListing, 
                      contactInfo: {...selectedListing.contactInfo, phone: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium mb-2">Email</Label>
                  <Input
                    type="email"
                    value={selectedListing.contactInfo?.email}
                    onChange={(e) => setSelectedListing({
                      ...selectedListing, 
                      contactInfo: {...selectedListing.contactInfo, email: e.target.value}
                    })}
                  />
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium mb-2">Status</Label>
                <Select
                  value={selectedListing.status}
                  onValueChange={(value) => setSelectedListing({...selectedListing, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditListingDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateListing}
              className="bg-gradient-primary text-white"
            >
              Update Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
