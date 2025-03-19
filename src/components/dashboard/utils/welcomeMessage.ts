
export const getWelcomeMessage = (profile: any | null, viewingUserProfile: any | null) => {
  if (viewingUserProfile) {
    return `Viewing Dashboard for ${viewingUserProfile.role === 'autistic' ? 'Individual' : viewingUserProfile.role} (Role: ${viewingUserProfile.role})`;
  }
  
  if (!profile) return "Welcome to Hannah";
  switch (profile.role) {
    case 'autistic':
      return "Your personal support companion";
    case 'caregiver':
      return "Care management dashboard";
    case 'clinician':
      return "Clinical management portal";
    default:
      return "Welcome to Hannah";
  }
};
