
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckSquare, MessageSquareDiff } from "lucide-react";

interface LinkedUser {
  id: string;
  role: string;
  link_code?: string;
}

interface LinkedUsersListProps {
  linkedUsers: LinkedUser[];
  isLoading: boolean;
  onViewDashboard: (userId: string) => void;
  onUnlink: (userId: string) => void;
  onViewTasks: (userId: string) => void;
  onViewCalendar: (userId: string) => void;
  onSendEncouragement: (userId: string) => void;
}

export const LinkedUsersList = ({ 
  linkedUsers, 
  isLoading, 
  onViewDashboard, 
  onUnlink,
  onViewTasks,
  onViewCalendar,
  onSendEncouragement
}: LinkedUsersListProps) => {
  if (isLoading) {
    return (
      <div className="text-center p-8">Loading linked people...</div>
    );
  }
  
  if (linkedUsers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          You haven't linked to any people yet. Use a link code to connect with someone.
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {linkedUsers.map(user => (
        <Card key={user.id} className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{user.role?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{user.role || 'User'}</h3>
                <p className="text-xs text-muted-foreground">
                  Link Code: {user.link_code || 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <CardContent className="pt-0 pb-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewDashboard(user.id)}
              >
                View Dashboard
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewTasks(user.id)}
                className="inline-flex items-center"
              >
                <CheckSquare className="mr-1 h-4 w-4" />
                Tasks
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewCalendar(user.id)}
                className="inline-flex items-center"
              >
                <CalendarIcon className="mr-1 h-4 w-4" />
                Schedule
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSendEncouragement(user.id)}
                className="inline-flex items-center"
              >
                <MessageSquareDiff className="mr-1 h-4 w-4" />
                Encourage
              </Button>
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onUnlink(user.id)}
              >
                Unlink
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
