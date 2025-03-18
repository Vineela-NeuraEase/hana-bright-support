
import { Settings, Home, PieChart, User, UserCog, BookText, Heart } from "lucide-react";
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
          title: "Caregiver Dashboard",
          url: "/caregiver",
          icon: Heart,
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
