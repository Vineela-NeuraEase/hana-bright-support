
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileSidebar } from "./MobileSidebar";
import { Session } from "@supabase/supabase-js";
import { NavigationItem } from "@/types/navigation";
import { useProfile } from "@/hooks/useProfile";
import { Copy } from "lucide-react"; // Fixed import - removed 'clipboard'
import { toast } from "sonner";

interface TopNavigationBarProps {
  session: Session | null;
  navigationItems: NavigationItem[];
  onSignOut: () => void;
}

export const TopNavigationBar = ({ session, navigationItems, onSignOut }: TopNavigationBarProps) => {
  const { profile } = useProfile(session);

  const copyLinkCode = () => {
    if (profile?.link_code) {
      navigator.clipboard.writeText(profile.link_code);
      toast.success("Link code copied to clipboard!");
    } else {
      toast.error("No link code available");
    }
  };

  return (
    <nav className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4 justify-between">
        <div className="flex items-center gap-4">
          <MobileSidebar navigationItems={navigationItems} onSignOut={onSignOut} />
        </div>

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-auto h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {session?.user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            {profile?.link_code && (
              <>
                <DropdownMenuItem onClick={copyLinkCode} className="gap-2 cursor-pointer">
                  <span>Link Code: {profile.link_code}</span>
                  <Copy className="h-4 w-4" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
