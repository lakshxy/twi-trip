import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Flag, Star } from "lucide-react";
import { format } from "date-fns";
import type { Ride, User } from "@shared/schema";

interface RideCardProps {
  ride: Ride & { driver: User };
  onRequestJoin?: (rideId: number) => void;
  isLoading?: boolean;
}

export default function RideCard({ ride, onRequestJoin, isLoading }: RideCardProps) {
  const driverImages = [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
  ];

  const driverImage = driverImages[ride.driverId % driverImages.length];
  const departureDate = new Date(ride.departureDate);
  
  return (
    <div className="border border-gray-200 rounded-2xl bg-white mb-6 shadow-sm">
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-4">
            <img 
              src={driverImage}
              alt={ride.driver.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
            <div>
              <div className="font-semibold text-travel-dark text-base leading-tight">{ride.driver.name}</div>
              <div className="flex items-center space-x-2 text-sm mt-0.5">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600 font-medium">4.8 • 25 trips</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                {ride.isFree ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-2 py-0.5 text-xs font-semibold rounded">FREE</Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-2 py-0.5 text-xs font-semibold rounded">₹{Number(ride.pricePerSeat)}/seat</Badge>
                )}
                {ride.vehicleType && (
                  <span className="text-xs text-gray-500 font-medium">{ride.vehicleType}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Route Information */}
        <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mb-2 mt-2">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="font-medium text-travel-dark truncate">{ride.fromCity}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Clock className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <span className="text-sm text-gray-600 truncate">{format(departureDate, "MMM dd")} at {ride.departureTime}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Flag className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="font-medium text-travel-dark truncate">{ride.toCity}</span>
          </div>
          <div className="text-xs text-gray-500 text-right min-w-fit ml-4">
            <span className="font-semibold text-travel-dark">{ride.availableSeats}/{ride.totalSeats}</span> seats available
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-2 ml-1">
          {format(departureDate, "EEEE, MMMM do")}
        </div>
        {ride.description && (
          <div className="text-sm text-gray-600 leading-relaxed mt-2 ml-1">
            "{ride.description}"
          </div>
        )}
      </div>
      {onRequestJoin && (
        <div className="px-6 pb-4 flex justify-end">
          <Button
            onClick={() => onRequestJoin(ride.id)}
            disabled={isLoading}
            className="bg-travel-mint text-white hover:bg-travel-mint/90"
          >
            {isLoading ? 'Requesting...' : 'Request Ride'}
          </Button>
        </div>
      )}
    </div>
  );
}
