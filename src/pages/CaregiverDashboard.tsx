
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { useCaregiverLinks } from "@/hooks/useCaregiverLinks";
import { CaregiverDashboardLayout } from "@/components/caregiver/CaregiverDashboardLayout";
import { AccessDeniedCard } from "@/components/caregiver/AccessDeniedCard";

const CaregiverDashboard = () => {
  const { session } = useAuth();
  const { profile, loading: profileLoading } = useProfile(session);
  const navigate = useNavigate();
  
  const {
    linkCode,
    setLinkCode,
    isLinking,
    linkedUsers,
    selectedUserId,
    setSelectedUserId,
    loading,
    handleLinkUser,
    handleUnlinkUser
  } = useCaregiverLinks();

  // Redirect if not logged in
  useEffect(() => {
    if (!session && !profileLoading) {
      navigate("/auth");
    }
  }, [session, profileLoading, navigate]);

  // Redirect if not a caregiver
  useEffect(() => {
    if (profile && profile.role !== "caregiver" && !profileLoading) {
      navigate("/dashboard");
    }
  }, [profile, profileLoading, navigate]);

  if (profileLoading || (profile && profile.role !== 'caregiver')) {
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
