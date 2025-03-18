
import { Home, CheckSquare, Calendar, BookText, RadioTower, Cog, UserCircle } from "lucide-react";

export type NavigationItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
};

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
        { title: "Tasks", icon: CheckSquare, url: "/tasks" },
        { title: "Schedule", icon: Calendar, url: "/schedule" },
        { title: "Journal", icon: BookText, url: "/journal" },
        { title: "Communication Tools", icon: RadioTower, url: "/dashboard/tools" },
      ];
    case 'caregiver':
      return [
        ...commonItems,
        { title: "Care Dashboard", icon: UserCircle, url: "/care" },
        { title: "Communication Tools", icon: RadioTower, url: "/dashboard/tools" },
      ];
    case 'clinician':
      return [
        ...commonItems,
        { title: "Clinician Portal", icon: UserCircle, url: "/portal" },
        { title: "Communication Tools", icon: RadioTower, url: "/dashboard/tools" },
      ];
    default:
      return commonItems;
  }
};
