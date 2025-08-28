
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageCircle, Car, Home } from "lucide-react";

const StatsGrid: React.FC = () => {
  return (
    <div className="relative mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {/* Cards with content */}
        <Card className="card-hover bg-gradient-to-br from-white to-travel-soft-lavender/10 border-travel-soft-lavender/30">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Travelers</p>
                <p className="text-2xl md:text-3xl font-bold text-travel-navy">0</p>
              </div>
              <div className="bg-travel-soft-lavender/20 p-2 md:p-3 rounded-full">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-travel-soft-lavender" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-white to-travel-mint/10 border-travel-mint/30">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Messages</p>
                <p className="text-2xl md:text-3xl font-bold text-travel-navy">0</p>
              </div>
              <div className="bg-travel-mint/20 p-2 md:p-3 rounded-full">
                <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-travel-mint" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-white to-travel-terracotta/10 border-travel-terracotta/30">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Rides</p>
                <p className="text-2xl md:text-3xl font-bold text-travel-navy">0</p>
              </div>
              <div className="bg-travel-terracotta/20 p-2 md:p-3 rounded-full">
                <Car className="h-6 w-6 md:h-8 md:w-8 text-travel-terracotta" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-white to-travel-sage/10 border-travel-sage/30">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Homestays</p>
                <p className="text-2xl md:text-3xl font-bold text-travel-navy">0</p>
              </div>
              <div className="bg-travel-sage/20 p-2 md:p-3 rounded-full">
                <Home className="h-6 w-6 md:h-8 md:w-8 text-travel-sage" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="bg-white/80 text-travel-navy text-sm md:text-lg font-semibold px-4 py-2 rounded-xl shadow border border-travel-navy/10 mt-4">Available soon</span>
      </div>
    </div>
  );
};

export default StatsGrid;
