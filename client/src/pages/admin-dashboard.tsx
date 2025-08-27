import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
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
  Mail,
  User,
  Shield,
  Activity,
  Bell,
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  CreditCard,
  AlertTriangle,
  Flag,
  FileText,
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  getDocs,
  writeBatch
} from "firebase/firestore";

interface Booking {
  id: string;
  userId: string;
  ownerId: string;
  serviceId: string;
  serviceType: 'property' | 'ride' | 'tour' | 'agency';
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  quantity?: number;
  totalPrice?: number;
  message?: string;
  serviceTitle?: string;
  serviceLocation?: string;
  userName?: string;
  ownerName?: string;
}

interface UserActivity {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details: string;
  userName?: string;
}

interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
  userName?: string;
}

interface Dispute {
  id: string;
  userId: string;
  ownerId: string;
  serviceId: string;
  serviceType: string;
  reason: string;
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
  userName?: string;
  ownerName?: string;
}

interface TourGuide {
  id: string;
  userId: string;
  location: string;
  title: string;
  description: string;
  specialties: string[];
  languages: string[];
  pricePerHour: string;
  pricePerDay: string;
  rating: number;
  totalReviews: number;
  verified: boolean;
  createdAt: string;
  userName?: string;
}

interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
  reporterName?: string;
  reportedUserName?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  roles?: string[];
  createdAt: string;
  lastLoginAt: string;
  status: 'active' | 'suspended' | 'deleted';
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // State for real-time data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [tourGuides, setTourGuides] = useState<TourGuide[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // State for UI
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [message, setMessage] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeBookings: 0,
    totalRevenue: 0,
    pendingDisputes: 0,
    pendingReports: 0,
    totalProperties: 0,
    totalRides: 0,
    totalTours: 0
  });

  // Real-time listeners
  useEffect(() => {
    if (!user) return;
    
    // Check if user is admin
    const isAdmin = user.roles?.includes('admin');
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
      setLocation('/explore');
      return;
    }
    
    // Bookings listener
    const bookingsQuery = query(
      collection(db, 'bookings'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Booking));
      setBookings(bookingsData);
    });
    
    // User activities listener
    const activitiesQuery = query(
      collection(db, 'userActivities'),
      orderBy('timestamp', 'desc')
    );
    
    const unsubscribeActivities = onSnapshot(activitiesQuery, (snapshot) => {
      const activitiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserActivity));
      setUserActivities(activitiesData);
    });
    
    // Payments listener
    const paymentsQuery = query(
      collection(db, 'payments'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribePayments = onSnapshot(paymentsQuery, (snapshot) => {
      const paymentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Payment));
      setPayments(paymentsData);
    });
    
    // Disputes listener
    const disputesQuery = query(
      collection(db, 'disputes'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeDisputes = onSnapshot(disputesQuery, (snapshot) => {
      const disputesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Dispute));
      setDisputes(disputesData);
    });
    
    // Reports listener
    const reportsQuery = query(
      collection(db, 'reports'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeReports = onSnapshot(reportsQuery, (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Report));
      setReports(reportsData);
    });
    
    // Tour guides listener
    const tourGuidesQuery = query(
      collection(db, 'tourGuides'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeTourGuides = onSnapshot(tourGuidesQuery, (snapshot) => {
      const tourGuidesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TourGuide));
      setTourGuides(tourGuidesData);
    });
    
    // Users listener
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
      setUsers(usersData);
    });
    
    // Load initial stats
    loadStats();
    
    setLoading(false);
    
    // Cleanup subscriptions
    return () => {
      unsubscribeBookings();
      unsubscribeActivities();
      unsubscribePayments();
      unsubscribeDisputes();
      unsubscribeReports();
      unsubscribeTourGuides();
      unsubscribeUsers();
    };
  }, [user]);
  
  const loadStats = async () => {
    try {
      // In a real implementation, you would fetch these from your backend
      // For now, we'll use mock data
      setStats({
        totalUsers: users.length || 1242,
        activeBookings: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length || 86,
        totalRevenue: payments.reduce((sum, p) => sum + (p.amount || 0), 0) || 42500,
        pendingDisputes: disputes.filter(d => d.status === 'open').length || 3,
        pendingReports: reports.filter(r => r.status === 'pending').length || 2,
        totalProperties: 156,
        totalRides: 89,
        totalTours: 42
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };
  
  const handleUpdateBookingStatus = async (bookingId: string, status: string, message?: string) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status,
        updatedAt: new Date().toISOString(),
        ...(message && { adminMessage: message })
      });
      
      // Create notification for user
      const batch = writeBatch(db);
      const notificationRef = doc(collection(db, 'notifications'));
      const notification = {
        userId: selectedItem.userId,
        title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: message || `Your booking has been ${status}.`,
        type: 'booking_update',
        relatedId: bookingId,
        read: false,
        createdAt: new Date().toISOString(),
      };
      batch.set(notificationRef, notification);
      await batch.commit();
      
      toast({
        title: "Booking Updated",
        description: `Booking status updated to ${status}.`
      });
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to update booking:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update booking status.",
        variant: "destructive"
      });
    }
  };
  
  const handleResolveDispute = async (disputeId: string, resolution: string) => {
    try {
      const disputeRef = doc(db, 'disputes', disputeId);
      await updateDoc(disputeRef, {
        status: 'resolved',
        resolution,
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: "Dispute Resolved",
        description: "Dispute has been resolved successfully."
      });
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to resolve dispute:', error);
      toast({
        title: "Resolution Failed",
        description: "Failed to resolve dispute.",
        variant: "destructive"
      });
    }
  };
  
  const handleDismissReport = async (reportId: string) => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        status: 'dismissed',
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: "Report Dismissed",
        description: "Report has been dismissed."
      });
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to dismiss report:', error);
      toast({
        title: "Dismissal Failed",
        description: "Failed to dismiss report.",
        variant: "destructive"
      });
    }
  };
  
  const handleVerifyTourGuide = async (guideId: string) => {
    try {
      const guideRef = doc(db, 'tourGuides', guideId);
      await updateDoc(guideRef, {
        verified: true,
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: "Guide Verified",
        description: "Tour guide has been verified."
      });
    } catch (error) {
      console.error('Failed to verify guide:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify tour guide.",
        variant: "destructive"
      });
    }
  };
  
  const handleSuspendUser = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        status: 'suspended',
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: "User Suspended",
        description: "User has been suspended."
      });
    } catch (error) {
      console.error('Failed to suspend user:', error);
      toast({
        title: "Suspension Failed",
        description: "Failed to suspend user.",
        variant: "destructive"
      });
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'open': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'open': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'dismissed': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };
  
  const filteredBookings = bookings.filter(booking => {
    if (filterStatus !== 'all' && booking.status !== filterStatus) return false;
    if (searchTerm && !(
      booking.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
    )) return false;
    return true;
  });
  
  const filteredUsers = users.filter(user => {
    if (searchTerm && !(
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )) return false;
    return true;
  });
  
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
              <Shield className="w-6 h-6 text-travel-navy" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-travel-navy">Admin Dashboard</h1>
              <p className="text-travel-navy/70">Monitor and manage the TwiTrip platform</p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-primary text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-travel-navy">{stats.totalUsers}</p>
                </div>
                <div className="p-3 bg-travel-mint/10 rounded-xl">
                  <User className="w-6 h-6 text-travel-mint" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Bookings</p>
                  <p className="text-2xl font-bold text-travel-navy">{stats.activeBookings}</p>
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
                    ₹{stats.totalRevenue.toLocaleString()}
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
                  <p className="text-sm text-gray-600">Pending Disputes</p>
                  <p className="text-2xl font-bold text-travel-navy">{stats.pendingDisputes}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Reports</p>
                  <p className="text-2xl font-bold text-travel-navy">{stats.pendingReports}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <Flag className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search bookings, users, services..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
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
                    {bookings.slice(0, 5).map((booking) => (
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
                    {bookings.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No bookings yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* User Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{activity.userName || 'Unknown User'}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(activity.timestamp), 'HH:mm')}
                        </span>
                      </div>
                    ))}
                    {userActivities.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Service Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Properties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-travel-navy">{stats.totalProperties}</p>
                  <p className="text-sm text-gray-600">Active listings</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Rides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-travel-navy">{stats.totalRides}</p>
                  <p className="text-sm text-gray-600">Active rides</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Compass className="w-5 h-5" />
                    Tours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-travel-navy">{stats.totalTours}</p>
                  <p className="text-sm text-gray-600">Active tours</p>
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
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{booking.serviceTitle}</h3>
                          <p className="text-sm text-gray-600">
                            User: {booking.userName} | Owner: {booking.ownerName}
                          </p>
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
                              setSelectedItem(booking);
                              setDialogType('booking');
                              setDialogOpen(true);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Update Status
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {filteredBookings.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No bookings found</p>
                      <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Joined: {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex gap-2">
                          {user.status === 'active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSuspendUser(user.id)}
                              className="text-red-600 border-red-300"
                            >
                              Suspend
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No users found</p>
                      <p className="text-sm text-gray-400 mt-2">Try adjusting your search criteria</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Disputes Tab */}
          <TabsContent value="disputes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Disputes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {disputes.filter(d => filterStatus === 'all' || d.status === filterStatus).map((dispute) => (
                    <div key={dispute.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">Dispute #{dispute.id.substring(0, 8)}</h3>
                          <p className="text-sm text-gray-600">
                            User: {dispute.userName} | Owner: {dispute.ownerName}
                          </p>
                        </div>
                        <Badge className={getStatusColor(dispute.status)}>
                          {dispute.status}
                        </Badge>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm">
                          <span className="font-medium">Reason:</span> {dispute.reason}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Created: {format(new Date(dispute.createdAt), 'MMM dd, yyyy')}
                        </div>
                        {dispute.status === 'open' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedItem(dispute);
                              setDialogType('dispute');
                              setDialogOpen(true);
                            }}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {disputes.filter(d => filterStatus === 'all' || d.status === filterStatus).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No disputes found</p>
                      <p className="text-sm text-gray-400 mt-2">All disputes have been resolved</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.filter(r => filterStatus === 'all' || r.status === filterStatus).map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">Report #{report.id.substring(0, 8)}</h3>
                          <p className="text-sm text-gray-600">
                            Reporter: {report.reporterName} | Reported: {report.reportedUserName}
                          </p>
                        </div>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm">
                          <span className="font-medium">Reason:</span> {report.reason}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Created: {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                        </div>
                        {report.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDismissReport(report.id)}
                            >
                              Dismiss
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedItem(report);
                                setDialogType('report');
                                setDialogOpen(true);
                              }}
                            >
                              Take Action
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {reports.filter(r => filterStatus === 'all' || r.status === filterStatus).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No reports found</p>
                      <p className="text-sm text-gray-400 mt-2">All reports have been resolved</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Status Update Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'booking' && 'Update Booking Status'}
              {dialogType === 'dispute' && 'Resolve Dispute'}
              {dialogType === 'report' && 'Take Action on Report'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-2">
                {dialogType === 'booking' && 'Status Message (Optional)'}
                {dialogType === 'dispute' && 'Resolution Details'}
                {dialogType === 'report' && 'Action Details'}
              </Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  dialogType === 'booking' 
                    ? "Add a message for the user..."
                    : dialogType === 'dispute'
                    ? "Describe how this dispute was resolved..."
                    : "Describe the action taken..."
                }
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (dialogType === 'booking' && selectedItem) {
                  handleUpdateBookingStatus(selectedItem.id, 'confirmed', message);
                } else if (dialogType === 'dispute' && selectedItem) {
                  handleResolveDispute(selectedItem.id, message);
                } else if (dialogType === 'report' && selectedItem) {
                  // For reports, we'll just dismiss them for now
                  handleDismissReport(selectedItem.id);
                }
                setMessage('');
              }}
              className="bg-gradient-primary text-white"
            >
              {dialogType === 'booking' && 'Update Status'}
              {dialogType === 'dispute' && 'Resolve Dispute'}
              {dialogType === 'report' && 'Dismiss Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}