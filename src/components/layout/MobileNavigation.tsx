
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Home, Calendar, CheckSquare, RadioTower, Settings, BookText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { NavigationItem } from "@/types/navigation";
import { useNavigation } from "@/hooks/useNavigation";
import { useFirebaseProfile } from "@/hooks/useFirebaseProfile";

export const MobileNavigation = () => {
  const { session, signOut } = useAuth();
  const { profile } = useFirebaseProfile();
  const navigationItems: NavigationItem[] = useNavigation(profile?.role);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the menu when the location changes (user navigates to a new page)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="block md:hidden">
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] p-0">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Hana</h2>
          </div>
          <div className="py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            ))}
            
            {/* Add common routes if they're not already included */}
            {!navigationItems.some(item => item.url === "/dashboard") && (
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            )}
            
            {!navigationItems.some(item => item.url === "/tasks") && (
              <Link
                to="/tasks"
                className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                <CheckSquare className="h-5 w-5" />
                <span>Tasks</span>
              </Link>
            )}
            
            {!navigationItems.some(item => item.url === "/schedule") && (
              <Link
                to="/schedule"
                className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar className="h-5 w-5" />
                <span>Schedule</span>
              </Link>
            )}
            
            {!navigationItems.some(item => item.url === "/journal") && (
              <Link
                to="/journal"
                className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookText className="h-5 w-5" />
                <span>Journal</span>
              </Link>
            )}
            
            {!navigationItems.some(item => item.url === "/tools") && (
              <Link
                to="/tools"
                className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                <RadioTower className="h-5 w-5" />
                <span>Tools</span>
              </Link>
            )}
            
            {!navigationItems.some(item => item.url === "/settings") && (
              <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            )}
          </div>
          <div className="p-4 border-t mt-auto">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-500"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
