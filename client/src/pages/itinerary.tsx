import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, Star, Camera, Utensils, Mountain, Building, Search, Filter } from "lucide-react";

export default function ItineraryPage() {
  const [selectedCity, setSelectedCity] = useState("bali");

  const destinations = {
    bali: {
      name: "Bali, Indonesia",
      popularPlaces: [
        {
          name: "Tanah Lot Temple",
          type: "Cultural",
          rating: 4.6,
          duration: "2-3 hours",
          bestTime: "Sunset",
          description: "Ancient Hindu temple perched on a rock formation in the sea",
          image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
        },
        {
          name: "Ubud Rice Terraces",
          type: "Nature",
          rating: 4.8,
          duration: "3-4 hours",
          bestTime: "Morning",
          description: "Stunning green rice paddies with scenic walking paths",
          image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
        },
        {
          name: "Kuta Beach",
          type: "Beach",
          rating: 4.3,
          duration: "Half day",
          bestTime: "All day",
          description: "Famous surf beach with vibrant nightlife and restaurants",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
        }
      ],
      itineraries: [
        {
          day: 1,
          title: "Cultural Immersion",
          activities: [
            { time: "8:00 AM", activity: "Traditional Balinese breakfast", location: "Ubud Market", icon: Utensils },
            { time: "10:00 AM", activity: "Monkey Forest Sanctuary visit", location: "Sacred Monkey Forest", icon: Mountain },
            { time: "2:00 PM", activity: "Silver jewelry workshop", location: "Celuk Village", icon: Building },
            { time: "6:00 PM", activity: "Sunset at Tanah Lot Temple", location: "Tanah Lot", icon: Camera }
          ]
        },
        {
          day: 2,
          title: "Nature & Adventure",
          activities: [
            { time: "5:00 AM", activity: "Mount Batur sunrise trek", location: "Mount Batur", icon: Mountain },
            { time: "11:00 AM", activity: "Hot springs relaxation", location: "Toya Devasya", icon: Mountain },
            { time: "3:00 PM", activity: "Coffee plantation tour", location: "Luwak Coffee Farm", icon: Utensils },
            { time: "7:00 PM", activity: "Traditional Kecak dance", location: "Ubud Palace", icon: Building }
          ]
        },
        {
          day: 3,
          title: "Beach & Relaxation",
          activities: [
            { time: "9:00 AM", activity: "Surfing lessons", location: "Kuta Beach", icon: Mountain },
            { time: "1:00 PM", activity: "Beachside lunch", location: "Jimbaran Bay", icon: Utensils },
            { time: "4:00 PM", activity: "Spa and massage", location: "Seminyak Spa", icon: Building },
            { time: "7:00 PM", activity: "Seafood dinner on beach", location: "Jimbaran Beach", icon: Utensils }
          ]
        }
      ]
    },
    tokyo: {
      name: "Tokyo, Japan",
      popularPlaces: [
        {
          name: "Senso-ji Temple",
          type: "Cultural",
          rating: 4.7,
          duration: "2 hours",
          bestTime: "Morning",
          description: "Tokyo's oldest temple with traditional shopping street",
          image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
        },
        {
          name: "Shibuya Crossing",
          type: "Urban",
          rating: 4.5,
          duration: "1 hour",
          bestTime: "Evening",
          description: "World's busiest pedestrian crossing and neon lights",
          image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
        },
        {
          name: "Tsukiji Outer Market",
          type: "Food",
          rating: 4.8,
          duration: "3 hours",
          bestTime: "Early morning",
          description: "Fresh sushi and traditional Japanese street food",
          image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
        }
      ],
      itineraries: [
        {
          day: 1,
          title: "Traditional Tokyo",
          activities: [
            { time: "8:00 AM", activity: "Sushi breakfast", location: "Tsukiji Market", icon: Utensils },
            { time: "10:00 AM", activity: "Temple visit", location: "Senso-ji Temple", icon: Building },
            { time: "2:00 PM", activity: "Traditional garden", location: "Imperial Palace Gardens", icon: Mountain },
            { time: "6:00 PM", activity: "Kaiseki dinner", location: "Ginza", icon: Utensils }
          ]
        }
      ]
    }
  };

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

        {/* Sample Itineraries */}
        <div>
          <h2 className="text-2xl font-bold text-travel-navy mb-6">Sample Itineraries for {currentDestination.name}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentDestination.itineraries.map((itinerary) => (
              <Card key={itinerary.day} className="modern-card border-0 animate-slide-up">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-travel-navy">Day {itinerary.day}</span>
                    <Badge className="bg-travel-mint/20 text-travel-mint border-0">
                      {itinerary.title}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {itinerary.activities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-xl bg-travel-light/50">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-full flex-shrink-0">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-travel-navy">{activity.time}</span>
                          </div>
                          <p className="text-sm text-travel-navy font-medium">{activity.activity}</p>
                          <p className="text-xs text-travel-navy/60">{activity.location}</p>
                        </div>
                      </div>
                    );
                  })}
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