
import { Home, LogIn, LogOut } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";

const MobileNav = () => {
  const location = useLocation();
  const { session } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-t border-gray-200 flex items-center justify-around md:hidden">
      <Link
        to="/"
        className={`flex flex-col items-center space-y-1 ${
          location.pathname === "/" ? "text-primary" : "text-gray-500"
        }`}
      >
        <Home size={20} />
        <span className="text-xs">Home</span>
      </Link>
      
      {!session ? (
        <Link
          to="/auth"
          className={`flex flex-col items-center space-y-1 ${
            location.pathname === "/auth" ? "text-primary" : "text-gray-500"
          }`}
        >
          <LogIn size={20} />
          <span className="text-xs">Login</span>
        </Link>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="flex flex-col items-center h-auto py-0 space-y-1"
        >
          <LogOut size={20} />
          <span className="text-xs">Logout</span>
        </Button>
      )}
    </nav>
  );
};

export default MobileNav;
