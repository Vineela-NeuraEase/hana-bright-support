
import { Link, Routes, Route, useLocation } from "react-router-dom";
import { Calendar, CheckSquare, BookText, RadioTower } from "lucide-react";
import ToolsDirectory from "@/pages/tools/Index";
import FormalizerPage from "@/pages/tools/Formalizer";
import JudgePage from "@/pages/tools/Judge";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/components/AuthProvider";

interface DashboardContentProps {
  welcomeMessage: string;
}

export const DashboardContent = ({ welcomeMessage }: DashboardContentProps) => {
  const { session } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();

  // Only show dashboard home on the root dashboard path
  const isRootDashboard = location.pathname === "/dashboard";

  // Tools available based on user role
  const getToolsForRole = () => {
    if (!profile) return [];

    switch (profile.role) {
      case 'autistic':
        return [
          { title: "Tasks", icon: CheckSquare, url: "/tasks", description: "Manage and organize your tasks" },
          { title: "Schedule", icon: Calendar, url: "/schedule", description: "View and update your daily schedule" },
          { title: "Journal", icon: BookText, url: "/journal", description: "Record your thoughts and feelings" },
          { title: "Communication Tools", icon: RadioTower, url: "/dashboard/tools", description: "Access tools for communication support" }
        ];
      case 'caregiver':
        return [
          { title: "Communication Tools", icon: RadioTower, url: "/dashboard/tools", description: "Access tools for communication support" },
          { title: "Journal", icon: BookText, url: "/journal", description: "Track mood and thoughts of those you care for" },
          { title: "Care Dashboard", icon: CheckSquare, url: "/care", description: "Monitor care routines and schedules" }
        ];
      case 'clinician':
        return [
          { title: "Communication Tools", icon: RadioTower, url: "/dashboard/tools", description: "Access tools for communication support" },
          { title: "Journal", icon: BookText, url: "/journal", description: "Track patient mood and thoughts" },
          { title: "Clinical Portal", icon: CheckSquare, url: "/portal", description: "Manage patient information and progress" }
        ];
      default:
        return [
          { title: "Journal", icon: BookText, url: "/journal", description: "Record your thoughts and feelings" },
          { title: "Communication Tools", icon: RadioTower, url: "/dashboard/tools", description: "Access tools for communication support" }
        ];
    }
  };

  return (
    <div className="flex-1 px-4 py-8">
      <Routes>
        <Route path="/" element={
          <div>
            <h1 className="text-2xl font-bold mb-6">{welcomeMessage}</h1>
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
        } />
        <Route path="tools" element={<ToolsDirectory />} />
        <Route path="tools/formalizer" element={<FormalizerPage />} />
        <Route path="tools/judge" element={<JudgePage />} />
      </Routes>
    </div>
  );
};
