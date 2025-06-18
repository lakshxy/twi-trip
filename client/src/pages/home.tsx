import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Home, Car, MessageCircle, MapPin, Shield, Globe, CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Header */}
        <header className="relative z-10 px-6 py-8">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-coral-500 to-rose-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-slate-900 text-2xl font-bold">TravelSwipe</h1>
            </div>
            <Link href="/swipe">
              <Button className="bg-gradient-to-r from-coral-500 to-rose-500 hover:from-coral-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center pt-20 pb-32">
          <div className="max-w-5xl mx-auto">
            {/* Phone Mockup */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="flex-1 text-left lg:text-left">
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                  Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-600 to-rose-600">Fellow</span><br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Travelers</span><br />
                  <span className="text-slate-900">Worldwide</span>
                </h1>
                <p className="text-xl text-slate-800 mb-8 max-w-2xl leading-relaxed font-medium">
                  Discover authentic homestays, find travel companions, and share unforgettable adventures with our swipe-based travel community platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link href="/swipe">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-coral-500 to-rose-500 hover:from-coral-600 hover:to-rose-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      Start Exploring
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-2 border-slate-400 text-slate-800 hover:bg-slate-100 px-8 py-4 rounded-2xl text-lg font-semibold"
                  >
                    Watch Demo
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 text-slate-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-semibold">Free to Join</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold">Safe & Secure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-semibold">Worldwide Community</span>
                  </div>
                </div>
              </div>

              {/* Phone Mockup */}
              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <div className="bg-slate-800 rounded-[3rem] p-2 shadow-2xl">
                    <div className="bg-white rounded-[2.5rem] overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-100 to-yellow-100 px-6 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-600">9:41</span>
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Discover</h3>
                      </div>
                      <div className="p-6">
                        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-6 mb-4">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                              <Heart className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <h4 className="font-bold text-slate-900 mb-2">Maya, 26</h4>
                          <p className="text-sm text-slate-800 mb-3 font-medium">Digital Nomad • Bangkok</p>
                          <p className="text-xs text-slate-700">Looking for travel buddies to explore street food markets and temples!</p>
                          <div className="flex space-x-2 mt-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg">Street Food</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg">Photography</span>
                          </div>
                        </div>
                        <div className="flex justify-center space-x-4">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-500 font-bold">✕</span>
                          </div>
                          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-pink-500" />
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
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Everything You Need for <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-600 to-rose-600">Amazing</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Travels</span>
            </h2>
            <p className="text-xl text-slate-800 max-w-3xl mx-auto leading-relaxed font-medium">
              Our platform combines the best of social matching with authentic travel experiences worldwide
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Smart Matching */}
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-coral-50 to-rose-50 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-coral-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-coral-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Smart Matching</h3>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Swipe through travelers and hosts based on your interests, destination, and travel style. Find your perfect travel companion.
                </p>
              </CardContent>
            </Card>

            {/* Authentic Homestays */}
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-teal-50 to-cyan-50 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Home className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Authentic Homestays</h3>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Stay with verified locals who offer unique accommodations and insider knowledge across the world.
                </p>
              </CardContent>
            </Card>

            {/* Ride Sharing */}
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Car className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Ride Sharing</h3>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Share rides with fellow travelers, split costs, and make new friends on your journey around the globe.
                </p>
              </CardContent>
            </Card>

            {/* Real-time Chat */}
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-green-50 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Real-time Chat</h3>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Connect instantly with matches through our secure messaging system. Plan your adventures together.
                </p>
              </CardContent>
            </Card>

            {/* Activity Partners */}
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-50 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Activity Partners</h3>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Find companions for hiking, sightseeing, dining, or any adventure you have in mind across destinations.
                </p>
              </CardContent>
            </Card>

            {/* Location-based */}
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-amber-50 to-orange-50 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Location-based</h3>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Discover opportunities near you or in your destination with smart filtering and location-based matching.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers already connecting and exploring the world together
          </p>
          
          <Link href="/swipe">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-coral-500 to-rose-500 hover:from-coral-600 hover:to-rose-600 text-white px-12 py-6 rounded-2xl text-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Start Exploring Now
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>

          <div className="flex items-center justify-center space-x-8 mt-12 text-slate-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Free to Join</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>Safe & Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              <span>Worldwide Community</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-coral-500 to-rose-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">TravelSwipe</h3>
          </div>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Connecting travelers worldwide through authentic experiences and meaningful connections.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
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
