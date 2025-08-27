import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  writeBatch,
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./auth";

// Booking status types
export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';

// Booking types
export type BookingType = 'ride' | 'stay' | 'tour' | 'group';

// Base booking interface
export interface Booking {
  id?: string;
  userId: string;
  ownerId: string;
  serviceId: string;
  serviceType: BookingType;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  // Booking details
  startDate?: string;
  endDate?: string;
  quantity?: number;
  totalPrice?: number;
  message?: string;
  // Service details (for quick access)
  serviceTitle?: string;
  serviceLocation?: string;
}

// Service-specific booking interfaces
export interface RideBooking extends Booking {
  serviceType: 'ride';
  fromCity: string;
  toCity: string;
  departureDate: string;
  departureTime: string;
  seats: number;
  pricePerSeat: number;
}

export interface StayBooking extends Booking {
  serviceType: 'stay';
  checkIn: string;
  checkOut: string;
  guests: number;
  pricePerNight: number;
  nights: number;
}

export interface TourBooking extends Booking {
  serviceType: 'tour';
  tourDate: string;
  tourTime: string;
  duration: number;
  pricePerHour: number;
  totalHours: number;
}

export interface GroupBooking extends Booking {
  serviceType: 'group';
  groupSize: number;
  departureDate: string;
  returnDate: string;
  pricePerPerson: number;
}

// Notification interface
export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking_request' | 'booking_update' | 'message' | 'match';
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

// Booking service class
export class BookingService {
  private static instance: BookingService;
  
  static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  // Create a new booking
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const batch = writeBatch(db);
    
    // Add booking
    const bookingRef = doc(collection(db, 'bookings'));
    const booking: Booking = {
      ...bookingData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    batch.set(bookingRef, booking);

    // Create notification for service owner
    const notificationRef = doc(collection(db, 'notifications'));
    const notification: Notification = {
      userId: bookingData.ownerId,
      title: 'New Booking Request',
      message: `You have a new ${bookingData.serviceType} booking request`,
      type: 'booking_request',
      relatedId: bookingRef.id,
      read: false,
      createdAt: new Date().toISOString(),
    };
    batch.set(notificationRef, notification);

    await batch.commit();
    return bookingRef.id;
  }

  // Update booking status
  async updateBookingStatus(bookingId: string, status: BookingStatus, message?: string): Promise<void> {
    const batch = writeBatch(db);
    
    // Update booking
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingDoc = await getDoc(bookingRef);
    if (!bookingDoc.exists()) throw new Error('Booking not found');
    
    const booking = bookingDoc.data() as Booking;
    batch.update(bookingRef, {
      status,
      updatedAt: new Date().toISOString(),
      ...(message && { message })
    });

    // Create notification for user
    const notificationRef = doc(collection(db, 'notifications'));
    const statusMessages = {
      confirmed: 'Your booking has been confirmed!',
      rejected: 'Your booking request was rejected',
      cancelled: 'Your booking has been cancelled',
      completed: 'Your booking has been completed'
    };
    
    const notification: Notification = {
      userId: booking.userId,
      title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: statusMessages[status] || `Your booking status has been updated to ${status}`,
      type: 'booking_update',
      relatedId: bookingId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    batch.set(notificationRef, notification);

    await batch.commit();
  }

  // Get user's bookings
  async getUserBookings(userId: string): Promise<Booking[]> {
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
  }

  // Get owner's bookings (bookings they need to manage)
  async getOwnerBookings(ownerId: string): Promise<Booking[]> {
    const q = query(
      collection(db, 'bookings'),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
  }

  // Get booking by ID
  async getBooking(bookingId: string): Promise<Booking | null> {
    const doc = await getDoc(doc(db, 'bookings', bookingId));
    if (!doc.exists()) return null;
    return { id: doc.id, ...doc.data() } as Booking;
  }

  // Cancel booking
  async cancelBooking(bookingId: string, userId: string): Promise<void> {
    const booking = await this.getBooking(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.userId !== userId) throw new Error('Not authorized');
    
    await this.updateBookingStatus(bookingId, 'cancelled', 'Cancelled by user');
  }

  // Get notifications for user
  async getUserNotifications(userId: string): Promise<Notification[]> {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notification[];
  }

  // Mark notification as read
  async markNotificationRead(notificationId: string): Promise<void> {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true
    });
  }

  // Real-time listeners
  subscribeToUserBookings(userId: string, callback: (bookings: Booking[]) => void) {
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
      callback(bookings);
    });
  }

  subscribeToOwnerBookings(ownerId: string, callback: (bookings: Booking[]) => void) {
    const q = query(
      collection(db, 'bookings'),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
      callback(bookings);
    });
  }

  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notification[];
      callback(notifications);
    });
  }
}

// React hooks for booking functionality
export function useBookings() {
  const { user } = useAuth();
  const bookingService = BookingService.getInstance();

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    return await bookingService.createBooking(bookingData);
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus, message?: string) => {
    if (!user) throw new Error('User not authenticated');
    return await bookingService.updateBookingStatus(bookingId, status, message);
  };

  const cancelBooking = async (bookingId: string) => {
    if (!user) throw new Error('User not authenticated');
    return await bookingService.cancelBooking(bookingId, user.id);
  };

  const getUserBookings = async () => {
    if (!user) return [];
    return await bookingService.getUserBookings(user.id);
  };

  const getOwnerBookings = async () => {
    if (!user) return [];
    return await bookingService.getOwnerBookings(user.id);
  };

  const getNotifications = async () => {
    if (!user) return [];
    return await bookingService.getUserNotifications(user.id);
  };

  const markNotificationRead = async (notificationId: string) => {
    if (!user) throw new Error('User not authenticated');
    return await bookingService.markNotificationRead(notificationId);
  };

  return {
    createBooking,
    updateBookingStatus,
    cancelBooking,
    getUserBookings,
    getOwnerBookings,
    getNotifications,
    markNotificationRead,
    subscribeToUserBookings: (callback: (bookings: Booking[]) => void) => 
      user ? bookingService.subscribeToUserBookings(user.id, callback) : () => {},
    subscribeToOwnerBookings: (callback: (bookings: Booking[]) => void) => 
      user ? bookingService.subscribeToOwnerBookings(user.id, callback) : () => {},
    subscribeToNotifications: (callback: (notifications: Notification[]) => void) => 
      user ? bookingService.subscribeToNotifications(user.id, callback) : () => {},
  };
}
