
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AccessDeniedCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader className="text-center">
        <AlertCircleIcon className="h-12 w-12 mx-auto text-destructive mb-2" />
        <CardTitle>Access Denied</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-4">
          You don't have permission to access this page. 
          This dashboard is only available for users with the caregiver role.
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          Return to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};
