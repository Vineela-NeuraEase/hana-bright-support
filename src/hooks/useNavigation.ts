
import { Home, CheckSquare, Calendar, BookText, RadioTower, Cog, UserCircle } from "lucide-react";

export type NavigationItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
};

// Main navigation for the sidebar/hamburger menu
export const useNavigation = (role: string | undefined) => {
  const commonItems: NavigationItem[] = [
    { title: "Home", icon: Home, url: "/dashboard" },
    { title: "Settings", icon: Cog, url: "/settings" },
  ];

  if (!role) return commonItems;

  switch (role) {
    case 'autistic':
      return [
        ...commonItems,
      ];
    case 'caregiver':
      return [
        ...commonItems,
        { title: "Care Dashboard", icon: UserCircle, url: "/care" },
      ];
    case 'clinician':
      return [
        ...commonItems,
        { title: "Clinician Portal", icon: UserCircle, url: "/portal" },
      ];
    default:
      return commonItems;
  }
};

// Get the tools for each role (for the dashboard home page)
export const useTools = (role: string | undefined) => {
  if (!role) return [];

  switch (role) {
    case 'autistic':
      return [
        { title: "Tasks", icon: CheckSquare, url: "/tasks", description: "Manage and organize your tasks" },
        { title: "Schedule", icon: Calendar, url: "/schedule", description: "View and update your daily schedule" },
        { title: "Journal", icon: BookText, url: "/journal", description: "Record your thoughts and feelings" },
        { title: "Communication Tools", icon: RadioTower, url: "/dashboard/tools", description: "Access tools for communication support" }
      ];
    case 'caregiver':
      return [
        { title: "Care Dashboard", icon: UserCircle, url: "/care", description: "Monitor care routines and schedules" },
        { title: "Communication Tools", icon: RadioTower, url: "/dashboard/tools", description: "Access tools for communication support" }
      ];
    case 'clinician':
      return [
        { title: "Clinician Portal", icon: UserCircle, url: "/portal", description: "Manage patient information and progress" },
        { title: "Communication Tools", icon: RadioTower, url: "/dashboard/tools", description: "Access tools for communication support" }
      ];
    default:
      return [
        { title: "Communication Tools", icon: RadioTower, url: "/dashboard/tools", description: "Access tools for communication support" }
      ];
  }
};
