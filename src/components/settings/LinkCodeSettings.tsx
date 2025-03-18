
import { useUserLinkCode } from "@/hooks/useCaregiverLinks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkIcon, Loader2, Copy } from "lucide-react";
import { toast } from 'sonner';

interface LinkCodeSettingsProps {
  userId: string;
}

export const LinkCodeSettings = ({ userId }: LinkCodeSettingsProps) => {
  const { data: linkCode, isLoading } = useUserLinkCode(userId);

  const handleCopyLinkCode = () => {
    if (linkCode) {
      navigator.clipboard.writeText(linkCode);
      toast.success("Link code copied to clipboard");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <LinkIcon className="h-5 w-5 mr-2" />
          Your Link Code
        </CardTitle>
        <CardDescription>
          Share this code with caregivers who need to connect with you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : linkCode ? (
          <div className="flex items-center justify-between bg-muted p-3 rounded-md">
            <code className="font-mono font-medium">{linkCode}</code>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyLinkCode}
            >
              <Copy className="h-4 w-4 mr-2" /> Copy
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground">No link code available</p>
        )}
      </CardContent>
    </Card>
  );
};
