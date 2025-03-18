
export interface UserLink {
  id: string;
  user_id: string;
  link_code: string;
  created_at: string;
}

export interface CaregiverLink {
  id: string;
  caregiver_id: string;
  user_id: string;
  created_at: string;
}

export interface LinkedUser {
  id: string;
  profile: {
    id: string;
    role: 'autistic' | 'caregiver' | 'clinician';
  };
}
