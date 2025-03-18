
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useSignOut = (callback?: () => void) => {
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast.success("Successfully signed out");
      if (callback) {
        callback();
      }
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return signOut;
};
