
import { useState } from "react";
import { LinkCodeForm } from "@/components/people/LinkCodeForm";
import { LinkedUsersList } from "@/components/people/LinkedUsersList";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { User, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MyLinkCode } from "@/components/people/MyLinkCode";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PersonManagement = () => {
  const { session } = useAuth();
  const { 
    profile, 
    linkedUsers, 
    linkedUsersLoading, 
    error: profileError,
    refetchLinkedUsers 
  } = useProfile(session);
  const [unlinkError, setUnlinkError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLinkSuccess = () => {
    if (refetchLinkedUsers) {
      refetchLinkedUsers();
    }
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
    
    setUnlinkError(null);
    
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
      if (refetchLinkedUsers) {
        refetchLinkedUsers();
      }
      
    } catch (error: any) {
      console.error("Error unlinking person:", error);
      setUnlinkError(error.message || "Failed to unlink person");
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
      
      {profileError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{profileError}</AlertDescription>
        </Alert>
      )}
      
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
                error={unlinkError}
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
            <MyLinkCode profile={profile} />
          </section>
        )}
        
        {!profile && !profileError && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Loading profile data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonManagement;
