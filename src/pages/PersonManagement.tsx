
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define a simple interface for LinkedUser
interface LinkedUser {
  id: string;
  role: string;
  link_code?: string;
}

const PersonManagement = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile, loading } = useProfile(session);
  const [linkCode, setLinkCode] = useState("");
  const [linkedUsers, setLinkedUsers] = useState<LinkedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }

    if (profile && profile.role !== 'caregiver' && profile.role !== 'clinician') {
      navigate("/dashboard");
      return;
    }

    fetchLinkedUsers();
  }, [session, profile, navigate]);

  const fetchLinkedUsers = async () => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      // Get all users this caregiver is linked to
      const { data: links, error: linksError } = await supabase
        .from('caregiver_links')
        .select('user_id')
        .eq('caregiver_id', session.user.id);

      if (linksError) throw linksError;

      if (links && links.length > 0) {
        // Get profiles for all linked users
        const userIds = links.map(link => link.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);

        if (profilesError) throw profilesError;
        setLinkedUsers(profiles || []);
      } else {
        setLinkedUsers([]);
      }
    } catch (error) {
      console.error('Error fetching linked users:', error);
      toast.error("Failed to load linked users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!linkCode.trim() || !session) return;
    
    setIsLinking(true);
    try {
      // Find the user with this link code
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('link_code', linkCode)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        toast.error("No user found with that link code");
        return;
      }

      // Create link in caregiver_links table
      const { error: linkError } = await supabase
        .from('caregiver_links')
        .insert({
          caregiver_id: session.user.id,
          user_id: data.id
        });

      if (linkError) {
        // Check if it's a duplicate link error
        if (linkError.code === '23505') { // Unique constraint violation
          toast.error("You are already linked to this user");
        } else {
          throw linkError;
        }
      } else {
        toast.success(`Successfully linked to user`);
        setLinkCode("");
        fetchLinkedUsers();
      }
    } catch (error: any) {
      console.error('Error linking user:', error);
      toast.error(error.message || "Failed to link user");
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlinkUser = async (userId: string) => {
    if (!session) return;
    
    try {
      const { error } = await supabase
        .from('caregiver_links')
        .delete()
        .eq('caregiver_id', session.user.id)
        .eq('user_id', userId);

      if (error) throw error;
      
      toast.success("User unlinked successfully");
      fetchLinkedUsers();
    } catch (error) {
      console.error('Error unlinking user:', error);
      toast.error("Failed to unlink user");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Person Management</h1>

      {/* Link New User Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Link to a Person</CardTitle>
          <CardDescription>
            Enter the 8-character link code provided by the individual you want to support.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLinkUser}>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter link code (e.g., AB12CD34)"
                value={linkCode}
                onChange={e => setLinkCode(e.target.value)}
                className="flex-1"
                maxLength={8}
              />
              <Button type="submit" disabled={isLinking || !linkCode.trim()}>
                {isLinking ? "Linking..." : "Link User"}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>

      {/* My Link Code Card - showing the caregiver's own link code */}
      {profile && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Link Code</CardTitle>
            <CardDescription>
              Share this code with others if you want them to link to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-md font-mono text-center text-lg">
              {profile.link_code || "No link code available"}
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Keep this code private and only share with trusted individuals.
          </CardFooter>
        </Card>
      )}

      {/* Linked Users */}
      <h2 className="text-2xl font-semibold mb-4">Linked People</h2>
      
      {isLoading ? (
        <div className="text-center p-8">Loading linked people...</div>
      ) : linkedUsers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {linkedUsers.map(user => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{user.role?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{user.role}</CardTitle>
                    <CardDescription className="text-xs">
                      Link Code: {user.link_code || 'N/A'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/dashboard?viewAs=${user.id}`)}
                >
                  View Dashboard
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleUnlinkUser(user.id)}
                >
                  Unlink
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            You haven't linked to any people yet. Use a link code to connect with someone.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonManagement;
