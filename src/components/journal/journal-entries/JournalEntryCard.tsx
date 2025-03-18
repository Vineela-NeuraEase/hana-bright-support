
import { Card } from "@/components/ui/card";
import { JournalEntry } from "@/types/journal";
import { JournalEntryHeader } from "./JournalEntryHeader";
import { JournalEntryContent } from "./JournalEntryContent";
import { JournalEntryActions } from "./JournalEntryActions";

interface JournalEntryCardProps {
  entry: JournalEntry;
  onDelete: (id: string) => void;
  isMobile?: boolean;
}

export const JournalEntryCard = ({ entry, onDelete, isMobile }: JournalEntryCardProps) => {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this journal entry?")) {
      onDelete(entry.id);
    }
  };

  return (
    <Card key={entry.id}>
      <JournalEntryHeader 
        mood={entry.mood_rating} 
        timestamp={entry.timestamp} 
      />
      
      <JournalEntryContent 
        text={entry.journal_text}
        sentiment={entry.sentiment}
        factors={entry.factors}
        id={entry.id}
      />
      
      <JournalEntryActions onDelete={handleDelete} isMobile={isMobile} />
    </Card>
  );
};
