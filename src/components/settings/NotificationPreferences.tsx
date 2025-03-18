
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LocalNotifications } from '@capacitor/local-notifications';
import { NotificationService } from "@/services/NotificationService";
import { useToast } from "@/hooks/use-toast";

export const NotificationPreferences = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>("unknown");
  const { toast } = useToast();

  // Check notification permission on component mount
  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    try {
      const permissionStatus = await LocalNotifications.checkPermissions();
      setPermissionStatus(permissionStatus.display);
      setNotificationsEnabled(permissionStatus.display === 'granted');
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      setPermissionStatus('error');
    }
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    try {
      if (enabled) {
        const permissionStatus = await LocalNotifications.requestPermissions();
        
        if (permissionStatus.display === 'granted') {
          setNotificationsEnabled(true);
          setPermissionStatus('granted');
          
          toast({
            title: "Notifications enabled",
            description: "You will now receive reminders for your scheduled events",
          });
          
          // Re-initialize the notification service
          await NotificationService.initialize();
        } else {
          setNotificationsEnabled(false);
          setPermissionStatus(permissionStatus.display);
          
          toast({
            title: "Permission denied",
            description: "Please enable notifications in your device settings to receive reminders",
            variant: "destructive",
          });
        }
      } else {
        setNotificationsEnabled(false);
        
        toast({
          title: "Notifications disabled",
          description: "You will no longer receive reminders for your events",
        });
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Manage how and when you receive notifications for your scheduled events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <div>
            <Label htmlFor="event-notifications" className="font-medium">
              Event Reminders
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications before your scheduled events
            </p>
          </div>
          <Switch
            id="event-notifications"
            checked={notificationsEnabled}
            onCheckedChange={handleToggleNotifications}
          />
        </div>
        
        {permissionStatus !== 'granted' && permissionStatus !== 'unknown' && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Notifications are {permissionStatus}
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    To receive event reminders, please enable notifications for this app in your device settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
