
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Profile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface MyLinkCodeProps {
  profile: Profile | null;
}

export const MyLinkCode = ({ profile }: MyLinkCodeProps) => {
  if (!profile) return null;
  
  const copyToClipboard = () => {
    if (profile.link_code) {
      navigator.clipboard.writeText(profile.link_code);
      toast.success("Link code copied to clipboard!");
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Your Link Code</CardTitle>
        <CardDescription>
          Share this code with caregivers if you want them to link to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="p-4 bg-muted rounded-md font-mono text-center text-lg flex-1">
            {profile.link_code || "No link code available"}
          </div>
          {profile.link_code && (
            <Button 
              size="icon" 
              variant="outline" 
              onClick={copyToClipboard}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Keep this code private and only share with trusted caregivers.
      </CardFooter>
    </Card>
  );
};
