
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Auth from "./pages/Auth"; 
import ToolsDirectory from "./pages/tools/Index";
import FormalizerPage from "./pages/tools/Formalizer";
import JudgePage from "./pages/tools/Judge";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./components/AuthProvider";
import { MainNavBar } from "./components/layout/MainNavBar";
import { supabase } from "./integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Create a client
const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      <MainNavBar onSignOut={handleSignOut} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/tools" element={<ToolsDirectory />} />
        <Route path="/tools/formalizer" element={<FormalizerPage />} />
        <Route path="/tools/judge" element={<JudgePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Simple NotFound component for 404 pages
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default App;
