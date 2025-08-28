
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeHeader from './WelcomeHeader';
import DailyTravelTip from './DailyTravelTip';
import LanguagePhrases from './LanguagePhrases';
import FilterSection from './FilterSection';

const Explore: React.FC = () => {
  const { user } = useAuth();
  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [filterPurposes, setFilterPurposes] = useState<string[]>([]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {user && <WelcomeHeader email={user.email || ''} />}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-1">
            <DailyTravelTip />
          </div>
          <div className="md:col-span-1">
            <LanguagePhrases />
          </div>
        </div>

        <FilterSection 
          filterRoles={filterRoles}
          setFilterRoles={setFilterRoles}
          filterPurposes={filterPurposes}
          setFilterPurposes={setFilterPurposes}
        />
        
        {/* Placeholder for displaying people based on filters */}
        <div className="mt-8">
          {/* People cards will go here */}
        </div>
      </div>
    </div>
  );
};

export default Explore;
