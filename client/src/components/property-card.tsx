import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";
import type { Property, User } from "@shared/schema";

interface PropertyCardProps {
  property: Property & { host: User };
  onShowInterest: (propertyId: number) => void;
  isLoading: boolean;
}

export default function PropertyCard({ property, onShowInterest, isLoading }: PropertyCardProps) {
  const propertyImages = [
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
    "https://images.unsplash.com/photo-1583395865554-58296a044a3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
  ];

  const imageUrl = property.images?.[0] || propertyImages[property.id % propertyImages.length];

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative">
        <img 
          src={imageUrl}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-travel-dark mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">
            {[property.city, property.state].filter(Boolean).join(", ")}
          </span>
        </div>
        
        {property.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {property.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-travel-dark">
              ₹{Number(property.pricePerNight).toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">/night</span>
          </div>
          <Button
            onClick={() => onShowInterest(property.id)}
            disabled={isLoading}
            size="sm"
            className="bg-travel-secondary hover:bg-teal-500 text-white"
          >
            Show Interest
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          {property.rating && Number(property.rating) > 0 && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">
                {Number(property.rating).toFixed(1)}
              </span>
              {property.reviewCount > 0 && (
                <span className="text-sm text-gray-600 ml-1">
                  ({property.reviewCount} review{property.reviewCount !== 1 ? 's' : ''})
                </span>
              )}
            </div>
          )}
          
          <span className="text-xs text-gray-500">
            Host: {property.host.name}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
