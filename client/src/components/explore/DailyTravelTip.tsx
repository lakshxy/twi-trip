
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const DailyTravelTip: React.FC = () => {
  return (
    <div className="mb-8">
      <Card className="border-travel-yellow/30 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Lightbulb className="h-6 w-6 text-travel-yellow" />
            <CardTitle className="text-travel-navy text-base md:text-lg">💡 Daily Travel Tip</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm md:text-base text-travel-navy/80">
            Try learning a few basic phrases in the local language. It can go a long way in making connections and showing respect.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyTravelTip;
