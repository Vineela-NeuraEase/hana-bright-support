
import { Settings, Home, PieChart, User, UserCog, BookText } from "lucide-react";
import { NavigationItem } from "@/types/navigation";

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
          title: "Journal",
          url: "/journal",
          icon: BookText,
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
          title: "Person Management",
          url: "/people",
          icon: User,
        },
        {
          title: "Journal",
          url: "/journal",
          icon: BookText,
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
          title: "Person Analytics",
          url: "/analytics",
          icon: PieChart,
        },
        {
          title: "Person Management",
          url: "/people",
          icon: UserCog,
        },
        {
          title: "Journal",
          url: "/journal",
          icon: BookText,
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
          title: "Settings",
          url: "/settings",
          icon: Settings,
        }
      ];
  }
};
