
import { Link } from "react-router-dom";
import { Calendar, CheckSquare, BookText, RadioTower, MessageSquare, Users, LinkIcon, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { EncouragementList } from "@/components/messages/EncouragementList";
import { Profile, LinkedUser } from "@/hooks/useProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DashboardContentProps {
  welcomeMessage: string;
  profile: Profile | null;
  linkedUsers?: LinkedUser[];
  caregivers?: LinkedUser[];
}

export const DashboardContent = ({ welcomeMessage, profile, linkedUsers = [], caregivers = [] }: DashboardContentProps) => {
  const { session } = useAuth();

  // Tools available based on user role
  const getToolsForRole = () => {
    if (!profile) return [];

    switch (profile.role) {
      case 'autistic':
        return [
          { title: "Tasks", icon: CheckSquare, url: "/tasks", description: "Manage and organize your tasks" },
          { title: "Schedule", icon: Calendar, url: "/schedule", description: "View and update your daily schedule" },
          { title: "Journal", icon: BookText, url: "/journal", description: "Record your thoughts and feelings" },
          { title: "Messages", icon: MessageSquare, url: "/messages", description: "View encouragement messages from caregivers" },
          { title: "Communication Tools", icon: RadioTower, url: "/tools", description: "Access tools for communication support" }
        ];
      case 'caregiver':
        return [
          { title: "Tasks", icon: CheckSquare, url: "/tasks", description: "Manage and organize tasks" },
          { title: "Schedule", icon: Calendar, url: "/schedule", description: "View and plan schedules" },
          { title: "Communication Tools", icon: RadioTower, url: "/tools", description: "Access tools for communication support" },
          { title: "Journal", icon: BookText, url: "/journal", description: "Track mood and thoughts of those you care for" },
          { title: "People Management", icon: Users, url: "/people", description: "Manage linked users and send encouragement" }
        ];
      case 'clinician':
        return [
          { title: "Tasks", icon: CheckSquare, url: "/tasks", description: "Manage tasks and assignments" },
          { title: "Schedule", icon: Calendar, url: "/schedule", description: "View and manage appointments" },
          { title: "Communication Tools", icon: RadioTower, url: "/tools", description: "Access tools for communication support" },
          { title: "Journal", icon: BookText, url: "/journal", description: "Track patient mood and thoughts" },
          { title: "Person Management", icon: Users, url: "/people", description: "Manage patient information and progress" }
        ];
      default:
        return [
          { title: "Tasks", icon: CheckSquare, url: "/tasks", description: "Manage your tasks" },
          { title: "Schedule", icon: Calendar, url: "/schedule", description: "View your schedule" },
          { title: "Journal", icon: BookText, url: "/journal", description: "Record your thoughts and feelings" },
          { title: "Communication Tools", icon: RadioTower, url: "/tools", description: "Access tools for communication support" }
        ];
    }
  };

  // Render linked users section for caregivers
  const renderLinkedUsers = () => {
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

  // Render linked to caregiver section for autistic individuals
  const renderCaregiverConnections = () => {
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

  return (
    <div className="flex-1 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">{welcomeMessage}</h1>
        
        {/* Link Code Section is now handled in Dashboard.tsx */}
        
        {/* Connection Information Sections */}
        {profile?.role === 'caregiver' && renderLinkedUsers()}
        {profile?.role === 'autistic' && renderCaregiverConnections()}
        
        {/* Only show messages for autistic users */}
        {profile?.role === 'autistic' && (
          <div className="mb-6">
            <EncouragementList />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getToolsForRole().map((tool) => (
            <Link to={tool.url} key={tool.title} className="block">
              <div className="p-4 border rounded-lg hover:bg-muted transition-colors flex items-center gap-3">
                <tool.icon className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="font-medium">{tool.title}</h2>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
