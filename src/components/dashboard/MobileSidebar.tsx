
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { NavigationItem } from "@/types/navigation";

interface MobileSidebarProps {
  navigationItems: NavigationItem[];
  onSignOut: () => void;
}

export const MobileSidebar = ({ navigationItems, onSignOut }: MobileSidebarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the menu when the location changes (user navigates to a new page)
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] p-0">
        {/* Removed the title div that was here */}
        <div className="py-4">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className="flex items-center gap-3 px-4 py-2 hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
