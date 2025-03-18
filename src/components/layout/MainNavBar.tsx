
import { Link } from "react-router-dom";
import { Home, Menu, Calendar, CheckSquare, RadioTower, Settings, BookText, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/components/AuthProvider";
import { useNavigation } from "@/hooks/useNavigation";
import { useProfile } from "@/hooks/useProfile";
import { useState, useEffect } from "react";
import { NavigationItem } from "@/types/navigation";
import { toast } from "sonner";

interface MainNavBarProps {
  onSignOut?: () => void;
}

export const MainNavBar = ({ onSignOut }: MainNavBarProps) => {
  const { session } = useAuth();
  const { profile } = useProfile(session);
  const navigationItems: NavigationItem[] = useNavigation(profile?.role);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the menu when the location changes (user navigates to a new page)
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleSignOut = async () => {
    if (onSignOut) {
      onSignOut();
    }
  };

  const copyLinkCode = () => {
    if (profile?.link_code) {
      navigator.clipboard.writeText(profile.link_code);
      toast.success("Link code copied to clipboard!");
    } else {
      toast.error("No link code available");
    }
  };

  return (
    <nav className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4 justify-between">
        <div className="flex items-center gap-4">
          {/* Hamburger menu for mobile */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
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
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Only show the Hana title on mobile */}
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <h2 className="text-lg font-semibold">Hana</h2>
          </Link>
        </div>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {session?.user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              {profile?.link_code && (
                <>
                  <DropdownMenuItem onClick={copyLinkCode} className="gap-2 cursor-pointer">
                    <span>Link Code: {profile.link_code}</span>
                    <Copy className="h-4 w-4" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild>
                <Link to="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/tasks">Tasks</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/schedule">Schedule</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/journal">Journal</Link>
              </DropdownMenuItem>
              {profile?.role === "caregiver" && (
                <DropdownMenuItem asChild>
                  <Link to="/people">People</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to="/tools">Tools</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">Login</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};
