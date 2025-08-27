import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useBookings } from "@/lib/booking";
import { useAuth } from "@/lib/auth";
import { Calendar, Users, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface BookingDashboardProps {
  type: 'user' | 'owner';
}

export default function BookingDashboard({ type }: BookingDashboardProps) {
  const { user } = useAuth();
  const { 
    getUserBookings, 
    getOwnerBookings, 
    updateBookingStatus, 
    cancelBooking,
    subscribeToUserBookings,
    subscribeToOwnerBookings 
  } = useBookings();
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadBookings = async () => {
      if (!user) return;
      
      try {
        const data = type === 'user' 
          ? await getUserBookings()
          : await getOwnerBookings();
        setBookings(data);
      } catch (error) {
        console.error('Failed to load bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();

    // Subscribe to real-time updates
    const unsubscribe = type === 'user'
      ? subscribeToUserBookings((data) => setBookings(data))
      : subscribeToOwnerBookings((data) => setBookings(data));

    return unsubscribe;
  }, [user, type]);

  const handleUpdateStatus = async () => {
    if (!selectedBooking || !newStatus) return;
    
    setUpdating(true);
    try {
      await updateBookingStatus(selectedBooking.id, newStatus as any, statusMessage);
      setStatusDialogOpen(false);
      setSelectedBooking(null);
      setNewStatus('');
      setStatusMessage('');
    } catch (error) {
      console.error('Failed to update booking status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
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
        <div className="text-lg">Loading bookings...</div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-lg text-gray-600 mb-4">
          {type === 'user' ? 'You have no bookings yet.' : 'No booking requests yet.'}
        </div>
        <div className="text-sm text-gray-500">
          {type === 'user' 
            ? 'Start exploring properties and make your first booking!'
            : 'When users book your services, they will appear here.'
          }
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-travel-dark">
          {type === 'user' ? 'My Bookings' : 'Booking Requests'}
        </h2>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-travel-mint/10 rounded-lg">
                    {booking.serviceType === 'stay' && <Calendar className="w-5 h-5 text-travel-dark" />}
                    {booking.serviceType === 'ride' && <Users className="w-5 h-5 text-travel-dark" />}
                    {booking.serviceType === 'tour' && <MapPin className="w-5 h-5 text-travel-dark" />}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{booking.serviceTitle}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {booking.serviceLocation}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </div>
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
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
                  
                  {booking.guests && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Guests:</span>
                      <span>{booking.guests}</span>
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
              
              <div className="flex gap-2">
                {type === 'owner' && booking.status === 'pending' && (
                  <>
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
                  </>
                )}
                
                {type === 'user' && booking.status === 'pending' && (
                  <Button
                    onClick={() => handleCancelBooking(booking.id)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === 'confirmed' ? 'Accept Booking' : 'Reject Booking'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Message (Optional)
              </label>
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
    </div>
  );
}
