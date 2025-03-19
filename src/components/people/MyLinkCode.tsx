
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Profile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Copy, Link, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MyLinkCodeProps {
  profile: Profile | null;
}

export const MyLinkCode = ({ profile }: MyLinkCodeProps) => {
  const { toast } = useToast();
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  if (!profile) {
    return null;
  }
  
  const copyToClipboard = () => {
    if (profile.link_code) {
      navigator.clipboard.writeText(profile.link_code);
      toast({
        title: "Success", 
        description: "Link code copied to clipboard"
      });
    }
  };

  const regenerateLinkCode = async () => {
    if (!profile.id) return;
    
    setIsRegenerating(true);
    try {
      // Use a POST request to call the function directly
      // This avoids TypeScript errors with rpc() function names
      const { error } = await supabase.functions.invoke('regenerate-link-code', {
        body: { userId: profile.id }
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your link code has been regenerated. Please refresh the page to see it."
      });

      // Force refresh page to show new code
      window.location.reload();
    } catch (error: any) {
      console.error('Error regenerating link code:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to regenerate link code"
      });
    } finally {
      setIsRegenerating(false);
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
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Keep this code private and only share with trusted caregivers.
        </span>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={regenerateLinkCode}
          disabled={isRegenerating}
        >
          {isRegenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
