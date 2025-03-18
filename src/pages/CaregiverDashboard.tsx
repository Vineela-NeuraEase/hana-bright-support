
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, UserIcon, AlertCircleIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Components
import { CaregiverLinkCodeCard } from "@/components/caregiver/CaregiverLinkCodeCard";
import { LinkedUsersList } from "@/components/caregiver/LinkedUsersList";
import { NoUserSelected } from "@/components/caregiver/NoUserSelected";
import { UserContentTabs } from "@/components/caregiver/UserContentTabs";
import { AccessDeniedCard } from "@/components/caregiver/AccessDeniedCard";

// Types
type LinkedUser = {
  id: string;
  linkId: string;
  email?: string;
};

const CaregiverDashboard = () => {
  const { session } = useAuth();
  const { profile, loading: profileLoading } = useProfile(session);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [linkCode, setLinkCode] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [linkedUsers, setLinkedUsers] = useState<LinkedUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!session && !profileLoading) {
      navigate("/auth");
    }
  }, [session, profileLoading, navigate]);

  // Redirect if not a caregiver
  useEffect(() => {
    if (profile && profile.role !== "caregiver" && !profileLoading) {
      navigate("/dashboard");
    }
  }, [profile, profileLoading, navigate]);

  // Fetch linked users
  useEffect(() => {
    const fetchLinkedUsers = async () => {
      if (!session) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("caregiver_links")
          .select("id, user_id")
          .eq("caregiver_id", session.user.id);

        if (error) throw error;

        // Fetch emails for each linked user
        const usersWithEmails = await Promise.all(
          data.map(async (link) => {
            // We can't directly fetch auth.users emails, so we'll fetch what we can
            const { data: userData } = await supabase
              .from("profiles")
              .select("id")
              .eq("id", link.user_id)
              .single();

            return {
              id: link.user_id,
              linkId: link.id,
              email: userData ? `User ${userData.id.slice(0, 8)}...` : "Unknown user"
            };
          })
        );

        setLinkedUsers(usersWithEmails);
      } catch (error) {
        console.error("Error fetching linked users:", error);
        toast({
          title: "Error",
          description: "Failed to load linked users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLinkedUsers();
  }, [session, toast]);

  // Handle linking with a link code
  const handleLinkUser = async () => {
    if (!linkCode.trim() || !session) return;

    try {
      setIsLinking(true);

      // Find user with the provided link code
      const { data: userData, error: userError } = await supabase
        .from("user_links")
        .select("user_id")
        .eq("link_code", linkCode)
        .single();

      if (userError) {
        toast({
          title: "Invalid Link Code",
          description: "The link code you entered is invalid or doesn't exist",
          variant: "destructive",
        });
        return;
      }

      // Check if already linked
      const { data: existingLink } = await supabase
        .from("caregiver_links")
        .select("id")
        .eq("caregiver_id", session.user.id)
        .eq("user_id", userData.user_id)
        .maybeSingle();

      if (existingLink) {
        toast({
          title: "Already Linked",
          description: "You are already linked to this user",
        });
        return;
      }

      // Create the link
      const { error: linkError } = await supabase
        .from("caregiver_links")
        .insert([
          { user_id: userData.user_id, caregiver_id: session.user.id },
        ]);

      if (linkError) throw linkError;

      toast({
        title: "Success",
        description: "Successfully linked with the user",
      });

      // Refresh linked users
      const { data: newLink } = await supabase
        .from("caregiver_links")
        .select("id, user_id")
        .eq("caregiver_id", session.user.id)
        .eq("user_id", userData.user_id)
        .single();

      if (newLink) {
        setLinkedUsers([...linkedUsers, {
          id: newLink.user_id,
          linkId: newLink.id,
          email: `User ${newLink.user_id.slice(0, 8)}...`
        }]);
      }

      // Clear the link code
      setLinkCode("");
    } catch (error) {
      console.error("Error linking user:", error);
      toast({
        title: "Error",
        description: "Failed to link with the user",
        variant: "destructive",
      });
    } finally {
      setIsLinking(false);
    }
  };

  // Handle unlinking a user
  const handleUnlinkUser = async (linkId: string) => {
    if (!session || !linkId) return;

    if (!confirm("Are you sure you want to unlink this user?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("caregiver_links")
        .delete()
        .eq("id", linkId)
        .eq("caregiver_id", session.user.id);

      if (error) throw error;

      setLinkedUsers(linkedUsers.filter(user => user.linkId !== linkId));

      // If the unlinked user was selected, deselect it
      if (selectedUserId && linkedUsers.find(u => u.linkId === linkId)?.id === selectedUserId) {
        setSelectedUserId(null);
      }

      toast({
        title: "Success",
        description: "User has been unlinked",
      });
    } catch (error) {
      console.error("Error unlinking user:", error);
      toast({
        title: "Error",
        description: "Failed to unlink user",
        variant: "destructive",
      });
    }
  };

  if (profileLoading || (profile && profile.role !== 'caregiver')) {
    return <div className="container py-6">Loading...</div>;
  }

  if (profile && profile.role !== 'caregiver') {
    return <AccessDeniedCard />;
  }

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Caregiver Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          {/* Link Code Input */}
          <CaregiverLinkCodeCard 
            linkCode={linkCode} 
            setLinkCode={setLinkCode} 
            isLinking={isLinking} 
            handleLinkUser={handleLinkUser} 
          />

          {/* Linked Users List */}
          <LinkedUsersList
            linkedUsers={linkedUsers}
            loading={loading}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            handleUnlinkUser={handleUnlinkUser}
          />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3">
          {selectedUserId ? (
            <UserContentTabs userId={selectedUserId} />
          ) : (
            <NoUserSelected />
          )}
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboard;
