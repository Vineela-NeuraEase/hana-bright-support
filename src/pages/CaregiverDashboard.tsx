import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCaregiverLinks, useAddCaregiverLink, useUserLinkCode, useRemoveCaregiverLink } from "@/hooks/useCaregiverLinks";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { Loader2, UserPlus, LinkIcon, Users, Trash2 } from "lucide-react";
import { CaregiverLink } from "@/types/caregiver";
import { useLinkedUserJournalEntries } from "@/hooks/useLinkedUserJournalEntries";
import { JournalEntryCard } from "@/components/journal/journal-entries/JournalEntryCard";
import { toast } from "sonner";

const CaregiverDashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile, loading: profileLoading } = useProfile(session);
  const [linkCode, setLinkCode] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Check if user is a caregiver
  if (profile && profile.role !== 'caregiver') {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You must be a caregiver to view this page.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Fetch caregiver's link code for sharing
  const { data: userLinkCode, isLoading: linkCodeLoading } = useUserLinkCode(session?.user.id);
  
  // Fetch existing caregiver links
  const { data: caregiverLinks, isLoading: linksLoading } = useCaregiverLinks(session?.user.id);
  
  // Add a new caregiver link
  const { mutate: addLink, isPending: isAddingLink } = useAddCaregiverLink();
  
  // Remove a caregiver link
  const { mutate: removeLink, isPending: isRemovingLink } = useRemoveCaregiverLink();

  // Fetch journal entries for the selected linked user
  const { data: linkedUserJournalEntries, isLoading: entriesLoading } = useLinkedUserJournalEntries(selectedUserId || undefined);

  const handleSubmitLinkCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user.id || !linkCode.trim()) return;
    
    addLink({ linkCode: linkCode.trim(), caregiverId: session.user.id });
    setLinkCode("");
  };

  const handleRemoveLink = (link: CaregiverLink) => {
    if (isRemovingLink) return;
    
    if (window.confirm("Are you sure you want to remove this link?")) {
      removeLink({ 
        linkId: link.id, 
        caregiverId: session?.user.id || '' 
      });
      
      // If this was the selected user, clear selection
      if (link.user_id === selectedUserId) {
        setSelectedUserId(null);
      }
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId === selectedUserId ? null : userId);
  };

  if (profileLoading || linksLoading) {
    return (
      <div className="container py-8 max-w-4xl mx-auto flex justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Caregiver Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar - User list and linking */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="mr-2 h-5 w-5" />
                Link with Individual
              </CardTitle>
              <CardDescription>
                Enter the link code provided by the individual to connect with them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitLinkCode} className="space-y-2">
                <Input
                  placeholder="Enter link code"
                  value={linkCode}
                  onChange={e => setLinkCode(e.target.value)}
                  maxLength={8}
                />
                <Button 
                  type="submit" 
                  disabled={!linkCode.trim() || isAddingLink}
                  className="w-full"
                >
                  {isAddingLink ? 
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...</> : 
                    <>Connect</>
                  }
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LinkIcon className="mr-2 h-5 w-5" />
                Your Link Code
              </CardTitle>
              <CardDescription>
                Share this code if you need to be linked as an individual.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {linkCodeLoading ? (
                <div className="flex justify-center">
                  <Loader2 className="animate-spin h-4 w-4" />
                </div>
              ) : userLinkCode ? (
                <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                  <span className="font-mono font-bold">{userLinkCode}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(userLinkCode);
                      toast.success("Link code copied to clipboard");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">No link code available</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Linked Individuals
              </CardTitle>
              <CardDescription>
                Individuals you are connected with.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {caregiverLinks?.length ? (
                <ul className="space-y-2">
                  {caregiverLinks.map(link => (
                    <li 
                      key={link.id} 
                      className={`
                        flex justify-between items-center p-3 rounded-md cursor-pointer
                        ${selectedUserId === link.user_id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}
                      `}
                      onClick={() => handleSelectUser(link.user_id)}
                    >
                      <span>User {link.user_id.substring(0, 8)}...</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className={`${selectedUserId === link.user_id ? 'hover:bg-primary/90' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLink(link);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No linked individuals yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right panel - Content for selected user */}
        <div className="md:col-span-2">
          {selectedUserId ? (
            <Tabs defaultValue="journal">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="journal">Journal</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
              
              <TabsContent value="journal" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Journal Entries</CardTitle>
                    <CardDescription>
                      View journal entries for this individual
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {entriesLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin h-8 w-8" />
                      </div>
                    ) : linkedUserJournalEntries?.length ? (
                      <div className="space-y-4">
                        {linkedUserJournalEntries.map(entry => (
                          <JournalEntryCard key={entry.id} entry={entry} isCaregiver={true} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No journal entries found
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tasks" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tasks</CardTitle>
                    <CardDescription>
                      View and monitor tasks for this individual
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Task content will be implemented later */}
                    <div className="text-center py-8 text-muted-foreground">
                      Tasks functionality coming soon
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule</CardTitle>
                    <CardDescription>
                      View upcoming events for this individual
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Schedule content will be implemented later */}
                    <div className="text-center py-8 text-muted-foreground">
                      Schedule functionality coming soon
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-full flex items-center justify-center py-12">
              <CardContent className="text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No User Selected</h3>
                <p className="text-muted-foreground max-w-md">
                  Select a linked individual from the sidebar to view their journal entries, tasks, and schedule.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboard;
