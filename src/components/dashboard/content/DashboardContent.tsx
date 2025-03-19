
import { Profile, LinkedUser } from "@/hooks/profile/types";
import { EncouragementList } from "@/components/messages/EncouragementList";
import { ToolsList } from "./ToolsList";
import { LinkedUsersList } from "./LinkedUsersList";
import { CaregiverConnectionsList } from "./CaregiverConnectionsList";

interface DashboardContentProps {
  welcomeMessage: string;
  profile: Profile | null;
  linkedUsers?: LinkedUser[];
  caregivers?: LinkedUser[];
}

export const DashboardContent = ({ 
  welcomeMessage, 
  profile, 
  linkedUsers = [], 
  caregivers = [] 
}: DashboardContentProps) => {
  return (
    <div className="flex-1 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">{welcomeMessage}</h1>
        
        {/* Connection Information Sections */}
        {profile?.role === 'caregiver' && <LinkedUsersList linkedUsers={linkedUsers} />}
        {profile?.role === 'autistic' && <CaregiverConnectionsList caregivers={caregivers} />}
        
        {/* Only show messages for autistic users */}
        {profile?.role === 'autistic' && (
          <div className="mb-6">
            <EncouragementList />
          </div>
        )}
        
        <ToolsList profile={profile} />
      </div>
    </div>
  );
};
