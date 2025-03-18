
import React from "react";
import { useProfile } from "@/hooks/useProfile";
import { CaregiverDashboardLayout } from "@/components/caregiver/CaregiverDashboardLayout";
import { AccessDeniedCard } from "@/components/caregiver/AccessDeniedCard";

const CaregiverDashboard = () => {
  const { profile, loading: profileLoading } = useProfile();
  
  // Mock link code and empty linked users array
  const linkCode = "MOCKCODE";
  const linkedUsers = [];
  const selectedUserId = null;
  const isLinking = false;
  const loading = false;

  // Mock handlers that don't perform any actual operations
  const setLinkCode = () => {};
  const setSelectedUserId = () => {};
  const handleLinkUser = () => {};
  const handleUnlinkUser = () => {};

  if (profileLoading) {
    return <div className="container py-6">Loading...</div>;
  }

  if (profile && profile.role !== 'caregiver') {
    return <AccessDeniedCard />;
  }

  return (
    <CaregiverDashboardLayout
      linkCode={linkCode}
      setLinkCode={setLinkCode}
      isLinking={isLinking}
      linkedUsers={linkedUsers}
      loading={loading}
      selectedUserId={selectedUserId}
      setSelectedUserId={setSelectedUserId}
      handleLinkUser={handleLinkUser}
      handleUnlinkUser={handleUnlinkUser}
    />
  );
};

export default CaregiverDashboard;
