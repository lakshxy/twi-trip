
import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MessageCircle, Heart } from "lucide-react";
import type { Profile, User as UserType } from "@shared/schema";

interface RecentActivityProps {
  recentMatches: any[]; // Consider defining a proper type for matches
  handleViewProfile: (profile: Profile & { user: UserType }) => void;
  handleMessageUser: (userId: number) => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ recentMatches, handleViewProfile, handleMessageUser }) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-travel-navy/10">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-semibold text-travel-navy font-poppins">Recent Matches</h3>
          <Link href="/messages">
            <Button variant="outline" size="sm" className="border-travel-navy/20 text-travel-navy hover:bg-travel-navy/5 text-xs md:text-sm">View All</Button>
          </Link>
        </div>
        
        {recentMatches.length > 0 ? (
          <div className="space-y-3">
            {recentMatches.slice(0, 3).map((match: any, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-2 md:p-3 rounded-xl bg-travel-soft-lavender/20 hover:bg-travel-mint/30 transition-colors">
                <div 
                  className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-travel-navy to-travel-mint rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleViewProfile(match.profile)}
                  title="View Profile"
                >
                  <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="flex-1 cursor-pointer" onClick={() => handleViewProfile(match.profile)}>
                  <div className="font-medium text-travel-navy text-sm md:text-base">{match.name}</div>
                  <div className="text-xs md:text-sm text-travel-navy/70">Planning trip to {match.destination}</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-travel-mint hover:bg-travel-mint/10"
                  onClick={() => handleMessageUser(match.profile.userId)}
                  title="Send Message"
                >
                  <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 md:py-8">
            <Heart className="h-10 w-10 md:h-12 md:w-12 text-travel-navy/30 mx-auto mb-3" />
            <p className="text-travel-navy/70 text-sm md:text-base">No matches yet</p>
            <p className="text-xs md:text-sm text-travel-navy/50">Start swiping to make connections!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
