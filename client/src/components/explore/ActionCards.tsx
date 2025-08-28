
import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageCircle, Home, Car, Globe } from "lucide-react";

const ActionCards: React.FC = () => {
  const actionItems = [
    {
      href: "/swipe",
      icon: Users,
      iconColor: "text-travel-soft-lavender",
      bgColor: "bg-travel-soft-lavender/20",
      hoverBgColor: "hover:bg-travel-soft-lavender/30",
      title: "Discover People",
      description: "Connect with fellow travelers and make lifelong friendships."
    },
    {
      href: "/messages",
      icon: MessageCircle,
      iconColor: "text-travel-mint",
      bgColor: "bg-travel-mint/20",
      hoverBgColor: "hover:bg-travel-mint/30",
      title: "Messages",
      description: "Chat with your connections and plan amazing adventures."
    },
    {
      href: "/properties",
      icon: Home,
      iconColor: "text-travel-sage",
      bgColor: "bg-travel-sage/20",
      hoverBgColor: "hover:bg-travel-sage/30",
      title: "Properties",
      description: "Find unique accommodations or list your space for travelers."
    },
    {
      href: "/rides",
      icon: Car,
      iconColor: "text-travel-terracotta",
      bgColor: "bg-travel-terracotta/20",
      hoverBgColor: "hover:bg-travel-terracotta/30",
      title: "Ride Sharing",
      description: "Share rides, split costs, and make your journeys more fun."
    },
    {
      href: "/groups",
      icon: Users,
      iconColor: "text-travel-lavender",
      bgColor: "bg-travel-lavender/20",
      hoverBgColor: "hover:bg-travel-lavender/30",
      title: "Group Travel",
      description: "Join travel groups for organized trips and adventures."
    },
    {
      href: "/tour-guides",
      icon: Globe,
      iconColor: "text-travel-mint",
      bgColor: "bg-travel-mint/20",
      hoverBgColor: "hover:bg-travel-mint/30",
      title: "Tour Guides",
      description: "Find local experts or become a guide yourself."
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
      {actionItems.map(item => (
        <Link key={item.href} href={item.href}>
          <Card className="card-hover transition-all duration-300 hover:scale-105 cursor-pointer group bg-gradient-to-br from-white to-gray-50/10 border-gray-200/30">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center mb-4 ${item.hoverBgColor} transition-colors`}>
                  <item.icon className={`h-8 w-8 ${item.iconColor}`} />
                </div>
                <h3 className="font-bold mb-2 text-travel-navy text-base md:text-lg">{item.title}</h3>
                <p className="text-xs md:text-sm text-travel-navy/70">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ActionCards;
