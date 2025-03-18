
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BookText, Calendar, CheckSquare, Cog, Home, LogOut, RadioTower, UserCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Profile = {
  id: string;
  role: 'autistic' | 'caregiver' | 'clinician';
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }

    const getProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    };

    getProfile();
  }, [session, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getNavigationItems = (role: string) => {
    const commonItems = [
      { title: "Home", icon: Home, url: "/dashboard" },
      { title: "Settings", icon: Cog, url: "/settings" },
    ];

    if (role === 'autistic') {
      return [
        ...commonItems,
        { title: "Tasks", icon: CheckSquare, url: "/tasks" },
        { title: "Schedule", icon: Calendar, url: "/schedule" },
        { title: "Journal", icon: BookText, url: "/journal" },
        { title: "Sensory Tools", icon: RadioTower, url: "/tools" },
      ];
    } else if (role === 'caregiver') {
      return [
        ...commonItems,
        { title: "Care Dashboard", icon: UserCircle, url: "/care" },
      ];
    } else if (role === 'clinician') {
      return [
        ...commonItems,
        { title: "Clinician Portal", icon: UserCircle, url: "/portal" },
      ];
    }

    return commonItems;
  };

  const navigationItems = profile ? getNavigationItems(profile.role) : [];

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
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <SidebarHeader className="flex items-center justify-between p-4">
            <h2 className="text-xl font-bold">Hana</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <div className="mt-auto p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2" 
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1">
          {/* Top Navigation Bar */}
          <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4 gap-4 justify-between">
              <h2 className="text-lg font-semibold md:hidden">Hana</h2>
              
              {/* Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-auto h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {session?.user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>

          {/* Page Content */}
          <div className="flex-1 px-4 py-8">
            <h1 className="text-2xl font-bold">{getWelcomeMessage()}</h1>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
