
import { Link, Routes, Route } from "react-router-dom";
import { RadioTower } from "lucide-react";
import ToolsDirectory from "@/pages/tools/Index";
import FormalizerPage from "@/pages/tools/Formalizer";
import JudgePage from "@/pages/tools/Judge";

interface DashboardContentProps {
  welcomeMessage: string;
}

export const DashboardContent = ({ welcomeMessage }: DashboardContentProps) => {
  return (
    <div className="flex-1 px-4 py-8">
      <Routes>
        <Route path="/" element={
          <div>
            <h1 className="text-2xl font-bold mb-6">{welcomeMessage}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/dashboard/tools" className="block">
                <div className="p-4 border rounded-lg hover:bg-muted transition-colors flex items-center gap-3">
                  <RadioTower className="h-6 w-6 text-primary" />
                  <div>
                    <h2 className="font-medium">Communication Tools</h2>
                    <p className="text-sm text-muted-foreground">Access tools for communication support</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        } />
        <Route path="tools" element={<ToolsDirectory />} />
        <Route path="tools/formalizer" element={<FormalizerPage />} />
        <Route path="tools/judge" element={<JudgePage />} />
      </Routes>
    </div>
  );
};
