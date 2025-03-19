
export type Profile = {
  id: string;
  role: 'autistic' | 'caregiver' | 'clinician';
  link_code?: string;
  linkedUsers?: LinkedUser[];
};

export type LinkedUser = {
  id: string;
  role: string;
  link_code?: string;
};
