import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { LinkCodeForm } from "@/components/people/LinkCodeForm";
import { LinkedUsersList } from "@/components/people/LinkedUsersList";
import { MyLinkCode } from "@/components/people/MyLinkCode";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TaskMonitoring } from "@/components/caregiver/TaskMonitoring";
import { SharedCalendar } from "@/components/caregiver/SharedCalendar";
import { EncouragementMessage } from "@/components/caregiver/EncouragementMessage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PersonManagement = () => {
  const { session } = useAuth();
  const { profile, loading, linkedUsers, linkedUsersLoading, refetchLinkedUsers } = useProfile(session);
  const { toast } = useToast();
  
  const [viewSection, setViewSection] = useState<"list" | "tasks" | "calendar" | "encourage">("list");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  const handleViewDashboard = (userId: string) => {
    navigate(`/dashboard?viewAs=${userId}`);
  };
  
  const handleUnlink = async (userId: string) => {
    if (!session) return;
    
    try {
      // Delete the caregiver_link entry
      const { error } = await supabase
        .from('caregiver_links')
        .delete()
        .match({ caregiver_id: session.user.id, user_id: userId });
      
      if (error) throw error;
      
      toast({
        title: "Unlinked successfully",
        description: "The user has been unlinked from your account."
      });
      
      // Refresh the list of linked users
      if (refetchLinkedUsers) refetchLinkedUsers();
    } catch (error) {
      console.error("Error unlinking user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to unlink the user. Please try again."
      });
    }
  };
  
  const handleViewTasks = (userId: string) => {
    setSelectedUserId(userId);
    setViewSection("tasks");
  };
  
  const handleViewCalendar = (userId: string) => {
    setSelectedUserId(userId);
    setViewSection("calendar");
  };
  
  const handleSendEncouragement = (userId: string) => {
    setSelectedUserId(userId);
    setViewSection("encourage");
  };
  
  const renderContent = () => {
    if (viewSection === "list") {
      return (
        <div className="space-y-8">
          <MyLinkCode profile={profile} />
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Link to a Person</h2>
            <LinkCodeForm session={session} onSuccess={refetchLinkedUsers} />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Linked People</h2>
            <LinkedUsersList 
              linkedUsers={linkedUsers || []} 
              isLoading={linkedUsersLoading}
              onViewDashboard={handleViewDashboard}
              onUnlink={handleUnlink}
              onViewTasks={handleViewTasks}
              onViewCalendar={handleViewCalendar}
              onSendEncouragement={handleSendEncouragement}
            />
          </div>
        </div>
      );
    }
    
    if (!selectedUserId) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            No user selected. Please select a user first.
          </CardContent>
        </Card>
      );
    }
    
    if (viewSection === "tasks") {
      return (
        <div>
          <Button 
            variant="outline" 
            onClick={() => setViewSection("list")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Linked People
          </Button>
          <TaskMonitoring userId={selectedUserId} />
        </div>
      );
    }
    
    if (viewSection === "calendar") {
      return (
        <div>
          <Button 
            variant="outline" 
            onClick={() => setViewSection("list")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Linked People
          </Button>
          <SharedCalendar userId={selectedUserId} />
        </div>
      );
    }
    
    if (viewSection === "encourage") {
      return (
        <div>
          <Button 
            variant="outline" 
            onClick={() => setViewSection("list")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Linked People
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Send Encouragement</CardTitle>
              <CardDescription>
                Send a supportive message to this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EncouragementMessage userId={selectedUserId} />
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Container>
      <div className="py-8">
        <h1 className="text-2xl font-bold mb-6">Person Management</h1>
        {renderContent()}
      </div>
    </Container>
  );
};

export default PersonManagement;
