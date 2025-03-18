
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { MobileNavigation } from '@/components/layout/MobileNavigation';

interface CaregiverDashboardHeaderProps {
  title: string;
}

export const CaregiverDashboardHeader: React.FC<CaregiverDashboardHeaderProps> = ({
  title
}) => {
  const { signOut } = useAuth();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        <MobileNavigation />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          asChild
          className="hidden md:flex"
        >
          <Link to="/dashboard">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={signOut}
          className="hidden md:flex"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
