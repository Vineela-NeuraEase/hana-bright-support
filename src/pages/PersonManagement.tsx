
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LinkCodeForm } from "@/components/people/LinkCodeForm";
import { MyLinkCode } from "@/components/people/MyLinkCode";
import { LinkedUsersList } from "@/components/people/LinkedUsersList";

// Define a simple interface for LinkedUser
interface LinkedUser {
  id: string;
  role: string;
  link_code?: string;
}

const PersonManagement = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile, loading } = useProfile(session);
  const [linkedUsers, setLinkedUsers] = useState<LinkedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }

    if (profile && profile.role !== 'caregiver' && profile.role !== 'clinician') {
      navigate("/dashboard");
      return;
    }

    fetchLinkedUsers();
  }, [session, profile, navigate]);

  const fetchLinkedUsers = async () => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      // Get all users this caregiver is linked to
      const { data: links, error: linksError } = await supabase
        .from('caregiver_links')
        .select('user_id')
        .eq('caregiver_id', session.user.id);

      if (linksError) throw linksError;

      if (links && links.length > 0) {
        // Get profiles for all linked users
        const userIds = links.map(link => link.user_id);
        
        // Get profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, role')
          .in('id', userIds);

        if (profilesError) throw profilesError;
        
        // Get link codes from user_links
        const { data: userLinks, error: userLinksError } = await supabase
          .from('user_links')
          .select('user_id, link_code')
          .in('user_id', userIds);
        
        if (userLinksError) throw userLinksError;
        
        // Combine the data
        const combinedData = profiles.map(profile => {
          const userLink = userLinks?.find(link => link.user_id === profile.id);
          return {
            ...profile,
            link_code: userLink?.link_code
          };
        });
        
        setLinkedUsers(combinedData || []);
      } else {
        setLinkedUsers([]);
      }
    } catch (error) {
      console.error('Error fetching linked users:', error);
      toast.error("Failed to load linked users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlinkUser = async (userId: string) => {
    if (!session) return;
    
    try {
      const { error } = await supabase
        .from('caregiver_links')
        .delete()
        .eq('caregiver_id', session.user.id)
        .eq('user_id', userId);

      if (error) throw error;
      
      toast.success("User unlinked successfully");
      fetchLinkedUsers();
    } catch (error) {
      console.error('Error unlinking user:', error);
      toast.error("Failed to unlink user");
    }
  };

  const handleViewDashboard = (userId: string) => {
    navigate(`/dashboard?viewAs=${userId}`);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Person Management</h1>

      {/* Link New User Card */}
      <LinkCodeForm session={session} onSuccess={fetchLinkedUsers} />

      {/* My Link Code Card */}
      <MyLinkCode profile={profile} />

      {/* Linked Users */}
      <h2 className="text-2xl font-semibold mb-4">Linked People</h2>
      
      <LinkedUsersList 
        linkedUsers={linkedUsers}
        isLoading={isLoading}
        onViewDashboard={handleViewDashboard}
        onUnlink={handleUnlinkUser}
      />
    </div>
  );
};

export default PersonManagement;
