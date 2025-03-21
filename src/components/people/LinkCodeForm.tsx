
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2 } from "lucide-react"; 
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LinkCodeFormProps {
  session: Session | null;
  onSuccess: () => void;
}

export const LinkCodeForm = ({ session, onSuccess }: LinkCodeFormProps) => {
  const [linkCode, setLinkCode] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLinkUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!linkCode.trim() || !session) {
      setError("Please enter a valid link code");
      return;
    }
    
    setIsLinking(true);
    setError(null);
    
    console.log(`Attempting to link with code: ${linkCode}`);
    
    try {
      // Step 1: Find the user with this link code
      const { data: linkData, error: linkError } = await supabase
        .from('user_links')
        .select('user_id')
        .eq('link_code', linkCode)
        .maybeSingle();

      console.log('Link data search result:', linkData, linkError);

      if (linkError) {
        throw linkError;
      }

      if (!linkData || !linkData.user_id) {
        setError("No user found with that link code. Please check and try again.");
        setIsLinking(false);
        return;
      }
      
      console.log(`Found user with ID: ${linkData.user_id}`);

      // Step 2: Check if this link already exists
      const { data: existingLink, error: existingLinkError } = await supabase
        .from('caregiver_links')
        .select('*')
        .eq('caregiver_id', session.user.id)
        .eq('user_id', linkData.user_id)
        .maybeSingle();
        
      console.log('Existing link check result:', existingLink, existingLinkError);
      
      if (existingLinkError && existingLinkError.code !== 'PGRST116') {
        // Only throw if it's not the "no rows returned" error
        throw existingLinkError;
      }
      
      if (existingLink) {
        setError("You are already linked to this user");
        setIsLinking(false);
        return;
      }

      // Check if trying to link to self
      if (linkData.user_id === session.user.id) {
        setError("You cannot link to yourself");
        setIsLinking(false);
        return;
      }

      console.log(`Creating caregiver link: caregiver=${session.user.id}, user=${linkData.user_id}`);

      // Step 3: Create link in caregiver_links table
      const { data: insertResult, error: caregiverLinkError } = await supabase
        .from('caregiver_links')
        .insert({
          caregiver_id: session.user.id,
          user_id: linkData.user_id
        })
        .select();

      console.log('Insert result:', insertResult, caregiverLinkError);

      if (caregiverLinkError) {
        throw caregiverLinkError;
      }

      toast({
        title: "Success",
        description: "Successfully linked to user"
      });
      setLinkCode("");
      onSuccess();
    } catch (error: any) {
      console.error('Error linking user:', error);
      setError(error.message || "Failed to link user. Please try again.");
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Link to a Person</CardTitle>
        <CardDescription>
          Enter the link code provided by the individual you want to support.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLinkUser}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-4">
            <Input
              placeholder="Enter link code (e.g., AB12CD34)"
              value={linkCode}
              onChange={e => setLinkCode(e.target.value)}
              className="flex-1"
              maxLength={8}
              disabled={isLinking}
            />
            <Button type="submit" disabled={isLinking || !linkCode.trim()}>
              {isLinking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Linking...
                </>
              ) : "Link User"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};
