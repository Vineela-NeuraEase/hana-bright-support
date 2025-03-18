
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon } from "lucide-react";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";

const Settings = () => {
  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="flex items-center mb-6">
        <SettingsIcon className="h-6 w-6 mr-2 text-primary" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <div className="text-muted-foreground">
            Account settings have been disabled as authentication is in guest mode.
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationPreferences />
        </TabsContent>
        
        <TabsContent value="appearance">
          <div className="text-muted-foreground">
            Appearance settings will be available soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
