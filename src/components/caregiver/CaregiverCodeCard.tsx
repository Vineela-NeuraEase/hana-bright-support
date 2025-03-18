
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LinkIcon } from "lucide-react";
import { useUserLinkCode } from "@/hooks/useCaregiverLinks";
import { toast } from "sonner";

interface CaregiverCodeCardProps {
  userId: string;
}

export const CaregiverCodeCard = ({ userId }: CaregiverCodeCardProps) => {
  const { data: userLinkCode, isLoading: linkCodeLoading } = useUserLinkCode(userId);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <LinkIcon className="mr-2 h-5 w-5" />
          Your Link Code
        </CardTitle>
        <CardDescription>
          Share this code if you need to be linked as an individual.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {linkCodeLoading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin h-4 w-4" />
          </div>
        ) : userLinkCode ? (
          <div className="flex items-center justify-between bg-muted p-3 rounded-md">
            <span className="font-mono font-bold">{userLinkCode}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(userLinkCode);
                toast.success("Link code copied to clipboard");
              }}
            >
              Copy
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground">No link code available</p>
        )}
      </CardContent>
    </Card>
  );
};
