
export interface LinkedUser {
  id: string;
  linkId: string;
  email: string;
}

export interface FetchLinkedUsersResult {
  linkedUsers: LinkedUser[];
}

export interface LinkUserResult {
  success: boolean;
  message: string;
  newLink?: {
    id: string;
    user_id: string;
  };
}

export interface UnlinkUserResult {
  success: boolean;
  message: string;
}
