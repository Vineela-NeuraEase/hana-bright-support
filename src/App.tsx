
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './components/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { MainLayout } from './components/layout/MainLayout';
import { ErrorBoundary } from './components/ErrorBoundary';

// Implement lazy loading to improve performance
const Home = lazy(() => import('./pages/Home'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Journal = lazy(() => import('./pages/Journal'));
const FormalizerTool = lazy(() => import('./pages/tools/Formalizer'));
const JudgeTool = lazy(() => import('./pages/tools/Judge'));
const ToolsIndex = lazy(() => import('./pages/tools/Index'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CaregiverDashboard = lazy(() => import('./pages/CaregiverDashboard'));

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="hana-ui-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ErrorBoundary>
              <Suspense fallback={<div className="p-8">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/caregiver" element={<CaregiverDashboard />} />
                    <Route path="/tools" element={<ToolsIndex />} />
                    <Route path="/tools/formalizer" element={<FormalizerTool />} />
                    <Route path="/tools/judge" element={<JudgeTool />} />
                  </Route>
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
          <Toaster position="top-right" />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
