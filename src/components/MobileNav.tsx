
import { BookText, Calendar, CheckSquare, Home, LogIn, Layout, RadioTower } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

type Profile = {
  id: string;
  role: 'autistic' | 'caregiver' | 'clinician';
}

const MobileNav = () => {
  const location = useLocation();
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (session) {
      const getProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        setProfile(data);
      };

      getProfile();
    }
  }, [session]);

  // Only show nav items for autistic users on mobile
  const showNavItems = profile?.role === 'autistic';

  if (!session) {
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
        
        <Link
          to="/auth"
          className={`flex flex-col items-center space-y-1 ${
            location.pathname === "/auth" ? "text-primary" : "text-gray-500"
          }`}
        >
          <LogIn size={20} />
          <span className="text-xs">Login</span>
        </Link>
      </nav>
    );
  }

  if (!showNavItems) {
    return null;
  }

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

      <Link
        to="/dashboard"
        className={`flex flex-col items-center space-y-1 ${
          location.pathname.startsWith("/dashboard") ? "text-primary" : "text-gray-500"
        }`}
      >
        <Layout size={20} />
        <span className="text-xs">Dashboard</span>
      </Link>

      <Link
        to="/tasks"
        className={`flex flex-col items-center space-y-1 ${
          location.pathname === "/tasks" ? "text-primary" : "text-gray-500"
        }`}
      >
        <CheckSquare size={20} />
        <span className="text-xs">Tasks</span>
      </Link>
      
      <Link
        to="/schedule"
        className={`flex flex-col items-center space-y-1 ${
          location.pathname === "/schedule" ? "text-primary" : "text-gray-500"
        }`}
      >
        <Calendar size={20} />
        <span className="text-xs">Schedule</span>
      </Link>
      
      <Link
        to="/journal"
        className={`flex flex-col items-center space-y-1 ${
          location.pathname === "/journal" ? "text-primary" : "text-gray-500"
        }`}
      >
        <BookText size={20} />
        <span className="text-xs">Journal</span>
      </Link>
    </nav>
  );
};

export default MobileNav;
