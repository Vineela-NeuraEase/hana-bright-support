
import { supabase } from "@/integrations/supabase/client";
import { 
  LinkedUser, 
  FetchLinkedUsersResult,
  LinkUserResult,
  UnlinkUserResult
} from "./types";
import { Session } from "@supabase/supabase-js";

// Fetch all users linked to the caregiver
export const fetchLinkedUsers = async (
  session: Session | null
): Promise<FetchLinkedUsersResult> => {
  if (!session) {
    return { linkedUsers: [] };
  }

  try {
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

    return { linkedUsers: usersWithEmails };
  } catch (error) {
    console.error("Error fetching linked users:", error);
    throw error;
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
    // Find user with the provided link code
    const { data: userData, error: userError } = await supabase
      .from("user_links")
      .select("user_id")
      .eq("link_code", linkCode)
      .single();

    if (userError) {
      return {
        success: false,
        message: "The link code you entered is invalid or doesn't exist"
      };
    }

    // Check if already linked
    const { data: existingLink } = await supabase
      .from("caregiver_links")
      .select("id")
      .eq("caregiver_id", session.user.id)
      .eq("user_id", userData.user_id)
      .maybeSingle();

    if (existingLink) {
      return {
        success: false,
        message: "You are already linked to this user"
      };
    }

    // Create the link
    const { error: linkError } = await supabase
      .from("caregiver_links")
      .insert([
        { user_id: userData.user_id, caregiver_id: session.user.id },
      ]);

    if (linkError) throw linkError;

    // Fetch the newly created link
    const { data: newLink } = await supabase
      .from("caregiver_links")
      .select("id, user_id")
      .eq("caregiver_id", session.user.id)
      .eq("user_id", userData.user_id)
      .single();

    return {
      success: true,
      message: "Successfully linked with the user",
      newLink: newLink || undefined
    };
  } catch (error) {
    console.error("Error linking user:", error);
    throw error;
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
    const { error } = await supabase
      .from("caregiver_links")
      .delete()
      .eq("id", linkId)
      .eq("caregiver_id", session.user.id);

    if (error) throw error;

    return {
      success: true,
      message: "User has been unlinked"
    };
  } catch (error) {
    console.error("Error unlinking user:", error);
    throw error;
  }
};
