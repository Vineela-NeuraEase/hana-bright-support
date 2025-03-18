
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trash2, Loader2 } from "lucide-react";
import { CaregiverLink } from "@/types/caregiver";
import { useCaregiverLinks, useRemoveCaregiverLink } from "@/hooks/useCaregiverLinks";

interface LinkedUsersListProps {
  userId: string;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

export const LinkedUsersList = ({ userId, selectedUserId, onSelectUser }: LinkedUsersListProps) => {
  const { data: caregiverLinks, isLoading: linksLoading } = useCaregiverLinks(userId);
  const { mutate: removeLink, isPending: isRemovingLink } = useRemoveCaregiverLink();
  
  const handleRemoveLink = (link: CaregiverLink, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRemovingLink) return;
    
    if (window.confirm("Are you sure you want to remove this link?")) {
      removeLink({ 
        linkId: link.id, 
        caregiverId: userId 
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Linked Individuals
        </CardTitle>
        <CardDescription>
          Individuals you are connected with.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {linksLoading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin h-4 w-4" />
          </div>
        ) : caregiverLinks?.length ? (
          <ul className="space-y-2">
            {caregiverLinks.map(link => (
              <li 
                key={link.id} 
                className={`
                  flex justify-between items-center p-3 rounded-md cursor-pointer
                  ${selectedUserId === link.user_id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}
                `}
                onClick={() => onSelectUser(link.user_id)}
              >
                <span>User {link.user_id.substring(0, 8)}...</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={`${selectedUserId === link.user_id ? 'hover:bg-primary/90' : ''}`}
                  onClick={(e) => handleRemoveLink(link, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No linked individuals yet.</p>
        )}
      </CardContent>
    </Card>
  );
};
