
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LinkCodeSettings } from "@/components/settings/LinkCodeSettings";

const Settings = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  if (!session) {
    navigate("/auth");
    return null;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        {/* Link code settings */}
        <LinkCodeSettings userId={session.user.id} />
        
        {/* Notification preferences */}
        <NotificationPreferences />
        
        {/* Account management section */}
        <Card>
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-md font-medium">Sign out</h3>
                <p className="text-sm text-muted-foreground">
                  Sign out from your current session
                </p>
              </div>
              <Button variant="destructive" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
