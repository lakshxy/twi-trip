import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Flag, Star } from "lucide-react";
import { format } from "date-fns";
import type { Ride, User } from "@shared/schema";

interface RideCardProps {
  ride: Ride & { driver: User };
  onRequestJoin: (rideId: number) => void;
  isLoading: boolean;
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
    <Card className="hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img 
              src={driverImage}
              alt={ride.driver.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-bold text-travel-dark">{ride.driver.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">4.8 • 25 trips</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                {ride.isFree ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    FREE
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    ₹{Number(ride.pricePerSeat)}/seat
                  </Badge>
                )}
                {ride.vehicleType && (
                  <span className="text-sm text-gray-600">{ride.vehicleType}</span>
                )}
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => onRequestJoin(ride.id)}
            disabled={isLoading || ride.availableSeats === 0}
            className="bg-travel-accent hover:bg-blue-500"
          >
            {ride.availableSeats === 0 ? "Full" : "Request to Join"}
          </Button>
        </div>
        
        {/* Route Information */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="font-medium">{ride.fromCity}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                {format(departureDate, "MMM dd")} at {ride.departureTime}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Flag className="w-4 h-4 text-red-500" />
              <span className="font-medium">{ride.toCity}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{format(departureDate, "EEEE, MMMM do")}</span>
            <span>
              {ride.availableSeats}/{ride.totalSeats} seats available
            </span>
          </div>
        </div>
        
        {ride.description && (
          <p className="text-sm text-gray-600 leading-relaxed">
            "{ride.description}"
          </p>
        )}
      </CardContent>
    </Card>
  );
}
