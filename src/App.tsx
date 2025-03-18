
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import { MainLayout } from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Journal from "@/pages/Journal";
import Settings from "@/pages/Settings";
import Tasks from "@/pages/Tasks";
import Schedule from "@/pages/Schedule";
import Auth from "@/pages/Auth";
import CaregiverDashboard from "@/pages/CaregiverDashboard";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";

// Import tool pages
import ToolsDirectory from "@/pages/tools/Index";
import FormalizerPage from "@/pages/tools/Formalizer";
import JudgePage from "@/pages/tools/Judge";

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                {/* Redirect auth to dashboard since we're in guest mode */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/tools" element={<ToolsDirectory />} />
                <Route path="/dashboard/tools/formalizer" element={<FormalizerPage />} />
                <Route path="/dashboard/tools/judge" element={<JudgePage />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/tools" element={<ToolsDirectory />} />
                <Route path="/tools/formalizer" element={<FormalizerPage />} />
                <Route path="/tools/judge" element={<JudgePage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/caregiver" element={<CaregiverDashboard />} />
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
