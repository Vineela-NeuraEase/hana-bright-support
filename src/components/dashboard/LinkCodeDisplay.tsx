
import { toast } from "sonner";
import { Copy, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Profile } from "@/hooks/useProfile";

interface LinkCodeDisplayProps {
  profile: Profile | null;
  viewingUserId: string | null;
}

export const LinkCodeDisplay = ({ profile, viewingUserId }: LinkCodeDisplayProps) => {
  if (!profile || profile.role !== 'autistic' || viewingUserId || !profile.link_code) return null;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profile.link_code!);
    toast.success("Link code copied to clipboard!");
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Link Code</CardTitle>
        <CardDescription>
          Share this code with caregivers to connect your accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription>
            Give this code to trusted caregivers who need to support you. They will use it to link with your account.
          </AlertDescription>
        </Alert>
        <div className="flex items-center gap-2">
          <div className="p-3 bg-muted rounded-md font-mono text-center flex-1">
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
    </Card>
  );
};
