import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Filter, Map, Star, MapPin } from "lucide-react";
import PropertyCard from "@/components/property-card";
import type { Property, User } from "@shared/schema";

export default function PropertiesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading } = useQuery<(Property & { host: User })[]>({
    queryKey: ["/api/properties"],
  });

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
    showInterestMutation.mutate(propertyId);
  };

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
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-travel-dark">Homestays</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm" className="bg-travel-primary text-white hover:bg-red-500">
              <Map className="w-4 h-4 mr-2" />
              Map View
            </Button>
          </div>
        </div>

        {properties.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Properties Available</h3>
              <p className="text-gray-500">Check back later for new homestay listings!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onShowInterest={handleShowInterest}
                isLoading={showInterestMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
