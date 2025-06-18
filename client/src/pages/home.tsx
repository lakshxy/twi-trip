import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Home, Car } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')`
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
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Start <span className="text-travel-primary">Exploring</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect with fellow travelers, find the perfect homestay, and share unforgettable journeys across India
          </p>
          
          {/* CTA Button */}
          <Link href="/login">
            <Button 
              size="lg"
              className="bg-travel-primary hover:bg-red-500 text-white px-12 py-6 rounded-full text-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-2xl animate-pulse-glow"
            >
              Start Exploring
              <span className="ml-3">→</span>
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20">
          <Card className="glass-effect border-white/20">
            <CardContent className="p-6 text-white text-center">
              <Heart className="w-8 h-8 text-travel-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Match Travelers</h3>
              <p className="text-gray-200 text-sm">Swipe to connect with like-minded adventurers</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-white/20">
            <CardContent className="p-6 text-white text-center">
              <Home className="w-8 h-8 text-travel-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Find Homestays</h3>
              <p className="text-gray-200 text-sm">Discover authentic local accommodations</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-white/20">
            <CardContent className="p-6 text-white text-center">
              <Car className="w-8 h-8 text-travel-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Share Rides</h3>
              <p className="text-gray-200 text-sm">Split costs and make friends on the road</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
