
import { Link } from "react-router-dom";
import { LinkIcon, AlertCircle } from "lucide-react";
import { LinkedUser } from "@/hooks/profile/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LinkedUsersListProps {
  linkedUsers: LinkedUser[];
}

export const LinkedUsersList = ({ linkedUsers }: LinkedUsersListProps) => {
  if (!linkedUsers || linkedUsers.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <LinkIcon className="h-5 w-5 mr-2 text-primary" />
            Connected People
          </CardTitle>
          <CardDescription>
            You are not connected to anyone yet. Use a link code to connect with someone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              Use a link code provided by an autistic individual to establish a connection and provide support.
            </AlertDescription>
          </Alert>
          <Button asChild variant="default" size="sm">
            <Link to="/people">
              Go to People Management
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <LinkIcon className="h-5 w-5 mr-2 text-primary" />
          Connected People
        </CardTitle>
        <CardDescription>
          You're connected with the following people and can view their information:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Link Code</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {linkedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell>{user.link_code || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      asChild
                      variant="outline" 
                      size="sm"
                    >
                      <Link to={`/dashboard?viewAs=${user.id}`}>
                        View Dashboard
                      </Link>
                    </Button>
                    <Button 
                      asChild
                      variant="outline" 
                      size="sm"
                    >
                      <Link to={`/tasks?viewAs=${user.id}`}>
                        Tasks
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Button asChild variant="default" size="sm">
            <Link to="/people">
              Manage Connections
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
