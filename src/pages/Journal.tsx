
import { useState } from "react";
import { useJournalEntries } from "@/hooks/useJournal";
import { JournalForm } from "@/components/journal/JournalForm";
import { JournalEntriesList } from "@/components/journal/JournalEntriesList";
import { MoodTrendChart } from "@/components/journal/MoodTrendChart";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Navigate } from "react-router-dom";

const Journal = () => {
  const { session } = useAuth();
  const [showForm, setShowForm] = useState(true);
  const { data: entries = [], isLoading, error } = useJournalEntries();

  // Redirect if not logged in
  if (!session) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Journal</h1>
          {!showForm ? (
            <Button onClick={() => setShowForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              <X className="mr-2 h-4 w-4" />
              Close Form
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          Track your moods and journal your thoughts to gain insight into your emotional patterns.
        </p>
      </div>

      {showForm && <JournalForm />}
      
      <MoodTrendChart entries={entries} />

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Loading journal entries...</p>
        </div>
      ) : error ? (
        <div className="text-center p-4 text-destructive">
          Error loading journal entries
        </div>
      ) : (
        <JournalEntriesList entries={entries} />
      )}
    </div>
  );
};

export default Journal;
