
import { Link } from "react-router-dom";
import { Home, Menu } from "lucide-react";
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

interface MainNavBarProps {
  onSignOut?: () => void;
}

export const MainNavBar = ({ onSignOut }: MainNavBarProps) => {
  const { session } = useAuth();
  const { profile } = useProfile(session);
  const navigationItems = useNavigation(profile?.role);

  const handleSignOut = async () => {
    if (onSignOut) {
      onSignOut();
    }
  };

  return (
    <nav className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4 justify-between">
        <div className="flex items-center gap-4">
          {/* Hamburger menu for mobile */}
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
                  <Link
                    key={item.title}
                    to={item.url}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                ))}
                <Link
                  to="/tasks"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                >
                  <CheckSquare className="h-5 w-5" />
                  <span>Tasks</span>
                </Link>
                <Link
                  to="/schedule"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Schedule</span>
                </Link>
                <Link
                  to="/tools"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
                >
                  <RadioTower className="h-5 w-5" />
                  <span>Tools</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center gap-2">
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
              <DropdownMenuSeparator />
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
                <Link to="/tools">Tools</Link>
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

// Import necessary icons
import { Calendar, CheckSquare } from "lucide-react";
