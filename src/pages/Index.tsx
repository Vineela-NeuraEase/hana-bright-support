
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 space-y-8 animate-fade-up">
      <div className="text-center space-y-4 max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Welcome to Hana
        </h1>
        <p className="text-xl md:text-2xl text-gray-600">
          Your Second Brain for Autism Support
        </p>
      </div>
      
      <div className="w-full max-w-md space-y-4">
        <Button 
          className="w-full h-12 text-lg bg-primary hover:bg-primary/90 transition-all duration-300"
          onClick={() => navigate("/auth")}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
