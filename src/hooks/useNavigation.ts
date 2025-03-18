
import { Settings, Home, PieChart, User, UserCog } from "lucide-react";

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

export const useNavigation = (role?: string): NavigationItem[] => {
  const defaultItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
  ];

  // Add role-specific navigation items
  switch (role) {
    case "autistic":
      return [
        ...defaultItems,
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        }
      ];
    case "caregiver":
      return [
        ...defaultItems,
        {
          title: "Patient Management",
          url: "/patients",
          icon: User,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        }
      ];
    case "clinician":
      return [
        ...defaultItems,
        {
          title: "Patient Analytics",
          url: "/analytics",
          icon: PieChart,
        },
        {
          title: "Patient Management",
          url: "/patients",
          icon: UserCog,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        }
      ];
    default:
      return [
        ...defaultItems,
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        }
      ];
  }
};
