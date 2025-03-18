import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useJournalEntries } from "@/hooks/useJournal";
import { useEvents } from "@/hooks/useEvents";
import { useTasks } from "@/hooks/tasks/useTasks";
import { JournalEntriesList } from "@/components/journal/journal-entries/JournalEntriesList";
import { SentimentSummary } from "@/components/journal/SentimentSummary";
import { CalendarIcon, CheckSquareIcon, BookTextIcon } from "lucide-react";
import { DayView } from "@/components/schedule/DayView";
import { Skeleton } from "@/components/ui/skeleton";
import { addDays } from "date-fns";

interface UserContentTabsProps {
  userId: string;
}

export const UserContentTabs: React.FC<UserContentTabsProps> = ({ userId }) => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  
  // Fetch journal entries for the selected user
  const { 
    data: journalEntries = [], 
    isLoading: journalLoading 
  } = useJournalEntries(userId);
  
  // Fetch events for the selected user
  const { 
    events, 
    isLoading: eventsLoading 
  } = useEvents(userId);
  
  // Fetch tasks for the selected user
  const { 
    tasks = [], 
    isLoading: tasksLoading 
  } = useTasks({userId: userId});  // Fixed by passing object with userId property

  return (
    <Tabs defaultValue="journal" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="journal" className="flex items-center">
          <BookTextIcon className="h-4 w-4 mr-2" />
          Journal & Mood
        </TabsTrigger>
        <TabsTrigger value="schedule" className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Schedule
        </TabsTrigger>
        <TabsTrigger value="tasks" className="flex items-center">
          <CheckSquareIcon className="h-4 w-4 mr-2" />
          Tasks
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="journal" className="space-y-4">
        {journalLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mood Overview</CardTitle>
                <CardDescription>Recent mood trends and sentiment analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <SentimentSummary entries={journalEntries} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Journal Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <JournalEntriesList 
                  entries={journalEntries}
                  isMobile={false}
                />
              </CardContent>
            </Card>
          </>
        )}
      </TabsContent>
      
      <TabsContent value="schedule">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule</CardTitle>
            <CardDescription>Upcoming events and appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <DayView
                events={events}
                selectedDate={selectedDate}
                onAddEvent={() => {}}  // Read-only for caregivers
                isLoading={false}
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="tasks">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tasks</CardTitle>
            <CardDescription>View assigned tasks and progress</CardDescription>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tasks found
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="p-3 border rounded-md">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        task.status === 'done' ? 'bg-green-500' : 
                        task.status === 'in-progress' ? 'bg-yellow-500' : 
                        'bg-gray-300'
                      }`} />
                      <div>
                        <p className="font-medium">{task.title}</p>
                        {task.due_date && (
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
