
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";

interface JournalHeaderProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  isMobile: boolean;
}

export const JournalHeader = ({ showForm, setShowForm, isMobile }: JournalHeaderProps) => {
  if (isMobile) {
    return (
      <div className="flex items-center justify-end mb-4">
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
    );
  }

  return (
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
  );
};
