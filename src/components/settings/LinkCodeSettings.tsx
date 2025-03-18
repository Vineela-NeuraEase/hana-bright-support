
import { useUserLinkCode } from "@/hooks/useCaregiverLinks";
import { useGenerateUserLinkCode } from "@/hooks/useGenerateUserLinkCode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkIcon, Loader2, Copy, RefreshCw } from "lucide-react";
import { toast } from 'sonner';

interface LinkCodeSettingsProps {
  userId: string;
}

export const LinkCodeSettings = ({ userId }: LinkCodeSettingsProps) => {
  const { data: linkCode, isLoading, refetch } = useUserLinkCode(userId);
  const { mutate: generateLinkCode, isPending: isGenerating } = useGenerateUserLinkCode();

  const handleCopyLinkCode = () => {
    if (linkCode) {
      navigator.clipboard.writeText(linkCode);
      toast.success("Link code copied to clipboard");
    }
  };

  const handleGenerateNewLinkCode = () => {
    if (window.confirm("Creating a new link code will invalidate any previous code. Continue?")) {
      generateLinkCode(userId, {
        onSuccess: () => {
          refetch();
        }
      });
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
        {isLoading || isGenerating ? (
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
      {linkCode && (
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleGenerateNewLinkCode}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
            ) : (
              <><RefreshCw className="h-4 w-4 mr-2" /> Generate New Code</>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
