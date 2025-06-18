import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Home, Car, MessageCircle, MapPin, Shield, Globe, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
          }}
        />
        
        {/* Header */}
        <header className="relative z-10 px-6 py-8">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <h1 className="text-white text-2xl font-bold">TravelSwipe</h1>
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-travel-primary">
                Sign In
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <div className="max-w-5xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Start Your <span className="text-travel-primary">Adventure</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of travelers already connecting and exploring the world together
            </p>
            <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
              Connect with fellow travelers, find authentic homestays, and share unforgettable journeys across the globe
            </p>
            
            {/* CTA Button */}
            <Link href="/login">
              <Button 
                size="lg"
                className="bg-travel-primary hover:bg-red-500 text-white px-12 py-6 rounded-full text-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-2xl animate-pulse-glow mb-8"
              >
                Start Exploring Now
                <span className="ml-3">→</span>
              </Button>
            </Link>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-white/80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">Free to Join</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Safe & Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-travel-secondary" />
                <span className="text-sm">Worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-travel-dark mb-6">
              Everything You Need for <span className="text-travel-primary">Amazing</span> <span className="text-travel-secondary">Travels</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines the best of social matching with authentic travel experiences worldwide
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Smart Matching */}
            <Card className="hover:shadow-xl transition-shadow duration-300 border-0 bg-red-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-travel-primary" />
                </div>
                <h3 className="text-xl font-bold text-travel-dark mb-4">Smart Matching</h3>
                <p className="text-gray-600 leading-relaxed">
                  Swipe through travelers and hosts based on your interests, destination, and travel style. Find your perfect travel companion.
                </p>
              </CardContent>
            </Card>

            {/* Authentic Homestays */}
            <Card className="hover:shadow-xl transition-shadow duration-300 border-0 bg-teal-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Home className="w-8 h-8 text-travel-secondary" />
                </div>
                <h3 className="text-xl font-bold text-travel-dark mb-4">Authentic Homestays</h3>
                <p className="text-gray-600 leading-relaxed">
                  Stay with verified locals who offer unique accommodations and insider knowledge across the world.
                </p>
              </CardContent>
            </Card>

            {/* Ride Sharing */}
            <Card className="hover:shadow-xl transition-shadow duration-300 border-0 bg-blue-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Car className="w-8 h-8 text-travel-accent" />
                </div>
                <h3 className="text-xl font-bold text-travel-dark mb-4">Ride Sharing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Share rides with fellow travelers, split costs, and make new friends on your journey around the globe.
                </p>
              </CardContent>
            </Card>

            {/* Real-time Chat */}
            <Card className="hover:shadow-xl transition-shadow duration-300 border-0 bg-green-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-travel-dark mb-4">Real-time Chat</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect instantly with matches through our secure messaging system. Plan your adventures together.
                </p>
              </CardContent>
            </Card>

            {/* Activity Partners */}
            <Card className="hover:shadow-xl transition-shadow duration-300 border-0 bg-purple-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-travel-dark mb-4">Activity Partners</h3>
                <p className="text-gray-600 leading-relaxed">
                  Find companions for hiking, sightseeing, dining, or any adventure you have in mind across destinations.
                </p>
              </CardContent>
            </Card>

            {/* Location-based */}
            <Card className="hover:shadow-xl transition-shadow duration-300 border-0 bg-indigo-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-travel-dark mb-4">Location-based</h3>
                <p className="text-gray-600 leading-relaxed">
                  Discover opportunities near you or in your destination with smart filtering and location-based matching.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-travel-primary via-travel-secondary to-travel-accent py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of travelers already connecting and exploring the world together
          </p>
          
          <Link href="/login">
            <Button 
              size="lg"
              className="bg-white text-travel-dark hover:bg-gray-100 px-12 py-6 rounded-full text-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Start Exploring Now
              <span className="ml-3">🌍</span>
            </Button>
          </Link>

          <div className="flex items-center justify-center space-x-8 mt-12 text-white/80">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Free to Join</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Safe & Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Worldwide Community</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-travel-dark text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-travel-primary mb-4">TravelSwipe</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Connecting travelers worldwide through authentic experiences and meaningful connections.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <span>© 2024 TravelSwipe</span>
            <span>•</span>
            <span>Available Worldwide</span>
            <span>•</span>
            <span>Safe & Secure Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
