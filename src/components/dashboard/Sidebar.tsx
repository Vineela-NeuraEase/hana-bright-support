
import { Home, CheckSquare, Calendar, BookText, RadioTower, Cog, LogOut, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

type NavigationItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
};

interface SidebarProps {
  navigationItems: NavigationItem[];
  onSignOut: () => void;
}

export const Sidebar = ({ navigationItems, onSignOut }: SidebarProps) => {
  return (
    <SidebarComponent className="hidden md:flex">
      <SidebarHeader className="flex items-center justify-between p-4">
        <h2 className="text-xl font-bold">Hana</h2>
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
      <div className="mt-auto p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2" 
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </SidebarComponent>
  );
};
