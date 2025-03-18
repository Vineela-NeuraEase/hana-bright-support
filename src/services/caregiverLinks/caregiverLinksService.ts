import { supabase } from "@/integrations/supabase/client";
import { 
  LinkedUser, 
  FetchLinkedUsersResult,
  LinkUserResult,
  UnlinkUserResult,
  SimplifiedSession
} from "./types";
import { Session } from "@supabase/supabase-js";

// Export SimplifiedSession type for use in hooks
export type { SimplifiedSession };

// Fetch all users linked to the caregiver
export const fetchLinkedUsers = async (
  session: Session | null
): Promise<FetchLinkedUsersResult> => {
  if (!session) {
    return { linkedUsers: [] };
  }

  try {
    // Get all caregiver links where the current user is the caregiver
    const { data: links, error } = await supabase
      .from('caregiver_links')
      .select('id, user_id')
      .eq('caregiver_id', session.user.id);

    if (error) throw error;

    const linkedUsers: LinkedUser[] = [];

    // For each linked user, get their email from auth.users (if possible) or just use the ID
    for (const link of links || []) {
      try {
        // Try to get the user's profile information
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', link.user_id)
          .single();

        // Add to the linked users array
        linkedUsers.push({
          id: link.user_id,
          linkId: link.id,
          email: `User ${link.user_id.slice(0, 8)}...` // Just use a shortened ID for display
        });
      } catch (err) {
        console.error("Error fetching linked user details:", err);
      }
    }

    return { linkedUsers };
  } catch (error) {
    console.error("Error in fetchLinkedUsers:", error);
    return { linkedUsers: [] };
  }
};

// Link a caregiver to a user using the link code
export const linkUserWithCode = async (
  linkCode: string, 
  session: Session | null
): Promise<LinkUserResult> => {
  if (!linkCode.trim() || !session) {
    return {
      success: false,
      message: "Missing link code or not authenticated"
    };
  }

  try {
    // Find the user with this link code
    const { data: linkData, error: linkError } = await supabase
      .from('user_links')
      .select('user_id, link_code')
      .eq('link_code', linkCode)
      .single();

    if (linkError || !linkData) {
      return {
        success: false,
        message: "Invalid link code or user not found"
      };
    }

    // Check if this link already exists
    const { data: existingLink, error: checkError } = await supabase
      .from('caregiver_links')
      .select('id')
      .eq('caregiver_id', session.user.id)
      .eq('user_id', linkData.user_id)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingLink) {
      return {
        success: false,
        message: "You are already linked to this user"
      };
    }

    // Create the caregiver link
    const { data: newLink, error: insertError } = await supabase
      .from('caregiver_links')
      .insert([
        { 
          caregiver_id: session.user.id,
          user_id: linkData.user_id 
        }
      ])
      .select('id')
      .single();

    if (insertError) throw insertError;

    return {
      success: true,
      message: "Successfully linked with the user",
      newLink: {
        id: newLink.id,
        user_id: linkData.user_id
      }
    };
  } catch (error) {
    console.error("Error in linkUserWithCode:", error);
    return {
      success: false,
      message: "Error linking with user. Please try again."
    };
  }
};

// Unlink a user from the caregiver
export const unlinkUser = async (
  linkId: string,
  session: Session | null
): Promise<UnlinkUserResult> => {
  if (!session || !linkId) {
    return {
      success: false,
      message: "Missing link id or not authenticated"
    };
  }

  try {
    // Ensure the caregiver owns this link before deleting
    const { error } = await supabase
      .from('caregiver_links')
      .delete()
      .eq('id', linkId)
      .eq('caregiver_id', session.user.id);

    if (error) throw error;

    return {
      success: true,
      message: "User has been unlinked successfully"
    };
  } catch (error) {
    console.error("Error unlinking user:", error);
    return {
      success: false,
      message: "Error unlinking user. Please try again."
    };
  }
};
