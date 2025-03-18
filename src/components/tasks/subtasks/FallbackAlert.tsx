
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface FallbackAlertProps {
  error: string;
}

export const FallbackAlert = ({ error }: FallbackAlertProps) => {
  return (
    <Alert variant="destructive" className="mt-3 mb-3">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>AI Service Limited</AlertTitle>
      <AlertDescription>
        Using simplified breakdown due to AI service limitation: {error}
      </AlertDescription>
    </Alert>
  );
};
