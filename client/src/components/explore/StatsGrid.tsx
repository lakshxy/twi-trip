
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageCircle, Car, Home } from "lucide-react";

const StatsGrid: React.FC = () => {
  const stats = [
    { title: "Travelers", value: "0", icon: <Users className="h-8 w-8 text-travel-lavender" />, gradient: "from-travel-soft-lavender/20 to-transparent" },
    { title: "Messages", value: "0", icon: <MessageCircle className="h-8 w-8 text-travel-mint" />, gradient: "from-travel-mint/20 to-transparent" },
    { title: "Rides", value: "0", icon: <Car className="h-8 w-8 text-travel-terracotta" />, gradient: "from-travel-terracotta/20 to-transparent" },
    { title: "Homestays", value: "0", icon: <Home className="h-8 w-8 text-travel-sage" />, gradient: "from-travel-sage/20 to-transparent" },
  ];

  return (
    <div className="relative mb-8 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`glass-card modern-card bg-gradient-to-br ${stat.gradient}`}>
            <CardContent className="p-4 md:p-6 flex flex-col items-start">
              <div className="mb-4">{stat.icon}</div>
              <p className="text-sm md:text-base font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-3xl md:text-4xl font-bold text-travel-navy">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white/80 dark:bg-zinc-800/80 text-travel-navy dark:text-white text-sm md:text-lg font-semibold px-4 py-2 rounded-xl shadow border border-travel-navy/10 mt-4 backdrop-blur-sm">
          Available soon
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;
