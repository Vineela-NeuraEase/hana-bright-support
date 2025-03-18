
import { supabase } from "@/integrations/supabase/client";
import { 
  LinkedUser, 
  FetchLinkedUsersResult,
  LinkUserResult,
  UnlinkUserResult
} from "./types";

// Define a simplified session type for our mock auth system
export type SimplifiedSession = {
  user: {
    id: string;
    email: string;
  }
}

// Fetch all users linked to the caregiver
export const fetchLinkedUsers = async (
  session: SimplifiedSession | null
): Promise<FetchLinkedUsersResult> => {
  if (!session) {
    return { linkedUsers: [] };
  }

  // Since we're in guest mode, return mock data
  return { 
    linkedUsers: [] 
  };
};

// Link a caregiver to a user using the link code
export const linkUserWithCode = async (
  linkCode: string, 
  session: SimplifiedSession | null
): Promise<LinkUserResult> => {
  if (!linkCode.trim() || !session) {
    return {
      success: false,
      message: "Missing link code or not authenticated"
    };
  }

  // In guest mode, pretend linking was successful
  return {
    success: true,
    message: "Successfully linked with the user (demo mode)",
    newLink: {
      id: "mock-link-id",
      user_id: "mock-user-id"
    }
  };
};

// Unlink a user from the caregiver
export const unlinkUser = async (
  linkId: string,
  session: SimplifiedSession | null
): Promise<UnlinkUserResult> => {
  if (!session || !linkId) {
    return {
      success: false,
      message: "Missing link id or not authenticated"
    };
  }

  // In guest mode, pretend unlinking was successful
  return {
    success: true,
    message: "User has been unlinked (demo mode)"
  };
};
