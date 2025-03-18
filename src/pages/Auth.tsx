
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type UserRole = 'autistic' | 'caregiver' | 'clinician';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('autistic');

  const handleGuestAccess = () => {
    setLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      // Store the selected role in localStorage
      localStorage.setItem('userRole', selectedRole);
      
      toast({
        title: "Welcome",
        description: `You have been signed in as a ${selectedRole}.`,
      });
      
      navigate("/dashboard");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Hana</CardTitle>
          <CardDescription>
            Choose your role to continue as a guest
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <RadioGroup 
            value={selectedRole}
            onValueChange={(value) => setSelectedRole(value as UserRole)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted transition-all">
              <RadioGroupItem value="autistic" id="autistic" />
              <Label htmlFor="autistic" className="flex-grow cursor-pointer">Neurodivergent Individual</Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted transition-all">
              <RadioGroupItem value="caregiver" id="caregiver" />
              <Label htmlFor="caregiver" className="flex-grow cursor-pointer">Caregiver</Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted transition-all">
              <RadioGroupItem value="clinician" id="clinician" />
              <Label htmlFor="clinician" className="flex-grow cursor-pointer">Clinician</Label>
            </div>
          </RadioGroup>

          <Button 
            onClick={handleGuestAccess} 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Loading..." : "Continue as Guest"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
