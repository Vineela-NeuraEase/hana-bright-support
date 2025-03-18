
import { Link } from "react-router-dom";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavigationItem } from "@/types/navigation";

interface SidebarProps {
  navigationItems: NavigationItem[];
  onSignOut: () => void;
}

export const Sidebar = ({ navigationItems, onSignOut }: SidebarProps) => {
  return (
    <SidebarComponent className="hidden md:flex">
      <SidebarHeader className="flex items-center justify-between p-4">
        {/* Removed the H2 title that was causing duplication */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </SidebarComponent>
  );
};
