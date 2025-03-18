
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
      // Find the user with this link code
      const { data: linkData, error: linkError } = await supabase
        .from('user_links')
        .select('user_id')
        .eq('link_code', linkCode)
        .maybeSingle();

      if (linkError) {
        throw linkError;
      }

      if (!linkData) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No user found with that link code"
        });
        return;
      }

      // Create link in caregiver_links table
      const { error: caregiverLinkError } = await supabase
        .from('caregiver_links')
        .insert({
          caregiver_id: session.user.id,
          user_id: linkData.user_id
        });

      if (caregiverLinkError) {
        // Check if it's a duplicate link error
        if (caregiverLinkError.code === '23505') { // Unique constraint violation
          toast({
            variant: "destructive",
            title: "Error",
            description: "You are already linked to this user"
          });
        } else {
          throw caregiverLinkError;
        }
      } else {
        toast({
          title: "Success",
          description: "Successfully linked to user"
        });
        setLinkCode("");
        onSuccess();
      }
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
