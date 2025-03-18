
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface PermissionAlertProps {
  onRequestPermission: () => Promise<void>;
}

export const PermissionAlert = ({ onRequestPermission }: PermissionAlertProps) => {
  return (
    <Alert className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Notification permission required</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          To receive event reminders, please allow notifications for this app.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-fit" 
          onClick={onRequestPermission}
        >
          Enable Notifications
        </Button>
      </AlertDescription>
    </Alert>
  );
};
