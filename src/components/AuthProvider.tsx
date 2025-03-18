
// This file re-exports from the refactored location to maintain backwards compatibility
import { AuthProvider } from "@/contexts/auth/AuthProvider";
import { useAuth } from "@/hooks/useAuth";

export { AuthProvider, useAuth };
