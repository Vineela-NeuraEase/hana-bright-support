
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/components/AuthProvider";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardContent } from "@/components/dashboard/content";
import { useProfile } from "@/hooks/profile";
import { useNavigation } from "@/hooks/useNavigation";
import { TopNavigationBar } from "@/components/dashboard/TopNavigationBar";
import { Loader2 } from "lucide-react";
import { ViewingBanner } from "@/components/dashboard/ViewingBanner";
import { LinkCodeDisplay } from "@/components/dashboard/LinkCodeDisplay";
import { useViewedUser } from "@/hooks/useViewedUser";
import { getWelcomeMessage } from "@/components/dashboard/utils/welcomeMessage";
import { useSignOut } from "@/hooks/useSignOut";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { 
    profile, 
    loading, 
    linkedUsers, 
    linkedUsersLoading,
    caregivers,
    caregiversLoading
  } = useProfile(session);
  const { viewingUserId, viewingUserProfile } = useViewedUser();
  const signOut = useSignOut();

  useEffect(() => {
    if (!session) {
      navigate("/auth");
    }
  }, [session, navigate]);

  // Get the navigation items based on user role
  const navigationItems = useNavigation(profile?.role);

  // Loading state
  if (loading || linkedUsersLoading || caregiversLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex flex-col min-h-screen bg-background">
        <ViewingBanner viewingUserProfile={viewingUserProfile} />
        <div className="flex flex-1">
          <Sidebar
            navigationItems={navigationItems}
            onSignOut={signOut}
          />

          {/* Main Content */}
          <main className="flex-1">
            <TopNavigationBar 
              session={session} 
              navigationItems={navigationItems} 
              onSignOut={signOut} 
            />
            
            {/* Link Code Section for Autistic Users */}
            <div className="px-4 pt-4">
              <LinkCodeDisplay profile={profile} viewingUserId={viewingUserId} />
            </div>
            
            <DashboardContent 
              welcomeMessage={getWelcomeMessage(profile, viewingUserProfile)} 
              profile={viewingUserProfile || profile}
              linkedUsers={linkedUsers}
              caregivers={caregivers}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
