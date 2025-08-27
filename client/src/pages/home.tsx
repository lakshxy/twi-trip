import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Home, Car, MessageCircle, MapPin, Shield, Globe, CheckCircle, ArrowRight, Compass, Star, Users } from "lucide-react";
import logo from "@/assets/twi logo.png";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-travel-light via-white to-travel-beige">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-travel-lavender rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-travel-mint rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-travel-navy rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 px-4 sm:px-6 py-6">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <div className="flex items-center space-x-2 animate-fade-in">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center animate-logo-spin shadow-lg">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-travel-navy text-2xl font-bold flex items-center gap-2">
                <img src={logo} alt="TwiTrip Logo" className="h-8 w-auto inline-block align-middle" />
                TwiTrip
              </h1>
            </div>
            <Link href="/login">
              <Button className="bg-gradient-primary hover:shadow-xl transition-all duration-500 text-white px-6 py-2 rounded-xl font-semibold hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center pt-16 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Hero Text */}
              <div className="flex-1 text-center lg:text-left animate-slide-in-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-travel-navy mb-4 leading-tight">
                  Connect with
                  <span className="block text-travel-navy font-extrabold">
                    Fellow Travelers
                  </span>
                  <span className="block text-travel-mint font-bold">Worldwide</span>
                </h1>
                <p className="text-base sm:text-lg text-travel-navy/80 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  Discover authentic homestays, find travel companions, and share unforgettable adventures 
                  with our elegant swipe-based travel community platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Link href="/login">
                    <Button 
                      size="lg"
                      className="bg-gradient-primary hover:shadow-2xl text-white px-8 py-4 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-500 shadow-xl w-full sm:w-auto"
                    >
                      Start Exploring
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-2 border-travel-navy/20 text-travel-navy hover:bg-travel-navy/5 px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm w-full sm:w-auto"
                  >
                      Get Started
                  </Button>
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-travel-navy/70">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-travel-mint" />
                    <span className="font-semibold">Free to Join</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-travel-lavender" />
                    <span className="font-semibold">Safe & Secure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-travel-navy" />
                    <span className="font-semibold">Global Community</span>
                  </div>
                </div>
              </div>

              {/* Modern Phone Mockup */}
              <div className="flex-1 max-w-xs sm:max-w-sm animate-slide-in-right mt-10 lg:mt-0">
                <div className="relative">
                  <div className="modern-card bg-travel-navy p-2 shadow-2xl">
                    <div className="bg-white rounded-xl overflow-hidden">
                      <div className="bg-gradient-secondary px-4 py-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-travel-navy">9:41</span>
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-travel-navy/40 rounded-full"></div>
                            <div className="w-1 h-1 bg-travel-navy/40 rounded-full"></div>
                            <div className="w-1 h-1 bg-travel-navy/40 rounded-full"></div>
                          </div>
                        </div>
                        <h3 className="text-md font-bold text-travel-navy">Discover</h3>
                      </div>
                      <div className="p-4">
                        <div className="glass-card rounded-2xl p-4 mb-4">
                          <div className="flex items-center mb-3">
                            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                              <Heart className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <h4 className="font-bold text-travel-navy mb-1 text-md">Maya, 26</h4>
                          <p className="text-xs text-travel-navy/70 mb-2 font-medium">Digital Nomad • Bangkok</p>
                          <p className="text-xs text-travel-navy/60 mb-3">Looking for travel buddies to explore street food markets and temples!</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-travel-mint/20 text-travel-mint text-xs rounded-lg font-medium">Street Food</span>
                            <span className="px-2 py-1 bg-travel-lavender/20 text-travel-lavender text-xs rounded-lg font-medium">Photography</span>
                          </div>
                        </div>
                        <div className="flex justify-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-red-500 text-lg font-bold">✕</span>
                          </div>
                          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-md">
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-travel-navy mb-4">
              Everything You Need for
              <span className="block text-travel-lavender font-extrabold">
                Amazing Travels
              </span>
            </h2>
            <p className="text-base sm:text-lg text-travel-navy/70 max-w-3xl mx-auto leading-relaxed font-medium">
              Our platform combines the best of social matching with authentic travel experiences worldwide
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Smart Matching */}
            <Link href="/swipe">
              <Card className="modern-card bg-gradient-to-br from-white to-travel-lavender/10 hover:scale-105 border-0 cursor-pointer h-full">
                <CardContent className="p-6 text-center flex flex-col justify-between h-full">
                  <div>
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-travel-navy mb-3">Smart Matching</h3>
                    <p className="text-sm text-travel-navy/70 leading-relaxed font-medium mb-4">
                      Swipe through travelers and hosts based on your interests, destination, and travel style.
                    </p>
                  </div>
                  <Button className="bg-gradient-primary text-white px-5 py-2 rounded-lg text-sm font-semibold mt-auto">
                    Start Matching
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Authentic Homestays */}
            <Link href="/properties">
              <Card className="modern-card bg-gradient-to-br from-white to-travel-mint/10 hover:scale-105 border-0 cursor-pointer h-full">
                <CardContent className="p-6 text-center flex flex-col justify-between h-full">
                  <div>
                    <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                      <Home className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-travel-navy mb-3">Authentic Homestays</h3>
                    <p className="text-sm text-travel-navy/70 leading-relaxed font-medium mb-4">
                      Stay with verified locals who offer unique accommodations and insider knowledge.
                    </p>
                  </div>
                  <Button className="bg-gradient-secondary text-white px-5 py-2 rounded-lg text-sm font-semibold mt-auto">
                    Browse Homestays
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Ride Sharing */}
            <Link href="/rides">
              <Card className="modern-card bg-gradient-to-br from-white to-travel-beige/30 hover:scale-105 border-0 cursor-pointer h-full">
                <CardContent className="p-6 text-center flex flex-col justify-between h-full">
                  <div>
                    <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                      <Car className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-travel-navy mb-3">Ride Sharing</h3>
                    <p className="text-sm text-travel-navy/70 leading-relaxed font-medium mb-4">
                      Share rides with fellow travelers, split costs, and make new friends on your journey.
                    </p>
                  </div>
                  <Button className="bg-gradient-accent text-white px-5 py-2 rounded-lg text-sm font-semibold mt-auto">
                    Find Rides
                  </Button>
                </CardContent>
              </Card>
            </Link>

             {/* Real-time Chat */}
            <Link href="/messages">
              <Card className="modern-card bg-gradient-to-br from-white to-travel-mint/10 hover:scale-105 border-0 cursor-pointer h-full">
                <CardContent className="p-6 text-center flex flex-col justify-between h-full">
                  <div>
                    <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-travel-navy mb-3">Real-time Chat</h3>
                    <p className="text-sm text-travel-navy/70 leading-relaxed font-medium mb-4">
                      Connect instantly with matches through our secure messaging system.
                    </p>
                  </div>
                  <Button className="bg-gradient-secondary text-white px-5 py-2 rounded-lg text-sm font-semibold mt-auto">
                    Start Chatting
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Group Travel Finder */}
            <Link href="/groups">
              <Card className="modern-card bg-gradient-to-br from-white to-travel-lavender/10 hover:scale-105 border-0 cursor-pointer h-full">
                <CardContent className="p-6 text-center flex flex-col justify-between h-full">
                  <div>
                    <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-travel-navy mb-3">Group Travel Finder</h3>
                    <p className="text-sm text-travel-navy/70 leading-relaxed font-medium mb-4">
                      Join travel agencies and groups for organized trips. Perfect for solo travelers or couples seeking group adventures.
                    </p>
                  </div>
                  <Button className="bg-gradient-accent text-white px-5 py-2 rounded-lg text-sm font-semibold mt-auto">
                    Find Groups
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Travel Itinerary Guide */}
            <Link href="/itinerary">
              <Card className="modern-card bg-gradient-to-br from-white to-travel-beige/30 hover:scale-105 border-0 cursor-pointer h-full">
                <CardContent className="p-6 text-center flex flex-col justify-between h-full">
                  <div>
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-travel-navy mb-3">Travel Itinerary Guide</h3>
                    <p className="text-sm text-travel-navy/70 leading-relaxed font-medium mb-4">
                      Discover popular places, activities, and efficient daily itineraries. Make the most of every travel day.
                    </p>
                  </div>
                  <Button className="bg-gradient-primary text-white px-5 py-2 rounded-lg text-sm font-semibold mt-auto">
                    Explore Guides
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 animate-fade-in">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-base sm:text-lg text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Join thousands of travelers already connecting and exploring the world together
          </p>
          
          <Link href="/login">
            <Button 
              size="lg"
              className="bg-white text-travel-navy hover:bg-white/90 px-8 py-4 rounded-xl text-lg font-bold transform hover:scale-105 transition-all duration-500 shadow-2xl animate-scale-in w-full sm:w-auto"
            >
              Start Exploring Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mt-12 text-white/80">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-travel-mint" />
              <span className="font-semibold">Free to Join</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-travel-lavender" />
              <span className="font-semibold">Safe & Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-white" />
              <span className="font-semibold">Global Community</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-travel-navy text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center animate-logo-spin">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <img src={logo} alt="TwiTrip Logo" className="h-7 w-auto inline-block align-middle" />
              TwiTrip
            </h3>
          </div>
          <p className="text-white/60 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Connecting travelers worldwide through authentic experiences and meaningful connections.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-white/50 text-xs sm:text-sm">
            <span>© 2024 TwiTrip</span>
            <span className="hidden sm:inline">•</span>
            <span>Available Worldwide</span>
            <span className="hidden sm:inline">•</span>
            <span>Safe & Secure Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
