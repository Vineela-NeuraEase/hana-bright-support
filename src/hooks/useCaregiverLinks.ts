
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type LinkedUser = {
  id: string;
  linkId: string;
  email?: string;
};

export const useCaregiverLinks = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [linkCode, setLinkCode] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [linkedUsers, setLinkedUsers] = useState<LinkedUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  return {
    linkCode,
    setLinkCode,
    isLinking,
    linkedUsers,
    selectedUserId,
    setSelectedUserId,
    loading,
    handleLinkUser,
    handleUnlinkUser
  };
};
