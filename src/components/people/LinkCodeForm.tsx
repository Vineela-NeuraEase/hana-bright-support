
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LinkCodeFormProps {
  session: Session | null;
  onSuccess: () => void;
}

export const LinkCodeForm = ({ session, onSuccess }: LinkCodeFormProps) => {
  const [linkCode, setLinkCode] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const { toast } = useToast();

  const handleLinkUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!linkCode.trim() || !session) return;
    
    setIsLinking(true);
    try {
      console.log("Attempting to link with code:", linkCode);
      
      // Step 1: Find the user with this link code
      const { data: linkData, error: linkError } = await supabase
        .from('user_links')
        .select('user_id')
        .eq('link_code', linkCode)
        .maybeSingle();

      console.log("User lookup result:", linkData, linkError);

      if (linkError) {
        throw linkError;
      }

      if (!linkData || !linkData.user_id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No user found with that link code"
        });
        setIsLinking(false);
        return;
      }

      // Step 2: Check if this link already exists
      const { data: existingLink, error: existingLinkError } = await supabase
        .from('caregiver_links')
        .select('*')
        .eq('caregiver_id', session.user.id)
        .eq('user_id', linkData.user_id)
        .maybeSingle();
        
      console.log("Existing link check:", existingLink, existingLinkError);
      
      if (existingLink) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You are already linked to this user"
        });
        setIsLinking(false);
        return;
      }

      // Step 3: Create link in caregiver_links table
      const { data: newLink, error: caregiverLinkError } = await supabase
        .from('caregiver_links')
        .insert({
          caregiver_id: session.user.id,
          user_id: linkData.user_id
        })
        .select();

      console.log("New link creation result:", newLink, caregiverLinkError);

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
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to link user"
      });
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
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter link code (e.g., AB12CD34)"
              value={linkCode}
              onChange={e => setLinkCode(e.target.value)}
              className="flex-1"
              maxLength={8}
            />
            <Button type="submit" disabled={isLinking || !linkCode.trim()}>
              {isLinking ? "Linking..." : "Link User"}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};
