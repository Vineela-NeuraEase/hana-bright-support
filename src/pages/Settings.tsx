
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon } from "lucide-react";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";
import { MyLinkCode } from "@/components/people/MyLinkCode";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";

const Settings = () => {
  const { session } = useAuth();
  const { profile } = useProfile(session);

  // Debug the profile data
  console.log("Settings profile:", profile);

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="flex items-center mb-6">
        <SettingsIcon className="h-6 w-6 mr-2 text-primary" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationPreferences />
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4">
          {profile && <MyLinkCode profile={profile} />}
          <div className="text-muted-foreground">
            More account settings will be available soon.
          </div>
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
