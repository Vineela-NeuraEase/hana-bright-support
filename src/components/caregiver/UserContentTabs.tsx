
import { JournalEntry } from "@/types/journal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { JournalEntryCard } from "@/components/journal/journal-entries/JournalEntryCard";
import { Loader2 } from "lucide-react";
import { useLinkedUserJournalEntries } from "@/hooks/useLinkedUserJournalEntries";

interface UserContentTabsProps {
  userId: string;
}

export const UserContentTabs = ({ userId }: UserContentTabsProps) => {
  const { data: linkedUserJournalEntries, isLoading: entriesLoading } = useLinkedUserJournalEntries(userId);

  return (
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
            <div className="text-center py-8 text-muted-foreground">
              Schedule functionality coming soon
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
