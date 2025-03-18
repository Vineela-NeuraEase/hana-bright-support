
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { LinkCodeCard } from "@/components/caregiver/LinkCodeCard";
import { CaregiverCodeCard } from "@/components/caregiver/CaregiverCodeCard";
import { LinkedUsersList } from "@/components/caregiver/LinkedUsersList";
import { NoUserSelected } from "@/components/caregiver/NoUserSelected";
import { UserContentTabs } from "@/components/caregiver/UserContentTabs";
import { AccessDeniedCard } from "@/components/caregiver/AccessDeniedCard";

const CaregiverDashboard = () => {
  const { session } = useAuth();
  const { profile, loading: profileLoading } = useProfile(session);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Check if user is a caregiver
  if (profile && profile.role !== 'caregiver') {
    return <AccessDeniedCard />;
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId === selectedUserId ? null : userId);
  };

  if (profileLoading) {
    return (
      <div className="container py-8 max-w-4xl mx-auto flex justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Caregiver Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar - User list and linking */}
        <div className="md:col-span-1 space-y-4">
          <LinkCodeCard session={session} />
          <CaregiverCodeCard userId={session?.user.id || ""} />
          <LinkedUsersList 
            userId={session?.user.id || ""} 
            selectedUserId={selectedUserId} 
            onSelectUser={handleSelectUser} 
          />
        </div>
        
        {/* Right panel - Content for selected user */}
        <div className="md:col-span-2">
          {selectedUserId ? (
            <UserContentTabs userId={selectedUserId} />
          ) : (
            <NoUserSelected />
          )}
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboard;
