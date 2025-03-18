
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserIcon } from "lucide-react";

export const NoUserSelected: React.FC = () => {
  return (
    <Card className="h-full flex items-center justify-center border-dashed">
      <CardContent className="text-center p-6">
        <UserIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <CardTitle className="text-lg mb-2">No User Selected</CardTitle>
        <p className="text-muted-foreground">
          Please select a linked user from the list to view their information
        </p>
      </CardContent>
    </Card>
  );
};
