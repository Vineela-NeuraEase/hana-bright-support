
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
  user_profile?: {
    id: string;
    role: 'autistic' | 'caregiver' | 'clinician';
  };
}

export interface LinkedUser {
  id: string;
  profile: {
    id: string;
    role: 'autistic' | 'caregiver' | 'clinician';
  };
}
