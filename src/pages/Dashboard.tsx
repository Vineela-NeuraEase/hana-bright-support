
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/components/AuthProvider";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useProfile } from "@/hooks/useProfile";
import { useNavigation } from "@/hooks/useNavigation";
import { NavigationItem } from "@/types/navigation";

const Dashboard = () => {
  const { profile } = useProfile();
  const navigationItems: NavigationItem[] = useNavigation(profile?.role);

  const getWelcomeMessage = () => {
    if (!profile) return "Welcome to Hana";
    switch (profile.role) {
      case 'autistic':
        return "Your personal support companion";
      case 'caregiver':
        return "Care management dashboard";
      case 'clinician':
        return "Clinical management portal";
      default:
        return "Welcome to Hana";
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <Sidebar
          navigationItems={navigationItems}
        />

        {/* Main Content */}
        <main className="flex-1">
          <DashboardContent welcomeMessage={getWelcomeMessage()} />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
