
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { CaregiverDashboardLayout } from "@/components/caregiver/CaregiverDashboardLayout";
import { AccessDeniedCard } from "@/components/caregiver/AccessDeniedCard";
import { useCaregiverLinks } from "@/hooks/useCaregiverLinks";

const CaregiverDashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const {
    linkCode,
    setLinkCode,
    isLinking,
    linkedUsers,
    loading,
    selectedUserId,
    setSelectedUserId,
    handleLinkUser,
    handleUnlinkUser
  } = useCaregiverLinks();
  
  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!session) {
      navigate("/auth");
    }
  }, [session, navigate]);

  // Redirect if not a caregiver
  useEffect(() => {
    if (profile && profile.role !== 'caregiver' && !profileLoading) {
      navigate("/dashboard");
    }
  }, [profile, profileLoading, navigate]);

  if (!session) {
    return null; // Will redirect via useEffect
  }

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
