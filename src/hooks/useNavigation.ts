
import { Settings, Home, PieChart, User, UserCog, BookText, Calendar, CheckSquare, RadioTower, Users } from "lucide-react";
import { NavigationItem } from "@/types/navigation";

export const useNavigation = (role?: string): NavigationItem[] => {
  const defaultItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: CheckSquare,
    },
    {
      title: "Schedule",
      url: "/schedule",
      icon: Calendar,
    },
  ];

  // Add role-specific navigation items
  switch (role) {
    case "autistic":
      return [
        ...defaultItems,
        {
          title: "Journal",
          url: "/journal",
          icon: BookText,
        },
        {
          title: "Tools",
          url: "/tools",
          icon: RadioTower,
        },
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
          title: "People",
          url: "/people",
          icon: Users,
        },
        {
          title: "Journal",
          url: "/journal",
          icon: BookText,
        },
        {
          title: "Tools",
          url: "/tools",
          icon: RadioTower,
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
          title: "People",
          url: "/people",
          icon: Users,
        },
        {
          title: "Analytics",
          url: "/analytics",
          icon: PieChart,
        },
        {
          title: "Journal",
          url: "/journal",
          icon: BookText,
        },
        {
          title: "Tools",
          url: "/tools",
          icon: RadioTower,
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
          title: "Journal",
          url: "/journal",
          icon: BookText,
        },
        {
          title: "Tools",
          url: "/tools",
          icon: RadioTower,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        }
      ];
  }
};
