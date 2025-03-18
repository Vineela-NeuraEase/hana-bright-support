
import React from 'react';
import { LinkedUser } from '@/hooks/useCaregiverLinks';
import { LinkedUsersList } from "@/components/caregiver/LinkedUsersList";
import { CaregiverLinkCodeCard } from "@/components/caregiver/CaregiverLinkCodeCard";

interface LinkManagementProps {
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

export const LinkManagement: React.FC<LinkManagementProps> = ({
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
    <div className="space-y-4">
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
  );
};
