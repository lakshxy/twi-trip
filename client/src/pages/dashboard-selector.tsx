import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { 
  Home, 
  Car, 
  Compass, 
  Building, 
  ArrowRight,
  Users,
  MapPin,
  Calendar,
  Star
} from "lucide-react";

export default function DashboardSelector() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const dashboardOptions = [
    {
      id: 'property',
      title: 'Property Management',
      description: 'Manage your homestays, apartments, and vacation rentals',
      icon: <Home className="w-8 h-8" />,
      color: 'bg-blue-500',
      stats: {
        listings: 2,
        bookings: 12,
        revenue: '₹45,000',
        rating: 4.8
      },
      features: [
        'Manage property listings',
        'Handle booking requests',
        'Track revenue and analytics',
        'Manage guest communications'
      ]
    },
    {
      id: 'ride',
      title: 'Ride Management',
      description: 'Manage your ride-sharing services and carpooling',
      icon: <Car className="w-8 h-8" />,
      color: 'bg-green-500',
      stats: {
        listings: 1,
        bookings: 8,
        revenue: '₹12,800',
        rating: 4.6
      },
      features: [
        'Manage ride listings',
        'Handle ride requests',
        'Track earnings',
        'Manage passenger communications'
      ]
    },
    {
      id: 'tour',
      title: 'Tour Guide Dashboard',
      description: 'Manage your guided tours and travel experiences',
      icon: <Compass className="w-8 h-8" />,
      color: 'bg-purple-500',
      stats: {
        listings: 1,
        bookings: 5,
        revenue: '₹75,000',
        rating: 4.7
      },
      features: [
        'Manage tour packages',
        'Handle tour bookings',
        'Track tour performance',
        'Manage client communications'
      ]
    },
    {
      id: 'agency',
      title: 'Travel Agency Dashboard',
      description: 'Manage your travel agency services and group tours',
      icon: <Building className="w-8 h-8" />,
      color: 'bg-orange-500',
      stats: {
        listings: 1,
        bookings: 15,
        revenue: '₹3,75,000',
        rating: 4.6
      },
      features: [
        'Manage group tours',
        'Handle agency bookings',
        'Track business performance',
        'Manage client relationships'
      ]
    }
  ];

  const handleDashboardSelect = (dashboardType: string) => {
    setLocation(`/dashboard/${dashboardType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-travel-light via-white to-travel-beige">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-travel-navy mb-4">
            Choose Your Dashboard
          </h1>
          <p className="text-xl text-travel-navy/70 max-w-2xl mx-auto">
            Select the type of business you want to manage. Each dashboard is tailored 
            to your specific service type with relevant tools and analytics.
          </p>
        </div>

        {/* Dashboard Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dashboardOptions.map((option) => (
            <Card key={option.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl text-white ${option.color}`}>
                      {option.icon}
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-travel-navy">
                        {option.title}
                      </CardTitle>
                      <p className="text-travel-navy/70 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-travel-navy/50 group-hover:text-travel-navy transition-colors" />
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Home className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Listings</span>
                    </div>
                    <p className="text-xl font-bold text-travel-navy">{option.stats.listings}</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Bookings</span>
                    </div>
                    <p className="text-xl font-bold text-travel-navy">{option.stats.bookings}</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Revenue</span>
                    </div>
                    <p className="text-xl font-bold text-travel-navy">{option.stats.revenue}</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Rating</span>
                    </div>
                    <p className="text-xl font-bold text-travel-navy">{option.stats.rating}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-travel-navy mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-travel-mint rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <Button 
                  onClick={() => handleDashboardSelect(option.id)}
                  className="w-full bg-gradient-primary text-white hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                >
                  Access {option.title}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-travel-navy mb-4">
              Why Choose TwiTrip for Your Business?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-travel-mint/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-travel-mint" />
                </div>
                <h4 className="font-semibold text-travel-navy mb-2">Global Reach</h4>
                <p className="text-sm text-gray-600">
                  Connect with travelers from around the world
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-travel-lavender/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-travel-lavender" />
                </div>
                <h4 className="font-semibold text-travel-navy mb-2">Easy Management</h4>
                <p className="text-sm text-gray-600">
                  Simple tools to manage bookings and listings
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-travel-navy/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-travel-navy" />
                </div>
                <h4 className="font-semibold text-travel-navy mb-2">Trusted Platform</h4>
                <p className="text-sm text-gray-600">
                  Build trust with verified reviews and ratings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
