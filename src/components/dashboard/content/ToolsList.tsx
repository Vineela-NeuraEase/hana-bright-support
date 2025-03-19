
import { Link } from "react-router-dom";
import { Calendar, CheckSquare, BookText, RadioTower, MessageSquare, Users } from "lucide-react";
import { Profile } from "@/hooks/profile/types";

interface ToolsListProps {
  profile: Profile | null;
}

export const ToolsList = ({ profile }: ToolsListProps) => {
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
  
  return (
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
  );
};
