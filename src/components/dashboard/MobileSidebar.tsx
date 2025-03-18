
import { Link } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationItem } from "@/types/navigation";

interface MobileSidebarProps {
  navigationItems: NavigationItem[];
  onSignOut: () => void;
}

export const MobileSidebar = ({ navigationItems, onSignOut }: MobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] p-0">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Hana</h2>
        </div>
        <div className="py-4">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
        <div className="p-4 mt-auto border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2" 
            onClick={onSignOut}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
