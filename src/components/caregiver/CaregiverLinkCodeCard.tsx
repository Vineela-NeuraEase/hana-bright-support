
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InfoIcon } from "lucide-react";

interface CaregiverLinkCodeCardProps {
  linkCode: string;
  setLinkCode: (value: string) => void;
  isLinking: boolean;
  handleLinkUser: () => void;
}

export const CaregiverLinkCodeCard: React.FC<CaregiverLinkCodeCardProps> = ({ 
  linkCode, 
  setLinkCode, 
  isLinking, 
  handleLinkUser 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Link with a User</CardTitle>
        <CardDescription>Enter the user's link code to connect</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Enter link code"
            value={linkCode}
            onChange={(e) => setLinkCode(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleLinkUser} 
            disabled={!linkCode.trim() || isLinking}
          >
            {isLinking ? "Linking..." : "Link"}
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground flex items-center">
          <InfoIcon className="h-3 w-3 mr-1" />
          <span>Ask the user to share their unique link code with you</span>
        </div>
      </CardContent>
    </Card>
  );
};
