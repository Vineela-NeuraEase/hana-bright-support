
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const AccessDeniedCard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>You must be a caregiver to view this page.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
