
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UserPlus } from "lucide-react";
import { useAddCaregiverLink } from "@/hooks/useCaregiverLinks";
import { toast } from "sonner";

interface LinkCodeCardProps {
  session: any;
}

export const LinkCodeCard = ({ session }: LinkCodeCardProps) => {
  const [linkCode, setLinkCode] = useState("");
  const { mutate: addLink, isPending: isAddingLink } = useAddCaregiverLink();

  const handleSubmitLinkCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user.id || !linkCode.trim()) return;
    
    addLink({ linkCode: linkCode.trim(), caregiverId: session.user.id });
    setLinkCode("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserPlus className="mr-2 h-5 w-5" />
          Link with Individual
        </CardTitle>
        <CardDescription>
          Enter the link code provided by the individual to connect with them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitLinkCode} className="space-y-2">
          <Input
            placeholder="Enter link code"
            value={linkCode}
            onChange={e => setLinkCode(e.target.value)}
            maxLength={8}
          />
          <Button 
            type="submit" 
            disabled={!linkCode.trim() || isAddingLink}
            className="w-full"
          >
            {isAddingLink ? 
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...</> : 
              <>Connect</>
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
