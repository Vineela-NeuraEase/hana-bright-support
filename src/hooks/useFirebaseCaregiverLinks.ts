
import { useState, useEffect } from "react";
import { useAuth } from "@/components/FirebaseAuthProvider";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchLinkedUsers,
  linkUserWithCode,
  unlinkUser
} from "@/services/caregiverLinks/firebaseService";
import { LinkedUser } from "@/services/caregiverLinks/types";

export type { LinkedUser };

export const useCaregiverLinks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [linkCode, setLinkCode] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [linkedUsers, setLinkedUsers] = useState<LinkedUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch linked users
  useEffect(() => {
    const loadLinkedUsers = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const result = await fetchLinkedUsers(user);
        setLinkedUsers(result.linkedUsers);
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

    loadLinkedUsers();
  }, [user, toast]);

  // Handle linking with a link code
  const handleLinkUser = async () => {
    if (!linkCode.trim() || !user) return;

    try {
      setIsLinking(true);

      const result = await linkUserWithCode(linkCode, user);

      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });

      if (result.success && result.newLink) {
        setLinkedUsers([...linkedUsers, {
          id: result.newLink.user_id,
          linkId: result.newLink.id,
          email: `User ${result.newLink.user_id.slice(0, 8)}...`
        }]);
      }

      // Clear the link code if successful
      if (result.success) {
        setLinkCode("");
      }
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
    if (!user || !linkId) return;

    if (!confirm("Are you sure you want to unlink this user?")) {
      return;
    }

    try {
      const result = await unlinkUser(linkId, user);

      if (result.success) {
        const userToRemove = linkedUsers.find(user => user.linkId === linkId);
        setLinkedUsers(linkedUsers.filter(user => user.linkId !== linkId));

        // If the unlinked user was selected, deselect it
        if (selectedUserId && userToRemove && userToRemove.id === selectedUserId) {
          setSelectedUserId(null);
        }

        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to unlink user",
          variant: "destructive",
        });
      }
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
