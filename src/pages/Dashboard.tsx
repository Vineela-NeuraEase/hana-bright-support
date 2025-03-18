
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  
  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!session) {
      navigate("/auth");
    }
  }, [session, navigate]);
  
  // Redirect caregivers to their specific dashboard
  useEffect(() => {
    if (profile?.role === "caregiver" && !profileLoading) {
      navigate("/caregiver");
    }
  }, [profile, profileLoading, navigate]);

  if (!session) {
    return null; // Will redirect via useEffect
  }

  if (profileLoading) {
    return (
      <MainLayout>
        <div className="container py-6">Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <DashboardContent />
    </MainLayout>
  );
};

export default Dashboard;
