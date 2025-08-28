
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterSectionProps {
  filterRoles: string[];
  setFilterRoles: (roles: string[]) => void;
  filterPurposes: string[];
  setFilterPurposes: (purposes: string[]) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  filterRoles, 
  setFilterRoles, 
  filterPurposes, 
  setFilterPurposes 
}) => {

  const roles = ["Traveler", "Local Guide", "Host"];
  const purposes = ["Adventure", "Relaxation", "Business"];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-travel-navy text-lg md:text-xl">Find Your Connection</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
          <Select onValueChange={setFilterRoles} value={filterRoles.join(', ')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select roles" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Purpose</label>
          <Select onValueChange={setFilterPurposes} value={filterPurposes.join(', ')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select purposes" />
            </SelectTrigger>
            <SelectContent>
              {purposes.map(purpose => (
                <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSection;
