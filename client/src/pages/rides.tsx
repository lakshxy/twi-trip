import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Plus, Clock, MapPin, Flag, Star } from "lucide-react";
import RideCard from "@/components/ride-card";
import type { Ride, User } from "@shared/schema";

export default function RidesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rides = [], isLoading } = useQuery<(Ride & { driver: User })[]>({
    queryKey: ["/api/rides"],
  });

  const requestJoinMutation = useMutation({
    mutationFn: async (rideId: number) => {
      const response = await apiRequest("POST", `/api/rides/${rideId}/request`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Join Request Sent!",
        description: "The driver will review your request.",
      });
    },
  });

  const handleRequestJoin = (rideId: number) => {
    requestJoinMutation.mutate(rideId);
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
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-travel-dark">Ride Sharing</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <DollarSign className="w-4 h-4 mr-2" />
              Free Only
            </Button>
            <Button size="sm" className="bg-travel-primary hover:bg-red-500">
              <Plus className="w-4 h-4 mr-2" />
              Offer Ride
            </Button>
          </div>
        </div>

        {rides.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Rides Available</h3>
              <p className="text-gray-500 mb-4">Be the first to offer a ride or check back later!</p>
              <Button className="bg-travel-primary hover:bg-red-500">
                <Plus className="w-4 h-4 mr-2" />
                Offer Your First Ride
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onRequestJoin={handleRequestJoin}
                isLoading={requestJoinMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
