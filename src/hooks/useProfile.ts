
import { useEffect, useState } from 'react';

export type Profile = {
  id: string;
  role: 'autistic' | 'caregiver' | 'clinician';
};

// Create a mock profile for the guest user
const mockProfile = {
  id: "guest-user-id",
  role: "autistic" as const
};

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(mockProfile);
  const [loading, setLoading] = useState(false);

  // Return the mock profile immediately
  return { profile, loading };
};
