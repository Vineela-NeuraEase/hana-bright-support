
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Profile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Copy, Link } from "lucide-react";
import { toast } from "sonner";

interface MyLinkCodeProps {
  profile: Profile | null;
}

export const MyLinkCode = ({ profile }: MyLinkCodeProps) => {
  if (!profile) {
    console.log("MyLinkCode: No profile provided");
    return null;
  }
  
  console.log("MyLinkCode profile:", profile);
  console.log("MyLinkCode role:", profile.role);
  console.log("MyLinkCode link_code:", profile.link_code);
  
  const copyToClipboard = () => {
    if (profile.link_code) {
      navigator.clipboard.writeText(profile.link_code);
      toast.success("Link code copied to clipboard!");
    }
  };

  if (!profile.link_code) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5 text-primary" />
            Your Link Code
          </CardTitle>
          <CardDescription>
            No link code is currently available for your account. Please contact support.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5 text-primary" />
          Your Link Code
        </CardTitle>
        <CardDescription>
          Share this code with caregivers if you want them to link to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="p-4 bg-muted rounded-md font-mono text-center text-lg flex-1">
            {profile.link_code}
          </div>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={copyToClipboard}
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Keep this code private and only share with trusted caregivers.
      </CardFooter>
    </Card>
  );
};
