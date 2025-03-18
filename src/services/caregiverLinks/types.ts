
import { Session } from "@supabase/supabase-js";

export type LinkedUser = {
  id: string;
  linkId: string;
  email?: string;
};

export type CaregiverLinksState = {
  linkCode: string;
  isLinking: boolean;
  linkedUsers: LinkedUser[];
  selectedUserId: string | null;
  loading: boolean;
};

export type FetchLinkedUsersResult = {
  linkedUsers: LinkedUser[];
};

export type LinkUserResult = {
  success: boolean;
  message: string;
  newLink?: {
    id: string;
    user_id: string;
  };
};

export type UnlinkUserResult = {
  success: boolean;
  message: string;
};

// Add the missing SimplifiedSession type
export type SimplifiedSession = Pick<Session, 'user'>;
