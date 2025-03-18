
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LinkCodeFormProps {
  session: Session | null;
  onSuccess: () => void;
}

export const LinkCodeForm = ({ session, onSuccess }: LinkCodeFormProps) => {
  const [linkCode, setLinkCode] = useState("");
  const [isLinking, setIsLinking] = useState(false);

  const handleLinkUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!linkCode.trim() || !session) return;
    
    setIsLinking(true);
    try {
      // Find the user with this link code
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('link_code', linkCode)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        toast.error("No user found with that link code");
        return;
      }

      // Create link in caregiver_links table
      const { error: linkError } = await supabase
        .from('caregiver_links')
        .insert({
          caregiver_id: session.user.id,
          user_id: data.id
        });

      if (linkError) {
        // Check if it's a duplicate link error
        if (linkError.code === '23505') { // Unique constraint violation
          toast.error("You are already linked to this user");
        } else {
          throw linkError;
        }
      } else {
        toast.success(`Successfully linked to user`);
        setLinkCode("");
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error linking user:', error);
      toast.error(error.message || "Failed to link user");
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Link to a Person</CardTitle>
        <CardDescription>
          Enter the 8-character link code provided by the individual you want to support.
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
