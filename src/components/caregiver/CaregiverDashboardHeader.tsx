
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

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
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          asChild
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
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
