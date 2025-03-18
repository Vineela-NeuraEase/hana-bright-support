
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserIcon, Trash2Icon } from "lucide-react";

interface LinkedUser {
  id: string;
  linkId: string;
  email?: string;
}

interface LinkedUsersListProps {
  linkedUsers: LinkedUser[];
  loading: boolean;
  selectedUserId: string | null;
  setSelectedUserId: (id: string) => void;
  handleUnlinkUser: (linkId: string) => void;
}

export const LinkedUsersList: React.FC<LinkedUsersListProps> = ({
  linkedUsers,
  loading,
  selectedUserId,
  setSelectedUserId,
  handleUnlinkUser
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Linked Users</CardTitle>
        <CardDescription>
          {linkedUsers.length > 0 
            ? "Select a user to view their data" 
            : "No users linked yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="space-y-2">
            {linkedUsers.map((user) => (
              <div 
                key={user.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                  selectedUserId === user.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
              >
                <div 
                  className="flex items-center flex-1"
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm">{user.email || `User ${user.id.slice(0, 8)}...`}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnlinkUser(user.linkId);
                  }}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {linkedUsers.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-2">
                Link with a user using their link code above
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
