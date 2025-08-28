
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FilterSectionProps {
  filterRoles: string[];
  setFilterRoles: (roles: string[] | ((prev: string[]) => string[])) => void;
  filterPurposes: string[];
  setFilterPurposes: (purposes: string[] | ((prev: string[]) => string[])) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ filterRoles, setFilterRoles, filterPurposes, setFilterPurposes }) => {
  const roles = [
    'Explore new places',
    'Meet new people',
    'Offer a place to stay',
    'Share local experiences',
    'Organize group trips',
    'Provide rides or transport',
    'Help plan travel',
    'Connect travelers with services',
  ];

  const purposes = [
    'Adventure & Exploration',
    'Work & Networking',
    'Volunteering & Giving Back',
    'Cultural Exchange',
    'Group Travel',
    'Local Experiences',
    'Travel Planning & Support',
  ];

  return (
    <div className="mb-8">
      <Card className="border-travel-mint/30 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-travel-navy text-base md:text-lg">🔎 Filter People</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="font-semibold text-travel-navy text-sm md:text-base">I want to...</label>
            <div className="flex gap-2 flex-wrap mt-2">
              {roles.map(role => (
                <Button
                  key={role}
                  type="button"
                  variant={filterRoles.includes(role) ? 'default' : 'outline'}
                  onClick={() => setFilterRoles(f => f.includes(role) ? f.filter(r => r !== role) : [...f, role])}
                  className="text-xs md:text-sm"
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold text-travel-navy text-sm md:text-base">My main purpose</label>
            <div className="flex gap-2 flex-wrap mt-2">
              {purposes.map(purpose => (
                <Button
                  key={purpose}
                  type="button"
                  variant={filterPurposes.includes(purpose) ? 'default' : 'outline'}
                  onClick={() => setFilterPurposes(f => f.includes(purpose) ? f.filter(p => p !== purpose) : [...f, purpose])}
                  className="text-xs md:text-sm"
                >
                  {purpose}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterSection;
