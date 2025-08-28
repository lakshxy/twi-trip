import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, Star, Camera, Utensils, Mountain, Building, Search, Filter } from "lucide-react";
import { destinations } from "@/lib/destinations";
import { BackButton } from "@/components/back-button";

export default function ItineraryPage() {
  const [selectedCity, setSelectedCity] = useState("bali");

  const cities = [
    { id: "bali", name: "Bali", country: "Indonesia" },
    { id: "tokyo", name: "Tokyo", country: "Japan" },
    { id: "paris", name: "Paris", country: "France" },
    { id: "bangkok", name: "Bangkok", country: "Thailand" }
  ];

  const currentDestination = destinations[selectedCity as keyof typeof destinations] || destinations.bali;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Cultural': return 'bg-travel-lavender/20 text-travel-lavender';
      case 'Nature': return 'bg-travel-mint/20 text-travel-mint';
      case 'Beach': return 'bg-blue-100 text-blue-600';
      case 'Urban': return 'bg-travel-beige/50 text-travel-navy';
      case 'Food': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="w-full flex justify-start mt-2 mb-4 px-4">
          <BackButton />
        </div>
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-travel-navy mb-4">Travel Itinerary Guide</h1>
          <p className="text-xl text-travel-navy/70 max-w-3xl mx-auto">
            Discover popular places, activities, and efficient daily itineraries. Make the most of every travel day with our curated guides.
          </p>
        </div>

        {/* City Selection */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-travel-navy/50 w-5 h-5" />
              <Input 
                placeholder="Search destinations..." 
                className="pl-10 rounded-xl border-travel-navy/20"
              />
            </div>
            <Button variant="outline" className="rounded-xl border-travel-navy/20 text-travel-navy">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2">
            {cities.map((city) => (
              <Button
                key={city.id}
                variant={selectedCity === city.id ? "default" : "outline"}
                className={`whitespace-nowrap rounded-xl ${
                  selectedCity === city.id 
                    ? 'bg-gradient-primary text-white' 
                    : 'border-travel-navy/20 text-travel-navy hover:bg-travel-navy/5'
                }`}
                onClick={() => setSelectedCity(city.id)}
              >
                {city.name}, {city.country}
              </Button>
            ))}
          </div>
        </div>

        {/* Popular Places */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-travel-navy mb-6">Popular Places in {currentDestination.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDestination.popularPlaces.map((place, index) => (
              <Card key={index} className="modern-card border-0 overflow-hidden animate-slide-up">
                <div className="relative">
                  <img 
                    src={place.image}
                    alt={place.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={`${getTypeColor(place.type)} border-0 font-semibold`}>
                      {place.type}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span className="text-xs font-semibold text-travel-navy">{place.rating}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-travel-navy mb-2">{place.name}</h3>
                  <p className="text-sm text-travel-navy/70 mb-3 line-clamp-2">{place.description}</p>
                  <div className="flex items-center justify-between text-xs text-travel-navy/60">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {place.duration}
                    </div>
                    <span>Best: {place.bestTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Card className="modern-card border-0 bg-gradient-to-br from-travel-light to-white p-8">
            <CardContent className="p-0">
              <MapPin className="w-16 h-16 text-travel-lavender mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-travel-navy mb-4">Need a Custom Itinerary?</h3>
              <p className="text-travel-navy/70 mb-6 max-w-2xl mx-auto">
                Our travel experts can create personalized day-by-day itineraries based on your interests, budget, and travel style.
              </p>
              <Button className="bg-gradient-secondary text-white px-8 py-3 rounded-xl font-semibold">
                Get Custom Itinerary
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}