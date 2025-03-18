
import React from 'react';
import { LinkedUser } from '@/hooks/useCaregiverLinks';
import { LinkedUsersList } from "@/components/caregiver/LinkedUsersList";
import { CaregiverLinkCodeCard } from "@/components/caregiver/CaregiverLinkCodeCard";
import { UserContentTabs } from "@/components/caregiver/UserContentTabs";
import { NoUserSelected } from "@/components/caregiver/NoUserSelected";
import { CaregiverDashboardHeader } from "@/components/caregiver/CaregiverDashboardHeader";

interface CaregiverDashboardLayoutProps {
  linkCode: string;
  setLinkCode: (value: string) => void;
  isLinking: boolean;
  linkedUsers: LinkedUser[];
  loading: boolean;
  selectedUserId: string | null;
  setSelectedUserId: (id: string) => void;
  handleLinkUser: () => void;
  handleUnlinkUser: (linkId: string) => void;
}

export const CaregiverDashboardLayout: React.FC<CaregiverDashboardLayoutProps> = ({
  linkCode,
  setLinkCode,
  isLinking,
  linkedUsers,
  loading,
  selectedUserId,
  setSelectedUserId,
  handleLinkUser,
  handleUnlinkUser
}) => {
  return (
    <div className="container py-6">
      <CaregiverDashboardHeader title="Caregiver Dashboard" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          {/* Link Code Input */}
          <CaregiverLinkCodeCard 
            linkCode={linkCode} 
            setLinkCode={setLinkCode} 
            isLinking={isLinking} 
            handleLinkUser={handleLinkUser} 
          />

          {/* Linked Users List */}
          <LinkedUsersList
            linkedUsers={linkedUsers}
            loading={loading}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            handleUnlinkUser={handleUnlinkUser}
          />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3">
          {selectedUserId ? (
            <UserContentTabs userId={selectedUserId} />
          ) : (
            <NoUserSelected />
          )}
        </div>
      </div>
    </div>
  );
};
