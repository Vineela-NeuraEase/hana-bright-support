import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from '@/components/ThemeProvider';
import { FirebaseAuthProvider } from '@/components/FirebaseAuthProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import Home from './pages/Home';
import Auth from './pages/Auth'; 
import FirebaseAuth from './pages/FirebaseAuth';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Schedule from './pages/Schedule';
import Journal from './pages/Journal';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import CaregiverDashboard from './pages/CaregiverDashboard';
import ToolsIndex from './pages/tools/Index';
import Formalizer from './pages/tools/Formalizer';
import Judge from './pages/tools/Judge';

// We're keeping this simple since this is just an update to the authentication method
function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="hana-theme">
      <FirebaseAuthProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Use Firebase Auth instead of the Supabase Auth */}
              <Route path="/auth" element={<FirebaseAuth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/caregiver" element={<CaregiverDashboard />} />
              <Route path="/tools" element={<ToolsIndex />} />
              <Route path="/tools/formalizer" element={<Formalizer />} />
              <Route path="/tools/judge" element={<Judge />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </ErrorBoundary>
        </BrowserRouter>
      </FirebaseAuthProvider>
    </ThemeProvider>
  );
}

export default App;
