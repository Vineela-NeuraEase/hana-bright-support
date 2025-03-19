
import { Link } from "react-router-dom";
import { LinkIcon, AlertCircle } from "lucide-react";
import { LinkedUser } from "@/hooks/profile/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CaregiverConnectionsListProps {
  caregivers: LinkedUser[];
}

export const CaregiverConnectionsList = ({ caregivers }: CaregiverConnectionsListProps) => {
  if (!caregivers || caregivers.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <LinkIcon className="h-5 w-5 mr-2 text-primary" />
            Your Caregivers
          </CardTitle>
          <CardDescription>
            You are not connected to any caregivers yet. Share your link code with caregivers to connect.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              Share your link code with trusted caregivers to allow them to support you.
            </AlertDescription>
          </Alert>
          <Button asChild variant="default" size="sm">
            <Link to="/people">
              Manage Your Link Code
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
          Your Caregivers
        </CardTitle>
        <CardDescription>
          The following caregivers are connected to you and can access your information:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {caregivers.map((caregiver) => (
              <TableRow key={caregiver.id}>
                <TableCell>
                  <Badge variant="outline">{caregiver.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    Connected
                  </Badge>
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
