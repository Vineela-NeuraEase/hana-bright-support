
import { useState } from "react";
import { LinkCodeForm } from "@/components/people/LinkCodeForm";
import { LinkedUsersList } from "@/components/people/LinkedUsersList";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PersonManagement = () => {
  const { session } = useAuth();
  const { profile, linkedUsers, linkedUsersLoading, refetchLinkedUsers } = useProfile(session);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Debug data
  console.log("Profile:", profile);
  console.log("Linked users:", linkedUsers);

  const handleLinkSuccess = () => {
    refetchLinkedUsers();
    toast({
      title: "Success",
      description: "Successfully linked to person"
    });
  };

  const handleViewDashboard = (userId: string) => {
    navigate(`/dashboard?viewAs=${userId}`);
  };

  const handleUnlink = async (userId: string) => {
    if (!session || !profile) return;
    
    try {
      const { error } = await supabase
        .from('caregiver_links')
        .delete()
        .eq('caregiver_id', profile.id)
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Successfully unlinked person"
      });
      
      // Refresh the list
      refetchLinkedUsers();
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to unlink person"
      });
    }
  };
  
  const handleViewTasks = (userId: string) => {
    navigate(`/tasks?viewAs=${userId}`);
  };
  
  const handleViewCalendar = (userId: string) => {
    navigate(`/schedule?viewAs=${userId}`);
  };
  
  const handleSendEncouragement = (userId: string) => {
    navigate(`/encouragement?to=${userId}`);
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <User className="h-6 w-6 mr-2 text-primary" />
        <h1 className="text-2xl font-bold">People Management</h1>
      </div>
      
      <div className="space-y-8">
        {profile?.role === 'caregiver' && (
          <>
            <section>
              <h2 className="text-xl font-semibold mb-4">Link to a Person</h2>
              <LinkCodeForm session={session} onSuccess={handleLinkSuccess} />
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">Linked People</h2>
              <LinkedUsersList 
                linkedUsers={linkedUsers} 
                isLoading={linkedUsersLoading}
                onViewDashboard={handleViewDashboard}
                onUnlink={handleUnlink}
                onViewTasks={handleViewTasks}
                onViewCalendar={handleViewCalendar}
                onSendEncouragement={handleSendEncouragement}
              />
            </section>
          </>
        )}
        
        {profile?.role === 'autistic' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Your Link Code</h2>
            <p className="mb-4">
              Share this code with your caregivers to allow them to link to your account.
            </p>
            {profile.link_code ? (
              <div className="p-4 bg-muted rounded-md font-mono text-center text-lg">
                {profile.link_code}
              </div>
            ) : (
              <p>No link code available. Please contact support.</p>
            )}
          </section>
        )}
        
        {!profile && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Loading profile data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonManagement;
