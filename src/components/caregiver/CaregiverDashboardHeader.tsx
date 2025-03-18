
import React from 'react';

interface CaregiverDashboardHeaderProps {
  title: string;
}

export const CaregiverDashboardHeader: React.FC<CaregiverDashboardHeaderProps> = ({ 
  title 
}) => {
  return (
    <h1 className="text-3xl font-bold mb-6">{title}</h1>
  );
};
