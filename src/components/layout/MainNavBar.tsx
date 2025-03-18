
import { Link } from "react-router-dom";
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
import { useAuth } from "@/components/FirebaseAuthProvider";
import { useFirebaseProfile } from "@/hooks/useFirebaseProfile";
import { MobileNavigation } from "./MobileNavigation";
import { LogOut } from "lucide-react";

export const MainNavBar = () => {
  const { user, signOut } = useAuth();
  const { profile } = useFirebaseProfile();
  
  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <nav className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4 justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Navigation with Hamburger Menu */}
          <MobileNavigation />
          
          {/* Hana title, visible on both mobile and desktop */}
          <Link to="/" className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Hana</h2>
          </Link>
        </div>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user ? user.email : "User"}
              {profile?.role && <p className="text-xs text-muted-foreground">{profile.role}</p>}
            </DropdownMenuLabel>
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
              <Link to="/journal">Journal</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/tools">Tools</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user ? (
              <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild>
                <Link to="/auth">Sign In</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
