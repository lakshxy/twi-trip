import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Home, Car, MessageCircle, MapPin, Shield, Globe, CheckCircle, ArrowRight, Compass, Star, Users } from "lucide-react";

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
        <header className="relative z-10 px-6 py-8">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center animate-logo-spin shadow-lg">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-travel-navy text-3xl font-bold">TravelSwipe</h1>
            </div>
            <Link href="/swipe">
              <Button className="bg-gradient-primary hover:shadow-xl transition-all duration-500 text-white px-8 py-3 rounded-2xl font-semibold hover:scale-105">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center pt-20 pb-32">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
              {/* Hero Text */}
              <div className="flex-1 text-left lg:text-left animate-slide-in-left">
                <h1 className="text-5xl lg:text-7xl font-bold text-travel-navy mb-8 leading-tight">
                  Connect with
                  <span className="block text-travel-navy font-extrabold">
                    Fellow Travelers
                  </span>
                  <span className="block text-travel-mint font-bold">Worldwide</span>
                </h1>
                <p className="text-xl text-travel-navy/80 mb-10 max-w-2xl leading-relaxed font-medium">
                  Discover authentic homestays, find travel companions, and share unforgettable adventures 
                  with our elegant swipe-based travel community platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 mb-12">
                  <Link href="/swipe">
                    <Button 
                      size="lg"
                      className="bg-gradient-primary hover:shadow-2xl text-white px-10 py-5 rounded-2xl text-lg font-semibold transform hover:scale-105 transition-all duration-500 shadow-xl"
                    >
                      Start Exploring
                      <ArrowRight className="ml-3 w-6 h-6" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-2 border-travel-navy/20 text-travel-navy hover:bg-travel-navy/5 px-10 py-5 rounded-2xl text-lg font-semibold backdrop-blur-sm"
                  >
                    Watch Demo
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-8 text-travel-navy/70">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-travel-mint" />
                    <span className="font-semibold">Free to Join</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-travel-lavender" />
                    <span className="font-semibold">Safe & Secure</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-travel-navy" />
                    <span className="font-semibold">Global Community</span>
                  </div>
                </div>
              </div>

              {/* Modern Phone Mockup */}
              <div className="flex-1 max-w-sm animate-slide-in-right">
                <div className="relative">
                  <div className="modern-card bg-travel-navy p-3 shadow-2xl">
                    <div className="bg-white rounded-2xl overflow-hidden">
                      <div className="bg-gradient-secondary px-6 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-travel-navy">9:41</span>
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-travel-navy/40 rounded-full"></div>
                            <div className="w-1 h-1 bg-travel-navy/40 rounded-full"></div>
                            <div className="w-1 h-1 bg-travel-navy/40 rounded-full"></div>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-travel-navy">Discover</h3>
                      </div>
                      <div className="p-6">
                        <div className="glass-card rounded-3xl p-6 mb-6">
                          <div className="flex items-center mb-4">
                            <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center">
                              <Heart className="w-7 h-7 text-white" />
                            </div>
                          </div>
                          <h4 className="font-bold text-travel-navy mb-2 text-lg">Maya, 26</h4>
                          <p className="text-sm text-travel-navy/70 mb-3 font-medium">Digital Nomad • Bangkok</p>
                          <p className="text-xs text-travel-navy/60 mb-4">Looking for travel buddies to explore street food markets and temples!</p>
                          <div className="flex space-x-2">
                            <span className="px-3 py-1 bg-travel-mint/20 text-travel-mint text-xs rounded-xl font-medium">Street Food</span>
                            <span className="px-3 py-1 bg-travel-lavender/20 text-travel-lavender text-xs rounded-xl font-medium">Photography</span>
                          </div>
                        </div>
                        <div className="flex justify-center space-x-6">
                          <div className="w-14 h-14 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-red-500 text-xl font-bold">✕</span>
                          </div>
                          <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                            <Heart className="w-6 h-6 text-white" />
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
      <div className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl lg:text-6xl font-bold text-travel-navy mb-8">
              Everything You Need for
              <span className="block text-travel-lavender font-extrabold">
                Amazing Travels
              </span>
            </h2>
            <p className="text-xl text-travel-navy/70 max-w-3xl mx-auto leading-relaxed font-medium">
              Our platform combines the best of social matching with authentic travel experiences worldwide
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Smart Matching */}
            <Card className="modern-card bg-gradient-to-br from-white to-travel-lavender/10 hover:scale-105 border-0">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-travel-navy mb-4">Smart Matching</h3>
                <p className="text-travel-navy/70 leading-relaxed font-medium">
                  Swipe through travelers and hosts based on your interests, destination, and travel style.
                </p>
              </CardContent>
            </Card>

            {/* Authentic Homestays */}
            <Card className="modern-card bg-gradient-to-br from-white to-travel-mint/10 hover:scale-105 border-0">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Home className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-travel-navy mb-4">Authentic Homestays</h3>
                <p className="text-travel-navy/70 leading-relaxed font-medium">
                  Stay with verified locals who offer unique accommodations and insider knowledge.
                </p>
              </CardContent>
            </Card>

            {/* Ride Sharing */}
            <Card className="modern-card bg-gradient-to-br from-white to-travel-beige/30 hover:scale-105 border-0">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-accent rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Car className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-travel-navy mb-4">Ride Sharing</h3>
                <p className="text-travel-navy/70 leading-relaxed font-medium">
                  Share rides with fellow travelers, split costs, and make new friends on your journey.
                </p>
              </CardContent>
            </Card>

            {/* Real-time Chat */}
            <Card className="modern-card bg-gradient-to-br from-white to-travel-mint/10 hover:scale-105 border-0">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-travel-navy mb-4">Real-time Chat</h3>
                <p className="text-travel-navy/70 leading-relaxed font-medium">
                  Connect instantly with matches through our secure messaging system.
                </p>
              </CardContent>
            </Card>

            {/* Activity Partners */}
            <Card className="modern-card bg-gradient-to-br from-white to-travel-lavender/10 hover:scale-105 border-0">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-accent rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-travel-navy mb-4">Activity Partners</h3>
                <p className="text-travel-navy/70 leading-relaxed font-medium">
                  Find companions for hiking, sightseeing, dining, or any adventure you have in mind.
                </p>
              </CardContent>
            </Card>

            {/* Location-based */}
            <Card className="modern-card bg-gradient-to-br from-white to-travel-beige/30 hover:scale-105 border-0">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-travel-navy mb-4">Location-based</h3>
                <p className="text-travel-navy/70 leading-relaxed font-medium">
                  Discover opportunities near you with smart filtering and location-based matching.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 animate-fade-in">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Join thousands of travelers already connecting and exploring the world together
          </p>
          
          <Link href="/swipe">
            <Button 
              size="lg"
              className="bg-white text-travel-navy hover:bg-white/90 px-12 py-6 rounded-2xl text-xl font-bold transform hover:scale-105 transition-all duration-500 shadow-2xl animate-scale-in"
            >
              Start Exploring Now
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>

          <div className="flex items-center justify-center space-x-12 mt-16 text-white/80">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-travel-mint" />
              <span className="font-semibold">Free to Join</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-travel-lavender" />
              <span className="font-semibold">Safe & Secure</span>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="w-6 h-6 text-white" />
              <span className="font-semibold">Global Community</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-travel-navy text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-secondary rounded-2xl flex items-center justify-center animate-logo-spin">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white">TravelSwipe</h3>
          </div>
          <p className="text-travel-navy/60 mb-8 max-w-2xl mx-auto text-lg">
            Connecting travelers worldwide through authentic experiences and meaningful connections.
          </p>
          <div className="flex items-center justify-center space-x-8 text-travel-navy/50">
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