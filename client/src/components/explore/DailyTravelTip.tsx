
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TravelTip {
  id: number;
  title: string;
  content: string;
  icon: string;
  category: string;
}

interface DailyTravelTipProps {
  todaysTip: TravelTip;
}

const DailyTravelTip: React.FC<DailyTravelTipProps> = ({ todaysTip }) => {
  return (
    <div className="mb-8">
      <Card className="bg-gradient-to-r from-travel-mint/20 to-travel-soft-lavender/20 border-travel-mint/30 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">{todaysTip.icon}</div>
            <CardTitle className="text-travel-navy text-base md:text-lg">💡 Daily Travel Tip</CardTitle>
            <Badge variant="secondary" className="bg-travel-mint/20 text-travel-navy border-travel-mint/30 text-xs">
              {todaysTip.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-travel-navy mb-2 text-sm md:text-base">{todaysTip.title}</h3>
          <p className="text-travel-navy/80 text-xs md:text-sm">{todaysTip.content}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyTravelTip;
