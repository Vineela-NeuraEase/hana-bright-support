
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useProfile } from "@/hooks/useProfile";
import { useNavigation } from "@/hooks/useNavigation";
import { NavigationItem } from "@/types/navigation";
import { TopNavigationBar } from "@/components/dashboard/TopNavigationBar";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const { profile, loading } = useProfile(session);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [viewingUserProfile, setViewingUserProfile] = useState<any>(null);

  // Parse the viewAs parameter from the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const viewAsParam = searchParams.get('viewAs');
    setViewingUserId(viewAsParam);

    if (viewAsParam) {
      fetchViewingUserProfile(viewAsParam);
    } else {
      setViewingUserProfile(null);
    }
  }, [location.search]);

  // Fetch the profile of the user being viewed (if any)
  const fetchViewingUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching viewed user profile:', error);
        return;
      }

      setViewingUserProfile(data);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  useEffect(() => {
    if (!session) {
      navigate("/auth");
    }
  }, [session, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Get the navigation items based on user role
  const navigationItems: NavigationItem[] = useNavigation(profile?.role);

  const getWelcomeMessage = () => {
    if (viewingUserProfile) {
      return `Viewing Dashboard for Person (Role: ${viewingUserProfile.role})`;
    }
    
    if (!profile) return "Welcome to Hannah";
    switch (profile.role) {
      case 'autistic':
        return "Your personal support companion";
      case 'caregiver':
        return "Care management dashboard";
      case 'clinician':
        return "Clinical management portal";
      default:
        return "Welcome to Hannah";
    }
  };

  // If we're viewing someone else's dashboard, show a notice
  const ViewingBanner = () => {
    if (!viewingUserProfile) return null;
    
    return (
      <div className="bg-secondary/20 py-2 px-4 text-center">
        <p className="text-sm">
          You are viewing a person's dashboard. 
          <button 
            onClick={() => navigate('/dashboard')} 
            className="ml-2 underline font-medium"
          >
            Return to your dashboard
          </button>
        </p>
      </div>
    );
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex flex-col min-h-screen bg-background">
        {viewingUserProfile && <ViewingBanner />}
        <div className="flex flex-1">
          <Sidebar
            navigationItems={navigationItems}
            onSignOut={handleSignOut}
          />

          {/* Main Content */}
          <main className="flex-1">
            <TopNavigationBar 
              session={session} 
              navigationItems={navigationItems} 
              onSignOut={handleSignOut} 
            />
            
            <DashboardContent 
              welcomeMessage={getWelcomeMessage()} 
              profile={profile}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
