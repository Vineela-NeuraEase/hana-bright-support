
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGuestAccess = () => {
    setLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      toast({
        title: "Welcome",
        description: "You have been signed in as a guest user.",
      });
      
      navigate("/dashboard");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome to Hana</h2>
          <p className="text-muted-foreground mt-2">
            Authentication has been temporarily disabled.
            Continue as a guest to explore the app.
          </p>
        </div>

        <Button 
          onClick={handleGuestAccess} 
          className="w-full" 
          disabled={loading}
        >
          {loading ? "Loading..." : "Continue as Guest"}
        </Button>
      </div>
    </div>
  );
};

export default Auth;
