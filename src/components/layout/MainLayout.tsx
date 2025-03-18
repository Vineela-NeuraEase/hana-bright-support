
import { Outlet } from "react-router-dom";
import { MainNavBar } from "./MainNavBar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const MainLayout = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MainNavBar onSignOut={handleSignOut} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};
