import { useState, useEffect } from "react";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BookText, Calendar, CheckSquare, Cog, Home, Info, LogOut, RadioTower, UserCircle, FilePenLine, Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import FormalizerPage from "./tools/Formalizer";
import JudgePage from "./tools/Judge";
import ToolsDirectory from "./tools/Index";

type Profile = {
  id: string;
  role: 'autistic' | 'caregiver' | 'clinician';
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        { title: "Communication Tools", icon: RadioTower, url: "/dashboard/tools" },
      ];
    } else if (role === 'caregiver') {
      return [
        ...commonItems,
        { title: "Care Dashboard", icon: UserCircle, url: "/care" },
        { title: "Communication Tools", icon: RadioTower, url: "/dashboard/tools" },
      ];
    } else if (role === 'clinician') {
      return [
        ...commonItems,
        { title: "Clinician Portal", icon: UserCircle, url: "/portal" },
        { title: "Communication Tools", icon: RadioTower, url: "/dashboard/tools" },
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
          {/* Top Navigation Bar - Now positioned at the top of every page */}
          <nav className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4 gap-4 justify-between">
              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Menu" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[250px] p-0">
                    <div className="p-4 border-b">
                      <h2 className="text-xl font-bold">Hana</h2>
                    </div>
                    <div className="py-4">
                      {navigationItems.map((item) => (
                        <a
                          key={item.title}
                          href={item.url}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </a>
                      ))}
                    </div>
                    <div className="p-4 mt-auto border-t">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2" 
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
                <h2 className="text-lg font-semibold">Hana</h2>
              </div>

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
            <Routes>
              <Route path="/" element={
                <div>
                  <h1 className="text-2xl font-bold mb-6">{getWelcomeMessage()}</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link to="/dashboard/tools" className="block">
                      <div className="p-4 border rounded-lg hover:bg-muted transition-colors flex items-center gap-3">
                        <RadioTower className="h-6 w-6 text-primary" />
                        <div>
                          <h2 className="font-medium">Communication Tools</h2>
                          <p className="text-sm text-muted-foreground">Access tools for communication support</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              } />
              <Route path="tools" element={<ToolsDirectory />} />
              <Route path="tools/formalizer" element={<FormalizerPage />} />
              <Route path="tools/judge" element={<JudgePage />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
