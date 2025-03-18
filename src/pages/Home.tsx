
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      <div className="text-center space-y-4 max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Welcome to Hannah
        </h1>
        <p className="text-xl md:text-2xl text-gray-600">
          Your Second Brain for Autism Support
        </p>
        <p className="text-gray-500">
          Hannah is designed to revolutionize autism support by seamlessly integrating executive function tools, AI-driven assistants, and therapy techniques into one irreplaceable "second brain."
        </p>
      </div>
      
      <div className="w-full max-w-md space-y-4">
        <Button 
          className="w-full h-12 text-lg bg-primary hover:bg-primary/90 transition-all duration-300 mb-3"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Button>
        
        <Button 
          variant="outline"
          className="w-full h-12 text-lg transition-all duration-300"
          onClick={() => navigate("/tasks")}
        >
          View Tasks
        </Button>
      </div>
    </div>
  );
};

export default Home;
