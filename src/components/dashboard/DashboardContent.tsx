
import { Link } from "react-router-dom";
import { Calendar, CheckSquare, BookText, RadioTower, MessageSquare, Users, LinkIcon } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { EncouragementList } from "@/components/messages/EncouragementList";
import { Profile, LinkedUser } from "@/hooks/useProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
            <Link to="/people" className="text-sm text-primary hover:underline">
              Go to People Management
            </Link>
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
            You are connected with the following people:
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
                    <Link 
                      to={`/dashboard?viewAs=${user.id}`} 
                      className="text-sm text-primary hover:underline"
                    >
                      View Dashboard
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Link to="/people" className="text-sm text-primary hover:underline">
              Manage Connections
            </Link>
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
            <Link to="/people" className="text-sm text-primary hover:underline">
              Manage Your Link Code
            </Link>
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
            The following caregivers can access your information:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Link Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {caregivers.map((caregiver) => (
                <TableRow key={caregiver.id}>
                  <TableCell>
                    <Badge variant="outline">{caregiver.role}</Badge>
                  </TableCell>
                  <TableCell>{caregiver.link_code || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Link to="/people" className="text-sm text-primary hover:underline">
              Manage Connections
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex-1 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">{welcomeMessage}</h1>
        
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
